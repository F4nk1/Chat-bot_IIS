from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.chat import enrutador as enrutador_chat

app = FastAPI(title="API del Chatbot Académico")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(enrutador_chat)


@app.get("/")
def inicio():
    return {
        "mensaje": "API del Chatbot Académico funcionando correctamente"
    }
