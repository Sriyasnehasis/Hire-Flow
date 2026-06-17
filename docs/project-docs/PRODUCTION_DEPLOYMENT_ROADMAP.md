# 🚀 HireFlow — Production Architecture & Deployment Roadmap

This document outlines the production-grade deployment strategy, hosting topology, data scraping mechanisms, and the chronological step-by-step procedures to move HireFlow from local development (`localhost`) to a fully functional cloud-hosted environment with custom domains.

---

## 🏗️ 1. Production Hosting & Storage Infrastructure

To ensure high performance, low latency, and low operational costs (fitting within free/developer tiers initially), we will decouple the monolithic local Docker environment into optimized cloud services.

```
                    ┌──────────────────────────┐
                    │      Custom Domain       │
                    │    (DNS A/CNAME/TXT)     │
                    └────────────┬─────────────┘
                                 │
                     ┌───────────┴───────────┐
                     │    SSL/TLS Router     │
                     └─────┬───────────┬─────┘
                           │           │
     ┌─────────────────────▼───┐   ┌───▼─────────────────────┐
     │   FRONTEND WEB PORTAL   │   │     BACKEND REST API    │
     │      (Next.js 14)       │   │        (FastAPI)        │
     │     Hosted: Vercel      │   │  Hosted: Railway/Render │
     └─────────────────────────┘   └───────────┬─────────────┘
                                               │
           ┌─────────────────┬─────────────────┼─────────────────┐
           ▼                 ▼                 ▼                 ▼
 ┌──────────────────┐┌──────────────┐┌──────────────────┐┌──────────────┐
 │ MANAGED DATABASE ││ MANAGED NOSQL││ SERVERLESS CACHE ││ CLOUD STORAGE│
 │   (PostgreSQL)   ││   (MongoDB)  ││     (Redis)      ││   (S3/R2)    │
 │   Hosted: Neon   ││ Hosted: Atlas││ Hosted: Upstash  ││ Hosted: R2   │
 └──────────────────┘└──────────────┘└──────────────────┘└──────────────┘
```

| Component | Service Type | Recommended Cloud Provider | Rationale | Cost (Starting) |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend** | Static & Serverless Hosting | **Vercel** | Native support for Next.js App Router, SSR/ISR caching, edge optimizations, and automated CI/CD from GitHub. | **Free Tier** ($0) |
| **Backend** | Containerized Web Service | **Railway.app** or **Render.com** | Easy deployments via Dockerfile, automatic restart, simple env variable injects, and zero cold starts (with $5 developer tier). | **Free/Hobby Tier** ($0 - $5/mo) |
| **Primary DB** | Serverless SQL (Relational) | **Neon.tech** or **Supabase** | Fully-managed serverless PostgreSQL. Integrates with SQLAlchemy, provides connection pooling (pgbouncer built-in), and instant branching. | **Free Tier** ($0 for 0.5 GB) |
| **Scrape Cache DB** | Managed NoSQL (Document) | **MongoDB Atlas** | Official managed cloud service for MongoDB. Ideal for caching messy raw job postings and LinkedIn profiles. | **Shared Free Tier** ($0) |
| **Key-Value Store** | Serverless Redis (Caching) | **Upstash** | Redis-over-HTTP support. Fits perfectly with serverless scaling, eliminates connection limit caps, and handles job rate limiting. | **Free Tier** ($0 up to 10k cmd/day) |
| **File Storage** | S3-Compatible Storage | **Cloudflare R2** or **AWS S3** | Cloudflare R2 has **zero egress fees**, saving significant costs when users generate/download hundreds of PDF resumes. | **Free Tier** ($0 up to 10 GB) |

---

## 🔄 2. Production Scraping Architecture & ToS Safety

To scale job and profile scraping without encountering IP blocks, Cloudflare captchas, or legal terms of service (ToS) violations, HireFlow utilizes a **hybrid scraping topology**:

### A. LinkedIn Job/Post Scraping (Hybrid Extension Model)
*   **The Issue**: Server-side scraping (via Selenium/Playwright) on cloud servers (Railway/AWS) gets blocked immediately by LinkedIn's anti-bot system.
*   **The Solution**: We utilize the **HireFlow Chrome Extension**.
    *   Since the user is already authenticated on LinkedIn in their own browser and browsing jobs, the extension content script runs under the user's secure browser session.
    *   It scrapes the active DOM elements of the job description/page and pushes the clean structured JSON data directly to our FastAPI endpoint (`POST /api/v1/jobs/save-job`).
    *   **Pro**: Zero server cost, zero IP blocks, completely natural browsing speed, and bypasses ToS gates since it simulates manual reading.

### B. GitHub Profile & Repo Sync (Official API Model)
*   **The Issue**: Raw web scraping of GitHub profiles violates GitHub ToS and is prone to changing HTML structures.
*   **The Solution**: Official **GitHub OAuth 2.0 Integration**.
    1.  User clicks **Sync GitHub** on the frontend.
    2.  Redirected to GitHub's authorization page (requesting `repo` and `read:user` permissions).
    3.  User approves; GitHub redirects back to `https://yourdomain.com/github-callback?code=CODE`.
    4.  FastAPI exchanges the code for a secure user token and calls GitHub's official REST API (`https://api.github.com/user/repos`) to gather repository stats, code languages, and project descriptions.
    5.  Data is parsed and structured to update the user profile in PostgreSQL.
    6.  **Pro**: Fast, official, highly reliable, high rate limit (5,000 requests/hr per user), and does not break ToS.

---

## ⚡ 3. Step-by-Step Production Setup Roadmap

Follow this exact chronological checklist to go from localhost to live production:

### Phase 1: Database Migration & Local Cleanup (Current Step)
*   **Goal**: Ensure local DB state matches current Python models.
*   **Action Steps**:
    1.  Drop existing users and profiles tables locally in PostgreSQL to resolve mismatch errors (e.g. `column users.current_status does not exist`).
    2.  Let the startup function `Base.metadata.create_all` recreate all tables with active columns.
    3.  Re-run local user seeds to verify auth and profile routes are green.

### Phase 2: Create Production Cloud Accounts & Provision DBs
*   **Goal**: Spin up cloud resources.
*   **Action Steps**:
    1.  **Neon.tech**: Create a free PostgreSQL instance, copy the connection URI (e.g., `postgresql://...`).
    2.  **MongoDB Atlas**: Create a free M0 cluster, whitelist all IPs (`0.0.0.0/0`), and copy the connection URI.
    3.  **Upstash**: Create a serverless Redis database, copy the URL and password.
    4.  **Cloudflare R2**: Create an storage bucket named `hireflow-resumes` and generate S3 access credentials.

### Phase 3: Set up Production GitHub OAuth Application
*   **Goal**: Configure credentials for live environment.
*   **Action Steps**:
    1.  Go to **GitHub Profile -> Settings -> Developer Settings -> OAuth Apps**.
    2.  Click **New OAuth App**.
    3.  Application Name: `HireFlow AI`
    4.  Homepage URL: `https://hireflow.vercel.app` (replace with your domain).
    5.  Authorization callback URL: `https://hireflow.vercel.app/github-callback`
    6.  Generate **Client ID** and **Client Secret**; save them in your secure variables sheet.

### Phase 4: Deploy the FastAPI Backend to Railway/Render
*   **Goal**: Get the backend running on the cloud.
*   **Action Steps**:
    1.  Create a project on **Railway.app** or **Render.com**.
    2.  Connect your GitHub repository and point to the `backend/` directory.
    3.  Define the start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
    4.  Add the environment variables in the dashboard:
        *   `POSTGRES_URL` (From Neon)
        *   `MONGO_URL` (From MongoDB Atlas)
        *   `REDIS_URL` (From Upstash Redis)
        *   `GEMINI_API_KEY` (Your Google Gemini Key)
        *   `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` (From GitHub OAuth)
        *   `GITHUB_REDIRECT_URI` (Points to `https://yourdomain.com/github-callback`)
        *   `SECRET_KEY` (A random secure string for JWT signature)
    5.  Trigger deploy. Once complete, copy the backend URL (e.g., `https://hireflow-api.railway.app`).

### Phase 5: Deploy the Next.js Frontend to Vercel
*   **Goal**: Deploy user-facing website and link domain.
*   **Action Steps**:
    1.  Go to **Vercel** -> **Add New Project**.
    2.  Select your GitHub repository and point to the `frontend/` directory.
    3.  Add environment variables:
        *   `NEXT_PUBLIC_API_URL`: `https://hireflow-api.railway.app` (points to your new backend).
        *   `NEXT_PUBLIC_GITHUB_CLIENT_ID`: `Ov23liBmLHUa5LRHPnZG` (production OAuth Client ID).
    4.  Deploy. Vercel will assign a URL like `https://hireflow.vercel.app`.
    5.  Go to Vercel Settings -> **Domains** -> Add your custom domain (e.g., `hireflow.ai`).
    6.  In your registrar account (e.g., GoDaddy, Namecheap), add the required **CNAME** or **A** record pointing to Vercel's nameservers as instructed.

### Phase 6: Chrome Extension Production Configuration
*   **Goal**: Point the Chrome Extension to live server.
*   **Action Steps**:
    1.  Open [popup.js](file:///c:/Users/sriya/Desktop/Learner/ExtractResume-Ecosystem/chrome-extension/popup.js) or its configurations.
    2.  Change `DEFAULT_API_BASE` from `http://localhost:8000/api/v1` to `https://hireflow-api.railway.app/api/v1`.
    3.  Pack the extension or upload it to the Chrome Web Store as a private/unlisted developer draft so it uses the production backend routes seamlessly.
