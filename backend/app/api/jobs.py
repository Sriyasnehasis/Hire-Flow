from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.job import JobListing
from app.services.adzuna import fetch_india_jobs # Connects to your new service

router = APIRouter(prefix="/jobs", tags=["Jobs"])

# Existing manual add route
@router.post("/add")
def create_job(title: str, company: str, location: str, db: Session = Depends(get_db)):
    new_job = JobListing(title=title, company=company, location=location)
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return {"status": "success", "job_id": new_job.id}

# Existing retrieval route
@router.get("/all")
def get_all_jobs(db: Session = Depends(get_db)):
    return db.query(JobListing).all()

# NEW: The Automation Sync Route
@router.get("/sync-adzuna")
async def sync_adzuna_jobs(db: Session = Depends(get_db)):
    # 1. Fetch real data from Adzuna India
    raw_data = await fetch_india_jobs(keyword="Python Developer", location="Bangalore")
    
    jobs_found = raw_data.get("results", [])
    
    # 2. Map external data to your 'System Memory' (PostgreSQL)
    for job in jobs_found:
        new_entry = JobListing(
            title=job.get("title"),
            company=job.get("company", {}).get("display_name"),
            location=job.get("location", {}).get("display_name"),
            description=job.get("description"),
            source="Adzuna India"
        )
        db.add(new_entry)
    
    db.commit()
    return {"message": f"Successfully synced {len(jobs_found)} jobs from Adzuna India"}