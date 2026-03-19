from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from app.core.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    # Email/password-based auth fields
    email = Column(String, unique=True, index=True, nullable=True)
    password_hash = Column(String, nullable=True)
    full_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)

    # GitHub OAuth fields (used by existing GitHub login flow)
    github_id = Column(String, unique=True, index=True, nullable=True)
    username = Column(String, nullable=True)
    access_token = Column(String, nullable=True)

    # Store the user's parsed resume content here
    resume_text = Column(String, nullable=True)

    # Basic account flags & timestamps
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
