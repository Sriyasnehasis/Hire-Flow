import httpx
import os
import io
import pdfplumber
from docx import Document
from fastapi import APIRouter, Request, Depends, UploadFile, File # Added UploadFile and File
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.user import User
from dotenv import load_dotenv

load_dotenv()
router = APIRouter(prefix="/auth", tags=["Authentication"])

CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

@router.get("/login")
async def github_login():
    """Step 1: Send user to GitHub to ask for permission"""
    return RedirectResponse(
        f"https://github.com/login/oauth/authorize?client_id={CLIENT_ID}&scope=repo"
    )

@router.get("/callback")
async def github_callback(code: str, db: Session = Depends(get_db)):
    """Step 2: Exchange code for token and save user to database"""
    async with httpx.AsyncClient() as client:
        # 1. Exchange the temporary 'code' for a real Access Token
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
            return {"error": "Failed to retrieve access token"}

        # 2. Use the token to fetch the user's GitHub profile
        user_res = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"token {access_token}"}
        )
        profile = user_res.json()

        # 3. Check if user exists in PostgreSQL; if not, create them
        user = db.query(User).filter(User.github_id == str(profile['id'])).first()
        
        if not user:
            user = User(
                github_id=str(profile['id']),
                username=profile['login'],
                access_token=access_token
            )
            db.add(user)
        else:
            # Update the token if the user is returning
            user.access_token = access_token
        
        db.commit()
        return {
            "status": "success",
            "message": f"Welcome {user.username}!",
            "github_id": user.github_id
        }
    
@router.get("/user/{user_id}")
async def get_user_details(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}
    return {
        "username": user.username,
        "resume_text": user.resume_text
    }

@router.post("/user/{user_id}/resume")
async def upload_resume(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    # 1. Check file size (e.g., max 5MB)
    if file.size > 5 * 1024 * 1024:
        return {"error": "File too large. Maximum size is 5MB."}

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}
    
    file_content = await file.read()
    await file.close()  # Good practice to close the file stream
    filename = file.filename.lower()
    extracted_text = ""

    try:
        # 3. Parse based on file type
        if filename.endswith(".pdf"):
            with pdfplumber.open(io.BytesIO(file_content)) as pdf:
                extracted_text = "\n".join(page.extract_text() for page in pdf.pages if page.extract_text())
        
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
        
        print(f"SUCCESS: Processed {filename} for {user.username}. Length: {len(extracted_text)}")
        return {"message": "Resume processed and uploaded successfully!", "username": user.username}

    except Exception as e:
        print(f"ERROR processing file: {str(e)}")
        return {"error": f"Failed to process document: {str(e)}"}