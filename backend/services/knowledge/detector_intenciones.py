import re
from backend.services.knowledge.preprocesamiento import preprocesar

class IntentDetector:
    """
    Clase equivalente a IntentDetector segun requerimientos.
    Categoriza la consulta del usuario antes de buscar en la base de conocimientos.
    """
    def __init__(self):
        # Mapeo de intenciones con sus palabras clave o patrones
        self.intenciones = {
            "Tutorias": [
                r"tutoria", r"tutor", r"acompañamiento", r"orientacion", r"asesoria academica"
            ],
            "Tramites": [
                r"tramite", r"solicitud", r"proceso", r"pago", r"matricula", r"constancia", r"certificado"
            ],
            "Practicas": [
                r"practica", r"pre-profesional", r"convenio", r"empresa", r"pasantia"
            ],
            "Bienestar": [
                r"bienestar", r"psicologico", r"comedor", r"beca", r"salud", r"social"
            ],
            "Movilidad": [
                r"movilidad", r"intercambio", r"extranjero", r"beca externa", r"pila"
            ],
            "Reglamentos": [
                r"reglamento", r"norma", r"estatuto", r"sancion", r"derecho", r"deber"
            ],
            "Cursos": [
                r"curso", r"asignatura", r"silabo", r"credito", r"materia", r"prerrequisito"
            ]
        }

    def detectar(self, texto: str) -> str:
        """
        Analiza el texto y retorna la categoria detectada.
        """
        texto_limpio = preprocesar(texto)
        puntuaciones = {categoria: 0 for categoria in self.intenciones}
        
        for categoria, patrones in self.intenciones.items():
            for patron in patrones:
                if re.search(patron, texto_limpio, re.IGNORECASE):
                    puntuaciones[categoria] += 1
        
        if any(puntuaciones.values()):
            return max(puntuaciones, key=puntuaciones.get)
            
        return "General"

# Instancia global
detector_intenciones = IntentDetector()
