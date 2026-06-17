# 🎓 HireFlow — Master Project Blueprint & Documentation

This document serves as the single source of truth for the **HireFlow** ecosystem. It explains the project's vision, architecture, current implementation state, scraping topologies, and active development roadmap.

---

## 🎯 1. Vision & Core Objectives

### The Problem
College students (particularly BTech/BE graduates) face a fragmented, highly stressful placement preparation and job application process. They must track dozens of applications, practice mock interviews, format their resumes, optimize their content for Applicant Tracking Systems (ATS), and locate recruiter emails for manual outreach.

### The Solution: HireFlow
HireFlow is an **AI-powered placement preparation & job application automation ecosystem**. It unifies every step of the job search pipeline into a single, high-fidelity dashboard:

1.  **ATS Resume Builder**: Build, parse, and score resumes against specific job descriptions using multiple dynamic layout templates.
2.  **Voice Coach (AI Mock Interviews)**: Practice behavioral and technical interview questions out loud with speech-to-text transcription and real-time evaluation.
3.  **Client-Side Job Scraping**: A 1-click Chrome Extension that extracts job descriptions directly from active browser tabs (LinkedIn) and synchronizes them to the user's tracking dashboard.
4.  **HR Recruiter Outreach**: Collect and manage HR contact cards and generate personalized outreach email drafts.
5.  **Multi-Platform Data Mesh**: Merge professional context (LinkedIn) with technical code footprints (GitHub repositories) to feed the AI builder.

---

## 🛠️ 2. Core Tech Stack (Local & Production)

| Layer | local Development (Docker) | Production Target (Cloud) |
| :--- | :--- | :--- |
| **Frontend Web** | Next.js 14, TypeScript, TailwindCSS, Framer Motion (Port `3000`) | **Vercel** (Connected to custom domain) |
| **Backend REST API** | FastAPI (Python 3.11), SQLAlchemy, Uvicorn (Port `8000`) | **Railway.app** or **Render.com** (Containerized service) |
| **Relational Database** | PostgreSQL 15 (Port `5432`) | **Neon.tech** or **Supabase** (Serverless PostgreSQL) |
| **Document Cache Database**| MongoDB 7.0 (Port `27017`) | **MongoDB Atlas** (Shared Free M0 Cluster) |
| **Key-Value Store / Cache**| Redis 7.0 (Port `6379`) | **Upstash** (Serverless Redis over HTTP) |
| **AI Evaluation Engine** | Google Gemini API (`gemini-1.5-flash` / fallback rotation) | Google Gemini API (Same, with secure server-side keys) |
| **File Storage** | Local folder mock storage | **Cloudflare R2** or **AWS S3** (For resume PDF uploads) |
| **Outreach Client** | Local browser actions | **SendGrid API** or **Google Workspace SMTP** |

---

## 🔄 3. Scraping & Data Sync Topologies

### A. LinkedIn Scraping (Hybrid Extension Model)
*   **Mechanism**: The Chrome Extension content script (`chrome-extension/content.js`) injects an **"Analyze with HireFlow AI"** button directly on the active LinkedIn Job page.
*   **Why**: Server-side scraping gets immediately blocked by LinkedIn's anti-scraping walls (Cloudflare challenges, device checks). Running the scraper on the client side utilizes the user's active login session and IP address, guaranteeing 100% reliability at zero infrastructure cost.
*   **Result**: The extension scrapes job title, company, location, and description, sending it as a JSON payload to backend routers.

### B. GitHub Integration (Official OAuth 2.0 REST API)
*   **Mechanism**: The frontend redirects the user to the official GitHub authorization screen. Upon user approval, GitHub redirects back to `/github-callback` with a token.
*   **Why**: Web scraping GitHub violates ToS and breaks on HTML layout shifts. Calling official endpoints (`api.github.com/user/repos`) provides accurate project names, descriptions, programming languages, and star metrics.
*   **Result**: The backend aggregates the top projects and merges them into the AI Resume Synthesis prompt.

---

## 📊 4. Current Implementation Status (What is Built)

### Backend Services (FastAPI)
*   **Auth Router (`/auth`)**: JWT-based login, registration, password hashing, and user authentication.
*   **AI Service (`ai_service.py`)**: Prioritized model fallback chain (rotating automatically from `gemini-flash-latest` down to `gemini-1.5-pro` if rate limits (HTTP 429) are encountered).
*   **Resume Synthesis (`resume.py`)**: Endpoints to merge user profiles and GitHub repos into structured, ATS-compliant formats.
*   **Mock Interview Router (`interviews.py`)**: Active sessions tracker, managing question pools for multiple BTech roles (DevOps, Data Science, Front/Backend) and providing detailed scores out of 10.
*   **Database Schema (`reset_local_db.py`)**: Local schemas are fully aligned. Discrepancy errors have been resolved, and a default user is seeded (`test@hireflow.ai` / `admin123`).

### Frontend Web (Next.js)
*   **Dashboard & Profiles**: Glassmorphic UI layouts displaying core identity parameters.
*   **GitHub Connection**: Fully functioning OAuth redirects, callback handling, and manual synchronization triggers.
*   **Resume Builder**: Dynamic selection of templates (`modern`, `creative`, `minimal`, `professional`) and PDF ReportLab generation.

---

## 🛣️ 5. Active Roadmap & Future Plans

The project is structured around three main upcoming phases to complete the pipeline:

### Step 1: Upgrading the Voice Interview Coach (In Progress)
*   **Objective**: Replace the voice simulator's dummy text buttons.
*   **Plan**: Integrate native Web Speech APIs (`webkitSpeechRecognition` to transcribe verbal speech, and `speechSynthesis` to speak out the interview questions).

### Step 2: Advanced Resume OCR Parser
*   **Objective**: Convert uploaded legacy PDF resumes into structured profiles automatically.
*   **Plan**: Send raw PDF texts through the Gemini API service, requesting a structured schema that automatically populates the user's skills and experience tables.

### Step 3: Production Deployment & Domain Connection
*   **Objective**: Take the application live on the cloud.
*   **Plan**: Deploy Next.js to Vercel (linked to a custom domain), run FastAPI on Railway, and migrate PostgreSQL and MongoDB to serverless cloud providers (Neon and MongoDB Atlas).
