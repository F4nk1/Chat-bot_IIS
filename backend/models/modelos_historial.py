from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class MensajeBase(BaseModel):
    rol: str
    contenido: str
    intencion: Optional[str] = None


class MensajeCrear(MensajeBase):
    conversacion_id: int


class Mensaje(MensajeBase):
    id: int
    conversacion_id: int
    intencion: Optional[str] = None
    fecha_creacion: datetime

    class Config:
        from_attributes = True


class ConversacionBase(BaseModel):
    titulo: Optional[str] = "Nueva Conversación"


class ConversacionCrear(ConversacionBase):
    pass


class Conversacion(ConversacionBase):
    id: int
    fecha_creacion: datetime

    class Config:
        from_attributes = True


class ConversacionDetalle(Conversacion):
    mensajes: List[Mensaje] = []
