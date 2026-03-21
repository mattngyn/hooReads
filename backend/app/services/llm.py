import json
from openai import AsyncOpenAI
from app.config import get_settings
from app.models.schemas import KeyMoment

SYSTEM_PROMPT = """\
You are a literary scene analyst. Given a chapter or passage of text from a book, \
identify the 3-7 most visually significant key moments -- scenes that would make \
compelling 3D environments to explore.

For each moment, provide:
- title: A short evocative label (e.g., "The Forest Clearing")
- scene_description: A detailed, spatial, visual description optimized for 3D scene \
  generation. Describe the physical environment, lighting, objects, atmosphere, and \
  spatial layout. Do NOT include characters or people -- focus on the setting itself.
- narration_text: A concise, evocative 2-3 sentence summary of what happens in this \
  moment, suitable for audio narration.
- emotional_tone: One word describing the mood (e.g., "tense", "serene", "ominous", \
  "joyful", "melancholic").
- page_reference: If identifiable, a brief note about where this occurs in the text.

Return a JSON array of objects with these fields. Order them chronologically as they \
appear in the text.\
"""


async def extract_key_moments(text: str) -> list[KeyMoment]:
    settings = get_settings()
    client = AsyncOpenAI(api_key=settings.openai_api_key)

    response = await client.chat.completions.create(
        model="gpt-4o",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": f"Analyze this text and extract the key visual moments:\n\n{text}",
            },
        ],
    )

    raw = json.loads(response.choices[0].message.content or "{}")
    moments_data = raw.get("moments", raw.get("key_moments", []))

    moments = []
    for i, m in enumerate(moments_data):
        moments.append(
            KeyMoment(
                id=i + 1,
                title=m.get("title", f"Scene {i + 1}"),
                scene_description=m.get("scene_description", ""),
                narration_text=m.get("narration_text", ""),
                emotional_tone=m.get("emotional_tone", "neutral"),
                page_reference=m.get("page_reference"),
            )
        )

    return moments
