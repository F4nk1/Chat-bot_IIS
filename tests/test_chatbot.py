import unittest
from backend.services.nlp.preprocess import preprocesar
from backend.services.chatbot.chatbot import obtener_respuesta
from backend.services.retrieval.retriever import recuperador

class PruebasChatbot(unittest.TestCase):

    def test_preprocesamiento(self):
        texto = "¿Cómo puedo saber sobre las tutorías académicas?"
        esperado = "tutorías académicas"
        resultado = preprocesar(texto)
        self.assertIn("tutorías", resultado)
        self.assertIn("académicas", resultado)
        self.assertNotIn("¿Cómo", resultado)

    def test_obtener_respuesta_existente(self):
        # Pregunta exacta del corpus
        pregunta = "¿Cómo solicito una tutoría académica?"
        resultado = obtener_respuesta(pregunta)
        self.assertEqual(resultado["categoria"], "Tutorías")
        self.assertGreater(resultado["confianza"], 0.8)

    def test_obtener_respuesta_similar(self):
        # Pregunta parecida
        pregunta = "quiero una tutoría de estudios"
        resultado = obtener_respuesta(pregunta)
        self.assertEqual(resultado["categoria"], "Tutorías")
        self.assertGreater(resultado["confianza"], 0.4)

    def test_respuesta_desconocida(self):
        # Pregunta fuera del corpus
        pregunta = "¿Cuál es la capital de Francia?"
        resultado = obtener_respuesta(pregunta)
        self.assertEqual(resultado["categoria"], "Desconocido")
        self.assertLess(resultado["confianza"], 0.3)

if __name__ == "__main__":
    unittest.main()
