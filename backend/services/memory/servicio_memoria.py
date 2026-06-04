from typing import Optional, List, Dict
from backend.database.bd_gestion import obtener_conexion


def guardar_memoria(usuario_id: str, clave: str, valor: str) -> bool:
    """
    Guarda o actualiza un dato en la memoria del usuario.
    """
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    try:
        cursor.execute(
            """
            INSERT INTO memoria (usuario_id, clave, valor, fecha_actualizacion) 
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(usuario_id, clave) DO UPDATE SET 
                valor = excluded.valor,
                fecha_actualizacion = CURRENT_TIMESTAMP
            """,
            (usuario_id, clave, valor)
        )
        conexion.commit()
        return True
    except Exception as error:
        print(f"Error al guardar en memoria: {error}")
        return False
    finally:
        conexion.close()


def obtener_memoria(usuario_id: str, clave: str) -> Optional[str]:
    """
    Recupera un valor especifico de la memoria del usuario.
    """
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    try:
        cursor.execute(
            "SELECT valor FROM memoria WHERE usuario_id = ? AND clave = ?",
            (usuario_id, clave)
        )
        fila = cursor.fetchone()
        return fila["valor"] if fila else None
    except Exception as error:
        print(f"Error al obtener memoria: {error}")
        return None
    finally:
        conexion.close()


def listar_memorias(usuario_id: str) -> List[Dict[str, str]]:
    """
    Lista todos los recuerdos almacenados para un usuario.
    """
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    try:
        cursor.execute(
            "SELECT clave, valor, fecha_actualizacion FROM memoria WHERE usuario_id = ?",
            (usuario_id,)
        )
        filas = cursor.fetchall()
        return [dict(fila) for fila in filas]
    except Exception as error:
        print(f"Error al listar memorias: {error}")
        return []
    finally:
        conexion.close()
