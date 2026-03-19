# Complete Database Schema - SQLAlchemy Models
# Location: backend/app/models/__init__.py (import all models from here)

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float, JSON, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.db import Base
import datetime
from enum import Enum

# ============================================================================
# USER MODEL
# ============================================================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    profile_pic_url = Column(Text, nullable=True)
    resume_file_url = Column(Text, nullable=True)  # Latest resume
    bio = Column(Text, nullable=True)
    is_email_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    profile_data = relationship("ProfileData", back_populates="user", uselist=False, cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    job_applications = relationship("JobApplication", back_populates="user", cascade="all, delete-orphan")
    saved_jobs = relationship("SavedJob", back_populates="user", cascade="all, delete-orphan")
    interview_sessions = relationship("InterviewSession", back_populates="user", cascade="all, delete-orphan")
    skill_assessments = relationship("SkillGapAnalysis", back_populates="user", cascade="all, delete-orphan")
    hr_contacts_contacted = relationship("HRContact", back_populates="contacted_by_user")

    def __repr__(self):
        return f"<User {self.email}>"


# ============================================================================
# PROFILE DATA MODEL
# ============================================================================

class ProfileData(Base):
    __tablename__ = "profile_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Education
    educational_qualification = Column(String(255), nullable=True)  # B.Tech, M.Tech, etc
    current_cgpa = Column(Float, nullable=True)
    college_name = Column(String(255), nullable=True)
    graduation_year = Column(Integer, nullable=True)
    
    # Experience
    experience_level = Column(String(50), default="fresher")  # fresher, 1yr, 2yr, 3yr+
    years_of_experience = Column(Float, default=0)
    current_company = Column(String(255), nullable=True)
    current_designation = Column(String(255), nullable=True)
    
    # Skills
    primary_skills = Column(JSON, default=[])  # ["Python", "FastAPI", "React"]
    secondary_skills = Column(JSON, default=[])
    languages_known = Column(JSON, default=[])  # ["English", "Hindi"]
    skill_proficiency = Column(JSON, default={})  # {"Python": "Advanced", "JS": "Intermediate"}
    
    # Certifications
    certifications = Column(JSON, default=[])  # List of certification dicts
    
    # Projects
    projects = Column(JSON, default=[])  # List of project dicts with descriptions
    
    # Preferences
    preferred_roles = Column(JSON, default=[])  # ["Backend Developer", "Full Stack"]
    preferred_locations = Column(JSON, default=[])
    preferred_job_types = Column(JSON, default=["full-time"])  # full-time, intern, contract
    
    # Salary Expectations
    expected_ctc_min = Column(Float, nullable=True)  # in LPA
    expected_ctc_max = Column(Float, nullable=True)
    
    # External Profiles
    github_profile_url = Column(Text, nullable=True)
    linkedin_profile_url = Column(Text, nullable=True)
    portfolio_url = Column(Text, nullable=True)
    
    # Data Sync Tracking
    github_data_synced = Column(Boolean, default=False)
    github_data_synced_at = Column(DateTime, nullable=True)
    linkedin_data_synced = Column(Boolean, default=False)
    linkedin_data_synced_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="profile_data")

    def __repr__(self):
        return f"<ProfileData user_id={self.user_id}>"


# ============================================================================
# RESUME MODEL
# ============================================================================

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # File Info
    file_path = Column(Text, nullable=False)  # S3 URL or local path
    original_filename = Column(String(255), nullable=True)
    file_size_bytes = Column(Integer, nullable=True)
    file_type = Column(String(10), nullable=True)  # pdf, docx, txt
    
    # Parsed Data from Resume
    parsed_data = Column(JSON, default={})  # {
                                            #   "name": "...",
                                            #   "email": "...",
                                            #   "phone": "...",
                                            #   "skills": [...],
                                            #   "experiences": [...],
                                            #   "education": [...],
                                            #   "certifications": [...]
                                            # }
    
    # ATS Analysis
    ats_score = Column(Integer, default=0)  # 0-100
    ats_feedback = Column(JSON, default=[])  # List of suggestions
    ats_keywords_found = Column(JSON, default=[])
    ats_keywords_missing = Column(JSON, default=[])
    
    # Version Control
    version_number = Column(Integer, default=1)
    is_current = Column(Boolean, default=False)  # Only one can be current per user
    
    # Metadata
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="resumes")
    job_applications = relationship("JobApplication", back_populates="resume_used")

    def __repr__(self):
        return f"<Resume user_id={self.user_id} v{self.version_number}>"


# ============================================================================
# JOB LISTING MODEL
# ============================================================================

class JobListing(Base):
    __tablename__ = "job_listings"

    id = Column(Integer, primary_key=True, index=True)
    
    # Job Basic Info
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    job_type = Column(String(50), default="full-time")  # full-time, part-time, contract, intern
    
    # Job Details
    description = Column(Text, nullable=True)
    requirements = Column(Text, nullable=True)
    benefits = Column(Text, nullable=True)
    
    # Structured Data
    required_skills = Column(JSON, default=[])  # ["Python", "FastAPI", etc]
    required_experience_years = Column(Integer, default=0)
    nice_to_have_skills = Column(JSON, default=[])
    
    # Salary Info
    salary_min = Column(Float, nullable=True)  # in LPA
    salary_max = Column(Float, nullable=True)
    currency = Column(String(10), default="INR")
    
    # Source Info
    source = Column(String(50), default="linkedin")  # linkedin, adzuna, scrapped, manual
    source_url = Column(Text, nullable=True)
    source_job_id = Column(String(255), nullable=True)
    
    # Contact Info
    contact_email = Column(String(255), nullable=True)
    company_logo_url = Column(Text, nullable=True)
    company_website = Column(Text, nullable=True)
    
    # Dates
    posting_date = Column(DateTime, nullable=True)
    application_deadline = Column(DateTime, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_scrapped = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    applications = relationship("JobApplication", back_populates="job")
    saved_by_users = relationship("SavedJob", back_populates="job")
    skill_gap_analyses = relationship("SkillGapAnalysis", back_populates="job")

    def __repr__(self):
        return f"<JobListing {self.title} at {self.company}>"


# ============================================================================
# JOB APPLICATION MODEL
# ============================================================================

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_listing_id = Column(Integer, ForeignKey("job_listings.id", ondelete="CASCADE"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="SET NULL"), nullable=True)
    
    # Application Status
    status = Column(String(50), default="applied")  # applied, rejected, shortlisted, interview, accepted, withdrawn
    status_updated_at = Column(DateTime, nullable=True)
    
    # Application Method
    applied_via = Column(String(50), default="manual")  # manual, auto (extension), resume-upload
    
    # Analysis
    ai_match_score = Column(Integer, nullable=True)  # 0-100%
    skill_gap_analysis_id = Column(Integer, ForeignKey("skill_gap_analysis.id"), nullable=True)
    cover_letter_generated = Column(Boolean, default=False)
    cover_letter = Column(Text, nullable=True)
    
    # Interview Tracking
    interview_scheduled = Column(Boolean, default=False)
    interview_date = Column(DateTime, nullable=True)
    interview_session_id = Column(Integer, ForeignKey("interview_sessions.id"), nullable=True)
    
    # Communication
    follow_up_sent_count = Column(Integer, default=0)
    last_follow_up_date = Column(DateTime, nullable=True)
    
    # Notes
    user_notes = Column(Text, nullable=True)
    
    # Dates
    applied_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="job_applications")
    job = relationship("JobListing", back_populates="applications")
    resume_used = relationship("Resume", back_populates="job_applications")

    def __repr__(self):
        return f"<JobApplication user_id={self.user_id} job_id={self.job_listing_id}>"


# ============================================================================
# SAVED JOB MODEL
# ============================================================================

class SavedJob(Base):
    __tablename__ = "saved_jobs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_listing_id = Column(Integer, ForeignKey("job_listings.id", ondelete="CASCADE"), nullable=False)
    
    saved_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="saved_jobs")
    job = relationship("JobListing", back_populates="saved_by_users")

    __table_args__ = (UniqueConstraint('user_id', 'job_listing_id', name='unique_user_job_save'),)

    def __repr__(self):
        return f"<SavedJob user_id={self.user_id} job_id={self.job_listing_id}>"


# ============================================================================
# SKILL GAP ANALYSIS MODEL
# ============================================================================

class SkillGapAnalysis(Base):
    __tablename__ = "skill_gap_analysis"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_listing_id = Column(Integer, ForeignKey("job_listings.id", ondelete="CASCADE"), nullable=False)
    
    # Skills Analysis
    matched_skills = Column(JSON, default=[])  # Skills they have
    missing_skills = Column(JSON, default=[])  # Skills they need
    skill_proficiency_comparison = Column(JSON, default={})  # {
                                                             #   "Python": {
                                                             #     "user_level": "Advanced",
                                                             #     "job_required": "Intermediate"
                                                             #   }
                                                             # }
    
    # Match Scores
    overall_match_percentage = Column(Integer, default=0)
    skill_match_percentage = Column(Integer, default=0)
    experience_match_percentage = Column(Integer, default=0)
    
    # Improvement Suggestions
    improvement_suggestions = Column(JSON, default=[])  # [
                                                        #   {
                                                        #     "skill": "Docker",
                                                        #     "current_level": "None",
                                                        #     "required_level": "Intermediate",
                                                        #     "learning_resources": ["...course links..."],
                                                        #     "estimated_days": 30
                                                        #   }
                                                        # ]
    
    estimated_total_learning_days = Column(Integer, nullable=True)
    
    # Timeline
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="skill_assessments")
    job = relationship("JobListing", back_populates="skill_gap_analyses")

    def __repr__(self):
        return f"<SkillGapAnalysis user_id={self.user_id} job_id={self.job_listing_id}>"


# ============================================================================
# INTERVIEW SESSION MODEL
# ============================================================================

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Interview Details
    interview_type = Column(String(50), default="mock")  # mock, real-prep, behavioral, technical
    domain_role = Column(String(255), nullable=True)  # "Backend Developer", "Data Scientist", etc
    
    # Questions & Responses
    questions = Column(JSON, default=[])  # [
                                          #   {
                                          #     "id": 1,
                                          #     "question": "What is...",
                                          #     "difficulty": "easy|medium|hard",
                                          #     "category": "technical|behavioral"
                                          #   }
                                          # ]
    
    user_responses = Column(JSON, default=[])  # [
                                               #   {
                                               #     "question_id": 1,
                                               #     "response": "...",
                                               #     "ai_score": 7,
                                               #     "ai_feedback": "Good...could improve..."
                                               #   }
                                               # ]
    
    # Overall Feedback
    overall_score = Column(Integer, nullable=True)  # 0-100
    ai_detailed_feedback = Column(JSON, default=[])  # Array of feedback for each Q
    areas_to_improve = Column(JSON, default=[])
    strengths_identified = Column(JSON, default=[])
    
    # Recording (Optional)
    audio_recording_url = Column(Text, nullable=True)
    has_recording = Column(Boolean, default=False)
    
    # Timing
    duration_seconds = Column(Integer, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="interview_sessions")

    def __repr__(self):
        return f"<InterviewSession user_id={self.user_id} type={self.interview_type}>"


# ============================================================================
# HR CONTACT MODEL
# ============================================================================

class HRContact(Base):
    __tablename__ = "hr_contacts"

    id = Column(Integer, primary_key=True, index=True)
    
    # Personal Info
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    
    # Company Info
    company = Column(String(255), nullable=False)
    company_url = Column(Text, nullable=True)
    designation = Column(String(255), nullable=True)  # HR Manager, Recruiter, etc
    company_location = Column(String(255), nullable=True)
    
    # Contact Details
    linkedin_url = Column(Text, nullable=True)
    source = Column(String(50), default="linkedin")  # linkedin, email-scrapped, manual
    source_job_id = Column(String(255), nullable=True)  # If scraped from specific job posting
    
    # Contact History (if contacted through platform)
    contacted_by_user = relationship("User", back_populates="hr_contacts_contacted", foreign_keys="HRContact.user_id_contacted", viewonly=True)
    user_id_contacted = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Response Tracking
    contact_attempts_count = Column(Integer, default=0)
    last_contacted_date = Column(DateTime, nullable=True)
    last_response_received = Column(DateTime, nullable=True)
    response_status = Column(String(50), nullable=True)  # responded, no-response, rejected, interested
    
    # Notes
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    def __repr__(self):
        return f"<HRContact {self.name} at {self.company}>"


# ============================================================================
# EMAIL QUEUE MODEL (for automated bulk emails)
# ============================================================================

class EmailQueue(Base):
    __tablename__ = "email_queue"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Email Details
    to_email = Column(String(255), nullable=False)
    subject = Column(String(500), nullable=False)
    body = Column(Text, nullable=False)
    email_type = Column(String(50), default="job-application")  # job-application, follow-up, custom
    
    # Related Entity
    job_listing_id = Column(Integer, ForeignKey("job_listings.id"), nullable=True)
    hr_contact_id = Column(Integer, ForeignKey("hr_contacts.id"), nullable=True)
    
    # Status
    status = Column(String(50), default="pending")  # pending, sent, failed, bounced
    scheduled_for = Column(DateTime, nullable=True)
    sent_at = Column(DateTime, nullable=True)
    failure_reason = Column(Text, nullable=True)
    
    # Tracking
    open_count = Column(Integer, default=0)
    click_count = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    def __repr__(self):
        return f"<EmailQueue to={self.to_email} status={self.status}>"


# ============================================================================
# DATABASE INITIALIZATION
# ============================================================================
# In app/core/db.py, make sure to do:
# Base.metadata.create_all(bind=engine)
# to auto-create all tables
