from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Text, JSON, func
from sqlalchemy.orm import relationship
from app.core.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    # Email/password-based auth fields
    email = Column(String, unique=True, index=True, nullable=True)
    password_hash = Column(String, nullable=True)
    full_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    profile_pic_url = Column(String, nullable=True)

    # Manual profile fields for Segment B
    profession = Column(String, nullable=True)
    educational_qualification = Column(String, nullable=True)
    years_of_experience = Column(Float, default=0.0)
    current_company = Column(String, nullable=True)
    current_status = Column(String, nullable=True) # e.g. "Looking for Job"
    primary_skills = Column(JSON, nullable=False, default=list)
    preferred_roles = Column(JSON, nullable=False, default=list)
    research_interests = Column(JSON, nullable=False, default=list)
    certifications = Column(JSON, nullable=False, default=list)
    linkedin_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)

    # GitHub OAuth fields (used by existing GitHub login flow)
    # TEMPORARILY COMMENTED OUT DUE TO SQLALCHEMY METADATA ISSUE
    # These columns physically exist in the database but SQLAlchemy can't see them
    # Will be re-enabled after fixing the ORM metadata cache issue
    # github_id = Column(String, unique=True, index=True, nullable=True)
    # github_username = Column(String, nullable=True)
    # github_access_token = Column(String, nullable=True)
    # github_refresh_token = Column(String, nullable=True)
    # 
    # # GitHub stats & data
    # github_stars_total = Column(Integer, default=0)
    # github_repos_count = Column(Integer, default=0)
    # github_languages = Column(JSON, nullable=False, default=list)
    # github_bio = Column(Text, nullable=True)
    # github_avatar_url = Column(String, nullable=True)
    # github_profile_url = Column(String, nullable=True)
    # github_last_synced = Column(DateTime(timezone=True), nullable=True)
    
    # Legacy field for backward compatibility
    username = Column(String, nullable=True)
    access_token = Column(String, nullable=True)

    # Store the user's parsed resume content here
    resume_text = Column(String, nullable=True)

    # Basic account flags & timestamps
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    applications = relationship("JobApplication", back_populates="user", cascade="all, delete-orphan")
