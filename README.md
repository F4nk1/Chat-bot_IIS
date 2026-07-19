# Chatbot Académico IIS - UNSAAC

Chatbot inteligente de arquitectura RAG (Retrieval-Augmented Generation) diseñado para la Escuela Profesional de Ingeniería Informática y de Sistemas de la UNSAAC. Orientado a resolver dudas sobre reglamentos, tutorías, trámites y servicios.

---

## 🌟 Características Principales
- **IA / RAG**: Recuperación de información precisa usando Similitud Coseno.
- **Voz ONNX (TTS)**: Síntesis de voz femenina de alta fidelidad integrada con Piper.
- **Detección de Intenciones**: Clasificador KNN robusto contra ruido.
- **Gestión de Feedback**: Sistema de valoración (pulgar arriba/abajo) para mejora continua.
- **Panel Administrativo**: Exportación de logs en CSV y consulta directa de reglamentos.
- **Normalización TTS**: Expansión de siglas y limpieza de texto para una lectura natural.
- **Extensión de Navegador**: Integración de interfaz flotante directamente en portales universitarios.

---

## ⚙️ Requisitos Previos
- **Python 3.12+**
- **Node.js (LTS)** (Para el entorno React/Vite)
- **Navegador basado en Chromium (Google Chrome, Edge, Brave)**: Requerido para el pleno uso de la extensión (soporte de `webkitSpeechRecognition` nativo).
- **Dependencias de Sistema (Linux)**: `sudo apt-get install libsndfile1`

---

## 🚀 Instalación y Automatización (Makefile)

El proyecto incluye un `Makefile` que automatiza absolutamente todas las tareas repetitivas del ciclo de vida del software.

### 1. Configuración de un solo clic
```bash
# Crea el entorno virtual (venv), instala dependencias Python y dependencias Node.js
make setup
```

### 2. Base de Datos RAG
```bash
# Para borrar todo y migrar el conocimiento (Reglamentos, FAQs) desde cero
make db-reset
```

### 3. Ejecutar los Servidores
Puedes levantar el backend de FastAPI y el frontend de React Vite al mismo tiempo, exponiéndolos incluso en tu red local:
```bash
make run
```
Si deseas correrlos por separado:
- `make run-backend`
- `make run-frontend`

### Otros Comandos Útiles
- `make build-frontend`: Genera los archivos estáticos de React para producción en `frontend/dist/`.
- `make clean`: Borra la caché, archivos `.pyc` y las carpetas de compilación.
- `make help`: Muestra el menú de ayuda con todos los comandos documentados.

*(Nota sobre TTS)*: Recuerda descargar manualmente los modelos de voz ONNX en `backend/assets/models/es_ES-sharvard-medium.onnx` si usas la síntesis de voz, según la plataforma original.

---

## 🧩 Extensión de Navegador (Chrome Extension)

El proyecto cuenta con un cliente implementado como **Extensión de Navegador** inyectable, cuyo código base está en la carpeta `frontend/`.

### Funcionamiento de la Extensión
La extensión actúa como un "Content Script" (`content.js`). Al estar activa, **inyecta un botón flotante y una ventana de chat en la esquina inferior de la pantalla exclusivamente cuando visitas la intranet universitaria** (coincidencia de URL configurada en el `manifest.json` para `https://in.unsaac.edu.pe/*`).

### ¿Cómo depende del Navegador?
- **Reconocimiento de Voz Nativo**: El botón del micrófono (Speech-to-Text) utiliza el motor `webkitSpeechRecognition`, una API Web exclusiva y optimizada de forma nativa en navegadores **Chromium** (como Google Chrome). En navegadores como Firefox, esta funcionalidad arrojará una alerta de incompatibilidad.
- **Cross-Origin Requests (CORS)**: La extensión se comunica de forma transparente con `http://127.0.0.1:8000` (el backend local) gracias a que el navegador maneja los permisos y evita bloqueos de seguridad que normalmente ocurrirían en un sitio HTTPS común.

### ¿Cómo activar (instalar) la Extensión?
El proceso de activación requiere ser cargado como paquete descomprimido, lo cual automatiza el despliegue local:
1. Abre tu navegador basado en Chromium (Ej: Google Chrome) y navega a `chrome://extensions/`.
2. Habilita el **"Modo de desarrollador"** (Developer mode) en la esquina superior derecha.
3. Haz clic en **"Cargar descomprimida"** (Load unpacked).
4. Selecciona la carpeta **`frontend/`** del directorio del proyecto (es vital seleccionar la carpeta que contiene el archivo `manifest.json`).
5. *¡Listo!* Visita `https://in.unsaac.edu.pe/` y verás el botón flotante del DinoBot en la pantalla.

---

## 📊 Arnés de Métricas y Stress Testing (M.1 - M.7)

El sistema incluye una validación empírica extrema alojada en `tests/scripts/`.

- Se ha corrido una suite masiva (`evaluacion_metricas.py`) con 900 iteraciones automáticas cruzadas que mezclan intenciones ambiguas, ruido aleatorio, y preguntas fuera de dominio (ej. *"cómo hackear facebook"*).
- El motor generó una **Precisión Global de ~88.8%** y latencias instantáneas (Percentil 50 de **~0.034s**). 
- Puedes encontrar los datos exhaustivos, matrices de confusión térmica (PNG) y gráficos de barras consolidados listos para redacción académica en el directorio `/results/`.

---

## 🏗️ Arquitectura de Software
- **`KnowledgeBase`**: Acceso centralizado a SQLite (Reglamentos y FAQs).
- **`EmbeddingEngine`**: Motor TF-IDF y normalización de textos.
- **`IntentDetector`**: Clasificador k-NN espacial inmune al ruido extremo.
- **`ChatbotEngine`**: Orquestador principal (Grafo > Detección > RAG > Fallback RRF).
- **`NormalizadorTTS`**: Optimizador fonético y acústico (acrónimos UNSAAC).

---
*Desarrollado para la mejora y modernización de la orientación estudiantil en Ingeniería Informática y de Sistemas.*