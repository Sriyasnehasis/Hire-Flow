from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.db import Base
import datetime

class JobListing(Base):
    __tablename__ = "job_listings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True) # Increased length for full addresses
    description = Column(Text, nullable=True)
    
    # --- STRUCTURED DATA FIELDS ---
    contact_email = Column(String(255), nullable=True) 
    is_scraped = Column(Boolean, default=False)      
    source = Column(String(50), default="LinkedIn") # Helps track where data came from
    job_url = Column(Text, nullable=True)            # Helpful for "View Original" buttons
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    applications = relationship("JobApplication", back_populates="job_listing", cascade="all, delete-orphan")

    def to_dict(self):
        """Helper to convert SQL object to JSON easily"""
        return {
            "id": self.id,
            "title": self.title,
            "company": self.company,
            "location": self.location,
            "contact_email": self.contact_email,
            "is_scraped": self.is_scraped,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }