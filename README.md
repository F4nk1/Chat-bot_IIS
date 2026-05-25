# Arquitectura
            [Extensión Web]
                |
                v
           [FastAPI Backend]
                |
        +-------------------+
        |                   |
        v                   v
 [Módulo Chatbot]   [Módulo Retrieval]
        |                   |
        +----------+--------+
                |
                v por evaluar 
        [Base de Conocimiento]
           ├── Corpus FAQ
           ├── Reglamento Tutorías
           ├── Servicios UNSAAC
           └── Preguntas frecuentes