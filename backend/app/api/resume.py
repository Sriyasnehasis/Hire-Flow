import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.db import get_db
from app.models import User, Resume
from pydantic import BaseModel
from datetime import datetime
from app.services.resume_parser import resume_parser
from app.services.ats_analyzer import ats_analyzer

router = APIRouter(prefix="/api/v1/resumes", tags=["Resume Management"])

class ResumeResponse(BaseModel):
    id: int
    user_id: int
    file_path: str
    original_filename: str
    version_number: int
    is_current: bool
    ats_score: int

    class Config:
        from_attributes = True

class ResumeDetailResponse(ResumeResponse):
    parsed_data: dict
    ats_feedback: list
    ats_keywords_found: list
    ats_keywords_missing: list

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload a new resume"""
    # Validate file type
    allowed_types = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if file.content_type not in allowed_types and not (file.filename.endswith('.pdf') or file.filename.endswith('.docx')):
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF and DOCX files are allowed.")
    
    # Create uploads directory if it doesn't exist
    upload_dir = "uploads/resumes"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'pdf'
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    # Save file temporarily
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Parse resume based on file type
    try:
        if file_extension.lower() == 'pdf':
            parsed_data = await resume_parser.parse_pdf(file_path)
        elif file_extension.lower() == 'docx':
            parsed_data = await resume_parser.parse_docx(file_path)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse resume: {str(e)}")
    
    # Run ATS analysis on the parsed text
    full_text = parsed_data.get("full_text", "")
    ats_analysis = ats_analyzer.analyze_resume(full_text)
    
    # For demo purposes, we'll create a mock user (in production, get from JWT token)
    # TODO: Replace with actual user authentication
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="No user found. Please create an account first.")
    
    # Get current version number
    existing_resumes = db.query(Resume).filter(Resume.user_id == user.id).all()
    version_number = len(existing_resumes) + 1
    
    # If this is the first resume, mark it as current
    is_current = len(existing_resumes) == 0
    
    # If this is marked as current, unset other current resumes
    if is_current:
        db.query(Resume).filter(Resume.user_id == user.id, Resume.is_current == True).update({"is_current": False})
    
    # Create resume record
    resume = Resume(
        user_id=user.id,
        file_path=file_path,
        original_filename=file.filename,
        file_size_bytes=len(content),
        file_type=file_extension.lower(),
        parsed_data=parsed_data,
        ats_score=ats_analysis["ats_score"],
        ats_feedback=ats_analysis["feedback"],
        ats_keywords_found=ats_analysis["keywords_found"],
        ats_keywords_missing=ats_analysis["keywords_missing"],
        version_number=version_number,
        is_current=is_current
    )
    
    db.add(resume)
    db.commit()
    db.refresh(resume)
    
    return {
        "message": "Resume uploaded and analyzed successfully",
        "resume_id": resume.id,
        "file_name": file.filename,
        "ats_score": ats_analysis["ats_score"],
        "parsed_data": {
            "name": parsed_data.get("name"),
            "email": parsed_data.get("email"),
            "phone": parsed_data.get("phone"),
            "skills_count": len(parsed_data.get("skills", []))
        },
        "status": "completed"
    }

@router.get("")
async def list_resumes(
    db: Session = Depends(get_db)
) -> List[ResumeResponse]:
    """Get all resumes for current user"""
    # TODO: Get current user from JWT token
    # For demo, get first user
    user = db.query(User).first()
    if not user:
        return []
    
    resumes = db.query(Resume).filter(Resume.user_id == user.id).order_by(Resume.created_at.desc()).all()
    return resumes

@router.get("/{resume_id}", response_model=ResumeDetailResponse)
async def get_resume(
    resume_id: int,
    db: Session = Depends(get_db)
):
    """Get detailed resume information"""
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return resume

@router.delete("/{resume_id}")
async def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db)
):
    """Delete a resume"""
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Delete physical file
    try:
        if os.path.exists(resume.file_path):
            os.remove(resume.file_path)
    except Exception as e:
        print(f"Warning: Could not delete file {resume.file_path}: {e}")
    
    db.delete(resume)
    db.commit()
    
    return {"message": "Resume deleted successfully"}

@router.get("/{resume_id}/ats-analysis")
async def get_ats_analysis(
    resume_id: int,
    db: Session = Depends(get_db)
):
    """Get ATS analysis for a resume"""
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return {
        "ats_score": resume.ats_score,
        "feedback": resume.ats_feedback,
        "keywords_found": resume.ats_keywords_found,
        "keywords_missing": resume.ats_keywords_missing,
        "parsed_data": resume.parsed_data
    }
