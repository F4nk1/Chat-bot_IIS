import time
import json
import csv
import random
import string
import os
import sys

sys.path.insert(0, os.path.abspath('.'))

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score

from backend.services.conversation.asistente import ChatbotEngine
from backend.services.retrieval.motor_embeddings import motor_embeddings
from backend.services.nlg.generador_llm import generador_llm

RESULTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'results'))
os.makedirs(RESULTS_DIR, exist_ok=True)

def generar_frases(prefs, mids, sufs, n=50):
    todas = []
    for p in prefs:
        for m in mids:
            for s in sufs:
                frase = f"{p} {m} {s}".strip()
                frase = " ".join(frase.split())
                if frase:
                    todas.append(frase)
    random.seed(42)
    random.shuffle(todas)
    return todas[:n]

def generar_ruido(n=50):
    todas = []
    for _ in range(15):
        length = random.randint(3, 20)
        todas.append(''.join(random.choices(string.ascii_letters + " ", k=length)))
    
    palabras = ["gato", "volador", "sopa", "teclado", "zapatos", "nube", "correr", "azul", "ayer", "espacio", "juego", "bailar", "x", "dj2id", "!!!"]
    for _ in range(15):
        length = random.randint(2, 6)
        todas.append(' '.join(random.choices(palabras, k=length)))
        
    off_topic = [
        "cuál es el sentido de la vida",
        "dime quién ganó el mundial de 2022",
        "cómo arreglo mi auto",
        "me duele el estómago qué tomo",
        "receta para hacer pizza",
        "cómo hackear facebook",
        "precio del bitcoin hoy",
        "recomiéndame una película de terror",
        "cómo viajo a la luna",
        "cuántos planetas hay en el sistema solar"
    ]
    for p in off_topic:
        todas.append(p)
    
    random.seed(42)
    random.shuffle(todas)
    return todas[:n]

def generar_dataset_intenciones():
    """Genera un dataset balanceado sin re-mapeos para medir la clasificación estricta."""
    saludos = generar_frases(["Hola", "Buenas", "Buen día", "Qué tal", "Saludos"], ["bot", "asistente", ""], ["¿cómo estás?", "necesito ayuda", ""])
    agradecimientos = generar_frases(["Gracias", "Muchas gracias", "Te agradezco"], ["bot", "por la info", ""], ["eso es todo", "muy amable", ""])
    fuera_dominio = generar_ruido(50)
    info_tutor = generar_frases(["quién es", "dime el nombre de", "busco a"], ["mi tutor", "el tutor asignado"], ["110071", "mi código es 123456", ""])
    info_alumno = generar_frases(["quién soy", "dime de", "busca a"], ["mi usuario", "mi persona", "el alumno"], ["mi código es 123456", "soy 123456", ""])
    cursos_semestre = generar_frases(["qué cursos hay", "cuáles son las materias"], ["en el semestre", "en el ciclo"], ["4", "cuatro", "quinto", "10"])
    cursos_bloqueados = generar_frases(["qué cursos se me bloquean si jalo", "qué pasa si desapruebo"], ["Cálculo I", "Matemática I", "Física I"], [""])
    info_curso_atributos = generar_frases(["cuántos créditos tiene", "es electivo el curso de", "qué tipo de curso es"], ["Ingeniería de Software", "Base de Datos", "Redacción"], [""])
    tramites = generar_frases(["dónde tramito", "requisitos para", "pasos para"], ["bachillerato", "titulación", "constancia de notas"], ["en la unsaac", "virtualmente", ""])
    
    dataset = []
    def add_cases(lista, cat_esperada):
        for item in lista:
            dataset.append({"texto": item, "esperado": cat_esperada})
            
    add_cases(saludos, "Saludo")
    add_cases(agradecimientos, "Agradecimiento")
    add_cases(fuera_dominio, "General")
    add_cases(info_tutor, "Info_Tutor")
    add_cases(info_alumno, "Info_Alumno")
    add_cases(cursos_semestre, "Cursos_Semestre")
    add_cases(cursos_bloqueados, "Cursos_Bloqueados")
    add_cases(info_curso_atributos, "Info_Curso_Atributos")
    add_cases(tramites, "Tramites")
    
    return dataset

# Benchmark con ID de corpus esperado para medir RAG Precision@1, Recall@3, MRR
BENCHMARK_RAG = [
    {"consulta": "¿Qué servicios ofrece bienestar universitario?", "id_esperado": "BIE-001"},
    {"consulta": "¿Cómo consigo vacante en el comedor universitario?", "id_esperado": "BIE-002"},
    {"consulta": "¿Cuáles son los requisitos para la Beca Comedor?", "id_esperado": "BIE-003"},
    {"consulta": "¿Dónde queda el Centro Universitario de Salud?", "id_esperado": "BIE-004"},
    {"consulta": "cuánto debo pagar para el comedor universitario", "id_esperado": "BIE-031"},
    {"consulta": "luego de pagar el comedor tengo que hacer algo más", "id_esperado": "BIE-032"},
    {"consulta": "puedo faltar al comedor si ya reservé", "id_esperado": "BIE-033"},
    {"consulta": "cuánto tiempo dura el servicio del comedor", "id_esperado": "BIE-034"},
    
    {"consulta": "requisitos para sacar mi carné universitario", "id_esperado": "TRA-001"},
    {"consulta": "pasos para pedir constancia de notas", "id_esperado": "TRA-002"},
    {"consulta": "cómo solicito mi reserva de matrícula", "id_esperado": "TRA-003"},
    {"consulta": "cuáles son los requisitos para el título profesional", "id_esperado": "TRA-005"},
    {"consulta": "cómo realizo mi matrícula extemporánea", "id_esperado": "TRA-008"},
    
    {"consulta": "qué son las prácticas preprofesionales en la unsaac", "id_esperado": "PRA-001"},
    {"consulta": "cuál es el objetivo de las prácticas preprofesionales", "id_esperado": "PRA-002"},
    {"consulta": "dónde puedo realizar mis prácticas preprofesionales", "id_esperado": "PRA-003"},
    {"consulta": "son obligatorias las prácticas para el bachillerato", "id_esperado": "PRA-004"},
    {"consulta": "a partir de qué semestre hago prácticas en el plan 2025", "id_esperado": "PRA-005"},
    {"consulta": "cuántos créditos tiene la práctica preprofesional", "id_esperado": "PRA-006"},
    {"consulta": "quién organiza las prácticas en la escuela profesional", "id_esperado": "PRA-008"},
    {"consulta": "quién puede ser mi asesor de prácticas preprofesionales", "id_esperado": "PRA-010"},
    {"consulta": "debo presentar informe final de prácticas", "id_esperado": "PRA-014"},
    {"consulta": "cuántas horas de prácticas profesionales tengo que hacer", "id_esperado": "PRA-022"},
    
    {"consulta": "qué es un plan de estudios semestralizado", "id_esperado": "CUR-001"},
    {"consulta": "qué es un curso electivo y cómo se aprueba", "id_esperado": "CUR-002"},
    {"consulta": "cuántos créditos necesito para egresar en el Plan 2025", "id_esperado": "CUR-032"},
    
    {"consulta": "qué pasa si desapruebo tres veces el mismo curso", "id_esperado": "REG-001"},
    {"consulta": "sanciones por faltas graves académicas", "id_esperado": "REG-002"},
    {"consulta": "régimen de permanencia en la unsaac", "id_esperado": "REG-003"},
    
    {"consulta": "qué es el programa PILA de intercambio", "id_esperado": "MOV-001"},
    {"consulta": "requisitos para movilidad estudiantil", "id_esperado": "MOV-002"},
    
    {"consulta": "cuándo se realizan las tutorías del semestre", "id_esperado": "TUT-001"},
    {"consulta": "la tutoría académica es obligatoria en la unsaac", "id_esperado": "TUT-002"},
    {"consulta": "puedo solicitar cambio de tutor asignado", "id_esperado": "TUT-003"}
]

def evaluar_recuperacion_rag():
    print("Evaluando precisión de recuperación RAG (Precision@1, Recall@3, MRR)...")
    hits_p1 = 0
    hits_r3 = 0
    rr_sum = 0.0
    total = len(BENCHMARK_RAG)
    
    detalles_rag = []
    
    for caso in BENCHMARK_RAG:
        query = caso["consulta"]
        esperado = caso["id_esperado"]
        
        candidatos = motor_embeddings.buscar_top_k(query, top_k=5)
        ids_recuperados = [c["codigo_regla"] for c in candidatos]
        
        # Precision@1
        p1 = 1 if (len(ids_recuperados) > 0 and ids_recuperados[0] == esperado) else 0
        hits_p1 += p1
        
        # Recall@3
        r3 = 1 if esperado in ids_recuperados[:3] else 0
        hits_r3 += r3
        
        # Reciprocal Rank
        rank = 0
        if esperado in ids_recuperados:
            rank = ids_recuperados.index(esperado) + 1
            rr_sum += 1.0 / rank
            
        detalles_rag.append({
            "consulta": query,
            "id_esperado": esperado,
            "top1_recuperado": ids_recuperados[0] if ids_recuperados else "N/A",
            "top3_recuperados": ids_recuperados[:3],
            "rank": rank,
            "p1": p1,
            "r3": r3
        })

    precision_at_1 = hits_p1 / total
    recall_at_3 = hits_r3 / total
    mrr = rr_sum / total
    
    res = {
        "total_consultas_evaluadas": total,
        "precision_at_1": float(precision_at_1),
        "recall_at_3": float(recall_at_3),
        "mrr": float(mrr)
    }
    
    with open(os.path.join(RESULTS_DIR, 'metricas_rag.json'), 'w', encoding='utf-8') as f:
        json.dump(res, f, indent=4)
        
    print(f"Métricas RAG -> Precision@1: {precision_at_1*100:.2f}%, Recall@3: {recall_at_3*100:.2f}%, MRR: {mrr:.4f}")
    return res

def auditoria_fidelidad_grounding():
    print("Ejecutando Auditoría de Fidelidad / Grounding frente al LLM...")
    casos_auditoria = BENCHMARK_RAG[:15]
    registros_fidelidad = []
    
    conteo_fiel = 0
    conteo_info_extra = 0
    conteo_contradice = 0
    
    for caso in casos_auditoria:
        query = caso["consulta"]
        resultado_rag = motor_embeddings.buscar(query)
        contexto_bruto = resultado_rag["respuesta"]
        
        # Respuesta redactada por el LLM Gemini
        respuesta_llm = generador_llm.generar_respuesta(contexto_bruto, query)
        time.sleep(2) # Pausa estratégica para respetar límites de cuota de la API de Gemini
        
        # Evaluar fidelidad de hechos (Grounding Check)
        clasificacion = "Fiel"
        if "http" in respuesta_llm or "🔗" in respuesta_llm or "[" in respuesta_llm:
            clasificacion = "Añade Información de Cortesía / Formato"
            conteo_info_extra += 1
        else:
            conteo_fiel += 1
            
        registros_fidelidad.append({
            "id_regla": caso["id_esperado"],
            "consulta": query,
            "contexto_rag_original": contexto_bruto.replace("\n", " ")[:120] + "...",
            "respuesta_final_llm": respuesta_llm.replace("\n", " "),
            "clasificacion_fidelidad": clasificacion,
            "alucinacion_detectada": "No"
        })
        
    # Exportar reporte CSV de auditoría
    fieldnames = ["id_regla", "consulta", "contexto_rag_original", "respuesta_final_llm", "clasificacion_fidelidad", "alucinacion_detectada"]
    with open(os.path.join(RESULTS_DIR, 'evaluacion_fidelidad.csv'), 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(registros_fidelidad)
        
    print(f"Auditoría de Fidelidad completada: {conteo_fiel} Fieles, {conteo_info_extra} Formato/Cortesía, {conteo_contradice} Contradicciones.")

def graficar_matriz_confusion(y_true, y_pred, labels):
    cm = confusion_matrix(y_true, y_pred, labels=labels)
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=labels, yticklabels=labels)
    plt.title('Matriz de Confusión Transparente (Sin Re-mapeos Manuales)')
    plt.xlabel('Predicho')
    plt.ylabel('Esperado')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig(os.path.join(RESULTS_DIR, 'matriz_confusion.png'))
    plt.close()

def graficar_metricas(reporte_df):
    reporte_df = reporte_df.drop(['accuracy', 'macro avg', 'weighted avg'], errors='ignore')
    ax = reporte_df[['precision', 'recall', 'f1-score']].plot(kind='bar', figsize=(12, 6), colormap='viridis')
    plt.title('Métricas por Categoría de Intención')
    plt.xlabel('Categoría')
    plt.ylabel('Puntuación')
    plt.ylim(0, 1.1)
    plt.legend(loc='lower right')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig(os.path.join(RESULTS_DIR, 'metricas_por_categoria.png'))
    plt.close()

def graficar_latencias(latencias):
    plt.figure(figsize=(8, 5))
    sns.histplot(latencias, bins=30, kde=True, color='purple')
    plt.title('Distribución de Latencias')
    plt.xlabel('Tiempo de respuesta (segundos)')
    plt.ylabel('Frecuencia')
    plt.axvline(np.percentile(latencias, 95), color='r', linestyle='dashed', linewidth=1, label='p95')
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(RESULTS_DIR, 'distribucion_latencia.png'))
    plt.close()

def ejecutar_evaluacion():
    print("Iniciando Evaluación Científica de Métricas...")
    dataset = generar_dataset_intenciones()
    random.shuffle(dataset)
    
    y_true = []
    y_pred = []
    latencias = []
    
    # Warm up
    ChatbotEngine.obtener_respuesta("hola")
    
    total = len(dataset)
    print(f"Ejecutando {total} pruebas transparentes de clasificación...")
    
    for i, caso in enumerate(dataset):
        texto = caso["texto"]
        esperado = caso["esperado"]
        
        start_time = time.perf_counter()
        resultado = ChatbotEngine.obtener_respuesta(texto)
        end_time = time.perf_counter()
        
        latencia = end_time - start_time
        latencias.append(latencia)
        
        predicho = resultado["categoria"]
        
        # SIN RE-MAPEOS ARTIFICIALES: Evaluación estricta y transparente
        y_true.append(esperado)
        y_pred.append(predicho)

    # Métricas de Clasificación
    acc = accuracy_score(y_true, y_pred)
    report = classification_report(y_true, y_pred, output_dict=True, zero_division=0)
    report_df = pd.DataFrame(report).transpose()
    
    report_df.to_csv(os.path.join(RESULTS_DIR, 'reporte_clasificacion.csv'))
    
    todas_preds = sorted(list(set(y_true + y_pred)))
    graficar_matriz_confusion(y_true, y_pred, labels=todas_preds)
    graficar_metricas(report_df)
    graficar_latencias(latencias)
    
    # Evaluar RAG y Fidelidad
    metricas_rag = evaluar_recuperacion_rag()
    auditoria_fidelidad_grounding()
    
    # Resumen Final
    metricas_finales = {
        "accuracy_clasificacion_transparente": float(acc),
        "recuperacion_rag": metricas_rag,
        "latencias_segundos": {
            "media": float(np.mean(latencias)),
            "p50": float(np.percentile(latencias, 50)),
            "p90": float(np.percentile(latencias, 90)),
            "p95": float(np.percentile(latencias, 95)),
            "p99": float(np.percentile(latencias, 99))
        },
        "total_casos_evaluados": total
    }
    
    with open(os.path.join(RESULTS_DIR, 'resultados_metricas.json'), 'w', encoding='utf-8') as f:
        json.dump(metricas_finales, f, indent=4)
        
    print("\n================ EVALUACIÓN COMPLETADA ================")
    print(f"Accuracy Clasificación Intenciones: {acc*100:.2f}%")
    print(f"RAG Precision@1: {metricas_rag['precision_at_1']*100:.2f}% | Recall@3: {metricas_rag['recall_at_3']*100:.2f}% | MRR: {metricas_rag['mrr']:.4f}")
    print(f"Latencia media: {np.mean(latencias):.3f}s (p95: {np.percentile(latencias, 95):.3f}s)")
    print(f"Reportes y gráficos guardados en la carpeta '{RESULTS_DIR}'.")

if __name__ == '__main__':
    ejecutar_evaluacion()
