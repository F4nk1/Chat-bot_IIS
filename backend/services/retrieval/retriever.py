import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from backend.services.nlp.preprocess import preprocess

FAQ_PATH = "data/faq/faq.json"


class Retriever:

    def __init__(self):
        self.data = self.load_data()

        self.questions = [
            preprocess(item["pregunta"])
            for item in self.data
        ]

        self.vectorizer = TfidfVectorizer()

        self.question_vectors = self.vectorizer.fit_transform(
            self.questions
        )

    def load_data(self):
        with open(FAQ_PATH, "r", encoding="utf-8") as file:
            return json.load(file)

    def search(self, query: str):

        clean_query = preprocess(query)

        query_vector = self.vectorizer.transform([clean_query])

        similarities = cosine_similarity(
            query_vector,
            self.question_vectors
        )

        best_index = similarities.argmax()

        best_score = similarities[0][best_index]

        result = self.data[best_index]

        return {
            "question": result["pregunta"],
            "answer": result["respuesta"],
            "category": result["categoria"],
            "confidence": float(best_score)
        }


retriever = Retriever()