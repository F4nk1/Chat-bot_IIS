from backend.services.knowledge.base_conocimiento import KnowledgeBase

class GestorContextoUniversal:
    """
    Reemplaza al antiguo RAG (ChromaDB + BM25).
    En su lugar, carga toda la base de datos de reglamentos y manuales
    en un solo gran String (Contexto Universal) para inyectarlo directo
    a la memoria masiva de Gemini.
    """
    def __init__(self):
        self.contexto_completo = ""
        self.cargar_todo_el_conocimiento()

    def cargar_todo_el_conocimiento(self):
        """Lee la base de datos SQL y la concatena en un solo super documento estructurado."""
        filas = KnowledgeBase.obtener_todo()
        if not filas:
            print("Advertencia: No hay datos en la base de datos de conocimiento.")
            return

        bloques = []
        bloques.append("DOCUMENTO OFICIAL DE REGLAMENTOS Y TRÁMITES DE LA UNSAAC\n"
                       "==========================================================\n")
        
        for fila in filas:
            categoria = fila["categoria"]
            tema = fila["pregunta"]
            contenido = fila["respuesta"]
            
            # Enriquecer con metadatos si existen
            enlace_url = fila["enlace_url"] if "enlace_url" in fila.keys() else None
            fuente = fila["fuente"] if "fuente" in fila.keys() else None
            
            bloque = f"--- [{categoria.upper()}] TEMA: {tema} ---\n{contenido}\n"
            if enlace_url:
                enlace_texto = fila["enlace_texto"] if "enlace_texto" in fila.keys() and fila["enlace_texto"] else "Enlace oficial"
                bloque += f"Referencia: [{enlace_texto}]({enlace_url})\n"
            if fuente:
                bloque += f"Fuente Legal: {fuente}\n"
            
            bloques.append(bloque)
            
        self.contexto_completo = "\n".join(bloques)
        print(f"Contexto Universal Cargado: {len(self.contexto_completo)} caracteres.")

    def obtener_contexto_universal(self) -> str:
        return self.contexto_completo

    def agregar_documento(self, pregunta: str, respuesta: str, categoria: str):
        """Añade un nuevo documento en tiempo real y recarga el contexto masivo."""
        KnowledgeBase.insertar(pregunta, respuesta, categoria)
        self.cargar_todo_el_conocimiento()

# Instancia global (Mantenemos el nombre 'motor_embeddings' para no romper imports en otros archivos si los hay)
motor_embeddings = GestorContextoUniversal()
