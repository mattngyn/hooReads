from fastapi import APIRouter, UploadFile, HTTPException
from app.models.schemas import ParseResponse
from app.services.pdf import extract_text_from_pdf

router = APIRouter()


@router.post("/parse", response_model=ParseResponse)
async def parse_pdf(file: UploadFile):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Empty file")

    try:
        text, page_count = extract_text_from_pdf(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to parse PDF: {e}")

    if not text.strip():
        raise HTTPException(status_code=422, detail="No text could be extracted from the PDF")

    return ParseResponse(text=text, page_count=page_count)
