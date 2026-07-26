import sys
sys.path.append('.')
from backend.services.retrieval.motor_embeddings import motor_embeddings
res = motor_embeddings.buscar("arquitectura de el computador")
print("Contexto recuperado:")
print(res['respuesta'])
