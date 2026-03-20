# ExtractResume AI — Placement Assistant Platform

> An AI-powered job application & placement preparation platform built for BTech students.

---

## What It Does

ExtractResume AI helps engineering students automate their placement journey — from resume optimization to job applications and interview prep — all from one platform.

**Planned Features:**
- Resume ATS scoring & optimization
- AI-powered mock interviews with feedback
- Skill gap analysis with learning roadmaps
- 1-click bulk job applications via Chrome extension
- Automated cover letter generation
- HR contact discovery & email outreach
- Centralized application tracking dashboard
- LinkedIn & GitHub profile integration

---

## Current Stage

> **Infrastructure complete. Feature implementation in progress.**

| Component | Status |
|---|---|
| Project architecture & database schema | ✅ Complete |
| Backend API structure (FastAPI routes) | ✅ Complete (logic pending) |
| Frontend scaffold (Next.js + Tailwind) | ✅ Complete (pages pending) |
| Docker & DevOps setup | ✅ Complete |
| Chrome extension scaffold | ✅ Complete |
| User authentication (JWT) | 🔄 In progress |
| Resume upload & ATS analysis | ⏳ Pending |
| AI features (interviews, cover letters) | ⏳ Pending |
| Job scraping & application automation | ⏳ Pending |
| Email service & outreach automation | ⏳ Pending |
| Frontend components & UI | ⏳ Pending |

---

## Architecture

```
┌─────────────────────────────────┐
│          Client Layer           │
│  Next.js Web  │  Chrome Ext     │
└───────┬────────────────┬────────┘
        │                │
        ▼                ▼
┌────────────────────────────────┐
│       FastAPI Backend          │
│  /auth  /jobs  /resume         │
│  /applications  /interviews    │
│  /users  /hr-contacts          │
└────────────────────────────────┘
        │
        ▼
┌────────────────────────────────┐
│           Data Layer           │
│  PostgreSQL │ MongoDB │ Redis  │
└────────────────────────────────┘
        │
        ▼
┌────────────────────────────────┐
│         External Services      │
│  OpenAI · Adzuna · GitHub      │
│  LinkedIn · SMTP / SendGrid    │
└────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Zustand |
| Backend | FastAPI, Python 3.11, SQLAlchemy, Pydantic |
| Databases | PostgreSQL (relational) + MongoDB (documents) |
| Cache | Redis |
| Auth | JWT + Bcrypt |
| DevOps | Docker, Docker Compose, Uvicorn |
| AI | OpenAI GPT (interviews, cover letters) |
| Job Data | Adzuna API |
| Integrations | GitHub API, LinkedIn API |

---

## Project Structure

```
ExtractResume-Ecosystem/
├── backend/
│   └── app/
│       ├── api/          # Route handlers (auth, jobs, resume, interviews…)
│       ├── models/       # SQLAlchemy ORM models
│       ├── schemas/      # Pydantic request/response schemas
│       ├── services/     # Business logic (AI, ATS, email, scraping…)
│       └── core/         # Config, DB connection, JWT security
├── frontend/
│   └── src/
│       ├── app/          # Next.js 13+ app directory
│       ├── components/   # UI components
│       ├── hooks/        # Custom React hooks
│       └── lib/          # API client & utilities
├── chrome-extension/     # 1-click job apply extension
├── docs/                 # Architecture, API spec, setup guides
└── docker-compose.yml    # Full stack local environment
```

---

## Quick Start

### Docker (Recommended)

```bash
git clone https://github.com/Sriyasnehasis/ExtractResume-Ecosystem.git
cd ExtractResume-Ecosystem

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

docker-compose up -d
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

### Local Development

**Backend:**
```bash
cd backend
bash setup.sh          # Linux/macOS
# or: .\setup.ps1       # Windows PowerShell

source venv/bin/activate
cp .env.example .env
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

---

## API Endpoints

```
POST  /api/v1/auth/signup
POST  /api/v1/auth/login
GET   /api/v1/users/me
POST  /api/v1/resumes/upload
GET   /api/v1/jobs
POST  /api/v1/applications/{job_id}/apply
POST  /api/v1/interviews/start-session
GET   /api/v1/hr-contacts
```

Full spec: [`docs/`](docs/) · Interactive: `http://localhost:8000/docs`

---

## Roadmap

**Phase 1 — MVP** *(Current)*
- [x] Database schema & backend structure
- [x] Frontend scaffold & Docker setup
- [ ] User authentication
- [ ] Resume upload & ATS scoring
- [ ] Job listings & manual apply

**Phase 2 — AI & Automation**
- [ ] AI mock interviews & cover letter generation
- [ ] Chrome extension for 1-click apply
- [ ] Skill gap analysis & learning paths
- [ ] Email outreach automation

**Phase 3 — Advanced**
- [ ] LinkedIn & GitHub integration
- [ ] HR contact discovery
- [ ] Analytics dashboard

---

## Environment Variables

**Backend** (`backend/.env`):
```env
POSTGRES_URL=postgresql://user:pass@localhost/extractresume
MONGO_URL=mongodb://localhost:27017
SECRET_KEY=your-secret-key
OPENAI_API_KEY=sk-...
ADZUNA_API_KEY=...
GITHUB_TOKEN=ghp_...
SMTP_SERVER=smtp.gmail.com
SENDER_EMAIL=your-email@gmail.com
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Developer

**Sriyasnehasis** · [GitHub](https://github.com/Sriyasnehasis/ExtractResume-Ecosystem)

---

## License

MIT
