import os
import google.generativeai as genai

class LocalLLMGenerator:
    """
    Generador NLG (Natural Language Generation) usando Google Gemini API.
    Reemplaza al SLM local para mayor rapidez, precisión y evitar alucinaciones.
    """
    def __init__(self):
        self.model_id = "gemini-2.5-flash"  # Puedes cambiar a "gemini-1.5-pro" si prefieres usar Pro
        self.cargado = False
        self.model = None

    def cargar_modelo(self):
        if self.cargado:
            return
            
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "TU-API-KEY":
            print("Advertencia: GEMINI_API_KEY no configurada o es el valor por defecto. Usando fallback de contexto.")
            self.cargado = False
            return

        print(f"Inicializando API de Gemini ({self.model_id})...")
        try:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel(self.model_id)
            self.cargado = True
            print("Gemini API configurada correctamente.")
        except Exception as e:
            print(f"Error al inicializar la API de Gemini: {e}")
            self.cargado = False

    def generar_respuesta(self, contexto: str, pregunta: str) -> str:
        """
        Genera una respuesta natural basándose ÚNICAMENTE en el contexto proporcionado.
        """
        if not self.cargado:
            self.cargar_modelo()
            
        if not self.cargado or not self.model:
            # Fallback en caso de que no esté configurada la API o falle
            return f"{contexto}"

        # Instrucciones del sistema integradas en el prompt
        prompt = (
            "Eres DinoBot, el Asistente Académico de Ingeniería Informática y de Sistemas de la UNSAAC.\n"
            "Responde a la pregunta del usuario utilizando ÚNICAMENTE la información proporcionada en el contexto.\n"
            "Si la respuesta a la pregunta no se puede deducir del contexto, di estrictamente y de forma amable "
            "que no dispones de esa información en los reglamentos.\n"
            "Sé directo, claro y mantén un tono profesional.\n\n"
            f"Contexto: {contexto}\n"
            f"Pregunta: {pregunta}\n"
            "Respuesta:"
        )

        try:
            # Generar contenido usando Gemini
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Error en generación Gemini: {e}")
            return contexto # Fallback seguro

generador_llm = LocalLLMGenerator()
