# 🎯 ExtractResume AI - Complete Project Architecture

## Placement Assistant Platform for BTech Students

---

## 📋 **PROJECT OVERVIEW**

**Vision**: An AI-powered placement preparation & job application automation platform for college students.

**Target Users**: BTech/BE students (3rd-4th year) preparing for placements

**Core Value Prop**:

- Automated job applications ✅
- Skill gap analysis + improvement roadmap
- ATS optimization
- Interview preparation (AI mock interviews)
- 1-click bulk applications
- Centralized job tracking

---

## 🏗️ **SYSTEM ARCHITECTURE**

```
┌─────────────────────────────────────────────────────────┐
│                 USER INTERFACES                         │
├─────────────────┬──────────────────┬──────────────────┤
│  Frontend Web   │  Chrome Ext      │  Mobile (Future) │
│  (React/Next)   │  (Job apply)     │                  │
└────────┬────────┴────────┬─────────┴──────────────────┘
         │                 │
         └────────┬────────┘
                  │
         ┌────────▼─────────┐
         │  API Gateway     │
         │  (FastAPI)       │
         └────────┬─────────┘
                  │
    ┌─────────────┼───────────────┬──────────────┐
    │             │               │              │
┌───▼────┐  ┌────▼───┐   ┌───────▼──┐  ┌──────▼──┐
│ Auth   │  │  Jobs  │   │ Profile  │  │ AI      │
│ Router │  │ Router │   │ Router   │  │ Router  │
└───┬────┘  └────┬───┘   └───┬──────┘  └──────┬──┘
    │            │           │               │
    └────────────┼───────────┼───────────────┘
                 │
         ┌───────▼──────────┐
         │  Business Logic  │
         │  (Services)      │
         ├──────────────────┤
         │ • AI Service     │
         │ • Job Scraper    │
         │ • Email Service  │
         │ • Resume Parser  │
         │ • GitHub/LinkedIn│
         │   Scraper        │
         └───────┬──────────┘
                 │
        ┌────────┼────────┐
        │        │        │
    ┌───▼──┐  ┌─▼──┐  ┌──▼──┐
    │ DB   │  │Cache│  │Files│
    │ SQL  │  │Redis│  │S3   │
    └──────┘  └─────┘  └─────┘

┌──────────────────────────────────────┐
│     EXTERNAL INTEGRATIONS            │
├──────────────────────────────────────┤
│ LinkedIn API │ GitHub API            │
│ OpenAI GPT   │ Adzuna API            │
│ Email Service│ PDF Parser            │
└──────────────────────────────────────┘
```

---

## 📊 **DATABASE SCHEMA**

### User Model

```python
User
├── id (PK)
├── email (unique)
├── password_hash
├── full_name
├── phone
├── profile_pic_url
├── resume_file_url
├── bio
├── is_email_verified
├── created_at
├── updated_at
└── Relationships:
    ├── profile_data (1:1)
    ├── resumes (1:many)
    ├── job_applications (1:many)
    ├── saved_jobs (1:many)
    ├── interview_sessions (1:many)
    └── skill_assessments (1:many)
```

### Profile Data Model

```python
ProfileData
├── user_id (FK)
├── educational_qualification
├── current_cgpa
├── experience_level (fresher/1yr/2yr/etc)
├── primary_skills (JSON array)
├── secondary_skills (JSON array)
├── languages_known (JSON array)
├── certifications (JSON array)
├── projects (JSON array)
├── preferred_roles (JSON array)
├── preferred_locations (JSON array)
├── expected_ctc
├── github_profile_url
├── linkedin_profile_url
├── github_data_synced_at
├── linkedin_data_synced_at
└── updated_at
```

### Job Listing Model

```python
JobListing
├── id (PK)
├── title
├── company
├── location
├── salary_range
├── job_type (full-time/intern/contract)
├── description (full)
├── required_skills (JSON array)
├── required_experience_years
├── source (linkedin/adzuna/scrapped)
├── source_url
├── posting_date
├── deadline
├── contact_email
├── company_logo_url
├── company_website
├── created_at
└── is_active
```

### Job Application Model

```python
JobApplication
├── id (PK)
├── user_id (FK)
├── job_listing_id (FK)
├── application_status (applied/rejected/interview/accepted)
├── applied_at
├── ai_match_score (%)
├── skill_gap_analysis (JSON)
├── applied_via (manual/auto/extension)
├── resume_version_used (file path)
├── cover_letter_generated (boolean)
├── last_updated
└── notes (user notes)
```

### Skill Gap Analysis Model

```python
SkillGapAnalysis
├── id (PK)
├── user_id (FK)
├── job_listing_id (FK)
├── matched_skills (JSON array)
├── missing_skills (JSON array)
├── proficiency_scores (JSON)
├── improvement_suggestions (JSON)
├── estimated_learning_days (integer)
├── learning_resources (JSON array)
└── analyzed_at
```

### Resume Model

```python
Resume
├── id (PK)
├── user_id (FK)
├── file_path (S3 URL)
├── parsed_data (JSON - extracted info)
├── ats_score (integer 0-100)
├── ats_feedback (JSON array)
├── version_number
├── is_current (boolean)
├── created_at
└── updated_at
```

### Interview Session Model

```python
InterviewSession
├── id (PK)
├── user_id (FK)
├── interview_type (mock/real-prep/behavioral)
├── domain/role (string)
├── questions (JSON array)
├── user_responses (JSON array)
├── ai_feedback (JSON)
├── score (integer)
├── duration_seconds
├── started_at
├── completed_at
└── audio_recording_url
```

### HR Contact Model

```python
HRContact
├── id (PK)
├── name
├── email
├── phone
├── company
├── company_url
├── designation
├── linkedin_url
├── source (linkedin/email/scrapped)
├── last_contacted_date
├── response_status
└── notes
```

---

## 🔄 **FEATURE FLOW - THREE PHASES**

### 🟢 **PHASE 1 - MVP (Weeks 1-4)**

**Focus**: Core functionality for placements

- [ ] **User Authentication**
  - Sign up/Login with email
  - Password reset
  - Email verification

- [ ] **Resume Management**
  - Upload PDF/DOCX resume
  - PDF parsing & auto-extraction
  - Resume file storage (AWS S3/local)
  - View extracted data

- [ ] **Profile Dashboard**
  - Manual entry: Skills, education, experience
  - View/Edit profile
  - GitHub & LinkedIn URL input (not synced yet, just stored)

- [ ] **Job Listings**
  - Display jobs from CSV/static data
  - Job search & filter
  - Job details view
  - Save job feature

- [ ] **Skill Gap Analysis**
  - Simple keyword matching (Backend/Frontend/Database/Cloud/AI_ML)
  - Show matched vs missing skills
  - ATS score calculation (keyword-based)

- [ ] **Manual Job Applications**
  - Apply to job (manual)
  - Track application status
  - View application history

**Tech Stack**:

- Frontend: React + TailwindCSS
- Backend: FastAPI
- Database: PostgreSQL
- Resume Parser: PyPDF2 / pdf2image + OCR
- Hosting: Local dev / Vercel (frontend) + Heroku (backend)

---

### 🟡 **PHASE 2 - Advanced Features (Weeks 5-8)**

**Focus**: Automation & Intelligence

- [ ] **Chrome Extension - 1-Click Apply**
  - Scrape LinkedIn job listings
  - Auto-match with user profile
  - Apply with pre-filled form
  - Track applications

- [ ] **AI Interview Prep**
  - Mock interview questions (role-based)
  - Text-based Q&A interview
  - AI feedback on answers
  - (Future: Voice recording + analysis)

- [ ] **Job Reflection Dashboard**
  - Show all jobs user is applying to
  - Filter by domain/location
  - Application timeline
  - Match score visualization

- [ ] **HR Email Collection**
  - Scrape HR emails from LinkedIn job posts
  - Store HR contact database
  - Display HR details for manual outreach

- [ ] **Email Outreach (Manual)**
  - Pre-written email templates
  - User can customize & send manually
  - (Automated sending requires SMTP setup)

- [ ] **Better ATS & CV Suggestions**
  - Analyze CV against job description
  - Provide specific improvement suggestions
  - Download updated CV

**New Services**:

- LinkedIn scraper (Selenium/Puppeteer)
- AI Mock Interview engine
- Email template generator
- Advanced ATS analyzer (OpenAI GPT)

---

### 🔴 **PHASE 3 - Full Suite (Weeks 9-12)**

**Focus**: Data Integration & Automation

- [ ] **GitHub Profile Integration**
  - Fetch user's public repos
  - Extract projects & languages
  - Auto-add to resume & profile
  - Show GitHub stats on dashboard

- [ ] **LinkedIn Data Sync**
  - Fetch verified skills
  - Education & experience
  - Certifications
  - Auto-populate profile

- [ ] **Automated Bulk Emails**
  - Queue-based email sending
  - Email tracking (open/click)
  - A/B testing templates
  - Scheduled sending

- [ ] **Advanced CV Generator**
  - Multiple templates (ATS-friendly, modern, etc)
  - AI-powered content suggestions
  - One-click download (PDF)
  - Version control

- [ ] **Analytics & Recommendations**
  - Job market insights
  - Skill demand by location
  - Salary trends
  - Personalized learning path

- [ ] **Notification & Reminders**
  - Email reminders for applications
  - New job recommendations
  - Interview prep reminders
  - Application deadline alerts

**New Integrations**:

- GitHub API
- LinkedIn Unofficial API / Selenium scraper
- OpenAI GPT for content generation
- SendGrid / AWS SES for bulk emails
- Twilio for SMS (optional)

---

## 🛠️ **TECH STACK (RECOMMENDED)**

| Layer             | Technology                                   | Why                                   |
| ----------------- | -------------------------------------------- | ------------------------------------- |
| **Frontend**      | Next.js 14                                   | SSR, better SEO, file upload handling |
| **Style**         | TailwindCSS + ShadCN                         | Fast, professional looking            |
| **Backend**       | FastAPI                                      | Async, fast, easy to deploy           |
| **Database**      | PostgreSQL                                   | Relational data, scalable             |
| **Cache**         | Redis                                        | Job caching, session management       |
| **File Storage**  | AWS S3 / MinIO                               | Resume & file storage                 |
| **Email**         | SendGrid / Gmail API                         | Bulk email sending                    |
| **Job Scraping**  | Selenium / Puppeteer                         | Browser automation for LinkedIn       |
| **Resume Parser** | PyMuPDF / python-docx                        | Extract text from PDFs                |
| **AI/LLM**        | OpenAI GPT-4 API                             | Interview, feedback, suggestions      |
| **Auth**          | JWT + Refresh tokens                         | Secure authentication                 |
| **Production**    | Docker + Docker Compose                      | Easy deployment                       |
| **Hosting**       | Railway/Render (backend) + Vercel (frontend) | Free tier support                     |

---

## 📱 **USER WORKFLOWS**

### Workflow 1: Resume Upload & Profile Creation

```
User Signs Up
    ↓
Upload Resume (PDF/DOCX)
    ↓
System Parses Resume (PyPDF2 + regex)
    ↓
Display Extracted Data (Skills, Exp, Edu, Certs)
    ↓
User Reviews & Edits Profile
    ↓
(Optional) Connect GitHub & LinkedIn
    ↓
Profile Created ✅
```

### Workflow 2: Job Application (Manual)

```
User Searches Jobs
    ↓
Select Job
    ↓
Click "Apply"
    ↓
System Calculates Skill Gap & ATS Score
    ↓
Show Analysis: Matched Skills ✅ | Missing Skills ❌
    ↓
User Confirms Application
    ↓
Application Saved
    ↓
(Optional) Generate Cover Letter (AI)
    ↓
Save to Tracking Dashboard
```

### Workflow 3: Chrome Extension - 1-Click Apply

```
[LinkedIn Job Page]
    ↓
Click Extension Icon
    ↓
[Popup Shows] Skill Match: 85% | Apply Button
    ↓
Click "Quick Apply"
    ↓
Extension Pre-fills Form (Name, Email, Resume)
    ↓
Click "Submit" on LinkedIn form
    ↓
Job Added to User's Dashboard Automatically
```

### Workflow 4: AI Mock Interview

```
User Navigates to "Interview Prep"
    ↓
Select Role/Domain (e.g., "Backend Developer")
    ↓
System Generates 5 Interview Questions (AI)
    ↓
User Answers (Text Input)
    ↓
AI Evaluates Answers
    ↓
Show Score + Feedback for Each Question
    ↓
Suggest Resources for Improvement
    ↓
Save Session History for Later Review
```

### Workflow 5: HR Email Outreach

```
User Searches Jobs on Platform
    ↓
System Scrapes HR Emails from LinkedIn Job Posts
    ↓
Display HR Contact Card (Name, Email, LinkedIn)
    ↓
User Either:
   A) Manual Copy-Paste Email
   B) Click "Send Email" → Auto-Generate Formal Email
      ↓
      Customize Message
      ↓
      Click "Send" (SMTP backend)
```

---

## 🗂️ **PROJECT FOLDER STRUCTURE**

```
ExtractResume-Ecosystem/
│
├── frontend/                    # React/Next.js
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Resume/
│   │   │   ├── JobSearch/
│   │   │   ├── Interview/
│   │   │   └── Application/
│   │   ├── pages/
│   │   ├── api/                 # API client
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── styles/
│   ├── package.json
│   └── next.config.js
│
├── backend/                     # FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── jobs.py
│   │   │   ├── applications.py
│   │   │   ├── resume.py
│   │   │   ├── interviews.py
│   │   │   └── hr_contacts.py
│   │   ├── services/
│   │   │   ├── ai_service.py
│   │   │   ├── resume_parser.py
│   │   │   ├── job_scraper.py
│   │   │   ├── email_service.py
│   │   │   ├── github_service.py
│   │   │   ├── linkedin_service.py
│   │   │   └── ats_analyzer.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── job.py
│   │   │   ├── application.py
│   │   │   ├── resume.py
│   │   │   ├── interview.py
│   │   │   └── hr_contact.py
│   │   ├── core/
│   │   │   ├── db.py
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   └── schemas/
│   │       └── (Pydantic schemas)
│   ├── migrations/              # Alembic
│   ├── tests/
│   ├── requirements.txt
│   ├── .env
│   ├── .dockerignore
│   └── dockerfile
│
├── chrome-extension/
│   ├── manifest.json
│   ├── popup.html / .js
│   ├── content.js
│   ├── background.js
│   ├── icons/
│   └── README.md
│
├── docs/
│   ├── API.md
│   ├── FEATURES.md
│   └── DEPLOYMENT.md
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🚀 **DEPLOYMENT STRATEGY**

### Development

- Backend: Local FastAPI (`uvicorn main:app --reload`)
- Frontend: Local React dev server (`npm run dev`)
- Database: Local PostgreSQL or Docker container
- Storage: Local file system (simulate S3)

### Testing

- Automated tests (pytest for backend, Jest for frontend)
- Manual testing on Chrome extension
- Integration tests for API

### Production

```
Docker:
├── Backend Container (FastAPI + Gunicorn)
├── PostgreSQL Container
├── Redis Container (optional)
└── Nginx Container (reverse proxy)

Hosting:
- Railway.app / Render.com (Backend)
- Vercel (Frontend)
- AWS S3 (File storage)
```

---

## ⏱️ **DEVELOPMENT TIMELINE (12 Weeks)**

| Week | Phase  | Focus                          | Deliverable               |
| ---- | ------ | ------------------------------ | ------------------------- |
| 1-2  | Setup  | DB schema, API structure, Auth | Login/Signup working      |
| 3    | MVP    | Resume upload & parsing        | Resume stored & displayed |
| 4    | MVP    | Profile dashboard              | User can edit profile     |
| 5    | MVP    | Job listings                   | Jobs searchable           |
| 6    | MVP    | Job applications               | Can apply manually        |
| 7    | Phase2 | Chrome extension               | LinkedIn scraping works   |
| 8    | Phase2 | AI interviews                  | Mock interview functional |
| 9    | Phase2 | HR email scraping              | HR contacts available     |
| 10   | Phase3 | GitHub integration             | Repos auto-added          |
| 11   | Phase3 | Email automation               | Bulk email queue          |
| 12   | Polish | Testing, docs, deploy          | Production ready          |

---

## 💡 **ADDITIONAL CONSIDERATIONS**

### Compliance & Legal

- GDPR compliance for email collection
- LinkedIn ToS (be careful with scraping)
- Privacy policy for user data

### Security

- HTTPS everywhere
- Rate limiting on APIs
- Input validation & sanitization
- No hardcoding secrets (.env file)
- JWT token expiration
- Password hashing (bcrypt)

### Scalability (Future)

- Use Celery for async jobs (email, scraping)
- Cache job listings in Redis
- CDN for frontend static files
- Database connection pooling
- Kubernetes for container orchestration

### Frontend Considerations

- Responsive design (mobile-first)
- Dark mode support
- Accessibility (WCAG)
- Progressive Web App (PWA) features

---

## 📖 **REFERENCE POINTS**

1. **KickResume** - Good UI/UX for resume templates
2. **LinkedIn** - Job scraping UI patterns
3. **Greenhouse ATS** - Application tracking workflow
4. **Coursera** - Skill assessment & recommendations
5. **GitHub** - Profile integration & OAuth2 patterns

---

**Next Step**: Start with **Phase 1 MVP** - focus on core features first, then expand.
