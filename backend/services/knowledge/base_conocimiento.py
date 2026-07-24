from backend.database.bd_gestion import obtener_conexion

class KnowledgeBase:
    """
    Clase equivalente a KnowledgeBase segun requerimientos.
    Gestiona el acceso a la base de datos de conocimiento (FAQ y Reglamentos).
    """
    @staticmethod
    def obtener_todo():
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        cursor.execute("SELECT id, codigo_regla, categoria, pregunta, respuesta, pregunta_limpia, enlace_url, enlace_texto, fuente FROM conocimiento")
        filas = cursor.fetchall()
        conexion.close()
        return filas

    @staticmethod
    def buscar_por_categoria(categoria: str):
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        cursor.execute(
            "SELECT pregunta, respuesta FROM conocimiento WHERE categoria = ?", 
            (categoria,)
        )
        filas = cursor.fetchall()
        conexion.close()
        return filas

    @staticmethod
    def obtener_por_id(id_conocimiento: int):
        """Busca una entrada específica en la base de conocimientos por su ID."""
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        cursor.execute(
            "SELECT id, categoria, pregunta, respuesta FROM conocimiento WHERE id = ?", 
            (id_conocimiento,)
        )
        fila = cursor.fetchone()
        conexion.close()
        return dict(fila) if fila else None

    @staticmethod
    def insertar(pregunta: str, respuesta: str, categoria: str):
        """Inserta un nuevo conocimiento en la base de datos."""
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        # Generar un pregunta limpia sencilla (minúsculas, sin signos básicos)
        pregunta_limpia = pregunta.lower().replace("?", "").replace("¿", "").strip()
        cursor.execute(
            "INSERT INTO conocimiento (categoria, pregunta, respuesta, pregunta_limpia) VALUES (?, ?, ?, ?)",
            (categoria, pregunta, respuesta, pregunta_limpia)
        )
        conexion.commit()
        conexion.close()
