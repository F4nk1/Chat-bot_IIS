import csv
import io
import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from backend.database.bd_gestion import obtener_conexion
from backend.services.retrieval.motor_embeddings import motor_embeddings

enrutador = APIRouter(prefix="/admin", tags=["admin"])

class NuevoConocimiento(BaseModel):
    pregunta: str
    respuesta: str
    categoria: str

@enrutador.post("/conocimiento")
def agregar_conocimiento(datos: NuevoConocimiento):
    """
    CRUD: Agrega nueva regla/pregunta a la Base de Datos y sincroniza ChromaDB 
    en tiempo real sin reiniciar el servidor.
    """
    try:
        motor_embeddings.agregar_documento(datos.pregunta, datos.respuesta, datos.categoria)
        return {"mensaje": "Conocimiento agregado y motor sincronizado exitosamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al agregar conocimiento: {e}")

@enrutador.get("/exportar-dataset")
def exportar_dataset():
    """
    Exporta la base de conocimientos a un formato JSONL (Prompt -> Completion)
    ideal para entrenar SLMs in-house (Fine-tuning con formato instruccional).
    """
    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        cursor.execute("SELECT pregunta, respuesta, categoria FROM conocimiento")
        filas = cursor.fetchall()
        conexion.close()

        output = io.StringIO()
        for fila in filas:
            # Formato estándar de instruction-tuning (Alpaca/Chat)
            registro = {
                "messages": [
                    {"role": "system", "content": f"Eres el asistente académico de la UNSAAC. Categoría de la consulta: {fila['categoria']}"},
                    {"role": "user", "content": fila["pregunta"]},
                    {"role": "assistant", "content": fila["respuesta"]}
                ]
            }
            output.write(json.dumps(registro, ensure_ascii=False) + "\n")

        output.seek(0)
        
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="application/jsonl",
            headers={"Content-Disposition": "attachment; filename=dataset_entrenamiento_unsaac.jsonl"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al exportar dataset: {e}")

@enrutador.get("/exportar-logs")
def exportar_logs():
    """
    Exporta el historial de interacciones a un archivo CSV.
    Incluye: Timestamp, Rol, Contenido, Intencion y Valoracion (si existe).
    """
    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        
        # Consulta para obtener mensajes con su valoracion (si la tienen)
        query = """
            SELECT 
                m.fecha_creacion, 
                m.rol, 
                m.contenido, 
                m.intencion, 
                v.puntuacion as valoracion
            FROM mensajes m
            LEFT JOIN valoraciones v ON m.id = v.mensaje_id
            ORDER BY m.fecha_creacion DESC
        """
        cursor.execute(query)
        filas = cursor.fetchall()
        conexion.close()

        # Crear el CSV en memoria
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Cabecera
        writer.writerow(["Timestamp", "Rol", "Contenido", "Intencion", "Valoracion"])
        
        for fila in filas:
            writer.writerow([
                fila["fecha_creacion"],
                fila["rol"],
                fila["contenido"].replace("\n", " "), # Limpiar saltos de linea para el CSV
                fila["intencion"] or "N/A",
                fila["valoracion"] or "Sin calificar"
            ])

        output.seek(0)
        
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=logs_interacciones.csv"}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al exportar logs: {e}")
