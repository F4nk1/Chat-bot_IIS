from sentence_transformers import util
import numpy as np

# Datos de entrenamiento extendidos para robustez
DATOS_ENTRENAMIENTO = [
    ("¿quién es mi tutor?", "Info_Tutor"),
    ("quiero saber quién me asiste", "Info_Tutor"),
    ("¿cuál es mi docente tutor asignado?", "Info_Tutor"),
    ("dime quién es el profesor encargado de mi tutoría", "Info_Tutor"),
    ("mi codigo es", "Info_Tutor"),
    ("busco a mi tutor", "Info_Tutor"),
    ("necesito contactar a el tutor asignado", "Info_Tutor"),
    ("dime el nombre de el profe tutor", "Info_Tutor"),
    ("quién es el tutor", "Info_Tutor"),
    
    ("¿qué cursos hay en el semestre?", "Cursos_Semestre"),
    ("muéstrame la malla curricular", "Cursos_Semestre"),
    ("quiero ver las materias que me tocan", "Cursos_Semestre"),
    ("dime los cursos obligatorios", "Cursos_Semestre"),
    ("cuáles son los cursos del", "Cursos_Semestre"),
    ("qué se enseña en el ciclo", "Cursos_Semestre"),
    ("dame la lista de cursos para el nivel", "Cursos_Semestre"),
    ("cuáles son las materias en el semestre", "Cursos_Semestre"),
    
    ("¿cuál es mi escuela profesional?", "Info_Alumno"),
    ("quiero saber mis datos de alumno", "Info_Alumno"),
    ("qué semestre estoy cursando", "Info_Alumno"),
    ("quién soy", "Info_Alumno"),
    ("cuáles son los datos de mi usuario", "Info_Alumno"),
    ("información de mi persona", "Info_Alumno"),
    ("dime de este estudiante", "Info_Alumno"),
    ("busca a el alumno", "Info_Alumno"),
    
    ("cómo hago el trámite de matrícula", "Tramites"),
    ("necesito hacer una solicitud", "Tramites"),
    ("cuáles son los pasos para sacar mi certificado", "Tramites"),
    ("trámites para bachillerato automático", "Tramites"),
    ("quiero tramitar mi bachiller", "Tramites"),
    ("dónde tramito", "Tramites"),
    ("cuáles son los requisitos para", "Tramites"),
    ("cómo hago", "Tramites"),
    ("qué necesito para titulación", "Tramites"),
    ("dónde tramito constancia de notas en la unsaac", "Tramites"),
    ("dónde tramito matrícula extemporánea", "Tramites"),
    ("cómo hago mi bachillerato virtualmente", "Tramites"),
    ("dónde tramito mi bachillerato rápido", "Tramites"),
    ("cómo hago mi bachillerato", "Tramites"),
    ("dónde tramito mi bachillerato virtualmente", "Tramites"),
    ("cómo hago mi bachillerato en la unsaac", "Tramites"),
    ("cómo hago matrícula extemporánea en la unsaac", "Tramites"),
    ("dónde tramito constancia de notas virtualmente", "Tramites"),
    ("cómo hago constancia de notas en la unsaac", "Tramites"),
    
    ("qué ofrece bienestar universitario", "Bienestar"),
    ("dónde queda el comedor", "Bienestar"),
    ("cómo accedo a la beca comedor o seguro de salud", "Bienestar"),
    
    ("cómo son las prácticas pre-profesionales", "Practicas"),
    ("hay convenios para pasantías", "Practicas"),
    
    ("qué pasa si desapruebo un curso", "Reglamentos"),
    ("qué pasa si me jalo un curso", "Reglamentos"),
    ("cuál es el estatuto sobre faltas disciplinarias", "Reglamentos"),
    
    ("qué cursos se me bloquean si jalo", "Cursos_Bloqueados"),
    ("si desapruebo un curso qué no puedo llevar", "Cursos_Bloqueados"),
    ("prerrequisitos si me jalo", "Cursos_Bloqueados"),
    ("qué pasa con mi malla si desapruebo", "Cursos_Bloqueados"),
    ("qué no puedo llevar si repruebo", "Cursos_Bloqueados"),
    ("qué pasa si pierdo", "Cursos_Bloqueados"),
    ("me bloquean algo si biqueo", "Cursos_Bloqueados"),

    ("qué es la movilidad estudiantil", "Movilidad"),
    ("quiero ir de intercambio", "Movilidad"),
    ("cómo postulo a una beca en el extranjero", "Movilidad"),
    ("programa pila o alianza del pacifico", "Movilidad"),

    ("qué es un plan de estudios", "Cursos_General"),
    ("cuántos créditos necesito para egresar", "Cursos_General"),
    ("qué es un curso dirigido", "Cursos_General"),
    
    ("cuántos créditos tiene el curso", "Info_Curso_Atributos"),
    ("el curso es electivo u obligatorio", "Info_Curso_Atributos"),
    ("a qué área pertenece la materia", "Info_Curso_Atributos"),
    ("cuantos creditos vale", "Info_Curso_Atributos"),
    ("es un curso de formación general o especialidad", "Info_Curso_Atributos"),
    ("qué tipo de curso es la asignatura", "Info_Curso_Atributos"),
    ("de qué área es", "Info_Curso_Atributos"),
    ("vale", "Info_Curso_Atributos"),
    ("es electivo la asignatura Redacción", "Info_Curso_Atributos"),
    ("es electivo la materia Redacción", "Info_Curso_Atributos"),
    ("de qué área es la asignatura Base de Datos", "Info_Curso_Atributos"),
    ("vale el curso de Base de Datos", "Info_Curso_Atributos"),
    ("es electivo la asignatura Base de Datos", "Info_Curso_Atributos"),
    ("vale el curso de Cálculo II", "Info_Curso_Atributos"),
    ("es electivo la asignatura Cálculo II", "Info_Curso_Atributos"),
    ("vale la materia Ingeniería de Software", "Info_Curso_Atributos"),
    ("qué tipo de curso es el curso de Cálculo II", "Info_Curso_Atributos"),
    ("vale la materia Base de Datos", "Info_Curso_Atributos"),
    ("es electivo el curso de Base de Datos", "Info_Curso_Atributos"),
    ("vale la asignatura Base de Datos", "Info_Curso_Atributos"),
    ("vale el curso de Redacción", "Info_Curso_Atributos"),
    
    ("cómo solicito una tutoría académica", "Tutorias_General"),
    ("la tutoría es obligatoria", "Tutorias_General"),
    ("quiénes pueden ser tutores", "Tutorias_General"),
    
    ("hola, qué tal", "Saludo"),
    ("buenos días", "Saludo"),
    ("hola bot", "Saludo"),
    ("buenas", "Saludo"),
    ("buen día", "Saludo"),
    ("qué tal", "Saludo"),
    ("saludos", "Saludo"),
    ("hey", "Saludo"),
    ("buenas sistema", "Saludo"),
    ("hola asistente", "Saludo"),
    ("buen día dinobot", "Saludo"),
    ("saludos amigo", "Saludo"),
    ("Saludos sistema necesito ayuda", "Saludo"),
    ("Qué tal ¿qué puedes hacer?", "Saludo"),
    ("Buenas sistema estás ahí", "Saludo"),
    ("Buenas asistente necesito ayuda", "Saludo"),
    ("Buenas DinoBot ¿qué puedes hacer?", "Saludo"),
    ("Qué tal asistente ¿qué puedes hacer?", "Saludo"),
    ("Saludos asistente ¿qué puedes hacer?", "Saludo"),
    
    ("gracias", "Agradecimiento"),
    ("muchas gracias", "Agradecimiento"),
    ("te agradezco", "Agradecimiento"),
    ("mil gracias", "Agradecimiento"),
    ("vale gracias", "Agradecimiento"),
    ("eso es todo", "Agradecimiento"),
    ("me sirvió mucho", "Agradecimiento"),
    ("muy amable", "Agradecimiento"),
    
    # Casos de ruido / Fuera de Dominio explícitos
    ("cuál es el sentido de la vida", "General"),
    ("dime quién ganó el mundial de 2022", "General"),
    ("cómo arreglo mi auto", "General"),
    ("me duele el estómago qué tomo", "General"),
    ("receta para hacer pizza", "General"),
    ("cómo hackear facebook", "General"),
    ("precio del bitcoin hoy", "General"),
    ("recomiéndame una película de terror", "General"),
    ("cómo viajo a la luna", "General"),
    ("cuántos planetas hay en el sistema solar", "General"),
    ("gato volador", "General"),
    ("sopa teclado", "General"),
    ("zapatos nube", "General"),
    ("dj2id", "General"),
    ("!!!", "General"),
    
    # Refuerzos de Info_Alumno para evitar confusión con Info_Tutor
    ("dime de mi persona soy 123456", "Info_Alumno"),
    ("información de mi usuario mi código es 123456", "Info_Alumno"),
    ("busca a mi persona código 123456", "Info_Alumno"),
    ("quién soy mi usuario soy 123456", "Info_Alumno"),
    ("busca a el alumno mi código es 123456", "Info_Alumno"),
    ("dime de el alumno código 123456", "Info_Alumno"),
    ("busca a mi usuario código 123456", "Info_Alumno"),
    ("dime de el alumno mi código es 123456", "Info_Alumno"),
    ("información de mi persona mi código es 123456", "Info_Alumno")
]

class IntentDetector:
    def __init__(self):
        self.entrenado = False
        self.vectores = None
        self.etiquetas = []

    def entrenar(self, modelo_embeddings):
        from backend.services.nlu.symspell_checker import spell_checker
        # Generar embeddings para los ejemplos de entrenamiento
        preguntas = [spell_checker.corregir(item[0]) for item in DATOS_ENTRENAMIENTO]
        self.etiquetas = [item[1] for item in DATOS_ENTRENAMIENTO]
        
        # Obtener los vectores
        self.vectores = modelo_embeddings.encode(preguntas, convert_to_tensor=True)
        self.entrenado = True
        print("Clasificador k-NN de intenciones entrenado correctamente.")

    def detectar(self, texto: str, modelo_embeddings) -> str:
        """
        Analiza el texto y retorna la categoria detectada usando similitud de coseno.
        """
        if not texto or not texto.strip():
            return "General"

        if not self.entrenado:
            self.entrenar(modelo_embeddings)
            
        vector_texto = modelo_embeddings.encode(texto, convert_to_tensor=True)
        
        # Calcular similitud del texto con todos los ejemplos
        similitudes = util.cos_sim(vector_texto, self.vectores)[0]
        
        indice_mejor = int(np.argmax(similitudes.cpu().numpy()))
        puntaje_mejor = float(similitudes[indice_mejor])
        
        # Umbral para clasificar como General (Fuera de Dominio)
        if puntaje_mejor < 0.45:
            return "General"
            
        return self.etiquetas[indice_mejor]

# Instancia global
detector_intenciones = IntentDetector()
