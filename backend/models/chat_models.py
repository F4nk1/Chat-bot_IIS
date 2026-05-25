from pydantic import BaseModel


class SolicitudChat(BaseModel):
    mensaje: str


class RespuestaChat(BaseModel):
    pregunta: str
    respuesta: str
    categoria: str
    confianza: float
