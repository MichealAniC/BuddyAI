# Dashboard and Analytics

<cite>
**Referenced Files in This Document**
- [client/src/app/dashboard/page.tsx](file://client/src/app/dashboard/page.tsx)
- [client/src/app/counsellor/dashboard/page.tsx](file://client/src/app/counsellor/dashboard/page.tsx)
- [client/src/app/assessment/page.tsx](file://client/src/app/assessment/page.tsx)
- [client/src/app/mood/page.tsx](file://client/src/app/mood/page.tsx)
- [client/src/app/counsellor/alerts/[id]/page.tsx](file://client/src/app/counsellor/alerts/[id]/page.tsx)
- [server/src/controllers/dashboard.controller.ts](file://server/src/controllers/dashboard.controller.ts)
- [server/src/services/dashboard.service.ts](file://server/src/services/dashboard.service.ts)
- [server/src/routes/dashboard.routes.ts](file://server/src/routes/dashboard.routes.ts)
- [server/src/controllers/assessment.controller.ts](file://server/src/controllers/assessment.controller.ts)
- [server/src/services/assessment.service.ts](file://server/src/services/assessment.service.ts)
- [server/src/controllers/mood.controller.ts](file://server/src/controllers/mood.controller.ts)
- [server/src/services/mood.service.ts](file://server/src/services/mood.service.ts)
- [server/src/services/alert.service.ts](file://server/src/services/alert.service.ts)
- [server/src/services/risk.service.ts](file://server/src/services/risk.service.ts)
- [prisma/schema.prisma](file://prisma/schema.prisma)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document describes the dashboard and analytics system for administrative monitoring and reporting. It covers:
- Student dashboard: personal assessment history, mood trends, recommendation access, and resource navigation
- Counselor dashboard: risk alert management, student monitoring tools, assessment review capabilities, and intervention tracking
- Administrative interface: system monitoring, user management, report generation, and analytics visualization
- Data aggregation algorithms for insights, trend analysis, and performance metrics
- Reporting system for institutional summaries, intervention effectiveness, and system utilization
- Practical examples of dashboard navigation, data interpretation, and decision support
- Privacy considerations, access controls, and integration with clinical quality measures

## Project Structure
The system comprises:
- Frontend (Next.js app) with pages for student and counselor dashboards, assessments, mood tracking, and alert detail
- Backend (Express server) with controllers, services, and routes for dashboards, assessments, mood, alerts, and risk
- Prisma schema modeling users, assessments, mood entries, risk alerts, recommendations, and messages
- NLP service for sentiment analysis (external to this document scope)

```mermaid
graph TB
subgraph "Client"
S_Dashboard["Student Dashboard<br/>(client/src/app/dashboard/page.tsx)"]
C_Dashboard["Counselor Dashboard<br/>(client/src/app/counsellor/dashboard/page.tsx)"]
Assessment["Assessment Page<br/>(client/src/app/assessment/page.tsx)"]
Mood["Mood Tracker<br/>(client/src/app/mood/page.tsx)"]
AlertDetail["Alert Detail<br/>(client/src/app/counsellor/alerts/[id]/page.tsx)"]
end
subgraph "Server"
RoutesDash["Routes: /api/dashboard<br/>(server/src/routes/dashboard.routes.ts)"]
CtrlDash["Controller: getStats<br/>(server/src/controllers/dashboard.controller.ts)"]
SvcDash["Service: getDashboardStats<br/>(server/src/services/dashboard.service.ts)"]
RoutesAssess["Routes: /api/assessments<br/>(server/src/routes/assessment.routes.ts)"]
CtrlAssess["Controller: submit/get history<br/>(server/src/controllers/assessment.controller.ts)"]
SvcAssess["Service: submitAssessment, getAssessmentHistory<br/>(server/src/services/assessment.service.ts)"]
RoutesMood["Routes: /api/mood<br/>(server/src/routes/mood.routes.ts)"]
CtrlMood["Controller: record/get trends<br/>(server/src/controllers/mood.controller.ts)"]
SvcMood["Service: createMoodEntry, getMoodTrends<br/>(server/src/services/mood.service.ts)"]
SvcAlert["Service: getAlerts, updateAlertStatus, getStudentSummary<br/>(server/src/services/alert.service.ts)"]
SvcRisk["Service: evaluateRisk, getLatestRiskEvaluation<br/>(server/src/services/risk.service.ts)"]
end
subgraph "Data"
Schema["Prisma Schema<br/>(prisma/schema.prisma)"]
end
S_Dashboard --> RoutesDash
C_Dashboard --> RoutesDash
Assessment --> RoutesAssess
Mood --> RoutesMood
AlertDetail --> SvcAlert
RoutesDash --> CtrlDash --> SvcDash
RoutesAssess --> CtrlAssess --> SvcAssess
RoutesMood --> CtrlMood --> SvcMood
SvcDash --- Schema
SvcAssess --- Schema
SvcMood --- Schema
SvcAlert --- Schema
SvcRisk --- Schema
```

**Diagram sources**
- [client/src/app/dashboard/page.tsx:1-206](file://client/src/app/dashboard/page.tsx#L1-L206)
- [client/src/app/counsellor/dashboard/page.tsx:1-213](file://client/src/app/counsellor/dashboard/page.tsx#L1-L213)
- [client/src/app/assessment/page.tsx:1-192](file://client/src/app/assessment/page.tsx#L1-L192)
- [client/src/app/mood/page.tsx:1-245](file://client/src/app/mood/page.tsx#L1-L245)
- [client/src/app/counsellor/alerts/[id]/page.tsx](file://client/src/app/counsellor/alerts/[id]/page.tsx#L1-L246)
- [server/src/routes/dashboard.routes.ts:1-11](file://server/src/routes/dashboard.routes.ts#L1-L11)
- [server/src/controllers/dashboard.controller.ts:1-13](file://server/src/controllers/dashboard.controller.ts#L1-L13)
- [server/src/services/dashboard.service.ts:1-19](file://server/src/services/dashboard.service.ts#L1-L19)
- [server/src/controllers/assessment.controller.ts:1-74](file://server/src/controllers/assessment.controller.ts#L1-L74)
- [server/src/services/assessment.service.ts:1-89](file://server/src/services/assessment.service.ts#L1-L89)
- [server/src/controllers/mood.controller.ts:1-67](file://server/src/controllers/mood.controller.ts#L1-L67)
- [server/src/services/mood.service.ts:1-58](file://server/src/services/mood.service.ts#L1-L58)
- [server/src/services/alert.service.ts:1-62](file://server/src/services/alert.service.ts#L1-L62)
- [server/src/services/risk.service.ts:1-138](file://server/src/services/risk.service.ts#L1-L138)
- [prisma/schema.prisma:1-134](file://prisma/schema.prisma#L1-L134)

**Section sources**
- [client/src/app/dashboard/page.tsx:1-206](file://client/src/app/dashboard/page.tsx#L1-L206)
- [client/src/app/counsellor/dashboard/page.tsx:1-213](file://client/src/app/counsellor/dashboard/page.tsx#L1-L213)
- [client/src/app/assessment/page.tsx:1-192](file://client/src/app/assessment/page.tsx#L1-L192)
- [client/src/app/mood/page.tsx:1-245](file://client/src/app/mood/page.tsx#L1-L245)
- [client/src/app/counsellor/alerts/[id]/page.tsx](file://client/src/app/counsellor/alerts/[id]/page.tsx#L1-L246)
- [server/src/routes/dashboard.routes.ts:1-11](file://server/src/routes/dashboard.routes.ts#L1-L11)
- [server/src/controllers/dashboard.controller.ts:1-13](file://server/src/controllers/dashboard.controller.ts#L1-L13)
- [server/src/services/dashboard.service.ts:1-19](file://server/src/services/dashboard.service.ts#L1-L19)
- [server/src/controllers/assessment.controller.ts:1-74](file://server/src/controllers/assessment.controller.ts#L1-L74)
- [server/src/services/assessment.service.ts:1-89](file://server/src/services/assessment.service.ts#L1-L89)
- [server/src/controllers/mood.controller.ts:1-67](file://server/src/controllers/mood.controller.ts#L1-L67)
- [server/src/services/mood.service.ts:1-58](file://server/src/services/mood.service.ts#L1-L58)
- [server/src/services/alert.service.ts:1-62](file://server/src/services/alert.service.ts#L1-L62)
- [server/src/services/risk.service.ts:1-138](file://server/src/services/risk.service.ts#L1-L138)
- [prisma/schema.prisma:1-134](file://prisma/schema.prisma#L1-L134)

## Core Components
- Student Dashboard
  - Displays latest mood, PHQ-9 severity, and risk level
  - Provides quick actions to chat, take assessment, and log mood
  - Shows recent mood entries with emoji ratings and dates
- Counselor Dashboard
  - Shows counts for total alerts, pending, reviewed, resolved
  - Filters alerts by status and risk level
  - Links to alert detail pages for student summaries and recommendations
- Assessment System
  - PHQ-9 form with severity classification and recommendation generation for moderate/severe cases
  - Assessment history retrieval per user
- Mood Tracking
  - Mood entry recording with validation
  - Trend calculation over 7-day vs 30-day windows with direction indicator
- Risk and Alert Management
  - Risk evaluation combining PHQ-9, sentiment ratios, and mood trends
  - Automatic alert creation for HIGH/SEVERE risks linked to assessments
  - Alert status updates and student summary aggregation
- Administrative Monitoring
  - Dashboard statistics endpoint for counselors
  - Counts and distribution of alerts and students

**Section sources**
- [client/src/app/dashboard/page.tsx:29-205](file://client/src/app/dashboard/page.tsx#L29-L205)
- [client/src/app/counsellor/dashboard/page.tsx:28-212](file://client/src/app/counsellor/dashboard/page.tsx#L28-L212)
- [server/src/controllers/assessment.controller.ts:5-74](file://server/src/controllers/assessment.controller.ts#L5-L74)
- [server/src/services/assessment.service.ts:20-89](file://server/src/services/assessment.service.ts#L20-L89)
- [server/src/controllers/mood.controller.ts:5-67](file://server/src/controllers/mood.controller.ts#L5-L67)
- [server/src/services/mood.service.ts:22-58](file://server/src/services/mood.service.ts#L22-L58)
- [server/src/services/risk.service.ts:11-138](file://server/src/services/risk.service.ts#L11-L138)
- [server/src/services/alert.service.ts:3-62](file://server/src/services/alert.service.ts#L3-L62)
- [server/src/controllers/dashboard.controller.ts:5-12](file://server/src/controllers/dashboard.controller.ts#L5-L12)
- [server/src/services/dashboard.service.ts:3-18](file://server/src/services/dashboard.service.ts#L3-L18)

## Architecture Overview
The frontend communicates with backend routes via authenticated requests. Controllers delegate to services, which query Prisma models. Risk evaluation and alert creation integrate assessment, message sentiment, and mood data.

```mermaid
sequenceDiagram
participant U as "User"
participant FE as "Frontend Pages"
participant BE as "Express Server"
participant SVC as "Services"
participant DB as "Prisma/PostgreSQL"
U->>FE : Navigate to Student Dashboard
FE->>BE : GET /api/mood, /api/risk/latest, /api/assessments/phq9
BE->>SVC : fetch mood history, latest risk, latest PHQ-9
SVC->>DB : queries (mood, risk, assessment)
DB-->>SVC : records
SVC-->>BE : aggregated data
BE-->>FE : JSON response
FE-->>U : render dashboard widgets
U->>FE : Navigate to Assessment
FE->>BE : POST /api/assessments/phq9
BE->>SVC : submitAssessment(responses)
SVC->>DB : insert assessment
SVC->>DB : conditionally insert recommendation/alert
DB-->>SVC : inserted records
SVC-->>BE : assessment + severity
BE-->>FE : JSON response
FE-->>U : show results and recommendations
```

**Diagram sources**
- [client/src/app/dashboard/page.tsx:51-69](file://client/src/app/dashboard/page.tsx#L51-L69)
- [client/src/app/assessment/page.tsx:63-73](file://client/src/app/assessment/page.tsx#L63-L73)
- [server/src/controllers/assessment.controller.ts:5-34](file://server/src/controllers/assessment.controller.ts#L5-L34)
- [server/src/services/assessment.service.ts:20-33](file://server/src/services/assessment.service.ts#L20-L33)
- [server/src/services/risk.service.ts:87-104](file://server/src/services/risk.service.ts#L87-L104)
- [prisma/schema.prisma:97-108](file://prisma/schema.prisma#L97-L108)

## Detailed Component Analysis

### Student Dashboard
- Fetches three datasets concurrently: recent mood entries, latest risk evaluation, and latest PHQ-9 assessment
- Renders quick stats cards for latest mood, PHQ-9 severity, and risk level
- Provides quick action links to chat, assessment, and mood logging
- Displays recent mood entries with emoji, rating, optional notes, and date

```mermaid
flowchart TD
Start(["Load Student Dashboard"]) --> CheckAuth["Check authentication"]
CheckAuth --> IsCounselor{"Is user role COUNSELLOR?"}
IsCounselor --> |Yes| RedirectCouns["Redirect to Counselor Dashboard"]
IsCounselor --> |No| FetchData["Fetch mood, risk, assessment"]
FetchData --> Render["Render stats and recent mood list"]
Render --> End(["Ready"])
```

**Diagram sources**
- [client/src/app/dashboard/page.tsx:37-69](file://client/src/app/dashboard/page.tsx#L37-L69)

**Section sources**
- [client/src/app/dashboard/page.tsx:29-205](file://client/src/app/dashboard/page.tsx#L29-L205)

### Counselor Dashboard
- Requires counselor role and authenticates via middleware
- Loads dashboard stats and paginates/queries alerts with filters for status and risk level
- Presents alert list with student info, risk badge, status badge, and date
- Supports filtering and automatic refetch on filter change

```mermaid
sequenceDiagram
participant U as "Counselor"
participant FE as "Counselor Dashboard"
participant BE as "GET /api/dashboard/stats"
participant SVC as "getDashboardStats"
participant DB as "Prisma"
U->>FE : Open dashboard
FE->>BE : GET /api/dashboard/stats
BE->>SVC : getDashboardStats()
SVC->>DB : count alerts/status/risk, count students
DB-->>SVC : aggregates
SVC-->>BE : {alerts, totalStudents, riskDistribution}
BE-->>FE : JSON stats
FE-->>U : render stats grid
```

**Diagram sources**
- [client/src/app/counsellor/dashboard/page.tsx:49-63](file://client/src/app/counsellor/dashboard/page.tsx#L49-L63)
- [server/src/routes/dashboard.routes.ts:7-8](file://server/src/routes/dashboard.routes.ts#L7-L8)
- [server/src/controllers/dashboard.controller.ts:5-12](file://server/src/controllers/dashboard.controller.ts#L5-L12)
- [server/src/services/dashboard.service.ts:3-18](file://server/src/services/dashboard.service.ts#L3-L18)

**Section sources**
- [client/src/app/counsellor/dashboard/page.tsx:28-212](file://client/src/app/counsellor/dashboard/page.tsx#L28-L212)
- [server/src/routes/dashboard.routes.ts:1-11](file://server/src/routes/dashboard.routes.ts#L1-L11)
- [server/src/controllers/dashboard.controller.ts:1-13](file://server/src/controllers/dashboard.controller.ts#L1-L13)
- [server/src/services/dashboard.service.ts:1-19](file://server/src/services/dashboard.service.ts#L1-L19)

### Assessment System
- Submission validates responses length and value range, computes total score, and classifies severity
- Generates recommendations for moderate/severe cases and creates risk alerts when appropriate
- History retrieval returns ordered assessments by completion time

```mermaid
flowchart TD
Submit(["Submit PHQ-9"]) --> Validate["Validate responses (9 items, 0–3)"]
Validate --> Compute["Compute total score and severity"]
Compute --> SaveAssess["Persist assessment"]
SaveAssess --> SeverityCheck{"Severity >= MODERATE?"}
SeverityCheck --> |Yes| GenRec["Generate recommendation"]
SeverityCheck --> |No| SkipRec["Skip recommendation"]
GenRec --> MaybeAlert{"Risk level HIGH/SEVERE?"}
MaybeAlert --> |Yes| CreateAlert["Create risk alert"]
MaybeAlert --> |No| Done
SkipRec --> Done(["Return assessment"])
CreateAlert --> Done
```

**Diagram sources**
- [server/src/controllers/assessment.controller.ts:5-34](file://server/src/controllers/assessment.controller.ts#L5-L34)
- [server/src/services/assessment.service.ts:20-89](file://server/src/services/assessment.service.ts#L20-L89)
- [server/src/services/risk.service.ts:87-104](file://server/src/services/risk.service.ts#L87-L104)

**Section sources**
- [client/src/app/assessment/page.tsx:33-191](file://client/src/app/assessment/page.tsx#L33-L191)
- [server/src/controllers/assessment.controller.ts:1-74](file://server/src/controllers/assessment.controller.ts#L1-L74)
- [server/src/services/assessment.service.ts:1-89](file://server/src/services/assessment.service.ts#L1-L89)
- [server/src/services/risk.service.ts:1-138](file://server/src/services/risk.service.ts#L1-L138)

### Mood Tracking
- Records mood entries with validation (1–5) and optional notes
- Calculates trends over 7-day vs 30-day windows and determines direction (improving/stable/declining)
- Retrieves history with optional date range filters

```mermaid
flowchart TD
Record(["Record Mood"]) --> Validate["Validate moodRating ∈ [1,5]"]
Validate --> Persist["Persist mood entry"]
Persist --> FetchTrends["Fetch trends"]
FetchTrends --> Avg7["Compute 7-day average"]
FetchTrends --> Avg30["Compute 30-day average"]
Avg7 --> Compare{"Compare averages"}
Avg30 --> Compare
Compare --> Improving["Direction: improving"]
Compare --> Declining["Direction: declining"]
Compare --> Stable["Direction: stable"]
Improving --> ReturnTrend["Return trend summary"]
Declining --> ReturnTrend
Stable --> ReturnTrend
```

**Diagram sources**
- [server/src/controllers/mood.controller.ts:5-34](file://server/src/controllers/mood.controller.ts#L5-L34)
- [server/src/services/mood.service.ts:22-58](file://server/src/services/mood.service.ts#L22-L58)

**Section sources**
- [client/src/app/mood/page.tsx:29-245](file://client/src/app/mood/page.tsx#L29-L245)
- [server/src/controllers/mood.controller.ts:1-67](file://server/src/controllers/mood.controller.ts#L1-L67)
- [server/src/services/mood.service.ts:1-58](file://server/src/services/mood.service.ts#L1-L58)

### Risk and Alert Management
- Risk evaluation combines PHQ-9 score, recent negative sentiment ratio, and mood trend direction
- Creates recommendations and risk alerts for HIGH/SEVERE thresholds
- Counselor alert detail page aggregates student summary: mood average, sentiment breakdown, latest assessment, and recommendations
- Alert status transitions supported (PENDING → REVIEWED → RESOLVED)

```mermaid
sequenceDiagram
participant U as "User"
participant SVC_Risk as "risk.service.evaluateRisk"
participant DB as "Prisma"
participant SVC_Alert as "alert.service.getStudentSummary"
U->>SVC_Risk : evaluateRisk(userId)
SVC_Risk->>DB : latest assessment, recent messages, recent/older moods
DB-->>SVC_Risk : records
SVC_Risk->>DB : insert recommendation
SVC_Risk->>DB : maybe insert risk alert
U->>SVC_Alert : getStudentSummary(userId)
SVC_Alert->>DB : user, latest assessment, recent moods, recent messages, recommendations
DB-->>SVC_Alert : records
SVC_Alert-->>U : summary payload
```

**Diagram sources**
- [server/src/services/risk.service.ts:11-107](file://server/src/services/risk.service.ts#L11-L107)
- [server/src/services/alert.service.ts:35-62](file://server/src/services/alert.service.ts#L35-L62)
- [client/src/app/counsellor/alerts/[id]/page.tsx](file://client/src/app/counsellor/alerts/[id]/page.tsx#L57-L85)

**Section sources**
- [server/src/services/risk.service.ts:1-138](file://server/src/services/risk.service.ts#L1-L138)
- [server/src/services/alert.service.ts:1-62](file://server/src/services/alert.service.ts#L1-L62)
- [client/src/app/counsellor/alerts/[id]/page.tsx](file://client/src/app/counsellor/alerts/[id]/page.tsx#L34-L246)

### Administrative Monitoring
- Dashboard stats endpoint returns alert counts by status, total student count, and risk distribution
- Access controlled to counselors via middleware

```mermaid
classDiagram
class DashboardController {
+getStats(req,res,next) void
}
class DashboardService {
+getDashboardStats() Promise~Object~
}
class PrismaClient {
+riskAlert.count()
+riskAlert.groupBy()
+user.count()
}
DashboardController --> DashboardService : "calls"
DashboardService --> PrismaClient : "queries"
```

**Diagram sources**
- [server/src/controllers/dashboard.controller.ts:5-12](file://server/src/controllers/dashboard.controller.ts#L5-L12)
- [server/src/services/dashboard.service.ts:3-18](file://server/src/services/dashboard.service.ts#L3-L18)
- [prisma/schema.prisma:121-133](file://prisma/schema.prisma#L121-L133)

**Section sources**
- [server/src/routes/dashboard.routes.ts:1-11](file://server/src/routes/dashboard.routes.ts#L1-L11)
- [server/src/controllers/dashboard.controller.ts:1-13](file://server/src/controllers/dashboard.controller.ts#L1-L13)
- [server/src/services/dashboard.service.ts:1-19](file://server/src/services/dashboard.service.ts#L1-L19)

## Dependency Analysis
- Controllers depend on services for business logic
- Services depend on Prisma for data access
- Frontend pages depend on API endpoints exposed by routes/controllers
- Risk evaluation depends on assessment, message sentiment, and mood data
- Alert detail depends on alert and student summary services

```mermaid
graph LR
FE_Dash["Student Dashboard"] --> API_Mood["/api/mood"]
FE_Dash --> API_Risk["/api/risk/latest"]
FE_Dash --> API_Assess["/api/assessments/phq9"]
FE_CounsDash["Counselor Dashboard"] --> API_DashStats["/api/dashboard/stats"]
FE_AlertDetail["Alert Detail"] --> API_Alert["/api/alerts/:id"]
FE_AlertDetail --> API_Student["/api/alerts/:id/student"]
API_Mood --> Ctrl_Mood["mood.controller"]
API_Risk --> Ctrl_Risk["risk.controller"]
API_Assess --> Ctrl_Assess["assessment.controller"]
API_DashStats --> Ctrl_Dash["dashboard.controller"]
API_Alert --> Ctrl_Alert["alert.controller"]
API_Student --> Svc_Alert["alert.service"]
Ctrl_Mood --> Svc_Mood["mood.service"]
Ctrl_Assess --> Svc_Assess["assessment.service"]
Ctrl_Dash --> Svc_Dash["dashboard.service"]
Svc_Mood --> Prisma["prisma/schema.prisma"]
Svc_Assess --> Prisma
Svc_Dash --> Prisma
Svc_Alert --> Prisma
```

**Diagram sources**
- [client/src/app/dashboard/page.tsx:51-69](file://client/src/app/dashboard/page.tsx#L51-L69)
- [client/src/app/counsellor/dashboard/page.tsx:49-63](file://client/src/app/counsellor/dashboard/page.tsx#L49-L63)
- [client/src/app/counsellor/alerts/[id]/page.tsx](file://client/src/app/counsellor/alerts/[id]/page.tsx#L57-L70)
- [server/src/controllers/mood.controller.ts:1-67](file://server/src/controllers/mood.controller.ts#L1-L67)
- [server/src/controllers/assessment.controller.ts:1-74](file://server/src/controllers/assessment.controller.ts#L1-L74)
- [server/src/controllers/dashboard.controller.ts:1-13](file://server/src/controllers/dashboard.controller.ts#L1-L13)
- [server/src/services/alert.service.ts:1-62](file://server/src/services/alert.service.ts#L1-L62)
- [prisma/schema.prisma:1-134](file://prisma/schema.prisma#L1-L134)

**Section sources**
- [client/src/app/dashboard/page.tsx:1-206](file://client/src/app/dashboard/page.tsx#L1-L206)
- [client/src/app/counsellor/dashboard/page.tsx:1-213](file://client/src/app/counsellor/dashboard/page.tsx#L1-L213)
- [client/src/app/counsellor/alerts/[id]/page.tsx](file://client/src/app/counsellor/alerts/[id]/page.tsx#L1-L246)
- [server/src/controllers/mood.controller.ts:1-67](file://server/src/controllers/mood.controller.ts#L1-L67)
- [server/src/controllers/assessment.controller.ts:1-74](file://server/src/controllers/assessment.controller.ts#L1-L74)
- [server/src/controllers/dashboard.controller.ts:1-13](file://server/src/controllers/dashboard.controller.ts#L1-L13)
- [server/src/services/alert.service.ts:1-62](file://server/src/services/alert.service.ts#L1-L62)
- [prisma/schema.prisma:1-134](file://prisma/schema.prisma#L1-L134)

## Performance Considerations
- Concurrent API fetching on dashboards reduces perceived latency
- Trend calculations use bounded recent windows (7 and 30 days) to keep computations lightweight
- Dashboard stats use grouped counts and single queries to minimize round trips
- Filtering on alerts uses URL query parameters to avoid unnecessary data transfer
- Recommendation and alert creation occur only for moderate/severe cases to limit write volume

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- Authentication failures redirect to login; ensure tokens are present and valid
- Validation errors for assessments and mood entries return explicit messages; confirm input ranges and completeness
- Counselor-only routes block unauthorized access; verify role claims
- Network errors during concurrent fetches are handled gracefully; retry after connectivity is restored
- If alerts do not appear, verify filters and statuses; use “All Statuses” and “All Levels” temporarily to isolate issues

**Section sources**
- [client/src/app/dashboard/page.tsx:37-49](file://client/src/app/dashboard/page.tsx#L37-L49)
- [client/src/app/counsellor/dashboard/page.tsx:36-47](file://client/src/app/counsellor/dashboard/page.tsx#L36-L47)
- [server/src/controllers/assessment.controller.ts:14-21](file://server/src/controllers/assessment.controller.ts#L14-L21)
- [server/src/controllers/mood.controller.ts:14-27](file://server/src/controllers/mood.controller.ts#L14-L27)

## Conclusion
The dashboard and analytics system integrates student self-reporting (assessments and mood), counselor oversight (alerts and summaries), and administrative monitoring (counts and distributions). Robust data aggregation and risk evaluation enable timely interventions while maintaining performance and usability.

[No sources needed since this section summarizes without analyzing specific files]

## Appendices

### Data Models Overview
```mermaid
erDiagram
USER {
int id PK
string fullName
string email UK
string role
datetime createdAt
}
PHQ9_ASSESSMENT {
int id PK
int userId FK
json responses
int totalScore
enum severityLevel
datetime completedAt
}
MOOD_ENTRY {
int id PK
int userId FK
int moodRating
string notes
datetime createdAt
}
RISK_ALERT {
int id PK
int userId FK
int assessmentId FK
enum riskLevel
enum status
datetime createdAt
}
RECOMMENDATION {
int id PK
int userId FK
string recommendationText
enum riskLevel
datetime generatedAt
}
MESSAGE {
int id PK
int conversationId FK
string messageText
enum sender
enum sentiment
float sentimentScore
datetime createdAt
}
CONVERSATION {
int id PK
int userId FK
datetime startedAt
}
USER ||--o{ MOOD_ENTRY : "records"
USER ||--o{ PHQ9_ASSESSMENT : "completes"
USER ||--o{ RISK_ALERT : "generates"
USER ||--o{ RECOMMENDATION : "receives"
USER ||--o{ CONVERSATION : "hosts"
CONVERSATION ||--o{ MESSAGE : "contains"
PHQ9_ASSESSMENT ||--o{ RISK_ALERT : "triggers"
```

**Diagram sources**
- [prisma/schema.prisma:47-133](file://prisma/schema.prisma#L47-L133)

### Practical Examples
- Student navigation
  - From the student dashboard, click “Take Assessment” to complete PHQ-9; upon submission, view severity classification and recommendations if applicable
  - From the student dashboard, click “Log Mood” to record daily mood; revisit the Mood Tracker to review history and trends
- Counselor navigation
  - From the counselor dashboard, apply filters for status and risk level to narrow alerts; click an alert to view student summary and recommendations
  - Update alert status using the “Mark as…” buttons; navigate back to the dashboard to refresh counts
- Decision support
  - Use PHQ-9 severity and risk level to guide intervention prioritization
  - Review mood trends and sentiment breakdown to assess changes over time
  - Reference generated recommendations for tailored guidance

[No sources needed since this section provides general guidance]

### Privacy and Access Controls
- Role-based routing ensures counselors access counselor dashboards and alerts; students are redirected appropriately
- All endpoints require authentication; controllers validate presence of user context
- Data exposure limited to authenticated users’ own assessments and moods; counselor views include anonymized identifiers where necessary

**Section sources**
- [client/src/app/dashboard/page.tsx:37-48](file://client/src/app/dashboard/page.tsx#L37-L48)
- [client/src/app/counsellor/dashboard/page.tsx:36-46](file://client/src/app/counsellor/dashboard/page.tsx#L36-L46)
- [server/src/controllers/assessment.controller.ts:7-10](file://server/src/controllers/assessment.controller.ts#L7-L10)
- [server/src/controllers/mood.controller.ts:7-10](file://server/src/controllers/mood.controller.ts#L7-L10)

### Integration with Clinical Quality Measures
- PHQ-9 scoring aligns with standard severity categories enabling outcome tracking
- Risk evaluation criteria incorporate symptom severity, sentiment trends, and mood stability to support quality metrics
- Alert creation and resolution tracking supports intervention effectiveness measurement

[No sources needed since this section provides general guidance]