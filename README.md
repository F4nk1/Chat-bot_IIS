# Chatbot Académico IIS - UNSAAC

Chatbot inteligente de arquitectura RAG (Retrieval-Augmented Generation) diseñado para la Escuela Profesional de Ingeniería Informática y de Sistemas de la UNSAAC. Orientado a resolver dudas sobre reglamentos, tutorías, trámites y servicios.

---

##  Características Principales
- **IA / RAG**: Recuperación de información precisa usando Similitud Coseno.
- **Voz ONNX (TTS)**: Síntesis de voz femenina de alta fidelidad integrada con Piper.
- **Detección de Intenciones**: Clasificador de consultas (Tutorías, Bienestar, etc.).
- **Gestión de Feedback**: Sistema de valoración (pulgar arriba/abajo) para mejora continua.
- **Panel Administrativo**: Exportación de logs en CSV y consulta directa de reglamentos.
- **Normalización TTS**: Expansión de siglas y limpieza de texto para una lectura natural.

---

##  Requisitos Previos
- **Python 3.12+**
- **Node.js (LTS)** (Requerido para compilar y ejecutar el nuevo frontend en React)
- **Dependencias de Sistema**:
  - **Linux**: `sudo apt-get install libsndfile1`
  - **Windows**: No requiere dependencias adicionales (las librerías se instalan via `pip`).

---

##  Instalación y Configuración Paso a Paso

### 1. Preparación del Proyecto
```bash
# Clonar el proyecto y entrar a la carpeta
cd Chat-bot_IIS

# Crear y activar entorno virtual
python -m venv venv

# ACTIVAR (Linux/macOS):
source venv/bin/activate
# ACTIVAR (Windows):
venv\Scripts\activate

# Instalar dependencias del backend
pip install -r requirements.txt

# Instalar dependencias del frontend (React)
cd frontend
npm install
cd ..
```

### 2. Configuración del Motor de Voz (TTS)
El chatbot requiere modelos ONNX. Sigue estos comandos según tu sistema:

#### **Linux / macOS (usando wget):**
```bash
mkdir -p backend/assets/models
wget -O backend/assets/models/es_ES-sharvard-medium.onnx https://huggingface.co/rhasspy/piper-voices/resolve/main/es/es_ES/sharvard/medium/es_ES-sharvard-medium.onnx
wget -O backend/assets/models/es_ES-sharvard-medium.onnx.json https://huggingface.co/rhasspy/piper-voices/resolve/main/es/es_ES/sharvard/medium/es_ES-sharvard-medium.onnx.json
```

#### **Windows (usando PowerShell):**
```powershell
New-Item -ItemType Directory -Force -Path "backend\assets\models"
Invoke-WebRequest -Uri "https://huggingface.co/rhasspy/piper-voices/resolve/main/es/es_ES/sharvard/medium/es_ES-sharvard-medium.onnx" -OutFile "backend\assets\models\es_ES-sharvard-medium.onnx"
Invoke-WebRequest -Uri "https://huggingface.co/rhasspy/piper-voices/resolve/main/es/es_ES/sharvard/medium/es_ES-sharvard-medium.onnx.json" -OutFile "backend\assets\models\es_ES-sharvard-medium.onnx.json"
```

### 3. Inicialización de Datos
```bash
# Crear tablas en SQLite e importar conocimiento inicial
python backend/database/bd_gestion.py
python backend/database/migrar_datos.py
```

### 4. Ejecución y Modos de Uso

Podemos correr el proyecto en dos modos según si estamos en etapa de desarrollo o producción:

#### **Modo Desarrollo (Recomendado para realizar cambios en caliente):**
* **Terminal 1 (Backend FastAPI):**
  ```bash
  source venv/bin/activate  # o venv\Scripts\activate en Windows
  uvicorn backend.main:aplicacion --reload
  ```
* **Terminal 2 (Frontend React + Vite):**
  ```bash
  cd frontend
  npm run dev
  ```
  - **Dirección del Frontend en desarrollo**: [http://localhost:5173](http://localhost:5173) (Vite compila los cambios al instante).
  - **Documentación API**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

#### **Modo Producción (Servido integrado directamente por FastAPI):**
* **Paso A: Compilar el frontend** (genera la carpeta `dist/` optimizada):
  ```bash
  cd frontend
  npm run build
  cd ..
  ```
* **Paso B: Levantar el servidor de FastAPI:**
  ```bash
  uvicorn backend.main:aplicacion --reload
  ```
  - **Interfaz Web Integrada**: [http://127.0.0.1:8000/frontend/index.html](http://127.0.0.1:8000/frontend/index.html)

---

##  Arquitectura y Nomenclatura
Para auditorías técnicas, el proyecto sigue estrictamente esta estructura de clases:
- **`KnowledgeBase`**: Acceso centralizado a la base de datos de conocimiento.
- **`EmbeddingEngine`**: Motor de búsqueda semántica y vectorización TF-IDF.
- **`IntentDetector`**: Clasificador de intenciones por categorías.
- **`ChatbotEngine`**: Orquestador de la conversación y flujo RAG.
- **`ConversationSession`**: Gestión de memoria y contexto del usuario.
- **`NormalizadorTTS`**: Servicio de expansión de siglas y limpieza de audio.

---

##  Herramientas de Administración
- **Exportar Historial**: Descarga logs detallados en CSV.
  - [http://127.0.0.1:8000/admin/exportar-logs](http://127.0.0.1:8000/admin/exportar-logs)
- **Consulta de Reglamento**: Busca artículos específicos por ID.
  - [http://127.0.0.1:8000/reglamento/{id}](http://127.0.0.1:8000/reglamento/{id})

---

##  Suite de Pruebas
Ejecuta los tests para verificar la integridad del sistema:

**En Linux/macOS:**
```bash
export PYTHONPATH=.
python tests/test_chatbot.py
```

**En Windows (CMD):**
```cmd
set PYTHONPATH=.
python tests/test_chatbot.py
```

**En Windows (PowerShell):**
```powershell
$env:PYTHONPATH="."
python tests/test_chatbot.py
```

---

##  Solución de Problemas
- **Error 416 (Audio)**: Se soluciona automáticamente con la nueva lógica de escritura sincrónica. Asegúrate de que `backend/static/audio` tenga permisos de escritura.
- **Error 503 (TTS)**: Verifica que los archivos `.onnx` y `.json` estén en `backend/assets/models/`.
- **ModuleNotFoundError**: Asegúrate de haber activado el `venv` y configurado el `PYTHONPATH=.`.
