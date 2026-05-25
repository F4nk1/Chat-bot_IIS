import re

# Lista básica de stopwords en español
PALABRAS_VACIAS = {
    "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "a", "al", "en", "con", "por", "para", 
    "como", "y", "o", "u", "si", "no", "es", "son", "fue", "eran", "mi", "tu", "su", "sus", "que", "qué", 
    "quien", "quienes", "cual", "cuales", "donde", "cuando", "como", "cómo", "hay", "tiene", "tienen",
    "puedo", "podría", "quisiera", "saber", "información", "sobre", "acerca", "de", "esta", "este", "esto"
}

def preprocesar(texto: str) -> str:
    if not texto:
        return ""
        
    # Convertir a minúsculas
    texto = texto.lower()

    # Eliminar puntuación y caracteres especiales, manteniendo tildes y ñ
    texto = re.sub(r"[^a-záéíóúñ0-9\s]", "", texto)
    
    # Tokenización simple por espacios
    palabras = texto.split()
    
    # Filtrar palabras vacías
    palabras_filtradas = [p for p in palabras if p not in PALABRAS_VACIAS]
    
    # Unir de nuevo
    resultado = " ".join(palabras_filtradas)

    return resultado.strip()
