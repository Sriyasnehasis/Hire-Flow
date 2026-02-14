from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

# PostgreSQL (Relational) - For structured User & Job data
engine = create_engine(os.getenv("POSTGRES_URL"))
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# MongoDB (NoSQL) - For storing raw, messy scraped HTML/JSON
mongo_client = AsyncIOMotorClient(os.getenv("MONGO_URL"))
raw_db = mongo_client.extract_resume_raw

# Dependency to get a DB session in your API routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()