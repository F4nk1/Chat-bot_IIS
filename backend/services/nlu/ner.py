import re
import spacy

class NEREngine:
    def __init__(self):
        # Cargar modelo ligero de SpaCy en español
        try:
            self.nlp = spacy.load("es_core_news_sm")
        except OSError:
            # Fallback en caso de que no esté instalado
            self.nlp = None

        self.patron_codigo = r'\b[0-9]{6}\b'
        self.mapeo_semestre = {
            "primer": "1", "primero": "1", "1ro": "1",
            "segundo": "2", "2do": "2",
            "tercer": "3", "tercero": "3", "3ro": "3", "3er": "3",
            "cuarto": "4", "4to": "4",
            "quinto": "5", "5to": "5",
            "sexto": "6", "6to": "6",
            "septimo": "7", "séptimo": "7", "7mo": "7",
            "octavo": "8", "8vo": "8",
            "noveno": "9", "9no": "9",
            "decimo": "10", "décimo": "10", "10mo": "10"
        }

    def extraer_entidades(self, texto: str) -> dict:
        entidades = {
            "codigo_alumno": None,
            "semestre": None
        }
        
        texto_lower = texto.lower()
        
        # 1. Extracción de Código (Regex sigue siendo lo más seguro para formato exacto de 6 dígitos)
        match_codigo = re.search(self.patron_codigo, texto)
        if match_codigo:
            entidades["codigo_alumno"] = match_codigo.group(0)

        # 2. Extracción Avanzada de Semestre con SpaCy + Mapeo
        if self.nlp:
            doc = self.nlp(texto_lower)
            # Buscar tokens que puedan ser números ordinales o cardinales relacionados con semestre
            for token in doc:
                if token.text in self.mapeo_semestre:
                    entidades["semestre"] = self.mapeo_semestre[token.text]
                elif token.like_num and token.text.isdigit():
                    val = int(token.text)
                    if 1 <= val <= 10:
                        # Para evitar falsos positivos, requerimos contexto cercano
                        contexto = doc[max(0, token.i - 2) : min(len(doc), token.i + 3)]
                        palabras_contexto = [t.text for t in contexto]
                        if any(w in palabras_contexto for w in ["semestre", "ciclo", "nivel"]):
                            entidades["semestre"] = str(val)
        else:
            # Fallback a regex si spacy falla
            patron_semestre = r'\b(1|2|3|4|5|6|7|8|9|10|primer|segundo|tercer|cuarto|quinto|sexto|septimo|séptimo|octavo|noveno|decimo|décimo)\b'
            match_semestre = re.search(patron_semestre, texto_lower)
            if match_semestre:
                val = match_semestre.group(0)
                entidades["semestre"] = self.mapeo_semestre.get(val, val)
                
        return entidades

ner_engine = NEREngine()
