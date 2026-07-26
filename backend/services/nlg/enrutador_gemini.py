import os
import json
import google.generativeai as genai
from backend.services.nlg.generador_llm import generador_llm

class EnrutadorGemini:
    """
    Enrutador Inteligente con JSON Outputs.
    """
    
    def analizar_mensaje(self, mensaje: str) -> dict:
        if not generador_llm.cargado:
            generador_llm.cargar_modelo()
            
        if not generador_llm.cargado:
            return {"herramienta": "fuera_de_dominio", "parametros": {}}
            
        prompt = f"""
Eres un orquestador experto de bases de datos para un asistente de universidad (UNSAAC). 
Lee el mensaje del estudiante y devuelve un JSON válido determinando qué función se debe ejecutar.

Las herramientas disponibles son:
1. "info_tutor": Si pregunta quién es su tutor asignado. Parámetro: "codigo" (6 dígitos).
2. "info_alumno": Si pregunta por sus propios datos de estudiante. Parámetro: "codigo" (6 dígitos).
3. "alumnos_por_tutor": Si pregunta qué alumnos tiene a cargo un profesor específico. Parámetro: "tutor" (nombre del docente).
4. "cursos_semestre": Si pregunta qué cursos debe llevar en un semestre (ej. 5to semestre). Parámetro: "semestre" (número).
5. "info_curso": Si pregunta cuántos créditos vale un curso, de qué área es, etc. Parámetro: "curso".
6. "prerrequisitos_curso": Si pregunta qué debió haber llevado ANTES de cierto curso (prerrequisitos). Parámetro: "curso".
7. "cursos_bloqueados": Si pregunta qué cursos NO PODRÁ llevar en el futuro si "jala" o desaprueba un curso actual. Parámetro: "curso".
8. "reglamentos": Si pregunta por trámites, prácticas, bienestar, movilidad, comedor, tesis, titulación, requisitos, y CUALQUIER norma general de la universidad. (NO requiere parámetros).
9. "saludo": Si es hola, gracias, chau. (NO requiere parámetros).
10. "fuera_de_dominio": Si es una pregunta totalmente ajena al ámbito universitario.

Mensaje del estudiante: "{mensaje}"

Responde ÚNICAMENTE con el objeto JSON estructurado: {{"herramienta": "nombre_herramienta", "parametros": {{"clave": "valor"}}}}
"""

        try:
            texto_crudo = generador_llm.ejecutar_con_fallback(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.0,
                    response_mime_type="application/json"
                )
            )
            # Limpiar posible markdown devuelto por error por la IA
            if texto_crudo.startswith("```json"):
                texto_crudo = texto_crudo[7:]
            if texto_crudo.startswith("```"):
                texto_crudo = texto_crudo[3:]
            if texto_crudo.endswith("```"):
                texto_crudo = texto_crudo[:-3]
                
            data = json.loads(texto_crudo.strip())
            return data
        except Exception as e:
            print(f"Error en Enrutador Gemini: {e}")
            return {"herramienta": "error_api", "parametros": {}}

enrutador_gemini = EnrutadorGemini()
