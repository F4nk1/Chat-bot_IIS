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

>**Nota:** Asegúrate de que el servidor `uvicorn` esté corriendo antes de ingresar a los enlaces.
* **Documentación API (Swagger):** ➡️ [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* **Interfaz de la Página Web:** ➡️ [http://127.0.0.1:8000/frontend/index.html](http://127.0.0.1:8000/frontend/index.html)

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
│   Conversation Service│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Knowledge Service  │
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
Conversation Service
   │
   ▼
Knowledge Service
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
│   ├── models/              # Modelos de datos (Chat, Historial)
│   │
│   ├── routes/              # Rutas FastAPI (Chat, Conversations)
│   │
│   ├── services/
│   │   ├── conversation/    # Lógica de chat (antes chatbot)
│   │   ├── knowledge/       # Procesamiento NLP (antes nlp)
│   │   ├── retrieval/       # Recuperación de información
│   │   └── memory/          # Módulo de memoria de usuario
│   │
│   ├── database/            # SQLite y controladores (DB, Historial)
│   │
│   └── main.py              # Punto de entrada FastAPI
│
├── data/                    # Corpus de conocimiento (JSON)
│
├── frontend/
│   ├── index.html           # Interfaz principal
│   ├── manifest.json        # Manifiesto extensión
│   ├── css/                 # Estilos (style.css, popup.css)
│   ├── js/                  # Lógica (popup.js, content.js)
│   ├── assets/              # Recursos visuales
│   └── components/          # Componentes modulares
│
├── tests/                   # Pruebas unitarias y CRUD
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