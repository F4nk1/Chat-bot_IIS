import json
import os
from backend.database.bd_gestion import obtener_conexion, inicializar_base_de_datos
from backend.services.knowledge.preprocesamiento import preprocesar

def migrar_datos():
    """Carga los datos desde archivos JSON a la base de datos SQLite de forma dinamica."""
    inicializar_base_de_datos()
    
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    
    # Limpiar tabla actual para evitar duplicados en la migracion inicial
    cursor.execute("DELETE FROM conocimiento")
    
    directorio_datos = "data"
    
    # Detectar carpetas automaticamente en el directorio data/
    if not os.path.exists(directorio_datos):
        print(f"Error: El directorio '{directorio_datos}' no existe.")
        return

    carpetas_categorias = [d for d in os.listdir(directorio_datos) if os.path.isdir(os.path.join(directorio_datos, d))]
    
    total_insertados = 0
    archivos_procesados = 0
    errores = []
    
    for nombre_categoria in carpetas_categorias:
        ruta_categoria = os.path.join(directorio_datos, nombre_categoria)
            
        for nombre_archivo in os.listdir(ruta_categoria):
            if nombre_archivo.endswith(".json"):
                ruta_completa = os.path.join(ruta_categoria, nombre_archivo)
                try:
                    with open(ruta_completa, "r", encoding="utf-8") as archivo_leido:
                        datos_json = json.load(archivo_leido)
                        if isinstance(datos_json, list):
                            for elemento in datos_json:
                                if "pregunta" not in elemento or "respuesta" not in elemento:
                                    continue
                                    
                                pregunta = elemento["pregunta"]
                                respuesta = elemento["respuesta"]
                                # Usar categoria del JSON o el nombre de la carpeta por defecto
                                cat = elemento.get("categoria", nombre_categoria.capitalize())
                                pregunta_limpia = preprocesar(pregunta)
                                
                                enlace_url = ""
                                enlace_texto = ""
                                if "enlace" in elemento and isinstance(elemento["enlace"], dict):
                                    enlace_url = elemento["enlace"].get("url", "")
                                    enlace_texto = elemento["enlace"].get("texto", "")
                                    
                                fuente = ""
                                if "fuente" in elemento and isinstance(elemento["fuente"], dict):
                                    fuente = elemento["fuente"].get("referencia", "")
                                
                                codigo_regla = elemento.get("id", "")
                                cursor.execute(
                                    "INSERT INTO conocimiento (codigo_regla, categoria, pregunta, respuesta, pregunta_limpia, enlace_url, enlace_texto, fuente) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                                    (codigo_regla, cat, pregunta, respuesta, pregunta_limpia, enlace_url, enlace_texto, fuente)
                                )
                                total_insertados += 1
                            archivos_procesados += 1
                except Exception as error:
                    print(f"Error migrando {ruta_completa}: {error}")
                    errores.append((ruta_completa, str(error)))

    if errores:
        conexion.rollback()
        conexion.close()
        detalle = "; ".join(f"{ruta}: {error}" for ruta, error in errores)
        raise RuntimeError(
            f"La migracion fue cancelada; fallaron {len(errores)} archivo(s). {detalle}"
        )
    
    conexion.commit()
    conexion.close()
    print(f"Migracion completada exitosamente.")
    print(f"Archivos procesados: {archivos_procesados}")
    print(f"Total de registros insertados: {total_insertados}")

if __name__ == "__main__":
    migrar_datos()
