import sys
sys.path.append('.')
from backend.services.knowledge.detector_intenciones import detector_intenciones
from backend.services.retrieval.motor_embeddings import motor_embeddings
print(detector_intenciones.detectar("arquitectura de el computador", motor_embeddings.modelo_semantico))
