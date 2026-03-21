from fastapi import APIRouter, HTTPException
from app.models.schemas import SceneStatusResponse
from app.world_model import create_adapter

router = APIRouter()


@router.get("/scene-status/{job_id}", response_model=SceneStatusResponse)
async def scene_status(job_id: str):
    adapter = create_adapter()

    status = await adapter.get_scene_status(job_id)

    asset_url = None
    asset_format = None
    if status.status == "complete":
        try:
            asset = await adapter.get_scene_asset(job_id)
            asset_url = asset.url
            asset_format = asset.format
        except Exception:
            pass

    return SceneStatusResponse(
        status=status.status,
        progress=status.progress,
        asset_url=asset_url,
        asset_format=asset_format,
    )
