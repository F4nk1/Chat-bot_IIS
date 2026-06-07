from typing import Any, Optional
from backend.database.bd_gestion import obtener_conexion

class ConversationSession:
    """
    Clase equivalente a ConversationSession segun requerimientos.
    Gestiona la persistencia de contexto y memoria del usuario.
    """
    def __init__(self, usuario_id: str):
        self.usuario_id = usuario_id

    def guardar_contexto(self, clave: str, valor: str):
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        cursor.execute(
            """
            INSERT INTO memoria (usuario_id, clave, valor) 
            VALUES (?, ?, ?)
            ON CONFLICT(usuario_id, clave) DO UPDATE SET 
                valor = excluded.valor,
                fecha_actualizacion = CURRENT_TIMESTAMP
            """,
            (self.usuario_id, clave, valor)
        )
        conexion.commit()
        conexion.close()

    def obtener_contexto(self, clave: str) -> Optional[str]:
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        cursor.execute(
            "SELECT valor FROM memoria WHERE usuario_id = ? AND clave = ?", 
            (self.usuario_id, clave)
        )
        fila = cursor.fetchone()
        conexion.close()
        return fila["valor"] if fila else None

# Instancia de utilidad (aunque suele ser por usuario)
# servicio_memoria = ConversationSession("default") 
