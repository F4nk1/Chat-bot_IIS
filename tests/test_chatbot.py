import unittest
from backend.services.conversation.asistente import ChatbotEngine
from backend.services.memory.context_manager import context_manager

class PruebasChatbotIntegrales(unittest.TestCase):

    def test_saludo(self):
        resultado = ChatbotEngine.obtener_respuesta("Hola bot, ¿qué tal?")
        self.assertEqual(resultado["categoria"], "Saludo")
        self.assertIn("DinoBot", resultado["respuesta"])

    def test_agradecimiento(self):
        resultado = ChatbotEngine.obtener_respuesta("Muchas gracias por la info")
        self.assertEqual(resultado["categoria"], "Agradecimiento")

    def test_fuera_de_dominio(self):
        # Pregunta totalmente fuera del contexto académico
        resultado = ChatbotEngine.obtener_respuesta("dime la receta de una tarta de manzana y chocolate")
        self.assertEqual(resultado["categoria"], "General")

    def test_ortografia_jerga_formal(self):
        # 1. Caso formal
        res_formal = ChatbotEngine.obtener_respuesta("Deseo información sobre mi tutor asignado, mi código es 123456")
        self.assertEqual(res_formal["categoria"], "Info_Tutor")
        
        # 2. Caso con faltas ortográficas (mtricula) y jerga (profe, compu, bika)
        res_informal = ChatbotEngine.obtener_respuesta("como me mtriculo si el profe me jalo en compu y es mi bika")
        self.assertIn("desaprobe", res_informal["pregunta_corregida"].lower())
        self.assertIn("segunda", res_informal["pregunta_corregida"].lower())
        self.assertIn("matricula", res_informal["pregunta_corregida"].lower())

    def test_slot_filling_tutor_sin_codigo(self):
        # El bot debe pedir el código
        resultado = ChatbotEngine.obtener_respuesta("¿Quién es mi tutor?")
        self.assertEqual(resultado["categoria"], "Info_Tutor")
        self.assertIn("código", resultado["respuesta"].lower())
        
    def test_slot_filling_tutor_con_codigo(self):
        # El bot debe intentar buscarlo
        resultado = ChatbotEngine.obtener_respuesta("¿Quién es el tutor del alumno 191919?")
        self.assertEqual(resultado["categoria"], "Info_Tutor")
        # Ya que 191919 no existe, debería decir que no encontró o invocar a la base
        self.assertIn("191919", resultado["respuesta"])

    def test_slot_filling_flujo_historial(self):
        # Simulamos un historial
        historial = [
            {"role": "user", "content": "¿Quién es mi tutor?"},
            {"role": "assistant", "content": "Para decirte quién es tu tutor asignado, por favor indícame tu código de estudiante."}
        ]
        # El usuario responde solo con el código
        resultado = ChatbotEngine.obtener_respuesta("123456", historial)
        self.assertEqual(resultado["categoria"], "Info_Tutor")
        self.assertIn("123456", resultado["respuesta"])

    def test_busqueda_reglamentos_rag(self):
        # Búsqueda profunda en la base de conocimientos (ChromaDB + BM25)
        resultado = ChatbotEngine.obtener_respuesta("¿Qué trámites necesito para mi bachillerato automático?")
        # Debería identificar que es de la categoría Trámites o General
        self.assertIn(resultado["categoria"], ["Tramites", "Reglamentos", "General"])
        self.assertGreaterEqual(resultado["confianza"], 0.3) # Umbral de cross-encoder

    def test_graph_rag_cursos_bloqueados(self):
        resultado = ChatbotEngine.obtener_respuesta("¿Qué cursos se me bloquean si desapruebo Cálculo I?")
        self.assertEqual(resultado["categoria"], "Cursos_Bloqueados")
        # El grafo debe extraer que Cálculo I bloquea a Cálculo II y Probabilidades y Estadística (según el CSV real)
        self.assertIn("Cálculo II", resultado["respuesta"])
        self.assertIn("Probabilidades", resultado["respuesta"])

    def test_casos_extremos(self):
        # Mensaje vacío
        res1 = ChatbotEngine.obtener_respuesta("")
        self.assertEqual(res1["categoria"], "General")

        # Solo números
        res2 = ChatbotEngine.obtener_respuesta("12345 98765")
        # Podría ser Info_Alumno o General dependiendo del detector
        self.assertIsNotNone(res2["respuesta"])

if __name__ == "__main__":
    unittest.main()
