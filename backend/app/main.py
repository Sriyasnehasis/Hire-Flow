from fastapi import FastAPI
from app.core.db import engine, Base
from app.models.job import JobListing
from app.api import jobs  # 1. Import your jobs file

# This line automatically creates the 'job_listings' table in PostgreSQL
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ExtractResume AI Ecosystem")

app.include_router(jobs.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Backend connected to PostgreSQL and MongoDB",
        "next_steps": "Testing with Bruno"
    }