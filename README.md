# HireFlow — The Ultimate AI Career Ecosystem

HireFlow is a comprehensive, AI-powered platform designed to streamline the entire career journey for students and professionals. From crafting the perfect resume to acing the final interview, HireFlow provides the tools needed to succeed in the modern job market.

---

## 🚀 Key Features

### 📄 Intelligent Resume Suite
- **AI Resume Builder**: Create professional resumes with dynamic templates.
- **Real-time Editor**: Powerful WYSIWYG editor for resume customization.
- **ATS Analysis**: Get detailed scores and feedback on how well your resume performs against Applicant Tracking Systems.
- **Skill Gap Analysis**: Identify missing skills required for your target job roles.

### 🤖 AI Interview Coach
- **Voice & Text Interviews**: Practice with an AI that supports both text and voice interactions.
- **Real-time Feedback**: Get instant analysis on your answers and areas for improvement.
- **Role-Specific Sessions**: Tailor your interview practice to specific job titles.

### 💼 Job Discovery & Management
- **Live Job Search**: Integrated with Adzuna API for the latest job listings.
- **Application Tracking**: A centralized dashboard to manage all your job applications.
- **HR Contact Discovery**: Tools to find and manage recruiter contact information.

### 🛠️ Advanced Integrations
- **GitHub Sync**: Automatically pull projects and skills from your GitHub profile.
- **Chrome Extension**: (Beta) 1-click job applications and data extraction.

### ✨ Premium Aesthetics
- **Modern UI**: Built with a "Wow" factor using custom animations, kinetic text, and glassmorphism.
- **Responsive Design**: Seamless experience across all devices.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: FastAPI (Python 3.11), SQLAlchemy, Pydantic
- **Databases**: PostgreSQL (Relational), MongoDB (Document-based)
- **AI/ML**: OpenAI GPT-4, Custom ATS Scoring Algorithms
- **Services**: Redis (Caching), JWT (Authentication), Adzuna (Job Data)
- **DevOps**: Docker, Docker Compose, GitHub Actions

---

## 📂 Project Structure

```
ExtractResume-Ecosystem/
├── backend/            # FastAPI Backend Service
│   ├── app/            # Core Application Logic
│   └── tests/          # Backend Test Suite
├── frontend/           # Next.js Frontend Application
│   ├── app/            # Next.js App Router
│   ├── src/            # Components & Utilities
│   └── public/         # Static Assets
├── chrome-extension/   # Browser Extension for Job Automation
├── docs/               # Project Documentation & Architecture
│   ├── project-docs/   # Specifications & Roadmaps
│   └── archive/        # Legacy Progress Reports
├── scripts/            # Maintenance & Seeding Scripts
│   ├── seed/           # Database Seeders
│   └── debug/          # Diagnostic Tools
└── docker-compose.yml  # Container Orchestration
```

---

## ⚡ Quick Start

### Prerequisites
- Docker & Docker Compose
- Python 3.11+ (for local development)
- Node.js 18+ (for local development)

### Deployment with Docker (Recommended)
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sriyasnehasis/ExtractResume-Ecosystem.git
   cd ExtractResume-Ecosystem
   ```
2. **Setup Environment**:
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   ```
3. **Spin up the stack**:
   ```bash
   docker-compose up -d
   ```
4. **Access the platform**:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`
   - API Docs: `http://localhost:8000/docs`

---

## 🤝 Contributing

We welcome contributions! Please check the `docs/` folder for more detailed information on our architecture and coding standards.

---

## 👤 Developer

**Sriyasnehasis** — [GitHub](https://github.com/Sriyasnehasis)

---

## 📄 License

This project is licensed under the MIT License.
