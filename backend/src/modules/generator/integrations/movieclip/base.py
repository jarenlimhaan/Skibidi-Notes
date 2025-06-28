# External Imports 
import os
import uuid
from typing import List
from moviepy import *
from termcolor import colored
from moviepy.video.tools.subtitles import SubtitlesClip
from moviepy.editor import *

class Clip:
    def combine_videos(self, video_paths: List[str], max_duration: int, threads: int) -> str:
        video_id = uuid.uuid4()
        combined_video_path = f"static/temp/{video_id}.mp4"
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

    def generate_video(self, combined_video_path: str, tts_path: str, subtitles_path: str, threads: int, subtitles_position: str, text_color: str) -> str:
        generator = lambda txt: TextClip(
            txt,
            font="static/fonts/bold_font.ttf",
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
        result.write_videofile("static/output/output.mp4", threads=threads or 2)
        return "static/output/output.mp4"

def get_clip():
    return Clip()