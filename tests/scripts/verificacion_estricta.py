import os
import json
from backend.services.conversation.asistente import ChatbotEngine

preguntas_test = [
    {
        "id": "REG-001",
        "pregunta": "¿Qué regula el Reglamento de Tutoria Academica de la UNSAAC?",
        "respuesta_oficial_esperada": "Este reglamento explica como debe organizarse y desarrollarse la tutoría académica en la UNSAAC. Su finalidad es orientar y acompañar a los estudiantes durante su formación universitaria."
    },
    {
        "id": "TRA-001",
        "pregunta": "¿Dónde consulto los requisitos, costos y plazos de un trámite en la UNSAAC?",
        "respuesta_oficial_esperada": "La UNSAAC publica los requisitos, costos, plazos, canales de atención y unidades responsables en su Texto Único de Procedimientos Administrativos. Antes de presentar una solicitud, revisa el TUPA vigente y el calendario académico correspondiente."
    },
    {
        "id": "ESTRUCTURADO-001",
        "pregunta": "¿Quién es mi tutor? Mi código es 110071",
        "respuesta_oficial_esperada": "Datos exactos del profesor Nila Acurio Usca (basado en CSVs del sistema)."
    },
    {
        "id": "REGLAMENTO-GENERAL-01",
        "pregunta": "¿qué pasa si desapruebo un curso?",
        "respuesta_oficial_esperada": "Debe buscar en los reglamentos sobre desaprobar cursos y responder según el RAG, no inventar."
    },
    {
        "id": "FUERA-DOMINIO-01",
        "pregunta": "¿cuál es la capital de perú?",
        "respuesta_oficial_esperada": "Rechazo contundente por estar fuera de dominio."
    }
]

resultados = []

print("INICIANDO PRUEBAS ESTRICTAS...")
for item in preguntas_test:
    print(f"Evaluando: {item['pregunta']}")
    # En este punto el motor ya está cargado con el arreglo de device_map="cpu" y el bloqueo de "General"
    resultado_bot = ChatbotEngine.obtener_respuesta(item["pregunta"])
    
    resultados.append({
        "id_test": item["id"],
        "pregunta": item["pregunta"],
        "respuesta_oficial_esperada": item["respuesta_oficial_esperada"],
        "intencion_detectada": resultado_bot["categoria"],
        "respuesta_del_bot": resultado_bot["respuesta"],
        "confianza": resultado_bot["confianza"]
    })

# Guardar en JSON para análisis
ruta_salida = "/home/f4nk1/.gemini/antigravity-cli/brain/22f45ebe-3880-47d1-be23-e052c78418bb/scratch/resultados_estrictos.json"
os.makedirs(os.path.dirname(ruta_salida), exist_ok=True)
with open(ruta_salida, "w", encoding="utf-8") as f:
    json.dump(resultados, f, indent=4, ensure_ascii=False)

print(f"Pruebas finalizadas. Resultados guardados en {ruta_salida}")
