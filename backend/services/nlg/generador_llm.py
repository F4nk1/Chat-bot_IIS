import os
from dotenv import load_dotenv

load_dotenv()

class LocalLLMGenerator:
    """
    Generador NLG (Natural Language Generation) usando Google Gemini API (SDK google-genai).
    Reemplaza al SLM local para mayor rapidez, precisión y evitar alucinaciones.
    """
    def __init__(self):
        self.model_id = "gemini-flash-latest"  # Modelo activo recomendado
        self.cargado = False
        self.client = None

    def cargar_modelo(self):
        if self.cargado:
            return
            
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "TU-API-KEY":
            print("Advertencia: GEMINI_API_KEY no configurada o es el valor por defecto. Usando fallback de contexto.")
            self.cargado = False
            return

        try:
            from google import genai
        except ImportError:
            print("Advertencia: Paquete google-genai no instalado. Usando fallback de contexto.")
            self.cargado = False
            return

        modelos_a_probar = ["gemini-flash-latest", "gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-pro-latest"]

        for mid in modelos_a_probar:
            try:
                print(f"Inicializando API de Gemini ({mid})...")
                client = genai.Client(api_key=api_key)
                response = client.models.generate_content(model=mid, contents="Hola")
                if response and response.text:
                    self.client = client
                    self.model_id = mid
                    self.cargado = True
                    print(f"Gemini API configurada correctamente con {mid}.")
                    break
            except Exception as e:
                print(f"No se pudo cargar el modelo {mid}: {e}")
                self.cargado = False

    def generar_respuesta(self, contexto: str, pregunta: str) -> str:
        """
        Genera una respuesta natural basándose ÚNICAMENTE en el contexto proporcionado.
        """
        if not self.cargado:
            self.cargar_modelo()
            
        if not self.cargado or not self.client:
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
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt
            )
            return response.text.strip()
        except Exception as e:
            print(f"Error en generación Gemini: {e}")
            return contexto # Fallback seguro

generador_llm = LocalLLMGenerator()
