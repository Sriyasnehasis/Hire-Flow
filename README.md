# 🎯 ExtractResume AI - Placement Assistant Platform

An AI-powered placement preparation & job application automation platform for BTech students.

## 📋 Project Overview

**Vision**: Help college students automate job applications, optimize resumes, and prepare for interviews with AI.

**Target Users**: BTech/BE students (3rd-4th year) preparing for placements

**Core Features**:

- ✅ Automated job applications
- ✅ Resume ATS optimization
- ✅ Skill gap analysis + learning roadmaps
- ✅ AI mock interviews with feedback
- ✅ 1-click bulk job applications
- ✅ Centralized job tracking dashboard
- ✅ HR contact discovery & outreach automation
- ✅ GitHub & LinkedIn integration

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose (recommended)
- PostgreSQL 15+
- MongoDB 7+
- Redis 7+

### Option 1: Docker Compose (Recommended)

```bash
# Clone repository
cd c:\Users\sriya\Desktop\Learner\ExtractResume-Ecosystem

# Create .env file
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start all services
docker-compose up -d

# Access:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8000
# - PostgreSQL: localhost:5432
# - MongoDB: localhost:27017
# - Redis: localhost:6379
```

### Option 2: Local Development

#### Backend Setup

**Windows (PowerShell) — recommended:**

```powershell
cd backend

# Run the setup script (handles venv creation, activation, and dependency install)
.\setup.ps1

# Activate the virtual environment
.\venv\Scripts\Activate.ps1

# Copy and configure environment variables
Copy-Item .env.example .env

# Start backend server
python -m uvicorn app.main:app --reload
```

> **Note:** If you see a PowerShell execution policy error, run:
> `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

**Linux / macOS:**

```bash
cd backend

# Run the setup script (handles venv creation and dependency install)
bash setup.sh

# Activate the virtual environment
source venv/bin/activate

# Copy and configure environment variables
cp .env.example .env

# Start backend server
python -m uvicorn app.main:app --reload
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Start frontend dev server
npm run dev
```

---

## 📁 Project Structure

```
ExtractResume-Ecosystem/
├── frontend/                 # Next.js React app
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Next.js pages
│   │   ├── app/             # Next.js 13+ app directory
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities & API client
│   │   └── styles/          # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── Dockerfile
│
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI app initialization
│   │   ├── api/            # API route handlers
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── jobs.py
│   │   │   ├── applications.py
│   │   │   ├── resume.py
│   │   │   ├── interviews.py
│   │   │   └── hr_contacts.py
│   │   ├── models/         # SQLAlchemy ORM models
│   │   ├── services/       # Business logic
│   │   │   ├── ai_service.py
│   │   │   ├── resume_parser.py
│   │   │   ├── email_service.py
│   │   │   ├── linkedin_service.py
│   │   │   ├── github_service.py
│   │   │   ├── adzuna.py
│   │   │   └── ats_analyzer.py
│   │   ├── schemas/        # Pydantic request/response models
│   │   ├── core/
│   │   │   ├── db.py       # Database connection
│   │   │   ├── config.py   # Settings & configuration
│   │   │   └── security.py # JWT & password hashing
│   │   └── workers/        # Background job workers
│   ├── requirements.txt
│   ├── .env.example
│   ├── Dockerfile
│   └── .dockerignore
│
├── chrome-extension/        # Chrome extension for job apply
│   ├── manifest.json
│   ├── popup.html/js
│   ├── content.js
│   └── dashboard.html/js
│
├── docs/                    # Documentation
│   ├── API_SPECIFICATION.md
│   ├── PROJECT_ARCHITECTURE.md
│   ├── DATABASE_MODELS.py
│   └── README_DOCUMENTATION.md
│
├── docker-compose.yml       # Docker Compose configuration
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────┐
│          User Interfaces                      │
├──────────┬────────────────┬──────────────────┤
│ Frontend │ Chrome Ext     │ Mobile (Future)  │
│ (Next.js)│ (Job Apply)    │                  │
└────┬─────┴────────┬───────┴──────────────────┘
     │              │
     └──────┬───────┘
            │
      ┌─────▼──────┐
      │  API (FastAPI)
      └─────┬──────┘
            │
    ┌───────┼────────┐
    │       │        │
┌───▼──┐ ┌──▼──┐ ┌──▼──┐
│Auth  │ │Jobs │ │ AI   │
│      │ │     │ │      │
└──────┘ └─────┘ └──────┘
    │       │        │
    └───────┼────────┘
            │
    ┌───────▼────────────┐
    │   PostgreSQL (SQL) │
    │   MongoDB (NoSQL)  │
    │   Redis (Cache)    │
    └────────────────────┘
```

---

## 🔧 Technology Stack

### Frontend

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form

### Backend

- **Framework**: FastAPI (Python 3.11)
- **Database**: PostgreSQL (relational) + MongoDB (document)
- **Cache**: Redis
- **Authentication**: JWT tokens + Bcrypt
- **Async**: FastAPI with async/await
- **Job Queue**: Celery (optional)

### DevOps

- **Containerization**: Docker & Docker Compose
- **Web Server**: Uvicorn (FastAPI) + Gunicorn (production)
- **Reverse Proxy**: Nginx (optional)

### External APIs

- **OpenAI GPT**: For AI features (interview prep, cover letters)
- **Adzuna API**: For job listings
- **LinkedIn API**: For scraping contacts
- **GitHub API**: For profile integration
- **Email Service**: SMTP / SendGrid

---

## 🚀 Development Roadmap

### Phase 1: MVP (Weeks 1-6)

- [x] Database schema design
- [x] Backend API structure
- [x] Frontend setup
- [ ] User authentication
- [ ] Resume upload & ATS analysis
- [ ] Job listings & manual apply
- [ ] Dashboard & profile management

### Phase 2: AI & Automation (Weeks 7-10)

- [ ] Mock interviews with AI feedback
- [ ] Automated cover letter generation
- [ ] Skill gap analysis & learning paths
- [ ] Chrome extension for 1-click apply
- [ ] Email automation

### Phase 3: Advanced Features (Weeks 11-12)

- [ ] LinkedIn/GitHub integration
- [ ] HR contact discovery
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Database
POSTGRES_URL=postgresql://user:password@localhost/extractresume
MONGO_URL=mongodb://localhost:27017

# Security
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256

# Email
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-password

# External APIs
OPENAI_API_KEY=sk-...
ADZUNA_API_KEY=...
GITHUB_TOKEN=ghp_...
LINKEDIN_ACCESS_TOKEN=...

# AWS (for file storage)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET_NAME=extractresume-files
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=ExtractResume AI
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest tests/
pytest --cov=app  # With coverage
```

### Frontend Tests

```bash
cd frontend
npm run test
npm run test:coverage
```

---

## 📚 API Documentation

Complete API documentation is available at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **API Spec**: [API_SPECIFICATION.md](docs/API_SPECIFICATION.md)

### Key Endpoints:

```
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
GET    /api/v1/users/me
POST   /api/v1/resumes/upload
GET    /api/v1/jobs
POST   /api/v1/applications/{job_id}/apply
POST   /api/v1/interviews/start-session
GET    /api/v1/hr-contacts
```

---

## 🐛 Troubleshooting

### Permission Denied When Creating venv (Windows)

```
Error: [Errno 13] Permission denied: '...\backend\venv\Scripts\python.exe'
```

This happens when the existing `venv` directory is locked by another process (e.g., VS Code, a running terminal, or the Python process itself).

**Fix:**

1. Close VS Code and all terminals that are inside the `backend` directory.
2. Use the provided setup script which automatically deletes the old venv and recreates it:

   ```powershell
   cd backend
   .\setup.ps1
   ```

   Or, manually delete the venv and recreate:

   ```powershell
   Remove-Item -Recurse -Force venv
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

3. If deletion still fails, open Task Manager and kill any `python.exe` processes, then retry.

### No module named uvicorn

```
No module named uvicorn
```

This means `uvicorn` (and likely all backend dependencies) are not installed in your current Python environment. You need to activate the virtual environment first, then install:

```powershell
# Windows
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

```bash
# Linux / macOS
source venv/bin/activate
pip install -r requirements.txt
```

Alternatively, run `uvicorn` through the venv Python directly (no need to activate):

```powershell
# Windows
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

```bash
# Linux / macOS
venv/bin/python -m uvicorn app.main:app --reload
```

### Database Connection Issues

```bash
# Test database connection
docker-compose logs postgres

# Recreate database
docker-compose down -v
docker-compose up -d postgres
```

### Backend Port Already in Use

```bash
# Change port in docker-compose.yml or backend/.env
BACKEND_PORT=8001
```

### Frontend Build Issues

```bash
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

---

## 📝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👥 Team

**Your Name** - Full Stack Developer

---

## 📞 Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Email: your-email@example.com
- Documentation: [docs/](docs/)

---

## 🎓 Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [MongoDB Docs](https://docs.mongodb.com/)

---

**Happy Coding! 🚀**
