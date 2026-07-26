import sys
sys.path.append('.')
from backend.services.retrieval.motor_embeddings import motor_embeddings
res = motor_embeddings.collection.get(where_document={"$contains": "Cayetano"})
print("Found Cayetano documents:", len(res['ids']))
