from backend.services.retrieval.motor_embeddings import motor_embeddings
from backend.services.knowledge.detector_intenciones import detector_intenciones
from backend.config.settings import ajustes

class ChatbotEngine:
    """
    Orquesta la detección de intenciones, la recuperación de información 
    y la generación de respuesta.
    """
    @staticmethod
    def extraer_tema_previo(historial: list) -> str:
        if not historial:
            return ""
        
        # Buscar en el historial hacia atrás el tema principal del usuario
        for msg in reversed(historial):
            # En el formato de Ollama, la clave es 'role', pero en el frontend es 'rol'
            rol = msg.get("role") or msg.get("rol")
            contenido = msg.get("content") or msg.get("contenido")
            if rol in ["user", "usuario"] and contenido:
                cont = contenido.lower()
                if "comedor" in cont or "beca" in cont:
                    return "la Beca Comedor"
                elif "salud" in cont or "bienestar" in cont or "médico" in cont or "medico" in cont:
                    return "el Centro Universitario de Salud"
                elif "tutoria" in cont or "tutoría" in cont or "tutor" in cont:
                    return "la tutoría académica"
                elif "practica" in cont or "práctica" in cont:
                    return "las prácticas preprofesionales"
                elif "matricula" in cont or "matrícula" in cont:
                    return "la matrícula"
                elif "reglamento" in cont or "norma" in cont:
                    return "el reglamento académico"
        return ""

    @staticmethod
    def condensar_pregunta(mensaje: str, historial: list = None) -> str:
        if not historial:
            return mensaje
            
        tema_previo = ChatbotEngine.extraer_tema_previo(historial)
        if not tema_previo:
            return mensaje
            
        # Comprobar si el mensaje actual ya es independiente
        mensaje_lc = mensaje.lower()
        if any(k in mensaje_lc for k in ["tutoria", "tutoría", "comedor", "beca", "salud", "práctica", "practica", "matrícula", "matricula"]):
            return mensaje

        # Solo condensamos si tiene pronombres o palabras cortas típicas de seguimiento
        pronombres = ["eso", "esa", "él", "la", "lo", "allí", "ahí", "ellos", "ellas", "aquello", "requisito", "requisitos", "obligatoria", "obligatorio", "cuando", "dónde", "quién", "como", "cómo", "dónde", "donde", "por qué", "porque"]
        if not any(p in mensaje_lc.split() or len(mensaje_lc.split()) <= 4 for p in pronombres):
            return mensaje

        # Reemplazo básico sin LLM para mantener el proceso de automatización
        return f"{tema_previo} {mensaje}"

    @staticmethod
    def obtener_respuesta(mensaje: str, historial: list = None):
        if historial is None:
            historial = []

        # 1. Condensar pregunta para el buscador semántico (RAG contextual)
        mensaje_busqueda = ChatbotEngine.condensar_pregunta(mensaje, historial)

        # 2. Detectar intención basada en la pregunta condensada
        intencion = detector_intenciones.detectar(mensaje_busqueda)

        # 3. Recuperación Semántica con la pregunta condensada
        resultado = motor_embeddings.buscar(mensaje_busqueda)

        # Filtrado inteligente por intención y confianza
        # Si la intención detectada es General y la confianza es menor a 0.75, no inyectamos contexto para evitar falsos positivos
        umbral_aplicado = 0.75 if intencion == "General" else ajustes.UMBRAL_SIMILITUD
        
        # 4. Retorno de respuesta sin LLM (Fallback al método clásico basado en embeddings)
        if resultado["confianza"] < umbral_aplicado:
            respuesta_final = "Lo siento, no encuentro información específica sobre eso en el reglamento académico de la universidad. ¿Podrías ser más específico con tu consulta?"
        else:
            respuesta_final = resultado["respuesta"]

        return {
            "pregunta": mensaje,
            "respuesta": respuesta_final,
            "categoria": intencion,
            "confianza": resultado["confianza"]
        }

# Alias para mantener compatibilidad
obtener_respuesta = ChatbotEngine.obtener_respuesta
