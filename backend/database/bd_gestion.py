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
            pregunta_limpia TEXT,
            enlace_url TEXT,
            enlace_texto TEXT,
            fuente TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS conversaciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS mensajes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversacion_id INTEGER,
            rol TEXT CHECK(rol IN ('usuario', 'asistente')),
            contenido TEXT NOT NULL,
            intencion TEXT,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (conversacion_id) REFERENCES conversaciones (id) ON DELETE CASCADE
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS memoria (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id TEXT NOT NULL,
            clave TEXT NOT NULL,
            valor TEXT NOT NULL,
            fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(usuario_id, clave)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS valoraciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mensaje_id INTEGER,
            puntuacion INTEGER CHECK(puntuacion IN (1, -1)),
            comentario TEXT,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (mensaje_id) REFERENCES mensajes (id) ON DELETE CASCADE
        )
    """)
    
    conexion.commit()
    conexion.close()

if __name__ == "__main__":
    inicializar_base_de_datos()
    print("Base de datos inicializada correctamente.")
