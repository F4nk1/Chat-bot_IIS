from backend.services.retrieval.retriever import retriever


def ask_question(message: str):

    result = retriever.search(message)

    if result["confidence"] < 0.2:
        return {
            "answer": "No encontré información relacionada.",
            "confidence": result["confidence"]
        }

    return result