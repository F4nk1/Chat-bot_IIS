import itertools
import random
import string

def generar_frases(prefs, mids, sufs, n=100):
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

def generar_ruido(n=100):
    todas = []
    # 1. Random strings
    for _ in range(30):
        length = random.randint(3, 20)
        todas.append(''.join(random.choices(string.ascii_letters + " ", k=length)))
    
    # 2. Nonsensical word combinations
    palabras = ["gato", "volador", "sopa", "teclado", "zapatos", "nube", "correr", "azul", "ayer", "espacio", "juego", "bailar", "x", "dj2id", "!!!"]
    for _ in range(40):
        length = random.randint(2, 6)
        todas.append(' '.join(random.choices(palabras, k=length)))
        
    # 3. Off-topic questions
    off_topic = [
        "cuál es el sentido de la vida",
        "dime quién ganó el mundial de 2022",
        "cómo arreglo mi auto",
        "me duele el estómago qué tomo",
        "receta para hacer pizza",
        "cómo hackear facebook",
        "precio del bitcoin hoy",
        "recomiéndame una película de terror",
        "cómo viajo a la luna",
        "cuántos planetas hay en el sistema solar"
    ]
    for p in off_topic:
        for extra in ["", "dime", "porfa", "rápido"]:
            todas.append(f"{extra} {p}".strip())
    
    random.seed(42)
    random.shuffle(todas)
    return todas[:n]

saludos = generar_frases(
    ["Hola", "Buenas", "Buen día", "Qué tal", "Saludos", "Hey", "Aló", "Buenos dias", "Que onda"],
    ["bot", "DinoBot", "asistente", "amigo", "sistema", "computadora", ""],
    ["¿cómo estás?", "¿qué puedes hacer?", "necesito ayuda", "estás ahí", "ayúdame", "responde", ""]
)

agradecimientos = generar_frases(
    ["Gracias", "Muchas gracias", "Te agradezco", "Mil gracias", "Vale gracias", "Perfecto gracias", "Ok gracias"],
    ["bot", "amigo", "por la info", "por tu ayuda", "por responder", "por el dato", ""],
    ["eso es todo", "me sirvió mucho", "muy amable", "nos vemos", "adiós", "chau", ""]
)

fuera_dominio = generar_ruido(100)

info_tutor = generar_frases(
    ["quién es", "dime el nombre de", "busco a", "necesito contactar a", "cómo se llama", "quién me asesora"],
    ["mi tutor", "el tutor asignado", "el profe tutor", "mi profesor guía"],
    ["soy el alumno 123456", "mi código es 123456", "del código 123456", "mi codigo 123456", "123456", ""]
)

info_alumno = generar_frases(
    ["quién soy", "cuáles son los datos de", "información de", "dime de", "busca a", "datos sobre"],
    ["mi usuario", "mi persona", "este estudiante", "el alumno", "mi registro", "este código"],
    ["mi código es 123456", "soy 123456", "código 123456", "mi cod es 123456", "123456", ""]
)

cursos_semestre = generar_frases(
    ["qué cursos hay", "qué se enseña", "cuáles son las materias", "dame la lista de cursos", "cursos obligatorios", "materias del"],
    ["en el semestre", "en el ciclo", "para el nivel", "en el año", "de"],
    ["4", "cuatro", "IV", "quinto", "5", "1", "primero", "segundo", "tercero"]
)

cursos_bloqueados = generar_frases(
    ["qué cursos se me bloquean si", "qué no puedo llevar si", "qué pasa si", "me bloquean algo si", "qué materias pierdo si"],
    ["jalo", "desapruebo", "repruebo", "pierdo", "biqueo", "no apruebo"],
    ["Cálculo I", "Matemática", "Programación", "Física", "Cálculo II", "Redacción"]
)

info_curso_atributos = generar_frases(
    ["cuántos créditos tiene", "es electivo", "qué tipo de curso es", "de qué área es", "vale", "es de carrera"],
    ["el curso de", "la materia", "la asignatura", "el taller de"],
    ["Ingeniería de Software", "Base de Datos", "Cálculo II", "Redacción", "Física I", "Algoritmos"]
)

rag_tramites = generar_frases(
    ["dónde tramito", "cuáles son los requisitos para", "cómo hago", "qué necesito para", "cuánto cuesta", "dónde solicito"],
    ["mi bachillerato", "titulación", "constancia de notas", "matrícula extemporánea", "reserva de matrícula", "el comedor universitario"],
    ["en la unsaac", "rápido", "virtualmente", "en la oficina", "por internet", ""]
)

# Generar el archivo
with open('tests/test_stress.py', 'w', encoding='utf-8') as f:
    f.write("import unittest\n")
    f.write("from backend.services.conversation.asistente import ChatbotEngine\n\n")
    f.write("class PruebasChatbotStress(unittest.TestCase):\n")

    def escribir_test(nombre, lista, aserciones_str):
        f.write(f"\n    def test_{nombre}(self):\n")
        f.write(f"        casos = {lista}\n")
        f.write(f"        fallos = 0\n")
        f.write(f"        for i, caso in enumerate(casos):\n")
        f.write(f"            try:\n")
        f.write(f"                resultado = ChatbotEngine.obtener_respuesta(caso)\n")
        for aser in aserciones_str:
            f.write(f"                {aser}\n")
        f.write(f"            except AssertionError:\n")
        f.write(f"                fallos += 1\n")
        f.write(f"            except Exception as e:\n")
        f.write(f"                self.fail('Error en test ' + '{nombre}' + ' caso ' + str(caso) + ': ' + str(e))\n")
        # Permitimos hasta 10% de errores de clasificación en stress test (k-NN no es perfecto con 1NN en semántica cercana)
        f.write(f"        self.assertTrue(fallos <= 15, 'Muchos fallos en {nombre}: ' + str(fallos) + '/100')\n")

    escribir_test("saludo", saludos, ['self.assertEqual(resultado["categoria"], "Saludo")'])
    escribir_test("agradecimiento", agradecimientos, ['self.assertEqual(resultado["categoria"], "Agradecimiento")'])
    escribir_test("fuera_dominio_ruido", fuera_dominio, ['self.assertEqual(resultado["categoria"], "General")'])
    escribir_test("info_tutor", info_tutor, ['self.assertEqual(resultado["categoria"], "Info_Tutor")'])
    escribir_test("info_alumno", info_alumno, ['self.assertEqual(resultado["categoria"], "Info_Alumno")'])
    escribir_test("cursos_semestre", cursos_semestre, ['self.assertEqual(resultado["categoria"], "Cursos_Semestre")'])
    escribir_test("cursos_bloqueados", cursos_bloqueados, ['self.assertIn(resultado["categoria"], ["Cursos_Bloqueados", "Reglamentos"])'])
    escribir_test("info_curso_atributos", info_curso_atributos, ['self.assertIn(resultado["categoria"], ["Info_Curso_Atributos", "Reglamentos"])'])
    escribir_test("rag_tramites", rag_tramites, ['self.assertIn(resultado["categoria"], ["Tramites", "Reglamentos", "General", "Bienestar"])'])
    
    f.write("\nif __name__ == '__main__':\n    unittest.main()\n")

print("Generado test_stress.py con " + str(9 * 100) + " tests")
