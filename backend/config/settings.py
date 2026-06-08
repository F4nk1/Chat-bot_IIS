import os
from dotenv import load_dotenv

load_dotenv()


class Configuracion:
    NOMBRE_APP = os.getenv("NOMBRE_APP", "Chatbot Académico")
    HOST_API = os.getenv("API_HOST", "0.0.0.0")
    PUERTO_API = int(os.getenv("API_PORT", 8000))
    DEPURACION = os.getenv("DEBUG") == "True"
    RUTA_FAQ = os.getenv("FAQ_PATH", "data/faq/faq.json")
    UMBRAL_SIMILITUD = float(os.getenv("SIMILARITY_THRESHOLD", 0.5))
    
    # TTS Configuration
    RUTA_MODELO_TTS = os.getenv("TTS_MODEL_PATH", "backend/assets/models/es_ES-sharvard-medium.onnx")
    RUTA_CONFIG_TTS = os.getenv("TTS_CONFIG_PATH", "backend/assets/models/es_ES-sharvard-medium.onnx.json")
    CARPETA_AUDIO = os.getenv("TTS_OUTPUT_DIR", "backend/static/audio")


ajustes = Configuracion()
