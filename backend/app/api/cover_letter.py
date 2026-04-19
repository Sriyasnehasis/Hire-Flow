from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from app.services import ai_service

router = APIRouter(prefix="/cover-letter", tags=["Cover Letter"])


class CoverLetterRequest(BaseModel):
    full_name: str
    profession: str
    skills: List[str] = []
    company_name: str
    job_title: str
    job_description: Optional[str] = ""
    tone: Optional[str] = "professional"


@router.post("/generate")
async def generate_cover_letter(request: CoverLetterRequest):
    """Generate a personalized cover letter using Gemini AI."""
    result = await ai_service.generate_cover_letter(
        full_name=request.full_name,
        profession=request.profession,
        skills=request.skills,
        company_name=request.company_name,
        job_title=request.job_title,
        job_description=request.job_description,
        tone=request.tone,
    )
    return {"cover_letter": result, "status": "success"}
