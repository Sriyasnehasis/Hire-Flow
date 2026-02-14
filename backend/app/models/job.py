from sqlalchemy import Column, Integer, String, Text, DateTime
from app.core.db import Base
import datetime

class JobListing(Base):
    __tablename__ = "job_listings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    company = Column(String(255))
    location = Column(String(100))
    description = Column(Text)
    source = Column(String(50)) # e.g., 'Adzuna' or 'Naukri'
    created_at = Column(DateTime, default=datetime.datetime.utcnow)