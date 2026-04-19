from fastapi import APIRouter
from pydantic import BaseModel
from app.services import ai_service

router = APIRouter(prefix="/ats", tags=["ATS Analysis"])

class ATSRequest(BaseModel):
    resume_text: str
    job_description: str

@router.post("/score")
async def get_ats_compatibility(request: ATSRequest):
    """
    Analyzes resume text against job description using Gemini AI.
    Returns matched skills, missing skills, category chart data, and feedback.
    """
    result = await ai_service.get_ats_score(
        resume_text=request.resume_text,
        job_description=request.job_description
    )
    return result
