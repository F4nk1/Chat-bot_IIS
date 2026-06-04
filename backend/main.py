from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.routes.chat import enrutador as enrutador_chat
from backend.routes.conversaciones import enrutador as enrutador_conversaciones

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

# Montaje de archivos estaticos para el frontend
aplicacion.mount("/frontend", StaticFiles(directory="frontend"), name="frontend")

@aplicacion.get("/")
def inicio():
    """Ruta de bienvenida y verificacion de estado."""
    return {
        "mensaje": "API del Chatbot Academico funcionando correctamente",
        "estado": "activo"
    }

