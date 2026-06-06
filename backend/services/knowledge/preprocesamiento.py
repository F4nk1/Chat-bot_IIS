import re
import unicodedata

# Lista basica de stopwords en español
PALABRAS_VACIAS = {
    "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "a", "al", "en", "con", "por", "para", 
    "como", "y", "o", "u", "si", "no", "es", "son", "fue", "eran", "mi", "tu", "su", "sus", "que", "qué", 
    "quien", "quienes", "cual", "cuales", "donde", "cuando", "como", "cómo", "hay", "tiene", "tienen",
    "puedo", "podría", "quisiera", "saber", "información", "sobre", "acerca", "de", "esta", "este", "esto"
}

def eliminar_acentos(texto: str) -> str:
    """Elimina tildes y dieresis de un texto."""
    if not texto:
        return ""
    # Normalizar a NFD para separar caracteres de acentos
    texto_nfd = unicodedata.normalize('NFD', texto)
    # Filtrar solo caracteres que no sean marcas de combinacion (acentos)
    texto_sin_acentos = "".join([c for c in texto_nfd if unicodedata.category(c) != 'Mn'])
    return texto_sin_acentos

def preprocesar(texto: str) -> str:
    """Limpia y normaliza el texto para busqueda (minusculas, sin acentos, sin puntuacion)."""
    if not texto:
        return ""
        
    # Convertir a minusculas
    texto = texto.lower()
    
    # Eliminar acentos
    texto = eliminar_acentos(texto)

    # Eliminar puntuacion y caracteres especiales (ahora que no hay tildes ni ñ)
    # Mantenemos solo letras de la a-z y numeros
    texto = re.sub(r"[^a-z0-9\s]", "", texto)
    
    # Tokenizacion simple por espacios
    palabras = texto.split()
    
    # Filtrar palabras vacias (normalizando tambien las stopwords para que coincidan)
    palabras_vacias_limpias = {eliminar_acentos(p) for p in PALABRAS_VACIAS}
    palabras_filtradas = [p for p in palabras if p not in palabras_vacias_limpias]
    
    # Unir de nuevo
    resultado = " ".join(palabras_filtradas)

    return resultado.strip()
