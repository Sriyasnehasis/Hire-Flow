from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.db import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=True)  # S3 path or local path
    raw_text = Column(Text, nullable=True)  # Full extracted text from PDF/DOCX
    
    # Resume Builder fields
    created_from = Column(String, default="uploaded")  # "uploaded" or "built"
    template_id = Column(String, nullable=True)  # Template used (modern, professional, creative, etc.)
    title = Column(String, nullable=True)  # Resume title (e.g., "Full Stack Developer Resume")
    summary = Column(Text, nullable=True)  # Professional summary
    
    # Structured sections (JSON format)
    parsed_education = Column(String, nullable=True)  # JSON string or text
    parsed_experience = Column(String, nullable=True)  # JSON string or text
    parsed_skills = Column(String, nullable=True)  # JSON string or text
    parsed_certifications = Column(String, nullable=True)  # JSON string
    parsed_projects = Column(String, nullable=True)  # JSON string for portfolio projects
    
    # Metadata
    ats_score = Column(Float, nullable=True)  # ATS compatibility score
    ats_last_checked = Column(DateTime, nullable=True)  # When ATS was last calculated
    version_number = Column(Integer, default=1)
    is_current = Column(Boolean, default=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="resumes")

    class Config:
        from_attributes = True
