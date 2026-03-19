from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.db import get_db
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/users", tags=["User Management"])

class UserProfileResponse(BaseModel):
    id: int
    email: str
    full_name: str
    phone: str
    bio: str
    profile_pic_url: str

    class Config:
        from_attributes = True

class ProfileDataResponse(BaseModel):
    user_id: int
    educational_qualification: str
    years_of_experience: float
    current_company: str
    primary_skills: List[str]
    preferred_roles: List[str]

    class Config:
        from_attributes = True

@router.get("/me")
async def get_current_user(
    db: Session = Depends(get_db)
) -> UserProfileResponse:
    """Get current user profile"""
    # TODO: Get user from JWT token
    # TODO: Fetch from database
    return {}

@router.patch("/me")
async def update_user_profile(
    full_name: str = None,
    phone: str = None,
    bio: str = None,
    db: Session = Depends(get_db)
):
    """Update user profile information"""
    # TODO: Update user details in database
    return {"message": "Profile updated"}

@router.get("/me/profile-data")
async def get_profile_data(
    db: Session = Depends(get_db)
) -> ProfileDataResponse:
    """Get detailed profile data"""
    # TODO: Fetch profile data
    return {}

@router.patch("/me/profile-data")
async def update_profile_data(
    educational_qualification: str = None,
    years_of_experience: float = None,
    current_company: str = None,
    primary_skills: List[str] = None,
    db: Session = Depends(get_db)
):
    """Update detailed profile information"""
    # TODO: Update profile data
    return {"message": "Profile data updated"}

@router.post("/me/profile-pic")
async def upload_profile_picture(
    file: dict,
    db: Session = Depends(get_db)
):
    """Upload profile picture"""
    # TODO: Upload to S3
    # TODO: Save URL to database
    return {"url": None}

@router.delete("/me")
async def delete_account(
    db: Session = Depends(get_db)
):
    """Delete user account"""
    # TODO: Delete all user data
    return {"message": "Account deleted"}
