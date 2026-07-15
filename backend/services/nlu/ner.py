import re

class NEREngine:
    def __init__(self):
        # Patrones comunes para entidades universitarias
        self.patron_codigo = r'\b[0-9]{6}\b'
        self.patron_semestre = r'\b(1|2|3|4|5|6|7|8|9|10|primer|segundo|tercer|cuarto|quinto|sexto|septimo|séptimo|octavo|noveno|decimo|décimo)\b'

    def extraer_entidades(self, texto: str) -> dict:
        entidades = {
            "codigo_alumno": None,
            "semestre": None
        }
        
        texto_lower = texto.lower()
        
        # Extraer código
        match_codigo = re.search(self.patron_codigo, texto)
        if match_codigo:
            entidades["codigo_alumno"] = match_codigo.group(0)
            
        # Extraer semestre
        match_semestre = re.search(self.patron_semestre, texto_lower)
        if match_semestre:
            val = match_semestre.group(0)
            # Mapeo a número si es palabra
            mapeo = {
                "primer": "1", "segundo": "2", "tercer": "3", "cuarto": "4",
                "quinto": "5", "sexto": "6", "septimo": "7", "séptimo": "7",
                "octavo": "8", "noveno": "9", "decimo": "10", "décimo": "10"
            }
            entidades["semestre"] = mapeo.get(val, val)
            
        return entidades

ner_engine = NEREngine()
