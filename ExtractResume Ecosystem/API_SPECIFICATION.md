# 🔌 Complete API Specification

## ExtractResume AI - REST API Endpoints

---

## 📌 BASE URL

```
Production: https://api.extractresume.com/api/v1
Development: http://localhost:8000/api/v1
```

---

## 🔐 **AUTH ENDPOINTS** (`/auth`)

### 1. User Sign Up

```
POST /auth/signup
Content-Type: application/json

Request Body:
{
  "email": "student@example.com",
  "password": "SecurePassword123",
  "full_name": "John Doe",
  "phone": "+91-9876543210"
}

Response (201):
{
  "id": 1,
  "email": "student@example.com",
  "full_name": "John Doe",
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "message": "Signup successful. Check your email to verify."
}

Response (400):
{
  "detail": "Email already exists"
}
```

### 2. User Login

```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "student@example.com",
  "password": "SecurePassword123"
}

Response (200):
{
  "id": 1,
  "email": "student@example.com",
  "full_name": "John Doe",
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "message": "Login successful"
}

Response (401):
{
  "detail": "Invalid email or password"
}
```

### 3. Refresh Token

```
POST /auth/refresh
Headers:
Authorization: Bearer {refresh_token}

Response (200):
{
  "access_token": "new_eyJhbGc...",
  "refresh_token": "new_eyJhbGc...",
  "message": "Token refreshed"
}
```

### 4. Logout

```
POST /auth/logout
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "message": "Logout successful"
}
```

### 5. Verify Email

```
GET /auth/verify-email?token={token}

Response (200):
{
  "message": "Email verified successfully"
}
```

---

## 👤 **USER ENDPOINTS** (`/users`)

### 1. Get Current User Profile

```
GET /users/me
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "id": 1,
  "email": "student@example.com",
  "full_name": "John Doe",
  "phone": "+91-9876543210",
  "profile_pic_url": "https://...",
  "created_at": "2024-03-18T10:00:00Z",
  "profile_data": {
    "id": 1,
    "educational_qualification": "B.Tech CSE",
    "current_cgpa": 8.5,
    "experience_level": "fresher",
    "primary_skills": ["Python", "FastAPI", "React"],
    "secondary_skills": ["Docker", "PostgreSQL"],
    "preferred_roles": ["Backend Developer", "Full Stack"],
    "expected_ctc_min": 4.0,
    "expected_ctc_max": 6.0,
    "github_profile_url": "https://github.com/user",
    "linkedin_profile_url": "https://linkedin.com/in/user"
  }
}
```

### 2. Update User Profile

```
PUT /users/me
Headers:
Authorization: Bearer {access_token}
Content-Type: application/json

Request Body:
{
  "full_name": "John Doe Updated",
  "phone": "+91-9876543211",
  "profile_pic_url": "https://..."
}

Response (200):
{
  "message": "Profile updated successfully",
  "user": { ...updated user data... }
}
```

### 3. Update Profile Data (Skills, Education, Preferences)

```
PUT /users/profile-data
Headers:
Authorization: Bearer {access_token}
Content-Type: application/json

Request Body:
{
  "educational_qualification": "B.Tech CSE",
  "current_cgpa": 8.5,
  "college_name": "IIT Bombay",
  "graduation_year": 2025,
  "experience_level": "fresher",
  "years_of_experience": 0,
  "primary_skills": ["Python", "FastAPI", "React", "PostgreSQL"],
  "secondary_skills": ["Docker", "AWS"],
  "languages_known": ["English", "Hindi"],
  "certifications": [
    {
      "name": "AWS Solutions Architect",
      "issuer": "Amazon",
      "issue_date": "2023-06-15",
      "credential_url": "https://..."
    }
  ],
  "projects": [
    {
      "name": "AI Resume Parser",
      "description": "Built an AI-powered...",
      "technologies": ["Python", "FastAPI"],
      "github_url": "https://github.com/...",
      "live_url": "https://..."
    }
  ],
  "preferred_roles": ["Backend Developer", "Full Stack Developer"],
  "preferred_locations": ["Bangalore", "Hyderabad", "Remote"],
  "preferred_job_types": ["full-time"],
  "expected_ctc_min": 4.0,
  "expected_ctc_max": 6.0,
  "github_profile_url": "https://github.com/user",
  "linkedin_profile_url": "https://linkedin.com/in/user"
}

Response (200):
{
  "message": "Profile updated successfully",
  "profile_data": { ...updated profile data... }
}
```

### 4. Connect GitHub Account

```
POST /users/github/connect
Headers:
Authorization: Bearer {access_token}
Content-Type: application/json

Request Body:
{
  "github_username": "john_doe"
}

Response (200):
{
  "message": "GitHub account connected",
  "github_username": "john_doe",
  "sync_status": "syncing...",
  "sync_will_complete_in": "30 seconds"
}
```

### 5. Sync GitHub Data

```
POST /users/github/sync
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "message": "GitHub data synced successfully",
  "stats": {
    "public_repos_count": 15,
    "total_stars": 125,
    "languages": ["Python", "JavaScript", "Java"],
    "top_repos": [
      {
        "name": "AI-Resume-Parser",
        "description": "...",
        "stars": 45,
        "language": "Python",
        "url": "https://..."
      }
    ]
  },
  "synced_at": "2024-03-18T10:00:00Z"
}
```

### 6. Connect LinkedIn Account (OAuth)

```
POST /users/linkedin/connect
Headers:
Authorization: Bearer {access_token}
Content-Type: application/json

Request Body:
{
  "oauth_token": "...",
  "linkedin_url": "https://linkedin.com/in/user"
}

Response (200):
{
  "message": "LinkedIn account connected",
  "sync_status": "syncing...",
  "profile_data_to_sync": [
    "experiences",
    "education",
    "skills",
    "certifications"
  ]
}
```

---

## 📄 **RESUME ENDPOINTS** (`/resumes`)

### 1. Upload & Parse Resume

```
POST /resumes/upload
Headers:
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

Form Data:
- file: (PDF/DOCX file)

Response (200):
{
  "id": 5,
  "file_path": "s3://bucket/resumes/user_1/resume_v1.pdf",
  "original_filename": "John_Doe_Resume.pdf",
  "version_number": 1,
  "parsed_data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "summary": "...",
    "skills": ["Python", "FastAPI", "React", "Docker"],
    "experiences": [
      {
        "company": "Tech Corp",
        "position": "Intern",
        "duration": "Jun 2023 - Aug 2023",
        "description": "Built..."
      }
    ],
    "education": [
      {
        "school": "IIT Bombay",
        "degree": "B.Tech",
        "field": "Computer Science",
        "graduation_year": 2025
      }
    ],
    "certifications": [...]
  },
  "ats_score": 78,
  "ats_feedback": [
    "✅ Good keyword density",
    "⚠️ Add more action verbs",
    "❌ Missing ATS-friendly formatting"
  ],
  "message": "Resume parsed successfully"
}
```

### 2. Get All Resumes

```
GET /resumes
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "resumes": [
    {
      "id": 1,
      "version_number": 1,
      "created_at": "2024-02-01T10:00:00Z",
      "is_current": false,
      "ats_score": 75,
      "original_filename": "Resume_v1.pdf"
    },
    {
      "id": 5,
      "version_number": 2,
      "created_at": "2024-03-18T10:00:00Z",
      "is_current": true,
      "ats_score": 78,
      "original_filename": "Resume_v2.pdf"
    }
  ],
  "total_count": 2
}
```

### 3. Get Resume Details

```
GET /resumes/{resume_id}
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "id": 5,
  "version_number": 1,
  "parsed_data": { ...full parsed data... },
  "ats_score": 78,
  "ats_feedback": [...],
  "created_at": "2024-03-18T10:00:00Z"
}
```

### 4. Analyze Resume Against Job

```
POST /resumes/{resume_id}/analyze/{job_id}
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "resume_id": 5,
  "job_id": 123,
  "ats_score": 78,
  "match_percentage": 85,
  "matched_skills": ["Python", "FastAPI", "Docker"],
  "missing_skills": ["Kubernetes", "AWS"],
  "skill_gap_analysis": {
    "overall_improvement_days": 45,
    "areas_to_improve": [
      {
        "skill": "Kubernetes",
        "current_level": "None",
        "required_level": "Intermediate",
        "learning_resources": [
          {
            "name": "Kubernetes for Developers",
            "url": "https://...",
            "platform": "Udemy",
            "hours": 12
          }
        ]
      }
    ]
  }
}
```

### 5. Update Resume as Current

```
PUT /resumes/{resume_id}/set-current
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "message": "Resume set as current",
  "current_resume_id": 5
}
```

### 6. Generate ATS Report

```
GET /resumes/{resume_id}/ats-report
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "resume_id": 5,
  "ats_score": 78,
  "score_breakdown": {
    "formatting": 85,
    "keywords": 72,
    "readability": 90
  },
  "detailed_feedback": [
    {
      "category": "formatting",
      "status": "good",
      "suggestion": "Your resume is ATS-friendly"
    },
    {
      "category": "keywords",
      "status": "warning",
      "suggestion": "Add more industry-specific keywords"
    }
  ],
  "improvement_areas": ["Add more metrics", "Use industry keywords"],
  "estimated_improvement_score": 88
}
```

---

## 💼 **JOBS ENDPOINTS** (`/jobs`)

### 1. Get All Jobs (Search & Filter)

```
GET /jobs?search=backend&location=bangalore&experience=0-2&sort=newest&page=1&limit=20
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "jobs": [
    {
      "id": 123,
      "title": "Backend Developer",
      "company": "TechCorp",
      "location": "Bangalore",
      "job_type": "full-time",
      "salary_min": 4.0,
      "salary_max": 6.0,
      "required_skills": ["Python", "FastAPI", "PostgreSQL"],
      "required_experience_years": 1,
      "posting_date": "2024-03-10T10:00:00Z",
      "source": "linkedin",
      "source_url": "https://...",
      "match_percentage": 85,
      "is_saved": false,
      "applied": false
    }
  ],
  "total_count": 450,
  "page": 1,
  "limit": 20,
  "total_pages": 23
}
```

### 2. Get Job Details

```
GET /jobs/{job_id}
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "id": 123,
  "title": "Backend Developer",
  "company": "TechCorp",
  "location": "Bangalore",
  "job_type": "full-time",
  "description": "We are looking for...",
  "requirements": "Requirements: ...",
  "benefits": "Benefits: Health insurance...",
  "salary_min": 4.0,
  "salary_max": 6.0,
  "required_skills": ["Python", "FastAPI", "PostgreSQL"],
  "nice_to_have_skills": ["Docker", "AWS"],
  "required_experience_years": 1,
  "contact_email": "hr@techcorp.com",
  "company_logo_url": "https://...",
  "company_website": "https://techcorp.com",
  "posting_date": "2024-03-10T10:00:00Z",
  "application_deadline": "2024-04-10T23:59:59Z",
  "source": "linkedin",
  "source_url": "https://...",
  "company_info": {
    "name": "TechCorp",
    "industry": "Software",
    "size": "100-500",
    "founded_year": 2015
  },
  "user_match": {
    "match_percentage": 85,
    "user_has_applied": false,
    "user_has_saved": false
  }
}
```

### 3. Save Job

```
POST /jobs/{job_id}/save
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "message": "Job saved successfully"
}
```

### 4. Unsave Job

```
DELETE /jobs/{job_id}/save
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "message": "Job removed from saved"
}
```

### 5. Get Saved Jobs

```
GET /jobs/saved
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "saved_jobs": [
    {
      "id": 123,
      "title": "Backend Developer",
      "company": "TechCorp",
      "saved_at": "2024-03-15T10:00:00Z",
      "match_percentage": 85
    }
  ],
  "total_count": 12
}
```

---

## 📋 **JOB APPLICATION ENDPOINTS** (`/applications`)

### 1. Apply for Job

```
POST /applications/apply
Headers:
Authorization: Bearer {access_token}
Content-Type: application/json

Request Body:
{
  "job_id": 123,
  "resume_id": 5,
  "cover_letter": "Optional custom cover letter text",
  "auto_generate_cover_letter": false
}

Response (201):
{
  "id": 456,
  "job_id": 123,
  "user_id": 1,
  "status": "applied",
  "applied_at": "2024-03-18T10:00:00Z",
  "ai_match_score": 85,
  "message": "Application submitted successfully"
}
```

### 2. Get My Applications

```
GET /applications?status=applied&job_id=optional&sort=newest&page=1
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "applications": [
    {
      "id": 456,
      "job": {
        "id": 123,
        "title": "Backend Developer",
        "company": "TechCorp",
        "location": "Bangalore"
      },
      "status": "applied",
      "applied_at": "2024-03-18T10:00:00Z",
      "ai_match_score": 85,
      "applied_via": "manual",
      "interview_scheduled": false,
      "follow_up_sent_count": 1,
      "last_follow_up_date": "2024-03-16T10:00:00Z"
    }
  ],
  "total_count": 42,
  "status_summary": {
    "applied": 25,
    "shortlisted": 3,
    "interview": 2,
    "rejected": 5,
    "accepted": 0
  }
}
```

### 3. Get Application Details

```
GET /applications/{application_id}
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "id": 456,
  "job": { ...full job details... },
  "status": "applied",
  "ai_match_score": 85,
  "skill_gap_analysis": { ...analysis... },
  "cover_letter": "Dear Hiring Manager...",
  "applied_at": "2024-03-18T10:00:00Z",
  "updated_at": "2024-03-18T10:00:00Z"
}
```

### 4. Update Application Status

```
PUT /applications/{application_id}
Headers:
Authorization: Bearer {access_token}
Content-Type: application/json

Request Body:
{
  "status": "interview",
  "interview_date": "2024-03-25T14:00:00Z",
  "notes": "Interview scheduled"
}

Response (200):
{
  "message": "Application updated",
  "application": { ...updated data... }
}
```

### 5. Bulk Apply (Chrome Extension or Dashboard)

```
POST /applications/bulk-apply
Headers:
Authorization: Bearer {access_token}
Content-Type: application/json

Request Body:
{
  "job_ids": [123, 124, 125],
  "resume_id": 5,
  "auto_generate_cover_letters": true
}

Response (200):
{
  "message": "Bulk applications submitted",
  "applied_count": 3,
  "failed_count": 0,
  "applications": [
    {
      "job_id": 123,
      "status": "success",
      "application_id": 456
    }
  ]
}
```

### 6. Send Follow-up Email

```
POST /applications/{application_id}/send-follow-up
Headers:
Authorization: Bearer {access_token}
Content-Type: application/json

Request Body:
{
  "email_template": "standard",
  "custom_message": "Optional custom message to add"
}

Response (200):
{
  "message": "Follow-up email sent",
  "sent_at": "2024-03-18T10:00:00Z"
}
```

---

## 📊 **SKILL GAP & ANALYSIS ENDPOINTS** (`/analysis`)

### 1. Get Skill Gap Analysis for Job

```
GET /analysis/skill-gap/{job_id}
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "job_id": 123,
  "job_title": "Backend Developer",
  "user_match": {
    "overall_match_percentage": 85,
    "skill_match_percentage": 82,
    "experience_match_percentage": 88
  },
  "matched_skills": {
    "count": 8,
    "skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "REST APIs", "Git", "Linux", "SQL"]
  },
  "missing_skills": {
    "count": 4,
    "skills": [
      {
        "name": "Kubernetes",
        "required_level": "Intermediate",
        "your_level": "None",
        "criticality": "high"
      },
      {
        "name": "AWS",
        "required_level": "Intermediate",
        "your_level": "None",
        "criticality": "medium"
      }
    ]
  },
  "improvement_plan": {
    "estimated_total_days": 60,
    "skills_to_learn": [
      {
        "skill": "Kubernetes",
        "current_level": "None",
        "target_level": "Intermediate",
        "estimated_days": 30,
        "resources": [
          {
            "name": "Kubernetes for Developers",
            "platform": "Udemy",
            "url": "https://...",
            "hours": 12,
            "cost": "₹500"
          },
          {
            "name": "Kubernetes Official Docs",
            "platform": "Free",
            "url": "https://kubernetes.io/docs",
            "hours": 8,
            "cost": "Free"
          }
        ]
      }
    ]
  }
}
```

### 2. Get Skill Demand in Market

```
GET /analysis/market-insights?location=bangalore&role=backend-developer
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "location": "Bangalore",
  "role": "Backend Developer",
  "total_job_listings": 450,
  "top_skills_demanded": [
    {
      "skill": "Python",
      "frequency": 380,
      "percentage": "84%"
    },
    {
      "skill": "FastAPI",
      "frequency": 280,
      "percentage": "62%"
    }
  ],
  "salary_statistics": {
    "average_ctc": "5.5 LPA",
    "min_ctc": "4.0 LPA",
    "max_ctc": "10.0 LPA",
    "median_ctc": "5.5 LPA"
  },
  "experience_distribution": {
    "fresher": "15%",
    "0-1 years": "25%",
    "1-2 years": "30%",
    "2+ years": "30%"
  }
}
```

### 3. Get Personalized Learning Path

```
GET /analysis/learning-path
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "user_id": 1,
  "current_skills": ["Python", "FastAPI", "PostgreSQL"],
  "target_role": "Full Stack Developer",
  "learning_path": [
    {
      "phase": 1,
      "duration_weeks": 4,
      "focus": "Frontend Fundamentals",
      "skills_to_learn": ["React", "JavaScript", "HTML", "CSS"],
      "courses": [
        {
          "name": "React Basics",
          "platform": "freeCodeCamp",
          "duration_hours": 10,
          "cost": "Free"
        }
      ]
    },
    {
      "phase": 2,
      "duration_weeks": 3,
      "focus": "Advanced Frontend",
      "skills_to_learn": ["Next.js", "TailwindCSS"],
      "courses": [...]
    }
  ],
  "estimated_completion_days": 120
}
```

---

## 🎤 **INTERVIEW ENDPOINTS** (`/interviews`)

### 1. Start Mock Interview

```
POST /interviews/start
Headers:
Authorization: Bearer {access_token}
Content-Type: application/json

Request Body:
{
  "interview_type": "mock",
  "domain_role": "Backend Developer",
  "difficulty": "medium",
  "num_questions": 5
}

Response (201):
{
  "session_id": 789,
  "interview_type": "mock",
  "domain_role": "Backend Developer",
  "questions": [
    {
      "id": 1,
      "question": "Explain the difference between monolithic and microservices architecture",
      "difficulty": "medium",
      "category": "technical"
    },
    {
      "id": 2,
      "question": "How would you optimize a slow SQL query?",
      "difficulty": "medium",
      "category": "technical"
    }
  ],
  "message": "Interview started. Answer the questions below."
}
```

### 2. Submit Interview Answers

```
POST /interviews/{session_id}/submit
Headers:
Authorization: Bearer {access_token}
Content-Type: application/json

Request Body:
{
  "answers": [
    {
      "question_id": 1,
      "response": "Monolithic architecture means the entire application is built as one unit..."
    },
    {
      "question_id": 2,
      "response": "I would use EXPLAIN ANALYZE to check the query plan..."
    }
  ]
}

Response (200):
{
  "session_id": 789,
  "overall_score": 72,
  "feedback": [
    {
      "question_id": 1,
      "question": "Explain the difference...",
      "user_response": "...",
      "score": 7,
      "ai_feedback": "Good explanation. You could have mentioned the advantages of microservices architecture.",
      "suggestions": "Include scalability advantages"
    }
  ],
  "areas_to_improve": ["System Design", "Database Optimization"],
  "strengths": ["Strong fundamentals", "Good problem-solving approach"],
  "next_steps": "Practice coding problems on LeetCode for 2 weeks"
}
```

### 3. Get Interview History

```
GET /interviews?limit=10&sort=newest
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "interviews": [
    {
      "session_id": 789,
      "interview_type": "mock",
      "domain_role": "Backend Developer",
      "overall_score": 72,
      "completed_at": "2024-03-18T10:00:00Z",
      "duration_minutes": 25
    }
  ],
  "total_count": 5,
  "average_score": 68
}
```

### 4. Get Interview Details

```
GET /interviews/{session_id}
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "session_id": 789,
  "questions": [...],
  "user_responses": [...],
  "overall_score": 72,
  "feedback": [...],
  "started_at": "2024-03-18T09:30:00Z",
  "completed_at": "2024-03-18T10:00:00Z"
}
```

---

## 📧 **HR CONTACT ENDPOINTS** (`/hr-contacts`)

### 1. Get HR Contacts for Job

```
GET /jobs/{job_id}/hr-contacts
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "hr_contacts": [
    {
      "id": 101,
      "name": "Priya Sharma",
      "email": "priya.sharma@techcorp.com",
      "phone": "+91-9876543210",
      "designation": "HR Manager",
      "company": "TechCorp",
      "company_url": "https://techcorp.com",
      "linkedin_url": "https://linkedin.com/in/priya-sharma",
      "source": "linkedin",
      "last_contacted_date": null,
      "response_status": null
    }
  ],
  "total_count": 3
}
```

### 2. Send Email to HR (Manual)

```
POST /hr-contacts/{contact_id}/send-email
Headers:
Authorization: Bearer {access_token}
Content-Type: application/json

Request Body:
{
  "subject": "Application for Backend Developer Role",
  "body": "Dear Ms. Sharma, I am writing to apply for...",
  "cc_self": true
}

Response (200):
{
  "message": "Email sent successfully",
  "sent_at": "2024-03-18T10:00:00Z",
  "contact_updated": {
    "id": 101,
    "last_contacted_date": "2024-03-18T10:00:00Z",
    "contact_attempts_count": 1
  }
}
```

### 3. Get All HR Contacts

```
GET /hr-contacts?search=techcorp&sort=newest&page=1
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "hr_contacts": [...],
  "total_count": 25,
  "page": 1,
  "limit": 20
}
```

---

## 📊 **DASHBOARD ENDPOINTS** (`/dashboard`)

### 1. Get Dashboard Summary

```
GET /dashboard/summary
Headers:
Authorization: Bearer {access_token}

Response (200):
{
  "user_name": "John Doe",
  "profile_completion": 85,
  "overall_match_percentage": 82,
  "stats": {
    "total_applications": 42,
    "applications_status": {
      "applied": 25,
      "shortlisted": 3,
      "interview": 2,
      "rejected": 5,
      "accepted": 0
    },
    "saved_jobs": 15,
    "interviews_completed": 5,
    "average_interview_score": 68
  },
  "upcoming_events": [
    {
      "type": "interview",
      "company": "TechCorp",
      "job_title": "Backend Developer",
      "date": "2024-03-25T14:00:00Z"
    }
  ],
  "recommendations": [
    "Complete your GitHub profile to increase match score",
    "Practice cloud technologies - 3 of your target roles require AWS"
  ]
}
```

---

## 🔧 **ADMIN ENDPOINTS** (`/admin`)

### 1. Scrape LinkedIn Jobs

```
POST /admin/scrape/linkedin
Headers:
Authorization: Bearer {admin_token}
Content-Type: application/json

Request Body:
{
  "keywords": ["python developer", "backend developer"],
  "locations": ["bangalore", "bangalore"],
  "limit": 50
}

Response (202):
{
  "job_id": "scrape_123",
  "message": "Scraping job submitted to queue",
  "status": "processing"
}
```

### 2. Get Scrape Status

```
GET /admin/scrape/{scrape_job_id}
Headers:
Authorization: Bearer {admin_token}

Response (200):
{
  "scrape_job_id": "scrape_123",
  "status": "completed",
  "jobs_scraped": 48,
  "jobs_saved_to_db": 42,
  "errors": 0,
  "started_at": "2024-03-18T09:00:00Z",
  "completed_at": "2024-03-18T10:15:00Z"
}
```

---

## ⚠️ **ERROR RESPONSES**

All endpoints return standard error responses:

```json
{
  "detail": "Error message",
  "error_code": "VALIDATION_ERROR",
  "status_code": 400
}
```

### Common HTTP Status Codes

- **200**: Success
- **201**: Created
- **202**: Accepted (async processing)
- **400**: Bad Request (validation error)
- **401**: Unauthorized (auth required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate entry)
- **429**: Too Many Requests (rate limit)
- **500**: Internal Server Error

---

## 🔑 **AUTHENTICATION**

All endpoints (except `/auth/signup` and `/auth/login`) require:

```
Headers:
Authorization: Bearer {access_token}
```

Access tokens expire in 15 minutes. Use refresh token to get new access token.

---

## 📱 **PAGINATION**

For list endpoints, use:

```
GET /jobs?page=1&limit=20&sort=newest
```

Response includes:

```json
{
  "data": [...],
  "page": 1,
  "limit": 20,
  "total_count": 450,
  "total_pages": 23
}
```

---

## ⏱️ **RATE LIMITING**

- 100 requests per minute per user
- 1000 requests per hour per user
- 10,000 requests per day per user

Headers returned:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1234567890
```
