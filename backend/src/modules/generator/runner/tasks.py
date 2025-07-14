# tasks.py
from .base import celery_app
import asyncio

# Internal Imports
from src.modules.generator.integrations.langchain.base import get_summarizer_service
from src.modules.generator.integrations.elevenlabs.base import get_TTS
from src.modules.generator.integrations.movieclip.base import get_clip
from src.modules.generator.integrations.subtitles.base import get_subtitles
from src.modules.quiz.quiz_service import get_quiz_service
from src.modules.generator.generator_service import get_generation_service
from src.db.driver import SessionLocal

@celery_app.task(bind=True)
def run_generation_task(self, pdf_path, upload_id, background, voice_id, quizcount, user_id):
    self.update_state(state="PROGRESS", meta={"status": "Generating..."})

    summarizer = get_summarizer_service()
    tts = get_TTS()
    clip = get_clip()
    subtitles = get_subtitles()
    generation_service = get_generation_service()
    quiz_service = get_quiz_service()

    async def process():

        self.update_state(state="PROGRESS", meta={"status": "Generating Video..."})

        # generate video
        path, res = await generation_service.generate(
            pdf_path=pdf_path,
            summarizer=summarizer,
            tts=tts,
            clip=clip,
            subtitles=subtitles,
            background=background,
            voice_id=voice_id,
            quizcount=quizcount
        )

        self.update_state(state="PROGRESS", meta={"status": "Saving to DB..."})

        # Save quiz
        async with SessionLocal() as db:
            await quiz_service.add_quiz(
                createQuizDTO={
                    "upload_id": upload_id,
                    "content": res['quiz']
                },
                db=db
            )

            await generation_service.add_generation(
                createGenerationDTO={
                    "user_id": user_id,
                    "file_path": path,
                    "upload_id": upload_id,
                    "background_type": background,
                },
                db=db
            )

        self.update_state(state="SUCCESS", meta={"status": "Video generated successfully"})

        return {
            "status": "Done",
            "url": path,
            "summary": res['summary'],
            "keypoints": res['keypoints']
        }

    try:
        return asyncio.run(process())
    except Exception as e:
        self.update_state(state="FAILURE", meta={"status": str(e)})
        raise
