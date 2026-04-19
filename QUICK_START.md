# 🎯 Fast Start Guide - Running the Complete System

**Goal:** Get your fully functional resume ecosystem running in < 5 minutes!

---

## 📋 Pre-Checks

Before starting, verify you have:

- ✅ Docker Desktop installed and running
- ✅ Python 3.9+ installed
- ✅ Node.js 18+ installed
- ✅ All code synced (git pull latest)

**Check versions:**

```bash
python --version        # Should be 3.9+
node --version         # Should be 18+
docker --version       # Should be 4.0+
```

---

## ⚡ The 3-Terminal Method (Simplest)

### Terminal 1: Start Databases

```bash
cd c:\Users\sriya\Desktop\Learner\ExtractResume-Ecosystem
docker-compose up -d
```

Wait until all services show `Up`:

- postgres_1 (Port 5432)
- mongodb_1 (Port 27017)
- redis_1 (Port 6379)

**Verify:**

```bash
docker-compose ps
```

Expected output: 3 containers running

---

### Terminal 2: Start Backend

```bash
cd c:\Users\sriya\Desktop\Learner\ExtractResume-Ecosystem\backend
python -m venv venv
venv\Scripts\activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Wait for:

```
Uvicorn running on http://0.0.0.0:8000
```

**Verify:** Open http://localhost:8000/docs (Interactive API docs appear)

---

### Terminal 3: Start Frontend

```bash
cd c:\Users\sriya\Desktop\Learner\ExtractResume-Ecosystem\frontend
npm install
npm run dev
```

Wait for:

```
ready - started server on 0.0.0.0:3000/
```

**Verify:** Open http://localhost:3000

---

## 🎬 Now Test Everything!

### 1. **Create an Account**

- Go to http://localhost:3000
- Click "Sign Up"
- Fill in: Email, Password, Name
- Click "Register"
- ✅ Should redirect to dashboard

### 2. **Create Your First Resume (Feature 1)**

- From dashboard, click "Resume Management" (or `/resume`)
- Click "Build Resume" or "Create New"
- Select a template (Modern/Professional/Creative/Minimal)
- Fill in the form:
  - **Title:** "Senior Full Stack Developer"
  - **Summary:** Add bio
  - **Skills:** Add 5 skills (Python, React, Docker, AWS, PostgreSQL)
  - **Education:** Add degree
  - **Experience:** Add 2 jobs
- Click "Save Resume"
- ✅ Resume appears in list

### 3. **Edit Your Resume (Feature 2)**

- From resume list, click "Edit" button
- Click different tabs (Basic, Skills, Education, Experience)
- Make edits (change title, add more skills)
- Click "Save All Changes"
- ✅ Version number increments

### 4. **Check ATS Score (Feature 3)**

- From resume list, click "Check ATS" button
- 📊 Circular score displays (should be 60-85%)
- View matched skills (green pills)
- View missing skills (orange pills)
- See formatting suggestions
- ✅ All content loads correctly

### 5. **Export as DOCX (Feature 4)**

- From any page, click "Export" button
- Modal appears with options
- Click "Download as DOCX"
- ✅ File downloads to Downloads folder
- Open in Word to verify formatting

---

## 🔧 One-Command Setup (Advanced)

Create `startup.ps1` in project root:

```powershell
# startup.ps1
Write-Host "🚀 Starting ExtractResume Ecosystem..." -ForegroundColor Green

# Start Docker
Write-Host "`n📦 Starting Docker services..." -ForegroundColor Blue
docker-compose up -d
Start-Sleep -Seconds 10

# Start Backend in new window
Write-Host "`n🔧 Starting Backend (port 8000)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python -m venv venv; venv\Scripts\activate.ps1; python -m pip install -r requirements.txt; python -m uvicorn app.main:app --reload"

Start-Sleep -Seconds 3

# Start Frontend in new window
Write-Host "`n⚛️  Starting Frontend (port 3000)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm install; npm run dev"

Write-Host "`n✅ All services starting!" -ForegroundColor Green
Write-Host "   Backend: http://localhost:8000" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "   API Docs: http://localhost:8000/docs" -ForegroundColor Yellow
```

Run with:

```bash
.\startup.ps1
```

---

## 🌐 Access Points

Once running, access:

| Service          | URL                        | Purpose            |
| ---------------- | -------------------------- | ------------------ |
| Frontend         | http://localhost:3000      | Main application   |
| Backend API Docs | http://localhost:8000/docs | API testing        |
| Backend API      | http://localhost:8000      | API calls          |
| PostgreSQL       | localhost:5432             | Database (pgAdmin) |

---

## 🎨 Testing the 4 Features

### Feature 1: Resume Builder

```
Path: /resume-builder
Test: Create resume with template
Expected: Resume saved to database
Visual: Template selection → Form with 5 tabs → Success message
```

### Feature 2: Resume Editor

```
Path: /resume-editor?id={resume_id}
Test: Edit each tab and save
Expected: Version increments, changes persisted
Visual: Tab navigation → Inline editing → Save/discard
```

### Feature 3: ATS Checker

```
Path: /ats-checker?id={resume_id}
Test: View score, skills, suggestions
Expected: Score 0-100, skill matching, formatting tips
Visual: Circular score → Matched/missing skills → Issues/suggestions
```

### Feature 4: Export Feature

```
Components: Export button on (resume.tsx, resume-editor.tsx, ats-checker.tsx)
Test: Click export, download DOCX
Expected: File downloads with proper formatting
Visual: Modal → DOCX button → Download to Downloads folder
```

---

## ✅ Verification Checklist

Before declaring success:

- [ ] Docker services running (`docker-compose ps` shows 3 Up)
- [ ] Backend server running (port 8000, http://localhost:8000/docs loads)
- [ ] Frontend server running (port 3000, http://localhost:3000 loads)
- [ ] Can sign up and login
- [ ] Can create resume (Feature 1)
- [ ] Can edit resume (Feature 2)
- [ ] Can check ATS score (Feature 3)
- [ ] Can export as DOCX (Feature 4)
- [ ] No console errors (F12 → Console tab)
- [ ] No network errors (F12 → Network tab)
- [ ] UI looks beautiful (dark theme with blue/orange/purple)
- [ ] All buttons work

---

## 🆘 Troubleshooting

### Issue: `Port 3000 already in use`

```bash
# Windows: Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID {PID} /F

# Then restart in new terminal
```

### Issue: `Backend connection refused`

```bash
# Check if backend is running
curl http://localhost:8000/docs

# If not, verify:
# 1. You're in ./backend directory
# 2. Virtual environment activated
# 3. Run: python -m uvicorn app.main:app --reload
```

### Issue: `PostgreSQL connection failed`

```bash
# Check Docker
docker-compose ps

# If postgres not running:
docker-compose restart postgres

# Check logs:
docker-compose logs postgres
```

### Issue: `npm install fails`

```bash
# Clear cache
npm cache clean --force

# Delete node_modules
rm -r frontend/node_modules

# Reinstall
cd frontend && npm install
```

### Issue: `Token/Auth errors`

```bash
# Check localStorage for token
# Open browser DevTools (F12) → Application → Local Storage
# Should have 'token' or 'auth' key

# If not, sign out and sign in again
```

---

## 📊 Performance Notes

First run performance:

- Backend startup: 5-10 seconds
- Frontend build: 15-30 seconds (first time)
- Database init: 5-10 seconds

Subsequent runs are much faster:

- Backend: 2-3 seconds with hot reload
- Frontend: 1-2 seconds with cache

---

## 🎓 Next Steps After Running

### Test Each Feature

1. ✅ Create a resume with template
2. ✅ Edit it with multiple changes
3. ✅ Check ATS score
4. ✅ Export to DOCX

### Try Edge Cases

1. Create resume with minimal info
2. Create multiple resumes
3. Edit and re-save same resume
4. Export and open in Microsoft Word
5. Try different browsers (Chrome, Firefox, Safari)

### Monitor Performance

- Open DevTools (F12)
- Network tab: Check response times
- Console tab: Watch for errors
- Performance tab: Monitor load times

---

## 📈 What You'll See

### Login Page

- Beautiful dark theme
- Email/password inputs
- Sign up link
- Modern gradient background

### Dashboard

- Navigation sidebar
- Welcome section
- Quick links to features

### Resume Hub

- List of your resumes
- Edit button (Blue)
- Check ATS button (Purple)
- Export button (Orange)
- Create new resume option

### Resume Builder

- Template selection (4 cards)
- Multi-step form
- Progress indicator
- Form validation

### Resume Editor

- Tab-based interface
- Real-time editing
- Save button
- Version tracking

### ATS Checker

- Circular score display
- Matched skills section
- Missing skills section
- Formatting analysis
- Suggestions

### Export

- Modal dialog
- Format selector
- Download button
- Success notification

---

## 🎉 You're All Set!

Your fully functional, beautifully designed resume management system is ready to use!

**Commands to save:**

```bash
# Start everything
docker-compose up -d
cd backend && python -m uvicorn app.main:app --reload
cd frontend && npm run dev

# Stop everything
docker-compose down
# (Backend and Frontend stop automatically)
```

---

**Enjoy your production-ready resume ecosystem!** ✨
