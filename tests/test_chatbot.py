import unittest
from backend.services.knowledge.preprocesamiento import preprocesar
from backend.services.conversation.asistente import ChatbotEngine
from backend.services.retrieval.motor_embeddings import motor_embeddings

class PruebasChatbot(unittest.TestCase):

    def test_preprocesamiento(self):
        texto = "¿Como puedo saber sobre las tutorias academicas?"
        resultado = preprocesar(texto)
        self.assertIn("tutorias", resultado)
        self.assertIn("academicas", resultado)

    def test_obtener_respuesta_existente(self):
        pregunta = "¿Que regula el Reglamento de Tutoria Academica de la UNSAAC?"
        resultado = ChatbotEngine.obtener_respuesta(pregunta)
        # La intencion detectada deberia ser Tutorias o Reglamentos
        self.assertIn(resultado["categoria"], ["Tutorias", "Reglamentos"])
        self.assertGreater(resultado["confianza"], 0.7)

    def test_obtener_respuesta_similar(self):
        pregunta = "quien organiza las tutorias en mi escuela"
        resultado = ChatbotEngine.obtener_respuesta(pregunta)
        self.assertEqual(resultado["categoria"], "Tutorias")
        self.assertGreater(resultado["confianza"], 0.4)

    def test_respuesta_desconocida(self):
        pregunta = "dime la receta de una tarta de manzana y chocolate"
        resultado = ChatbotEngine.obtener_respuesta(pregunta)
        # Ahora devuelve la intencion detectada (General) si no hay match
        self.assertEqual(resultado["categoria"], "General")

if __name__ == "__main__":
    unittest.main()
