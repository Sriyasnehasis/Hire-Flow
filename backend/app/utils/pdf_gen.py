from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib import colors
import io
import json

def generate_pdf_resume(resume) -> bytes:
    """Generate PDF resume using reportlab with multiple visual styles."""
    buffer = io.BytesIO()
    
    # Configure margins based on template style
    template = (resume.template_id or "professional").lower()
    
    if template == "minimal":
        doc = SimpleDocTemplate(buffer, pagesize=letter, leftMargin=36, rightMargin=36, topMargin=36, bottomMargin=36)
    else:
        doc = SimpleDocTemplate(buffer, pagesize=letter, leftMargin=54, rightMargin=54, topMargin=54, bottomMargin=54)
        
    styles = getSampleStyleSheet()
    
    # Choose colors and alignments based on template
    primary_color = "#1e3a8a"  # default blue
    secondary_color = "#4b5563"
    title_align = TA_CENTER
    has_border = True
    title_size = 24
    
    if template == "modern":
        primary_color = "#00838f"  # teal/cyan
        secondary_color = "#1e293b"
        title_align = 0  # Left aligned
        has_border = True
        title_size = 26
    elif template == "creative":
        primary_color = "#7c3aed"  # purple
        secondary_color = "#1f2937"
        title_align = 0  # Left aligned
        has_border = True
        title_size = 28
    elif template == "minimal":
        primary_color = "#000000"  # black
        secondary_color = "#374151"
        title_align = 0  # Left aligned
        has_border = False
        title_size = 20
    elif template == "professional":
        primary_color = "#1e3a8a"  # deep navy blue
        secondary_color = "#4b5563"
        title_align = TA_CENTER
        has_border = True
        title_size = 24
        
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontSize=title_size,
        textColor=colors.HexColor(primary_color),
        alignment=title_align,
        spaceAfter=12
    )
    
    section_style = ParagraphStyle(
        'SectionStyle',
        parent=styles['Heading2'],
        fontSize=12,
        textColor=colors.HexColor(primary_color),
        spaceBefore=10,
        spaceAfter=4,
        borderPadding=(0, 0, 2, 0) if has_border else (0, 0, 0, 0),
        borderWidth=1 if has_border else 0,
        borderColor=colors.HexColor('#e5e7eb'),
        borderStyle='solid' if has_border else None
    )
    
    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor(secondary_color),
        leading=14,
        spaceAfter=6
    )
    
    story = []
    
    # Title/Name
    display_title = resume.title or "Professional Resume"
    story.append(Paragraph(display_title.replace("_Resume", "").replace("AI_Synthesized_", ""), title_style))
    story.append(Spacer(1, 8))
    
    # Summary
    if resume.summary:
        story.append(Paragraph("PROFESSIONAL SUMMARY", section_style))
        story.append(Paragraph(resume.summary, body_style))
        story.append(Spacer(1, 4))
    
    # Skills
    skills = json.loads(resume.parsed_skills or '[]')
    if skills:
        story.append(Paragraph("TECHNICAL SKILLS", section_style))
        story.append(Paragraph(", ".join(skills), body_style))
        story.append(Spacer(1, 4))
    
    # Experience
    experience = json.loads(resume.parsed_experience or '[]')
    if experience:
        story.append(Paragraph("WORK EXPERIENCE", section_style))
        for exp in experience:
            company = exp.get('company', 'Company')
            position = exp.get('position', 'Position')
            dates = f"{exp.get('start_date', '')} - {exp.get('end_date', 'Present')}"
            
            story.append(Paragraph(f"<b>{position}</b> &mdash; {company} ({dates})", body_style))
            if exp.get('description'):
                story.append(Paragraph(exp.get('description'), body_style))
            story.append(Spacer(1, 4))
            
    # Projects
    projects = json.loads(resume.parsed_projects or '[]')
    if projects:
        story.append(Paragraph("PROJECTS", section_style))
        for proj in projects:
            title = proj.get('title', 'Project')
            desc = proj.get('description', '')
            tech = ", ".join(proj.get('technologies', []))
            link = proj.get('link', '')
            
            project_header = f"<b>{title}</b>"
            if tech:
                project_header += f" (<i>{tech}</i>)"
            if link:
                project_header += f" &mdash; <a href='{link}'><u>Link</u></a>"
                
            story.append(Paragraph(project_header, body_style))
            if desc:
                story.append(Paragraph(desc, body_style))
            story.append(Spacer(1, 4))

    # Education
    education = json.loads(resume.parsed_education or '[]')
    if education:
        story.append(Paragraph("EDUCATION", section_style))
        for edu in education:
            degree = edu.get('degree', 'Degree')
            school = edu.get('school', 'School')
            dates = f"{edu.get('start_date', '')} - {edu.get('end_date', '')}"
            story.append(Paragraph(f"<b>{degree}</b> from {school} ({dates})", body_style))
            story.append(Spacer(1, 4))
            
    # Build PDF
    doc.build(story)
    return buffer.getvalue()
