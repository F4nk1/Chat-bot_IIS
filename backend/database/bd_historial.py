from typing import List, Optional
from backend.database.bd_gestion import obtener_conexion
from backend.models.modelos_historial import Conversacion, ConversacionCrear, Mensaje, MensajeCrear


def crear_conversacion(conversacion: ConversacionCrear) -> int:
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    cursor.execute(
        "INSERT INTO conversaciones (titulo) VALUES (?)",
        (conversacion.titulo,)
    )
    id_conversacion = cursor.lastrowid
    conexion.commit()
    conexion.close()
    return id_conversacion


def obtener_conversaciones() -> List[dict]:
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM conversaciones ORDER BY fecha_creacion DESC")
    filas = cursor.fetchall()
    resultado = [dict(fila) for fila in filas]
    conexion.close()
    return resultado


def obtener_conversacion(id_conversacion: int) -> Optional[dict]:
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM conversaciones WHERE id = ?", (id_conversacion,))
    fila = cursor.fetchone()
    conexion.close()
    return dict(fila) if fila else None


def agregar_mensaje(mensaje: MensajeCrear) -> int:
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    cursor.execute(
        "INSERT INTO mensajes (conversacion_id, rol, contenido, intencion) VALUES (?, ?, ?, ?)",
        (mensaje.conversacion_id, mensaje.rol, mensaje.contenido, mensaje.intencion)
    )
    id_mensaje = cursor.lastrowid
    conexion.commit()
    conexion.close()
    return id_mensaje


def obtener_mensajes_conversacion(id_conversacion: int) -> List[dict]:
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    cursor.execute(
        "SELECT * FROM mensajes WHERE conversacion_id = ? ORDER BY fecha_creacion ASC",
        (id_conversacion,)
    )
    filas = cursor.fetchall()
    resultado = [dict(fila) for fila in filas]
    conexion.close()
    return resultado


def eliminar_conversacion(id_conversacion: int) -> bool:
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    cursor.execute("DELETE FROM conversaciones WHERE id = ?", (id_conversacion,))
    cambios = conexion.total_changes
    conexion.commit()
    conexion.close()
    return cambios > 0
