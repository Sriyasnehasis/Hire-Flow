"""
HR Contacts API Endpoints
Manage HR contacts, send emails, track engagement
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.db import get_db
from app.core.security import security_service
from app.models.hr_contact import HRContact, EmailTemplate, EmailLog
from app.services.email_service import email_service
from app.models.user import User
from app.services.ai_service import generate_outreach_email
from pydantic import BaseModel

router = APIRouter(prefix="/hr-contacts", tags=["HR Contacts & Email"])

# ============ SCHEMAS ============

class CreateHRContactRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    company_name: str
    job_title: Optional[str] = None
    department: Optional[str] = None
    company_linkedin_url: Optional[str] = None
    source: Optional[str] = None
    notes: Optional[str] = None

class UpdateHRContactRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    company_name: Optional[str] = None
    job_title: Optional[str] = None
    department: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class HRContactResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: Optional[str]
    company_name: str
    job_title: Optional[str]
    department: Optional[str]
    status: str
    contacted_at: Optional[datetime]
    email_response_received: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class CreateEmailTemplateRequest(BaseModel):
    name: str
    subject: str
    body: str
    template_type: str  # job_inquiry, resume_submission, follow_up, thank_you
    description: Optional[str] = None

class SendEmailRequest(BaseModel):
    hr_contact_id: int
    template_id: Optional[int] = None
    subject: Optional[str] = None
    body: Optional[str] = None
    custom_variables: Optional[dict] = None

class SendBatchEmailRequest(BaseModel):
    hr_contact_ids: List[int]
    template_id: int
    custom_variables_list: Optional[List[dict]] = None

# ============ HR CONTACTS ENDPOINTS ============

@router.get("/")
async def list_hr_contacts(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db)
):
    """List all HR contacts for the user"""
    query = db.query(HRContact).filter(HRContact.user_id == current_user_id)
    
    if status:
        query = query.filter(HRContact.status == status)
    
    contacts = query.offset(skip).limit(limit).all()
    total = query.count()
    
    return {
        "contacts": contacts,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.post("/")
async def create_hr_contact(
    request: CreateHRContactRequest,
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db)
):
    """Add a new HR contact"""
    
    # Check if already exists
    existing = db.query(HRContact).filter(
        HRContact.user_id == current_user_id,
        HRContact.email == request.email,
        HRContact.company_name == request.company_name
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="This contact already exists")
    
    contact = HRContact(
        user_id=current_user_id,
        first_name=request.first_name,
        last_name=request.last_name,
        email=request.email,
        phone=request.phone,
        company_name=request.company_name,
        job_title=request.job_title,
        department=request.department,
        company_linkedin_url=request.company_linkedin_url,
        source=request.source,
        notes=request.notes,
        status="new"
    )
    
    db.add(contact)
    db.commit()
    db.refresh(contact)
    
    return {
        "status": "created",
        "contact": contact,
        "message": f"Added HR contact: {request.first_name} {request.last_name}"
    }

@router.get("/{contact_id}")
async def get_hr_contact(
    contact_id: int,
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db)
):
    """Get details of a specific HR contact"""
    contact = db.query(HRContact).filter(
        HRContact.id == contact_id,
        HRContact.user_id == current_user_id
    ).first()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    return contact

@router.put("/{contact_id}")
async def update_hr_contact(
    contact_id: int,
    request: UpdateHRContactRequest,
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db)
):
    """Update HR contact information"""
    contact = db.query(HRContact).filter(
        HRContact.id == contact_id,
        HRContact.user_id == current_user_id
    ).first()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    # Update fields that are provided
    if request.first_name:
        contact.first_name = request.first_name
    if request.last_name:
        contact.last_name = request.last_name
    if request.email:
        contact.email = request.email
    if request.phone:
        contact.phone = request.phone
    if request.company_name:
        contact.company_name = request.company_name
    if request.job_title:
        contact.job_title = request.job_title
    if request.department:
        contact.department = request.department
    if request.status:
        contact.status = request.status
    if request.notes:
        contact.notes = request.notes
    
    contact.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(contact)
    
    return {
        "status": "updated",
        "contact": contact,
        "message": "Contact updated successfully"
    }

@router.delete("/{contact_id}")
async def delete_hr_contact(
    contact_id: int,
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db)
):
    """Delete an HR contact"""
    contact = db.query(HRContact).filter(
        HRContact.id == contact_id,
        HRContact.user_id == current_user_id
    ).first()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    db.delete(contact)
    db.commit()
    
    return {
        "status": "deleted",
        "message": f"Deleted contact: {contact.first_name} {contact.last_name}"
    }

@router.post("/{contact_id}/outreach-draft")
async def generate_contact_outreach_draft(
    contact_id: int,
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db)
):
    """
    Generate an AI-powered outreach email draft for a contact.
    Uses user profile, resume text, and past successful email style preferences.
    """
    contact = db.query(HRContact).filter(
        HRContact.id == contact_id,
        HRContact.user_id == current_user_id
    ).first()
    
    if not contact:
        raise HTTPException(status_code=404, detail="HR Contact not found")
        
    user = db.query(User).filter(User.id == current_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Gather up to 3 previously sent emails for style preference / few-shot learning
    past_emails = db.query(EmailLog).filter(
        EmailLog.user_id == current_user_id,
        EmailLog.status == "sent"
    ).order_by(EmailLog.created_at.desc()).limit(3).all()
    
    past_examples = [
        {"subject": email.subject, "body": email.body}
        for email in past_emails
    ]
    
    draft = await generate_outreach_email(
        user_name=user.full_name or "Job Seeker",
        user_profession=user.headline or "Professional",
        user_skills=user.primary_skills or [],
        user_resume_snippet=user.resume_text or "",
        contact_name=f"{contact.first_name} {contact.last_name}",
        contact_company=contact.company_name,
        contact_title=contact.job_title or "Hiring Coordinator",
        past_examples=past_examples
    )
    
    return draft


# ============ EMAIL TEMPLATE ENDPOINTS ============

@router.get("/templates/")
async def list_email_templates(
    template_type: Optional[str] = None,
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db)
):
    """List email templates for the user"""
    query = db.query(EmailTemplate).filter(EmailTemplate.user_id == current_user_id)
    
    if template_type:
        query = query.filter(EmailTemplate.template_type == template_type)
    
    templates = query.all()
    
    return {
        "templates": templates,
        "total": len(templates)
    }

@router.post("/templates/")
async def create_email_template(
    request: CreateEmailTemplateRequest,
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db)
):
    """Create a new email template"""
    
    template = EmailTemplate(
        user_id=current_user_id,
        name=request.name,
        subject=request.subject,
        body=request.body,
        template_type=request.template_type,
        description=request.description,
        is_active=True
    )
    
    db.add(template)
    db.commit()
    db.refresh(template)
    
    return {
        "status": "created",
        "template": template,
        "message": f"Created email template: {request.name}"
    }

# ============ EMAIL SENDING ENDPOINTS ============

@router.post("/send/")
async def send_email_to_contact(
    request: SendEmailRequest,
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db)
):
    """Send email to a specific HR contact"""
    
    # Verify contact exists
    contact = db.query(HRContact).filter(
        HRContact.id == request.hr_contact_id,
        HRContact.user_id == current_user_id
    ).first()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    # Get email subject and body
    subject = request.subject
    body = request.body
    
    if request.template_id:
        template = db.query(EmailTemplate).filter(
            EmailTemplate.id == request.template_id,
            EmailTemplate.user_id == current_user_id
        ).first()
        
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        
        subject = template.subject
        body = template.body
    
    # Prepare personalization variables
    variables = request.custom_variables or {}
    variables.setdefault("first_name", contact.first_name)
    variables.setdefault("last_name", contact.last_name)
    variables.setdefault("company", contact.company_name)
    variables.setdefault("job_title", contact.job_title or "Hiring Manager")
    
    # Personalize email
    personalized_subject = email_service.personalize_template(subject, variables)
    personalized_body = email_service.personalize_template(body, variables)
    
    # Send email
    result = email_service.send_email(
        recipient_email=contact.email,
        subject=personalized_subject,
        body=personalized_body
    )
    
    # Log the email
    email_log = EmailLog(
        user_id=current_user_id,
        hr_contact_id=contact.id,
        email_template_id=request.template_id,
        recipient_email=contact.email,
        subject=personalized_subject,
        body=personalized_body,
        status="sent" if result["status"] in ["sent", "demo"] else "failed",
        sent_at=datetime.utcnow() if result["status"] in ["sent", "demo"] else None,
        error_message=result.get("error") if result["status"] == "failed" else None
    )
    
    db.add(email_log)
    
    # Update contact status
    contact.contacted_at = datetime.utcnow()
    contact.last_email_sent_at = datetime.utcnow()
    if contact.status == "new":
        contact.status = "contacted"
    
    db.commit()
    
    return {
        "status": "success",
        "message": f"Email sent to {contact.email}",
        "result": result,
        "contact_updated": True
    }

@router.post("/send-batch/")
async def send_batch_emails(
    request: SendBatchEmailRequest,
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db)
):
    """Send emails to multiple HR contacts"""
    
    # Verify template exists
    template = db.query(EmailTemplate).filter(
        EmailTemplate.id == request.template_id,
        EmailTemplate.user_id == current_user_id
    ).first()
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Get all contacts
    contacts = db.query(HRContact).filter(
        HRContact.id.in_(request.hr_contact_ids),
        HRContact.user_id == current_user_id
    ).all()
    
    if not contacts:
        raise HTTPException(status_code=404, detail="No contacts found")
    
    results = []
    for i, contact in enumerate(contacts):
        # Prepare variables
        variables = (request.custom_variables_list[i] if request.custom_variables_list and i < len(request.custom_variables_list) else {})
        variables.setdefault("first_name", contact.first_name)
        variables.setdefault("company", contact.company_name)
        variables.setdefault("job_title", contact.job_title or "Hiring Manager")
        
        # Personalize
        subject = email_service.personalize_template(template.subject, variables)
        body = email_service.personalize_template(template.body, variables)
        
        # Send
        result = email_service.send_email(
            recipient_email=contact.email,
            subject=subject,
            body=body
        )
        
        # Log
        email_log = EmailLog(
            user_id=current_user_id,
            hr_contact_id=contact.id,
            email_template_id=template.id,
            recipient_email=contact.email,
            subject=subject,
            body=body,
            status="sent" if result["status"] in ["sent", "demo"] else "failed",
            sent_at=datetime.utcnow() if result["status"] in ["sent", "demo"] else None
        )
        
        db.add(email_log)
        
        # Update contact
        contact.contacted_at = datetime.utcnow()
        contact.last_email_sent_at = datetime.utcnow()
        if contact.status == "new":
            contact.status = "contacted"
        
        results.append({
            "contact_id": contact.id,
            "recipient": contact.email,
            "status": result["status"]
        })
    
    db.commit()
    
    return {
        "status": "success",
        "message": f"Batch email sent to {len(contacts)} contacts",
        "results": results,
        "total_sent": len([r for r in results if r["status"] in ["sent", "demo"]])
    }

@router.get("/email-logs/")
async def get_email_logs(
    contact_id: Optional[int] = None,
    current_user_id: int = Depends(security_service.get_user_from_token),
    db: Session = Depends(get_db)
):
    """Get email logs for the user"""
    query = db.query(EmailLog).filter(EmailLog.user_id == current_user_id)
    
    if contact_id:
        query = query.filter(EmailLog.hr_contact_id == contact_id)
    
    logs = query.order_by(EmailLog.created_at.desc()).all()
    
    return {
        "logs": logs,
        "total": len(logs)
    }

# ============ FUTURE ENDPOINTS (SEGMENT I) ============
# The following endpoints are for future implementation:
# - POST /{contact_id}/contact-request - Advanced outreach messaging
# - GET /contact-history - Complete contact engagement history
# - POST /auto-scrape-contacts - LinkedIn/Company website scraping
# These are intentionally not implemented in Segment H to keep scope manageable
