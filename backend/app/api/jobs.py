from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models import JobListing, User
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
    is_scraped: bool = True  # Default to True for Extension data

# --- ENDPOINTS ---

@router.post("/analyze-resume")
async def analyze_resume(request: AnalysisRequest):
    """
    Analyzes resume against a job description.
    Called directly from the Chrome extension popup.
    """
    if not request.resume_text or not request.job_description:
        raise HTTPException(status_code=400, detail="Resume and job description are required")
    
    try:
        analysis = await get_ats_score(request.resume_text, request.job_description)
        return {
            "score": analysis["score"],
            "feedback": analysis["feedback"],
            "matched_skills": analysis["matched_skills"],
            "missing_skills": analysis["missing_skills"],
            "chart_data": analysis["chart_data"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/save-job")
async def save_job(job_data: JobCreate, db: Session = Depends(get_db)):
    """
    Receives job data from the Chrome Extension and saves it.
    This is the first step in the 'Placement Knowledge' flow.
    """
    new_job = JobListing(
        title=job_data.title,
        description=job_data.description,
        company=job_data.company or "Unknown Company",
        location=job_data.location or "Remote",
        contact_email=job_data.contact_email,
        is_scraped=True,
        created_at=datetime.datetime.utcnow()
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return {"status": "success", "job_id": new_job.id}

@router.get("/user-analysis/{user_id}")
async def get_latest_analysis(user_id: int, db: Session = Depends(get_db)):
    """
    NEW: This is the 'Brain' of your dashboard.
    It fetches the latest job and returns the specific Skill Gaps.
    """
    # 1. Fetch User and Resume
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.resume_text:
        raise HTTPException(status_code=404, detail="Please upload your resume first.")

    # 2. Fetch the most recently scraped job
    latest_job = db.query(JobListing).order_by(JobListing.id.desc()).first()
    if not latest_job:
        raise HTTPException(status_code=404, detail="No job data found. Use the extension first.")

    # 3. Perform the 'Placement-Ready' AI Analysis
    # This calls your updated ai_service.py logic
    try:
        analysis = await get_ats_score(user.resume_text, latest_job.description or "")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Analysis error: {str(e)}")

    return {
        "job_details": {
            "title": latest_job.title,
            "company": latest_job.company,
            "location": latest_job.location
        },
        "ats_score": analysis["score"],
        "feedback": analysis["feedback"],
        "matched_skills": analysis["matched_skills"],
        "missing_skills": analysis["missing_skills"],
        "chart_data": analysis["chart_data"]
    }

@router.get("/recommendations/{user_id}")
async def get_recommendations(user_id: int, db: Session = Depends(get_db)):
    """Matches user resume against ALL jobs to find the top matches."""
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if not user.resume_text:
            raise HTTPException(status_code=400, detail="Please upload your resume first")

        all_jobs = db.query(JobListing).all()
        if not all_jobs:
            return {"recommendations": [], "message": "No jobs found. Use the extension to scrape a job first."}

        recommendations = []
        for job in all_jobs:
            try:
                # Skip jobs with no description
                if not job.description:
                    continue
                    
                # We only need the score for the recommendation list
                analysis = await get_ats_score(user.resume_text, job.description)
                recommendations.append({
                    "job_id": job.id,
                    "title": job.title,
                    "company": job.company or "Platform Partner",
                    "score": analysis["score"],
                    "missing_count": len(analysis["missing_skills"])
                })
            except Exception as e:
                print(f"Error analyzing job {job.id}: {str(e)}")
                continue

        # Sort by Match Score (Highest first)
        recommendations.sort(key=lambda x: x["score"], reverse=True)
        return {
            "recommendations": recommendations[:5],
            "total_analyzed": len(recommendations)
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Recommendations endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching recommendations: {str(e)}")