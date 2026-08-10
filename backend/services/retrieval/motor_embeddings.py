import os
import re

os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

import numpy as np
import chromadb
from chromadb.errors import InternalError
from sentence_transformers import SentenceTransformer
from rank_bm25 import BM25Okapi
from backend.services.knowledge.base_conocimiento import KnowledgeBase
from backend.config.settings import BASE_DIR

class HybridRetrievalEngine:
    """
    Motor Híbrido con ChromaDB:
    1. Base de Datos Vectorial Persistente (ChromaDB)
    2. Búsqueda Lexical (BM25)
    3. Fusión (RRF) y Re-Ranking mediante similitud de coseno del Bi-Encoder
    """
    def __init__(self):
        # Modelos
        nombre_modelo = "paraphrase-multilingual-MiniLM-L12-v2"
        try:
            # Evita consultar Hugging Face en cada arranque si el modelo ya esta
            # en cache (especialmente util sin conexion o con firewall).
            self.modelo_semantico = SentenceTransformer(
                nombre_modelo,
                local_files_only=True,
            )
        except OSError:
            # En la primera ejecucion permite que sentence-transformers lo
            # descargue y lo deje disponible para los siguientes arranques.
            self.modelo_semantico = SentenceTransformer(nombre_modelo)
        
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

        # Obtener colección persistente
        self.collection = self.chroma_client.get_or_create_collection(name="conocimiento_unsaac")

        # Limpiar listas en memoria para BM25
        self.corpus_ids = []
        self.corpus_codigo_reglas = []
        self.corpus_preguntas = []
        self.corpus_respuestas = []
        self.corpus_categorias = []
        corpus_tokenizado = []

        # Preparar datos para Chroma
        ids_chroma = []
        documentos_chroma = []
        metadatos_chroma = []
        embeddings_chroma = []

        for i, fila in enumerate(filas):
            doc_id = f"doc_{i}"
            pregunta = fila["pregunta"]
            respuesta_base = fila["respuesta"]
            categoria = fila["categoria"]
            codigo_regla = fila["codigo_regla"] if "codigo_regla" in fila.keys() and fila["codigo_regla"] else f"REG-{i:03d}"
            
            # Enriquecer la respuesta con metadatos si existen
            respuesta = respuesta_base
            enlace_url = fila["enlace_url"] if "enlace_url" in fila.keys() else None
            fuente = fila["fuente"] if "fuente" in fila.keys() else None
            
            if enlace_url:
                enlace_texto = fila["enlace_texto"] if "enlace_texto" in fila.keys() and fila["enlace_texto"] else "Enlace oficial"
                respuesta += f"\n\n**A continuación te muestro más información en pantalla**\n\n[{enlace_texto}]({enlace_url})"
            
            # Guardar en memoria (Para BM25 y acceso rápido a respuestas)
            self.corpus_ids.append(doc_id)
            self.corpus_codigo_reglas.append(codigo_regla)
            self.corpus_preguntas.append(pregunta)
            self.corpus_respuestas.append(respuesta)
            self.corpus_categorias.append(categoria)
            corpus_tokenizado.append(self._tokenizar(pregunta))

            # Para Chroma
            ids_chroma.append(doc_id)
            documentos_chroma.append(pregunta)
            metadatos_chroma.append({"respuesta": respuesta, "categoria": categoria, "codigo_regla": codigo_regla})

        # Reconstruir BM25
        self.bm25 = BM25Okapi(corpus_tokenizado)
        
        # Upsert en ChromaDB (calcula embeddings automáticamente con nuestra función)
        vectores = self.modelo_semantico.encode(documentos_chroma).tolist()
        
        try:
            self.collection.upsert(
                ids=ids_chroma,
                embeddings=vectores,
                documents=documentos_chroma,
                metadatas=metadatos_chroma
            )

            # Quitar documentos que ya no existen en SQLite para que los
            # resultados de Chroma y las listas en memoria permanezcan alineados.
            ids_existentes = set(self.collection.get(include=[])["ids"])
            ids_obsoletos = list(ids_existentes - set(ids_chroma))
            if ids_obsoletos:
                self.collection.delete(ids=ids_obsoletos)
        except InternalError:
            # Un cierre abrupto o un cambio grande de corpus puede dejar el
            # indice HNSW ilegible. Chroma es solo un cache regenerable.
            self.chroma_client.delete_collection(name="conocimiento_unsaac")
            self.collection = self.chroma_client.create_collection(
                name="conocimiento_unsaac"
            )
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

    def buscar_top_k(self, consulta: str, top_k=5):
        """Devuelve una lista ordenada del Top-K de documentos recuperados por RAG con sus IDs de regla."""
        if not self.corpus_ids:
            return []

        # 1. Búsqueda Lexical (BM25)
        consulta_tokens = self._tokenizar(consulta)
        bm25_scores = self.bm25.get_scores(consulta_tokens)
        
        # 2. Búsqueda Semántica (ChromaDB)
        vector_consulta = self.modelo_semantico.encode(consulta).tolist()
        try:
            resultados_chroma = self.collection.query(
                query_embeddings=[vector_consulta],
                n_results=len(self.corpus_ids)
            )
        except Exception:
            self.collection = self.chroma_client.get_or_create_collection(name="conocimiento_unsaac")
            resultados_chroma = self.collection.query(
                query_embeddings=[vector_consulta],
                n_results=len(self.corpus_ids)
            )
        
        chroma_ids = resultados_chroma['ids'][0]
        
        # 3. Reciprocal Rank Fusion (RRF)
        k_rrf = 60
        rrf_scores = np.zeros(len(self.corpus_ids))
        
        bm25_ranks = np.argsort(bm25_scores)[::-1]
        for rank, doc_idx in enumerate(bm25_ranks):
            rrf_scores[doc_idx] += 1.0 / (k_rrf + rank + 1)
            
        for rank, ch_id in enumerate(chroma_ids):
            doc_idx = self.corpus_ids.index(ch_id)
            rrf_scores[doc_idx] += 1.0 / (k_rrf + rank + 1)
            
        top_k_indices = np.argsort(rrf_scores)[::-1][:top_k]
        
        # 4. Re-Ranking con Bi-Encoder
        preguntas_candidatas = [self.corpus_preguntas[idx] for idx in top_k_indices]
        embeddings_candidatas = self.modelo_semantico.encode(preguntas_candidatas)
        vector_consulta = self.modelo_semantico.encode(consulta)
        
        candidatos = []
        max_bm25 = float(np.max(bm25_scores)) if len(bm25_scores) else 0.0
        for i, emb in enumerate(embeddings_candidatas):
            idx_abs = top_k_indices[i]
            dot_prod = np.dot(vector_consulta, emb)
            norm_q = np.linalg.norm(vector_consulta)
            norm_d = np.linalg.norm(emb)
            sim = dot_prod / (norm_q * norm_d) if norm_q > 0 and norm_d > 0 else 0.0
            bm25_normalizado = (
                float(bm25_scores[idx_abs]) / max_bm25
                if max_bm25 > 0
                else 0.0
            )
            confianza_hibrida = (0.65 * float(sim)) + (0.35 * bm25_normalizado)
            
            candidatos.append({
                "codigo_regla": self.corpus_codigo_reglas[idx_abs],
                "pregunta": self.corpus_preguntas[idx_abs],
                "respuesta": self.corpus_respuestas[idx_abs],
                "categoria": self.corpus_categorias[idx_abs],
                "confianza": confianza_hibrida,
                "similitud_semantica": float(sim),
                "coincidencia_lexica": bm25_normalizado,
            })
            
        candidatos.sort(key=lambda x: x["confianza"], reverse=True)
        return candidatos

    def buscar(self, consulta: str, top_k=5):
        if not self.corpus_ids:
            return {
                "codigo_regla": "",
                "pregunta": consulta,
                "respuesta": "Lo siento, mi base de conocimientos está vacía en este momento.",
                "categoria": "Error",
                "confianza": 0.0
            }

        top_resultados = self.buscar_top_k(consulta, top_k=top_k)
        if not top_resultados:
            return {
                "codigo_regla": "",
                "pregunta": consulta,
                "respuesta": "Lo siento, mi base de conocimientos está vacía en este momento.",
                "categoria": "Error",
                "confianza": 0.0
            }

        mejor = top_resultados[0]
        return {
            "codigo_regla": mejor["codigo_regla"],
            "pregunta": mejor["pregunta"],
            "respuesta": mejor["respuesta"],
            "categoria": mejor["categoria"],
            "confianza": mejor["confianza"]
        }

# Instancia global
motor_embeddings = HybridRetrievalEngine()
