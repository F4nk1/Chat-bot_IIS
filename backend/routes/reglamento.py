from fastapi import APIRouter, HTTPException
from backend.services.knowledge.base_conocimiento import KnowledgeBase
from pydantic import BaseModel

enrutador = APIRouter(prefix="/reglamento", tags=["reglamento"])

class RespuestaReglamento(BaseModel):
    id: int
    categoria: str
    pregunta: str
    respuesta: str

@enrutador.get("/{id_conocimiento}", response_model=RespuestaReglamento)
def obtener_reglamento(id_conocimiento: int):
    """
    Consulta un documento o artículo del reglamento por su ID único.
    """
    documento = KnowledgeBase.obtener_por_id(id_conocimiento)
    
    if not documento:
        raise HTTPException(
            status_code=404, 
            detail=f"No se encontró ningún documento del reglamento con el ID {id_conocimiento}."
        )
        
    return documento
