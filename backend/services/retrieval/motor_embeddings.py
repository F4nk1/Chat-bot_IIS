import sqlite3
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from backend.services.knowledge.preprocesamiento import preprocesar
from backend.services.knowledge.base_conocimiento import KnowledgeBase


class EmbeddingEngine:
    """
    Clase equivalente a EmbeddingEngine segun requerimientos.
    Maneja la vectorizacion y busqueda semantica.
    """
    def __init__(self):
        self.datos = []
        self.preguntas_limpias = []
        self.vectorizador = TfidfVectorizer()
        self.vectores_preguntas = None
        self.recargar_conocimiento()

    def recargar_conocimiento(self):
        """Carga los datos usando KnowledgeBase y entrena el vectorizador."""
        try:
            filas = KnowledgeBase.obtener_todo()

            if not filas:
                print("Advertencia: No hay datos en la base de datos.")
                return

            self.datos = [
                {
                    "categoria": fila["categoria"],
                    "pregunta": fila["pregunta"],
                    "respuesta": fila["respuesta"]
                }
                for fila in filas
            ]

            self.preguntas_limpias = [fila["pregunta_limpia"] for fila in filas]
            self.vectores_preguntas = self.vectorizador.fit_transform(self.preguntas_limpias)
            
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

        consulta_limpia = preprocesar(consulta)
        vector_consulta = self.vectorizador.transform([consulta_limpia])

        similitudes = cosine_similarity(
            vector_consulta,
            self.vectores_preguntas
        )

        indice_mejor = similitudes.argmax()
        puntaje_mejor = similitudes[0][indice_mejor]

        resultado = self.datos[indice_mejor]

        return {
            "pregunta": resultado["pregunta"],
            "respuesta": resultado["respuesta"],
            "categoria": resultado["categoria"],
            "confianza": float(puntaje_mejor)
        }


# Instancia global para ser usada en el servicio de conversacion
motor_embeddings = EmbeddingEngine()
