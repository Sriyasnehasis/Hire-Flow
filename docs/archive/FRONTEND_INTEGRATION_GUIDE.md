# Frontend Integration & User Guide

This guide covers running the frontend, testing the UI, and integrating with the backend API.

---

## Architecture Overview

### Tech Stack

- **Framework:** Next.js 13+ (React with Server/Client Components)
- **Styling:** Tailwind CSS + PostCSS
- **State Management:** React Hooks (useAuth, useState)
- **HTTP Client:** Fetch API wrapper in `lib/api.ts`
- **Authentication:** JWT stored in localStorage/cookies
- **Deployment:** Vercel (Next.js native) or Docker

### Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router (Pages)
│   │   ├── layout.tsx          # Root layout with navigation
│   │   └── page.tsx            # Home page
│   ├── components/             # React Components
│   │   ├── Auth/               # Login, Signup components
│   │   ├── Resume/             # Resume upload, display
│   │   ├── JobSearch/          # Job listing, recommendations
│   │   ├── Dashboard/          # Main dashboard, stats
│   │   ├── Application/        # Application tracking
│   │   ├── Interview/          # Interview scheduling
│   │   └── Navigation/         # Header, sidebar
│   ├── hooks/
│   │   └── useAuth.ts          # Authentication hook
│   ├── lib/
│   │   └── api.ts              # API client
│   ├── pages/                  # Legacy pages (if any)
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── styles/
│   │   └── globals.css
│   └── utils/                  # Utility functions
├── public/                     # Static assets
├── package.json
├── next.config.js
├── tsconfig.json
└── tailwind.config.ts
```

---

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
# or
yarn install
# or
pnpm install
```

### 2. Create .env.local (Frontend Configuration)

Create `frontend/.env.local`:

```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1

# Frontend Configuration
NEXT_PUBLIC_APP_NAME=ExtractResume AI
NEXT_PUBLIC_APP_DESCRIPTION=AI-powered placement assistant

# Optional: Analytics
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_SENTRY_DSN=
```

**Note:**

- Variables prefixed with `NEXT_PUBLIC_` are exposed to browser
- Non-prefixed variables are server-only
- Ensure backend is running on the configured URL

### 3. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

**Expected Output:**

```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Environments: .env.local
```

Access at: **http://localhost:3000**

---

## User Flow & Testing

### Complete User Journey

#### 1. Sign Up Flow

```
Homepage
  ↓
Click "Sign Up" → /signup page
  ↓
Enter email, password, name, phone
  ↓
Submit form → API POST /auth/signup
  ↓
Receive JWT tokens
  ↓
Redirect to Profile/Dashboard
```

**Test Data:**

```
Email: testuser@example.com
Password: SecurePassword123
Full Name: Test User
Phone: +1 (555) 123-4567
```

#### 2. Login Flow

```
/login page
  ↓
Enter email & password
  ↓
API POST /auth/login
  ↓
Store JWT tokens (localStorage)
  ↓
Redirect to Dashboard
```

#### 3. Profile Setup

```
Dashboard → Profile Tab
  ↓
Edit profile data:
  - Skills
  - Experience
  - Education
  - Target roles
  ↓
Save to API PUT /users/me
  ↓
Success notification
```

#### 4. Resume Upload

```
Dashboard → Resume Tab
  ↓
Upload PDF/DOCX file
  ↓
API POST /resume/upload
  ↓
Parse resume
  ↓
Auto-fill profile (optional)
  ↓
API POST /resume/auto-fill-profile
  ↓
View parsed resume preview
```

#### 5. Job Search & Recommendations

```
Dashboard → Jobs Tab
  ↓
View AI-powered recommendations
  ↓
Click job → View details
  ↓
Click "Save Job" → API POST /jobs/save-job
  ↓
Click "Apply" → API POST /applications/apply
```

#### 6. Application Tracking

```
Dashboard → Applications Tab
  ↓
View all applications
  ↓
Click application → Details page
  ↓
View status timeline
  ↓
Add notes → API POST /applications/{id}/notes
  ↓
Schedule interview (if available)
```

---

## Testing the Frontend

### 1. Manual Testing Checklist

**Authentication**

- [ ] Signup with valid email
- [ ] Signup with invalid password (<8 chars)
- [ ] Signup with existing email (error handling)
- [ ] Login with correct credentials
- [ ] Login with wrong password (error)
- [ ] Session persists on page reload
- [ ] Logout clears tokens

**Profile**

- [ ] View current profile
- [ ] Edit profile fields
- [ ] Save changes without errors
- [ ] Profile auto-populates after signup

**Resume**

- [ ] Upload PDF file
- [ ] Upload DOCX file
- [ ] View uploaded resumes list
- [ ] Parse resume successfully
- [ ] Auto-fill profile from resume
- [ ] Delete resume

**Jobs**

- [ ] View job recommendations
- [ ] Search jobs with filters
- [ ] Save job to list
- [ ] View saved jobs
- [ ] See match score

**Applications**

- [ ] Apply to job
- [ ] View application list
- [ ] View application details
- [ ] Add notes to application
- [ ] Update application status

**Navigation**

- [ ] All links work
- [ ] Mobile-responsive
- [ ] Logout redirects to login
- [ ] Protected routes require auth

### 2. Automated Testing

```bash
# Run tests (if configured)
npm run test

# Run tests in watch mode
npm run test -- --watch

# Generate coverage report
npm run test -- --coverage
```

### 3. Browser DevTools Testing

**Check in Console:**

```javascript
// Verify API client is loaded
console.log(window.EXTRACTRESUME_API);

// Check stored tokens
console.log(localStorage.getItem("access_token"));
console.log(localStorage.getItem("refresh_token"));

// Test API call
fetch("http://localhost:8000/")
  .then((r) => r.json())
  .then(console.log);
```

**Check Network Tab:**

- Monitor API requests to `/api/v1/*`
- Verify Authorization header is sent
- Check response status codes
- Confirm CORS headers present

---

## API Integration Details

### API Client (`lib/api.ts`)

The frontend uses a wrapper around the Fetch API:

```typescript
import { apiClient } from "@/lib/api";

// GET request
const user = await apiClient.get("/users/me");

// POST request with data
const tokens = await apiClient.post("/auth/login", {
  email: "user@example.com",
  password: "password",
});

// Upload file
const formData = new FormData();
formData.append("file", pdfFile);
const resume = await apiClient.post("/resume/upload", formData);
```

### useAuth Hook

The `useAuth` hook manages authentication state:

```typescript
import { useAuth } from '@/hooks/useAuth'

export function MyComponent() {
  const { user, isLoading, error, login, logout } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!user) return <div>Not authenticated</div>

  return (
    <div>
      <p>Welcome, {user.full_name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Error Handling

```typescript
try {
  const result = await apiClient.post("/auth/login", data);
} catch (error) {
  if (error.status === 401) {
    // Invalid credentials
    showErrorToast("Invalid email or password");
  } else if (error.status === 422) {
    // Validation error
    showErrorToast(error.message);
  } else {
    // Network or server error
    showErrorToast("Something went wrong");
  }
}
```

---

## Key Features Implemented

### 1. Authentication

- ✅ Email/password signup
- ✅ Email/password login
- ✅ JWT token management
- ✅ Auto-logout on token expiry
- ✅ Refresh token flow
- ✅ Protected routes

### 2. User Profile

- ✅ View/edit profile
- ✅ Skills management
- ✅ Experience tracking
- ✅ Education history
- ✅ Profile completeness indicator

### 3. Resume Management

- ✅ PDF/DOCX upload
- ✅ Resume parsing
- ✅ Auto-fill profile
- ✅ Multiple resume support
- ✅ Resume preview

### 4. Job Search

- ✅ Browse job listings
- ✅ AI-powered recommendations
- ✅ Save jobs
- ✅ Match score display
- ✅ Job details modal

### 5. Application Tracking

- ✅ Submit applications
- ✅ Track status
- ✅ Add notes
- ✅ Timeline view
- ✅ Export applications

### 6. UI/UX

- ✅ Responsive design
- ✅ Tailwind CSS styling
- ✅ Loading states
- ✅ Error notifications
- ✅ Success feedback
- ✅ Empty states

---

## Build & Deployment

### Development Build

```bash
npm run build
npm run dev
```

### Production Build

```bash
npm run build
npm run start
```

### Docker Build

```bash
docker build -t extractresume-frontend:latest .
docker run -p 3000:3000 extractresume-frontend:latest
```

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel

# Configure environment variables in Vercel dashboard
# Set NEXT_PUBLIC_API_BASE_URL to production backend URL
```

### Deploy to Self-Hosted

```bash
# Build production bundle
npm run build

# Push to server
scp -r .next/ dist server:/app/

# Run on server
npm run start
```

---

## Troubleshooting

### Issue: "Cannot GET /"

**Solution:**

- Ensure dev server is running: `npm run dev`
- Check port 3000 is available
- Clear browser cache: Ctrl+Shift+Delete

### Issue: API returns 404

**Solution:**

- Verify backend is running: `http://localhost:8000/`
- Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- Confirm endpoint path in code

### Issue: "CORS error"

**Solution:**

- Backend CORS must allow `http://localhost:3000`
- Check `CORSMiddleware` in `backend/app/main.py`
- Verify `allow_origins` includes frontend URL

### Issue: Tokens not persisting

**Solution:**

- Check localStorage is enabled
- Verify tokens are being saved in `useAuth` hook
- Check for third-party cookie blocking

### Issue: 401 Unauthorized errors

**Solution:**

- Ensure tokens are sent in Authorization header
- Verify token hasn't expired
- Try refreshing tokens with refresh endpoint
- Re-login to get new tokens

### Issue: File upload fails

**Solution:**

- Check file size limits on backend
- Verify file format (PDF/DOCX)
- Ensure FormData is used for file uploads
- Check backend disk space

---

## Performance Optimization

```typescript
// 1. Use dynamic imports for large components
const HeavyComponent = dynamic(() => import('./heavy'), {
  loading: () => <Skeleton />
})

// 2. Use React.memo for expensive re-renders
const MemoizedList = React.memo(JobList)

// 3. Use useCallback to memoize functions
const handleSearch = useCallback((query) => {
  // search logic
}, [])

// 4. Use useMemo for expensive calculations
const sortedJobs = useMemo(() => {
  return jobs.sort(...)
}, [jobs])

// 5. Use Image component for optimization
import Image from 'next/image'
<Image src="/logo.png" alt="Logo" width={200} height={100} />
```

---

## Next Steps

1. Ensure backend is running and responsive
2. Test all user flows manually
3. Fix any API integration issues
4. Add automated tests
5. Deploy to production
6. Monitor user experience
7. Gather feedback for improvements

---

**Frontend is ready to use! Start the dev server and test the complete flow.**
