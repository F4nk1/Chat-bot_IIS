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
        if ultimo_mensaje_asistente:
            # Solo sobreescribimos si el asistente realmente estaba formulando una pregunta de slot al usuario
            es_pregunta_slot = any(p in ultimo_mensaje_asistente for p in ["indícame", "indicame", "dame", "escribe", "ingresa", "por favor", "cuál", "cual", "quién", "quien", "¿"])
            
            if es_pregunta_slot:
                if "tutor" in ultimo_mensaje_asistente and codigo_activo:
                    intencion = "Info_Tutor"
                elif ("alumno" in ultimo_mensaje_asistente or "datos" in ultimo_mensaje_asistente or "código" in ultimo_mensaje_asistente or "codigo" in ultimo_mensaje_asistente) and codigo_activo:
                    intencion = "Info_Alumno"
                elif ("semestre" in ultimo_mensaje_asistente or "malla" in ultimo_mensaje_asistente) and semestre_activo:
                    intencion = "Cursos_Semestre"

        # Caso 2: Sobrescribir de respaldo basándose en la última intención del usuario (si la actual fue clasificada como General)
        if intencion == "General" and tema_previo:
            if tema_previo == "Info_Tutor" and codigo_activo:
                intencion = "Info_Tutor"
            elif tema_previo == "Info_Alumno" and codigo_activo:
                intencion = "Info_Alumno"
            elif tema_previo == "Cursos_Semestre" and semestre_activo:
                intencion = "Cursos_Semestre"
        
        respuesta_final = ""
        confianza = 1.0
        contexto_para_slm = ""

        # 4. Enrutamiento Lógico basado en Máquina de Estados / Slot-Filling
        if intencion == "Saludo":
            respuestas = ["¡Hola! Soy DinoBot, tu asistente académico de la UNSAAC. ¿En qué te puedo ayudar hoy?", 
                          "¡Buenos días! Soy DinoBot. ¿Qué consulta universitaria tienes para mí?"]
            respuesta_final = random.choice(respuestas)
        elif intencion == "Agradecimiento":
            respuesta_final = "¡De nada! Estoy aquí para ayudarte en lo que necesites."
            
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
 
        elif intencion == "Cursos_Bloqueados": # Nueva intención inferida
            # Intentamos extraer un curso mencionado
            curso_desaprobado = mensaje_corregido # Simplificación, el SLM o NER debería extraerlo
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
            
            umbral = 0.45 if intencion == "General" else 0.35 # Umbral calibrado de 0.40 a 0.35
            
            if resultado["confianza"] < umbral:
                if intencion == "General":
                    respuestas_general = [
                        "Soy DinoBot, asistente académico de la UNSAAC. Solo puedo ayudarte con trámites, tutorías, mallas curriculares y reglamentos universitarios.",
                        "Esa pregunta no parece tener relación con mis funciones académicas. Pregúntame sobre tus cursos o algún reglamento.",
                        "Para eso no hay respuesta en mi base de datos, ya que solo domino temas académicos de la UNSAAC.",
                        "No tengo información al respecto. Mi especialidad son los trámites y consultas universitarias."
                    ]
                    respuesta_final = random.choice(respuestas_general)
                else:
                    respuestas_vacias = [
                        "No encontré información específica sobre eso en los reglamentos actuales. ¿Podrías detallar un poco más tu consulta?",
                        "No tengo registros sobre ese tema en particular. Tal vez podrías consultar directamente con la dirección de escuela.",
                        "Lamentablemente, no pude encontrar esa información en mis documentos base."
                    ]
                    respuesta_final = random.choice(respuestas_vacias)
            else:
                contexto_para_slm = resultado['respuesta']
                confianza = resultado['confianza']
        
        else:
            respuesta_final = "No estoy seguro de cómo responder a eso. Intenta preguntarme sobre trámites, tutorías o reglamentos."

        # 5. NLG: Generación con el SLM In-House (Si no hay respuesta directa de Slot-Filling)
        if not respuesta_final and contexto_para_slm:
            # Pasamos el contexto riguroso recuperado y la pregunta corregida al SLM
            respuesta_final = generador_llm.generar_respuesta(contexto_para_slm, mensaje_corregido)

        return {
            "pregunta": mensaje,
            "pregunta_corregida": mensaje_corregido,
            "respuesta": respuesta_final,
            "categoria": intencion,
            "confianza": float(confianza)
        }

# Alias para mantener compatibilidad
obtener_respuesta = ChatbotEngine.obtener_respuesta
