# External Imports 
import uuid
from typing import List
from moviepy import *
from termcolor import colored
from moviepy.video.tools.subtitles import SubtitlesClip
from moviepy.editor import *
from moviepy.config import change_settings

# Internal Imports
from config.env import get_app_configs

change_settings({"IMAGEMAGICK_BINARY": get_app_configs().IMAGEMAGICK_BINARY})

class Clip:

    def __init__(self):
        self.temp_dir = get_app_configs().TEMP_DIR
        self.output_dir = get_app_configs().OUTPUT_DIR

    def combine_videos(self, video_paths: List[str], max_duration: int, threads: int) -> str:
        video_id = uuid.uuid4()
        combined_video_path =  self.temp_dir + f"{video_id}.mp4"
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
        # For youtube
        # final_clip = concatenate_videoclips(clips).set_fps(30).resize((1920, 1080))
        
        # For TikTok
        final_clip = concatenate_videoclips(clips).set_fps(30).resize((1080, 1920))
        final_clip.write_videofile(combined_video_path, threads=threads)
        return combined_video_path

    def generate_video(self, combined_video_path: str, tts_path: str, subtitles_path: str, threads: int, subtitles_position: str, text_color: str) -> str:
        print(colored(f"subtitles_path: {subtitles_path}", "yellow"))
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
        output_path = self.output_dir + f"{uuid.uuid4()}.mp4"
        result.write_videofile(output_path, threads=threads or 2)
        return output_path

def get_clip():
    return Clip()