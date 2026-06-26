# BuddyAI Implementation Blueprint

## Context

The BuddyAI workspace currently contains only documentation (README.md, requirements.md, ModelReadMe.md, requirements.txt). No application code, config files, or project scaffolding exists. We need to establish the full development environment and then build the system in ordered phases. The confirmed architecture is:

- **Frontend:** Next.js + React + TypeScript + Tailwind CSS + ShadCN UI
- **Backend API:** Node.js + Express.js + TypeScript + Prisma ORM + PostgreSQL
- **NLP Microservice:** Python + FastAPI + NLTK + VADER (sentiment analysis only)
- **Auth:** JWT + bcrypt + RBAC (Student / Counsellor roles)

---

## Task 1: Project Scaffolding & Environment Setup

Create the monorepo-style folder structure and all foundational config files.

**Folder structure:**
```
BuddyAI/
├── client/          # Next.js frontend
├── server/          # Node.js/Express backend
├── nlp-service/     # Python FastAPI NLP microservice
├── prisma/          # Prisma schema & migrations
├── .env.example
├── .gitignore
└── docker-compose.yml (optional, for PostgreSQL)
```

**Files to create:**
| File | Purpose |
|------|---------|
| `server/package.json` | Express + Prisma + JWT + bcrypt deps |
| `server/tsconfig.json` | TypeScript strict config for backend |
| `client/package.json` | Next.js + Tailwind + ShadCN deps (via `create-next-app`) |
| `client/tsconfig.json` | Next.js TypeScript config |
| `prisma/schema.prisma` | Full DB schema (7 models from ERD) |
| `nlp-service/requirements.txt` | FastAPI, NLTK, uvicorn |
| `nlp-service/main.py` | FastAPI app entry point |
| `.env.example` | DATABASE_URL, JWT_SECRET, NLP_SERVICE_URL, PORT |
| `.gitignore` | node_modules, .env, __pycache__, .next |

---

## Task 2: Database Schema (Prisma)

Define the full `schema.prisma` with these models (matching the ERD in README):

- **User** — id, fullName, email, passwordHash, role (STUDENT/COUNSELLOR), createdAt
- **Conversation** — id, userId (FK), startedAt
- **Message** — id, conversationId (FK), messageText, sender (USER/BOT), sentiment, sentimentScore, createdAt
- **MoodEntry** — id, userId (FK), moodRating (1-5), notes, createdAt
- **Phq9Assessment** — id, userId (FK), responses (JSON), totalScore, severityLevel, completedAt
- **Recommendation** — id, userId (FK), recommendationText, riskLevel, generatedAt
- **RiskAlert** — id, userId (FK), assessmentId (FK), riskLevel, status (PENDING/REVIEWED/RESOLVED), createdAt

Run `prisma migrate dev` to initialize the database.

---

## Task 3: Backend API Foundation (Express + TypeScript)

Set up the Express server with:
- `src/index.ts` — app entry, middleware registration
- `src/middleware/auth.ts` — JWT verification + role guard
- `src/routes/` — route modules
- `src/controllers/` — request handlers
- `src/services/` — business logic layer
- `src/utils/` — helpers (password hashing, token generation)
- `src/config/` — env loading, Prisma client singleton

---

## Task 4: Authentication Module

Implements FR-001 through FR-004.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Student registration |
| `/api/auth/login` | POST | Login (returns JWT) |
| `/api/auth/me` | GET | Get current user profile |

- bcrypt for password hashing
- JWT access tokens (24h expiry)
- Role-based middleware (student-only, counsellor-only guards)

---

## Task 5: Python NLP Microservice

A standalone FastAPI service exposing:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/analyze` | POST | Accepts `{ text: string }`, returns `{ sentiment, compound_score, pos, neg, neu }` |
| `/health` | GET | Health check |

**Internal pipeline:**
1. Text preprocessing (NLTK tokenize, stopword removal, normalization)
2. VADER SentimentIntensityAnalyzer
3. Classification based on compound score thresholds (≥0.05 positive, ≤-0.05 negative)

Download NLTK resources on startup: punkt, stopwords, vader_lexicon.

---

## Task 6: Chat Module & Sentiment Integration

Implements FR-005 through FR-010.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/conversations` | POST | Create new conversation |
| `/api/conversations/:id/messages` | POST | Send message (calls NLP service internally) |
| `/api/conversations/:id/messages` | GET | Get conversation messages |
| `/api/conversations` | GET | List user's conversations |

Flow: Message received → call NLP microservice `/analyze` → store message with sentiment result → generate bot response (rule-based or templated).

---

## Task 7: PHQ-9 Assessment Module

Implements FR-011 through FR-014.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/assessments/phq9` | POST | Submit PHQ-9 responses (array of 9 scores 0-3) |
| `/api/assessments/phq9` | GET | Get user's assessment history |
| `/api/assessments/phq9/:id` | GET | Get specific assessment |

Scoring: Sum responses (0–27) → classify severity per PHQ-9 thresholds.

---

## Task 8: Mood Tracking Module

Implements FR-015 through FR-018.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/mood` | POST | Record mood entry (rating 1-5, optional notes) |
| `/api/mood` | GET | Get mood history (with date filters) |
| `/api/mood/trends` | GET | Get mood trend analysis (averages, direction) |

---

## Task 9: Risk Evaluation & Recommendation Engine

Implements FR-019 through FR-024.

**Risk rules (from ModelReadMe):**
- PHQ-9 ≥ 20 → Severe Risk
- PHQ-9 ≥ 15 AND negative sentiment → High Risk
- PHQ-9 ≥ 10 OR declining mood trend → Moderate Risk
- Otherwise → Low Risk

**Recommendation mapping:**
| Risk Level | Recommendation Type |
|------------|-------------------|
| Low | Self-help resources |
| Moderate | Wellness recommendations |
| High | Counselling recommendation |
| Severe | Immediate counsellor alert |

Triggered after: PHQ-9 submission, or periodically after chat sentiment analysis.

---

## Task 10: Counsellor Alert & Dashboard APIs

Implements FR-025 through FR-032.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/alerts` | GET | List alerts (counsellor only) |
| `/api/alerts/:id` | PATCH | Update alert status |
| `/api/alerts/:id/student` | GET | Get student risk summary |
| `/api/dashboard/stats` | GET | Aggregate statistics for counsellor |

Auto-generates alerts when risk = HIGH or SEVERE (BR-005).

---

## Task 11: Next.js Frontend

Pages and components:

| Route | Purpose |
|-------|---------|
| `/login`, `/register` | Auth pages |
| `/dashboard` | Student dashboard (mood chart, recent assessments) |
| `/chat` | Chat interface with BuddyAI |
| `/assessment` | PHQ-9 questionnaire form |
| `/mood` | Mood tracker + history visualization |
| `/counsellor/dashboard` | Alert list + student summaries |
| `/counsellor/alerts/:id` | Alert detail + mood/assessment review |

ShadCN UI components, Tailwind styling, React Query for API state management.

---

## Task 12: Integration Testing & E2E Verification

- Backend: Jest/Vitest unit tests for services + Supertest for API routes
- NLP Service: pytest for `/analyze` endpoint
- Frontend: Basic E2E flow (register → login → chat → assessment → mood)
- Verify counsellor alert flow end-to-end

---

## Verification Plan

1. `prisma migrate dev` succeeds with no errors
2. Backend starts on configured PORT, all endpoints return correct HTTP codes
3. NLP service `/analyze` returns valid sentiment for sample texts
4. Frontend compiles with `next build` (zero TypeScript errors)
5. Full flow test: register student → send chat message → verify sentiment stored → submit PHQ-9 → verify risk alert created → counsellor views alert

---

## Execution Order & Dependencies

```
Task 1 (Scaffolding)
  ├── Task 2 (Prisma Schema) ──┐
  ├── Task 5 (NLP Service)     │
  └── Task 3 (Backend Setup) ──┤
       └── Task 4 (Auth) ──────┤
            ├── Task 6 (Chat + Sentiment) ← depends on Task 5
            ├── Task 7 (PHQ-9)
            ├── Task 8 (Mood)
            │    └── Task 9 (Risk + Recommendations) ← depends on 6,7,8
            │         └── Task 10 (Alerts/Dashboard)
            └── Task 11 (Frontend) ← can start after Task 4, iterates with each API
                 └── Task 12 (E2E Testing) ← final
```

Tasks 5, 7, 8, and early Task 11 work can run in parallel once their prerequisites complete.
