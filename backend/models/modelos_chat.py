from pydantic import BaseModel
from typing import List, Dict, Optional


class SolicitudChat(BaseModel):
    mensaje: str
    historial: Optional[List[Dict[str, str]]] = []


class RespuestaChat(BaseModel):
    pregunta: str
    respuesta: str
    categoria: str
    confianza: float
    audio_url: Optional[str] = None
