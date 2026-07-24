import re

class NormalizadorTTS:
    def __init__(self):
        # Mapeo de siglas y abreviaturas comunes (usar escapar puntos para regex)
        self.abreviaturas = {
            r"\bUNSAAC\b": "Universidad Nacional de San Antonio Abad del Cusco",
            r"\bIIS\b": "Ingeniería Informática y de Sistemas",
            r"\bVRA\b": "Vicerrectorado Académico",
            r"\bVRIN\b": "Vicerrectorado de Investigación",
            r"\bCEPU\b": "Centro de Estudios Preuniversitarios",
            r"\bDPA\b": "Dirección de Promoción Académica",
            r"\bart\.\B": "artículo",
            r"\bnro\.\B": "número",
            r"\bpag\.\B": "página",
            r"\bsig\.\B": "siguiente",
            r"\bU\.N\.S\.A\.A\.C\.\b": "Universidad Nacional de San Antonio Abad del Cusco"
        }

        # Simbolos que deben ser expandidos a palabras
        self.simbolos = {
            r"%": " por ciento",
            r"&": " y ",
            r"\+": " más ",
            r"=": " igual a ",
            r"@": " arroba "
        }

    def normalizar(self, texto: str) -> str:
        """
        Limpia y expande el texto para una sintesis de voz natural.
        """
        if not texto:
            return ""

        # 1. Eliminar enlaces Markdown [texto](url) y URLs directas completamente
        texto = re.sub(r'\[([^\]]+)\]\([^)]+\)', '', texto)
        texto = re.sub(r'https?://\S+', '', texto)

        # 2. Expandir siglas y abreviaturas
        for patron, reemplazo in self.abreviaturas.items():
            texto = re.sub(patron, reemplazo, texto, flags=re.IGNORECASE)

        # 3. Reemplazar simbolos especificos
        for patron, reemplazo in self.simbolos.items():
            texto = re.sub(patron, reemplazo, texto)

        # 4. Reemplazar barra diagonal (/) por " de " o espacio segun contexto, 
        # aqui lo simplificamos a espacio para evitar errores de lectura.
        texto = texto.replace("/", " de ")

        # 5. Limpiar formato Markdown y puntuacion extraña
        texto = self._limpiar_formato(texto)
        
        # 6. Eliminar espacios extra
        texto = re.sub(r'\s+', ' ', texto).strip()

        return texto

    def _limpiar_formato(self, texto: str) -> str:
        """Elimina caracteres de formato markdown y simbolos innecesarios."""
        # Eliminar asteriscos, guiones bajos, almohadillas
        for char in ["*", "_", "#", "`", "~"]:
            texto = texto.replace(char, "")
        
        return texto

# Instancia global
normalizador_tts = NormalizadorTTS()
