from backend.services.retrieval.motor_embeddings import motor_embeddings
from backend.services.knowledge.detector_intenciones import detector_intenciones
from backend.services.knowledge.knowledge_graph import knowledge_graph
from backend.services.nlu.ner import ner_engine
from backend.services.memory.context_manager import context_manager
from backend.services.nlu.symspell_checker import spell_checker
from backend.services.nlg.generador_llm import generador_llm
from backend.config.settings import ajustes
import random

class ChatbotEngine:
    """
    Orquesta la NLU (Intent + NER + SymSpell), Knowledge Graph, Contexto y NLG
    usando un enfoque híbrido con un SLM (Small Language Model).
    """
    @staticmethod
    def obtener_respuesta(mensaje: str, historial: list = None):
        if historial is None:
            historial = []

        # 0. Corrección Ortográfica Temprana
        mensaje_corregido = spell_checker.corregir(mensaje)

        # 1. Recuperar contexto del historial (Stateless / Máquina de Estados Básica)
        # Usamos modelo_semantico porque ahora el motor es híbrido
        tema_previo, codigo_historial, semestre_historial = context_manager.extraer_contexto_historial(
            historial, motor_embeddings.modelo_semantico
        )

        # 2. NLU: Resolución de Correferencia en el mensaje actual
        mensaje_contextualizado = context_manager.resolver_correferencia(mensaje_corregido, tema_previo)
        
        # Extraer entidades del mensaje actual
        entidades_actuales = ner_engine.extraer_entidades(mensaje_contextualizado)
        
        # Slot-Filling: Fusionar entidades
        codigo_activo = entidades_actuales.get("codigo_alumno") or codigo_historial
        semestre_activo = entidades_actuales.get("semestre") or semestre_historial
        
        # 3. NLU: Detección de Intenciones
        intencion = detector_intenciones.detectar(mensaje_contextualizado, motor_embeddings.modelo_semantico)
        
        # Override intent using state machine context or assistant's prompt context if user just provided missing slot
        ultimo_mensaje_asistente = None
        if historial:
            for msg in reversed(historial):
                rol = msg.get("role") or msg.get("rol")
                contenido = msg.get("content") or msg.get("contenido")
                if rol in ["assistant", "asistente"] and contenido:
                    ultimo_mensaje_asistente = contenido.lower()
                    break

        # Caso 1: Sobrescribir basándose en lo último que el bot preguntó/mencionó al usuario
        # SOLO si la intención actual no es de un tema específico ni de interacción social
        if intencion in ["General", "Info_Tutor", "Info_Alumno", "Cursos_Semestre"] and ultimo_mensaje_asistente:
            # Comprobar si el usuario realmente está proveyendo un código numérico o semestre
            tiene_numero = any(char.isdigit() for char in mensaje_corregido)
            
            if tiene_numero:
                if "tutor" in ultimo_mensaje_asistente and codigo_activo:
                    intencion = "Info_Tutor"
                elif ("alumno" in ultimo_mensaje_asistente or "datos" in ultimo_mensaje_asistente or "código" in ultimo_mensaje_asistente or "codigo" in ultimo_mensaje_asistente) and codigo_activo:
                    intencion = "Info_Alumno"
                elif ("semestre" in ultimo_mensaje_asistente or "malla" in ultimo_mensaje_asistente) and semestre_activo:
                    intencion = "Cursos_Semestre"

        # Caso 2: Sobrescribir de respaldo basándose en la última intención del usuario (si la actual fue clasificada como General y trae número)
        if intencion == "General" and tema_previo and any(char.isdigit() for char in mensaje_corregido):
            if tema_previo == "Info_Tutor" and codigo_activo:
                intencion = "Info_Tutor"
            elif tema_previo == "Info_Alumno" and codigo_activo:
                intencion = "Info_Alumno"
            elif tema_previo == "Cursos_Semestre" and semestre_activo:
                intencion = "Cursos_Semestre"
        
        respuesta_final = ""
        confianza = 1.0
        contexto_para_slm = ""

        # 4. Enrutamiento Lógico basado en Máquina de Estados / Interacción Social / Slot-Filling
        if intencion == "Saludo":
            respuestas_saludo = [
                "¡Hola! Soy DinoBot, tu orientador académico de la UNSAAC. ¿En qué te puedo ayudar hoy?",
                "¡Buenos días! Soy DinoBot. ¿Qué consulta o trámite académico deseas resolver?",
                "¡Hola! Bienvenido al sistema de orientación de la EPIIS. ¿Cómo te puedo orientar hoy?"
            ]
            respuesta_final = random.choice(respuestas_saludo)

        elif intencion == "Agradecimiento":
            respuestas_agradecimiento = [
                "¡De nada! Ha sido un gusto ayudarte. Si tienes más dudas sobre trámites o servicios de la UNSAAC, aquí estaré.",
                "¡Con mucho gusto! Éxitos en tu semestre académico antoniano.",
                "¡A ti! Recuerda que puedes consultarme cualquier otra duda sobre la universidad, tus trámites o asignaturas."
            ]
            respuesta_final = random.choice(respuestas_agradecimiento)

        elif intencion == "Despedida":
            respuestas_despedida = [
                "¡Hasta luego! Que tengas un excelente día académico. ¡Cuídate y muchos éxitos!",
                "¡Chao! Recuerda que el sistema de orientación de DinoBot está disponible siempre que lo necesites. ¡Hasta pronto!",
                "¡Nos vemos! Éxitos en tus estudios en la UNSAAC. ¡Cuídate!"
            ]
            respuesta_final = random.choice(respuestas_despedida)
            
        elif intencion == "Info_Tutor":
            # Interceptor RAG: responder desde el corpus si la pregunta es de caracter conceptual/general
            resultado_rag = motor_embeddings.buscar(mensaje_contextualizado)
            if resultado_rag["confianza"] >= 0.55:
                contexto_para_slm = resultado_rag['respuesta']
                confianza = resultado_rag['confianza']
            elif not codigo_activo:
                # Slot faltante
                respuesta_final = "Para decirte quién es tu tutor asignado, por favor indícame tu código de estudiante."
            else:
                tutor = knowledge_graph.obtener_tutor_de_alumno(codigo_activo)
                if tutor:
                    depto = tutor.get('departamento', '').strip()
                    correo = tutor.get('correo', '').strip()
                    respuesta_final = f"El tutor asignado al alumno {codigo_activo} es el docente {tutor['nombres']} {tutor['apellidos']}."
                    if depto:
                        respuesta_final += f" Pertenece al departamento de {depto}."
                    if correo:
                        respuesta_final += f" Su correo es {correo}."
                    if tutor.get('cubiculo'):
                        respuesta_final += f" Atiende en el cubículo número {tutor['cubiculo']}."
                else:
                    respuesta_final = f"No hay ningún tutor activo registrado para el alumno con código {codigo_activo}."
                    
        elif intencion == "Info_Alumno":
            # Interceptor RAG: responder desde el corpus si la pregunta es de caracter conceptual/general
            resultado_rag = motor_embeddings.buscar(mensaje_contextualizado)
            if resultado_rag["confianza"] >= 0.55:
                contexto_para_slm = resultado_rag['respuesta']
                confianza = resultado_rag['confianza']
            elif not codigo_activo:
                respuesta_final = "Por favor, indícame tu código de alumno de 6 dígitos para consultar tus datos."
            else:
                alumno = knowledge_graph.obtener_info_alumno(codigo_activo)
                if alumno:
                    plan = alumno.get('plan_curricular', '').strip()
                    semestre = alumno.get('semestre_actual', '').strip()
                    respuesta_final = f"El alumno con código {codigo_activo} es {alumno['nombres']} {alumno['apellidos']}, de la escuela de {alumno['escuela']}."
                    if plan:
                        respuesta_final += f" Plan Curricular: {plan}."
                    if semestre:
                        respuesta_final += f" Semestre actual: {semestre}."
                else:
                    respuesta_final = f"No existe información para el código {codigo_activo}."
                    
        elif intencion == "Cursos_Semestre":
            # Interceptor RAG: responder desde el corpus si la pregunta es de caracter conceptual/general
            resultado_rag = motor_embeddings.buscar(mensaje_contextualizado)
            if resultado_rag["confianza"] >= 0.55:
                contexto_para_slm = resultado_rag['respuesta']
                confianza = resultado_rag['confianza']
            elif not semestre_activo:
                respuesta_final = "Claro, ¿de qué semestre (del 1 al 10) deseas consultar la malla curricular?"
            else:
                cursos = knowledge_graph.obtener_cursos_por_semestre(semestre_activo)
                if cursos:
                    nombres = [c['nombre'] for c in cursos]
                    respuesta_final = f"Los cursos obligatorios para el semestre {semestre_activo} son: {', '.join(nombres)}."
                else:
                    respuesta_final = f"No hay cursos registrados para el semestre {semestre_activo}."
 
        elif intencion == "Cursos_Bloqueados":
            # Extraer entidad de curso mediante NER / Malla
            curso_desaprobado = entidades_actuales.get("curso") or ner_engine.extraer_curso(mensaje_corregido) or mensaje_corregido
            resultado_grafo = knowledge_graph.obtener_cursos_bloqueados(curso_desaprobado)
            if resultado_grafo:
                bloqueados = resultado_grafo["bloqueados"]
                respuesta_final = f"Si desapruebas {resultado_grafo['curso']}, no podrás llevar los siguientes cursos: {', '.join(bloqueados)}."
            else:
                # Fallback al RAG
                resultado = motor_embeddings.buscar(mensaje_contextualizado)
                contexto_para_slm = resultado['respuesta']
                confianza = resultado['confianza']
 
        elif intencion == "Info_Curso_Atributos":
            curso = knowledge_graph.obtener_info_curso(mensaje_corregido)
            if curso:
                creditos = curso.get('creditos', 'N/A')
                tipo = curso.get('tipo', 'N/A')
                area = curso.get('area', 'N/A')
                respuesta_final = f"El curso '{curso['nombre']}' vale {creditos} créditos. Es de tipo {tipo} y pertenece al área de {area}."
            else:
                resultado = motor_embeddings.buscar(mensaje_contextualizado)
                contexto_para_slm = resultado['respuesta']
                confianza = resultado['confianza']
                    
        elif intencion in ["Tramites", "Bienestar", "Practicas", "Reglamentos", "Movilidad", "Cursos_General", "Tutorias_General", "General"]:
            # Búsqueda Híbrida + RRF + Cross-Encoder
            resultado = motor_embeddings.buscar(mensaje_contextualizado)
            
            umbral = 0.46  # Umbral calibrado (0.46) para filtrar consultas fuera de contexto mientras se aceptan variaciones válidas
            
            if resultado["confianza"] < umbral:
                respuestas_vacias = [
                    "Soy DinoBot, orientador académico de la UNSAAC. No dispongo de información sobre ese tema en los reglamentos, ya que solo puedo orientarte sobre trámites, tutorías, mallas curriculares y servicios universitarios de la universidad.",
                    "Esa pregunta no corresponde al ámbito académico de la UNSAAC. Recuerda que puedo ayudarte con información sobre tus cursos, reglamentos, trámites y bienestar universitario.",
                    "No encontré información al respecto en la base de datos académica de la UNSAAC. Por favor, realiza una consulta relacionada con tus estudios o trámites universitarios."
                ]
                respuesta_final = random.choice(respuestas_vacias)
            else:
                contexto_para_slm = resultado['respuesta']
                confianza = resultado['confianza']
        
        else:
            respuesta_final = "No estoy seguro de cómo responder a eso. Intenta preguntarme sobre trámites, tutorías o reglamentos."

        # 5. NLG: Generación con Gemini API / LLM (Si no hay respuesta directa de Slot-Filling)
        if not respuesta_final and contexto_para_slm:
            respuesta_final = generador_llm.generar_respuesta(contexto_para_slm, mensaje_corregido)
            
            # Garantizar que si el contexto RAG contiene un enlace, la indicación en negrita y el enlace se preserven intactos
            import re
            match_enlace = re.search(r'\[([^\]]+)\]\((https?://[^\)]+)\)', contexto_para_slm)
            if match_enlace and match_enlace.group(0) not in respuesta_final:
                if "**A continuación te muestro más información en pantalla**" not in respuesta_final:
                    respuesta_final += "\n\n**A continuación te muestro más información en pantalla**"
                respuesta_final += f"\n\n{match_enlace.group(0)}"

        return {
            "pregunta": mensaje,
            "pregunta_corregida": mensaje_corregido,
            "respuesta": respuesta_final,
            "categoria": intencion,
            "confianza": float(confianza)
        }

# Alias para mantener compatibilidad
obtener_respuesta = ChatbotEngine.obtener_respuesta
