"""
LinkedIn Job Scraper Service
Extracts: Job details, HR contacts, company info, salary ranges
Used by Chrome Extension for 1-click job capture
"""

from typing import Dict, List, Optional
import re
from datetime import datetime

class LinkedInScraper:
    """Service for extracting LinkedIn job data"""
    
    def __init__(self):
        self.email_pattern = r'([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})'
        self.phone_pattern = r'(?:\+?1)?[\s.-]?\(?([0-9]{3})\)?[\s.-]?([0-9]{3})[\s.-]?([0-9]{4})'
    
    def extract_job_details(self, job_title: str, company: str, 
                           location: str, description: str) -> Dict:
        """
        Extract structured job information from LinkedIn data
        
        Args:
            job_title: Job title from LinkedIn
            company: Company name
            location: Job location
            description: Full job description
            
        Returns:
            Dict with extracted fields
        """
        
        # Extract salary if mentioned in description
        salary_range = self._extract_salary(description)
        
        # Extract required skills from description
        required_skills = self._extract_required_skills(description)
        
        # Extract seniority level
        seniority = self._extract_seniority_level(job_title, description)
        
        # Extract employment type
        employment_type = self._extract_employment_type(description)
        
        # Extract company size if mentioned
        company_size = self._extract_company_size(description)
        
        return {
            "title": job_title,
            "company": company,
            "location": location,
            "description": description,
            "salary_range": salary_range,
            "required_skills": required_skills,
            "seniority_level": seniority,
            "employment_type": employment_type,
            "company_size": company_size,
            "scraped_at": datetime.utcnow().isoformat(),
            "source": "linkedin"
        }
    
    def extract_hr_contacts(self, company: str, description: str) -> List[Dict]:
        """
        Extract HR contacts from job description and company info
        
        Args:
            company: Company name
            description: Job description that may contain contact info
            
        Returns:
            List of HR contact dicts with email/phone
        """
        contacts = []
        
        # Extract all emails
        emails = re.findall(self.email_pattern, description, re.IGNORECASE)
        unique_emails = list(set(emails))  # Remove duplicates
        
        # Extract phone numbers
        phones = re.findall(self.phone_pattern, description)
        
        hr_contact_titles = ['hr', 'recruiter', 'hiring', 'talent', 'people', 'human resources']
        
        # Create contact objects
        for email in unique_emails[:5]:  # Max 5 emails per job
            # Check if it looks like an HR email
            is_hr_likely = any(hr_term in email.lower() for hr_term in hr_contact_titles)
            
            contacts.append({
                "company": company,
                "email": email,
                "phone": None,
                "contact_type": "hr" if is_hr_likely else "general",
                "source": "job_description",
                "confidence": 0.8 if is_hr_likely else 0.5
            })
        
        return contacts
    
    def _extract_salary(self, description: str) -> Optional[Dict]:
        """Extract salary range if mentioned"""
        # Pattern: $XXk - $XXk or $XX,000 - $XX,000
        salary_pattern = r'\$[\d,]+[kK]?\s*-\s*\$[\d,]+'
        matches = re.findall(salary_pattern, description)
        
        if matches:
            return {
                "range": matches[0],
                "found": True
            }
        
        return {
            "range": "Not specified",
            "found": False
        }
    
    def _extract_required_skills(self, description: str) -> List[str]:
        """Extract technical skills from description"""
        # Common tech keywords
        tech_keywords = [
            # Languages
            'python', 'javascript', 'typescript', 'java', 'c#', 'c++', 'go', 'rust',
            'ruby', 'php', 'swift', 'kotlin', 'scala', 'r',
            
            # Frontend
            'react', 'vue', 'angular', 'next.js', 'svelte', 'html', 'css', 'tailwind',
            'bootstrap', 'material-ui', 'redux', 'vuex',
            
            # Backend
            'fastapi', 'django', 'flask', 'spring', 'express', 'nestjs', 'rails',
            'laravel', 'asp.net', 'node.js', 'nodejs',
            
            # Databases
            'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'cassandra',
            'dynamodb', 'firestore', 'oracle', 'sql server',
            
            # Cloud & DevOps
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab',
            'circleci', 'terraform', 'ansible', 'cloudformation',
            
            # Data & AI
            'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn',
            'pandas', 'numpy', 'sql', 'spark', 'hadoop', 'nlp', 'cv', 'computer vision',
            
            # Mobile
            'react native', 'flutter', 'ios', 'android', 'swift',
            
            # Other
            'git', 'rest', 'graphql', 'api', 'ci/cd', 'agile', 'scrum', 'aws',
            'microservices', 'design patterns', 'testing', 'junit', 'pytest'
        ]
        
        description_lower = description.lower()
        found_skills = []
        
        for skill in tech_keywords:
            if skill in description_lower:
                found_skills.append(skill)
        
        return found_skills
    
    def _extract_seniority_level(self, job_title: str, description: str) -> str:
        """Determine seniority level: Entry, Mid, Senior, Lead"""
        combined_text = (job_title + " " + description).lower()
        
        if any(word in combined_text for word in ['lead', 'principal', 'staff', 'architect']):
            return "Lead/Principal"
        elif any(word in combined_text for word in ['senior', 'sr.']):
            return "Senior"
        elif any(word in combined_text for word in ['mid', 'intermediate', 'junior', 'jr.']):
            return "Mid-Level"
        else:
            return "Entry-Level"
    
    def _extract_employment_type(self, description: str) -> str:
        """Extract employment type: Full-time, Contract, etc"""
        description_lower = description.lower()
        
        if 'full-time' in description_lower or 'full time' in description_lower:
            return "Full-time"
        elif 'contract' in description_lower:
            return "Contract"
        elif 'part-time' in description_lower or 'part time' in description_lower:
            return "Part-time"
        elif 'temp' in description_lower:
            return "Temporary"
        
        return "Not specified"
    
    def _extract_company_size(self, description: str) -> str:
        """Extract company size if mentioned"""
        description_lower = description.lower()
        
        if any(word in description_lower for word in ['startup', '1-50 employees', '51-200 employees']):
            return "Startup"
        elif any(word in description_lower for word in ['200-500', '500-1000']):
            return "Small (200-1000)"
        elif any(word in description_lower for word in ['1000-5000', '5000-10000']):
            return "Medium (1000-10000)"
        elif any(word in description_lower for word in ['10000+', 'fortune 500']):
            return "Enterprise"
        
        return "Unknown"
    
    def calculate_job_match_score(self, user_skills: List[str], 
                                 required_skills: List[str]) -> int:
        """
        Calculate match percentage between user skills and job requirements
        
        Args:
            user_skills: List of skills user has
            required_skills: List of skills job requires
            
        Returns:
            Match percentage (0-100)
        """
        if not required_skills:
            return 0
        
        user_skills_lower = [skill.lower() for skill in user_skills]
        required_lower = [skill.lower() for skill in required_skills]
        
        matches = sum(1 for req in required_lower if any(user_skill in req or req in user_skill 
                      for user_skill in user_skills_lower))
        
        match_percentage = int((matches / len(required_skills)) * 100)
        return min(100, match_percentage)


# Global instance
linkedin_scraper = LinkedInScraper()
