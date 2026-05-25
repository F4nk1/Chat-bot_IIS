from fastapi import APIRouter

from backend.models.chat_models import SolicitudChat
from backend.services.chatbot.chatbot import obtener_respuesta

enrutador = APIRouter()


@enrutador.post("/chat")
def chat(solicitud: SolicitudChat):

    respuesta = obtener_respuesta(solicitud.mensaje)

    return respuesta
