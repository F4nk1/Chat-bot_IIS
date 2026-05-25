# Chatbot IIS

## Crear entorno virtual

```bash
python -m venv venv
```

## Activar entorno virtual

```bash
source venv/bin/activate
```

## Instalar dependencias

```bash
pip install -r requirements.txt
```

## Ejecutar servidor

```bash
uvicorn backend.main:app --reload
```

# 📘 Arquitectura del Sistema

```text
┌──────────────────────┐
│    Extensión Web     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    FastAPI Backend   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Chatbot Service    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      NLP Service     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Retrieval Service   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────┐
│ Knowledge Base / SQLite      │
├──────────────────────────────┤
│ • FAQ                        │
│ • Tutorías                   │
│ • Reglamentos                │
│ • Servicios                  │
└──────────────────────────────┘
```

---

# 🔄 Flujo del Sistema

```text
Usuario
   │
   ▼
Frontend (Extensión Web)
   │
   ▼
FastAPI Route
   │
   ▼
Chatbot Service
   │
   ▼
NLP Service
   │
   ▼
Retrieval Service
   │
   ▼
Knowledge Base
   │
   ▼
Respuesta al Usuario
```

---

# 📂 Estructura del Proyecto

```text
project/
├── backend/
│   ├── config/              # Configuraciones generales
│   │
│   ├── models/              # Modelos de datos
│   │
│   ├── routes/              # Rutas FastAPI
│   │
│   ├── services/
│   │   ├── chatbot/         # Lógica del chatbot
│   │   ├── nlp/             # Procesamiento NLP
│   │   └── retrieval/       # Recuperación de información
│   │
│   ├── database/            # SQLite y conexión DB
│   │
│   ├── utils/               # Utilidades auxiliares
│   │
│   └── main.py              # Punto de entrada FastAPI
│
├── data/
│   ├── faq/                 # Preguntas frecuentes
│   ├── tutorias/            # Información de tutorías
│   ├── reglamentos/         # Reglamentos institucionales
│   └── servicios/           # Servicios universitarios
│
├── frontend/
│   ├── popup.html           # Interfaz principal
│   ├── popup.js             # Lógica frontend
│   └── style.css            # Estilos CSS
│
├── docs/                    # Documentación
│
├── tests/                   # Pruebas del sistema
│
├── requirements.txt         # Dependencias Python
├── .env                     # Variables de entorno
├── .gitignore
└── README.md
```

---

# 🛠️ Tecnologías y Herramientas

## Frontend
- HTML
- CSS
- JavaScript

## Backend
- Python 3.12+
- FastAPI

## NLP / Retrieval
- scikit-learn
- TF-IDF
- Cosine Similarity

## Base de Conocimiento
- JSON
- SQLite

## Arquitectura IA
- Retrieval-Based Chatbot