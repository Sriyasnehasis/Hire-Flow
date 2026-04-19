# Backend Activation & Testing Guide

This guide will help you activate the backend server and verify all endpoints are working.

## Prerequisites

- Python 3.8+
- Docker & Docker Compose (recommended)
- PostgreSQL 12+ (if not using Docker)
- Node.js 16+ (for frontend)

---

## Quick Start (Recommended: Using Docker)

### 1. Create .env File

Create a `.env` file in the backend directory:

```bash
# Copy from example
cd backend
cp ../.env.example .env  # or manually create from example below
```

**Content of .env:**

```
# Database Configuration
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=extractresume
POSTGRES_URL=postgresql://user:password@localhost:5432/extractresume
MONGO_URL=mongodb://localhost:27017

# Security
SECRET_KEY=your-super-secret-key-here-change-in-production
DEBUG=True

# Email (Optional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=app-specific-password

# API Keys (Optional)
OPENAI_API_KEY=sk-
ADZUNA_API_KEY=

# Deployment
FRONTEND_URL=http://localhost:3000
```

### 2. Start Docker Services

```bash
# From workspace root
docker-compose up -d

# Verify all services are running
docker-compose ps
```

**Expected Output:**

```
NAME              COMMAND          SERVICE      STATUS      PORTS
postgres          postgres         postgres     Up          5432/tcp
mongodb           mongod           mongodb      Up          27017/tcp
```

### 3. Initialize Database

```bash
# Backend models will auto-create on first run
# But you can manually run migrations if needed

cd backend
python -m pip install -r requirements.txt
python -c "from app.core.db import engine, Base; from app.models import *; Base.metadata.create_all(bind=engine)"
```

### 4. Start Backend Server

**Option A: With Auto-reload (Development)**

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Option B: Without Auto-reload (Production)**

```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Expected Output:**

```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

### 5. Verify Backend is Running

```bash
# In another terminal
curl http://localhost:8000/
# Expected response: {"status": "online", "message": "..."}
```

### 6. Start Frontend (Optional)

```bash
cd frontend
npm install
npm run dev
```

Access frontend at: http://localhost:3000

---

## Testing the API

### Using curl Commands

**Test Health Check:**

```bash
curl http://localhost:8000/
```

**Test Auth Endpoints:**

1. **Signup**

```bash
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "full_name": "Test User",
    "phone": "+1234567890"
  }'
```

Expected Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

2. **Login**

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

3. **Get Current User (with token)**

```bash
# Replace TOKEN with the access_token from signup/login
TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X GET http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman

1. Open Postman
2. Import from workspace: `ExtractResume Ecosystem/bruno.json` or create collection
3. Set base URL: `http://localhost:8000`
4. Create requests for each endpoint
5. After signup/login, copy access_token to Authorization header

### Using Bruno (Recommended)

```bash
# Open Bruno IDE
# File → Open Collection
# Navigate to: ExtractResume Ecosystem/bruno.json
# Set Environment: Local Development
# Run requests
```

---

## Troubleshooting

### Issue: "Connection refused" (127.0.0.1:8000)

**Solution:**

- Verify backend is running: `python -m uvicorn app.main:app --reload`
- Check port 8000 is not in use: `netstat -ano | findstr :8000`
- Restart backend server

### Issue: "relation 'user' does not exist"

**Solution:**

```bash
# Reinitialize database
python -c "from app.core.db import engine, Base; from app.models import *; Base.metadata.drop_all(bind=engine); Base.metadata.create_all(bind=engine)"
```

### Issue: "POSTGRES_URL" not found

**Solution:**

- Verify .env file exists in backend folder
- Check POSTGRES_URL is set correctly
- On Windows, use forward slashes: `postgresql://user:password@localhost:5432/extractresume`

### Issue: 422 Validation Error on Signup

**Solutions:**

1. Verify email format: must be valid email
2. Password must be 8+ characters
3. Check JSON body is valid
4. Verify headers include `Content-Type: application/json`

### Issue: 403 Unauthorized on Protected Endpoints

**Solutions:**

1. Get token from `/auth/login` or `/auth/signup`
2. Include in request: `Authorization: Bearer <token>`
3. Verify token is not expired (30 min default)
4. Try refreshing token: `POST /api/v1/auth/refresh`

### Issue: Docker containers not starting

**Solutions:**

```bash
# Check logs
docker-compose logs postgres
docker-compose logs mongodb

# Restart services
docker-compose restart

# Full reset
docker-compose down -v  # Warning: deletes data
docker-compose up -d
```

---

## Full Verification Script

After everything is running, execute the verification script:

```bash
# From workspace root
python verify_segment_d.py
```

**Expected Output:**

```
Models:          4/4 ✓
API Endpoints:   18/18 ✓
Frontend Pages:  7/7 ✓
Components:      2/2 ✓
Infrastructure:  3/3 ✓
Test Files:      2/2 ✓

Total Items:     36/36
Completion:      100.0%
```

---

## Next Steps After Activation

1. **Test User Flow:**
   - Signup with new account
   - Login with created account
   - Update profile
   - Upload resume
   - View job recommendations

2. **Configure External Services:**
   - Get OpenAI API key for resume analysis
   - Get Adzuna API key for job search
   - Set up GitHub OAuth for social login
   - Configure email notifications

3. **Development:**
   - Customize UI components
   - Add more job filters
   - Implement advanced search
   - Set up notifications

---

## Development Commands

```bash
# Install Python dependencies
pip install -r requirements.txt

# Run tests
pytest tests/

# Format code
black app/
isort app/

# Lint code
flake8 app/

# Type checking
mypy app/
```

---

## Production Setup

For production deployment:

1. **Environment Variables**

   ```bash
   DEBUG=False
   SECRET_KEY=<very-long-random-string>
   POSTGRES_URL=<production-db-url>
   FRONTEND_URL=<production-domain>
   ```

2. **Security**

   ```bash
   # Generate secure secret key
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

3. **Database**
   - Use managed PostgreSQL service
   - Enable SSL connections
   - Set up regular backups
   - Configure connection pooling

4. **Deploy**
   ```bash
   docker build -t extractresume:latest .
   docker push <registry>/extractresume:latest
   # Deploy to Kubernetes, AWS ECS, etc.
   ```

---

## Support Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [JWT Documentation](https://tools.ietf.org/html/rfc7519)

---

**Ready to activate? Start with Step 1: Create .env File**
