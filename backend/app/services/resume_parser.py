"""
Resume parsing service - extracts text and data from PDF/DOCX files
"""
import io
import json
import re
from typing import Dict, List, Any, Optional

try:
    import pdfplumber
except ImportError:
    pdfplumber = None

try:
    from docx import Document
except ImportError:
    Document = None


class ResumeParsing:
    """Service to parse resume files and extract information"""
    
    @staticmethod
    async def parse_pdf(file_content: bytes) -> str:
        """
        Parse PDF resume and extract raw text
        """
        if not pdfplumber:
            raise ImportError("pdfplumber not available. Install with: pip install pdfplumber")
        
        try:
            text = ""
            with pdfplumber.open(io.BytesIO(file_content)) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            raise ValueError(f"Failed to parse PDF: {str(e)}")
    
    @staticmethod
    async def parse_docx(file_content: bytes) -> str:
        """
        Parse DOCX resume and extract raw text
        """
        if not Document:
            raise ImportError("python-docx not available. Install with: pip install python-docx")
        
        try:
            text = ""
            doc = Document(io.BytesIO(file_content))
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text.strip()
        except Exception as e:
            raise ValueError(f"Failed to parse DOCX: {str(e)}")
    
    @staticmethod
    def extract_structured_data(text: str) -> Dict[str, Any]:
        """
        Extract structured information from resume text using regex patterns
        """
        parsed = {
            "education": [],
            "experience": [],
            "skills": [],
            "certifications": []
        }
        
        lines = text.split('\n')
        
        # Extract skills (look for common patterns like "Skills:", "Technical Skills:", etc.)
        skills_section = ResumeParsing._extract_section(text, ['skills', 'technical skills', 'competencies', 'expertise'])
        if skills_section:
            # Split by comma, semicolon, or newline and clean
            skill_items = re.split('[,;\n]', skills_section)
            parsed["skills"] = [s.strip() for s in skill_items if s.strip() and len(s.strip()) > 2]
        
        # Extract education (look for degree keywords)
        education_section = ResumeParsing._extract_section(text, ['education', 'academic', 'degree', 'qualification'])
        if education_section:
            # Extract degree names
            degree_pattern = r'(Bachelor|Master|PhD|B\.S\.|M\.S\.|B\.A\.|M\.A\.|MBA|B\.Tech|M\.Tech|BSc|MSc|BS|MS|BA|MA)[\s\w\s\.,&()]+'
            degrees = re.findall(degree_pattern, text, re.IGNORECASE)
            parsed["education"] = list(set(degrees)) if degrees else [education_section[:100]]
        
        # Extract certifications
        cert_section = ResumeParsing._extract_section(text, ['certification', 'certificates', 'certified'])
        if cert_section:
            cert_items = re.split('[,;\n]', cert_section)
            parsed["certifications"] = [c.strip() for c in cert_items if c.strip() and len(c.strip()) > 2]
        
        # Extract work experience (look for years/dates patterns)
        exp_section = ResumeParsing._extract_section(text, ['experience', 'work history', 'employment', 'professional'])
        if exp_section:
            # Extract company names and roles (simple heuristic)
            parsed["experience"] = ResumeParsing._extract_experience_entries(text)
        
        return parsed
    
    @staticmethod
    def _extract_section(text: str, keywords: List[str]) -> Optional[str]:
        """
        Extract a section of text based on keywords
        """
        text_lower = text.lower()
        for keyword in keywords:
            idx = text_lower.find(keyword)
            if idx != -1:
                # Get next 500 characters or until next major section
                section_start = idx + len(keyword)
                section_end = min(section_start + 800, len(text))
                
                # Stop at next section header (all caps line or line with colon)
                remaining = text[section_start:section_end]
                lines = remaining.split('\n')
                section_text = ""
                for line in lines:
                    if line.strip() and (line.isupper() or ':' in line) and section_text:
                        break
                    section_text += line + "\n"
                
                return section_text.strip()
        return None
    
    @staticmethod
    def _extract_experience_entries(text: str) -> List[str]:
        """
        Extract work experience entries (simple pattern matching)
        """
        # Look for job title patterns like "Software Engineer at Company" or "Senior Developer (2020-2023)"
        patterns = [
            r'(?:as\s+)?(?:a\s+)?(\w+(?:\s+\w+)*)\s+(?:at|with|for|in)\s+([^\n.,]+)',  # Role at Company
            r'(\w+(?:\s+\w+)*)\s+[-–]\s+([^\n.,]+)',  # Role - Company
        ]
        
        experience = []
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if len(str(match[0])) > 2 and len(str(match[1])) > 2:
                    exp = f"{match[0]} at {match[1]}"
                    if exp not in experience:
                        experience.append(exp)
        
        return experience[:5]  # Return top 5 entries


# Initialize instance
resume_parser = ResumeParsing()
