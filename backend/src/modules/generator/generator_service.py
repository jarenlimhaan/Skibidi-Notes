# External Imports
import uuid
import os
from uuid import uuid4
from concurrent.futures import ThreadPoolExecutor

from sqlalchemy.ext.asyncio import AsyncSession
from moviepy.editor import *
from moviepy import *
from moviepy.config import change_settings

# Internal Imports
from .generator_schema import CreateUploadSchema, CreateGenerationSchema
from .generator_model import Uploads, Generations

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
        new_upload = Uploads(
            user_id = createUploadDTO["user_id"],
            file_path = createUploadDTO["file_path"]
        )

        db.add(new_upload)
        await db.commit()
        await db.refresh(new_upload)
        return {"status": "Success", "upload_id": new_upload.id}

    async def add_generation(self, createGenerationDTO: CreateGenerationSchema, db: AsyncSession):
        new_generation_upload = Generations(
            user_id = createGenerationDTO["user_id"],
            file_path = createGenerationDTO["file_path"],
            uploaded_file_path = createGenerationDTO["uploaded_file_path"]
        )

        db.add(new_generation_upload)
        await db.commit()
        await db.refresh(new_generation_upload)
        return {"status": "Success", "upload_id": new_generation_upload.id}
    
    async def save_upload_and_generation(self, user_id: uuid.UUID, save_path: str, generation_path: str, db: AsyncSession):
        try:
            # Save upload
            upload_schema = {"user_id":user_id, "file_path": save_path}
            upload_response = await self.add_upload(upload_schema, db)
            upload_id = upload_response["upload_id"]

            # Save generation
            generation_schema = {
                "user_id":user_id,
                "file_path": generation_path,
                "uploaded_file_path": upload_id
            }
            generation_response = await self.add_generation(generation_schema, db)

            return {
                "status": "Success",
                "upload_id": upload_id,
                "generation_id": generation_response["upload_id"]
            }
        except Exception as e:
            return {"status": "Error", "message": str(e)}

    
def get_generation_service():
    return GenerationService()