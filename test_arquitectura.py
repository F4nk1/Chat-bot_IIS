import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from backend.services.conversation.asistente import ChatbotEngine

print("Probando NER e intención...")
res1 = ChatbotEngine.obtener_respuesta("quiero ver las materias que me tocan en el tercer semestre")
print(res1)
print("\nProbando contexto de sesión...")
res2 = ChatbotEngine.obtener_respuesta("y cuáles son en el segundo?")
print(res2)
print("\nProbando conocimiento grafo (Tutor)...")
res3 = ChatbotEngine.obtener_respuesta("quién es mi tutor? mi codigo es 110071")
print(res3)
print("\nProbando RAG...")
res4 = ChatbotEngine.obtener_respuesta("qué pasa si me jalo un curso")
print(res4)
