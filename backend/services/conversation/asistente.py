from backend.services.retrieval.motor_embeddings import motor_embeddings
from backend.services.knowledge.knowledge_graph import knowledge_graph
from backend.services.nlg.generador_llm import generador_llm
from backend.services.nlg.enrutador_gemini import enrutador_gemini
import random

class ChatbotEngine:
    memoria_sesion = {"codigo_activo": None}

    @staticmethod
    def obtener_respuesta(mensaje: str, historial: list = None):
        if historial is None:
            historial = []

        # 1. Enrutador LLM
        analisis = enrutador_gemini.analizar_mensaje(mensaje)
        herramienta = analisis.get("herramienta", "fuera_de_dominio")
        parametros = analisis.get("parametros", {})
        
        respuesta_final = ""
        contexto_para_slm = ""
        
        # 2. Ejecución de SQL Tools
        if herramienta == "saludo":
            respuestas = ["¡Hola! Soy DinoBot, tu asistente académico de la UNSAAC. ¿En qué te puedo ayudar hoy?", 
                          "¡Buenos días! Soy DinoBot. ¿Qué consulta universitaria tienes para mí?"]
            respuesta_final = random.choice(respuestas)
            
        elif herramienta == "error_api":
            respuesta_final = "Lo siento, mi cerebro artificial está sobrecargado en este momento (Límite de peticiones gratuitas). Por favor, espera un minuto y vuelve a preguntarme."
            
        elif herramienta == "fuera_de_dominio":
            respuestas_general = [
                "Soy DinoBot, asistente académico de la UNSAAC. Solo puedo ayudarte con trámites, tutorías, mallas curriculares y reglamentos universitarios.",
                "Esa pregunta no parece tener relación con mis funciones académicas. Pregúntame sobre tus cursos o algún reglamento.",
            ]
            respuesta_final = random.choice(respuestas_general)
            
        elif herramienta == "info_tutor":
            codigo = parametros.get("codigo") or ChatbotEngine.memoria_sesion["codigo_activo"]
            if not codigo:
                respuesta_final = "Para decirte quién es tu tutor asignado, por favor indícame tu código de estudiante de 6 dígitos."
            else:
                ChatbotEngine.memoria_sesion["codigo_activo"] = codigo
                tutor = knowledge_graph.obtener_tutor_de_alumno(codigo)
                if tutor:
                    respuesta_final = f"El tutor asignado al alumno {codigo} es el docente {tutor['nombres']} {tutor['apellidos']}."
                else:
                    respuesta_final = f"No hay ningún tutor activo registrado para el alumno con código {codigo}."

        elif herramienta == "alumnos_por_tutor":
            tutor_nombre = parametros.get("tutor", "")
            alumnos = knowledge_graph.obtener_alumnos_por_tutor(tutor_nombre)
            if alumnos:
                lista = [f"{a['nombres']} {a['apellidos']} ({a['codigo']})" for a in alumnos]
                respuesta_final = f"El docente {tutor_nombre} tiene a su cargo a los siguientes alumnos: {', '.join(lista)}."
            else:
                respuesta_final = f"No se encontraron alumnos asignados a un tutor llamado '{tutor_nombre}'."
                    
        elif herramienta == "info_alumno":
            codigo = parametros.get("codigo") or ChatbotEngine.memoria_sesion["codigo_activo"]
            if not codigo:
                respuesta_final = "Por favor, indícame tu código de alumno de 6 dígitos para consultar tus datos."
            else:
                ChatbotEngine.memoria_sesion["codigo_activo"] = codigo
                alumno = knowledge_graph.obtener_info_alumno(codigo)
                if alumno:
                    respuesta_final = f"El alumno con código {codigo} es {alumno['nombres']} {alumno['apellidos']}, de la escuela de {alumno['escuela']}."
                else:
                    respuesta_final = f"No existe información para el código {codigo}."
                    
        elif herramienta == "cursos_semestre":
            semestre = parametros.get("semestre")
            if not semestre:
                respuesta_final = "Claro, ¿de qué semestre (del 1 al 10) deseas consultar la malla curricular?"
            else:
                cursos = knowledge_graph.obtener_cursos_por_semestre(str(semestre))
                if cursos:
                    nombres = [c['nombre'] for c in cursos]
                    respuesta_final = f"Los cursos obligatorios para el semestre {semestre} son: {', '.join(nombres)}."
                else:
                    respuesta_final = f"No hay cursos registrados para el semestre {semestre}."
                    
        elif herramienta == "info_curso":
            curso_nombre = parametros.get("curso", "")
            curso = knowledge_graph.obtener_info_curso(curso_nombre)
            if curso:
                respuesta_final = f"El curso '{curso['nombre']}' vale {curso.get('creditos', 'N/A')} créditos. Es de tipo {curso.get('tipo', 'N/A')}."
            else:
                herramienta = "reglamentos"
                
        elif herramienta == "prerrequisitos_curso":
            curso_nombre = parametros.get("curso", "")
            resultado_grafo = knowledge_graph.obtener_prerrequisitos(curso_nombre)
            if resultado_grafo:
                prerreqs = resultado_grafo["prerrequisitos"]
                if prerreqs:
                    respuesta_final = f"Para llevar '{resultado_grafo['curso']}', primero debiste haber aprobado: {', '.join(prerreqs)}."
                else:
                    respuesta_final = f"El curso '{resultado_grafo['curso']}' no tiene prerrequisitos obligatorios."
            else:
                herramienta = "reglamentos"
                
        elif herramienta == "cursos_bloqueados":
            curso_nombre = parametros.get("curso", "")
            resultado_grafo = knowledge_graph.obtener_cursos_bloqueados(curso_nombre)
            if resultado_grafo:
                bloqueados = resultado_grafo["bloqueados"]
                respuesta_final = f"Si desapruebas '{resultado_grafo['curso']}', se bloquearán y no podrás llevar: {', '.join(bloqueados)}."
            else:
                herramienta = "reglamentos"

        # 3. Contexto Universal
        if herramienta == "reglamentos":
            contexto_para_slm = motor_embeddings.obtener_contexto_universal()
        
        # 4. Generación Final
        if not respuesta_final and contexto_para_slm:
            respuesta_final = generador_llm.generar_respuesta(contexto_para_slm, mensaje)

        return {
            "pregunta": mensaje,
            "respuesta": respuesta_final,
            "categoria": herramienta,
            "confianza": 1.0
        }

obtener_respuesta = ChatbotEngine.obtener_respuesta
