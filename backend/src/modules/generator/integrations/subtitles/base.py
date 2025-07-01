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
from config.env import get_app_configs

change_settings({"IMAGEMAGICK_BINARY": get_app_configs().IMAGEMAGICK_BINARY})

# Internal Imports
from config.env import get_app_configs

app_config = get_app_configs()

class Subtitles:

    def __generate_subtitles_assemblyai(self, audio_path: str, voice: str) -> str:
        language_mapping = {"br": "pt", "id": "en", "jp": "ja", "kr": "ko"}
        lang_code = language_mapping.get(voice, voice)
        aai.settings.api_key = app_config.ASSEMBLY_AI_API_KEY
        config = aai.TranscriptionConfig(language_code=lang_code)
        transcriber = aai.Transcriber(config=config)
        transcript = transcriber.transcribe(audio_path)
        return transcript.export_subtitles_srt()

    def __generate_subtitles_locally(self, sentences: List[str], audio_clips: List[AudioFileClip]) -> str:
        def convert_to_srt_time(total_seconds):
            return str(timedelta(seconds=total_seconds)).rstrip('0').replace('.', ',')
        start_time = 0
        subtitles = []
        for i, (sentence, audio_clip) in enumerate(zip(sentences, audio_clips), start=1):
            duration = audio_clip.duration
            end_time = start_time + duration
            subtitles.append(f"{i}\n{convert_to_srt_time(start_time)} --> {convert_to_srt_time(end_time)}\n{sentence}\n")
            start_time += duration
        return "\n".join(subtitles)

    def generate_subtitles(self, audio_path: str, sentences: List[str], audio_clips: List[AudioFileClip], voice: str) -> str:
        def equalize_subtitles(srt_path: str, max_chars: int = 10) -> None:
            srt_equalizer.equalize_srt_file(srt_path, srt_path, max_chars)
        subtitles_path = f"static/subtitles/{uuid.uuid4()}.srt"
        # if ASSEMBLY_AI_API_KEY:
        print(colored("[+] Creating subtitles using AssemblyAI", "blue"))
        subtitles = self.__generate_subtitles_assemblyai(audio_path, voice)
        # else:
        #     print(colored("[+] Creating subtitles locally", "blue"))
        #     subtitles = self.__generate_subtitles_locally(sentences, audio_clips)
        with open(subtitles_path, "w") as file:
            file.write(subtitles)
        equalize_subtitles(subtitles_path)
        print(colored("[+] Subtitles generated.", "green"))
        return subtitles_path

def get_subtitles():
    return Subtitles()