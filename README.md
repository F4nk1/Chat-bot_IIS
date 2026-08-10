# Chatbot Académico DinoBot — EPIIS UNSAAC

Chatbot inteligente de arquitectura **RAG Híbrido (Bi-Encoder Sentence-Transformers + BM25)** integrado con **Google Gemini (SDK `google-genai`)** para la Escuela Profesional de Ingeniería Informática y de Sistemas de la UNSAAC. 

El sistema actúa como un **Co-Pilot Web Interactivo** que orienta a los estudiantes en tiempo real navegando entre secciones y sub-pestañas de la página web de acuerdo con el tema de la consulta.

---

## 🌟 Características Principales

- **Búsqueda Híbrida RAG + Re-Ranking**: Recuperación multicanal con embeddings vectoriales (`paraphrase-multilingual-MiniLM-L12-v2`) en ChromaDB combinados con BM25.
- **Redacción Natural NLG (Google Gemini)**: Generación fluida de respuestas respaldadas al 100% en el contexto normativo sin alucinaciones (SDK oficial `google-genai`).
- **Navegación Co-Pilot Multinivel**: Sincronización automática de pantalla que desplaza la web institucional y activa la pestaña principal (*Formación*, *Bienestar*, *Trámites*, *Movilidad*, *Tutorías*) y la sub-pestaña correspondiente (*Malla*, *Prácticas PPP*, *Comedor*, *Pagos*, etc.).
- **Síntesis de Voz Inteligente (TTS)**: Lectura fluida por voz omitiendo automáticamente títulos de enlaces y URLs para una experiencia de audio natural.
- **Consultas a Grafos Académicos**: Extracción de entidades de cursos y prerrequisitos encadenados mediante NetworkX (`Cursos_Bloqueados`).
- **Detección de Intenciones (k-NN)**: Clasificador supervisado para enrutamiento rápido de intenciones frecuentes.
- **Panel Administrativo y Auditoría**: Exportación de métricas en CSV, logs en JSONL para fine-tuning y evaluación de fidelidad.

---

## ⚙️ Requisitos Previos

- **Python 3.10+** (Recomendado 3.11 o 3.12)
- **Node.js (v18+ LTS)**
- **GEMINI_API_KEY**: Variable de entorno configurada en archivo `.env`.
- **Navegador Web (Chromium / Chrome / Edge / Brave)**: Para soporte nativo de micrófono (Speech-to-Text).
- **Dependencia de Audio en Linux** *(Opcional)*: `sudo apt-get install libsndfile1`

---

## 🚀 Guía de Instalación y Ejecución

El proyecto es totalmente compatible con entornos **Linux** y **Windows**.

### 🐧 Opción A: En Linux / macOS (Vía `Makefile`)

1. **Instalación y Configuración Inicial:**
   ```bash
   make setup
   ```
2. **Migración e Inicialización de la Base de Datos:**
   ```bash
   make db-reset
   ```
3. **Ejecución Simultánea de Servidores (Backend + Frontend):**
   ```bash
   make run
   ```
   * *Ejecución por separado:*
     * Backend: `make run-backend`
     * Frontend: `make run-frontend`

---

### 🪟 Opción B: En Windows (PowerShell / CMD)

Si estás en Windows y no utilizas `make` (o Git Bash), ejecuta los siguientes comandos en tu terminal de PowerShell:

1. **Crear entorno virtual e instalar dependencias Python:**
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

2. **Instalar dependencias del Frontend (Node.js):**
   ```powershell
   npm.cmd --prefix frontend install
   ```
   > En PowerShell se usa `npm.cmd` para evitar el error de política de
   > ejecución que puede bloquear el script `npm.ps1`.

3. **Migrar la Base de Datos e Inicializar el Corpus:**
   ```powershell
   python -m backend.database.migrar_datos
   ```

4. **Ejecutar el Servidor Backend (FastAPI):**
   ```powershell
   uvicorn backend.main:aplicacion --reload --host 0.0.0.0 --port 8001
   ```

5. **Ejecutar el Servidor Frontend (React / Vite en otra terminal):**
   ```powershell
   npm.cmd --prefix frontend run dev
   ```

---

## 🌐 Puertas y Acceso

- **Aplicación Web Interactiva**: [http://localhost:5174](http://localhost:5174)
- **API FastAPI (Swagger Docs)**: [http://localhost:8001/docs](http://localhost:8001/docs)

---

## 📊 Evaluación de Métricas y Precisión RAG

El sistema incluye una suite de pruebas científicas en `tests/scripts/evaluacion_metricas.py`:

- **Exactitud de Recuperación RAG (IR Metrics)**:
  - **Precision@1**: `100.00%` (Exact) / `94.44%` (Benchmark)
  - **Recall@3**: `100.00%` (Exact) / `97.22%` (Benchmark)
  - **MRR (Mean Reciprocal Rank)**: `1.0000` / `0.9583`
- **Auditoría de Fidelidad / Grounding**: `100.00%` de respuestas fieles al contexto (0% alucinaciones).

---

## 🧩 Extensión de Navegador (Chrome Extension)

El proyecto incluye la carpeta `frontend/` como cliente inyectable de Extensión de Navegador con características sincronizadas con la Web App:

- **Renderizado de Markdown y Enlaces**: Parseo automático de negritas y enlaces compactos clicables (`target="_blank"`).
- **Filtro de Voz TTS**: Omite la lectura de URLs y títulos de enlaces para una locución fluida de avisos en pantalla.
- **Valoración Interactiva**: Botones de feedback (Like / Dislike) con resaltado visual verde/rojo en tiempo real.

### Instalación y Activación:
1. Abre Chrome y navega a `chrome://extensions/`.
2. Habilita el **Modo de desarrollador** (esquina superior derecha).
3. Haz clic en **Cargar descomprimida** y selecciona la carpeta `frontend/`.
4. Al ingresar a `https://in.unsaac.edu.pe/`, se inyectará la ventana flotante del DinoBot.

---

## 🏗️ Arquitectura del Sistema

- **`motor_embeddings.py`**: Motor Híbrido RAG (Bi-Encoder + BM25 + ChromaDB).
- **`generador_llm.py`**: Motor NLG de síntesis natural con `google-genai` SDK.
- **`asistente.py`**: Orquestador principal (Slot-Filling Grafo -> Clasificación -> RAG -> Gemini).
- **`knowledge_graph.py`**: Grafo NetworkX para prerrequisitos y consultas estructuradas.
- **`servicio_tts.py` / `normalizador.py`**: Limpiador acústico y síntesis de voz Piper ONNX.

---
*Escuela Profesional de Ingeniería Informática y de Sistemas — UNSAAC*
