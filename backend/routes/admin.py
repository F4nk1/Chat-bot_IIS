import csv
import io
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from backend.database.bd_gestion import obtener_conexion

enrutador = APIRouter(prefix="/admin", tags=["admin"])

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
