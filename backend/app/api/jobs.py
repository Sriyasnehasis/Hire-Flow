from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.job import JobListing
from app.models.user import User
from app.services.ai_service import get_ats_score
from pydantic import BaseModel
from typing import Optional, List
import datetime

router = APIRouter(prefix="/jobs", tags=["Jobs"])

# --- SCHEMAS ---
class AnalysisRequest(BaseModel):
    resume_text: str
    job_description: str

class JobCreate(BaseModel):
    title: str
    description: str
    company: Optional[str] = None
    location: Optional[str] = None
    contact_email: Optional[str] = None
    is_scraped: bool = False

# --- ENDPOINTS ---

@router.post("/save-job")
async def save_job(job_data: JobCreate, db: Session = Depends(get_db)):
    """
    NEW: Receives job data from the Chrome Extension or Scraper 
    and saves it to the PostgreSQL database.
    """
    new_job = JobListing(
        title=job_data.title,
        description=job_data.description,
        company=job_data.company,
        location=job_data.location,
        contact_email=job_data.contact_email,
        is_scraped=job_data.is_scraped
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return {"message": "Job successfully saved to ecosystem", "job_id": new_job.id}

@router.post("/analyze-resume")
async def analyze_resume(request_data: AnalysisRequest, db: Session = Depends(get_db)):
    """Calculates ATS score for a specific job."""
    result = await get_ats_score(request_data.resume_text, request_data.job_description)
    return result

@router.get("/user-skills/{user_id}")
async def get_user_skills(user_id: int, db: Session = Depends(get_db)):
    """Fetches radar chart data for the dashboard."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.resume_text:
        return {"error": "No resume found"}

    result = await get_ats_score(user.resume_text, "")
    return {
        "chart_data": result.get("chart_data", {}),
        "missing_skills": result.get("missing_skills", [])
    }

@router.get("/recommended/{user_id}")
async def get_recommendations(user_id: int, db: Session = Depends(get_db)):
    """Matches user resume against ALL jobs stored in PostgreSQL."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.resume_text:
        raise HTTPException(status_code=404, detail="Resume missing")

    all_jobs = db.query(JobListing).all()
    if not all_jobs:
        return []

    recommendations = []
    for job in all_jobs:
        analysis = await get_ats_score(user.resume_text, job.description)
        recommendations.append({
            "job_id": job.id,
            "title": job.title,
            "company": job.company or "Platform Partner",
            "score": analysis["score"],
            "contact_email": job.contact_email
        })

    # Sort by Match Score (Highest first)
    recommendations.sort(key=lambda x: x["score"], reverse=True)
    return recommendations[:5]

@router.post("/bulk-apply")
async def bulk_apply(user_id: int, domain: str, db: Session = Depends(get_db)):
    """Simulates the automated email application process."""
    query = f"%{domain}%"
    jobs = db.query(JobListing).filter(JobListing.title.ilike(query)).all()
    
    applied_count = 0
    for job in jobs:
        if job.contact_email:
            # Integration point for SMTP/FastAPI-Mail
            print(f"DEBUG: Emailing application to {job.contact_email}")
            applied_count += 1
            
    return {"message": f"Automatically applied to {applied_count} {domain} jobs!"}