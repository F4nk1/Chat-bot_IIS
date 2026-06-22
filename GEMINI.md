# Instrucciones del Proyecto (GEMINI.md)

Este archivo contiene las directrices de arquitectura y estándares de ingeniería para el Chatbot IIS.

## Arquitectura Local AI

El proyecto utiliza una arquitectura RAG (Retrieval-Augmented Generation) 100% local para garantizar la privacidad y el rendimiento en hardware específico (NVIDIA RTX 3050).

### Componentes Core
- **LLM Engine**: [Ollama](https://ollama.com/) ejecutando el modelo `phi3`.
- **Semantic Search**: `Sentence-Transformers` utilizando el modelo `paraphrase-multilingual-MiniLM-L12-v2`.
- **Backend**: FastAPI (Python) orquestando el flujo entre la base de conocimientos y el LLM.
- **Frontend**: React (Vite) con soporte para streaming de respuestas y gestión de historial.

## Estándares de Desarrollo

### 1. Manejo de Conversaciones
- Siempre enviar el `historial` desde el frontend al backend para mantener la hilación.
- El backend debe limitar el historial enviado al LLM a los últimos 4-6 mensajes para optimizar la VRAM.

### 2. Búsqueda de Conocimiento
- No utilizar comparaciones de texto plano. Todas las búsquedas deben ser vectoriales a través del `EmbeddingEngine`.
- Umbral de similitud configurado por defecto en `0.5` (ajustable en `.env`).

### 3. Integración de IA
- Mantener siempre un "fallback" a respuestas estáticas si el servicio de Ollama no está disponible.
- Las respuestas generadas por IA deben ser auditadas mediante el sistema de feedback del frontend.

## Configuración de Hardware (Específica del Usuario)
- **Distro**: Arch Linux.
- **GPU**: NVIDIA RTX 3050 Mobile.
- **Driver**: `ollama-cuda` vía pacman.
- **VRAM**: 4GB (Optimizar modelos para este límite).
