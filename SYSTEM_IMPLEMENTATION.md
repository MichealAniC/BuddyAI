# BuddyAI — System Implementation

**A reference document for Chapter Four: System Implementation**

This document provides a technical account of how the BuddyAI platform was implemented. It describes the development environment, system architecture, frontend and backend implementation, database design, AI/NLP integration, user interface modules, testing strategy, and a summary of results. File paths and code-level decisions are included so the chapter can be written with direct citations to the codebase.

---

## 4.1 Introduction

BuddyAI is a web-based mental health support system designed for students in tertiary institutions. Its purpose is to lower the barrier to early depression detection and intervention by combining an AI companion chatbot, the clinically validated PHQ-9 depression screening instrument, daily mood tracking, and a real-time counsellor dashboard.

The system was implemented as three cooperating services:

1. **Client** — a Next.js 16 web application that renders the public marketing site, the student portal, and the counsellor portal.
2. **Server** — an Express/Node.js REST API that handles authentication, business logic, database access, and integration with the NLP service.
3. **NLP Service** — a Python FastAPI microservice that preprocesses chat messages and performs sentiment analysis using VADER.

Persistent storage is provided by a PostgreSQL database, modelled and queried through Prisma ORM. The implementation prioritizes type safety, role-based access control, a calm and trustworthy visual language, and a responsive user experience.

---

## 4.2 Development Environment

The system was developed on a Windows 11 (25H2) workstation using the following toolchain:

| Tool | Version / Role |
|------|----------------|
| Visual Studio Code | Primary IDE with TypeScript, ESLint, and Tailwind CSS extensions |
| Node.js | 20+ LTS for frontend and backend runtime |
| npm | Package management for `client/`, `server/`, and root workspace |
| Python | 3.10+ for the NLP microservice |
| pip | Python dependency management |
| Git | Version control and source-code collaboration |
| Docker Desktop | PostgreSQL container orchestration via `docker-compose.yml` |
| Postman / Browser DevTools | Manual API and UI verification |

The monorepo layout keeps the frontend, backend, and AI service in separate folders while sharing a single Prisma schema at the repository root. Root-level npm scripts in `package.json` orchestrate concurrent development, database migrations, and testing.

---

## 4.3 System Implementation

### 4.3.1 Frontend Development

**Framework and Routing**

The frontend is built with **Next.js 16** using the App Router convention. Routes are organized into route groups under `client/src/app/`:

- `(public)/` — marketing pages (`/`, `/features`, `/how-it-works`, `/resources`, `/about`)
- `(auth)/` — login and registration (`/login`, `/register`)
- `(student)/` — student portal pages (`/home`, `/journey`, `/buddy`, `/profile`, `/support`)
- `(counsellor)/` — counsellor portal pages (`/overview`, `/students`, `/cases`, `/alerts`, `/analytics`)

Route groups allow each user-facing experience to have its own layout while sharing the same URL namespace. For example, `client/src/app/(public)/layout.tsx` provides a sticky glassmorphism navbar and multi-column footer, whereas `client/src/app/(student)/layout.tsx` provides an authenticated AppShell with a sidebar and top bar.

**Design System: Clinical Calm**

A custom design system called **Clinical Calm** was implemented to give the platform a consistent, premium, and non-clinical feel. Tokens are stored in `client/src/styles/design-tokens.ts` and mirrored in `client/src/app/globals.css` through Tailwind v4's `@theme inline` block. The palette uses:

- **Primary teal** (`primary-50` to `primary-900`) for trust, action, and calm.
- **Sage green** for success and wellbeing states.
- **Amber** for warnings and attention.
- **Rose** for critical alerts and danger.
- **Neutral and slate** greys for surfaces, borders, and text hierarchy.

Semantic tokens such as `text`, `text-muted`, `surface`, `surface-elevated`, `border`, `shadow-card`, and `rounded-card` are used directly in components. The Tailwind configuration in `client/tailwind.config.ts` imports the token objects so utilities like `bg-primary-600`, `text-text-muted`, and `shadow-elevated` are available throughout the application.

**Component Architecture**

The component layer is organized into:

- `client/src/components/ui/` — low-level primitives (`button.tsx`, `input.tsx`, `card.tsx`, `badge.tsx`, `dialog.tsx`) implemented with Radix UI and `class-variance-authority` for typed variants.
- `client/src/components/shared/` — reusable application-level components such as `SanctuaryCard`, `Providers`, `ToastContainer`, `PageTransition`, and `LoadingSpinner`.
- `client/src/components/layout/` — `AppShell`, `Sidebar`, `TopBar`, `MobileSidebar`, and `PublicNav`.
- `client/src/components/features/` — feature-specific components such as `MoodLogger` and the chat components.

State management relies on **TanStack Query** for server-state caching and mutations. The `AuthProvider` in `client/src/context/AuthContext.tsx` hydrates the user from `localStorage` on mount and exposes `login`, `register`, and `logout` methods. A lightweight custom toast system in `client/src/context/ToastContext.tsx` is rendered by `ToastContainer` with Framer Motion enter/exit animations.

### 4.3.2 Backend Development

**Framework and Structure**

The backend is an **Express.js** application written in TypeScript. Entry point is `server/src/index.ts`, which mounts the following route groups:

```typescript
app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/conversations', chatRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);
```

The folder structure follows a controller-service pattern:

- `server/src/routes/` — route definitions and middleware attachment.
- `server/src/controllers/` — HTTP request/response handling.
- `server/src/services/` — business logic and database queries.
- `server/src/middleware/` — authentication and error handling.
- `server/src/utils/` — password hashing and JWT token utilities.

**Authentication and Authorization**

Authentication is implemented with **JSON Web Tokens (JWT)**. The `authenticate` middleware in `server/src/middleware/auth.ts` validates the `Authorization: Bearer <token>` header and attaches the decoded user to the request. A `requireRole` helper enforces role-based access control, ensuring that student-only endpoints cannot be accessed by counsellors and vice versa.

Passwords are hashed using **bcrypt** before storage. The `registerUser` service in `server/src/services/auth.service.ts` creates the user record, removes the password hash from the response, and issues a JWT containing the user's `id`, `email`, and `role`.

**Error Handling**

A centralized error handler in `server/src/middleware/errorHandler.ts` catches thrown errors, maps known HTTP status codes, and returns a consistent JSON error shape. This prevents unhandled exceptions from leaking internal details to the client.

### 4.3.3 Database Development

**Why Prisma and PostgreSQL**

PostgreSQL was chosen for its robust support for relational data, ACID transactions, and JSON fields. **Prisma ORM** was selected because it provides:

- Type-safe database queries generated from the schema.
- Declarative schema migrations.
- Built-in connection pooling and query optimization.
- Excellent TypeScript integration with the Express backend.

The Prisma client is generated into `server/node_modules/.prisma/client` so the backend can import it directly without cross-package path issues.

**Schema Architecture**

The schema in `prisma/schema.prisma` defines the following core models:

- `User` — base identity with `Role` enum (`STUDENT`, `COUNSELLOR`), optional `gender` and `age`, and one-to-many relations to conversations, mood entries, assessments, recommendations, and risk alerts.
- `Conversation` / `Message` — chat sessions and messages, with sentiment classification and score stored per message.
- `MoodEntry` — daily mood ratings and optional notes.
- `Phq9Assessment` — PHQ-9 responses stored as JSON, total score, and computed `SeverityLevel`.
- `Recommendation` — support suggestions generated from risk level.
- `RiskAlert` — intervention cases linking a student and an assessment, with `RiskLevel` and `AlertStatus` enums.

Indexes are placed on foreign keys and frequently queried columns (e.g., `User.email`, `MoodEntry.userId`, `RiskAlert.userId`) to keep dashboard and analytics queries performant as the dataset grows.

### 4.3.4 AI and NLP Module

The NLP service is a lightweight **FastAPI** application in `nlp-service/`. Its responsibilities are:

1. **Text preprocessing** — lowercasing, tokenization, stop-word removal, and alphabetic filtering via NLTK (`nlp-service/nlp/processor.py`).
2. **Sentiment analysis** — VADER Sentiment Analyzer produces a compound score that the backend maps to `POSITIVE`, `NEUTRAL`, or `NEGATIVE`.

The backend calls the NLP service during chat message processing. The resulting sentiment is stored alongside each `Message` record and contributes to the risk-evaluation logic. Keeping NLP as a separate microservice allows the model to be swapped or scaled independently without redeploying the main API.

---

## 4.4 User Interface Implementation

### 4.4.1 Landing Page

The public marketing site is implemented in `client/src/app/(public)/`. The layout at `client/src/app/(public)/layout.tsx` provides a sticky glassmorphism navigation bar and a comprehensive multi-column footer. Sub-pages include:

- `page.tsx` — hero section, features grid, workflow stepper, trust section, and call-to-action.
- `features/page.tsx` — detailed capability grid.
- `how-it-works/page.tsx` — timeline of the student journey from registration to intervention.
- `resources/page.tsx` — categorized self-help cards.
- `about/page.tsx` — mission, vision, privacy commitment, and technology overview.

All public pages use the `FadeIn` wrapper component, which combines Framer Motion's `useInView` hook with a fade-up animation to create a premium, scroll-driven experience.

### 4.4.2 Authentication Module

Authentication UI is implemented in `client/src/app/(auth)/`. The registration page at `client/src/app/(auth)/register/page.tsx` was made role-aware: the Age and Gender fields are conditionally rendered only when the user selects the `STUDENT` role. When `COUNSELLOR` is selected, the fields are hidden and their values are cleared. The client validates age and gender only for students, and the backend controller in `server/src/controllers/auth.controller.ts` enforces the same rule.

The login page authenticates users through the `AuthContext` and redirects students to `/home` and counsellors to `/overview` based on the returned `role`.

### 4.4.3 Student Dashboard

The student home at `client/src/app/(student)/home/page.tsx` was refactored into a **Daily Wellbeing Companion** layout. Key elements include:

- A supportive greeting: *"Great to see you, [Name]. How are you feeling today?"*
- A **Daily Wellness Thought** card that rotates encouraging messages.
- A **Daily Check-in** card containing the `MoodLogger` component plus quick links to the PHQ-9 assessment and the AI companion chat.
- A **Wellbeing Snapshot** card that displays the student's average mood, total entries, and a Recharts line chart of recent mood ratings.
- **Recent Moods** and **Latest PHQ-9** cards with skeleton loaders during data fetching.

The `useDashboard` hook in `client/src/hooks/useDashboard.ts` aggregates data from `/api/mood`, `/api/assessments/phq9`, and `/api/risk/latest` using `Promise.allSettled` so a failure in one endpoint does not block the others.

### 4.4.4 Chat Interface

The chat interface allows students to converse with the BuddyAI companion. Messages are sent to `/api/conversations` and analyzed by the NLP service. Each stored `Message` record includes the raw text, sender, inferred `Sentiment`, and `sentimentScore`. The chat UI renders the conversation thread and presents context-aware coping suggestions or escalation prompts when negative sentiment is detected.

### 4.4.5 Mood Tracking

Mood tracking is implemented by the `MoodLogger` component in `client/src/components/features/mood/MoodLogger.tsx`. It presents a 5-point emoji rating scale (Very Low to Great) and an optional notes field. On submission, it calls `moodService.logMood`, shows a success toast, and notifies the parent dashboard to refetch via TanStack Query invalidation.

The backend `MoodEntry` model stores `userId`, `moodRating`, optional `notes`, and `createdAt`. The mood trend chart on the student home visualizes the most recent entries using Recharts.

### 4.4.6 PHQ-9 Assessment

The PHQ-9 assessment is a multi-step wizard that asks students to rate nine depression-related symptoms over the previous two weeks. Responses are submitted to `/api/assessments/phq9`, where the backend calculates the total score and maps it to a `SeverityLevel`:

- 0–4 Minimal
- 5–9 Mild
- 10–14 Moderate
- 15–19 Moderately Severe
- 20–27 Severe

The student's latest severity level is surfaced on the home page as a badge, and high or severe scores trigger the risk-alert workflow.

### 4.4.7 Counsellor Dashboard

The counsellor overview at `client/src/app/(counsellor)/overview/page.tsx` was designed around the question *"Which students require my attention today?"*. It contains:

- A **System Snapshot** of pending alerts, high/critical risk students, and average response time.
- A metrics grid for critical alerts, high-risk students, pending reviews, and total students.
- An **Alert Inbox** listing risk alerts as action-oriented cards. Each card shows the student's name, risk level badge, status badge, PHQ-9 score or trigger summary, and opened time.
- A **Quick Action toolbar** on each alert with:
  - **Profile** — navigates to `/students/<userId>`.
  - **Assign** — sets the alert status to `UNDER_REVIEW`.
  - **Reviewed** — sets the alert status to `RESOLVED`.
  - **Review** — opens the detailed alert page.

The `useUpdateAlert` hook in `client/src/hooks/useAlerts.ts` performs optimistic updates and invalidates related queries on success. The empty state displays a supportive message: *"No active alerts — have a great day!"*

---

## 4.5 System Testing

The testing strategy combines automated unit/integration tests with manual browser verification.

### Automated Tests

The server test suite in `server/src/__tests__/` uses **Vitest** and **Supertest** to exercise the API without a running server. Test files include:

- `auth.test.ts` — registration, login, token validation, and role-based access.
- `mood.test.ts` — mood logging and retrieval.
- `assessment.test.ts` — PHQ-9 submission, scoring, and severity classification.
- `risk.test.ts` — risk evaluation and alert generation.

Tests run against a test database configured in `server/src/__tests__/setup.ts` and are executed with `npm test` in the `server/` directory.

### Manual Verification

Browser-based verification confirmed:

- Role-aware registration hides age/gender for counsellors and enforces them for students.
- Student home renders check-in, wellbeing snapshot, skeletons, and toasts correctly.
- Counsellor dashboard displays metrics, alert inbox, quick actions, and helpful empty states.
- Page transitions and toast animations are smooth across authenticated routes.
- No console errors or broken links.

---

## 4.6 Results and Discussion

The implementation successfully realized the project's core objectives:

1. **Conversational AI support** — The NLP service preprocesses student messages and returns sentiment scores that are persisted per message.
2. **PHQ-9 integration** — Automated scoring and severity classification are implemented end-to-end, with results visible to both students and counsellors.
3. **Mood monitoring** — Daily mood logging, historical trends, and wellbeing snapshots provide students with continuous feedback.
4. **Risk detection and alerts** — High and severe PHQ-9 scores generate counsellor-facing alerts in real time.
5. **Counsellor workflow** — The alert inbox with quick actions reduces the time between risk identification and human intervention.
6. **Privacy and security** — JWT authentication, bcrypt password hashing, and role-based middleware protect sensitive student data.

From a performance perspective, the backend responds to most dashboard queries in sub-second time due to indexed foreign keys and efficient Prisma queries. The analytics service uses `DISTINCT ON` to compute the latest assessment per student without loading full history. The frontend's TanStack Query caching reduces redundant network requests during navigation.

The separation of the NLP microservice also proved architecturally sound: the sentiment model can be retrained or replaced without modifying the main API contract.

---

## 4.7 Chapter Summary

This chapter described the implementation of BuddyAI from environment setup through deployment-ready services. The frontend was built with Next.js, Tailwind CSS, and a custom Clinical Calm design system. The backend was implemented as an Express API with Prisma and PostgreSQL. The AI/NLP layer was delivered as a Python FastAPI microservice using NLTK and VADER. User interfaces for the public site, authentication, student wellbeing companion, chat, mood tracking, PHQ-9 assessment, and counsellor dashboard were presented with references to specific source files.

The system was validated through a combination of automated Vitest tests and manual browser verification. Results show that the platform successfully supports the intended clinical workflow: students self-monitor and complete assessments, the system detects risk, and counsellors are notified through an actionable dashboard. The next chapter will evaluate the system against functional and non-functional requirements.

---

## Appendix: Key File Reference

| File | Responsibility |
|------|----------------|
| `prisma/schema.prisma` | Database schema, enums, relations |
| `server/src/index.ts` | Express application bootstrap and route mounting |
| `server/src/middleware/auth.ts` | JWT authentication and role guards |
| `server/src/controllers/auth.controller.ts` | Registration and login logic |
| `server/src/services/auth.service.ts` | User creation, password hashing, token issuance |
| `server/src/services/analytics.service.ts` | Dashboard analytics and reporting queries |
| `client/src/app/layout.tsx` | Root layout with fonts and providers |
| `client/src/styles/design-tokens.ts` | Clinical Calm design tokens |
| `client/src/app/globals.css` | Tailwind v4 theme token definitions |
| `client/src/components/shared/Providers.tsx` | QueryClient, AuthProvider, ToastProvider composition |
| `client/src/components/shared/PageTransition.tsx` | Framer Motion page transition wrapper |
| `client/src/components/shared/ToastContainer.tsx` | Animated toast notifications |
| `client/src/app/(auth)/register/page.tsx` | Role-aware registration form |
| `client/src/app/(student)/home/page.tsx` | Student Daily Wellbeing Companion |
| `client/src/app/(counsellor)/overview/page.tsx` | Counsellor dashboard and alert inbox |
| `client/src/components/features/mood/MoodLogger.tsx` | Mood rating input component |
| `nlp-service/nlp/processor.py` | NLTK text preprocessing |
| `nlp-service/main.py` | FastAPI sentiment analysis endpoint |
