import sys
from backend.services.conversation.asistente import obtener_respuesta

consultas = [
    "sabes los requisitos para hacer una movilidad estudiantil",
    "que pasaria si jalo un curso",
    "que cursos deberia de llevar para hacer mi tesis",
    "que de alumnos esta a cargo boris chullo",
    "que deberia de haber llevado antes para llevar el curso de sistemas operativos"
]

print("INICIANDO PRUEBAS DE CONTEXTO UNIVERSAL Y GRAPH...\n")
for c in consultas:
    print(f"Pregunta: {c}")
    try:
        res = obtener_respuesta(c)
        print(f"Herramienta: {res['categoria']}")
        print(f"Respuesta: {res['respuesta']}\n")
    except Exception as e:
        print(f"Error: {e}\n")

