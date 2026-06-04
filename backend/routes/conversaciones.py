from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime

from backend.models.modelos_historial import (
    Conversacion, 
    ConversacionCrear, 
    Mensaje, 
    MensajeCrear,
    ConversacionDetalle
)
from backend.database import bd_historial as historial_bd

enrutador = APIRouter(prefix="/conversaciones", tags=["conversaciones"])


@enrutador.post("/", response_model=Conversacion)
def crear_nueva_conversacion(conversacion: ConversacionCrear):
    id_conv = historial_bd.crear_conversacion(conversacion)
    nueva = historial_bd.obtener_conversacion(id_conv)
    return nueva


@enrutador.get("/", response_model=List[Conversacion])
def listar_conversaciones():
    return historial_bd.obtener_conversaciones()


@enrutador.get("/{id_conversacion}", response_model=ConversacionDetalle)
def obtener_detalle_conversacion(id_conversacion: int):
    conv = historial_bd.obtener_conversacion(id_conversacion)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversación no encontrada")
    
    mensajes = historial_bd.obtener_mensajes_conversacion(id_conversacion)
    return {**conv, "mensajes": mensajes}


@enrutador.post("/{id_conversacion}/mensajes", response_model=Mensaje)
def guardar_mensaje(id_conversacion: int, mensaje: MensajeCrear):
    # Asegurar que el conversacion_id coincide con la ruta
    mensaje.conversacion_id = id_conversacion
    id_mensaje = historial_bd.agregar_mensaje(mensaje)
    
    return {
        "id": id_mensaje,
        "conversacion_id": id_conversacion,
        "rol": mensaje.rol,
        "contenido": mensaje.contenido,
        "fecha_creacion": datetime.now()
    }
