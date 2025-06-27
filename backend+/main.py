from summarise import *
from utils import *
from subtitle import *
from elevenlab import *
from uuid import uuid4
from moviepy.config import change_settings


change_settings({"IMAGEMAGICK_BINARY": "C:\Program Files\ImageMagick-7.1.1-Q16-HDRI\magick.exe"})


if __name__ == "__main__":

    clean_dir("temp/")
    clean_dir("subtitles/")

    
    ## Constants 
    video_paths = ["subway.mp4"]
    pdf_path = "bq.pdf"
    n_threads = 2
    subtitles_position = "center,center"
    text_color = "#FFFF00"

    ## generate script from pdf 
    script = generate_script(pdf_path)
    # 
    # script ='Did you know that if you had 10 billion $1 coins and spent one every second of every day, it would take 317 years to go broke? Imagine having that kind of financial freedom. Would you be happy? I certainly believed so until I paused and considered my current circumstance: " Am I not happy already?” This simple yet thought-provoking question opened the floodgates to deeper reflections: What is happiness? Can it be defined? And does money buy happiness?'

    sentences = script.split(". ")
    sentences = list(filter(lambda x: x != "", sentences))
    paths = []
    for sentence in sentences:
        # if not GENERATING:
        #     return jsonify({"status": "error", "message": "Video generation was cancelled."})
        current_tts_path = f"temp/{uuid4()}.mp3"
        tts(sentence, filename=current_tts_path)
        audio_clip = AudioFileClip(current_tts_path)
        paths.append(audio_clip)

    final_audio = concatenate_audioclips(paths)
    tts_path = f"temp/{uuid4()}.mp3"
    final_audio.write_audiofile(tts_path)

    voice_prefix = "en"
    subtitles_path = generate_subtitles(audio_path=tts_path, sentences=sentences, audio_clips=paths, voice=voice_prefix)

    temp_audio = AudioFileClip(tts_path)
    combined_video_path = combine_videos(video_paths, temp_audio.duration, n_threads or 2)
    final_video_path = generate_video(combined_video_path, tts_path, subtitles_path, n_threads or 2, subtitles_position, text_color or "#FFFF00")

    video_clip = VideoFileClip(f"temp/{final_video_path}")