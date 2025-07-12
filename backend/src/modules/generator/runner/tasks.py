# tasks.py
from .base import celery_app
import asyncio

from src.modules.generator.integrations.langchain.base import get_summarizer_service
from src.modules.generator.integrations.elevenlabs.base import get_TTS
from src.modules.generator.integrations.movieclip.base import get_clip
from src.modules.generator.integrations.subtitles.base import get_subtitles
from src.modules.generator.generator_service import GenerationService

@celery_app.task(bind=True)
def run_video_generation(self, pdf_path, background, voice_id, quizcount, user_id):
    try:
        # Init services (sync here, from your existing DI or manually)
        summarizer = get_summarizer_service()
        tts = get_TTS()
        clip = get_clip()
        subtitles = get_subtitles()
        generation_service = GenerationService()

        # Track progress manually if desired
        self.update_state(state="PROGRESS", meta={"status": "Starting video generation..."})

        # Async to sync wrapper
        async def run_async_generation():
            return await generation_service.generate(
                pdf_path=pdf_path,
                summarizer=summarizer,
                tts=tts,
                clip=clip,
                subtitles=subtitles,
                background=background,
                voice_id=voice_id,
                quizcount=quizcount
            )

        path, res = asyncio.run(run_async_generation())

        return {
            "status": "completed",
            "url": path,
            "summary": res
        }

    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }
