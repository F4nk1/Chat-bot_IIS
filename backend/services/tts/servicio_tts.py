import os
import uuid
import wave
from piper.voice import PiperVoice
from backend.config.settings import ajustes
from backend.services.tts.normalizador import normalizador_tts

class ServicioTTS:
    _instancia = None
    _voz = None

    def __new__(cls):
        if cls._instancia is None:
            cls._instancia = super(ServicioTTS, cls).__new__(cls)
            cls._inicializar_voz()
        return cls._instancia

    @classmethod
    def _inicializar_voz(cls):
        """Carga el modelo ONNX de Piper."""
        if not os.path.exists(ajustes.RUTA_MODELO_TTS):
            print(f"ADVERTENCIA: No se encontro el modelo TTS en {ajustes.RUTA_MODELO_TTS}")
            return

        try:
            cls._voz = PiperVoice.load(
                model_path=ajustes.RUTA_MODELO_TTS,
                config_path=ajustes.RUTA_CONFIG_TTS,
                use_cuda=False 
            )
            print("Servicio TTS inicializado correctamente con el modelo ONNX.")
        except Exception as e:
            print(f"Error al cargar el modelo TTS: {e}")

    def generar_audio(self, texto: str) -> str:
        """
        Sintetiza texto a voz y asegura un archivo WAV valido usando synthesize_wav.
        """
        if not self._voz:
            print("El servicio TTS no esta disponible (modelo no cargado).")
            return None

        # Prevenir ataques DoS a la CPU limitando el texto (máx ~1500 caracteres)
        texto_seguro = texto[:1500] if len(texto) > 1500 else texto
        
        texto_normalizado = normalizador_tts.normalizar(texto_seguro)
        if not texto_normalizado:
            texto_normalizado = "No hay texto para reproducir."

        if not os.path.exists(ajustes.CARPETA_AUDIO):
            os.makedirs(ajustes.CARPETA_AUDIO, exist_ok=True)

        nombre_archivo = f"voz_{uuid.uuid4().hex}.wav"
        ruta_salida = os.path.join(ajustes.CARPETA_AUDIO, nombre_archivo)

        try:
            # Usamos wave.open para crear el objeto que synthesize_wav requiere
            with wave.open(ruta_salida, "wb") as wav_file:
                # synthesize_wav configura automaticamente el formato (channels, width, rate)
                # si set_wav_format=True (valor por defecto)
                self._voz.synthesize_wav(texto_normalizado, wav_file)

            # Verificar que el archivo no sea solo la cabecera (mas de 44 bytes)
            if os.path.exists(ruta_salida) and os.path.getsize(ruta_salida) > 44:
                return nombre_archivo
            else:
                print(f"Error: El archivo {nombre_archivo} no contiene datos de audio.")
                return None
                
        except Exception as e:
            print(f"Error critico al generar audio: {e}")
            if os.path.exists(ruta_salida):
                try:
                    os.remove(ruta_salida)
                except:
                    pass
            return None

# Instancia singleton
servicio_tts = ServicioTTS()
