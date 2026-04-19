from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, func, ForeignKey
from sqlalchemy.orm import relationship
from app.core.db import Base


class HRContact(Base):
    """Store HR contacts for outreach"""
    __tablename__ = "hr_contacts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Contact information
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    
    # Company & Role information
    company_name = Column(String, nullable=False)
    job_title = Column(String, nullable=True)
    department = Column(String, nullable=True)  # e.g., "HR", "Engineering", "Recruiting"
    company_linkedin_url = Column(String, nullable=True)
    
    # Contact status
    status = Column(String, default="new")  # new, contacted, interested, applied, rejected, hired
    notes = Column(Text, nullable=True)  # Additional notes about the contact
    
    # Engagement tracking
    contacted_at = Column(DateTime(timezone=True), nullable=True)
    last_email_sent_at = Column(DateTime(timezone=True), nullable=True)
    email_response_received = Column(Boolean, default=False)
    
    # Metadata
    source = Column(String, nullable=True)  # Where did we get this contact? (LinkedIn, Company Website, etc.)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", backref="hr_contacts")
    emails = relationship("EmailLog", back_populates="hr_contact", cascade="all, delete-orphan")


class EmailTemplate(Base):
    """Email templates for different scenarios"""
    __tablename__ = "email_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Template information
    name = Column(String, nullable=False)  # e.g., "Job Inquiry", "Resume Submission"
    subject = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    
    # Template variables: {first_name}, {company}, {job_title}, etc.
    description = Column(Text, nullable=True)
    template_type = Column(String, nullable=False)  # job_inquiry, resume_submission, follow_up, thank_you
    
    # Template status
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", backref="email_templates")


class EmailLog(Base):
    """Log of all emails sent"""
    __tablename__ = "email_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    hr_contact_id = Column(Integer, ForeignKey("hr_contacts.id"), nullable=False)
    email_template_id = Column(Integer, ForeignKey("email_templates.id"), nullable=True)
    
    # Email details
    recipient_email = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    
    # Delivery status
    status = Column(String, default="pending")  # pending, sent, failed, bounced
    error_message = Column(Text, nullable=True)
    
    # Tracking information
    sent_at = Column(DateTime(timezone=True), nullable=True)
    opened_at = Column(DateTime(timezone=True), nullable=True)
    clicked_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", backref="email_logs")
    hr_contact = relationship("HRContact", back_populates="emails")
    template = relationship("EmailTemplate", backref="email_logs")
