# External Imports
from fastapi import APIRouter, Depends, Form
from sqlalchemy.ext.asyncio import AsyncSession

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
    db: AsyncSession = Depends(get_db)
):
    """
    Endpoint to ask a question about a document.
    """
    res = chat_service.ask_question(
        user_id=current_user["user_id"],
        question=question,
    )
    
    # print(f"Question: {question}")
    # print(f"Result: {result}")

    print(type(res["result"]))

    return res["result"]