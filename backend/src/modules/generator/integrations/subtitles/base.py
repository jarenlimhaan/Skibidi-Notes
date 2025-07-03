# External Imports
import os
import uuid
import srt_equalizer
import assemblyai as aai
from typing import List
from moviepy import *
from termcolor import colored
from dotenv import load_dotenv
from datetime import timedelta
from moviepy.video.tools.subtitles import SubtitlesClip
from moviepy.editor import *
from moviepy.config import change_settings

# Internal Imports
from config.env import get_app_configs

app_config = get_app_configs()

change_settings({"IMAGEMAGICK_BINARY": get_app_configs().IMAGEMAGICK_BINARY})

class Subtitles:

    def __generate_subtitles_assemblyai(self, audio_path: str, voice: str) -> str:
        language_mapping = {"br": "pt", "id": "en", "jp": "ja", "kr": "ko"}
        lang_code = language_mapping.get(voice, voice)
        aai.settings.api_key = app_config.ASSEMBLY_AI_API_KEY
        config = aai.TranscriptionConfig(language_code=lang_code)
        transcriber = aai.Transcriber(config=config)
        transcript = transcriber.transcribe(audio_path)
        return transcript.export_subtitles_srt()

    def generate_subtitles(self, audio_path: str, sentences: List[str], audio_clips: List[AudioFileClip], voice: str) -> str:
        def equalize_subtitles(srt_path: str, max_chars: int = 10) -> None:
            srt_equalizer.equalize_srt_file(srt_path, srt_path, max_chars)
        subtitles_path = f"static/subtitles/{uuid.uuid4()}.srt"
        print(colored("[+] Creating subtitles using AssemblyAI", "blue"))
        subtitles = self.__generate_subtitles_assemblyai(audio_path, voice)
        with open(subtitles_path, "w") as file:
            file.write(subtitles)
        equalize_subtitles(subtitles_path)
        print(colored("[+] Subtitles generated.", "green"))
        return subtitles_path

def get_subtitles():
    return Subtitles()