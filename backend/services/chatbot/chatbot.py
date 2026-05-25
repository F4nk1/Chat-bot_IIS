from backend.services.retrieval.retriever import recuperador
from backend.config.settings import ajustes


def obtener_respuesta(mensaje: str):

    resultado = recuperador.buscar(mensaje)

    if resultado["confianza"] < ajustes.UMBRAL_SIMILITUD:
        return {
            "pregunta": mensaje,
            "respuesta": "Lo siento, no tengo una respuesta precisa para esa pregunta. ¿Podrías ser más específico?",
            "categoria": "Desconocido",
            "confianza": resultado["confianza"]
        }

    return resultado
