"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime

# ==================== AUTH SCHEMAS ====================

class UserSignUp(BaseModel):
    """User signup request schema"""
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    
    @validator('password')
    def password_must_be_strong(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v

class UserLogin(BaseModel):
    """User login request schema"""
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    """JWT token response schema"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class UserBase(BaseModel):
    """Base user schema"""
    id: int
    email: str
    full_name: str
    phone: Optional[str] = None

class UserResponse(UserBase):
    """User response schema"""
    
    class Config:
        from_attributes = True

# ==================== PROFILE SCHEMAS ====================

class ProfileDataBase(BaseModel):
    """Base profile data schema"""
    educational_qualification: Optional[str] = None
    years_of_experience: float = 0
    current_company: Optional[str] = None
    primary_skills: List[str] = []
    preferred_roles: List[str] = []
    expected_ctc_min: Optional[float] = None
    expected_ctc_max: Optional[float] = None

class ProfileDataResponse(ProfileDataBase):
    """Profile data response schema"""
    user_id: int

    class Config:
        from_attributes = True

# ==================== RESUME SCHEMAS ====================

class ResumeBase(BaseModel):
    """Base resume schema"""
    original_filename: str
    file_type: str  # pdf, docx, txt

class ResumeCreate(ResumeBase):
    """Create resume schema"""
    pass

class ResumeResponse(ResumeBase):
    """Resume response schema"""
    id: int
    user_id: int
    file_path: str
    version_number: int
    is_current: bool
    ats_score: int
    created_at: datetime

    class Config:
        from_attributes = True

# ==================== JOB SCHEMAS ====================

class JobListingBase(BaseModel):
    """Base job listing schema"""
    title: str
    company: str
    location: str
    job_type: str = "full-time"
    description: Optional[str] = None
    required_skills: List[str] = []
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None

class JobListingCreate(JobListingBase):
    """Create job listing schema"""
    pass

class JobListingResponse(JobListingBase):
    """Job listing response schema"""
    id: int
    source: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ==================== APPLICATION SCHEMAS ====================

class JobApplicationBase(BaseModel):
    """Base job application schema"""
    job_listing_id: int
    resume_id: Optional[int] = None
    cover_letter: Optional[str] = None

class JobApplicationCreate(JobApplicationBase):
    """Create job application schema"""
    pass

class JobApplicationResponse(JobApplicationBase):
    """Job application response schema"""
    id: int
    user_id: int
    status: str
    applied_at: datetime
    ai_match_score: Optional[int] = None

    class Config:
        from_attributes = True

# ==================== INTERVIEW SCHEMAS ====================

class InterviewSessionBase(BaseModel):
    """Base interview session schema"""
    interview_type: str  # mock, real-prep, behavioral, technical
    domain_role: str

class InterviewSessionCreate(InterviewSessionBase):
    """Create interview session schema"""
    pass

class InterviewSessionResponse(InterviewSessionBase):
    """Interview session response schema"""
    id: int
    user_id: int
    overall_score: Optional[int] = None
    started_at: datetime

    class Config:
        from_attributes = True

# ==================== SKILL GAP SCHEMAS ====================

class SkillGapAnalysisBase(BaseModel):
    """Base skill gap analysis schema"""
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    improvement_suggestions: List[dict] = []
    overall_match_percentage: int = 0

class SkillGapAnalysisResponse(SkillGapAnalysisBase):
    """Skill gap analysis response schema"""
    id: int
    user_id: int
    job_listing_id: int

    class Config:
        from_attributes = True

# ==================== HR CONTACT SCHEMAS ====================

class HRContactBase(BaseModel):
    """Base HR contact schema"""
    name: str
    email: Optional[str] = None
    company: str
    designation: Optional[str] = None
    linkedin_url: Optional[str] = None

class HRContactCreate(HRContactBase):
    """Create HR contact schema"""
    pass

class HRContactResponse(HRContactBase):
    """HR contact response schema"""
    id: int
    response_status: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
