from elevenlabs import AsyncElevenLabs
from app.config import get_settings

VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"  # "George" -- a clear, warm narrator voice

TONE_TO_STYLE: dict[str, dict] = {
    "tense": {"stability": 0.3, "similarity_boost": 0.8},
    "serene": {"stability": 0.7, "similarity_boost": 0.6},
    "ominous": {"stability": 0.4, "similarity_boost": 0.7},
    "joyful": {"stability": 0.5, "similarity_boost": 0.7},
    "melancholic": {"stability": 0.6, "similarity_boost": 0.8},
    "neutral": {"stability": 0.5, "similarity_boost": 0.75},
}


async def generate_narration(text: str, emotional_tone: str = "neutral") -> bytes:
    """Generate TTS audio bytes (mp3) for the given narration text."""
    settings = get_settings()
    client = AsyncElevenLabs(api_key=settings.elevenlabs_api_key)

    style = TONE_TO_STYLE.get(emotional_tone, TONE_TO_STYLE["neutral"])

    audio_iterator = await client.text_to_speech.convert(
        voice_id=VOICE_ID,
        text=text,
        model_id="eleven_flash_v2_5",
        voice_settings={
            "stability": style["stability"],
            "similarity_boost": style["similarity_boost"],
        },
    )

    chunks: list[bytes] = []
    async for chunk in audio_iterator:
        chunks.append(chunk)

    return b"".join(chunks)
