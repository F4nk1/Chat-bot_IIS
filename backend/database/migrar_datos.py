import json
import os
from backend.database.gestion_bd import obtener_conexion, inicializar_base_de_datos
from backend.services.nlp.preprocess import preprocesar

def migrar_datos():
    inicializar_base_de_datos()
    
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    
    # Limpiar tabla actual para evitar duplicados en la migración inicial
    cursor.execute("DELETE FROM conocimiento")
    
    ruta_base_datos = "data"
    categorias = ["faq", "reglamentos", "servicios", "tutorias"]
    
    registros_insertados = 0
    
    for categoria in categorias:
        ruta_categoria = os.path.join(ruta_base_datos, categoria)
        if not os.path.exists(ruta_categoria):
            continue
            
        for archivo in os.listdir(ruta_categoria):
            if archivo.endswith(".json"):
                ruta_archivo = os.path.join(ruta_categoria, archivo)
                try:
                    with open(ruta_archivo, "r", encoding="utf-8") as f:
                        contenido = json.load(f)
                        if isinstance(contenido, list):
                            for item in contenido:
                                pregunta = item["pregunta"]
                                respuesta = item["respuesta"]
                                cat = item.get("categoria", categoria.capitalize())
                                pregunta_limpia = preprocesar(pregunta)
                                
                                cursor.execute(
                                    "INSERT INTO conocimiento (categoria, pregunta, respuesta, pregunta_limpia) VALUES (?, ?, ?, ?)",
                                    (cat, pregunta, respuesta, pregunta_limpia)
                                )
                                registros_insertados += 1
                except Exception as e:
                    print(f"Error migrando {ruta_archivo}: {e}")
    
    conexion.commit()
    conexion.close()
    print(f"Migración completada. Se insertaron {registros_insertados} registros.")

if __name__ == "__main__":
    migrar_datos()
