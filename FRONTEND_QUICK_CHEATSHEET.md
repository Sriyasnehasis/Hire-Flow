# 🎯 Quick Access Cheatsheet

## 🚀 Start Everything (Copy-Paste Ready)

### In PowerShell Terminal 1 (Docker + Databases)

```powershell
cd C:\Users\sriya\Desktop\Learner\ExtractResume-Ecosystem
docker-compose up -d
```

### In PowerShell Terminal 2 (Backend)

```powershell
cd C:\Users\sriya\Desktop\Learner\ExtractResume-Ecosystem\backend
python -m venv venv
venv\Scripts\activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### In PowerShell Terminal 3 (Frontend)

```powershell
cd C:\Users\sriya\Desktop\Learner\ExtractResume-Ecosystem\frontend
npm install
npm run dev
```

---

## 🌐 Open These URLs

| What         | URL                          |
| ------------ | ---------------------------- |
| **Main App** | http://localhost:3000        |
| **API Docs** | http://localhost:8000/docs   |
| **API Base** | http://localhost:8000/api/v1 |

---

## 🧪 Test These Features (In Order)

1. **Create Account** (If new)
   - Go to http://localhost:3000
   - Click "Sign Up"
   - Register with email/password

2. **Build Resume** ⭐
   - Click "Build Resume"
   - Select template (Modern/Professional/Creative/Minimal)
   - Fill form with info (Title, Skills, Education, Experience)
   - Click "Save Resume"
   - ✅ Should appear in resume list

3. **Edit Resume** ⭐
   - From resume list, click "Edit"
   - Try editing each tab (5 tabs)
   - Click "Save All Changes"
   - ✅ Version should increment

4. **Check ATS** ⭐
   - From resume list, click "Check ATS"
   - View circular score (0-100)
   - See matched/missing skills
   - View suggestions
   - ✅ All components should display

5. **Export DOCX** ⭐
   - Click "Export" button (anywhere on page)
   - Click "Download as DOCX"
   - ✅ File should download to Downloads folder
   - Open in Microsoft Word to verify

---

## 📊 What You'll See

### Pages You Can Visit

```
http://localhost:3000/              → Home
http://localhost:3000/login         → Login
http://localhost:3000/signup        → Sign Up
http://localhost:3000/dashboard     → Dashboard
http://localhost:3000/resume        → Resume Hub (Main)
http://localhost:3000/resume-builder → Build Resume
http://localhost:3000/resume-editor?id=1 → Edit Resume
http://localhost:3000/ats-checker?id=1   → Check ATS Score
```

### Visual Theme

- **Dark Mode** (Slate 900 background)
- **Blue & Orange Buttons** (Edit, Export)
- **Purple Accent** (Check ATS)
- **Green for Success** (Matched skills)
- **Professional** design

---

## 🔍 Key Endpoints

### Create Resume

```
POST /api/v1/resumes/create
Body: {
  "title": "Senior Developer",
  "template": "modern",
  "resume_data": { ... }
}
```

### Edit Resume

```
PUT /api/v1/resumes/{id}
Body: {
  "title": "Updated Title",
  "resume_data": { ... }
}
```

### Get ATS Analysis

```
GET /api/v1/resumes/{id}/ats-analysis
Response: {
  "score": 78,
  "matched_skills": [...],
  "missing_skills": [...],
  "suggestions": [...]
}
```

### Export DOCX

```
GET /api/v1/resumes/{id}/export/docx
Response: Binary DOCX file (downloads)
```

---

## ⚡ Common Issues & Fixes

| Issue                      | Fix                                               |
| -------------------------- | ------------------------------------------------- |
| Page doesn't load          | Check http://localhost:3000 is running            |
| API errors (500)           | Check http://localhost:8000/docs is accessible    |
| Database connection failed | Run `docker-compose ps` to check services         |
| "Port already in use"      | Kill process: `taskkill /PID [PID] /F`            |
| Export button disabled     | Make sure you're logged in with valid token       |
| Styles not loading         | Clear browser cache: Ctrl+Shift+Delete            |
| DOCX not downloading       | Check browser Downloads, check console for errors |

---

## 📈 Things to Test

- [ ] Create resume with different templates
- [ ] Edit resume and change information
- [ ] Export resume to DOCX
- [ ] Check ATS score on different resumes
- [ ] Try on mobile (responsive design)
- [ ] Try different browsers (Chrome, Firefox, Safari)
- [ ] Create multiple resumes
- [ ] Edit same resume multiple times (version tracking)
- [ ] Export multiple times (should work each time)
- [ ] Check console (F12) for errors

---

## 📱 Responsive Design Test

After opening http://localhost:3000:

```
Desktop (Full):    Everything works normally
Tablet (640px):    Sidebar collapses, cards adjust
Mobile (320px):    Single column, buttons stack, text readable
```

Press F12 → Ctrl+Shift+M to test mobile view

---

## 🎨 UI Colors Reference

```
Primary Button (Blue):    #2563eb
Export Button (Orange):   #ea580c
ATS Button (Purple):      #7c3aed
Matched Skills (Green):   #10b981
Missing Skills (Orange):  #ea580c
Issues (Red):             #ef4444
Background (Dark):        #0f172a
Borders (Gray):           #334155
Text (Light):             #f1f5f9
```

---

## ✅ Success Criteria

Your system is working when:

- ✅ http://localhost:3000 loads without errors
- ✅ Can log in with email/password
- ✅ Can create a resume with template
- ✅ Can edit resume and save changes
- ✅ Can check ATS score (shows 0-100)
- ✅ Can export resume as DOCX
- ✅ No red errors in browser console (F12)
- ✅ All 4 features accessible from dashboard
- ✅ Dark theme renders correctly
- ✅ Mobile view responsive

---

## 📚 Documentation Files

```
FRONTEND_UI_SHOWCASE.md          ← Detailed UI breakdown
FRONTEND_UI_VISUAL_REFERENCE.md  ← Design details & colors
QUICK_START.md                   ← Setup instructions
ALL_FEATURES_COMPLETE_SUMMARY.md ← Feature overview
QUICK_REFERENCE_GUIDE.md         ← API & architecture
```

---

## 🎉 Ready to Go!

You have:

- ✅ All 4 features implemented
- ✅ Beautiful dark-themed UI
- ✅ Responsive design
- ✅ Professional components
- ✅ Server running on port 8000
- ✅ Frontend ready on port 3000

**Just run the commands above and open http://localhost:3000!**

---

## 🚨 Support Checklist

Before asking for help:

- [ ] Docker is running (`docker-compose ps`)
- [ ] Backend started without errors
- [ ] Frontend started without errors
- [ ] Console (F12) checked for errors
- [ ] Network tab (F12) checked for failed requests
- [ ] Tried clearing browser cache

---

**Your fully functional resume management system is ready!** 🚀✨
