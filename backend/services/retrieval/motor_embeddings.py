import os
import re
import numpy as np
import chromadb
from sentence_transformers import SentenceTransformer, CrossEncoder
from rank_bm25 import BM25Okapi
from backend.services.knowledge.base_conocimiento import KnowledgeBase
from backend.config.settings import BASE_DIR

class HybridRetrievalEngine:
    """
    Motor Híbrido con ChromaDB:
    1. Base de Datos Vectorial Persistente (ChromaDB)
    2. Búsqueda Lexical (BM25)
    3. Fusión (RRF) y Re-Ranking (Cross-Encoder)
    """
    def __init__(self):
        # Modelos
        self.modelo_semantico = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
        self.cross_encoder = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
        
        # Configurar ChromaDB
        db_path = os.path.join(BASE_DIR, "data", "chroma_db")
        os.makedirs(db_path, exist_ok=True)
        self.chroma_client = chromadb.PersistentClient(path=db_path)
        
        # Colección (crea o recupera)
        self.collection = self.chroma_client.get_or_create_collection(name="conocimiento_unsaac")
        
        self.bm25 = None
        self.corpus_ids = []
        self.corpus_preguntas = []
        self.corpus_respuestas = []
        self.corpus_categorias = []
        
        # Carga inicial o sincronización
        self.sincronizar_conocimiento()

    def _tokenizar(self, texto):
        return [t.lower() for t in re.findall(r'\w+', texto)]

    def sincronizar_conocimiento(self):
        """Sincroniza la BD relacional (SQLite) con ChromaDB y reconstruye BM25."""
        filas = KnowledgeBase.obtener_todo()
        if not filas:
            print("Advertencia: No hay datos en la base de datos.")
            return

        # Limpiar listas en memoria para BM25
        self.corpus_ids = []
        self.corpus_preguntas = []
        self.corpus_respuestas = []
        self.corpus_categorias = []
        corpus_tokenizado = []

        # Preparar datos para Chroma
        ids_chroma = []
        documentos_chroma = []
        metadatos_chroma = []
        embeddings_chroma = []

        # Obtener los IDs ya existentes en Chroma para no re-vectorizar todo si no es necesario
        # Por simplicidad en el prototipo, upsert actualizará o insertará
        for i, fila in enumerate(filas):
            doc_id = f"doc_{i}"
            pregunta = fila["pregunta"]
            respuesta_base = fila["respuesta"]
            categoria = fila["categoria"]
            
            # Enriquecer la respuesta con metadatos si existen
            respuesta = respuesta_base
            enlace_url = fila["enlace_url"] if "enlace_url" in fila.keys() else None
            fuente = fila["fuente"] if "fuente" in fila.keys() else None
            
            if enlace_url or fuente:
                respuesta += "\n\n**Más Información:**\n"
                if enlace_url:
                    enlace_texto = fila["enlace_texto"] if "enlace_texto" in fila.keys() and fila["enlace_texto"] else "Enlace oficial"
                    respuesta += f"- [{enlace_texto}]({enlace_url})\n"
                if fuente:
                    respuesta += f"- Fuente: {fuente}\n"
            
            # Guardar en memoria (Para BM25 y acceso rápido a respuestas)
            self.corpus_ids.append(doc_id)
            self.corpus_preguntas.append(pregunta)
            self.corpus_respuestas.append(respuesta)
            self.corpus_categorias.append(categoria)
            corpus_tokenizado.append(self._tokenizar(pregunta))

            # Para Chroma
            ids_chroma.append(doc_id)
            documentos_chroma.append(pregunta)
            metadatos_chroma.append({"respuesta": respuesta, "categoria": categoria})

        # Reconstruir BM25
        self.bm25 = BM25Okapi(corpus_tokenizado)
        
        # Upsert en ChromaDB (calcula embeddings automáticamente con nuestra función)
        # Convertimos a lista de listas para Chroma
        vectores = self.modelo_semantico.encode(documentos_chroma).tolist()
        
        self.collection.upsert(
            ids=ids_chroma,
            embeddings=vectores,
            documents=documentos_chroma,
            metadatas=metadatos_chroma
        )
        print("ChromaDB y BM25 sincronizados exitosamente.")

    def agregar_documento(self, pregunta: str, respuesta: str, categoria: str):
        """Añade un nuevo documento en tiempo real sin reiniciar el servidor."""
        KnowledgeBase.insertar(pregunta, respuesta, categoria)
        self.sincronizar_conocimiento()

    def buscar(self, consulta: str, top_k=5):
        if not self.corpus_ids:
            return {
                "pregunta": consulta,
                "respuesta": "Lo siento, mi base de conocimientos está vacía en este momento.",
                "categoria": "Error",
                "confianza": 0.0
            }

        # 1. Búsqueda Lexical (BM25)
        consulta_tokens = self._tokenizar(consulta)
        bm25_scores = self.bm25.get_scores(consulta_tokens)
        
        # 2. Búsqueda Semántica (ChromaDB)
        vector_consulta = self.modelo_semantico.encode(consulta).tolist()
        resultados_chroma = self.collection.query(
            query_embeddings=[vector_consulta],
            n_results=len(self.corpus_ids) # Traemos todos para fusionar con BM25
        )
        
        # Extraer IDs y distancias (L2 distance por defecto en Chroma)
        chroma_ids = resultados_chroma['ids'][0]
        chroma_distances = resultados_chroma['distances'][0]
        
        # Convertir L2 a similitud (invertir orden: menor distancia = mayor similitud)
        # Chroma devuelve ordenado de menor a mayor distancia.
        
        # 3. Reciprocal Rank Fusion (RRF)
        k_rrf = 60
        rrf_scores = np.zeros(len(self.corpus_ids))
        
        # Índices ordenados para BM25
        bm25_ranks = np.argsort(bm25_scores)[::-1]
        
        # Aplicar RRF para BM25
        for rank, doc_idx in enumerate(bm25_ranks):
            rrf_scores[doc_idx] += 1.0 / (k_rrf + rank + 1)
            
        # Aplicar RRF para Chroma (ya vienen ordenados por rank 0, 1, 2...)
        for rank, ch_id in enumerate(chroma_ids):
            # Encontrar el índice original en nuestras listas en memoria
            doc_idx = self.corpus_ids.index(ch_id)
            rrf_scores[doc_idx] += 1.0 / (k_rrf + rank + 1)
            
        # Obtener Top K absolutos
        top_k_indices = np.argsort(rrf_scores)[::-1][:top_k]
        
        # 4. Re-Ranking con Cross-Encoder
        pares_candidatos = [[consulta, self.corpus_preguntas[idx]] for idx in top_k_indices]
        cross_scores = self.cross_encoder.predict(pares_candidatos)
        
        mejor_idx_relativo = np.argmax(cross_scores)
        mejor_idx_absoluto = top_k_indices[mejor_idx_relativo]
        mejor_score = cross_scores[mejor_idx_relativo]
        
        # Confianza
        confianza = 1.0 / (1.0 + np.exp(-mejor_score))

        return {
            "pregunta": self.corpus_preguntas[mejor_idx_absoluto],
            "respuesta": self.corpus_respuestas[mejor_idx_absoluto],
            "categoria": self.corpus_categorias[mejor_idx_absoluto],
            "confianza": float(confianza)
        }

# Instancia global
motor_embeddings = HybridRetrievalEngine()
