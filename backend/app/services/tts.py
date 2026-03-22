import re
import unicodedata

import httpx
from app.config import get_settings

CARTESIA_URL = "https://api.cartesia.ai/tts/bytes"
VOICE_ID = "6ccbfb76-1fc6-48f7-b71d-91ac6298247b"


def _sanitize_text(text: str) -> str:
    """Clean text for Cartesia TTS: normalize unicode, strip control chars,
    replace smart quotes/dashes, and collapse whitespace."""
    text = unicodedata.normalize("NFKD", text)

    text = text.replace("\u2018", "'").replace("\u2019", "'")  # smart single quotes
    text = text.replace("\u201c", '"').replace("\u201d", '"')  # smart double quotes
    text = text.replace("\u2013", "-").replace("\u2014", "-")  # en/em dashes
    text = text.replace("\u2026", "...")  # ellipsis
    text = text.replace("\u00a0", " ")  # non-breaking space

    text = re.sub(r"[^\x20-\x7E\n.,!?;:'\"\-()\[\] ]", "", text)
    text = re.sub(r"\s+", " ", text).strip()

    return text


async def generate_narration(text: str, emotional_tone: str = "neutral", max_retries: int = 3) -> bytes:
    """Generate TTS audio bytes (wav) via Cartesia sonic-3. Retries on rate limits."""
    import asyncio

    settings = get_settings()
    text = _sanitize_text(text)

    payload = {
        "model_id": "sonic-3",
        "transcript": text,
        "voice": {"mode": "id", "id": VOICE_ID},
        "output_format": {
            "container": "wav",
            "encoding": "pcm_f32le",
            "sample_rate": 44100,
        },
        "speed": "normal",
        "generation_config": {"speed": 0.8, "volume": 1},
    }

    headers = {
        "Cartesia-Version": "2025-04-16",
        "X-API-Key": settings.cartesia_api_key,
        "Content-Type": "application/json",
    }

    for attempt in range(max_retries):
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(CARTESIA_URL, headers=headers, json=payload)

            if resp.status_code == 429:
                wait = 2 ** attempt + 1
                await asyncio.sleep(wait)
                continue

            resp.raise_for_status()
            return resp.content

    raise httpx.HTTPStatusError("Rate limited after retries", request=resp.request, response=resp)
