from backend.services.nlu.ner import ner_engine
from backend.services.knowledge.detector_intenciones import detector_intenciones

class ContextManager:
    """
    Gestor de contexto stateless (sin estado) que reconstruye la intención 
    y entidades previas a partir del historial proporcionado por el frontend.
    """
    def __init__(self):
        self.mapa_temas = {
            "Info_Tutor": "la tutoría académica y el tutor",
            "Cursos_Semestre": "los cursos y la malla curricular",
            "Info_Alumno": "los datos del alumno",
            "Tramites": "los trámites universitarios",
            "Bienestar": "el bienestar, salud y comedor",
            "Practicas": "las prácticas preprofesionales",
            "Reglamentos": "el reglamento académico",
            "Movilidad": "el intercambio y la movilidad estudiantil",
            "Cursos_General": "la información general de cursos y créditos",
            "Tutorias_General": "la información general del reglamento de tutorías"
        }

    def extraer_contexto_historial(self, historial: list, modelo_embeddings):
        tema_previo = None
        codigo_alumno = None
        semestre = None

        if not historial:
            return tema_previo, codigo_alumno, semestre

        # Buscar de atrás hacia adelante en los mensajes del usuario
        for msg in reversed(historial):
            rol = msg.get("role") or msg.get("rol")
            contenido = msg.get("content") or msg.get("contenido")
            
            if rol in ["user", "usuario"] and contenido:
                # Extraer entidades de mensajes anteriores
                entidades = ner_engine.extraer_entidades(contenido)
                if entidades.get("codigo_alumno") and not codigo_alumno:
                    codigo_alumno = entidades["codigo_alumno"]
                if entidades.get("semestre") and not semestre:
                    semestre = entidades["semestre"]

                # Solo buscamos el tema previo si aún no lo tenemos
                if not tema_previo:
                    intencion = detector_intenciones.detectar(contenido, modelo_embeddings)
                    if intencion not in ["General", "Saludo", "Agradecimiento"]:
                        tema_previo = intencion
                
                # Si ya tenemos todo, no necesitamos seguir buscando
                if tema_previo and codigo_alumno and semestre:
                    break

        return tema_previo, codigo_alumno, semestre

    def resolver_correferencia(self, mensaje: str, tema_previo: str) -> str:
        """
        Contextualiza la pregunta únicamente si es ultra corta o contiene pronombres
        demostrativos o locativos muy específicos de continuación.
        """
        if not tema_previo:
            return mensaje
            
        mensaje_lc = mensaje.lower().strip()

        # No resolver correferencia si la frase es una expresión de interacción social
        expresiones_sociales = [
            "gracias", "muchas gracias", "gracias por la informacion", "gracias por la información",
            "te agradezco", "mil gracias", "muy amable", "excelente gracias", "gracias dinobot",
            "hola", "buenos días", "buenos dias", "buenas tardes", "buenas noches", "qué tal", "que tal",
            "chau", "chao", "hasta luego", "nos vemos", "adiós", "adios", "hasta pronto", "cuídate", "cuidate", "eso es todo"
        ]

        if any(e in mensaje_lc for e in expresiones_sociales) or mensaje_lc in expresiones_sociales:
            return mensaje

        palabras = mensaje_lc.split()
        
        # Pronombres demostrativos, personales o locativos de referencia directa
        pronombres_referencia = ["eso", "esa", "este", "esta", "estos", "estas", "él", "ella", "ellos", "ellas", "allí", "alli", "ahí", "ahi"]
        
        # Caso A: Preguntas ultra cortas de seguimiento (1 o 2 palabras, ej: "¿Dónde?", "¿Cómo?")
        es_ultra_corta = len(palabras) <= 2
        
        # Caso B: Preguntas cortas que usan un pronombre de referencia explícita (ej: "¿Cuáles son los requisitos de eso?")
        tiene_referencia_directa = any(p in palabras for p in pronombres_referencia) and len(palabras) <= 4
        
        if es_ultra_corta or tiene_referencia_directa:
            sustantivo = self.mapa_temas.get(tema_previo, tema_previo)
            return f"Sobre {sustantivo}: {mensaje}"
            
        return mensaje

context_manager = ContextManager()
