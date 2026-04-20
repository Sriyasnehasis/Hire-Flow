"""
Resume parsing service - extracts text and data from PDF/DOCX files
"""
import io
import json
import re
from typing import Dict, List, Any
import pdfplumber
from docx import Document

class ResumeParsing:
    """Service to parse resume files and extract information"""
    
    @staticmethod
    async def parse_pdf(file_path: str) -> Dict[str, Any]:
        """
        Parse PDF resume and extract text using pdfplumber
        """
        try:
            full_text = ""
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        full_text += text + "\n"
            
            # Extract structured data from the text
            structured_data = ResumeParsing.extract_structured_data(full_text)
            structured_data["full_text"] = full_text
            
            return structured_data
        except Exception as e:
            print(f"Error parsing PDF: {e}")
            return {
                "full_text": "",
                "name": "",
                "email": "",
                "phone": "",
                "skills": [],
                "experience": [],
                "education": []
            }
    
    @staticmethod
    async def parse_docx(file_path: str) -> Dict[str, Any]:
        """
        Parse DOCX resume and extract text using python-docx
        """
        try:
            doc = Document(file_path)
            full_text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            
            # Extract structured data from the text
            structured_data = ResumeParsing.extract_structured_data(full_text)
            structured_data["full_text"] = full_text
            
            return structured_data
        except Exception as e:
            print(f"Error parsing DOCX: {e}")
            return {
                "full_text": "",
                "name": "",
                "email": "",
                "phone": "",
                "skills": [],
                "experience": [],
                "education": []
            }
    
    @staticmethod
    def extract_structured_data(text: str) -> Dict[str, Any]:
        """
        Extract structured information from resume text using regex patterns
        Extracts:
        - Name, email, phone
        - Skills
        - Work experience
        - Education
        - Certifications
        - Projects
        """
        # Extract email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_match = re.search(email_pattern, text)
        email = email_match.group(0) if email_match else ""
        
        # Extract phone number (various formats)
        phone_pattern = r'(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}'
        phone_match = re.search(phone_pattern, text)
        phone = phone_match.group(0) if phone_match else ""
        
        # Extract name (typically at the beginning, before contact info)
        lines = text.strip().split('\n')
        name = ""
        for line in lines[:5]:  # Check first 5 lines
            line = line.strip()
            if line and len(line) < 50 and '@' not in line and not re.match(r'^\d', line):
                name = line
                break
        
        # Extract skills (common tech skills pattern)
        skills_keywords = [
            'python', 'java', 'javascript', 'typescript', 'react', 'angular', 'vue',
            'node.js', 'nodejs', 'express', 'fastapi', 'django', 'flask',
            'sql', 'postgresql', 'mysql', 'mongodb', 'redis',
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins',
            'git', 'linux', 'bash', 'shell',
            'machine learning', 'tensorflow', 'pytorch', 'data science',
            'html', 'css', 'sass', 'tailwind', 'bootstrap',
            'rest api', 'graphql', 'microservices', 'agile', 'scrum'
        ]
        skills = []
        text_lower = text.lower()
        for skill in skills_keywords:
            if skill in text_lower:
                skills.append(skill.title())
        
        # Extract education
        education = []
        edu_patterns = [
            r'(Bachelor[\'s]?(?:\s+of)?\s+(?:Science|Arts|Engineering|Technology)[^\n]*)',
            r'(Master[\'s]?(?:\s+of)?\s+(?:Science|Arts|Engineering|Technology|Business)[^\n]*)',
            r'(B\.?Tech[^\n]*)',
            r'(M\.?Tech[^\n]*)',
            r'(B\.?E[^\n]*)',
            r'(M\.?E[^\n]*)',
            r'(B\.?Sc[^\n]*)',
            r'(M\.?Sc[^\n]*)',
            r'(Ph\.?D[^\n]*)',
            r'(MBA[^\n]*)',
        ]
        for pattern in edu_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                education.append({"description": match.strip()})
        
        # Extract work experience (look for company names, roles, durations)
        experience = []
        exp_pattern = r'((?:Senior\s+|Junior\s+|Lead\s+)?(?:Developer|Engineer|Manager|Analyst|Designer|Architect|Consultant)[^\n]*(?:\n[^\n]*){0,3})'
        exp_matches = re.findall(exp_pattern, text, re.IGNORECASE)
        for exp in exp_matches[:5]:  # Limit to 5 experiences
            experience.append({"description": exp.strip()})
        
        # Extract certifications
        certifications = []
        cert_patterns = [
            r'(AWS Certified[^\n]*)',
            r'(Google Cloud Certified[^\n]*)',
            r'(Microsoft Certified[^\n]*)',
            r'(Certified Kubernetes[^\n]*)',
            r'(PMP[^\n]*)',
            r'(Scrum Master[^\n]*)',
        ]
        for pattern in cert_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                certifications.append({"name": match.strip()})
        
        # Extract projects
        projects = []
        project_keywords = ['project', 'built', 'developed', 'created', 'implemented']
        lines = text.split('\n')
        current_project = None
        for line in lines:
            line = line.strip()
            if any(keyword in line.lower() for keyword in project_keywords) and len(line) > 20:
                if current_project:
                    projects.append({"description": current_project})
                current_project = line
            elif current_project and line:
                current_project += " " + line
        
        if current_project:
            projects.append({"description": current_project})
        
        return {
            "name": name,
            "email": email,
            "phone": phone,
            "skills": list(set(skills)),  # Remove duplicates
            "experience": experience,
            "education": education,
            "certifications": certifications,
            "projects": projects[:5]  # Limit to 5 projects
        }

resume_parser = ResumeParsing()
