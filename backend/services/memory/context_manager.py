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
            "Reglamentos": "el reglamento académico"
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
        """Si hay pronombres o la frase es muy corta, agrega el tema previo como prefijo."""
        if not tema_previo:
            return mensaje
            
        pronombres = ["eso", "esa", "él", "la", "lo", "allí", "ahí", "ellos", "ellas", 
                      "requisito", "obligatoria", "cuando", "dónde", "quién", "cuáles", 
                      "cuales", "cuál", "cual", "cómo", "como", "qué", "que", "y"]
        mensaje_lc = mensaje.lower()
        
        # Si el mensaje ya tiene palabras clave fuertes, no contextualizar
        keywords = ["tutoria", "comedor", "beca", "salud", "practica", "matricula", "tutor"]
        if any(k in mensaje_lc for k in keywords):
            return mensaje

        # Si usa pronombres o es una frase corta
        if any(p in mensaje_lc.split() for p in pronombres) or len(mensaje_lc.split()) <= 4:
            sustantivo = self.mapa_temas.get(tema_previo, tema_previo)
            return f"Sobre {sustantivo}: {mensaje}"
            
        return mensaje

context_manager = ContextManager()
