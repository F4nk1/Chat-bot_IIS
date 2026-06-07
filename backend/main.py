import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.routes.chat import enrutador as enrutador_chat
from backend.routes.conversaciones import enrutador as enrutador_conversaciones
from backend.routes.tts import enrutador as enrutador_tts
from backend.routes.feedback import enrutador as enrutador_feedback
from backend.routes.admin import enrutador as enrutador_admin
from backend.routes.reglamento import enrutador as enrutador_reglamento
from backend.config.settings import ajustes

# Inicializacion de la aplicacion FastAPI
aplicacion = FastAPI(
    title="API del Chatbot Academico",
    description="Servicio backend para el chatbot de la institucion.",
    version="1.0.0"
)

# Configuracion de CORS para permitir peticiones desde el frontend
aplicacion.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion de enrutadores
aplicacion.include_router(enrutador_chat)
aplicacion.include_router(enrutador_conversaciones)
aplicacion.include_router(enrutador_tts)
aplicacion.include_router(enrutador_feedback)
aplicacion.include_router(enrutador_admin)
aplicacion.include_router(enrutador_reglamento)

# Montaje de archivos estaticos para el frontend
aplicacion.mount("/frontend", StaticFiles(directory="frontend"), name="frontend")

# Montaje para archivos de audio generados
if not os.path.exists(ajustes.CARPETA_AUDIO):
    os.makedirs(ajustes.CARPETA_AUDIO, exist_ok=True)
aplicacion.mount("/static/audio", StaticFiles(directory=ajustes.CARPETA_AUDIO), name="audio")

@aplicacion.get("/")
def inicio():
    """Ruta de bienvenida y verificacion de estado."""
    return {
        "mensaje": "API del Chatbot Academico funcionando correctamente",
        "estado": "activo"
    }
