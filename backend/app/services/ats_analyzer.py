"""
ATS Analyzer - for analyzing resume ATS scores and providing feedback
"""
from typing import List, Dict, Any
import json
import re

class ATSAnalyzer:
    """Service to analyze resumes for ATS compatibility"""
    
    @staticmethod
    def analyze_resume(
        resume_text: str,
        job_description: str = None
    ) -> Dict[str, Any]:
        """
        Analyze resume for ATS score and provide feedback
        Uses keyword matching, formatting checks, and structure analysis
        """
        # Check formatting compliance
        formatting_result = ATSAnalyzer.check_formatting_compliance(resume_text)
        
        # If job description provided, calculate keyword match
        keyword_result = {}
        if job_description:
            keyword_result = ATSAnalyzer.calculate_keyword_match(resume_text, job_description)
            keywords_found = keyword_result.get("matched_keywords", [])
            keywords_missing = keyword_result.get("missing_keywords", [])
            match_percentage = keyword_result.get("match_percentage", 0)
        else:
            # General keyword analysis without specific job description
            keywords_found = ATSAnalyzer.extract_common_keywords(resume_text)
            keywords_missing = []
            match_percentage = min(100, len(keywords_found) * 5)  # Base score on keywords found
        
        # Calculate overall ATS score
        ats_score = ATSAnalyzer.calculate_ats_score(
            resume_text=resume_text,
            formatting_result=formatting_result,
            match_percentage=match_percentage,
            keywords_count=len(keywords_found)
        )
        
        # Generate feedback and suggestions
        feedback = []
        suggestions = ATSAnalyzer.generate_ats_improvement_suggestions(resume_text, ats_score)
        
        if not formatting_result.get("is_ats_compliant", False):
            for issue in formatting_result.get("issues", []):
                feedback.append(f"Formatting Issue: {issue}")
        
        if match_percentage < 50:
            feedback.append("Low keyword match - consider adding more relevant skills")
        
        if len(keywords_found) < 5:
            feedback.append("Too few technical keywords detected")
        
        return {
            "ats_score": ats_score,  # 0-100
            "feedback": feedback,
            "keywords_found": keywords_found,
            "keywords_missing": keywords_missing,
            "formatting_issues": formatting_result.get("issues", []),
            "suggestions": suggestions
        }
    
    @staticmethod
    def extract_keywords_from_job(job_description: str) -> List[str]:
        """
        Extract important keywords from job description
        Identifies technical skills, tools, and qualifications
        """
        keywords = []
        
        # Common technical skills pattern
        tech_skills = [
            'python', 'java', 'javascript', 'typescript', 'react', 'angular', 'vue',
            'node.js', 'nodejs', 'express', 'fastapi', 'django', 'flask',
            'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'ci/cd',
            'git', 'linux', 'bash', 'shell', 'terraform', 'ansible',
            'machine learning', 'tensorflow', 'pytorch', 'data science', 'ai',
            'html', 'css', 'sass', 'tailwind', 'bootstrap',
            'rest api', 'graphql', 'microservices', 'agile', 'scrum',
            'spring boot', '.net', 'c++', 'golang', 'rust',
            'spark', 'hadoop', 'kafka', 'rabbitmq',
            'flutter', 'react native', 'ios', 'android'
        ]
        
        job_lower = job_description.lower()
        for skill in tech_skills:
            if skill in job_lower:
                keywords.append(skill.title())
        
        # Extract education requirements
        edu_patterns = [
            r'bachelor[\'s]?\s+(?:degree\s+)?(?:in\s+)?(\w+)',
            r'master[\'s]?\s+(?:degree\s+)?(?:in\s+)?(\w+)',
            r'ph\.?d\.?\s+(?:in\s+)?(\w+)',
            r'bsc|b\.sc|mca|bca|b\.tech|m\.tech'
        ]
        for pattern in edu_patterns:
            matches = re.findall(pattern, job_lower)
            keywords.extend([m.title() for m in matches])
        
        # Extract experience level
        exp_patterns = [
            r'(\d+)\+?\s*years?\s*(?:of\s*)?(?:experience|exp)',
            r'(senior|junior|lead|principal|staff)\s+(\w+)',
            r'(fresher|entry[-\s]?level|mid[-\s]?level)'
        ]
        for pattern in exp_patterns:
            matches = re.findall(pattern, job_lower)
            if matches:
                for match in matches:
                    if isinstance(match, tuple):
                        keywords.extend([m.title() for m in match if m])
                    else:
                        keywords.append(match.title())
        
        return list(set(keywords))
    
    @staticmethod
    def check_formatting_compliance(resume_text: str) -> Dict[str, Any]:
        """
        Check if resume meets ATS formatting requirements
        Checks for:
        - Proper headers/sections
        - No tables or images (inferred from text patterns)
        - Standard fonts (cannot check directly, but can infer from special chars)
        - Proper spacing and structure
        """
        issues = []
        suggestions = []
        
        # Check for standard section headers
        standard_headers = [
            'education', 'experience', 'work', 'skills', 'projects',
            'certification', 'summary', 'objective', 'contact'
        ]
        
        text_lower = resume_text.lower()
        headers_found = [header for header in standard_headers if header in text_lower]
        
        if len(headers_found) < 3:
            issues.append("Missing standard section headers (Education, Experience, Skills)")
            suggestions.append("Add clear section headers like 'Work Experience', 'Education', 'Skills'")
        
        # Check for contact information
        has_email = bool(re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', resume_text))
        has_phone = bool(re.search(r'(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}', resume_text))
        
        if not has_email:
            issues.append("Email address not found")
            suggestions.append("Add your email address in the contact section")
        
        if not has_phone:
            issues.append("Phone number not found")
            suggestions.append("Add your phone number")
        
        # Check for excessive special characters (might indicate bad formatting)
        special_char_ratio = len(re.findall(r'[^\w\s.,@-]', resume_text)) / max(len(resume_text), 1)
        if special_char_ratio > 0.1:
            issues.append("Excessive special characters detected - may cause parsing issues")
            suggestions.append("Remove unnecessary symbols and special characters")
        
        # Check length
        word_count = len(resume_text.split())
        if word_count < 200:
            issues.append("Resume appears too short")
            suggestions.append("Add more details about your experience and skills")
        elif word_count > 2000:
            issues.append("Resume appears too long")
            suggestions.append("Keep resume concise (1-2 pages recommended)")
        
        is_compliant = len(issues) == 0
        
        return {
            "is_ats_compliant": is_compliant,
            "issues": issues,
            "suggestions": suggestions
        }
    
    @staticmethod
    def calculate_keyword_match(
        resume_text: str,
        job_description: str
    ) -> Dict[str, Any]:
        """
        Calculate keyword match percentage between resume and job description
        """
        # Extract keywords from job description
        job_keywords = set(ATSAnalyzer.extract_keywords_from_job(job_description))
        
        if not job_keywords:
            return {
                "match_percentage": 0,
                "matched_keywords": [],
                "missing_keywords": []
            }
        
        # Check which keywords are present in resume
        resume_lower = resume_text.lower()
        matched_keywords = []
        missing_keywords = []
        
        for keyword in job_keywords:
            if keyword.lower() in resume_lower:
                matched_keywords.append(keyword)
            else:
                missing_keywords.append(keyword)
        
        # Calculate match percentage
        match_percentage = int((len(matched_keywords) / len(job_keywords)) * 100) if job_keywords else 0
        
        return {
            "match_percentage": match_percentage,
            "matched_keywords": matched_keywords,
            "missing_keywords": missing_keywords
        }
    
    @staticmethod
    def generate_ats_improvement_suggestions(
        resume_text: str,
        ats_score: int
    ) -> List[str]:
        """
        Generate specific suggestions to improve ATS score
        """
        suggestions = []
        
        if ats_score < 40:
            suggestions.append("Significantly improve resume by adding relevant technical skills")
            suggestions.append("Use standard section headers (Experience, Education, Skills)")
            suggestions.append("Ensure contact information is clearly visible")
            suggestions.append("Quantify achievements with numbers and metrics")
        elif ats_score < 60:
            suggestions.append("Add more industry-specific keywords")
            suggestions.append("Include measurable accomplishments in experience section")
            suggestions.append("Consider adding a professional summary")
        elif ats_score < 80:
            suggestions.append("Fine-tune keywords based on specific job descriptions")
            suggestions.append("Add any missing certifications or relevant projects")
        else:
            suggestions.append("Resume looks good! Tailor keywords for each specific job application")
        
        # Check for action verbs
        action_verbs = ['developed', 'created', 'implemented', 'managed', 'led', 'designed', 'built']
        has_action_verbs = any(verb in resume_text.lower() for verb in action_verbs)
        if not has_action_verbs:
            suggestions.append("Use strong action verbs to describe your experience")
        
        # Check for numbers/metrics
        has_numbers = bool(re.search(r'\d+', resume_text))
        if not has_numbers:
            suggestions.append("Add quantifiable achievements (e.g., 'Improved performance by 30%')")
        
        return suggestions
    
    @staticmethod
    def extract_common_keywords(resume_text: str) -> List[str]:
        """Extract common technical keywords from resume"""
        keywords = []
        tech_skills = [
            'python', 'java', 'javascript', 'typescript', 'react', 'angular', 'vue',
            'node.js', 'nodejs', 'express', 'fastapi', 'django', 'flask',
            'sql', 'postgresql', 'mysql', 'mongodb', 'redis',
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins',
            'git', 'linux', 'bash', 'shell',
            'machine learning', 'tensorflow', 'pytorch', 'data science',
            'html', 'css', 'rest api', 'graphql', 'microservices', 'agile', 'scrum'
        ]
        
        resume_lower = resume_text.lower()
        for skill in tech_skills:
            if skill in resume_lower:
                keywords.append(skill.title())
        
        return keywords
    
    @staticmethod
    def calculate_ats_score(
        resume_text: str,
        formatting_result: Dict[str, Any],
        match_percentage: int,
        keywords_count: int
    ) -> int:
        """Calculate overall ATS score (0-100)"""
        score = 0
        
        # Formatting score (30 points)
        if formatting_result.get("is_ats_compliant", False):
            score += 30
        else:
            # Partial points based on issues
            issue_count = len(formatting_result.get("issues", []))
            score += max(0, 30 - (issue_count * 5))
        
        # Keyword match score (40 points)
        score += int((match_percentage / 100) * 40)
        
        # Keywords count score (20 points)
        score += min(20, keywords_count * 2)
        
        # Length bonus (10 points)
        word_count = len(resume_text.split())
        if 300 <= word_count <= 1000:
            score += 10
        elif 200 <= word_count <= 1500:
            score += 5
        
        return min(100, max(0, score))

ats_analyzer = ATSAnalyzer()
