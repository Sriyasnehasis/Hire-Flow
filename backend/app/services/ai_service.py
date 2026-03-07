import re

async def get_ats_score(resume_text: str, job_description: str):
    # Normalize text: lowercase and remove special characters for better matching
    resume_text = resume_text.lower()
    job_description = job_description.lower()

    # 1. Define Expanded Skill Categories
    # We use a dictionary where the key is the Category and value is a list of synonyms
    categories = {
        "Frontend": ["react", "javascript", "js", "next.js", "nextjs", "html", "css", "tailwind", "typescript", "ts"],
        "Backend": ["fastapi", "python", "docker", "node", "nodejs", "django", "flask", "golang", "rust"],
        "Database": ["postgresql", "postgres", "mongodb", "mongo", "sql", "redis", "firebase", "mysql", "nosql"],
        "Cloud": ["aws", "docker", "kubernetes", "k8s", "azure", "gcp", "terraform", "devops"],
        "AI_ML": ["machine learning", "ml", "ai", "pytorch", "tensorflow", "nlp", "scikit-learn", "pandas", "numpy"]
    }

    # 2. Calculate Resume Proficiency (Radar Chart Data)
    chart_data = {}
    resume_words = set(re.findall(r'\w+', resume_text))
    
    for cat, skills in categories.items():
        # Check if any synonym exists in the resume
        found = [s for s in skills if s in resume_text]
        # We cap the score at 100% based on unique category matches
        # Using a simplified weight: (Unique skills found / total skills in cat)
        chart_data[cat] = int((len(set(found)) / len(skills)) * 100) if skills else 0

    # 3. Standard ATS Scoring against Job Description
    # Extract all potential keywords from the JD
    all_tech_keywords = [skill for sublist in categories.values() for skill in sublist]
    
    # Identify which tech keywords are actually mentioned in the JD
    required_in_jd = [word for word in all_tech_keywords if word in job_description]
    # Remove duplicates from synonyms (e.g., if JD says 'Postgres' and 'PostgreSQL')
    required_in_jd = list(set(required_in_jd))
    
    if not required_in_jd:
        return {
            "score": 75, # Default baseline for general interest
            "missing_skills": [], 
            "chart_data": chart_data, 
            "feedback": "Job description is general. Radar chart reflects your core profile."
        }

    # Compare JD requirements to Resume
    matching_skills = [skill for skill in required_in_jd if skill in resume_text]
    missing_skills = [skill for skill in required_in_jd if skill not in resume_text]
    
    score_val = (len(matching_skills) / len(required_in_jd)) * 100
    
    result = {
        "score": int(score_val),
        "missing_skills": missing_skills[:10], # Limit to top 10 gaps
        "chart_data": chart_data,
        "feedback": f"Match found for {len(matching_skills)} out of {len(required_in_jd)} identified requirements."
    }
    
    print(f"ANALYSIS COMPLETE: ATS Score {result['score']}%")
    return result