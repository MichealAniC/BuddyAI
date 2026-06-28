# BuddyAI

**AI-Based Mental Health Support System for Students in Tertiary Institutions**

BuddyAI is an intelligent, privacy-first platform that helps students monitor their emotional wellbeing, complete clinically validated depression screenings, and receive timely support. It combines a conversational AI companion, PHQ-9 assessments, daily mood tracking, and a real-time counsellor dashboard to bridge the gap between students and university mental health services.

> **Important:** BuddyAI is a support and early-intervention tool, not a medical diagnosis system. Users experiencing severe distress should always consult qualified mental health professionals or emergency services.

---

## Key Features

### For Students

- **Role-Aware Registration** â€” Students provide age and gender for demographic profiling; counsellors register without these fields.
- **Daily Mood Tracking** â€” 5-point emoji scale with optional notes, persisted over time.
- **PHQ-9 Assessment** â€” Clinically validated 9-item depression screening with automated severity classification.
- **AI Companion Chat** â€” Natural-language conversations analyzed for sentiment to detect emotional distress.
- **Wellbeing Snapshot** â€” Personal mood trend chart and recent assessment summary.
- **Curated Resources** â€” Self-help articles, stress-management techniques, and emergency support information.

### For Counsellors

- **Alert Inbox** â€” Real-time risk alerts triggered by PHQ-9 severity and sentiment analysis.
- **Quick Actions** â€” View student profile, assign a case, or mark an alert as reviewed directly from the dashboard.
- **System Snapshot** â€” Pending alerts, high-risk student counts, and average response-time KPIs.
- **Population Analytics** â€” Distribution of student severity levels, wellbeing trends, and case-resolution velocity.

### Clinical Workflow

1. A student registers and completes a baseline PHQ-9 assessment.
2. The student logs mood daily and chats with the AI companion.
3. NLP sentiment analysis and PHQ-9 scores feed into a risk-evaluation engine.
4. High-risk or severe cases generate counsellor alerts in real time.
5. Counsellors review, assign, and resolve cases through the dashboard.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript | Server-rendered, type-safe web application |
| **Styling** | Tailwind CSS 4, Clinical Calm design tokens | Consistent, premium UI with a calm clinical aesthetic |
| **UI Components** | Radix UI primitives + custom `SanctuaryCard`, `Button`, `Badge`, `Input`, `Dialog` | Accessible, composable component library |
| **State & Data** | TanStack Query (React Query) | Server-state caching, mutations, and optimistic updates |
| **Animations** | Framer Motion | Scroll-triggered animations, page transitions, toast notifications |
| **Charts** | Recharts | Wellbeing snapshots and counsellor analytics visualizations |
| **Backend** | Node.js, Express, TypeScript | RESTful API and business logic |
| **Authentication** | JWT, bcrypt | Secure token-based auth and password hashing |
| **Database** | PostgreSQL | Relational data store |
| **ORM** | Prisma | Type-safe schema management and queries |
| **AI / NLP** | Python, FastAPI, NLTK, VADER | Sentiment analysis microservice |
| **Testing** | Vitest (server), Supertest | Unit and integration tests for API endpoints |
| **DevOps** | Docker Compose, concurrently, nodemon | Local orchestration and hot-reload development |

---

## Project Structure

```
BuddyAI/
â”œâ”€â”€ client/                  # Next.js frontend
â”‚   â”œâ”€â”€ src/app/             # App Router route groups
â”‚   â”‚   â”œâ”€â”€ (auth)/          # Login & registration
â”‚   â”‚   â”œâ”€â”€ (student)/       # Student portal
â”‚   â”‚   â”œâ”€â”€ (counsellor)/    # Counsellor portal
â”‚   â”‚   â””â”€â”€ (public)/        # Marketing site (landing, features, about, etc.)
â”‚   â”œâ”€â”€ src/components/      # UI primitives, layout, feature components
â”‚   â”œâ”€â”€ src/hooks/           # React Query hooks and auth
â”‚   â”œâ”€â”€ src/styles/          # Clinical Calm design tokens
â”‚   â””â”€â”€ package.json
â”œâ”€â”€ server/                  # Express backend
â”‚   â”œâ”€â”€ src/controllers/     # Route handlers
â”‚   â”œâ”€â”€ src/services/        # Business logic & Prisma queries
â”‚   â”œâ”€â”€ src/routes/          # API route definitions
â”‚   â”œâ”€â”€ src/middleware/      # Auth & error handling
â”‚   â”œâ”€â”€ src/__tests__/       # Vitest test suite
â”‚   â””â”€â”€ package.json
â”œâ”€â”€ nlp-service/             # Python FastAPI sentiment service
â”‚   â”œâ”€â”€ nlp/                 # Text preprocessing with NLTK
â”‚   â”œâ”€â”€ main.py              # FastAPI entry point
â”‚   â””â”€â”€ requirements.txt
â”œâ”€â”€ prisma/
â”‚   â””â”€â”€ schema.prisma        # Database schema and enums
â”œâ”€â”€ docker-compose.yml       # PostgreSQL container
â””â”€â”€ package.json             # Root orchestration scripts
```

---

## Getting Started

### Prerequisites

- **Node.js** 20+ and **npm**
- **Python** 3.10+ and **pip**
- **PostgreSQL** 15+ (or Docker for the provided container)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/buddyai.git
cd buddyai
```

### 2. Install Dependencies

```bash
npm run setup
```

This installs root, server, and client Node dependencies, plus Python packages for the NLP service.

### 3. Configure Environment Variables

Create `.env` files from the examples:

```bash
cp .env.example .env
cp server/.env.example server/.env
cp client/.env.local.example client/.env.local
```

**Root `.env`** (Prisma database connection):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/buddyai?schema=public"
```

**`server/.env`**:

```env
PORT=5000
JWT_SECRET="your-super-secret-jwt-key"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/buddyai?schema=public"
```

**`client/.env.local`**:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

> Replace credentials with your local PostgreSQL credentials.

### 4. Start PostgreSQL (Docker option)

```bash
docker-compose up -d
```

This starts a PostgreSQL container on port `5432`.

### 5. Run Database Migrations

```bash
npm run db:migrate
```

Apply Prisma migrations and generate the client.

### 6. Start the Development Servers

```bash
npm run dev
```

This concurrently starts:

- **Backend API** at `http://localhost:5000`
- **Next.js Frontend** at `http://localhost:3000`
- **NLP Service** at `http://localhost:8000`

Visit `http://localhost:3000` to access BuddyAI.

### Alternative: Start Services Individually

```bash
# Terminal 1 â€” Backend
npm run dev:server

# Terminal 2 â€” Frontend
npm run dev:client

# Terminal 3 â€” NLP service
npm run dev:nlp
```

---

## Running Tests

### Server Tests

```bash
cd server
npm test
```

The server test suite covers authentication, mood tracking, PHQ-9 assessments, risk evaluation, and alert workflows using Vitest and Supertest.

### Frontend Type Checking

```bash
cd client
npx tsc --noEmit
```

---

## Database Schema

The PostgreSQL schema is defined in `prisma/schema.prisma` and includes:

- `User` â€” students and counsellors with role-based access
- `Conversation` / `Message` â€” chat sessions with sentiment metadata
- `MoodEntry` â€” daily mood logs
- `Phq9Assessment` â€” completed screenings and severity levels
- `Recommendation` â€” generated support suggestions
- `RiskAlert` â€” counsellor-facing intervention cases

Run `npm run db:studio` to explore the database visually.

---

## Security & Privacy

- **Password hashing** with bcrypt
- **JWT-based authentication** with protected middleware
- **Role-based access control** separating student and counsellor routes
- **Input validation** on both client and server
- **Sensitive data handling** aligned with university privacy best practices

---

## Research Contribution

This project contributes to the field of AI in mental health by demonstrating how natural language processing, validated clinical instruments, and real-time dashboards can be integrated into a single, student-centred support platform.

---

## Disclaimer

BuddyAI does not provide medical diagnoses and should not replace professional mental health services. If you or someone you know is in crisis, please contact local emergency services or a crisis helpline immediately.

---

## License

[MIT](LICENSE)
