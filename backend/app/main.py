from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.db import engine, Base
# Import all models from __init__.py to ensure they're registered with Base
from app.models import User, ProfileData, Resume, JobListing, JobApplication, SavedJob, SkillGapAnalysis, InterviewSession, HRContact
from app.api import jobs, auth, resume, applications, interviews, hr_contacts, users

# This line automatically creates tables in PostgreSQL
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ExtractResume AI Ecosystem",
    description="AI-powered placement assistant platform",
    version="0.1.0"
)

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers under a common API prefix
API_PREFIX = "/api/v1"

app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(jobs.router, prefix=API_PREFIX)
app.include_router(users.router, prefix=API_PREFIX)
app.include_router(resume.router, prefix=API_PREFIX)
app.include_router(applications.router, prefix=API_PREFIX)
app.include_router(interviews.router, prefix=API_PREFIX)
app.include_router(hr_contacts.router, prefix=API_PREFIX)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Backend connected to PostgreSQL and MongoDB",
        "next_steps": "Testing with Bruno"
    }