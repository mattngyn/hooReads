from fastapi import APIRouter, HTTPException
from app.models.schemas import ExtractMomentsRequest, ExtractMomentsResponse
from app.services.llm import extract_key_moments

router = APIRouter()


@router.post("/extract-moments", response_model=ExtractMomentsResponse)
async def extract_moments(request: ExtractMomentsRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    try:
        moments = await extract_key_moments(request.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract moments: {e}")

    return ExtractMomentsResponse(moments=moments)
