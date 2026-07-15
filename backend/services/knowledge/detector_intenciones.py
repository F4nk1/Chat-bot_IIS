from sentence_transformers import util
import numpy as np

# Datos de entrenamiento para intenciones (pequeño conjunto para clasificador robusto)
DATOS_ENTRENAMIENTO = [
    ("¿quién es mi tutor?", "Info_Tutor"),
    ("quiero saber quién me asiste", "Info_Tutor"),
    ("¿cuál es mi docente tutor asignado?", "Info_Tutor"),
    ("dime quién es el profesor encargado de mi tutoría", "Info_Tutor"),
    ("mi codigo es", "Info_Tutor"),
    
    ("¿qué cursos hay en el semestre?", "Cursos_Semestre"),
    ("muéstrame la malla curricular", "Cursos_Semestre"),
    ("quiero ver las materias que me tocan", "Cursos_Semestre"),
    ("dime los cursos obligatorios", "Cursos_Semestre"),
    ("cuáles son los cursos del", "Cursos_Semestre"),
    
    ("¿cuál es mi escuela profesional?", "Info_Alumno"),
    ("quiero saber mis datos de alumno", "Info_Alumno"),
    ("qué semestre estoy cursando", "Info_Alumno"),
    
    ("cómo hago el trámite de matrícula", "Tramites"),
    ("necesito hacer una solicitud", "Tramites"),
    ("cuáles son los pasos para sacar mi certificado", "Tramites"),
    
    ("qué ofrece bienestar universitario", "Bienestar"),
    ("dónde queda el comedor", "Bienestar"),
    ("cómo accedo a la beca comedor o seguro de salud", "Bienestar"),
    
    ("cómo son las prácticas pre-profesionales", "Practicas"),
    ("hay convenios para pasantías", "Practicas"),
    
    ("qué pasa si desapruebo un curso", "Reglamentos"),
    ("qué pasa si me jalo un curso", "Reglamentos"),
    ("cuál es el estatuto sobre faltas disciplinarias", "Reglamentos"),
    
    ("hola, qué tal", "Saludo"),
    ("buenos días", "Saludo"),
    ("hola bot", "Saludo"),
    
    ("gracias", "Agradecimiento"),
    ("muchas gracias", "Agradecimiento")
]

class IntentDetector:
    def __init__(self):
        self.entrenado = False
        self.vectores = None
        self.etiquetas = []

    def entrenar(self, modelo_embeddings):
        # Generar embeddings para los ejemplos de entrenamiento
        preguntas = [item[0] for item in DATOS_ENTRENAMIENTO]
        self.etiquetas = [item[1] for item in DATOS_ENTRENAMIENTO]
        
        # Obtener los vectores
        self.vectores = modelo_embeddings.encode(preguntas, convert_to_tensor=True)
        self.entrenado = True
        print("Clasificador k-NN de intenciones entrenado correctamente.")

    def detectar(self, texto: str, modelo_embeddings) -> str:
        """
        Analiza el texto y retorna la categoria detectada usando similitud de coseno.
        """
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
