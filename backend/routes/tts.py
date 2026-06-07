from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.services.tts.servicio_tts import servicio_tts
from backend.config.settings import ajustes

enrutador = APIRouter(prefix="/tts", tags=["TTS"])

class SolicitudTTS(BaseModel):
    texto: str

@enrutador.post("/generar")
def generar_voz(solicitud: SolicitudTTS):
    """
    Recibe un texto y genera un archivo de audio ONNX.
    Retorna la URL para acceder al audio.
    """
    if not solicitud.texto:
        raise HTTPException(status_code=400, detail="El texto no puede estar vacio.")

    # Verificar si el servicio esta disponible antes de intentar generar
    if not servicio_tts._voz:
        raise HTTPException(
            status_code=503, 
            detail="El servicio de voz no esta disponible (modelo ONNX no encontrado en el servidor)."
        )

    nombre_archivo = servicio_tts.generar_audio(solicitud.texto)
    
    if not nombre_archivo:
        raise HTTPException(status_code=500, detail="Error interno al procesar la síntesis de voz.")

    # Construir URL (asumiendo que los archivos se sirven desde /static/audio)
    url_audio = f"/static/audio/{nombre_archivo}"
    
    return {
        "url": url_audio,
        "nombre_archivo": nombre_archivo
    }
