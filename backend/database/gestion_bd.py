import sqlite3
import os

RUTA_BASE_DATOS = "backend/database/chatbot.db"

def obtener_conexion():
    # Asegurar que el directorio existe
    os.makedirs(os.path.dirname(RUTA_BASE_DATOS), exist_ok=True)
    
    conexion = sqlite3.connect(RUTA_BASE_DATOS)
    conexion.row_factory = sqlite3.Row
    return conexion

def inicializar_base_de_datos():
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS conocimiento (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            categoria TEXT NOT NULL,
            pregunta TEXT NOT NULL,
            respuesta TEXT NOT NULL,
            pregunta_limpia TEXT
        )
    """)
    
    conexion.commit()
    conexion.close()

if __name__ == "__main__":
    inicializar_base_de_datos()
    print("Base de datos inicializada correctamente.")
