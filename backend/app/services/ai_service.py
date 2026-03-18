import re

async def get_ats_score(resume_text: str, job_description: str):
    # Safety checks
    if not resume_text or not isinstance(resume_text, str):
        resume_text = ""
    if not job_description or not isinstance(job_description, str):
        job_description = ""
    
    # Normalize text
    resume_text = resume_text.lower()
    job_description = job_description.lower()

    # 1. Define Expanded Skill Categories
    categories = {
        "Frontend": ["react", "javascript", "js", "next.js", "nextjs", "html", "css", "tailwind", "typescript", "ts"],
        "Backend": ["fastapi", "python", "docker", "node", "nodejs", "django", "flask", "golang", "rust"],
        "Database": ["postgresql", "postgres", "mongodb", "mongo", "sql", "redis", "firebase", "mysql", "nosql"],
        "Cloud": ["aws", "docker", "kubernetes", "k8s", "azure", "gcp", "terraform", "devops"],
        "AI_ML": ["machine learning", "ml", "ai", "pytorch", "tensorflow", "nlp", "scikit-learn", "pandas", "numpy"]
    }

    # 2. Calculate Radar Chart Data (Your Profile Strength)
    chart_data = {}
    for cat, skills in categories.items():
        found = [s for s in skills if s in resume_text]
        # Calculate percentage of category skills present in resume
        chart_data[cat] = int((len(set(found)) / len(skills)) * 100) if skills else 0

    # 3. Identify Skills required by the Job (Keyword Extraction)
    all_tech_keywords = [skill for sublist in categories.values() for skill in sublist]
    
    # Skills the JD actually asks for
    required_in_jd = list(set([word for word in all_tech_keywords if word in job_description]))
    
    # Compare JD requirements to Resume
    matched_skills = [skill for skill in required_in_jd if skill in resume_text]
    missing_skills = [skill for skill in required_in_jd if skill not in resume_text]
    
    # Calculate Score
    if not required_in_jd:
        score_val = 70  # Baseline
    else:
        score_val = (len(matched_skills) / len(required_in_jd)) * 100
    
    # 4. Generate AI Feedback Text
    feedback = f"You match {len(matched_skills)} key skills. "
    if missing_skills:
        feedback += f"To improve your chances, consider adding {missing_skills[0]} and {missing_skills[1]} to your resume."
    else:
        feedback += "Your profile is an excellent match for this technical stack!"

    return {
        "score": int(score_val),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "chart_data": chart_data,
        "feedback": feedback
    }