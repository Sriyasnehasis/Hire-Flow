"""
ATS Analyzer - Enhanced skill gap analysis and ATS scoring
"""
from typing import List, Dict, Any
import json
import re

class ATSAnalyzer:
    """Service to analyze resumes for ATS compatibility and skill gaps"""
    
    # Skill categories for comprehensive analysis
    SKILL_CATEGORIES = {
        "Frontend": ["react", "javascript", "js", "next.js", "nextjs", "html", "css", "tailwind", "typescript", "ts", "vue", "angular", "svelte"],
        "Backend": ["fastapi", "python", "docker", "node", "nodejs", "django", "flask", "golang", "rust", "java", "spring", "express"],
        "Database": ["postgresql", "postgres", "mongodb", "mongo", "sql", "redis", "firebase", "mysql", "nosql", "elasticsearch"],
        "Cloud": ["aws", "docker", "kubernetes", "k8s", "azure", "gcp", "terraform", "devops", "ci/cd"],
        "AI_ML": ["machine learning", "ml", "ai", "pytorch", "tensorflow", "nlp", "scikit-learn", "pandas", "numpy", "openai"],
        "DevOps": ["docker", "kubernetes", "jenkins", "gitlab", "github", "ansible", "terraform", "aws", "ci/cd"],
        "Mobile": ["react native", "flutter", "swift", "kotlin", "ios", "android"],
    }
    
    @staticmethod
    def analyze_resume(
        resume_text: str,
        job_description: str = None
    ) -> Dict[str, Any]:
        """
        Comprehensive resume analysis with skill gaps
        """
        if not resume_text:
            return {"ats_score": 0, "feedback": [], "keywords_found": [], "keywords_missing": [], "formatting_issues": [], "suggestions": []}
        
        # Normalize text
        resume_lower = resume_text.lower()
        job_lower = job_description.lower() if job_description else ""
        
        # Extract skills from resume
        resume_skills = ATSAnalyzer._extract_skills(resume_lower)
        
        # If we have job description, compare
        if job_description:
            job_skills = ATSAnalyzer._extract_skills(job_lower)
            matched = [s for s in job_skills if s in resume_skills]
            missing = [s for s in job_skills if s not in resume_skills]
            match_score = int((len(matched) / len(job_skills) * 100)) if job_skills else 0
        else:
            matched = []
            missing = []
            match_score = 50
        
        # Check formatting compliance
        formatting_issues = ATSAnalyzer.check_formatting_compliance(resume_text)
        
        # Generate suggestions
        suggestions = ATSAnalyzer.generate_ats_improvement_suggestions(missing, match_score)
        
        return {
            "ats_score": match_score,
            "feedback": [f"Found {len(matched)} matching skills"] if matched else ["No skill matches found"],
            "keywords_found": matched,
            "keywords_missing": missing,
            "formatting_issues": formatting_issues["issues"],
            "suggestions": suggestions
        }
    
    @staticmethod
    def extract_keywords_from_job(job_description: str) -> List[str]:
        """Extract important keywords from job description"""
        if not job_description:
            return []
        
        keywords = []
        job_lower = job_description.lower()
        
        # Extract all skills mentioned
        for category, skills in ATSAnalyzer.SKILL_CATEGORIES.items():
            for skill in skills:
                if skill in job_lower:
                    keywords.append(skill)
        
        # Extract educational requirements
        edu_keywords = ["bachelor", "master", "phd", "degree", "certification"]
        for edu in edu_keywords:
            if edu in job_lower:
                keywords.append(edu)
        
        return list(set(keywords))  # Remove duplicates
    
    @staticmethod
    def check_formatting_compliance(resume_text: str) -> Dict[str, Any]:
        """
        Check if resume meets ATS formatting requirements
        """
        issues = []
        compliance_score = 100
        
        # Check for proper sections
        required_sections = ["education", "experience", "about", "skills"]
        for section in required_sections:
            if section not in resume_text.lower():
                issues.append(f"Missing '{section}' section")
                compliance_score -= 10
        
        # Check for problematic characters
        if any(char in resume_text for char in ["📌", "🎯", "✨"]):
            issues.append("Remove emoji - ATS systems may not parse them")
            compliance_score -= 5
        
        # Check length
        if len(resume_text.strip()) < 300:
            issues.append("Resume seems too short - add more details")
            compliance_score -= 10
        elif len(resume_text.strip()) > 5000:
            issues.append("Resume seems too long - try to condense")
            compliance_score -= 5
        
        return {
            "is_ats_compliant": compliance_score >= 80,
            "issues": issues,
            "compliance_score": max(0, compliance_score)
        }
    
    @staticmethod
    def calculate_keyword_match(
        resume_text: str,
        job_description: str
    ) -> Dict[str, Any]:
        """Calculate keyword match percentage between resume and job"""
        if not resume_text or not job_description:
            return {"match_percentage": 0, "matched_keywords": [], "missing_keywords": []}
        
        resume_lower = resume_text.lower()
        job_lower = job_description.lower()
        
        # Extract skills from job
        job_skills = ATSAnalyzer._extract_skills(job_lower)
        
        # Check which are in resume
        matched = [skill for skill in job_skills if skill in resume_lower]
        missing = [skill for skill in job_skills if skill not in resume_lower]
        
        match_percentage = int((len(matched) / len(job_skills) * 100)) if job_skills else 0
        
        return {
            "match_percentage": match_percentage,
            "matched_keywords": matched,
            "missing_keywords": missing,
            "total_required_skills": len(job_skills),
            "matched_count": len(matched)
        }
    
    @staticmethod
    def calculate_skill_gaps(
        resume_text: str,
        job_description: str
    ) -> Dict[str, Any]:
        """
        Calculate detailed skill gaps per category
        """
        resume_lower = resume_text.lower()
        job_lower = job_description.lower()
        
        gaps = {}
        
        for category, skills in ATSAnalyzer.SKILL_CATEGORIES.items():
            resume_skills_in_cat = [s for s in skills if s in resume_lower]
            job_skills_in_cat = [s for s in skills if s in job_lower]
            
            missing_in_cat = [s for s in job_skills_in_cat if s not in resume_lower]
            
            gap_percentage = 0
            if job_skills_in_cat:
                gap_percentage = int((len(missing_in_cat) / len(job_skills_in_cat)) * 100)
            
            gaps[category] = {
                "job_requires": job_skills_in_cat,
                "you_have": resume_skills_in_cat,
                "you_need": missing_in_cat,
                "gap_percentage": gap_percentage,
                "match_percentage": 100 - gap_percentage if job_skills_in_cat else 0
            }
        
        return {
            "category_gaps": gaps,
            "priority_skills": ATSAnalyzer._identify_priority_skills(gaps),
            "ats_score": ATSAnalyzer._calculate_overall_score(gaps)
        }
    
    @staticmethod
    def generate_ats_improvement_suggestions(
        missing_keywords: List[str] = None,
        match_score: int = 0
    ) -> List[str]:
        """Generate specific suggestions to improve ATS score"""
        suggestions = []
        
        if match_score < 50:
            suggestions.append("⚠️ Major skill gap detected. Consider adding key required skills.")
        elif match_score < 75:
            suggestions.append("Your skills are moderately aligned. Add missing technologies to improve match.")
        
        if missing_keywords:
            if len(missing_keywords) > 0:
                suggestions.append(f"Priority: Add '{missing_keywords[0]}' to your resume")
            if len(missing_keywords) > 1:
                suggestions.append(f"Also mention: '{missing_keywords[1]}' if you have experience")
        
        suggestions.append("✅ Use keywords from job description in your resume")
        suggestions.append("✅ Replace bullet points with specific metric results")
        
        return suggestions
    
    @staticmethod
    def generate_learning_path(missing_skills: List[str]) -> Dict[str, Any]:
        """
        Generate learning resources and timeline for missing skills
        """
        resources = {}
        
        skill_resources = {
            "react": {"platform": "freeCodeCamp", "hours": 15, "url": "https://www.freecodecamp.org/learn/front-end-development-libraries/react/"},
            "python": {"platform": "Codecademy", "hours": 10, "url": "https://www.codecademy.com/learn/learn-python-3"},
            "docker": {"platform": "DigitalOcean", "hours": 8, "url": "https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04"},
            "fastapi": {"platform": "FastAPI Docs", "hours": 12, "url": "https://fastapi.tiangolo.com/"},
            "mongodb": {"platform": "MongoDB University", "hours": 6, "url": "https://university.mongodb.com/"},
            "postgresql": {"platform": "PostgreSQL Docs", "hours": 8, "url": "https://www.postgresql.org/docs/"},
            "kubernetes": {"platform": "Linux Foundation", "hours": 20, "url": "https://www.linux.com/training/"},
        }
        
        total_hours = 0
        for skill in missing_skills[:5]:  # Top 5 missing skills
            skill_lower = skill.lower()
            if skill_lower in skill_resources:
                resources[skill] = skill_resources[skill_lower]
                total_hours += skill_resources[skill_lower]["hours"]
        
        # Estimate weeks (assuming 10 hours/week learning)
        estimated_weeks = max(1, total_hours // 10)
        
        return {
            "resources": resources,
            "total_hours": total_hours,
            "estimated_weeks": estimated_weeks,
            "recommendation": f"You can learn these skills in ~{estimated_weeks} weeks with consistent effort"
        }
    
    @staticmethod
    def _extract_skills(text: str) -> List[str]:
        """Helper to extract all skills from text"""
        skills = []
        text_lower = text.lower()
        
        for category, skill_list in ATSAnalyzer.SKILL_CATEGORIES.items():
            for skill in skill_list:
                if skill in text_lower:
                    skills.append(skill)
        
        return list(set(skills))  # Remove duplicates
    
    @staticmethod
    def _identify_priority_skills(gaps: Dict) -> List[str]:
        """Identify which skills to prioritize learning"""
        priority = []
        
        for category, gap_info in gaps.items():
            if gap_info["gap_percentage"] > 50 and gap_info["you_need"]:
                # High gap in this category
                priority.extend(gap_info["you_need"][:2])  # Top 2 skills per category
        
        return priority[:5]  # Return top 5 priorities
    
    @staticmethod
    def _calculate_overall_score(gaps: Dict) -> int:
        """Calculate overall ATS score from category gaps"""
        if not gaps:
            return 0
        
        total_match = sum(gap_info["match_percentage"] for gap_info in gaps.values())
        return int(total_match / len(gaps))


# Singleton instance
ats_analyzer = ATSAnalyzer()
