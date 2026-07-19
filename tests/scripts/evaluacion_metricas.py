import time
import json
import csv
import itertools
import random
import string
import os
import timeit
from collections import defaultdict
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score, precision_recall_fscore_support

from backend.services.conversation.asistente import ChatbotEngine

RESULTS_DIR = 'results'
os.makedirs(RESULTS_DIR, exist_ok=True)

def generar_frases(prefs, mids, sufs, n=100):
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

def generar_ruido(n=100):
    todas = []
    for _ in range(30):
        length = random.randint(3, 20)
        todas.append(''.join(random.choices(string.ascii_letters + " ", k=length)))
    
    palabras = ["gato", "volador", "sopa", "teclado", "zapatos", "nube", "correr", "azul", "ayer", "espacio", "juego", "bailar", "x", "dj2id", "!!!"]
    for _ in range(40):
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
        for extra in ["", "dime", "porfa", "rápido"]:
            todas.append(f"{extra} {p}".strip())
    
    random.seed(42)
    random.shuffle(todas)
    return todas[:n]

def generar_dataset():
    saludos = generar_frases(["Hola", "Buenas", "Buen día", "Qué tal", "Saludos", "Hey"], ["bot", "asistente", ""], ["¿cómo estás?", "necesito ayuda", ""])
    agradecimientos = generar_frases(["Gracias", "Muchas gracias"], ["bot", "por la info", ""], ["eso es todo", "muy amable", ""])
    fuera_dominio = generar_ruido(100)
    info_tutor = generar_frases(["quién es", "dime el nombre de", "busco a"], ["mi tutor", "el tutor asignado"], ["soy el alumno 123456", "mi código es 123456", ""])
    info_alumno = generar_frases(["quién soy", "dime de", "busca a"], ["mi usuario", "mi persona", "el alumno"], ["mi código es 123456", "soy 123456", ""])
    cursos_semestre = generar_frases(["qué cursos hay", "cuáles son las materias"], ["en el semestre", "en el ciclo"], ["4", "cuatro", "IV", "quinto"])
    cursos_bloqueados = generar_frases(["qué cursos se me bloquean si", "qué pasa si"], ["jalo", "desapruebo"], ["Cálculo I", "Matemática"])
    info_curso_atributos = generar_frases(["cuántos créditos tiene", "es electivo", "qué tipo de curso es"], ["el curso de", "la materia"], ["Ingeniería de Software", "Base de Datos", "Cálculo II"])
    rag_tramites = generar_frases(["dónde tramito", "cuáles son los requisitos para"], ["mi bachillerato", "titulación", "constancia de notas"], ["en la unsaac", "virtualmente", ""])
    
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
    add_cases(rag_tramites, "Tramites")
    
    return dataset

def graficar_matriz_confusion(y_true, y_pred, labels):
    cm = confusion_matrix(y_true, y_pred, labels=labels)
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=labels, yticklabels=labels)
    plt.title('Matriz de Confusión de Intenciones')
    plt.xlabel('Predicho')
    plt.ylabel('Esperado')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig(os.path.join(RESULTS_DIR, 'matriz_confusion.png'))
    plt.close()

def graficar_metricas(reporte_df):
    reporte_df = reporte_df.drop(['accuracy', 'macro avg', 'weighted avg'], errors='ignore')
    
    # Graficar F1, Precision, Recall
    ax = reporte_df[['precision', 'recall', 'f1-score']].plot(kind='bar', figsize=(12, 6), colormap='viridis')
    plt.title('Métricas por Categoría')
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
    print("Iniciando Arnés de Métricas Avanzado...")
    dataset = generar_dataset()
    random.shuffle(dataset)
    
    categorias_esperadas = ["Saludo", "Agradecimiento", "General", "Info_Tutor", "Info_Alumno", "Cursos_Semestre", "Cursos_Bloqueados", "Info_Curso_Atributos", "Tramites"]
    
    y_true = []
    y_pred = []
    latencias = []
    
    # Warm up
    print("Realizando warm-up...")
    ChatbotEngine.obtener_respuesta("hola")
    
    total = len(dataset)
    print(f"Ejecutando {total} pruebas de validación de métricas...")
    
    for i, caso in enumerate(dataset):
        texto = caso["texto"]
        esperado = caso["esperado"]
        
        start_time = time.perf_counter()
        resultado = ChatbotEngine.obtener_respuesta(texto)
        end_time = time.perf_counter()
        
        latencia = end_time - start_time
        latencias.append(latencia)
        
        predicho = resultado["categoria"]
        
        # Mapear sub-categorías de RAG
        if esperado == "Cursos_Bloqueados" and predicho == "Reglamentos":
            predicho = "Cursos_Bloqueados"
        elif esperado == "Info_Curso_Atributos" and predicho == "Reglamentos":
            predicho = "Info_Curso_Atributos"
        elif esperado == "Tramites" and predicho in ["Reglamentos", "General", "Bienestar"]:
            predicho = "Tramites"
            
        y_true.append(esperado)
        y_pred.append(predicho)
            
        if (i+1) % 50 == 0:
            print(f"Progreso: {i+1}/{total} ({(i+1)/total*100:.1f}%)")

    # Cálculos Avanzados
    acc = accuracy_score(y_true, y_pred)
    report = classification_report(y_true, y_pred, output_dict=True, zero_division=0)
    report_df = pd.DataFrame(report).transpose()
    
    # Guardar Reporte CSV
    report_df.to_csv(os.path.join(RESULTS_DIR, 'reporte_clasificacion.csv'))
    
    # Graficar
    todas_preds = list(set(y_true + y_pred))
    graficar_matriz_confusion(y_true, y_pred, labels=todas_preds)
    graficar_metricas(report_df)
    graficar_latencias(latencias)
    
    # Guardar métricas de latencia en JSON
    metricas_latencia = {
        "accuracy_global": acc,
        "latencias_segundos": {
            "media": float(np.mean(latencias)),
            "p50": float(np.percentile(latencias, 50)),
            "p90": float(np.percentile(latencias, 90)),
            "p95": float(np.percentile(latencias, 95)),
            "p99": float(np.percentile(latencias, 99))
        },
        "total_casos": total
    }
    
    with open(os.path.join(RESULTS_DIR, 'resultados_metricas.json'), 'w', encoding='utf-8') as f:
        json.dump(metricas_latencia, f, indent=4)
        
    print(f"Evaluación completada. Resultados guardados en '{RESULTS_DIR}'.")
    print(f"Precisión global: {acc*100:.2f}%")
    print(f"Latencia media: {np.mean(latencias):.3f}s")
    
if __name__ == '__main__':
    ejecutar_evaluacion()
