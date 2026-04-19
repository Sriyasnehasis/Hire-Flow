from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from enum import Enum as PyEnum
from app.core.db import Base


class ApplicationStatus(str, PyEnum):
    """Application status enum"""
    APPLIED = "applied"
    REJECTED = "rejected"
    INTERVIEW = "interview"
    ACCEPTED = "accepted"
    WITHDRAWN = "withdrawn"
    PENDING = "pending"


class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    job_listing_id = Column(Integer, ForeignKey("job_listings.id"), nullable=False, index=True)
    
    # Application details
    status = Column(String, default=ApplicationStatus.APPLIED.value)  # applied, rejected, interview, accepted
    ai_match_score = Column(Float, nullable=True)  # 0-100 skill match score
    cover_letter = Column(Text, nullable=True)  # Generated or custom cover letter
    notes = Column(Text, nullable=True)  # User notes about application
    
    # Timestamps
    applied_at = Column(DateTime, default=datetime.utcnow, index=True)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Interview tracking
    interview_scheduled = Column(DateTime, nullable=True)
    interview_notes = Column(Text, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="applications")
    job_listing = relationship("JobListing", back_populates="applications")

    class Config:
        from_attributes = True
