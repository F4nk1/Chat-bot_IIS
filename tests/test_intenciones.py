import sys
import os

# Añadir el directorio raiz al path para poder importar backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.services.knowledge.detector_intenciones import detector_intenciones

def probar_intenciones():
    casos = [
        ("¿Cómo solicito una tutoria?", "Tutorias"),
        ("Quiero información sobre las practicas pre profesionales", "Practicas"),
        ("¿Donde esta el comedor universitario?", "Bienestar"),
        ("Necesito ver el reglamento de estudios", "Reglamentos"),
        ("¿Cuales son los requisitos de matricula?", "Tramites"),
        ("Hola, buenos días", "General")
    ]
    
    print("\n--- Probando Detector de Intenciones ---")
    exitos = 0
    for frase, esperada in casos:
        detectada = detector_intenciones.detectar(frase)
        resultado = "PASÓ" if detectada == esperada else "FALLÓ"
        print(f"Frase: '{frase}' | Esperada: {esperada} | Detectada: {detectada} -> {resultado}")
        if detectada == esperada:
            exitos += 1
            
    print(f"\nResultado: {exitos}/{len(casos)} pruebas exitosas.")

if __name__ == "__main__":
    probar_intenciones()
