import unittest
from backend.services.knowledge.preprocesamiento import preprocesar
from backend.services.conversation.asistente import obtener_respuesta
from backend.services.retrieval.recuperador import recuperador

class PruebasChatbot(unittest.TestCase):

    def test_preprocesamiento(self):
        texto = "¿Como puedo saber sobre las tutorias academicas?"
        # El preprocesamiento ahora maneja tildes segun la logica actual (re.sub [^a-z...])
        resultado = preprocesar(texto)
        self.assertIn("tutorias", resultado)
        self.assertIn("academicas", resultado)

    def test_obtener_respuesta_existente(self):
        # Pregunta extraida del nuevo corpus de Normas Generales
        pregunta = "¿Que regula el Reglamento de Tutoria Academica de la UNSAAC?"
        resultado = obtener_respuesta(pregunta)
        self.assertEqual(resultado["categoria"], "Normas generales")
        self.assertGreater(resultado["confianza"], 0.7)

    def test_obtener_respuesta_similar(self):
        # Pregunta parecida sobre el sistema tutorial
        pregunta = "quien organiza las tutorias en mi escuela"
        resultado = obtener_respuesta(pregunta)
        # Segun corpus_estructura_tutorias.json
        self.assertEqual(resultado["categoria"], "Estructura tutorial")
        self.assertGreater(resultado["confianza"], 0.4)

    def test_respuesta_desconocida(self):
        # Pregunta totalmente fuera de contexto
        pregunta = "dime la receta de una tarta de manzana y chocolate"
        resultado = obtener_respuesta(pregunta)
        # Si el umbral esta bien configurado, deberia ser Desconocido
        # Nota: Si el usuario tiene SIMILARITY_THRESHOLD=0.2 en su entorno, esto podria fallar.
        self.assertEqual(resultado["categoria"], "Desconocido")

if __name__ == "__main__":
    unittest.main()
