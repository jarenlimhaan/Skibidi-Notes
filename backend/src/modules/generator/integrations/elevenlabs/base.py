from elevenlabs.client import ElevenLabs
from elevenlabs import play, save

from config.env import get_app_configs

app_config = get_app_configs()

import uuid

class TTS:

    def __init__(self):
        self.client = ElevenLabs(api_key=app_config.ELEVEN_LAB_API_KEY)

    # TODO: pass voice id as argument once frontend is finalized
    def tts_to_file(self, script:str, voice_id: str, filename: str) -> str:
        """
        Return path of audio file (TTS)
        """
        audio = self.client.text_to_speech.convert(
            text=script,
            voice_id=voice_id,
            model_id="eleven_multilingual_v2",
            output_format="mp3_44100_128",
        )

        save(audio, filename)
        return filename


def get_TTS():
    return TTS()
