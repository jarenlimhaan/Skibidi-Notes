# External Imports
import uuid
import os
from uuid import uuid4
from concurrent.futures import ThreadPoolExecutor

from sqlalchemy.ext.asyncio import AsyncSession
from moviepy.editor import *
from moviepy import *
from moviepy.config import change_settings
from sqlalchemy import select

# Internal Imports
from .generator_schema import CreateUploadSchema, CreateGenerationSchema
from .generator_model import Uploads, Generations
from src.modules.quiz.quiz_model import Quiz

from .integrations.elevenlabs.base import TTS
from .integrations.langchain.base import Summarizer
from .integrations.movieclip.base import Clip
from .integrations.subtitles.base import Subtitles
from .utils.util import clean_dir

from config.env import get_app_configs

change_settings({"IMAGEMAGICK_BINARY": get_app_configs().IMAGEMAGICK_BINARY})

class GenerationService:

    def __init__(self):
        self.temp_dir = get_app_configs().TEMP_DIR
        self.subtitles_dir = get_app_configs().SUBTITLES_DIR
        self.videos_dir = get_app_configs().VIDEOS_DIR

    async def generate(self, pdf_path:str, summarizer: Summarizer, tts: TTS, clip: Clip, subtitles: Subtitles, background: str, voice_id: str, quizcount: str):
        '''
        Main entrypoint for video generation & file upload.
        This method handles the file upload and video generation process.
        Generate a video from a PDF file using summarization, TTS, and video clips.
        '''

        os.makedirs(self.temp_dir, exist_ok=True)
        os.makedirs(self.subtitles_dir, exist_ok=True)
    
        clean_dir(self.temp_dir)
        clean_dir(self.subtitles_dir)

        
        ## Constants 
        video_paths = [self.videos_dir + background]
        voice_id = voice_id  
        n_threads = 8
        subtitles_position = "center,center"
        text_color = "#FFFF00"

        ## generate script from pdf 
        res = summarizer.process_pdf(pdf_path, quizcount)
        script = res["summary"]
        

        sentences = script.split(". ")
        sentences = list(filter(lambda x: x != "", sentences))
        paths = []
        
        def process_sentence(sentence):
            current_tts_path = self.temp_dir + f"{uuid4()}.mp3"
            tts.tts_to_file(sentence, voice_id, filename=current_tts_path)
            return AudioFileClip(current_tts_path)

        with ThreadPoolExecutor(max_workers=3) as executor:
            paths = list(executor.map(process_sentence, sentences))

        final_audio = concatenate_audioclips(paths)
        tts_path = self.temp_dir + f"{uuid4()}.mp3"
        final_audio.write_audiofile(tts_path)

        voice_prefix = "en"
        subtitles_path = subtitles.generate_subtitles(audio_path=tts_path, sentences=sentences, audio_clips=paths, voice=voice_prefix)

        temp_audio = AudioFileClip(tts_path)
        combined_video_path = clip.combine_videos(video_paths, temp_audio.duration, n_threads or 2)
        final_video_path = clip.generate_video(combined_video_path, tts_path, subtitles_path, n_threads or 2, subtitles_position, text_color or "#FFFF00")

        video_clip = VideoFileClip(final_video_path)

        return final_video_path, res

    async def add_upload(self, createUploadDTO: CreateUploadSchema,  db: AsyncSession):
        '''
        Add an upload to the database.
        This method saves the upload information to the database.
        '''
        new_upload = Uploads(
            user_id = createUploadDTO["user_id"],
            file_path = createUploadDTO["file_path"],
            project_name = createUploadDTO["project_name"]
        )

        db.add(new_upload)
        await db.commit()
        await db.refresh(new_upload)
        return new_upload.id

    async def add_generation(self, createGenerationDTO: CreateGenerationSchema, db: AsyncSession):
        '''
        Add a generated video to the database.
        This method saves the generation information to the database.
        '''
        new_generation_upload = Generations(
            user_id = createGenerationDTO["user_id"],
            file_path = createGenerationDTO["file_path"],
            upload_id = createGenerationDTO["upload_id"],
            background_type = createGenerationDTO["background_type"],
        )

        db.add(new_generation_upload)
        await db.commit()
        await db.refresh(new_generation_upload)
        return {"status": "Success", "upload_id": new_generation_upload.id}

    async def get_user_generations_from_upload_id(self, upload_id: uuid.UUID, db: AsyncSession):
        '''
        Get all generations associated with a specific upload ID.
        This method retrieves all generations linked to a given upload ID.
        '''
        stmt = select(Generations).where(Generations.upload_id == upload_id)
        result = await db.execute(stmt)
        return result.scalars().all()
    
    async def get_user_quiz_from_upload_id(self, upload_id: uuid.UUID, db: AsyncSession):
        '''
        Get the quiz associated with a specific upload ID.
        This method retrieves the quiz linked to a given upload ID.
        '''
        stmt = select(Quiz).where(Quiz.upload_id == upload_id)
        result = await db.execute(stmt)
        return result.scalars().first()
    
    async def get_all_uploads(self, user_id: uuid.UUID, db: AsyncSession):
        '''
        Get all uploads for a specific user.
        This method retrieves all uploads associated with a user ID.
        '''
        stmt = select(Uploads).where(Uploads.user_id == user_id)
        result = await db.execute(stmt)
        return result.scalars().all()
    
    async def get_user_uploads_with_generations(self, user_id: uuid.UUID, db: AsyncSession):
        '''
        Get all uploads along with their associated generations for a specific user.
        This method retrieves all uploads and their linked generations for a user as well as the quiz generated for their uploaded document.
        '''
        uploads = await self.get_all_uploads(user_id, db)
        results = []

        for upload in uploads:
            generations = await self.get_user_generations_from_upload_id(upload.id, db)
            quiz = await self.get_user_quiz_from_upload_id(upload.id, db)
            results.append([[upload.id, upload.project_name, upload.file_path], generations, quiz])

        return results
    
    async def update_upload_project_name(self, upload_id: uuid.UUID, new_project_name: str, db: AsyncSession):
        '''
        Update the project name of an upload.
        This method modifies the project name of a specific upload in the database.
        '''
        stmt = select(Uploads).where(Uploads.id == upload_id)
        result = await db.execute(stmt)
        upload = result.scalar_one_or_none()

        if not upload:
            return {"status": "Error", "message": "Upload not found"}

        upload.project_name = new_project_name
        await db.commit()
        await db.refresh(upload)
        return {"status": "Success", "message": "Project name updated successfully"}
    
    async def get_user_upload_by_id(self, upload_id: uuid.UUID, db: AsyncSession):
        '''
        Get a specific user upload by its ID.
        This method retrieves an upload based on its unique identifier.
        '''
        stmt = select(Uploads).where(Uploads.id == upload_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()
    
    async def delete_user_upload(self, upload_id: uuid.UUID, db: AsyncSession):
        try:
            stmt = select(Uploads).where(Uploads.id == upload_id)
            result = await db.execute(stmt)
            upload = result.scalar_one_or_none()

            if not upload:
                return {"status": "Error", "message": "Upload not found"}

            await db.delete(upload)
            await db.commit()
            return {"status": "Success", "message": "Upload deleted successfully"}
        except Exception as e:
            return {"status": "Error", "message": str(e)}
        
    async def delete_user_generation(self, generation_id: uuid.UUID, db: AsyncSession):
        try:
            stmt = select(Generations).where(Generations.id == generation_id)
            result = await db.execute(stmt)
            generation = result.scalar_one_or_none()

            if not generation:
                return {"status": "Error", "message": "Generation not found"}

            await db.delete(generation)
            await db.commit()
            return {"status": "Success", "message": "Generation deleted successfully"}
        except Exception as e:
            return {"status": "Error", "message": str(e)}

    async def delete_upload_with_generations(self, upload_id: uuid.UUID, db: AsyncSession):
        try:
            # Delete generations associated with the upload
            generations = await self.get_user_generations_from_upload_id(upload_id, db)
            for generation in generations:
                await self.delete_user_generation(generation.id, db)

            # Delete the upload itself
            return await self.delete_user_upload(upload_id, db)
        except Exception as e:
            return {"status": "Error", "message": str(e)}


def get_generation_service():
    return GenerationService()