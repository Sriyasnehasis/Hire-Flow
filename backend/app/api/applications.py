from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.db import get_db
from app.core.security import security_service
from app.models.user import User
from app.models.job import JobListing
from app.models.application import JobApplication, ApplicationStatus
from app.services.ai_service import get_ats_score
from pydantic import BaseModel

router = APIRouter(prefix="/applications", tags=["Job Applications"])


class JobApplicationResponse(BaseModel):
    id: int
    user_id: int
    job_listing_id: int
    status: str
    ai_match_score: float = None
    applied_at: str

    class Config:
        from_attributes = True


class ApplicationRequest(BaseModel):
    job_listing_id: int
    resume_id: int = None  # Optional, uses current resume if not provided


class ApplicationStatusUpdate(BaseModel):
    status: str  # applied, rejected, interview, accepted, withdrawn
    interview_scheduled: str = None  # ISO datetime for interview
    notes: str = None


@router.post("/apply")
async def apply_to_job(
    payload: ApplicationRequest,
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db)
):
    """Apply to a job by job_listing_id"""
    # Check if job exists
    job = db.query(JobListing).filter(JobListing.id == payload.job_listing_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job listing not found")

    # Check if user has resume
    user = db.query(User).filter(User.id == current_user_id).first()
    if not user or not user.resume_text:
        raise HTTPException(status_code=400, detail="Please upload your resume first")

    # Check if already applied
    existing = db.query(JobApplication).filter(
        JobApplication.user_id == current_user_id,
        JobApplication.job_listing_id == payload.job_listing_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied to this job")

    # Calculate match score
    try:
        analysis = await get_ats_score(user.resume_text, job.description or "")
        match_score = float(analysis.get("score", 0))
    except:
        match_score = 0.0

    # Create application
    application = JobApplication(
        user_id=current_user_id,
        job_listing_id=payload.job_listing_id,
        status=ApplicationStatus.APPLIED.value,
        ai_match_score=match_score,
        applied_at=datetime.utcnow()
    )
    
    db.add(application)
    db.commit()
    db.refresh(application)

    return {
        "message": "Application submitted successfully",
        "application_id": application.id,
        "match_score": match_score,
        "job_title": job.title,
        "company": job.company
    }


@router.get("")
async def list_applications(
    status: str = None,
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db)
):
    """Get all job applications for current user with optional status filter"""
    query = db.query(JobApplication).filter(JobApplication.user_id == current_user_id)
    
    if status:
        query = query.filter(JobApplication.status == status)
    
    applications = query.order_by(JobApplication.applied_at.desc()).all()
    
    result = []
    for app in applications:
        result.append({
            "id": app.id,
            "job_id": app.job_listing_id,
            "job_title": app.job_listing.title if app.job_listing else "N/A",
            "company": app.job_listing.company if app.job_listing else "N/A",
            "location": app.job_listing.location if app.job_listing else "N/A",
            "status": app.status,
            "ai_match_score": app.ai_match_score,
            "applied_at": app.applied_at.isoformat() if app.applied_at else None,
            "last_updated": app.last_updated.isoformat() if app.last_updated else None,
            "interview_scheduled": app.interview_scheduled.isoformat() if app.interview_scheduled else None,
            "notes": app.notes
        })
    
    return result


@router.get("/{application_id}")
async def get_application_details(
    application_id: int,
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db)
):
    """Get detailed application information"""
    application = db.query(JobApplication).filter(
        JobApplication.id == application_id,
        JobApplication.user_id == current_user_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    job = application.job_listing
    
    return {
        "id": application.id,
        "job": {
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "location": job.location,
            "description": job.description,
            "url": job.job_url,
            "source": job.source
        },
        "status": application.status,
        "ai_match_score": application.ai_match_score,
        "cover_letter": application.cover_letter,
        "notes": application.notes,
        "applied_at": application.applied_at.isoformat(),
        "last_updated": application.last_updated.isoformat(),
        "interview_scheduled": application.interview_scheduled.isoformat() if application.interview_scheduled else None,
        "interview_notes": application.interview_notes
    }


@router.patch("/{application_id}/status")
async def update_application_status(
    application_id: int,
    payload: ApplicationStatusUpdate,
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db)
):
    """Update application status (applied, rejected, interview, accepted, withdrawn)"""
    application = db.query(JobApplication).filter(
        JobApplication.id == application_id,
        JobApplication.user_id == current_user_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Validate status
    try:
        ApplicationStatus(payload.status)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {[s.value for s in ApplicationStatus]}"
        )
    
    application.status = payload.status
    application.last_updated = datetime.utcnow()
    
    if payload.interview_scheduled:
        application.interview_scheduled = datetime.fromisoformat(payload.interview_scheduled)
    
    if payload.notes:
        application.interview_notes = payload.notes
    
    db.commit()
    db.refresh(application)
    
    return {
        "id": application.id,
        "status": application.status,
        "ai_match_score": application.ai_match_score,
        "notes": application.interview_notes,
        "interview_scheduled": application.interview_scheduled.isoformat() if application.interview_scheduled else None,
        "last_updated": application.last_updated.isoformat(),
        "message": "Application status updated"
    }


@router.post("/{application_id}/notes")
async def add_application_notes(
    application_id: int,
    notes: dict,  # {"notes": "Interview went well..."}
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db)
):
    """Add or update notes for an application"""
    application = db.query(JobApplication).filter(
        JobApplication.id == application_id,
        JobApplication.user_id == current_user_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    application.notes = notes.get("notes")
    application.last_updated = datetime.utcnow()
    db.commit()
    db.refresh(application)
    
    return {"message": "Notes updated", "notes": application.notes}


@router.delete("/{application_id}")
async def withdraw_application(
    application_id: int,
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db)
):
    """Withdraw an application"""
    application = db.query(JobApplication).filter(
        JobApplication.id == application_id,
        JobApplication.user_id == current_user_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    application.status = ApplicationStatus.WITHDRAWN.value
    application.last_updated = datetime.utcnow()
    db.commit()
    
    return {"message": "Application withdrawn", "application_id": application.id}

async def send_follow_up(
    application_id: int,
    db: Session = Depends(get_db)
):
    """Send follow-up email to HR"""
    # TODO: Implement follow-up email sending
    return {"message": "Follow-up email sent"}

@router.get("/{application_id}/skill-gaps")
async def get_skill_gaps_for_application(
    application_id: int,
    db: Session = Depends(get_db)
):
    """Get skill gap analysis for a job application"""
    # TODO: Fetch skill gap analysis
    return {
        "matched_skills": [],
        "missing_skills": [],
        "improvement_suggestions": []
    }
