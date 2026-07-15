import os
from dotenv import load_dotenv

load_dotenv()

# Base directory of the project
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class Configuracion:
    NOMBRE_APP = os.getenv("NOMBRE_APP", "Chatbot Académico")
    HOST_API = os.getenv("API_HOST", "0.0.0.0")
    PUERTO_API = int(os.getenv("API_PORT", 8000))
    DEPURACION = os.getenv("DEBUG") == "True"
    RUTA_FAQ = os.path.abspath(os.getenv("FAQ_PATH", os.path.join(BASE_DIR, "data", "faq", "faq.json")))
    UMBRAL_SIMILITUD = float(os.getenv("SIMILARITY_THRESHOLD", 0.5))
    
    # TTS Configuration
    RUTA_MODELO_TTS = os.path.abspath(os.getenv("TTS_MODEL_PATH", os.path.join(BASE_DIR, "backend", "assets", "models", "es_ES-sharvard-medium.onnx")))
    RUTA_CONFIG_TTS = os.path.abspath(os.getenv("TTS_CONFIG_PATH", os.path.join(BASE_DIR, "backend", "assets", "models", "es_ES-sharvard-medium.onnx.json")))
    CARPETA_AUDIO = os.path.abspath(os.getenv("TTS_OUTPUT_DIR", os.path.join(BASE_DIR, "backend", "static", "audio")))


ajustes = Configuracion()

