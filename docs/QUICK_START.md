# ⚡ Quick Start Guide

Get ExtractResume AI running in 5 minutes!

## Option 1: Docker Compose (Easiest ✨)

### Requirements

- Docker & Docker Compose installed

### Steps

```bash
# 1. Navigate to project
cd c:\Users\sriya\Desktop\Learner\ExtractResume-Ecosystem

# 2. Setup environment
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Start all services
docker-compose up -d

# 4. Wait 30 seconds for services to start, then visit:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Verify Setup

```bash
# Check all containers running
docker-compose ps

# View backend logs
docker-compose logs backend

# Test API
curl http://localhost:8000/
```

---

## Option 2: Local Development

### Backend

```bash
# 1. Enter backend directory
cd backend

# 2. Create & activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows
# or
source venv/bin/activate  # Linux/Mac

# 3. Install dependencies
pip install -r requirements.txt

# 4. Setup environment
cp .env.example .env

# 5. Update .env with your database URL
# POSTGRES_URL=postgresql://user:password@localhost/extractresume_db

# 6. Start backend
uvicorn app.main:app --reload

# Backend running at: http://localhost:8000
```

### Frontend

```bash
# 1. Enter frontend directory (new terminal)
cd frontend

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local

# 4. Start frontend dev server
npm run dev

# Frontend running at: http://localhost:3000
```

---

## First Steps After Setup

### 1. Check API Documentation

Visit http://localhost:8000/docs to see all available endpoints

### 2. Test Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "full_name": "Test User",
    "phone": "+91-9876543210"
  }'
```

### 3. Access Frontend

Open http://localhost:3000 in your browser

### 4. Explore Database

```bash
# PostgreSQL
docker-compose exec postgres psql -U extractresume_user -d extractresume_db

# MongoDB (if using)
docker-compose exec mongodb mongosh
```

---

## Stop Services

```bash
# Docker
docker-compose down

# Local
# Press Ctrl+C in both backend and frontend terminals
```

---

## Next Steps

- Read [SETUP.md](./SETUP.md) for detailed setup
- Check [DOCKER.md](./DOCKER.md) for Docker details
- Review [ARCHITECTURE.md](../ExtractResume%20Ecosystem/PROJECT_ARCHITECTURE.md)
- Start building! 🚀
