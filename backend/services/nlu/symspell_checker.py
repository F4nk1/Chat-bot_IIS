import os
from symspellpy import SymSpell

class SpellChecker:
    def __init__(self):
        # max_dictionary_edit_distance determines the tolerance for typos
        self.sym_spell = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)
        
        # Diccionario ampliado de dominios para evitar corregir erróneamente palabras en español
        terminos_unsaac = [
            "matricula", "tutor", "tutores", "tutoria", "tutorias", "semestre", "tramite", "tramites",
            "reglamento", "reglamentos", "malla", "curricular", "codigo", "profesor", "docente", "docentes",
            "practicas", "bienestar", "academico", "epis", "unsaac", "consigo", "conseguir", "obtengo",
            "obtener", "puedo", "como", "donde", "solicitar", "solicito", "solicitud", "requisitos",
            "comedor", "vacante", "vacantes", "cupo", "cupos", "pago", "pagar", "pagos", "constancia",
            "certificado", "notas", "record", "egresado", "movilidad", "beca", "becas", "intercambio",
            "convalidar", "convalidacion", "salud", "psicologia", "psicopedagogia"
        ]
        for term in terminos_unsaac:
            self.sym_spell.create_dictionary_entry(term, 500)

        # Diccionario de Jerga Universitaria Local
        self.jerga_local = {
            "jalar": "desaprobar",
            "jale": "desaprobe",
            "jalado": "desaprobado",
            "jaló": "desaprobó",
            "jalo": "desaprobe",
            "bika": "segunda matricula",
            "trica": "tercera matricula",
            "profe": "docente",
            "u": "universidad",
            "facu": "facultad",
            "epis": "ingenieria informatica y de sistemas",
            "compu": "computo"
        }

    def _aplicar_jergas(self, texto: str) -> str:
        palabras = texto.lower().split()
        resultado = []
        for p in palabras:
            # Reemplazar si está en la jerga
            resultado.append(self.jerga_local.get(p, p))
        return " ".join(resultado)

    def corregir(self, texto: str) -> str:
        """
        1. Resuelve jerga local primero.
        2. Corrige la ortografía de la consulta sin corromper palabras válidas.
        """
        # Paso 1: Jergas
        texto_normalizado = self._aplicar_jergas(texto)
        
        # Paso 2: Corrección ortográfica conservadora
        palabras_corregidas = []
        for palabra in texto_normalizado.split():
            # Ignorar corrección si es un número, código de alumno o palabra corta
            if palabra.isdigit() or len(palabra) <= 3:
                palabras_corregidas.append(palabra)
                continue
                
            sugerencias = self.sym_spell.lookup(
                palabra, 
                verbosity=0, 
                max_edit_distance=1, 
                include_unknown=True
            )
            # Solo corregir si la distancia es 0 (palabra conocida) o si es una sugerencia muy cercana
            if sugerencias and sugerencias[0].distance == 0:
                palabras_corregidas.append(sugerencias[0].term)
            else:
                palabras_corregidas.append(palabra)
                
        return " ".join(palabras_corregidas)

spell_checker = SpellChecker()
