import itertools
import random

def generar_frases(prefs, mids, sufs, n=50):
    todas = []
    for p in prefs:
        for m in mids:
            for s in sufs:
                frase = f"{p} {m} {s}".strip()
                frase = " ".join(frase.split()) # quitar espacios extra
                if frase:
                    todas.append(frase)
    random.seed(42)
    random.shuffle(todas)
    return todas[:n]

saludos = generar_frases(
    ["Hola", "Buenas", "Buen día", "Qué tal", "Saludos", "Hey"],
    ["bot", "DinoBot", "asistente", "amigo", "sistema", ""],
    ["¿cómo estás?", "¿qué puedes hacer?", "necesito ayuda", "estás ahí", ""]
)

agradecimientos = generar_frases(
    ["Gracias", "Muchas gracias", "Te agradezco", "Mil gracias", "Vale gracias"],
    ["bot", "amigo", "por la info", "por tu ayuda", ""],
    ["eso es todo", "me sirvió mucho", "muy amable", ""]
)

fuera_dominio = generar_frases(
    ["dime", "cuál es", "cómo preparo", "qué sabes de", "explícame"],
    ["la receta de tarta", "física cuántica avanzada", "historia de roma", "viajes al espacio", "fútbol", "fórmula 1"],
    ["por favor", "ahora", "en 5 pasos", "rápidamente", ""]
)

info_tutor = generar_frases(
    ["quién es", "dime el nombre de", "busco a", "necesito contactar a", "cómo se llama"],
    ["mi tutor", "el tutor asignado", "el profe tutor"],
    ["soy el alumno 123456", "mi código es 123456", "del código 123456", ""]
)

info_alumno = generar_frases(
    ["quién soy", "cuáles son los datos de", "información de", "dime de", "busca a"],
    ["mi usuario", "mi persona", "este estudiante", "el alumno"],
    ["mi código es 123456", "soy 123456", "código 123456", ""]
)

cursos_semestre = generar_frases(
    ["qué cursos hay", "qué se enseña", "cuáles son las materias", "dame la lista de cursos", "cursos obligatorios"],
    ["en el semestre", "en el ciclo", "para el nivel"],
    ["4", "cuatro", "IV", "quinto", "5", "1", "primero"]
)

cursos_bloqueados = generar_frases(
    ["qué cursos se me bloquean si", "qué no puedo llevar si", "qué pasa si", "me bloquean algo si"],
    ["jalo", "desapruebo", "repruebo", "pierdo", "biqueo"],
    ["Cálculo I", "Matemática", "Programación", "Física"]
)

info_curso_atributos = generar_frases(
    ["cuántos créditos tiene", "es electivo", "qué tipo de curso es", "de qué área es", "vale"],
    ["el curso de", "la materia", "la asignatura"],
    ["Ingeniería de Software", "Base de Datos", "Cálculo II", "Redacción"]
)

rag_tramites = generar_frases(
    ["dónde tramito", "cuáles son los requisitos para", "cómo hago", "qué necesito para"],
    ["mi bachillerato", "titulación", "constancia de notas", "matrícula extemporánea", "reserva de matrícula"],
    ["en la unsaac", "rápido", "virtualmente", ""]
)

# Generar el archivo
with open('tests/test_exhaustivo.py', 'w', encoding='utf-8') as f:
    f.write("""import unittest
from backend.services.conversation.asistente import ChatbotEngine

class PruebasChatbotExhaustivas(unittest.TestCase):
""")

    def escribir_test(nombre, lista, aserciones_str):
        f.write(f"\n    def test_{nombre}(self):\n")
        f.write(f"        casos = {lista}\n")
        f.write(f"        for i, caso in enumerate(casos):\n")
        f.write(f"            with self.subTest(caso=caso, idx=i):\n")
        f.write(f"                resultado = ChatbotEngine.obtener_respuesta(caso)\n")
        for aser in aserciones_str:
            f.write(f"                {aser}\n")

    escribir_test("saludo", saludos, ['self.assertEqual(resultado["categoria"], "Saludo")'])
    escribir_test("agradecimiento", agradecimientos, ['self.assertEqual(resultado["categoria"], "Agradecimiento")'])
    escribir_test("fuera_dominio", fuera_dominio, ['self.assertEqual(resultado["categoria"], "General")'])
    escribir_test("info_tutor", info_tutor, ['self.assertEqual(resultado["categoria"], "Info_Tutor")'])
    escribir_test("info_alumno", info_alumno, ['self.assertEqual(resultado["categoria"], "Info_Alumno")'])
    escribir_test("cursos_semestre", cursos_semestre, ['self.assertEqual(resultado["categoria"], "Cursos_Semestre")'])
    escribir_test("cursos_bloqueados", cursos_bloqueados, ['self.assertIn(resultado["categoria"], ["Cursos_Bloqueados", "Reglamentos"])'])
    escribir_test("info_curso_atributos", info_curso_atributos, ['self.assertIn(resultado["categoria"], ["Info_Curso_Atributos", "Reglamentos"])'])
    escribir_test("rag_tramites", rag_tramites, ['self.assertIn(resultado["categoria"], ["Tramites", "Reglamentos", "General"])'])
    
    f.write("\nif __name__ == '__main__':\n    unittest.main()\n")

print("Generado test_exhaustivo.py con " + str(9 * 50) + " tests")
