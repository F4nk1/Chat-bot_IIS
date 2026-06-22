import ollama
from backend.services.retrieval.motor_embeddings import motor_embeddings
from backend.services.knowledge.detector_intenciones import detector_intenciones
from backend.config.settings import ajustes

class ChatbotEngine:
    """
    Orquesta la detección de intenciones, la recuperación de información 
    y la generación de respuesta natural con un LLM local (Ollama).
    """
    @staticmethod
    def extraer_tema_previo(historial: list) -> str:
        if not historial:
            return ""
        
        # Buscar en el historial hacia atrás el tema principal del usuario
        for msg in reversed(historial):
            # En el formato de Ollama, la clave es 'role', pero en el frontend es 'rol'
            rol = msg.get("role") or msg.get("rol")
            contenido = msg.get("content") or msg.get("contenido")
            if rol in ["user", "usuario"] and contenido:
                cont = contenido.lower()
                if "comedor" in cont or "beca" in cont:
                    return "la Beca Comedor"
                elif "salud" in cont or "bienestar" in cont or "médico" in cont or "medico" in cont:
                    return "el Centro Universitario de Salud"
                elif "tutoria" in cont or "tutoría" in cont or "tutor" in cont:
                    return "la tutoría académica"
                elif "practica" in cont or "práctica" in cont:
                    return "las prácticas preprofesionales"
                elif "matricula" in cont or "matrícula" in cont:
                    return "la matrícula"
                elif "reglamento" in cont or "norma" in cont:
                    return "el reglamento académico"
        return ""

    @staticmethod
    def condensar_pregunta(mensaje: str, historial: list = None) -> str:
        if not historial:
            return mensaje
            
        tema_previo = ChatbotEngine.extraer_tema_previo(historial)
        if not tema_previo:
            return mensaje
            
        # Comprobar si el mensaje actual ya es independiente
        mensaje_lc = mensaje.lower()
        if any(k in mensaje_lc for k in ["tutoria", "tutoría", "comedor", "beca", "salud", "práctica", "practica", "matrícula", "matricula"]):
            return mensaje

        # Solo condensamos si tiene pronombres o palabras cortas típicas de seguimiento
        pronombres = ["eso", "esa", "él", "la", "lo", "allí", "ahí", "ellos", "ellas", "aquello", "requisito", "requisitos", "obligatoria", "obligatorio", "cuando", "dónde", "quién", "como", "cómo", "dónde", "donde", "por qué", "porque"]
        if not any(p in mensaje_lc.split() or len(mensaje_lc.split()) <= 4 for p in pronombres):
            return mensaje

        prompt = f"""Instrucción: Escribe la última pregunta del estudiante, pero reemplazando los pronombres ambiguos (como "eso", "esa", "él", "la", "lo", "allí", "ahí") por el sustantivo "{tema_previo}". 
Conserva todas las demás palabras exactamente iguales. No agregues saludos, explicaciones, ni texto adicional.

Ejemplo:
Tema: la tutoría académica
Última pregunta: ¿Es obligatoria?
Resultado: ¿La tutoría académica es obligatoria?

Tema: {tema_previo}
Última pregunta: {mensaje}
Resultado:"""

        try:
            # Hacemos una llamada rápida a phi3 para la condensación
            response = ollama.chat(model='phi3', messages=[{"role": "user", "content": prompt}])
            res = response['message']['content'].strip().strip('"').strip("'").split("\n")[-1].strip()
            if "Resultado:" in res:
                res = res.replace("Resultado:", "").strip()
            if res and len(res.split()) < 20:
                return res
        except Exception as e:
            print(f"Error al condensar pregunta en ChatbotEngine: {e}")
            
        return mensaje

    @staticmethod
    def obtener_respuesta(mensaje: str, historial: list = None):
        if historial is None:
            historial = []

        # 1. Condensar pregunta para el buscador semántico (RAG contextual)
        mensaje_busqueda = ChatbotEngine.condensar_pregunta(mensaje, historial)

        # 2. Detectar intención basada en la pregunta condensada
        intencion = detector_intenciones.detectar(mensaje_busqueda)

        # 3. Recuperación Semántica con la pregunta condensada
        resultado = motor_embeddings.buscar(mensaje_busqueda)

        # Filtrado inteligente por intención y confianza
        # Si la intención detectada es General y la confianza es menor a 0.75, no inyectamos contexto para evitar falsos positivos
        umbral_aplicado = 0.75 if intencion == "General" else ajustes.UMBRAL_SIMILITUD
        
        if resultado["confianza"] < umbral_aplicado:
            contexto = "No se encontró información específica en el reglamento. Si el usuario saluda o agradece, responde de forma amigable y corta. Si es otra pregunta académica, indica que no cuentas con información específica en el reglamento."
        else:
            contexto = f"Información del reglamento: {resultado['respuesta']}"

        # 4. Generación Natural con Ollama (Local LLM)
        try:
            # Construir el System Prompt estricto y conciso (DinoBot Persona)
            system_prompt = f"""Eres DinoBot, el asistente académico oficial de la UNSAAC (Universidad Nacional de San Antonio Abad del Cusco).
Tu objetivo es responder las consultas de los estudiantes de forma clara, amable, humana y MUY concisa (máximo 3 líneas de texto).

Reglas fundamentales:
1. Si hay 'Contexto del reglamento' útil para la pregunta, utilízalo como tu única fuente de verdad y resume la respuesta en 2 o 3 líneas.
2. Si el 'Contexto del reglamento' indica que no se encontró información específica, indícale de manera amable al estudiante que no tienes esa información en el reglamento académico actualmente. NUNCA inventes artículos, fechas o normas que no estén en el contexto.
3. Si el estudiante te saluda ("hola", "buenos días") o te agradece, responde de forma amigable, muy corta y servicial sin inventar normas.
4. Limita estrictamente tus respuestas a 3 líneas de texto. Evita dar explicaciones largas o repetir la información.
5. Usa un tono amigable, educativo e institucional.

Contexto actual del reglamento:
{contexto}"""

            mensajes_llm = [
                {"role": "system", "content": system_prompt}
            ]
            
            # Añadir historial relevante (últimos 4 mensajes)
            for msg in historial[-4:]:
                # Mapear roles por seguridad si vienen con llaves del frontend
                rol = "user" if msg.get("role") in ["user", "usuario"] or msg.get("rol") in ["user", "usuario"] else "assistant"
                contenido = msg.get("content") or msg.get("contenido") or ""
                mensajes_llm.append({"role": rol, "content": contenido})
            
            # Añadir mensaje actual del usuario
            mensajes_llm.append({"role": "user", "content": mensaje})

            response = ollama.chat(model='phi3', messages=mensajes_llm)
            respuesta_final = response['message']['content'].strip()

        except Exception as e:
            print(f"Error al conectar con Ollama: {e}. Usando respuesta estática.")
            # Fallback a la respuesta estática si Ollama falla
            if resultado["confianza"] < umbral_aplicado:
                respuesta_final = "Lo siento, no encuentro información específica sobre eso en el reglamento académico de la universidad. ¿Podrías ser más específico con tu consulta?"
            else:
                respuesta_final = resultado["respuesta"]

        return {
            "pregunta": mensaje,
            "respuesta": respuesta_final,
            "categoria": intencion,
            "confianza": resultado["confianza"]
        }

# Alias para mantener compatibilidad
obtener_respuesta = ChatbotEngine.obtener_respuesta
