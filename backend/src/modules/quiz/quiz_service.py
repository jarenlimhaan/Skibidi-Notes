# External Imports
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

# Internal Imports
from src.modules.quiz.quiz_model import Quiz
from src.modules.quiz.quiz_schema import CreateQuizSchema


class QuizService:

    async def get_quiz_by_id(self, quiz_id: str, db: AsyncSession):
        """
        Retrieve a quiz by its ID.
        """
        stmt = select(Quiz).where(Quiz.id == quiz_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def add_quiz(self, createQuizDTO: CreateQuizSchema, db: AsyncSession):
        """
        Add a quiz to the database.
        """
        quiz = Quiz(
            upload_id=createQuizDTO["upload_id"], content=createQuizDTO["content"]
        )
        db.add(quiz)
        await db.commit()
        await db.refresh(quiz)
        return quiz


def get_quiz_service():
    """
    Dependency to get the QuizService instance.
    """
    return QuizService()
