from elevenlabs.client import ElevenLabs
from elevenlabs import play, save
from dotenv import load_dotenv
import os

ELEVEN_LABS_API_KEY = "sk_246b24b9d53c0daf8013e337e90f64ebe87a280e5478cede"

## tts
def tts(sentence, filename):
    client = ElevenLabs(api_key="sk_246b24b9d53c0daf8013e337e90f64ebe87a280e5478cede")

    audio = client.text_to_speech.convert(
        text=sentence,
        voice_id="e02TCHG9lAYD9pABEDcr",
        model_id="eleven_multilingual_v2",
        output_format="mp3_44100_128",
    )

    save(audio, filename)