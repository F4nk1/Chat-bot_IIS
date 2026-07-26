import sys
sys.path.append('.')
from backend.services.nlg.generador_llm import generador_llm
ctx = "La reserva se realiza a través del portal institucional usando el código de estudiante y la clave del voucher de matrícula."
q = "arquitectura de el computador"
print(generador_llm.generar_respuesta(ctx, q))
