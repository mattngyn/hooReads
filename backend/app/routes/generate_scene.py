from fastapi import APIRouter, HTTPException
from app.models.schemas import GenerateSceneRequest, GenerateSceneResponse
from app.world_model import create_adapter

router = APIRouter()


@router.post("/generate-scene", response_model=GenerateSceneResponse)
async def generate_scene(request: GenerateSceneRequest):
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    adapter = create_adapter()

    try:
        job = await adapter.generate_scene(request.prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start scene generation: {e}")

    return GenerateSceneResponse(job_id=job.job_id)
