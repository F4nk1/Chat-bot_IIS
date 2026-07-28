# Makefile para automatización del Chatbot Académico (DinoBot)

# Definición del shell para garantizar compatibilidad con comandos de consola avanzados
SHELL := /bin/bash

.DEFAULT_GOAL := help

# Cargar variables de entorno desde .env si existe
ifneq (,$(wildcard .env))
    include .env
    export
endif

# Variables de entorno por defecto
API_HOST ?= 0.0.0.0
API_PORT ?= 8000

# Colores para mejorar la legibilidad en la consola
BLUE   := \033[36m
RESET  := \033[0m
GREEN  := \033[32m
YELLOW := \033[33m

.PHONY: help setup db-init db-migrate db-reset run-backend run-frontend build-frontend run test clean

help: ## Muestra este menú de ayuda detallando qué hace cada comando
	@echo -e "$(GREEN)========================================================================$(RESET)"
	@echo -e "           SISTEMA DE AUTOMATIZACIÓN - CHATBOT ACADÉMICO (DINOBOT)       "
	@echo -e "$(GREEN)========================================================================$(RESET)"
	@echo -e "Uso: make $(YELLOW)[comando]$(RESET)"
	@echo -e ""
	@echo -e "Comandos disponibles:"
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(BLUE)%-20s$(RESET) %s\n", $$1, $$2}'
	@echo -e "$(GREEN)========================================================================$(RESET)"

venv:
	@echo -e "$(YELLOW)[1/2] Creando entorno virtual de Python en venv...$(RESET)"
	python3 -m venv venv
	@echo -e "$(GREEN)Entorno virtual creado exitosamente en venv/.$(RESET)"

setup: venv ## Configura el entorno virtual de Python e instala dependencias de backend y frontend
	@echo -e "$(YELLOW)[2/2] Instalando dependencias de Python (Backend)...$(RESET)"
	venv/bin/pip install --upgrade pip
	venv/bin/pip install -r requirements.txt
	@echo -e "$(YELLOW)Instalando dependencias de Node.js (Frontend)...$(RESET)"
	cd frontend && npm install
	@echo -e "$(GREEN)¡Configuración completada con éxito!$(RESET)"

db-init: ## Crea las tablas e inicializa la estructura de la base de datos SQLite
	@echo -e "$(YELLOW)Inicializando estructura de base de datos SQLite...$(RESET)"
	PYTHONPATH=. venv/bin/python -m backend.database.bd_gestion
	@echo -e "$(GREEN)Estructura de la base de datos inicializada.$(RESET)"

db-migrate: ## Importa los datos JSON de FAQs y reglamentos a la base de datos
	@echo -e "$(YELLOW)Migrando datos JSON a la base de datos SQLite...$(RESET)"
	PYTHONPATH=. venv/bin/python -m backend.database.migrar_datos
	@echo -e "$(GREEN)Datos migrados con éxito.$(RESET)"

db-reset: ## Elimina la base de datos actual y la vuelve a inicializar y migrar desde cero
	@echo -e "$(YELLOW)Eliminando base de datos actual...$(RESET)"
	rm -f backend/database/chatbot.db
	@$(MAKE) db-init
	@$(MAKE) db-migrate
	@echo -e "$(GREEN)Base de datos restablecida por completo.$(RESET)"

run-backend: ## Inicia el servidor backend de FastAPI (Uvicorn)
	@echo -e "$(YELLOW)Iniciando servidor Backend FastAPI en http://$(API_HOST):$(API_PORT)...$(RESET)"
	venv/bin/uvicorn backend.main:aplicacion --reload --host $(API_HOST) --port $(API_PORT)

run-frontend: ## Inicia el servidor de desarrollo del frontend (Vite/React)
	@echo -e "$(YELLOW)Iniciando servidor de desarrollo Frontend (Vite)...$(RESET)"
	cd frontend && npm run dev -- --host

build-frontend: ## Compila el código del frontend para el entorno de producción
	@echo -e "$(YELLOW)Compilando el frontend (producción)...$(RESET)"
	cd frontend && npm run build
	@echo -e "$(GREEN)Frontend compilado correctamente en frontend/dist.$(RESET)"

run: ## Inicia de forma concurrente el servidor backend y el servidor frontend expuestos en la red
	@IP=$$(ip route get 1.1.1.1 2>/dev/null | awk '{print $$7}' || hostname -I | awk '{print $$1}'); \
	echo -e "$(GREEN)========================================================================$(RESET)"; \
	echo -e " 🚀 $(GREEN)SERVIDORES DE DINOBOT INICIADOS EN LA RED LOCAL$(RESET)"; \
	echo -e "------------------------------------------------------------------------"; \
	echo -e " 👉 Acceso en esta PC:      $(BLUE)http://localhost:5173$(RESET)"; \
	if [ -n "$$IP" ]; then \
		echo -e " 👉 Acceso en la red local: $(BLUE)http://$$IP:5173$(RESET)"; \
		echo -e " 👉 API Backend en la red:  $(BLUE)http://$$IP:8000$(RESET)"; \
	else \
		echo -e " ⚠️ $(YELLOW)No se pudo determinar tu dirección IP local. Verifica tu red.$(RESET)"; \
	fi; \
	echo -e "$(GREEN)========================================================================$(RESET)"; \
	echo -e "$(YELLOW)Iniciando Backend y Frontend de forma paralela...$(RESET)"
	@(make run-backend & make run-frontend & wait)

test: ## Ejecuta el conjunto completo de pruebas unitarias del chatbot
	@echo -e "$(YELLOW)Ejecutando pruebas unitarias del chatbot...$(RESET)"
	venv/bin/python -m unittest discover -s tests

clean: ## Remueve los archivos compilados de Python, __pycache__ y compilaciones de Vite
	@echo -e "$(YELLOW)Limpiando archivos temporales y de caché...$(RESET)"
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	rm -rf frontend/dist
	@echo -e "$(GREEN)Limpieza completada.$(RESET)"
