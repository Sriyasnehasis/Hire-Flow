import httpx
import os
import io
import sys
from typing import Optional
from urllib.parse import urlencode

import pdfplumber
from docx import Document
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.security import security_service
from app.core.config import settings
from app.models.user import User
from app.schemas import UserSignUp, UserLogin, TokenResponse, UserResponse


load_dotenv()
router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/test")
def test_endpoint(data: dict):
    """Simple test endpoint"""
    return {"status": "ok", "received": data}


class RefreshTokenRequest(BaseModel):
    refresh_token: str


# ==================== EMAIL/PASSWORD AUTH ====================

@router.post("/signup", response_model=TokenResponse)
def signup(payload: UserSignUp, db: Session = Depends(get_db)):
    try:
        print(f"[Signup] Received email: {payload.email}")
        existing = db.query(User).filter(User.email == payload.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered",
            )

        password_hash = security_service.hash_password(payload.password)
        print(f"[Signup] Password hashed successfully")

        user = User(
            email=payload.email,
            password_hash=password_hash,
            full_name=payload.full_name,
            phone=payload.phone,
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"[Signup] User created with ID: {user.id}")

        access_token = security_service.create_access_token({"sub": str(user.id)})
        refresh_token = security_service.create_refresh_token({"sub": str(user.id)})
        print(f"[Signup] Tokens created successfully")

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"[Signup] ERROR: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Signup failed: {str(e)}"
        )


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    try:
        print(f"[Login] Attempting login for email: {payload.email}")
        user: Optional[User] = db.query(User).filter(User.email == payload.email).first()
        if not user or not user.password_hash:
            print(f"[Login] User not found or no password hash")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        if not security_service.verify_password(payload.password, user.password_hash):
            print(f"[Login] Password verification failed")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        print(f"[Login] Password verified successfully")
        access_token = security_service.create_access_token({"sub": str(user.id)})
        refresh_token = security_service.create_refresh_token({"sub": str(user.id)})
        print(f"[Login] Tokens created successfully")

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"[Login] ERROR: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Login failed: {str(e)}"
        )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh_tokens(payload: RefreshTokenRequest, db: Session = Depends(get_db)):
    try:
        token_data = security_service.verify_token(payload.refresh_token)
    except HTTPException:
        # verify_token already raises a 401; just re-raise
        raise

    user_id = token_data.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    user: Optional[User] = db.query(User).filter(User.id == int(user_id)).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User inactive or not found",
        )

    access_token = security_service.create_access_token({"sub": str(user.id)})
    refresh_token = security_service.create_refresh_token({"sub": str(user.id)})

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db),
):
    user: Optional[User] = db.query(User).filter(User.id == current_user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


# ==================== GITHUB OAUTH AUTH (EXISTING) ====================

CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv(
    "GOOGLE_REDIRECT_URI", "http://localhost:8000/api/v1/auth/google/callback"
)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


def _oauth_success_redirect(user: User) -> RedirectResponse:
    access_token = security_service.create_access_token({"sub": str(user.id)})
    refresh_token = security_service.create_refresh_token({"sub": str(user.id)})
    params = urlencode(
        {
            "access_token": access_token,
            "refresh_token": refresh_token,
        }
    )
    return RedirectResponse(f"{FRONTEND_URL}/auth/oauth-callback?{params}")


@router.get("/github/login")
async def github_login():
    """Step 1: Send user to GitHub to ask for permission"""
    return RedirectResponse(
        f"https://github.com/login/oauth/authorize?client_id={CLIENT_ID}&scope=repo"
    )


@router.get("/github/callback")
async def github_callback(code: str, db: Session = Depends(get_db)):
    """Step 2: Exchange code for token, create/login user, then redirect to frontend."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "code": code,
            },
            headers={"Accept": "application/json"},
        )
        token_data = response.json()
        access_token = token_data.get("access_token")

        if not access_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to retrieve GitHub access token",
            )

        user_res = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"token {access_token}"},
        )
        if not user_res.is_success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to fetch GitHub profile",
            )
        profile = user_res.json()

        email = profile.get("email")
        if not email:
            emails_res = await client.get(
                "https://api.github.com/user/emails",
                headers={"Authorization": f"token {access_token}"},
            )
            if emails_res.is_success:
                emails = emails_res.json()
                primary = next(
                    (e for e in emails if e.get("primary") and e.get("verified")),
                    None,
                )
                fallback = next((e for e in emails if e.get("verified")), None)
                email = (primary or fallback or {}).get("email")

        if not email:
            login = profile.get("login", "github-user")
            email = f"{login}@users.noreply.github.com"

        user = db.query(User).filter(User.email == email).first()

        if not user:
            user = User(
                email=email,
                full_name=profile.get("name") or profile.get("login"),
                username=profile.get("login"),
                access_token=access_token,
                profile_pic_url=profile.get("avatar_url"),
                is_active=True,
            )
            db.add(user)
        else:
            user.access_token = access_token
            if not user.full_name:
                user.full_name = profile.get("name") or profile.get("login")
            if not user.profile_pic_url:
                user.profile_pic_url = profile.get("avatar_url")

        db.commit()
        db.refresh(user)
        return _oauth_success_redirect(user)


@router.get("/google/login")
async def google_login():
    """Step 1: Send user to Google OAuth consent screen."""
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google OAuth is not configured",
        )

    params = urlencode(
        {
            "client_id": GOOGLE_CLIENT_ID,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "response_type": "code",
            "scope": "openid email profile",
            "access_type": "offline",
            "prompt": "consent",
        }
    )
    return RedirectResponse(f"https://accounts.google.com/o/oauth2/v2/auth?{params}")


@router.get("/google/callback")
async def google_callback(code: str, db: Session = Depends(get_db)):
    """Step 2: Exchange Google code, create/login user, then redirect to frontend."""
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google OAuth is not configured",
        )

    async with httpx.AsyncClient() as client:
        token_res = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )

        if not token_res.is_success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to exchange Google authorization code",
            )

        token_data = token_res.json()
        provider_access_token = token_data.get("access_token")
        if not provider_access_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing Google access token",
            )

        profile_res = await client.get(
            "https://openidconnect.googleapis.com/v1/userinfo",
            headers={"Authorization": f"Bearer {provider_access_token}"},
        )

        if not profile_res.is_success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to fetch Google profile",
            )

        profile = profile_res.json()
        email = profile.get("email")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google account has no email",
            )

        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(
                email=email,
                full_name=profile.get("name"),
                profile_pic_url=profile.get("picture"),
                is_active=True,
            )
            db.add(user)
        else:
            if not user.full_name:
                user.full_name = profile.get("name")
            if not user.profile_pic_url:
                user.profile_pic_url = profile.get("picture")

        db.commit()
        db.refresh(user)
        return _oauth_success_redirect(user)


@router.get("/user/{user_id}")
async def get_user_details(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}
    return {
        "username": user.username,
        "resume_text": user.resume_text,
    }


@router.post("/user/{user_id}/resume")
async def upload_resume(
    user_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # 1. Check file size (e.g., max 5MB)
    if hasattr(file, "size") and file.size is not None and file.size > 5 * 1024 * 1024:
        return {"error": "File too large. Maximum size is 5MB."}

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}

    file_content = await file.read()
    await file.close()
    filename = file.filename.lower()
    extracted_text = ""

    try:
        # 3. Parse based on file type
        if filename.endswith(".pdf"):
            with pdfplumber.open(io.BytesIO(file_content)) as pdf:
                extracted_text = "\n".join(
                    page.extract_text() for page in pdf.pages if page.extract_text()
                )

        elif filename.endswith(".docx"):
            doc = Document(io.BytesIO(file_content))
            extracted_text = "\n".join([para.text for para in doc.paragraphs])

        elif filename.endswith(".txt"):
            extracted_text = file_content.decode("utf-8")

        else:
            return {"error": "Unsupported file format. Please use PDF, DOCX, or TXT."}

        if not extracted_text.strip():
            return {"error": "Could not extract text from the document."}

        # 4. Save extracted text to the database profile
        user.resume_text = extracted_text
        db.commit()

        print(
            f"SUCCESS: Processed {filename} for {user.username}. Length: {len(extracted_text)}"
        )
        return {
            "message": "Resume processed and uploaded successfully!",
            "username": user.username,
        }

    except Exception as e:  # pragma: no cover - defensive logging
        print(f"ERROR processing file: {str(e)}")
        return {"error": f"Failed to process document: {str(e)}"}