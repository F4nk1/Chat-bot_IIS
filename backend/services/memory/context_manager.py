import numpy as np

class ContextManager:
    def __init__(self):
        self.sesiones = {}

    def get_session(self, session_id: str):
        if session_id not in self.sesiones:
            self.sesiones[session_id] = {
                "tema_previo": None,
                "entidad_codigo": None,
                "historial_intenciones": []
            }
        return self.sesiones[session_id]

    def actualizar_contexto(self, session_id: str, intencion: str, entidades: dict):
        sesion = self.get_session(session_id)
        
        # Actualizar tema/intención principal
        if intencion not in ["General", "Saludo", "Agradecimiento"]:
            sesion["tema_previo"] = intencion
            
        sesion["historial_intenciones"].append(intencion)
        
        # Mantener historial corto (últimas 5 interacciones)
        if len(sesion["historial_intenciones"]) > 5:
            sesion["historial_intenciones"].pop(0)
            
        # Actualizar entidades activas si existen
        if entidades.get("codigo_alumno"):
            sesion["entidad_codigo"] = entidades["codigo_alumno"]
            
        return sesion

    def resolver_correferencia(self, mensaje: str, session_id: str) -> str:
        """Si hay pronombres, reemplaza con la entidad o tema previo (NLG Básico)."""
        sesion = self.get_session(session_id)
        tema = sesion["tema_previo"]
        
        pronombres = ["eso", "esa", "él", "la", "lo", "allí", "ahí", "ellos", "ellas", "requisito", "obligatoria", "cuando", "dónde", "quién", "cuáles", "cuales", "cuál", "cual", "cómo", "como", "qué", "que", "y"]
        mensaje_lc = mensaje.lower()
        
        if not tema:
            return mensaje
            
        # Si el mensaje ya parece completo (contiene palabras clave principales), no agregar contexto
        keywords = ["tutoria", "comedor", "beca", "salud", "practica", "matricula", "tutor"]
        if any(k in mensaje_lc for k in keywords):
            return mensaje

        # Si hay pronombres o es muy corto, agregamos el tema como prefijo
        if any(p in mensaje_lc.split() for p in pronombres) or len(mensaje_lc.split()) <= 4:
            mapa_temas = {
                "Info_Tutor": "la tutoría académica y el tutor",
                "Cursos_Semestre": "los cursos y la malla curricular",
                "Tramites": "los trámites universitarios",
                "Bienestar": "el bienestar, salud y comedor",
                "Practicas": "las prácticas preprofesionales",
                "Reglamentos": "el reglamento académico"
            }
            sustantivo = mapa_temas.get(tema, tema)
            return f"Sobre {sustantivo}: {mensaje}"
            
        return mensaje

context_manager = ContextManager()
