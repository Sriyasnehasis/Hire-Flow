from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.db import get_db
from app.core.security import security_service
from app.models.user import User
from pydantic import BaseModel, Field

router = APIRouter(prefix="/users", tags=["User Management"])

class UserProfileResponse(BaseModel):
    id: int
    email: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    profile_pic_url: Optional[str] = None
    profession: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None

    class Config:
        from_attributes = True


class UserProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    profession: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    resume_text: Optional[str] = None

class ProfileDataResponse(BaseModel):
    user_id: int
    educational_qualification: Optional[str] = None
    years_of_experience: float
    current_company: Optional[str] = None
    current_status: Optional[str] = None
    primary_skills: List[str] = Field(default_factory=list)
    preferred_roles: List[str] = Field(default_factory=list)
    research_interests: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)

    class Config:
        from_attributes = True


class ProfileDataUpdateRequest(BaseModel):
    educational_qualification: Optional[str] = None
    years_of_experience: Optional[float] = None
    current_company: Optional[str] = None
    current_status: Optional[str] = None
    primary_skills: Optional[List[str]] = None
    preferred_roles: Optional[List[str]] = None
    research_interests: Optional[List[str]] = None
    certifications: Optional[List[str]] = None


def _clean_list(values: Optional[List[str]]) -> Optional[List[str]]:
    if values is None:
        return None

    cleaned: List[str] = []
    for value in values:
        item = value.strip()
        if item and item not in cleaned:
            cleaned.append(item)
    return cleaned

@router.get("/me")
async def get_current_user(
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db),
) -> UserProfileResponse:
    """Get current user profile"""
    user = db.query(User).filter(User.id == current_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/me")
async def update_user_profile(
    payload: UserProfileUpdateRequest,
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db),
) -> UserProfileResponse:
    """Update user profile information"""
    user = db.query(User).filter(User.id == current_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = payload.model_dump(exclude_none=True)
    for key, value in update_data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user

@router.get("/me/profile-data")
async def get_profile_data(
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db),
) -> ProfileDataResponse:
    """Get detailed profile data"""
    user = db.query(User).filter(User.id == current_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return ProfileDataResponse(
        user_id=user.id,
        educational_qualification=user.educational_qualification,
        years_of_experience=user.years_of_experience or 0.0,
        current_company=user.current_company,
        current_status=user.current_status,
        primary_skills=user.primary_skills or [],
        preferred_roles=user.preferred_roles or [],
        research_interests=user.research_interests or [],
        certifications=user.certifications or [],
    )

@router.patch("/me/profile-data")
async def update_profile_data(
    payload: ProfileDataUpdateRequest,
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db),
) -> ProfileDataResponse:
    """Update detailed profile information"""
    user = db.query(User).filter(User.id == current_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.years_of_experience is not None and payload.years_of_experience < 0:
        raise HTTPException(status_code=400, detail="years_of_experience cannot be negative")

    if payload.educational_qualification is not None:
        user.educational_qualification = payload.educational_qualification
    if payload.years_of_experience is not None:
        user.years_of_experience = payload.years_of_experience
    if payload.current_company is not None:
        user.current_company = payload.current_company
    if payload.current_status is not None:
        user.current_status = payload.current_status

    cleaned_primary_skills = _clean_list(payload.primary_skills)
    if cleaned_primary_skills is not None:
        user.primary_skills = cleaned_primary_skills

    cleaned_preferred_roles = _clean_list(payload.preferred_roles)
    if cleaned_preferred_roles is not None:
        user.preferred_roles = cleaned_preferred_roles

    cleaned_research_interests = _clean_list(payload.research_interests)
    if cleaned_research_interests is not None:
        user.research_interests = cleaned_research_interests

    cleaned_certifications = _clean_list(payload.certifications)
    if cleaned_certifications is not None:
        user.certifications = cleaned_certifications

    db.commit()
    db.refresh(user)

    return ProfileDataResponse(
        user_id=user.id,
        educational_qualification=user.educational_qualification,
        years_of_experience=user.years_of_experience or 0.0,
        current_company=user.current_company,
        current_status=user.current_status,
        primary_skills=user.primary_skills or [],
        preferred_roles=user.preferred_roles or [],
        research_interests=user.research_interests or [],
        certifications=user.certifications or [],
    )

@router.post("/me/profile-pic")
async def upload_profile_picture(
    file: dict,
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db),
):
    """Upload profile picture"""
    # TODO: Upload to S3
    # TODO: Save URL to database
    raise HTTPException(status_code=501, detail="Profile picture upload not implemented yet")

@router.delete("/me")
async def delete_account(
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db),
):
    """Delete user account"""
    user = db.query(User).filter(User.id == current_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return {"message": "Account deleted"}
