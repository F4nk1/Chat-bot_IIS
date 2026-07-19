import os
from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer
import torch

class LocalLLMGenerator:
    """
    Generador NLG (Natural Language Generation) usando un SLM (Small Language Model) local.
    Diseñado para correr en CPU o GPU, sin depender de APIs externas.
    """
    def __init__(self):
        # Usamos un modelo instructivo pequeño. 
        # Para producción, se puede cambiar por un modelo fine-tuneado propio de la UNSAAC.
        # Qwen2.5-0.5B-Instruct es excelente y ligero, o SmolLM.
        # Aquí usamos Qwen/Qwen2.5-0.5B-Instruct como ejemplo de SLM in-house base.
        self.model_id = "Qwen/Qwen2.5-0.5B-Instruct"
        self.cargado = False
        self.pipeline = None

    def cargar_modelo(self):
        if self.cargado:
            return
            
        print(f"Cargando SLM local ({self.model_id})...")
        try:
            tokenizer = AutoTokenizer.from_pretrained(self.model_id)
            model = AutoModelForCausalLM.from_pretrained(
                self.model_id, 
                torch_dtype=torch.float32, # float32 para compatibilidad total CPU
                device_map="auto"
            )
            self.pipeline = pipeline(
                "text-generation",
                model=model,
                tokenizer=tokenizer,
                max_new_tokens=150,
                temperature=0.3, # Baja temperatura para respuestas factuales
                do_sample=True,
                repetition_penalty=1.1
            )
            self.cargado = True
            print("SLM cargado correctamente.")
        except Exception as e:
            print(f"Error al cargar el SLM: {e}")
            self.cargado = False

    def generar_respuesta(self, contexto: str, pregunta: str) -> str:
        """
        Genera una respuesta natural basándose ÚNICAMENTE en el contexto proporcionado.
        """
        if not self.cargado:
            self.cargar_modelo()
            
        if not self.cargado or not self.pipeline:
            # Fallback en caso de que falle la carga del modelo
            return f"{contexto}"

        prompt = (
            "Eres DinoBot, el Asistente Académico de Ingeniería Informática y de Sistemas de la UNSAAC. "
            "Responde a la pregunta del usuario utilizando ÚNICAMENTE la información del contexto. "
            "Si la respuesta no está en el contexto, di que no tienes esa información. Sé amable y directo.\n\n"
            f"Contexto: {contexto}\n"
            f"Pregunta: {pregunta}\n"
            "Respuesta:"
        )

        try:
            # Formato de chat para modelos instructivos si lo soportan, 
            # pero el prompt plano funciona bien en la mayoría.
            mensajes = [
                {"role": "system", "content": "Eres DinoBot, el Asistente Académico de Ingeniería Informática y de Sistemas de la UNSAAC. Responde usando solo el contexto."},
                {"role": "user", "content": f"Contexto: {contexto}\nPregunta: {pregunta}"}
            ]
            
            # Usar chat template
            prompt_chat = self.pipeline.tokenizer.apply_chat_template(
                mensajes, tokenize=False, add_generation_prompt=True
            )
            
            salida = self.pipeline(prompt_chat)
            texto_generado = salida[0]['generated_text']
            
            # Extraer solo la respuesta del asistente
            respuesta_limpia = texto_generado.split("<|im_start|>assistant\n")[-1].replace("<|im_end|>", "").strip()
            return respuesta_limpia
            
        except Exception as e:
            print(f"Error en generación LLM: {e}")
            return contexto # Fallback seguro

generador_llm = LocalLLMGenerator()
