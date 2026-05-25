from fastapi import APIRouter

from backend.models.chat_models import ChatRequest

from backend.services.chatbot.chatbot import ask_question

router = APIRouter()


@router.post("/chat")
def chat(request: ChatRequest):

    response = ask_question(request.message)

    return response