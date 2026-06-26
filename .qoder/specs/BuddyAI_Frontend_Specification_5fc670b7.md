# BuddyAI Frontend Specification Document

## 1. Technology Stack

### Current State
| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.9 |
| UI Library | React | 19.2.4 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Component Library | **None** | — |
| State Management | **None** (raw useState) | — |
| Data Fetching | **None** (raw fetch) | — |
| Form Handling | **None** (manual) | — |

### Recommended Additions

| Concern | Library | Rationale |
|---------|---------|-----------|
| **Component Primitives** | shadcn/ui + Radix UI | Unstyled accessibility-first primitives; Tailwind-native styling; copy-paste ownership (no heavy dependency) |
| **State Management** | React Context + custom hooks | Lightweight; avoids Redux boilerplate; sufficient for current scale |
| **Data Fetching & Cache** | TanStack React Query v5 | Stale-while-revalidate caching; deduplication; optimistic updates; eliminates waterfall fetches |
| **Form Validation** | React Hook Form + Zod | Performant (uncontrolled); schema-based validation; TypeScript-native |
| **Utility** | clsx + tailwind-merge | Clean conditional class composition |
| **Icons** | Lucide React | Consistent, lightweight icon set aligned with shadcn/ui |
| **Charts** (Phase 2) | Recharts | Lightweight SVG charts for mood trends and analytics |

### Why shadcn/ui over alternatives
- **vs. Material UI**: MUI imposes its own design language; difficult to achieve "digital sanctuary" aesthetic without fighting the framework.
- **vs. Chakra UI**: Heavier runtime; Tailwind-native approach more performant.
- **vs. Custom-only**: Excessive time investment for accessible components (dialogs, dropdowns, tooltips).
- **shadcn/ui** gives us copy-paste components we fully own, styled with our Tailwind tokens, with zero runtime cost beyond what we write.

---

## 2. Design System

### 2.1 Color Tokens

The palette evokes calm, safety, and professionalism — muted indigo-blues for trust, sage greens for growth, and warm neutrals for comfort.

```
/* CSS Custom Properties — defined in globals.css */

/* Primary: Muted Indigo-Blue (Trust, Calm) */
--primary-50:  #eef2ff;
--primary-100: #e0e7ff;
--primary-200: #c7d2fe;
--primary-300: #a5b4fc;
--primary-400: #818cf8;
--primary-500: #6366f1;   /* Base */
--primary-600: #4f46e5;
--primary-700: #4338ca;

/* Secondary: Sage Green (Growth, Wellness) */
--secondary-50:  #f0fdf4;
--secondary-100: #dcfce7;
--secondary-200: #bbf7d0;
--secondary-300: #86efac;
--secondary-400: #4ade80;
--secondary-500: #6b9080;   /* Muted sage — base */
--secondary-600: #527a68;
--secondary-700: #3d5c4e;

/* Neutral: Warm Grays (Comfort, Readability) */
--neutral-50:  #fafaf9;
--neutral-100: #f5f5f4;
--neutral-200: #e7e5e4;
--neutral-300: #d6d3d1;
--neutral-400: #a8a29e;
--neutral-500: #78716c;
--neutral-600: #57534e;
--neutral-700: #44403c;
--neutral-800: #292524;
--neutral-900: #1c1917;

/* Semantic: Status Colors */
--success: #4ade80;
--warning: #fbbf24;
--danger:  #f87171;
--info:    #60a5fa;

/* Surface & Background */
--bg-primary:   #fafaf9;    /* Warm off-white */
--bg-secondary: #f5f5f4;    /* Subtle card background */
--bg-elevated:  #ffffff;     /* Cards, modals */
--border:       #e7e5e4;    /* Soft dividers */
```

### 2.2 Typography

| Role | Font | Size | Weight | Line Height |
|------|------|------|--------|-------------|
| H1 (Page title) | Geist Sans | 28px / 1.75rem | 600 | 1.3 |
| H2 (Section) | Geist Sans | 22px / 1.375rem | 600 | 1.35 |
| H3 (Card title) | Geist Sans | 18px / 1.125rem | 500 | 1.4 |
| Body | Geist Sans | 15px / 0.9375rem | 400 | 1.6 |
| Body Small | Geist Sans | 13px / 0.8125rem | 400 | 1.5 |
| Label | Geist Sans | 13px / 0.8125rem | 500 | 1.4 |
| Caption | Geist Sans | 12px / 0.75rem | 400 | 1.4 |

### 2.3 Component Standards

| Property | Value |
|----------|-------|
| Border Radius (cards) | 16px (`rounded-2xl`) |
| Border Radius (buttons/inputs) | 10px (`rounded-[10px]`) |
| Border Radius (badges) | 9999px (`rounded-full`) |
| Shadow (cards) | `0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)` |
| Shadow (elevated/hover) | `0 4px 12px rgba(0,0,0,0.06)` |
| Spacing unit | 4px base (use multiples: 8, 12, 16, 20, 24, 32, 48) |
| Container max-width | 1200px |
| Sidebar width | 260px |
| Min touch target | 44px |

### 2.4 UX Principles Codified

- **Generous whitespace**: Minimum 24px padding on cards; 32px between sections.
- **Soft transitions**: All interactive elements use `transition-all duration-200 ease-out`.
- **Muted interactions**: Hover states lighten/darken by one shade only; no jarring color shifts.
- **Emotional safety**: Avoid clinical language (not "patient" but "student"; not "disorder" but "challenge").
- **Progressive disclosure**: Show summaries first; details on request.

---

## 3. Architecture

### 3.1 Route Structure (Next.js App Router)

```
client/src/app/
├── layout.tsx                          # Root: fonts, providers (Auth, QueryClient, Toast)
├── page.tsx                            # Root redirect (role-based → student or counsellor)
├── globals.css                         # Design tokens + Tailwind base
│
├── (auth)/                             # Auth route group — no sidebar/navbar
│   ├── layout.tsx                      # Centered card layout, decorative background
│   ├── login/page.tsx
│   └── register/page.tsx
│
├── (student)/                          # Student route group
│   ├── layout.tsx                      # Student shell: sidebar + top bar
│   ├── home/page.tsx                   # "Home" — welcome + quick actions + summary
│   ├── buddy/page.tsx                  # "Buddy" — AI chat interface
│   ├── journey/page.tsx                # "Journey" — mood trends, PHQ-9 history, progress
│   ├── support/page.tsx                # "Support" — resources, recommendations, emergency
│   └── profile/page.tsx                # "Profile" — settings, account
│
├── (counsellor)/                       # Counsellor route group
│   ├── layout.tsx                      # Counsellor shell: sidebar + top bar
│   ├── overview/page.tsx               # "Overview" — stats, recent activity
│   ├── students/page.tsx               # "Students" — student list + search
│   ├── students/[id]/page.tsx          # Student detail view
│   ├── alerts/page.tsx                 # "Alerts" — risk alerts queue
│   ├── alerts/[id]/page.tsx            # Alert detail + action
│   ├── cases/page.tsx                  # "Cases" — tracked cases
│   └── analytics/page.tsx              # "Analytics" — trends, outcomes
│
└── not-found.tsx                       # 404 page
```

### 3.2 Component Directory

```
client/src/
├── components/
│   ├── ui/                             # shadcn/ui primitives (Button, Card, Input, Badge, Dialog, etc.)
│   ├── layout/
│   │   ├── StudentSidebar.tsx          # Student navigation sidebar
│   │   ├── CounsellorSidebar.tsx       # Counsellor navigation sidebar
│   │   ├── TopBar.tsx                  # Top bar with user avatar, notifications
│   │   └── AppShell.tsx                # Shell wrapper (sidebar + content area)
│   ├── features/
│   │   ├── chat/                       # Chat-specific components (MessageBubble, ChatInput, etc.)
│   │   ├── mood/                       # Mood-specific (MoodSelector, MoodChart, MoodCard)
│   │   ├── assessment/                 # PHQ-9 specific (QuestionCard, ResultSummary)
│   │   └── alerts/                     # Alert-specific (AlertCard, AlertTimeline)
│   └── shared/                         # Cross-cutting (LoadingSpinner, EmptyState, ErrorBoundary)
│
├── hooks/
│   ├── useAuth.ts                      # Auth state + actions
│   ├── useMood.ts                      # Mood API queries
│   ├── useAssessment.ts                # Assessment API queries
│   ├── useChat.ts                      # Chat API queries
│   ├── useAlerts.ts                    # Alerts API queries (counsellor)
│   └── useToast.ts                     # Toast notification trigger
│
├── context/
│   ├── AuthContext.tsx                  # Auth provider wrapping app
│   └── ToastContext.tsx                # Toast state provider
│
├── lib/
│   ├── api.ts                          # Base API client (kept, enhanced with types)
│   └── auth.ts                         # Token utilities (kept, consumed by AuthContext)
│
├── types/
│   └── index.ts                        # All shared TypeScript interfaces
│
├── utils/
│   ├── colors.ts                       # getRiskColor, getSeverityColor helpers
│   └── formatters.ts                   # Date, number formatting utilities
│
└── constants/
    └── navigation.ts                   # Nav items config (labels, icons, paths per role)
```

### 3.3 Data Flow Architecture

```
[Page] → useQuery hook → apiRequest() → Backend API
                ↓
         React Query Cache (stale-while-revalidate)
                ↓
         Component renders with data / loading / error states
```

- **Auth guard**: `(student)/layout.tsx` and `(counsellor)/layout.tsx` check auth via `useAuth()`. Redirect to `/login` if unauthenticated or wrong role.
- **No SSR for protected pages**: All protected pages remain client-rendered (user-specific data). Auth pages can be server-rendered for faster first paint.
- **API layer unchanged**: Existing `apiRequest()` in `lib/api.ts` continues to handle Bearer token injection and 401 redirects.

### 3.4 Navigation Mapping (Old → New)

| Old Route | New Route | New Label |
|-----------|-----------|-----------|
| `/dashboard` | `/(student)/home` | Home |
| `/chat` | `/(student)/buddy` | Buddy |
| `/mood` | `/(student)/journey` | Journey |
| `/assessment` | `/(student)/journey` (tab/section) | Journey → Assessment |
| — | `/(student)/support` | Support (new) |
| — | `/(student)/profile` | Profile (new) |
| `/counsellor/dashboard` | `/(counsellor)/overview` | Overview |
| `/counsellor/alerts/[id]` | `/(counsellor)/alerts/[id]` | Alerts |
| — | `/(counsellor)/students` | Students (new) |
| — | `/(counsellor)/cases` | Cases (new) |
| — | `/(counsellor)/analytics` | Analytics (new) |

---

## 4. Implementation Roadmap

Prioritized by user impact. Each task is independently deployable.

### Task 1: Foundation Setup (Priority: Critical)
**Impact:** Enables all subsequent work.

- Install dependencies: shadcn/ui CLI, TanStack Query, React Hook Form, Zod, clsx, tailwind-merge, Lucide icons
- Create `tailwind.config.ts` with design token extensions (colors, border-radius, shadows)
- Update `globals.css` with full color token system (Section 2.1 above)
- Create shared types in `src/types/index.ts` (User, MoodEntry, Assessment, Alert, Conversation, Message)
- Create utility functions: `src/utils/colors.ts`, `src/utils/formatters.ts`

**Files:** `package.json`, `tailwind.config.ts`, `globals.css`, `src/types/index.ts`, `src/utils/*`
**Depends on:** Nothing

---

### Task 2: Auth & Provider Infrastructure (Priority: Critical)
**Impact:** Eliminates duplicated auth logic across all pages; enables route protection.

- Create `AuthContext.tsx` with provider pattern (wraps localStorage auth into React Context)
- Create `useAuth` hook (returns user, isAuthenticated, role, login, logout, isLoading)
- Create `ToastContext.tsx` for feedback notifications
- Set up React Query `QueryClientProvider` in root layout
- Update `layout.tsx` to wrap children with providers (AuthProvider → QueryClientProvider → ToastProvider → children)

**Files:** `src/context/AuthContext.tsx`, `src/hooks/useAuth.ts`, `src/context/ToastContext.tsx`, `src/lib/queryClient.ts`, `src/app/layout.tsx`
**Depends on:** Task 1

---

### Task 3: Route Group Migration (Priority: High)
**Impact:** Isolates layouts by role; eliminates Navbar on auth pages; cleaner code organization.

- Create `(auth)/layout.tsx` — centered layout with decorative gradient background, no navbar
- Create `(student)/layout.tsx` — AppShell with StudentSidebar + TopBar + auth guard
- Create `(counsellor)/layout.tsx` — AppShell with CounsellorSidebar + TopBar + auth guard
- Move existing login/register pages into `(auth)/` (content preserved, styling updated)
- Move existing student pages into `(student)/` with renamed routes
- Move existing counsellor pages into `(counsellor)/` with renamed routes
- Remove old `Navbar.tsx` (replaced by role-specific sidebars)
- Add redirect rules in `next.config.ts` for old URL paths

**Files:** All `layout.tsx` files, page migrations, `next.config.ts`, delete `Navbar.tsx`
**Depends on:** Task 2

---

### Task 4: Navigation & Layout Shell (Priority: High)
**Impact:** Defines the entire user experience frame; first visible change.

- Build `AppShell.tsx` — flex container with sidebar + scrollable content area
- Build `StudentSidebar.tsx` — items: Home (🏠), Buddy (💬), Journey (📈), Support (🤝), Profile (👤)
- Build `CounsellorSidebar.tsx` — items: Overview (📊), Students (👥), Alerts (🔔), Cases (📋), Analytics (📉)
- Build `TopBar.tsx` — greeting, avatar, notification bell, logout
- Define nav config in `src/constants/navigation.ts` (single source of truth for labels, icons, paths)
- Active state highlighting based on current pathname
- Collapsible sidebar on mobile (responsive)

**Files:** `src/components/layout/*`, `src/constants/navigation.ts`
**Depends on:** Task 3

---

### Task 5: Core UI Component Library (Priority: High)
**Impact:** Enables consistent, rapid page development.

Initialize shadcn/ui components (copy-paste into `src/components/ui/`):
- Button (variants: primary, secondary, ghost, danger; sizes: sm, md, lg)
- Card (with CardHeader, CardContent, CardFooter)
- Input + Label + FormField (integrated with React Hook Form)
- Badge (variants: default, success, warning, danger, info)
- Dialog / Sheet (for modals and slide-overs)
- Select / Dropdown
- Skeleton (loading placeholders)
- Avatar
- Tooltip

All styled with our design tokens (muted indigo primary, rounded-2xl cards, soft shadows).

**Files:** `src/components/ui/*`
**Depends on:** Task 1 (tokens available)

---

### Task 6: Student — Home Page (Priority: High)
**Impact:** First page students see; sets emotional tone.

- Welcome message with student's first name
- Quick action cards: "Talk to Buddy", "Log Mood", "Take Assessment"
- Recent mood summary (last 7 days mini-chart)
- Latest risk assessment status (if available)
- Motivational content / daily wellness tip
- Consumes: `GET /api/mood/trends`, `GET /api/risk/latest`, `GET /api/dashboard/stats`

**Files:** `src/app/(student)/home/page.tsx`, `src/hooks/useDashboard.ts`
**Depends on:** Tasks 4, 5

---

### Task 7: Student — Buddy (Chat) Page (Priority: High)
**Impact:** Core feature; primary interaction point.

- Redesign chat interface with message bubbles (user right, AI left)
- Soft color-coded sentiment indicators (subtle, non-alarming)
- Typing indicator animation
- Message timestamp formatting
- Auto-scroll to latest message
- Input with send button + keyboard shortcut
- Consumes: `POST/GET /api/conversations`, `POST/GET /api/conversations/:id/messages`

**Files:** `src/app/(student)/buddy/page.tsx`, `src/components/features/chat/*`, `src/hooks/useChat.ts`
**Depends on:** Tasks 4, 5

---

### Task 8: Student — Journey Page (Priority: Medium)
**Impact:** Combines mood tracking + assessment history; shows progress.

- Mood logging widget (1-5 scale with emoji, optional notes)
- Mood trends chart (Recharts line/area chart, 7/30/90 day views)
- PHQ-9 assessment section (take new or view history)
- Assessment results with severity badge and recommendations
- Consumes: `GET/POST /api/mood`, `GET /api/mood/trends`, `GET/POST /api/assessments/phq9`

**Files:** `src/app/(student)/journey/page.tsx`, `src/components/features/mood/*`, `src/components/features/assessment/*`, `src/hooks/useMood.ts`, `src/hooks/useAssessment.ts`
**Depends on:** Tasks 4, 5 + Recharts dependency

---

### Task 9: Student — Support & Profile Pages (Priority: Medium)
**Impact:** Completes student experience; provides safety net.

**Support page:**
- Coping resources and recommendations (from API)
- Emergency contact information
- "Talk to a counsellor" CTA
- External helpline links

**Profile page:**
- Account info display/edit
- Settings (notification preferences)
- Logout

**Files:** `src/app/(student)/support/page.tsx`, `src/app/(student)/profile/page.tsx`
**Depends on:** Tasks 4, 5

---

### Task 10: Counsellor — Overview + Alerts (Priority: Medium)
**Impact:** Core counsellor workflow; critical for risk response.

**Overview:**
- Stats cards: total students, active alerts, cases in progress
- Recent alerts feed
- Quick filters (by severity, status)

**Alerts:**
- Alert list with severity badges, timestamps, student info
- Alert detail page with full context, sentiment history, action buttons
- Mark as reviewed/resolved flow
- Consumes: `GET/PATCH /api/alerts`, `GET /api/alerts/:id`, `GET /api/dashboard/stats`

**Files:** `src/app/(counsellor)/overview/page.tsx`, `src/app/(counsellor)/alerts/page.tsx`, `src/app/(counsellor)/alerts/[id]/page.tsx`, `src/hooks/useAlerts.ts`
**Depends on:** Tasks 4, 5

---

### Task 11: Counsellor — Students, Cases, Analytics (Priority: Low)
**Impact:** Enhanced counsellor tools; less urgent than core workflows.

- Students list with search/filter (may require new API endpoint)
- Cases management (tracked students — may extend existing alerts)
- Analytics dashboard with aggregate trends (charts)
- These pages may be placeholder/MVP initially if backend endpoints don't exist yet

**Files:** `src/app/(counsellor)/students/*`, `src/app/(counsellor)/cases/*`, `src/app/(counsellor)/analytics/*`
**Depends on:** Task 10

---

### Task 12: Polish, Accessibility & Performance (Priority: Low)
**Impact:** Production readiness; compliance.

- ARIA labels on all interactive elements
- Keyboard navigation for sidebar and dialogs
- Focus management in chat and forms
- Responsive design audit (mobile breakpoints)
- Loading skeletons on all data-dependent sections
- Error boundaries with friendly fallback UI
- Bundle analysis and lazy-loading for heavy routes (Recharts)
- Lighthouse audit targeting LCP < 2s, CLS < 0.1

**Files:** Cross-cutting; all components and pages
**Depends on:** All previous tasks

---

## 5. Rejected Alternatives

| Alternative | Reason for Rejection |
|-------------|---------------------|
| **Material UI** | Imposes Google's Material design language; fighting it to achieve "digital sanctuary" aesthetic would negate its benefits |
| **Full SSR/RSC for protected pages** | User-specific data means no cache benefit from server rendering; adds complexity without gain |
| **Redux/Zustand for state** | Overkill for current scale (7 pages, local user state); React Context + React Query covers all needs |
| **Nested `(protected)` route group** | Extra nesting `(protected)/(student)` adds indirection without benefit; flat `(student)`/`(counsellor)` suffices with auth guards in each layout |
| **Custom component library from scratch** | Time-intensive; accessibility is hard to get right; shadcn/ui provides tested primitives we can customize |
| **GraphQL layer** | API is already simple REST; adding GraphQL for 7 endpoints is unnecessary complexity |
| **Monorepo shared types (server ↔ client)** | Would require workspace restructuring; instead, manually sync types in `src/types/` — sufficient at current scale |

---

## 6. Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| Route migration breaks existing bookmarks/links | Add explicit `redirects` in `next.config.ts` mapping old paths → new |
| Auth flow regression during context refactor | Keep `lib/auth.ts` as-is; AuthContext wraps it without replacing internals |
| Bundle size growth from new dependencies | Tree-shake shadcn/ui (only import used components); lazy-load Recharts; monitor with `@next/bundle-analyzer` |
| Design token drift (devs using raw Tailwind colors) | ESLint rule or PR review convention: no raw color classes outside `src/components/ui/` |
| Hydration mismatch with auth-dependent UI | Use `mounted` state pattern in layouts; suppress hydration warning on auth-dependent elements |
| New pages without matching API endpoints | Mark as "placeholder" in roadmap; implement with mock data, wire up when backend ready |

---

## 7. Success Metrics

| Metric | Current (Estimated) | Target |
|--------|-------------------|--------|
| Lighthouse Performance | ~65 | > 85 |
| Largest Contentful Paint | ~2.5s | < 1.8s |
| Cumulative Layout Shift | ~0.3 | < 0.1 |
| Component reuse rate | ~0% | > 70% |
| Lines of code per page (avg) | ~200 | < 120 |
| Auth boilerplate per page | ~15 lines | 0 (handled by layout) |
