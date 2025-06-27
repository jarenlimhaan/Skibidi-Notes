import os
import uuid
import srt_equalizer
import assemblyai as aai
from typing import List
from moviepy.editor import *
from termcolor import colored
from dotenv import load_dotenv
from datetime import timedelta
from moviepy.video.tools.subtitles import SubtitlesClip

ASSEMBLY_AI_API_KEY = "f02188682d624cc8b72a0dd1493ae3cd"

def __generate_subtitles_assemblyai(audio_path: str, voice: str) -> str:
    language_mapping = {"br": "pt", "id": "en", "jp": "ja", "kr": "ko"}
    lang_code = language_mapping.get(voice, voice)
    aai.settings.api_key = ASSEMBLY_AI_API_KEY
    config = aai.TranscriptionConfig(language_code=lang_code)
    transcriber = aai.Transcriber(config=config)
    transcript = transcriber.transcribe(audio_path)
    return transcript.export_subtitles_srt()

def __generate_subtitles_locally(sentences: List[str], audio_clips: List[AudioFileClip]) -> str:
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

def generate_subtitles(audio_path: str, sentences: List[str], audio_clips: List[AudioFileClip], voice: str) -> str:
    def equalize_subtitles(srt_path: str, max_chars: int = 10) -> None:
        srt_equalizer.equalize_srt_file(srt_path, srt_path, max_chars)
    subtitles_path = f"subtitles/{uuid.uuid4()}.srt"
    if ASSEMBLY_AI_API_KEY:
        print(colored("[+] Creating subtitles using AssemblyAI", "blue"))
        subtitles = __generate_subtitles_assemblyai(audio_path, voice)
    else:
        print(colored("[+] Creating subtitles locally", "blue"))
        subtitles = __generate_subtitles_locally(sentences, audio_clips)
    with open(subtitles_path, "w") as file:
        file.write(subtitles)
    equalize_subtitles(subtitles_path)
    print(colored("[+] Subtitles generated.", "green"))
    return subtitles_path

def combine_videos(video_paths: List[str], max_duration: int, threads: int) -> str:
    video_id = uuid.uuid4()
    combined_video_path = f"temp/{video_id}.mp4"
    base_clip = VideoFileClip(video_paths[0]).without_audio()
    clips = []
    total_duration = 0
    while total_duration < max_duration:
        clip = base_clip
        remaining = max_duration - total_duration
        if clip.duration > remaining:
            clip = clip.subclip(0, remaining)
        clips.append(clip)
        total_duration += clip.duration
    final_clip = concatenate_videoclips(clips).set_fps(30).resize((1080, 1920))
    final_clip.write_videofile(combined_video_path, threads=threads)
    return combined_video_path

def generate_video(combined_video_path: str, tts_path: str, subtitles_path: str, threads: int, subtitles_position: str, text_color: str) -> str:
    generator = lambda txt: TextClip(
        txt,
        font="fonts/bold_font.ttf",
        fontsize=100,
        color=text_color,
        stroke_color="black",
        stroke_width=5,
    )
    horizontal, vertical = subtitles_position.split(",")
    subtitles = SubtitlesClip(subtitles_path, generator)

    result = CompositeVideoClip([
        VideoFileClip(combined_video_path),
        subtitles.set_pos((horizontal, vertical))
    ]).set_audio(AudioFileClip(tts_path))
    result.write_videofile("temp/output.mp4", threads=threads or 2)
    return "output.mp4"