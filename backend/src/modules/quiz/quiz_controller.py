# External Imports
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import json

# Internal Imports
from config.env import get_app_configs
from src.db.db import get_db
from src.modules.quiz.quiz_service import get_quiz_service, QuizService

router = APIRouter()
app_config = get_app_configs()


@router.get("/{quiz_id}")
async def get_quiz(
    quiz_id: str,
    quiz_service: QuizService = Depends(get_quiz_service),
    db: AsyncSession = Depends(get_db),
):
    """
    Endpoint to retrieve a quiz by its ID.
    """

    quiz = await quiz_service.get_quiz_by_id(quiz_id, db)

    if not quiz:
        return {"error": "Quiz not found"}

    return {
        "id": quiz.id,
        "upload_id": quiz.upload_id,
        "content": json.loads(quiz.content),
    }
