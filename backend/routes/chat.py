import asyncio
import json
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from backend.models.modelos_chat import SolicitudChat
from backend.services.conversation.asistente import obtener_respuesta
from backend.services.tts.servicio_tts import servicio_tts

enrutador = APIRouter()


@enrutador.post("/chat")
def chat(solicitud: SolicitudChat):
    respuesta = obtener_respuesta(solicitud.mensaje)
    
    # Opcional: Generar audio para la respuesta
    nombre_audio = servicio_tts.generar_audio(respuesta["respuesta"])
    if nombre_audio:
        respuesta["audio_url"] = f"/static/audio/{nombre_audio}"
        
    return respuesta


@enrutador.post("/chat/stream")
async def chat_stream(solicitud: SolicitudChat):
    respuesta = obtener_respuesta(solicitud.mensaje)
    contenido = respuesta["respuesta"]

    async def generador_eventos():
        # Simular streaming palabra por palabra
        palabras = contenido.split(" ")
        for i, palabra in enumerate(palabras):
            # Formato SSE: "data: <contenido>\n\n"
            data = {
                "chunk": palabra + (" " if i < len(palabras) - 1 else ""),
                "final": i == len(palabras) - 1
            }
            yield f"data: {json.dumps(data)}\n\n"
            await asyncio.sleep(0.05)  # Pequeño retraso para simular generación

    return StreamingResponse(generador_eventos(), media_type="text/event-stream")
