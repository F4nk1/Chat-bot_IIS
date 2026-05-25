from backend.services.retrieval.retriever import retriever
from backend.config.settings import settings

def ask_question(message: str):

    result = retriever.search(message)

    if result["confidence"] < settings.SIMILARITY_THRESHOLD:
        return {
            "answer": "No encontré información relacionada.",
            "confidence": result["confidence"]
        }

    return result