# HireFlow — Revised Strategic Plan & Phased Implementation Roadmap (v2)

*Repositioning from a BTech/placement tool to a general professional career platform, with a free-tier architecture that's actually reliable.*

---

## 1. Positioning Decision

**Audience shift:** HireFlow now serves any professional — marketing, sales, healthcare, operations, design, finance, education, early-career and mid-career — not only BTech/CS students chasing tech placements. This changes priorities in three concrete ways:

1. **GitHub integration becomes optional, not core.** It stays for technical users who want it (developers, data folks), but the main intake flow can no longer assume every user has a GitHub account. A generic "Work Samples" path (portfolio links, certifications, writing samples, design files, case studies) needs to sit alongside it as a first-class option, not an afterthought.
2. **Mock interview question banks must span industries.** Behavioral and role-specific question sets need to exist for sales, healthcare, customer success, marketing, operations, and education roles — not just SDE/DevOps/Data Science as the current `interviews.py` router implies.
3. **Brand voice needs to drop the "elite/institutional" framing.** Copy like "Neural OS for Elite Professionals," "INITIALIZE IDENTITY," and "institutional vetting" reads as gatekeeping and intimidating — the opposite of what a broad, approachable audience needs. Recommended direction: confident and modern, but warm. Think "a clear, capable career assistant," not "a surveillance dashboard for ambitious technologists."
   - Replace "INITIALIZE IDENTITY" → "Get Started" or "Build Your Profile"
   - Replace "Career Health" → "Application Readiness" or "Profile Strength"
   - Replace the fabricated activity ticker ("Role secured at Meta...") entirely — either remove it or replace with real, anonymized, aggregate stats once you have genuine usage data (e.g., "1,200+ resumes optimized this month" only once it's true)
4. **The "ATS Score" label should be renamed.** As covered before, real ATS platforms don't auto-score-and-reject the way the term implies. Rename to **"JD Match Score"** everywhere in the UI (dashboard, resume builder) — same underlying keyword-overlap logic, no overstated claim.

---

## 2. Module-by-Module Specification

### 2.1 Identity & Onboarding (new — currently missing)
This doesn't exist yet as a guided flow, and it should be the first thing a new user sees instead of a dashboard pre-filled with fake numbers.

**Flow:** Sign up → "What's your field?" (Tech / Sales / Marketing / Healthcare / Design / Operations / Finance / Education / Other) → "Upload an existing resume" (optional) or "Start from scratch" → land on a Resume Builder with a relevant template already selected based on field.

This single decision (field selection) drives template choice, mock interview question bank, and skill-gap taxonomy downstream — it's the one piece of context that makes every other module feel tailored without requiring per-module configuration.

### 2.2 Resume Builder
**What's live now:** a bare drag-and-drop with no visible template gallery.

**What it needs:**
- A real template gallery (start with 4-5: a clean general-purpose one, one with a stronger "creative/portfolio" lean for design/marketing roles, one conservative one for finance/healthcare/government-adjacent roles, one technical-friendly one with a projects section). Kickresume's split-screen live-preview pattern is worth copying — it's the single biggest trust-builder in this category, letting users see formatting changes instantly rather than guessing.
- JD-paste-and-tailor: user pastes a target job description, Gemini rewrites bullet points to mirror its language and surfaces missing keywords — framed honestly as "Match Score," not "ATS Score."
- For technical users only: GitHub repo → bullet point synthesis (your existing differentiator, still worth building — translate commit/README data into quantified bullets). For everyone else: a simpler "describe your project/campaign/initiative in your own words" → AI restructures into a polished bullet.
- Resume parsing for "Upload Existing Resume": keep using Gemini with a structured JSON schema rather than a paid parsing API (Affinda/RChilli run $75-800+/month for what your existing plan already does more cheaply).

### 2.3 Voice Coach (Mock Interview)
**Confirmed scope:** pure practice, not live-interview assistance. This keeps you out of the trust/ethics problems that "live copilot" tools like Final Round AI's overlay feature carry, and it's a cleaner, more defensible product to build a reputation on.

**What it needs to support a general audience:**
- **Role + industry picker as the entry point**, not a single generic flow. "Practicing for: [Job Title] in [Industry]" generates a tailored question set via Gemini rather than relying only on a hardcoded question bank — this scales to any field without you manually writing question banks for every profession.
- **Delivery feedback, not just content feedback** — this is the single most valuable addition based on competitor research. Yoodli's whole value proposition is analyzing *how* someone speaks (filler words, pacing, clarity) rather than only scoring whether the content was right, and this dimension is universal across every profession, unlike technical-question correctness. Implementation path: transcript from Web Speech API (or later, Whisper/Deepgram) → simple filler-word counter (um, like, you know) + words-per-minute calculation, no ML model needed for v1 — this is a few dozen lines of post-processing on the transcript text you're already capturing.
- Clear labeling on session score cards (your current "65%, 88%, 42%" logs have no context) — show "Content Relevance," "Clarity," "Pacing" as separate small metrics rather than one ambiguous percentage.

### 2.4 Job Board
**What's live now:** Adzuna integration — a good, ToS-clean choice, better than the original LinkedIn-scraping plan.

**What it needs:** caching, because the free tier rate-limits around 25 requests/minute and 250/day. Cache search results in Upstash Redis keyed by `jobs:{query}:{location}` with a 1-hour TTL, so repeated searches for common queries don't re-hit Adzuna every time. This single change is likely what fixes the "Fetching live jobs from Adzuna..." hang you're seeing in production.

### 2.5 Skill Gap
**What's live now:** blank page, likely a backend connectivity issue (see Section 3).

**What it needs to support a general audience:** a skill taxonomy that isn't tech-stack-shaped. Instead of "Python, AWS, React," the comparison should pull skills directly from the pasted job description (via Gemini extraction) and compare against the user's resume content — this approach is inherently industry-agnostic since it derives the comparison set from whatever JD the user provides, whether that's a nursing role or a sales role or a software role.

### 2.6 HR Discovery (Networking/Outreach)
**What's live now:** empty state, no scraper built — this is the right call. Keep it that way.

**What it needs:** a manual "Add Contact" flow (name, role, company, how you know them or found them) plus an AI-drafted outreach message generator. The differentiator worth building: have the draft generator reference the user's last 2-3 sent/edited messages as style examples in the prompt, so drafts gradually sound more like the user's own voice rather than generic AI phrasing — this directly addresses the weakness reviewers flag in Teal's equivalent feature.

### 2.7 Portfolio Sync (renamed from "GitHub Integration")
Keep the existing GitHub OAuth flow exactly as built, but reframe it in the UI as one option under a broader "Portfolio Sync" section that also accepts: a personal website URL, a Behance/Dribbble link, an uploaded PDF case study or work sample, or a certification list. The backend logic for GitHub stays unchanged — this is purely a UI/positioning change so non-technical users aren't shown a feature that doesn't apply to them.

---

## 3. Free-Tier Architecture (Fixed)

Your stack stays free, but one change matters more than anything else right now: **where the FastAPI backend lives.**

### The current problem
The stuck `/profile` and `/skill-gap` pages are almost certainly caused by your backend host. Render's free tier spins services down after 15 minutes of inactivity, and the first request after that takes 30-60 seconds to wake back up — which looks exactly like a permanently broken page to anyone who visits without waiting that long. Railway no longer offers a free tier at all (removed in 2023, removed prepaid credits entirely in early 2026). Fly.io's free tier is effectively dead for new accounts.

### The fix
Deploy FastAPI directly on Vercel using its native Python runtime, alongside your existing Next.js frontend, instead of a separate Render/Railway service. Vercel now officially supports FastAPI as a first-class framework — you place your FastAPI app at a recognized entrypoint (`api/index.py`, `main.py`, etc.) and Vercel runs it as a serverless function automatically. This removes the separate backend host entirely: no 30-60 second wake-up, no second service to keep alive, no added cost, and one less moving part to debug. Cold starts on Vercel serverless functions are sub-second to a couple seconds, not the 30-60 second Render penalty.

This is the single highest-leverage infrastructure change available to you right now, and it costs nothing.

### Final stack table

| Layer | Service | Free-tier limit | Notes |
|---|---|---|---|
| Frontend + Backend | Vercel (Next.js + FastAPI Python runtime) | Generous hobby limits, no separate host needed | Migrate FastAPI here from Render/Railway |
| Relational DB | Neon Postgres | 0.5GB storage, 100 CU-hours/project, autosuspends after 5 min idle | Fine for early-stage usage; autosuspend wakes in ~1s on next query, unlike a full app-server cold start |
| Document DB | MongoDB Atlas M0 | 512MB storage | Fine for resume text/JSON caching; watch growth |
| Cache | Upstash Redis | 500K commands/month, 256MB | Use for job-search caching and Gemini response caching where prompts repeat |
| AI engine | Gemini API | `gemini-2.5-flash-lite`: ~1,500 requests/day, 15 RPM. `gemini-2.5-flash`: similar ballpark, slightly stronger reasoning | Pro models (`gemini-3.1-pro` etc.) are no longer on the free tier as of April 2026 — budget for billing later if you need stronger reasoning than Flash provides |
| Jobs data | Adzuna API | ~25 req/min, 250 req/day | Cache aggressively via Redis (Section 2.4) |
| File storage | Cloudflare R2 (or defer until needed) | 10GB free | Only needed once resume file uploads need persistent storage beyond a session |

**AI fallback chain to implement now:** `gemini-2.5-flash-lite` (primary, highest daily quota) → `gemini-2.5-flash` (fallback on 429, slightly better reasoning) → if both exhausted, queue the request and return a "try again shortly" response rather than failing silently. Add a simple rate limiter (token-bucket, a few lines) around outgoing Gemini calls so concurrent requests don't all fire at once and trip the RPM limit.

---

## 4. Phased Implementation Roadmap

### Phase 0 — Stabilize what's live (do this before anything else)
- Migrate FastAPI backend from Render/Railway to Vercel's Python runtime
- Replace fake dashboard data and the fabricated activity ticker with honest empty/zero states
- Update `ai_service.py` model strings to the current Gemini fallback chain
- Add error boundaries / loading states to `/profile` and `/skill-gap` so they fail visibly instead of hanging silently
- **Done when:** every nav link loads something real (even if empty) within 2-3 seconds, with no fabricated content visible to a fresh signup

### Phase 1 — Universal Identity + Resume Builder
- Build the field-selection onboarding flow (Section 2.1)
- Ship 4-5 real templates with live preview
- Wire up JD-paste-and-tailor with the renamed "JD Match Score"
- Keep GitHub sync working as-is, reposition it as one option under "Portfolio Sync"
- **Done when:** a non-technical user can sign up, pick "Marketing," upload or build a resume, paste a JD, and get a tailored, correctly-labeled match score — without ever seeing a GitHub prompt unless they choose it

### Phase 2 — Voice Coach broadened
- Add the role + industry picker as the entry point
- Generate question sets dynamically via Gemini based on role/industry input, rather than only hardcoded banks
- Add filler-word and pacing analysis on top of existing content scoring
- Relabel session score cards with named metrics instead of bare percentages
- **Done when:** a sales rep and a software engineer can each select their own role and get a relevant, differently-worded mock interview with delivery feedback

### Phase 3 — Job Board + Skill Gap
- Add Redis caching to the Adzuna integration (Section 2.4)
- Build JD-driven skill extraction for the Skill Gap module so it works for any industry
- **Done when:** repeated searches don't hit Adzuna's rate limit, and Skill Gap renders a real comparison for a non-tech JD

### Phase 4 — HR Discovery
- Manual contact-add flow
- AI outreach draft generator with style-learning from past sent messages
- **Done when:** a user can log a contact and get a usable draft that doesn't read as generic boilerplate after a few uses

### Phase 5 — Polish & scale-readiness
- Guided first-run tour across modules
- Basic usage analytics (so you know which modules people actually use before investing further)
- Revisit free-tier limits against real usage; plan which service (if any) needs to move to a paid tier first as you grow

---

## 5. Deliberately not building (and why)

- **Live-interview copilot/overlay** — ethically risky, increasingly detected and banned by employers, and outside the "practice beforehand" positioning you've chosen.
- **LinkedIn automation/scraping** — LinkedIn's enforcement has gotten meaningfully more aggressive through 2026; not worth the account-ban risk to your users for a feature Adzuna already covers more safely.
- **Recruiter email-finder APIs (Hunter.io/Apollo.io)** — $75+/month minimum and their own ToS gray areas; manual contact entry plus a strong AI draft generator delivers most of the value without the cost or risk.
- **Dedicated resume-parsing vendors (Affinda/RChilli/Sovren)** — $75-800+/month for something Gemini's structured-output mode already does for the cost of a normal API call.
