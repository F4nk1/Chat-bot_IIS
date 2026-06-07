from backend.services.retrieval.motor_embeddings import motor_embeddings
from backend.services.knowledge.detector_intenciones import detector_intenciones
from backend.config.settings import ajustes

class ChatbotEngine:
    """
    Clase equivalente a ChatbotEngine segun requerimientos.
    Orquesta la deteccion de intenciones y la recuperacion de respuesta.
    """
    @staticmethod
    def obtener_respuesta(mensaje: str):
        # 1. Detectar intencion (IntentDetector)
        intencion = detector_intenciones.detectar(mensaje)

        # 2. Recuperacion (EmbeddingEngine)
        resultado = motor_embeddings.buscar(mensaje)

        if resultado["confianza"] < ajustes.UMBRAL_SIMILITUD:
            return {
                "pregunta": mensaje,
                "respuesta": "Lo siento, no tengo una respuesta precisa para esa pregunta. ¿Podrías ser más específico?",
                "categoria": intencion,
                "confianza": resultado["confianza"]
            }

        resultado["intencion_detectada"] = intencion
        return resultado

# Alias para mantener compatibilidad si es necesario, aunque se recomienda usar la clase
obtener_respuesta = ChatbotEngine.obtener_respuesta
