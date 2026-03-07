from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # 1. Added this import
from app.core.db import engine, Base
from app.models.job import JobListing
from app.api import jobs 
from app.api import auth
from app.models.user import User 

# This line automatically creates tables in PostgreSQL
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ExtractResume AI Ecosystem")

# 2. Add CORS Middleware right after 'app = FastAPI(...)'
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows your Chrome extension to talk to the API
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, etc.
    allow_headers=["*"],
)

app.include_router(jobs.router)
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Backend connected to PostgreSQL and MongoDB",
        "next_steps": "Testing with Bruno"
    }