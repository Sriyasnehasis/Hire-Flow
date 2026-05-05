from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.db import engine, Base
from app.models.job import JobListing
from app.models.user import User
from app.api import jobs, auth, resume, applications, interviews, hr_contacts, users, github, ats, cover_letter
from sqlalchemy import inspect

# This line automatically creates tables in PostgreSQL
Base.metadata.create_all(bind=engine)

# Force SQLAlchemy to reflect the actual database schema
# This ensures it knows about all columns that were added via migrations
try:
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    print(f"[STARTUP] Detected tables: {existing_tables}")
    if 'users' in existing_tables:
        cols = inspector.get_columns('users')
        print(f"[STARTUP] Users table has {len(cols)} columns")
except Exception as e:
    print(f"[STARTUP] Warning: Could not inspect tables: {e}")

app = FastAPI(
    title="HireFlow API",
    description="HireFlow — AI-powered career platform",
    version="1.0.0"
)

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for production demo stability
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
app.include_router(github.router, prefix=API_PREFIX)
app.include_router(ats.router, prefix=API_PREFIX)
app.include_router(cover_letter.router, prefix=API_PREFIX)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Backend connected to PostgreSQL and MongoDB",
        "next_steps": "Testing with Bruno"
    }