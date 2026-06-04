import json
import os
from backend.database.bd_gestion import obtener_conexion, inicializar_base_de_datos
from backend.services.knowledge.preprocesamiento import preprocesar

def migrar_datos():
    """Carga los datos desde archivos JSON a la base de datos SQLite."""
    inicializar_base_de_datos()
    
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    
    # Limpiar tabla actual para evitar duplicados en la migracion inicial
    cursor.execute("DELETE FROM conocimiento")
    
    directorio_datos = "data"
    carpetas_categorias = ["faq", "reglamentos", "servicios", "tutorias"]
    
    total_insertados = 0
    
    for nombre_categoria in carpetas_categorias:
        ruta_categoria = os.path.join(directorio_datos, nombre_categoria)
        if not os.path.exists(ruta_categoria):
            continue
            
        for nombre_archivo in os.listdir(ruta_categoria):
            if nombre_archivo.endswith(".json"):
                ruta_completa = os.path.join(ruta_categoria, nombre_archivo)
                try:
                    with open(ruta_completa, "r", encoding="utf-8") as archivo_leido:
                        datos_json = json.load(archivo_leido)
                        if isinstance(datos_json, list):
                            for elemento in datos_json:
                                pregunta = elemento["pregunta"]
                                respuesta = elemento["respuesta"]
                                cat = elemento.get("categoria", nombre_categoria.capitalize())
                                pregunta_limpia = preprocesar(pregunta)
                                
                                cursor.execute(
                                    "INSERT INTO conocimiento (categoria, pregunta, respuesta, pregunta_limpia) VALUES (?, ?, ?, ?)",
                                    (cat, pregunta, respuesta, pregunta_limpia)
                                )
                                total_insertados += 1
                except Exception as error:
                    print(f"Error migrando {ruta_completa}: {error}")
    
    conexion.commit()
    conexion.close()
    print(f"Migracion completada. Se insertaron {total_insertados} registros.")

if __name__ == "__main__":
    migrar_datos()
