import sqlite3
import os
import numpy as np
from sentence_transformers import SentenceTransformer, util

from backend.services.knowledge.preprocesamiento import preprocesar
from backend.services.knowledge.base_conocimiento import KnowledgeBase


class EmbeddingEngine:
    """
    Clase que maneja la vectorización y búsqueda semántica utilizando Sentence-Transformers.
    """
    def __init__(self):
        self.datos = []
        # Modelo multilingüe ligero (aprox 420MB en disco, muy rápido en CPU/GPU)
        self.modelo = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
        self.vectores_preguntas = None
        self.recargar_conocimiento()

    def recargar_conocimiento(self):
        """Carga los datos usando KnowledgeBase y genera los embeddings."""
        try:
            filas = KnowledgeBase.obtener_todo()

            if not filas:
                print("Advertencia: No hay datos en la base de datos.")
                return

            self.datos = [
                {
                    "categoria": fila["categoria"],
                    "pregunta": fila["pregunta"],
                    "respuesta": fila["respuesta"],
                    "pregunta_limpia": fila["pregunta_limpia"]
                }
                for fila in filas
            ]

            preguntas_originales = [fila["pregunta"] for fila in self.datos]
            # Generar embeddings para todas las preguntas usando el texto natural original
            self.vectores_preguntas = self.modelo.encode(preguntas_originales, convert_to_tensor=True)
            
        except Exception as e:
            print(f"Error en EmbeddingEngine al cargar conocimiento: {e}")

    def buscar(self, consulta: str):
        if not self.datos or self.vectores_preguntas is None:
            return {
                "pregunta": consulta,
                "respuesta": "Lo siento, mi base de conocimientos está vacía en este momento.",
                "categoria": "Error",
                "confianza": 0.0
            }

        # Para SentenceTransformers, no usamos preprocesar() porque elimina tildes, ñ y stopwords
        # que son indispensables para que el modelo capture el significado contextual.
        vector_consulta = self.modelo.encode(consulta.strip(), convert_to_tensor=True)

        # Calcular similitud de coseno
        similitudes = util.cos_sim(vector_consulta, self.vectores_preguntas)[0]
        
        indice_mejor = int(np.argmax(similitudes.cpu().numpy()))
        puntaje_mejor = float(similitudes[indice_mejor])

        resultado = self.datos[indice_mejor]

        return {
            "pregunta": resultado["pregunta"],
            "respuesta": resultado["respuesta"],
            "categoria": resultado["categoria"],
            "confianza": puntaje_mejor
        }


# Instancia global para ser usada en el servicio de conversacion
motor_embeddings = EmbeddingEngine()
