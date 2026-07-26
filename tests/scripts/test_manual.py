import sys
sys.path.append('.')
from backend.services.conversation.asistente import ChatbotEngine
res1 = ChatbotEngine.obtener_respuesta("como consigo comedor universitario")
print("Q1:", res1)
res2 = ChatbotEngine.obtener_respuesta("arquitectura de el computador")
print("Q2:", res2)
