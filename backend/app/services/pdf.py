import pdfplumber
from io import BytesIO


def extract_text_from_pdf(file_bytes: bytes) -> tuple[str, int]:
    """Extract all text from a PDF. Returns (text, page_count)."""
    with pdfplumber.open(BytesIO(file_bytes)) as pdf:
        pages = [page.extract_text() or "" for page in pdf.pages]
        full_text = "\n\n".join(pages)
        return full_text, len(pdf.pages)
