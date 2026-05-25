import sqlite3
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from backend.services.nlp.preprocess import preprocesar
from backend.config.settings import ajustes
from backend.database.gestion_bd import obtener_conexion


class Recuperador:

    def __init__(self):
        self.datos = []
        self.preguntas_limpias = []
        self.vectorizador = TfidfVectorizer()
        self.vectores_preguntas = None
        self.recargar_conocimiento()

    def recargar_conocimiento(self):
        """Carga los datos desde SQLite y entrena el vectorizador."""
        try:
            conexion = obtener_conexion()
            cursor = conexion.cursor()
            cursor.execute("SELECT categoria, pregunta, respuesta, pregunta_limpia FROM conocimiento")
            filas = cursor.fetchall()
            conexion.close()

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
            print(f"Error al cargar conocimiento desde SQLite: {e}")

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


recuperador = Recuperador()
