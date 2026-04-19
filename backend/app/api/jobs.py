from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.security import security_service
from app.models.job import JobListing
from app.models.user import User
from app.models.application import JobApplication, ApplicationStatus
from app.services.ai_service import get_ats_score
from app.services.ats_analyzer import ats_analyzer
from app.services.adzuna import fetch_india_jobs
from pydantic import BaseModel
from typing import Optional, List
import datetime

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("/search")
async def search_live_jobs(
    keyword: str = Query("Software Developer", description="Job search keyword"),
    location: str = Query("India", description="Location"),
):
    """
    Search live jobs from Adzuna API.
    Returns real-time job listings from the Adzuna job board.
    """
    try:
        data = await fetch_india_jobs(keyword=keyword, location=location)
        jobs = data.get("results", [])
        return {
            "jobs": jobs,
            "total": data.get("count", 0),
            "query": keyword,
            "location": location,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job search failed: {str(e)}")


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


class LiveSyncRequest(BaseModel):
    keyword: str = "Software Developer"
    location: str = "India"
    max_results: int = 30

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
        source="extension",
        created_at=datetime.datetime.utcnow()
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return {"status": "success", "job_id": new_job.id}


@router.post("/sync-live")
async def sync_live_jobs_to_db(
    request: LiveSyncRequest,
    db: Session = Depends(get_db),
):
    """
    Pull live jobs from Adzuna and store them in PostgreSQL for matching.
    This powers profile-based recommendations without any demo dataset.
    """
    if request.max_results < 1 or request.max_results > 100:
        raise HTTPException(status_code=400, detail="max_results must be between 1 and 100")

    data = await fetch_india_jobs(keyword=request.keyword, location=request.location)
    jobs = data.get("results", [])[: request.max_results]

    created = 0
    skipped = 0

    for item in jobs:
        title = (item.get("title") or "").strip()
        company = (item.get("company") or {}).get("display_name") if isinstance(item.get("company"), dict) else item.get("company")
        company = (company or "Unknown Company").strip()
        location = (item.get("location") or {}).get("display_name") if isinstance(item.get("location"), dict) else item.get("location")
        location = (location or "India").strip()

        if not title:
            skipped += 1
            continue

        exists = db.query(JobListing).filter(
            JobListing.title == title,
            JobListing.company == company,
            JobListing.location == location,
        ).first()
        if exists:
            skipped += 1
            continue

        db.add(
            JobListing(
                title=title,
                company=company,
                location=location,
                description=item.get("description") or "",
                contact_email=None,
                is_scraped=True,
                source="adzuna",
                job_url=item.get("redirect_url") or item.get("url"),
                created_at=datetime.datetime.utcnow(),
            )
        )
        created += 1

    db.commit()

    return {
        "status": "success",
        "query": request.keyword,
        "location": request.location,
        "fetched": len(jobs),
        "created": created,
        "skipped": skipped,
    }


@router.post("/save-and-apply")
async def save_and_apply(
    job_data: JobCreate,
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db)
):
    """
    One-click apply from Chrome Extension:
    1. Saves the job to database
    2. Applies to the job automatically
    3. Returns match score and application status
    
    Called from extension when user clicks "Apply"
    """
    # Check user has resume
    user = db.query(User).filter(User.id == current_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.resume_text:
        raise HTTPException(status_code=400, detail="Please upload your resume first")
    
    # Save the job
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
    db.flush()  # Get the ID without committing yet
    
    # Check if already applied
    existing = db.query(JobApplication).filter(
        JobApplication.user_id == current_user_id,
        JobApplication.job_listing_id == new_job.id
    ).first()
    
    if existing:
        db.rollback()
        raise HTTPException(status_code=400, detail="You have already applied to this job")
    
    # Calculate match score
    try:
        analysis = await get_ats_score(user.resume_text, job_data.description or "")
        match_score = float(analysis.get("score", 0))
    except:
        match_score = 0.0
    
    # Create application
    application = JobApplication(
        user_id=current_user_id,
        job_listing_id=new_job.id,
        status=ApplicationStatus.APPLIED.value,
        ai_match_score=match_score,
        applied_at=datetime.datetime.utcnow()
    )
    
    db.add(application)
    db.commit()
    db.refresh(application)
    
    return {
        "status": "success",
        "message": "Applied successfully!",
        "job_id": new_job.id,
        "application_id": application.id,
        "job_title": new_job.title,
        "company": new_job.company,
        "location": new_job.location,
        "match_score": match_score,
        "match_status": "excellent" if match_score >= 75 else "good" if match_score >= 50 else "fair"
    }


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

@router.get("/recommendations")
async def get_my_recommendations(
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db)
):
    """Get personalized job recommendations for current user based on their resume"""
    user = db.query(User).filter(User.id == current_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.resume_text:
        raise HTTPException(status_code=400, detail="Please upload your resume first")

    all_jobs = db.query(JobListing).all()
    if not all_jobs:
        return {"recommendations": [], "message": "No jobs available. Try again later."}

    recommendations = []
    for job in all_jobs:
        try:
            if not job.description:
                continue
            
            analysis = await get_ats_score(user.resume_text, job.description)
            recommendations.append({
                "job_id": job.id,
                "title": job.title,
                "company": job.company or "Unknown",
                "location": job.location or "Remote",
                "score": analysis["score"],
                "matched_skills": analysis.get("matched_skills", []),
                "missing_skills": analysis.get("missing_skills", []),
                "feedback": analysis.get("feedback", "")
            })
        except Exception as e:
            continue

    # Sort by match score (highest first)
    recommendations.sort(key=lambda x: x["score"], reverse=True)
    
    return {
        "recommendations": recommendations[:10],  # Top 10 matches
        "total_jobs_analyzed": len(recommendations),
        "user_skills": user.primary_skills
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


@router.post("/bulk-apply")
async def bulk_apply(user_id: int, domain: str, db: Session = Depends(get_db)):
    """Segment A compatibility endpoint for extension bulk-apply flow."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not domain.strip():
        raise HTTPException(status_code=400, detail="Domain is required")

    domain_lower = domain.lower()
    matched_jobs = (
        db.query(JobListing)
        .filter(
            (JobListing.title.ilike(f"%{domain_lower}%"))
            | (JobListing.description.ilike(f"%{domain_lower}%"))
        )
        .limit(20)
        .all()
    )

    return {
        "message": f"Prepared {len(matched_jobs)} matching jobs for assisted apply in '{domain}'.",
        "user_id": user_id,
        "domain": domain,
        "matched_job_ids": [job.id for job in matched_jobs],
    }


# ========== SEGMENT E: SKILL GAP ANALYSIS ==========

@router.get("/skill-gap/{job_id}")
async def get_skill_gap(
    job_id: int,
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db)
):
    """
    Get detailed skill gap analysis for a specific job.
    Shows matched skills, missing skills, and learning resources.
    """
    # Get user and job
    user = db.query(User).filter(User.id == current_user_id).first()
    if not user or not user.resume_text:
        raise HTTPException(status_code=400, detail="Please upload your resume first")
    
    job = db.query(JobListing).filter(JobListing.id == job_id).first()
    if not job or not job.description:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Calculate detailed skill gaps
    skill_gaps = ats_analyzer.calculate_skill_gaps(user.resume_text, job.description)
    keyword_match = ats_analyzer.calculate_keyword_match(user.resume_text, job.description)
    
    return {
        "job": {
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "location": job.location
        },
        "overall_match": keyword_match["match_percentage"],
        "matched_count": keyword_match["matched_count"],
        "total_required": keyword_match["total_required_skills"],
        "category_gaps": skill_gaps["category_gaps"],
        "priority_skills_to_learn": skill_gaps["priority_skills"],
        "ats_score": skill_gaps["ats_score"],
        "matched_keywords": keyword_match["matched_keywords"],
        "missing_keywords": keyword_match["missing_keywords"]
    }


@router.post("/analyze-resume-vs-job")
async def analyze_resume_vs_job(
    request: AnalysisRequest,
    current_user_id: int = Depends(security_service.get_user_from_token)
):
    """
    Analyze a resume against any job description.
    Returns detailed skill gaps, match percentage, and recommendations.
    """
    if not request.resume_text or not request.job_description:
        raise HTTPException(status_code=400, detail="Resume and job description are required")
    
    try:
        # Get detailed analysis
        skill_gaps = ats_analyzer.calculate_skill_gaps(request.resume_text, request.job_description)
        keyword_match = ats_analyzer.calculate_keyword_match(request.resume_text, request.job_description)
        formatting = ats_analyzer.check_formatting_compliance(request.resume_text)
        
        # Generate learning resources
        learning_path = ats_analyzer.generate_learning_path(skill_gaps["priority_skills"])
        
        return {
            "overall_match_percentage": keyword_match["match_percentage"],
            "matched_skills": keyword_match["matched_keywords"],
            "missing_skills": keyword_match["missing_keywords"],
            "category_analysis": skill_gaps["category_gaps"],
            "priority_skills": skill_gaps["priority_skills"],
            "ats_score": skill_gaps["ats_score"],
            "formatting_compliant": formatting["is_ats_compliant"],
            "formatting_issues": formatting["issues"],
            "learning_path": learning_path,
            "recommendation": {
                "status": "excellent" if keyword_match["match_percentage"] >= 75 else "good" if keyword_match["match_percentage"] >= 50 else "needs improvement",
                "message": f"Your profile matches {keyword_match['match_percentage']}% of required skills"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.get("/improvement-resources/{job_id}")
async def get_improvement_resources(
    job_id: int,
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db)
):
    """
    Get personalized learning resources to bridge skill gaps for a job.
    """
    user = db.query(User).filter(User.id == current_user_id).first()
    if not user or not user.resume_text:
        raise HTTPException(status_code=400, detail="Please upload your resume first")
    
    job = db.query(JobListing).filter(JobListing.id == job_id).first()
    if not job or not job.description:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Get missing skills
    skill_gaps = ats_analyzer.calculate_skill_gaps(user.resume_text, job.description)
    priority_skills = skill_gaps["priority_skills"]
    
    # Get learning resources
    learning_path = ats_analyzer.generate_learning_path(priority_skills)
    
    return {
        "job": {
            "id": job.id,
            "title": job.title,
            "company": job.company
        },
        "priority_skills": priority_skills,
        "learning_resources": learning_path["resources"],
        "total_training_hours": learning_path["total_hours"],
        "estimated_weeks": learning_path["estimated_weeks"],
        "recommendation": learning_path["recommendation"],
        "action_plan": [
            f"Week 1-{learning_path['estimated_weeks']}: Learn {', '.join(priority_skills[:3])}",
            "Practice with real projects",
            "Update resume with new skills",
            f"Reapply to this job after {learning_path['estimated_weeks']} weeks"
        ]
    }


@router.get("/skill-analysis")
async def get_skill_analysis(
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db)
):
    """
    Get overall skill analysis for the user based on all recommended jobs.
    Shows strengths, gaps, and recommendations.
    """
    user = db.query(User).filter(User.id == current_user_id).first()
    if not user or not user.resume_text:
        raise HTTPException(status_code=400, detail="Please upload your resume first")
    
    all_jobs = db.query(JobListing).all()
    if not all_jobs:
        return {"analysis": None, "message": "No jobs available for analysis"}
    
    # Analyze against all jobs
    all_gaps = {}
    max_gaps = {}
    
    for job in all_jobs[:20]:  # Analyze top 20 jobs
        if not job.description:
            continue
        
        gaps = ats_analyzer.calculate_skill_gaps(user.resume_text, job.description)
        
        # Track which skills appear most frequently in job descriptions
        for category, gap_info in gaps["category_gaps"].items():
            if category not in max_gaps:
                max_gaps[category] = {"gap": 0, "missing": []}
            
            if gap_info["gap_percentage"] > max_gaps[category]["gap"]:
                max_gaps[category]["gap"] = gap_info["gap_percentage"]
                max_gaps[category]["missing"] = gap_info["you_need"]
    
    return {
        "user_skills": user.primary_skills or [],
        "overall_skill_gaps": max_gaps,
        "most_needed_skills": list(set([skill for cat in max_gaps.values() for skill in cat["missing"]]))[:5],
        "jobs_analyzed": min(20, len(all_jobs)),
        "recommendation": "Focus on learning the most needed skills to improve your job match across all opportunities"
    }