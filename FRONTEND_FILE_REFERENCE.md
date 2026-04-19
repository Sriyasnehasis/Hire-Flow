# 📋 HireFlow Frontend — Complete File Reference

## 🎨 Branding & Design Files

### Logo Files

```
frontend/public/
├── hireflow-logo.svg              # Full logo with "HireFlow" text
└── hireflow-logo-icon.svg         # Icon-only (for favicon)
```

### Design Documentation

```
HIREFLOW_BRAND_SYSTEM.md           # Complete brand guidelines
- Color palette (Primary #2563EB, Secondary #0EA5E9)
- Typography standards
- Component guidelines
- Motion & animations
- Tone & voice
```

---

## 🧩 UI Components

### Core Component Library

```
frontend/src/components/UI/
├── Button.tsx                      # Variants: primary, secondary, outline, danger
│                                   # Props: size, loading, asChild, href
├── Card.tsx                        # Card, CardHeader, CardBody
│                                   # Props: hoverable, onClick, className
├── Input.tsx                       # Form input with validation
│                                   # Props: label, error, icon, helperText
├── Badge.tsx                       # Status badges
│                                   # Variants: primary, success, warning, danger, gray
├── LoadingSpinner.tsx              # Loading indicator
│                                   # Props: size, text, fullScreen
└── index.ts                        # Centralized exports
```

### Layout Components

```
frontend/src/components/
└── Header.tsx                      # Sticky navigation with responsive menu
                                   # Props: userName, onLogout
```

---

## 📄 Pages & Routes

### Public Pages

```
frontend/src/app/

page.tsx                            # Landing page (/)
├── Hero section
├── Features grid
├── CTA sections
└── Footer

auth/signup/page.tsx                # User registration (/auth/signup)
├── Form with validation
├── Social auth buttons
└── Link to login

auth/login/page.tsx                 # User login (/auth/login)
├── Email & password form
├── Forgot password link
└── Link to signup
```

### Protected Pages

```
frontend/src/app/

dashboard/page.tsx                  # Dashboard (/dashboard)
├── Stats cards (4)
├── Quick action cards (4)
├── Recent activity sidebar
└── ATS score visualization

resume/page.tsx                     # Resume Manager (/resume)
├── Upload dropzone
├── Resume editor placeholder
├── ATS score analysis
└── Optimization tips

jobs/page.tsx                       # Job Search (/jobs)
├── Search bar
├── Job cards listing
├── Save & apply buttons
└── Responsive grid

interviews/page.tsx                 # Mock Interviews (/interviews)
├── Interview setup
├── Live interview interface
├── Recording controls
└── Interview history

skills/page.tsx                     # Skill Gap Analysis (/skills)
├── Skill assessment by category
├── Progress visualization
├── Learning resources
└── Company skills
```

---

## 🎛️ Configuration Files (Updated)

### Tailwind Configuration

```
frontend/tailwind.config.ts
- Brand colors updated to HireFlow palette
- Extended with custom animations
- Surface colors for backgrounds
- Detailed keyframes for smooth transitions
```

### Environment Variables

```
frontend/.env.example              # Copy to .env.local and update
- NEXT_PUBLIC_API_URL              # Backend API endpoint
- NEXT_PUBLIC_AUTH0_DOMAIN         # OAuth domain (optional)
```

---

## 📦 Dependencies Used

### Core

- **Next.js 14** — React framework
- **React 18** — UI library
- **TypeScript** — Type safety
- **Tailwind CSS** — Utility styling

### UI & Icons

- **lucide-react** — Beautiful icons
- **react-hook-form** — Form handling
- **react-hot-toast** — Toast notifications

### State & API

- **zustand** — State management
- **axios** — HTTP client

---

## 🗂️ Directory Structure Overview

```
frontend/
│
├── public/
│   ├── hireflow-logo.svg
│   ├── hireflow-logo-icon.svg
│   └── [other static files]
│
├── src/
│   ├── app/                        # Next.js app directory
│   │   ├── page.tsx               # Landing page
│   │   ├── dashboard/
│   │   ├── resume/
│   │   ├── jobs/
│   │   ├── interviews/
│   │   ├── skills/
│   │   └── auth/
│   │
│   ├── components/
│   │   ├── UI/                    # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── index.ts
│   │   ├── Header.tsx             # Navigation
│   │   └── [feature components]
│   │
│   ├── hooks/                      # Custom React hooks
│   ├── lib/                        # Utilities & API client
│   ├── styles/                     # Global styles
│   └── utils/                      # Helper functions
│
├── tailwind.config.ts              # Updated with HireFlow colors
├── tsconfig.json                   # TypeScript config
├── next.config.js                  # Next.js config
└── package.json                    # Dependencies
```

---

## 🎯 Component Usage Examples

### Button

```tsx
import { Button } from '@/components/UI';

// Primary button
<Button variant="primary" size="md">
  Click Me
</Button>

// Button as link
<Button variant="primary" size="md" asChild href="/dashboard">
  Go to Dashboard
</Button>

// Loading state
<Button loading>
  Processing...
</Button>
```

### Card

```tsx
import { Card, CardHeader, CardBody } from "@/components/UI";

<Card>
  <CardHeader title="My Card" subtitle="Description" />
  <CardBody>Your content here</CardBody>
</Card>;
```

### Input

```tsx
import { Input } from "@/components/UI";

<Input
  label="Email"
  type="email"
  error="Invalid email"
  helperText="We'll never share this"
  icon={<Mail size={18} />}
/>;
```

### Badge

```tsx
import { Badge } from "@/components/UI";

<Badge label="In Progress" variant="warning" size="md" />;
```

---

## 🔄 Data Flow

### Current (Mock Data)

```
Component State (useState)
    ↓
Mock Data Display
    ↓
User Interaction (onClick, etc.)
    ↓
State Update
```

### After Backend Integration

```
Component State (zustand)
    ↓
API Request (axios)
    ↓
Backend Response
    ↓
Data Display
    ↓
User Interaction
    ↓
API Mutation (POST/PUT/DELETE)
```

---

## 🚀 Common Tasks

### Add a New Page

1. Create folder: `src/app/new-feature/`
2. Add `page.tsx`:

```tsx
"use client";

import { Header } from "@/components/Header";
import { Card, Button } from "@/components/UI";

export default function FeaturePage() {
  return (
    <div className="min-h-screen bg-surface-50">
      <Header userName="John Doe" />
      <main className="max-w-6xl mx-auto px-4 py-8">{/* Your content */}</main>
    </div>
  );
}
```

### Change Button Color

```tsx
// In Button.tsx, modify the variants object
const variants = {
  primary: "bg-brand-600 text-white hover:bg-brand-700", // Change brand-600 to your color
};
```

### Add New Badge Variant

```tsx
// In Badge.tsx
const variants = {
  // ... existing variants
  custom: "bg-purple-100 text-purple-800 border-purple-300",
};
```

### Create New Icon Component

```tsx
import { Icon } from "lucide-react";

<Icon size={24} className="text-brand-600" />;
```

---

## 📊 Page Statistics

| Page       | Components Used            | Sections | Interactive Elements |
| ---------- | -------------------------- | -------- | -------------------- |
| Landing    | Button, Card               | 4        | 3 (buttons, links)   |
| Dashboard  | Button, Card, Badge        | 5        | 8                    |
| Resume     | Button, Card, Input        | 4        | 6                    |
| Jobs       | Button, Card, Input, Badge | 3        | 10                   |
| Interviews | Button, Card, Badge        | 4        | 12                   |
| Skills     | Button, Card, Input        | 4        | 8                    |
| Signup     | Button, Card, Input        | 3        | 7                    |
| Login      | Button, Card, Input        | 3        | 6                    |

---

## 🔗 Important Links

- **Design System:** `HIREFLOW_BRAND_SYSTEM.md`
- **Setup Guide:** `FRONTEND_IMPLEMENTATION_COMPLETE.md`
- **Tailwind Docs:** https://tailwindcss.com
- **Next.js Docs:** https://nextjs.org/docs
- **React Docs:** https://react.dev
- **lucide-react Icons:** https://lucide.dev

---

## 💾 Git Commands

```bash
# View current changes
git status

# Add all files
git add .

# Commit
git commit -m "Add HireFlow frontend with branding and pages"

# Push
git push origin main
```

---

## ✅ Checklist for Backend Integration

- [ ] Install API client (axios already done)
- [ ] Create environment variables file
- [ ] Update routes in components
- [ ] Connect auth endpoints
- [ ] Connect resume upload API
- [ ] Connect job listing API
- [ ] Implement error handling
- [ ] Add success notifications
- [ ] Test all flows

---

**Last Updated:** April 18, 2026
**Status:** Complete & Ready for Backend Integration ✅
