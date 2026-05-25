import re

def preprocess(text: str) -> str:
    text = text.lower()

    text = re.sub(r"[^a-zA-Záéíóúñ0-9 ]", "", text)

    return text.strip()