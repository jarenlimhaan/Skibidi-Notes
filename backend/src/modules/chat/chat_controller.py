# External Imports
from fastapi import APIRouter, Depends, Form

# Internal Imports
from config.env import get_app_configs
from .chat_service import DocumentQAService, get_qa_service
from src.deps import get_current_user_from_cookie, get_db

router = APIRouter()
app_config = get_app_configs()

@router.post("/ask")
async def ask_question(
    question: str = Form(...),
    chat_service: DocumentQAService = Depends(get_qa_service),
    current_user=Depends(get_current_user_from_cookie),
):
    try:  
        res = chat_service.ask_question(
            user_id=current_user["user_id"],
            question=question,
        )
        
        return res["result"]
    except Exception as e:
        print(f"Error in ask_question: {e}")
        return {
            "status": "Error",
            "message": str(e)
        }