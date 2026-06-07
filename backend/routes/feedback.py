from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from backend.database.bd_gestion import obtener_conexion

enrutador = APIRouter(prefix="/feedback", tags=["feedback"])

class SolicitudFeedback(BaseModel):
    mensaje_id: int
    puntuacion: int  # 1 o -1
    comentario: Optional[str] = None

@enrutador.post("/")
def registrar_feedback(solicitud: SolicitudFeedback):
    if solicitud.puntuacion not in [1, -1]:
        raise HTTPException(status_code=400, detail="La puntuacion debe ser 1 o -1.")

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        
        # Verificar que el mensaje existe
        cursor.execute("SELECT id FROM mensajes WHERE id = ?", (solicitud.mensaje_id,))
        if not cursor.fetchone():
            conexion.close()
            raise HTTPException(status_code=404, detail="Mensaje no encontrado.")

        cursor.execute(
            "INSERT INTO valoraciones (mensaje_id, puntuacion, comentario) VALUES (?, ?, ?)",
            (solicitud.mensaje_id, solicitud.puntuacion, solicitud.comentario)
        )
        conexion.commit()
        conexion.close()
        
        return {"mensaje": "Feedback registrado correctamente."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al registrar feedback: {e}")
