"""
AI Service — powered by Google Gemini API.

All AI features (ATS scoring, resume writing, cover letters, skill gap analysis)
route through gemini-flash-latest for fast, production-quality responses.
Falls back to rule-based logic if the API key is missing.
"""

import os
import re
import json
import logging

logger = logging.getLogger(__name__)

# ─── Gemini Setup ────────────────────────────────────────────────────────────
try:
    import google.generativeai as genai

    _api_key = os.getenv("GEMINI_API_KEY", "")
    if _api_key:
        genai.configure(api_key=_api_key)
        _gemini_model = genai.GenerativeModel("gemini-flash-latest")
        GEMINI_AVAILABLE = True
        logger.info("✅ Gemini API configured successfully")
    else:
        GEMINI_AVAILABLE = False
        logger.warning("⚠️  GEMINI_API_KEY not set — using rule-based fallback")
except ImportError:
    GEMINI_AVAILABLE = False
    logger.warning("⚠️  google-generativeai not installed — using rule-based fallback")


async def _call_gemini(prompt: str, expect_json: bool = True) -> dict | str:
    """Call Gemini and return parsed JSON or raw text."""
    import asyncio

    loop = asyncio.get_event_loop()
    response = await loop.run_in_executor(
        None,
        lambda: _gemini_model.generate_content(prompt),
    )
    text = response.text.strip()

    if not expect_json:
        return text

    # Strip markdown code fences if present
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        logger.error(f"Gemini returned non-JSON: {text[:200]}")
        return {}


# ─── ATS Scorer ──────────────────────────────────────────────────────────────

_SKILL_CATEGORIES = {
    "Frontend": ["react", "javascript", "js", "next.js", "nextjs", "html", "css", "tailwind", "typescript", "ts", "vue", "angular", "svelte"],
    "Backend": ["fastapi", "python", "docker", "node", "nodejs", "django", "flask", "golang", "rust", "java", "spring", "express"],
    "Database": ["postgresql", "postgres", "mongodb", "mongo", "sql", "redis", "firebase", "mysql", "nosql", "dynamodb", "sqlite"],
    "Cloud": ["aws", "docker", "kubernetes", "k8s", "azure", "gcp", "terraform", "devops", "ci/cd", "github actions", "jenkins"],
    "AI_ML": ["machine learning", "ml", "ai", "pytorch", "tensorflow", "nlp", "scikit-learn", "pandas", "numpy", "llm", "langchain"],
}


def _rule_based_ats(resume_text: str, job_description: str) -> dict:
    """Fallback ATS scorer when Gemini is unavailable."""
    resume_lower = resume_text.lower()
    jd_lower = job_description.lower()

    all_keywords = [s for skills in _SKILL_CATEGORIES.values() for s in skills]
    chart_data = {}
    for cat, skills in _SKILL_CATEGORIES.items():
        found = [s for s in skills if s in resume_lower]
        chart_data[cat] = int((len(set(found)) / len(skills)) * 100) if skills else 0

    required_in_jd = list(set([w for w in all_keywords if w in jd_lower]))
    matched_skills = [s for s in required_in_jd if s in resume_lower]
    missing_skills = [s for s in required_in_jd if s not in resume_lower]

    score_val = (len(matched_skills) / len(required_in_jd)) * 100 if required_in_jd else 70
    feedback = f"You match {len(matched_skills)} key skills. "
    if missing_skills:
        top_missing = missing_skills[:2]
        feedback += f"Add {' and '.join(top_missing)} to improve your chances."
    else:
        feedback += "Your profile is an excellent match for this role!"

    return {
        "score": int(score_val),
        "matched_skills": matched_skills[:15],
        "missing_skills": missing_skills[:10],
        "chart_data": chart_data,
        "feedback": feedback,
    }


async def get_ats_score(resume_text: str, job_description: str) -> dict:
    """Score resume against job description using Gemini AI."""
    if not GEMINI_AVAILABLE:
        return _rule_based_ats(resume_text or "", job_description or "")

    prompt = f"""You are an expert ATS (Applicant Tracking System) analyzer.

Analyze this resume against the job description and return a detailed compatibility report.

RESUME:
{resume_text[:3000]}

JOB DESCRIPTION:
{job_description[:2000]}

Return a JSON object with exactly these fields:
{{
  "score": <integer 0-100>,
  "matched_skills": ["skill1", "skill2", ...],
  "missing_skills": ["skill1", "skill2", ...],
  "chart_data": {{
    "Frontend": <0-100>,
    "Backend": <0-100>,
    "Database": <0-100>,
    "Cloud": <0-100>,
    "AI_ML": <0-100>
  }},
  "feedback": "<2-3 sentence actionable feedback>"
}}

Rules:
- Score must reflect true keyword + skill match density
- matched_skills: skills present in BOTH resume and job description (max 15)
- missing_skills: skills in job description NOT in resume (max 10)  
- chart_data: estimate category strength from resume content (0-100 each)
- feedback: specific, actionable improvement tips

Return ONLY valid JSON, no markdown."""

    try:
        result = await _call_gemini(prompt, expect_json=True)
        if result and "score" in result:
            result["score"] = max(0, min(100, int(result.get("score", 50))))
            return result
    except Exception as e:
        logger.error(f"Gemini ATS error: {e}")

    return _rule_based_ats(resume_text, job_description)


# ─── AI Resume Writer ─────────────────────────────────────────────────────────

async def generate_resume_content(
    full_name: str,
    profession: str,
    experience: list[dict],
    skills: list[str],
    education: list[dict],
    target_job: str = "",
    template_style: str = "professional",
) -> dict:
    """Generate a complete resume using Gemini AI."""
    if not GEMINI_AVAILABLE:
        return {"error": "Gemini API not configured. Set GEMINI_API_KEY in .env"}

    exp_text = "\n".join(
        f"- {e.get('title', '')} at {e.get('company', '')} ({e.get('duration', '')}): {e.get('description', '')}"
        for e in (experience or [])
    )
    edu_text = "\n".join(
        f"- {e.get('degree', '')} from {e.get('institution', '')} ({e.get('year', '')})"
        for e in (education or [])
    )

    prompt = f"""You are an expert resume writer specializing in ATS-optimized, impactful resumes.

Create a compelling, professional resume for:
- Name: {full_name}
- Target Role: {target_job or profession}
- Style: {template_style}

EXPERIENCE:
{exp_text or "Not provided"}

SKILLS: {', '.join(skills or [])}

EDUCATION:
{edu_text or "Not provided"}

Return a JSON object with these fields:
{{
  "professional_summary": "<3-4 compelling sentences highlighting value proposition>",
  "enhanced_skills": ["skill1", "skill2", ...],
  "experience_bullets": [
    {{
      "company": "...",
      "title": "...",
      "bullets": ["• Achievement 1 with metrics", "• Achievement 2", "• Achievement 3"]
    }}
  ],
  "key_achievements": ["Achievement 1 with metric", "Achievement 2"],
  "ats_keywords": ["keyword1", "keyword2", ...]
}}

Rules:
- Use strong action verbs (Led, Built, Optimized, Delivered, Increased)
- Include quantifiable metrics where possible (improved X by Y%)
- Make it ATS-friendly with relevant keywords
- Keep professional summary punchy and results-focused
- Return ONLY valid JSON"""

    try:
        return await _call_gemini(prompt, expect_json=True)
    except Exception as e:
        logger.error(f"Resume generation error: {e}")
        return {"error": str(e)}


# ─── Cover Letter Generator ───────────────────────────────────────────────────

async def generate_cover_letter(
    full_name: str,
    profession: str,
    skills: list[str],
    company_name: str,
    job_title: str,
    job_description: str = "",
    tone: str = "professional",
) -> str:
    """Generate a personalized cover letter using Gemini AI."""
    if not GEMINI_AVAILABLE:
        return f"""Dear Hiring Manager,

I am writing to express my strong interest in the {job_title} position at {company_name}. With my background in {profession} and expertise in {', '.join((skills or [])[:5])}, I am confident in my ability to make a meaningful contribution to your team.

Throughout my career, I have developed strong technical and collaborative skills that align well with your requirements. I am particularly drawn to {company_name}'s mission and believe my experience would allow me to hit the ground running.

I would welcome the opportunity to discuss how my background aligns with your needs. Thank you for considering my application.

Sincerely,
{full_name}"""

    prompt = f"""You are an expert career coach writing a compelling, personalized cover letter.

Write a {tone} cover letter for:
- Applicant: {full_name} ({profession})
- Company: {company_name}
- Role: {job_title}
- Skills: {', '.join(skills or [])}

{f'Job Description Highlights: {job_description[:500]}' if job_description else ''}

Requirements:
- 3-4 paragraphs, 250-350 words total
- Opening: Hook with specific reason for applying to THIS company
- Body: Connect 2-3 specific skills/experiences to role requirements
- Closing: Confident call to action
- Tone: {tone}
- Do NOT use generic phrases like "I am writing to apply"
- Include company name naturally in the letter
- Return ONLY the letter text, no subject line or metadata"""

    try:
        return await _call_gemini(prompt, expect_json=False)
    except Exception as e:
        logger.error(f"Cover letter error: {e}")
        return f"Error generating cover letter: {e}"


# ─── Skill Gap Analyzer ───────────────────────────────────────────────────────

async def analyze_skill_gap(
    current_skills: list[str],
    target_role: str,
    experience_years: float = 0,
) -> dict:
    """Analyze skill gaps for a target role using Gemini AI."""
    if not GEMINI_AVAILABLE:
        return {
            "missing_critical": ["Communication", "Problem Solving"],
            "missing_nice_to_have": ["Cloud Experience"],
            "learning_path": [
                {"skill": "Communication", "resources": ["Coursera", "LinkedIn Learning"], "timeline": "1 month"},
            ],
            "market_demand": "High",
            "salary_range": "Not available without API",
            "readiness_score": 65,
        }

    prompt = f"""You are a career advisor with deep knowledge of tech job markets.

Analyze the skill gap for someone transitioning to: {target_role}
Current skills: {', '.join(current_skills or ['None listed'])}
Years of experience: {experience_years}

Return JSON:
{{
  "missing_critical": ["skill1", ...],
  "missing_nice_to_have": ["skill1", ...],
  "learning_path": [
    {{
      "skill": "...",
      "resources": ["Resource 1", "Resource 2"],
      "timeline": "X weeks/months"
    }}
  ],
  "market_demand": "High/Medium/Low",
  "salary_range": "$X - $Y",
  "readiness_score": <0-100>,
  "recommendation": "<2-3 sentence career advice>"
}}

Return ONLY valid JSON."""

    try:
        return await _call_gemini(prompt, expect_json=True)
    except Exception as e:
        logger.error(f"Skill gap error: {e}")
        return {"error": str(e)}


# ─── LinkedIn Summary Generator ───────────────────────────────────────────────

async def generate_linkedin_summary(
    full_name: str,
    profession: str,
    skills: list[str],
    experience_years: float = 0,
    achievements: str = "",
) -> str:
    """Generate an optimized LinkedIn About section."""
    if not GEMINI_AVAILABLE:
        return f"{full_name} is a {profession} with {experience_years} years of experience specializing in {', '.join((skills or [])[:5])}."

    prompt = f"""Write an optimized LinkedIn About section for:
- Name: {full_name}
- Role: {profession}
- Experience: {experience_years} years
- Key Skills: {', '.join(skills or [])}
- Achievements: {achievements or 'Not specified'}

Requirements:
- 150-200 words
- First person, conversational but professional
- Hook in first sentence (don't start with "I am")
- Highlight 2-3 key value propositions
- Include a call-to-action at the end
- Include relevant keywords for LinkedIn search
- Return ONLY the summary text"""

    try:
        return await _call_gemini(prompt, expect_json=False)
    except Exception as e:
        logger.error(f"LinkedIn summary error: {e}")
        return f"Error: {e}"