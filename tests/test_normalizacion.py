import sys
import os

# Añadir el directorio raiz al path para poder importar backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.services.tts.normalizador import normalizador_tts

def probar_normalizacion():
    casos = [
        ("Estudio en la UNSAAC", "Estudio en la Universidad Nacional de San Antonio Abad del Cusco"),
        ("El art. 5 dice que nro. 10 es pag. 1", "El artículo 5 dice que número 10 es página 1"),
        ("Ingeniería IIS es la mejor", "Ingeniería Ingeniería Informática y de Sistemas es la mejor"),
        ("Tengo 100% de beca & ayuda + libros", "Tengo 100 por ciento de beca y ayuda más libros"),
        ("Revisa esto en http://google.com", "Revisa esto en"),
        ("**Importante**: _No_ olvidar #nada", "Importante: No olvidar nada")
    ]
    
    print("\n--- Probando Normalizador TTS ---")
    exitos = 0
    for original, esperado in casos:
        resultado = normalizador_tts.normalizar(original)
        # Comparacion flexible de espacios
        paso = resultado.lower() == esperado.lower()
        status = "PASÓ" if paso else "FALLÓ"
        print(f"Original: '{original}'")
        print(f"Resultado: '{resultado}'")
        print(f"Esperado:  '{esperado}' -> {status}\n")
        if paso:
            exitos += 1
            
    print(f"Resultado: {exitos}/{len(casos)} pruebas exitosas.")

if __name__ == "__main__":
    probar_normalizacion()
