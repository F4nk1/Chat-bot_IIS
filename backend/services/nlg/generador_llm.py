import os
import google.generativeai as genai

class GeminiLLMGenerator:
    """
    Generador NLG (Natural Language Generation) usando la API de Google Gemini.
    """
    def __init__(self):
        self.cargado = False
        
        # Lista de modelos ordenados de mayor a menor potencia/restricción
        self.modelos_disponibles = [
            "gemini-3.5-flash",
            "gemini-1.5-pro",
            "gemini-1.5-flash",
            "gemini-1.0-pro"
        ]

    def cargar_modelo(self):
        if self.cargado:
            return
            
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("Error: No se encontró GEMINI_API_KEY en las variables de entorno.")
            return

        print("Iniciando cliente de Gemini (Modo Fallback Multimodelo)...")
        try:
            genai.configure(api_key=api_key)
            self.cargado = True
            print("Cliente Gemini configurado correctamente.")
        except Exception as e:
            print(f"Error al inicializar la API de Gemini: {e}")
            self.cargado = False

    def ejecutar_con_fallback(self, prompt: str, generation_config=None) -> str:
        """
        Intenta generar contenido iterando por la lista de modelos.
        Si un modelo falla (ej. por Rate Limit), salta automáticamente al siguiente.
        """
        if not self.cargado:
            self.cargar_modelo()
            
        if not self.cargado:
            raise Exception("No se pudo cargar la API de Gemini.")

        ultimo_error = None
        for nombre_modelo in self.modelos_disponibles:
            try:
                # Instanciamos el modelo al vuelo (es un objeto muy ligero)
                modelo_temporal = genai.GenerativeModel(nombre_modelo)
                respuesta = modelo_temporal.generate_content(
                    prompt,
                    generation_config=generation_config
                )
                return respuesta.text.strip()
            except Exception as e:
                print(f"⚠️ El modelo {nombre_modelo} falló ({e}). Cambiando al siguiente...")
                ultimo_error = e
                
        raise Exception(f"Todos los modelos fallaron. Último error: {ultimo_error}")

    def generar_respuesta(self, contexto: str, pregunta: str) -> str:
        """
        Genera una respuesta natural basándose ÚNICAMENTE en el contexto proporcionado, usando Gemini.
        """
        if not self.cargado:
            self.cargar_modelo()
            
        if not self.cargado:
            return f"{contexto}"

        prompt = f"""
Eres DinoBot, el asistente académico de Ingeniería Informática y de Sistemas de la UNSAAC. 
Tu ÚNICA labor es humanizar y redactar de forma natural la información oficial que recibes en el 'Contexto' para responder a la 'Pregunta'.

REGLAS CRÍTICAS INQUEBRANTABLES:
1. ESTÁ ESTRICTAMENTE PROHIBIDO inventar información, usar conocimientos externos, añadir consejos personales o expandir acrónimos de formas que no estén explícitamente en el texto.
2. Si el Contexto no responde directamente a la Pregunta o es irrelevante, debes responder EXACTAMENTE la siguiente frase, sin añadir nada más: "No tengo información oficial al respecto en este momento."
3. Sé amable y directo, manteniendo un tono formal pero accesible.

Contexto oficial:
{contexto}

Pregunta del estudiante:
{pregunta}

Respuesta:
"""

        try:
            texto = self.ejecutar_con_fallback(
                prompt,
                generation_config=genai.types.GenerationConfig(temperature=0.1)
            )
            return texto
            
        except Exception as e:
            print(f"Error fatal en generación con Gemini: {e}")
            return "Lo siento, el servidor de Inteligencia Artificial está saturado en este momento (Límite de cuota gratuita superado). Por favor, intenta de nuevo en un par de minutos."

# Instancia global (mantenemos el nombre 'generador_llm' para compatibilidad con el resto del backend)
generador_llm = GeminiLLMGenerator()
