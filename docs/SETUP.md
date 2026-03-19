# 🚀 Backend Setup Guide

## Prerequisites

- Python 3.11+
- pip (Python package manager)
- PostgreSQL 15+
- MongoDB 7+ (optional, for document storage)
- Redis 7+ (optional, for caching)

## Local Development Setup

### Step 1: Create Virtual Environment

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\Activate.ps1

# Linux/Mac:
source venv/bin/activate
```

### Step 2: Install Dependencies

```bash
# Upgrade pip
pip install --upgrade pip

# Install requirements
pip install -r requirements.txt
```

### Step 3: Setup Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
# IMPORTANT: Change SECRET_KEY to a secure value
```

### Step 4: Database Setup

#### Option A: Using Local PostgreSQL

```bash
# Create database
createdb extractresume_db

# Create user
createuser extractresume_user --interactive
# When prompted for password: extractresume_password
```

Then update `.env`:

```env
POSTGRES_URL=postgresql://extractresume_user:extractresume_password@localhost/extractresume_db
```

#### Option B: Using Docker

```bash
# Install and start PostgreSQL with Docker
docker run --name extractresume_postgres \
  -e POSTGRES_USER=extractresume_user \
  -e POSTGRES_PASSWORD=extractresume_password \
  -e POSTGRES_DB=extractresume_db \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### Step 5: Run the Backend

```bash
# From backend directory with venv activated
uvicorn app.main:app --reload
```

Your API should be available at: `http://localhost:8000`

API Docs: `http://localhost:8000/docs`

---

## Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py

# Run with verbose output
pytest -v
```

---

## Common Issues

### ModuleNotFoundError

```bash
# Make sure virtual environment is activated
# Re-install requirements
pip install -r requirements.txt --force-reinstall
```

### Database Connection Error

```bash
# Check PostgreSQL is running
psql -U extractresume_user -d extractresume_db -c "SELECT 1"

# Check connection string in .env
```

### Port Already in Use

```bash
# Run on different port
uvicorn app.main:app --reload --port 8001
```

---

## Next Steps

1. Read [API_SPEC.md](../ExtractResume%20Ecosystem/API_SPECIFICATION.md) for API documentation
2. Check [ARCHITECTURE.md](../ExtractResume%20Ecosystem/PROJECT_ARCHITECTURE.md) for system design
3. Look at test examples in `tests/` folder
