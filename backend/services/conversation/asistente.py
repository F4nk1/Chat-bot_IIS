from backend.services.retrieval.motor_embeddings import motor_embeddings
from backend.services.knowledge.detector_intenciones import detector_intenciones
from backend.services.knowledge.knowledge_graph import knowledge_graph
from backend.services.nlu.ner import ner_engine
from backend.services.memory.context_manager import context_manager
from backend.config.settings import ajustes
import random

class ChatbotEngine:
    """
    Orquesta la NLU (Intent + NER), Knowledge Graph, Contexto y NLG
    usando un enfoque híbrido de IA clásica sin modelos generativos externos.
    """
    @staticmethod
    def obtener_respuesta(mensaje: str, historial: list = None, session_id: str = "default_session"):
        if historial is None:
            historial = []

        # 1. NLU: Reconocimiento de Entidades y Resolución de Correferencia
        mensaje_contextualizado = context_manager.resolver_correferencia(mensaje, session_id)
        entidades = ner_engine.extraer_entidades(mensaje_contextualizado)
        
        # 2. NLU: Detección de Intenciones (SVM Clasificador)
        intencion = detector_intenciones.detectar(mensaje_contextualizado, motor_embeddings.modelo)
        
        # 3. Actualizar Contexto de Memoria
        sesion = context_manager.actualizar_contexto(session_id, intencion, entidades)
        codigo_activo = sesion.get("entidad_codigo")
        semestre_activo = entidades.get("semestre")

        respuesta_final = ""
        confianza = 1.0

        # 4. Enrutamiento Lógico basado en Grafo de Conocimiento vs. Embedding RAG
        if intencion == "Saludo":
            respuestas = ["¡Hola! Soy DinoBot, tu asistente académico de la UNSAAC. ¿En qué te puedo ayudar hoy?", 
                          "¡Buenos días! ¿Qué consulta universitaria tienes para mí?"]
            respuesta_final = random.choice(respuestas)
            
        elif intencion == "Agradecimiento":
            respuesta_final = "¡De nada! Estoy aquí para ayudarte en lo que necesites."
            
        elif intencion == "Info_Tutor":
            if not codigo_activo:
                respuesta_final = "Para decirte quién es tu tutor asignado, por favor indícame tu código de estudiante."
            else:
                tutor = knowledge_graph.obtener_tutor_de_alumno(codigo_activo)
                if tutor:
                    nombre_completo = f"{tutor['nombres']} {tutor['apellidos']}"
                    respuesta_final = f"El tutor asignado al código {codigo_activo} es el docente {nombre_completo} del departamento de {tutor['departamento']}."
                else:
                    respuesta_final = f"Lo siento, no encontré un tutor asignado activo para el código de estudiante {codigo_activo}."
                    
        elif intencion == "Info_Alumno":
            if not codigo_activo:
                respuesta_final = "Por favor, indícame el código de alumno que deseas consultar."
            else:
                alumno = knowledge_graph.obtener_info_alumno(codigo_activo)
                if alumno:
                    respuesta_final = f"El alumno {alumno['nombres']} {alumno['apellidos']} pertenece a la escuela de {alumno['escuela']}, y se encuentra matriculado."
                else:
                    respuesta_final = f"No pude encontrar información para el código de alumno {codigo_activo}."
                    
        elif intencion == "Cursos_Semestre":
            if not semestre_activo:
                respuesta_final = "Claro, ¿para qué semestre (del 1 al 10) quieres ver la malla curricular?"
            else:
                cursos = knowledge_graph.obtener_cursos_por_semestre(semestre_activo)
                if cursos:
                    nombres_cursos = [c['nombre'] for c in cursos]
                    lista_cursos = ", ".join(nombres_cursos)
                    respuesta_final = f"Para el semestre {semestre_activo}, los cursos de la malla son: {lista_cursos}."
                else:
                    respuesta_final = f"No encontré información de cursos para el semestre {semestre_activo}."
                    
        elif intencion in ["Tramites", "Bienestar", "Practicas", "Reglamentos", "General"]:
            # Búsqueda Vectorial RAG (Embedding)
            resultado = motor_embeddings.buscar(mensaje_contextualizado)
            
            umbral = 0.75 if intencion == "General" else ajustes.UMBRAL_SIMILITUD
            
            if resultado["confianza"] < umbral:
                if intencion == "General":
                    respuesta_final = "Soy DinoBot, un asistente académico exclusivo para temas de la UNSAAC. Solo puedo ayudarte con información sobre trámites, tutorías, mallas curriculares y reglamentos universitarios. ¿En qué tema universitario te puedo ayudar hoy?"
                else:
                    respuesta_final = "No encontré información específica sobre eso en los reglamentos o manuales actuales. ¿Podrías detallar un poco más tu consulta?"
            else:
                # NLG básico: Prefixamos el tipo de información si es general
                prefijo = ""
                if intencion != "General":
                    prefijo = f"Según la información de {intencion}: "
                respuesta_final = f"{prefijo}{resultado['respuesta']}"
                confianza = resultado["confianza"]
        
        else:
            respuesta_final = "No estoy seguro de cómo responder a eso. Intenta preguntarme sobre trámites, tutorías o reglamentos."

        return {
            "pregunta": mensaje,
            "respuesta": respuesta_final,
            "categoria": intencion,
            "confianza": float(confianza)
        }

# Alias para mantener compatibilidad
obtener_respuesta = ChatbotEngine.obtener_respuesta
