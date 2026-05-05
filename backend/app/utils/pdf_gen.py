from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib import colors
import io
import json

def generate_pdf_resume(resume) -> bytes:
    """Generate PDF resume using reportlab"""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontSize=24,
        alignment=TA_CENTER,
        spaceAfter=12
    )
    
    section_style = ParagraphStyle(
        'SectionStyle',
        parent=styles['Heading2'],
        fontSize=14,
        color=colors.HexColor('#2563eb'),
        spaceBefore=12,
        spaceAfter=6,
        borderPadding=(0, 0, 2, 0),
        borderWidth=1,
        borderColor=colors.HexColor('#e5e7eb'),
        borderStyle='solid'
    )
    
    body_style = styles['Normal']
    
    story = []
    
    # Title/Name
    story.append(Paragraph(resume.title or "Resume", title_style))
    story.append(Spacer(1, 12))
    
    # Summary
    if resume.summary:
        story.append(Paragraph("PROFESSIONAL SUMMARY", section_style))
        story.append(Paragraph(resume.summary, body_style))
    
    # Skills
    skills = json.loads(resume.parsed_skills or '[]')
    if skills:
        story.append(Paragraph("SKILLS", section_style))
        story.append(Paragraph(", ".join(skills), body_style))
    
    # Experience
    experience = json.loads(resume.parsed_experience or '[]')
    if experience:
        story.append(Paragraph("EXPERIENCE", section_style))
        for exp in experience:
            company = exp.get('company', 'Company')
            position = exp.get('position', 'Position')
            dates = f"{exp.get('start_date', '')} - {exp.get('end_date', 'Present')}"
            
            story.append(Paragraph(f"<b>{position}</b> at {company}", body_style))
            story.append(Paragraph(f"<i>{dates}</i>", body_style))
            
            if exp.get('description'):
                story.append(Paragraph(exp.get('description'), body_style))
            story.append(Spacer(1, 6))
            
    # Education
    education = json.loads(resume.parsed_education or '[]')
    if education:
        story.append(Paragraph("EDUCATION", section_style))
        for edu in education:
            degree = edu.get('degree', 'Degree')
            school = edu.get('school', 'School')
            story.append(Paragraph(f"<b>{degree}</b>", body_style))
            story.append(Paragraph(school, body_style))
            story.append(Spacer(1, 4))
            
    # Build PDF
    doc.build(story)
    return buffer.getvalue()
