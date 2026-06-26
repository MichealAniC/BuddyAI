# Key Features

<cite>
**Referenced Files in This Document**
- [client/src/app/chat/page.tsx](file://client/src/app/chat/page.tsx)
- [client/src/app/assessment/page.tsx](file://client/src/app/assessment/page.tsx)
- [client/src/app/mood/page.tsx](file://client/src/app/mood/page.tsx)
- [client/src/app/dashboard/page.tsx](file://client/src/app/dashboard/page.tsx)
- [client/src/app/counsellor/dashboard/page.tsx](file://client/src/app/counsellor/dashboard/page.tsx)
- [server/src/controllers/chat.controller.ts](file://server/src/controllers/chat.controller.ts)
- [server/src/controllers/assessment.controller.ts](file://server/src/controllers/assessment.controller.ts)
- [server/src/controllers/mood.controller.ts](file://server/src/controllers/mood.controller.ts)
- [server/src/controllers/alert.controller.ts](file://server/src/controllers/alert.controller.ts)
- [server/src/controllers/dashboard.controller.ts](file://server/src/controllers/dashboard.controller.ts)
- [server/src/services/risk.service.ts](file://server/src/services/risk.service.ts)
- [server/src/services/alert.service.ts](file://server/src/services/alert.service.ts)
- [server/src/services/assessment.service.ts](file://server/src/services/assessment.service.ts)
- [nlp-service/nlp/analyzer.py](file://nlp-service/nlp/analyzer.py)
- [nlp-service/nlp/processor.py](file://nlp-service/nlp/processor.py)
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

## Introduction
This document details the key features of BuddyAI, focusing on the platform’s core functionality modules. It explains how the AI chat assistant performs conversational support with integrated VADER sentiment analysis, how the PHQ-9 depression assessment administers, scores, classifies risk, and interprets results, how the mood tracking system logs daily entries, analyzes trends, and maintains historical records, and how the personalized recommendation engine synthesizes insights from assessments and mood patterns. It also covers the counselor dashboard for risk alert management and student monitoring, and the administrative dashboard for system oversight. Practical workflows and user interaction patterns are included to illustrate each feature.

## Project Structure
BuddyAI is organized into three primary layers:
- Frontend (Next.js app) under client/src/app, implementing user-facing pages for chat, assessment, mood tracking, dashboards, and navigation.
- Backend (Express server) under server/src, exposing REST endpoints via controllers and orchestrating domain logic in services.
- NLP service (Python) under nlp-service, providing VADER-based sentiment analysis and text preprocessing.

```mermaid
graph TB
subgraph "Client (Next.js)"
C_Dashboard["Dashboard Page"]
C_Chat["Chat Page"]
C_Assessment["Assessment Page"]
C_Mood["Mood Page"]
C_CDash["Counsellor Dashboard"]
end
subgraph "Server (Express)"
S_Routes["Routes"]
S_ChatCtl["Chat Controller"]
S_AssessCtl["Assessment Controller"]
S_MoodCtl["Mood Controller"]
S_AlertCtl["Alert Controller"]
S_DashCtl["Dashboard Controller"]
S_Services["Services Layer"]
S_DB["Prisma ORM"]
end
subgraph "NLP Service (Python)"
NLP_Processor["Text Processor"]
NLP_Analyzer["VADER Analyzer"]
end
C_Dashboard --> S_Routes
C_Chat --> S_Routes
C_Assessment --> S_Routes
C_Mood --> S_Routes
C_CDash --> S_Routes
S_Routes --> S_ChatCtl
S_Routes --> S_AssessCtl
S_Routes --> S_MoodCtl
S_Routes --> S_AlertCtl
S_Routes --> S_DashCtl
S_ChatCtl --> S_Services
S_AssessCtl --> S_Services
S_MoodCtl --> S_Services
S_AlertCtl --> S_Services
S_DashCtl --> S_Services
S_Services --> S_DB
S_Services --> NLP_Processor
S_Services --> NLP_Analyzer
```

**Diagram sources**
- [client/src/app/dashboard/page.tsx:1-206](file://client/src/app/dashboard/page.tsx#L1-L206)
- [client/src/app/chat/page.tsx:1-196](file://client/src/app/chat/page.tsx#L1-L196)
- [client/src/app/assessment/page.tsx:1-192](file://client/src/app/assessment/page.tsx#L1-L192)
- [client/src/app/mood/page.tsx:1-245](file://client/src/app/mood/page.tsx#L1-L245)
- [client/src/app/counsellor/dashboard/page.tsx:1-213](file://client/src/app/counsellor/dashboard/page.tsx#L1-L213)
- [server/src/controllers/chat.controller.ts:1-69](file://server/src/controllers/chat.controller.ts#L1-L69)
- [server/src/controllers/assessment.controller.ts:1-74](file://server/src/controllers/assessment.controller.ts#L1-L74)
- [server/src/controllers/mood.controller.ts:1-67](file://server/src/controllers/mood.controller.ts#L1-L67)
- [server/src/controllers/alert.controller.ts:1-70](file://server/src/controllers/alert.controller.ts#L1-L70)
- [server/src/controllers/dashboard.controller.ts:1-13](file://server/src/controllers/dashboard.controller.ts#L1-L13)
- [nlp-service/nlp/processor.py:1-19](file://nlp-service/nlp/processor.py#L1-L19)
- [nlp-service/nlp/analyzer.py:1-27](file://nlp-service/nlp/analyzer.py#L1-L27)

**Section sources**
- [client/src/app/dashboard/page.tsx:1-206](file://client/src/app/dashboard/page.tsx#L1-L206)
- [client/src/app/chat/page.tsx:1-196](file://client/src/app/chat/page.tsx#L1-L196)
- [client/src/app/assessment/page.tsx:1-192](file://client/src/app/assessment/page.tsx#L1-L192)
- [client/src/app/mood/page.tsx:1-245](file://client/src/app/mood/page.tsx#L1-L245)
- [client/src/app/counsellor/dashboard/page.tsx:1-213](file://client/src/app/counsellor/dashboard/page.tsx#L1-L213)
- [server/src/controllers/chat.controller.ts:1-69](file://server/src/controllers/chat.controller.ts#L1-L69)
- [server/src/controllers/assessment.controller.ts:1-74](file://server/src/controllers/assessment.controller.ts#L1-L74)
- [server/src/controllers/mood.controller.ts:1-67](file://server/src/controllers/mood.controller.ts#L1-L67)
- [server/src/controllers/alert.controller.ts:1-70](file://server/src/controllers/alert.controller.ts#L1-L70)
- [server/src/controllers/dashboard.controller.ts:1-13](file://server/src/controllers/dashboard.controller.ts#L1-L13)
- [nlp-service/nlp/processor.py:1-19](file://nlp-service/nlp/processor.py#L1-L19)
- [nlp-service/nlp/analyzer.py:1-27](file://nlp-service/nlp/analyzer.py#L1-L27)

## Core Components
- AI Chat Assistant with VADER sentiment integration
- PHQ-9 Depression Assessment with scoring and risk classification
- Mood Tracking with daily logging, trend analysis, and history
- Personalized Recommendation Engine
- Counselor Dashboard for risk alert management and monitoring
- Administrative Dashboard for system oversight

**Section sources**
- [client/src/app/chat/page.tsx:1-196](file://client/src/app/chat/page.tsx#L1-L196)
- [client/src/app/assessment/page.tsx:1-192](file://client/src/app/assessment/page.tsx#L1-L192)
- [client/src/app/mood/page.tsx:1-245](file://client/src/app/mood/page.tsx#L1-L245)
- [client/src/app/counsellor/dashboard/page.tsx:1-213](file://client/src/app/counsellor/dashboard/page.tsx#L1-L213)
- [server/src/services/risk.service.ts:1-138](file://server/src/services/risk.service.ts#L1-L138)
- [server/src/services/assessment.service.ts:1-89](file://server/src/services/assessment.service.ts#L1-L89)
- [server/src/services/alert.service.ts:1-62](file://server/src/services/alert.service.ts#L1-L62)
- [nlp-service/nlp/analyzer.py:1-27](file://nlp-service/nlp/analyzer.py#L1-L27)
- [nlp-service/nlp/processor.py:1-19](file://nlp-service/nlp/processor.py#L1-L19)

## Architecture Overview
The system follows a layered architecture:
- Client-side pages orchestrate user interactions and fetch data from backend endpoints.
- Controllers validate requests, enforce authentication, and delegate to services.
- Services encapsulate business logic, including risk evaluation, assessment scoring, and recommendation generation.
- Prisma handles database persistence and queries.
- The NLP service provides sentiment analysis and text preprocessing.

```mermaid
graph TB
UI_Chat["Chat UI"]
UI_Assess["Assessment UI"]
UI_Mood["Mood UI"]
UI_Dash["Student Dashboard"]
UI_CDash["Counsellor Dashboard"]
API_Chat["Chat Controller"]
API_Assess["Assessment Controller"]
API_Mood["Mood Controller"]
API_Alert["Alert Controller"]
API_Dash["Dashboard Controller"]
SVC_Risk["Risk Service"]
SVC_Assess["Assessment Service"]
SVC_Alert["Alert Service"]
NLP_Proc["Text Processor"]
NLP_VADER["VADER Analyzer"]
DB["Prisma ORM"]
UI_Chat --> API_Chat
UI_Assess --> API_Assess
UI_Mood --> API_Mood
UI_Dash --> API_Dash
UI_CDash --> API_Alert
API_Chat --> SVC_Risk
API_Assess --> SVC_Assess
API_Mood --> SVC_Risk
API_Alert --> SVC_Alert
SVC_Risk --> DB
SVC_Assess --> DB
SVC_Alert --> DB
SVC_Risk --> NLP_Proc
NLP_Proc --> NLP_VADER
NLP_VADER --> SVC_Risk
```

**Diagram sources**
- [client/src/app/chat/page.tsx:1-196](file://client/src/app/chat/page.tsx#L1-L196)
- [client/src/app/assessment/page.tsx:1-192](file://client/src/app/assessment/page.tsx#L1-L192)
- [client/src/app/mood/page.tsx:1-245](file://client/src/app/mood/page.tsx#L1-L245)
- [client/src/app/dashboard/page.tsx:1-206](file://client/src/app/dashboard/page.tsx#L1-L206)
- [client/src/app/counsellor/dashboard/page.tsx:1-213](file://client/src/app/counsellor/dashboard/page.tsx#L1-L213)
- [server/src/controllers/chat.controller.ts:1-69](file://server/src/controllers/chat.controller.ts#L1-L69)
- [server/src/controllers/assessment.controller.ts:1-74](file://server/src/controllers/assessment.controller.ts#L1-L74)
- [server/src/controllers/mood.controller.ts:1-67](file://server/src/controllers/mood.controller.ts#L1-L67)
- [server/src/controllers/alert.controller.ts:1-70](file://server/src/controllers/alert.controller.ts#L1-L70)
- [server/src/controllers/dashboard.controller.ts:1-13](file://server/src/controllers/dashboard.controller.ts#L1-L13)
- [server/src/services/risk.service.ts:1-138](file://server/src/services/risk.service.ts#L1-L138)
- [server/src/services/assessment.service.ts:1-89](file://server/src/services/assessment.service.ts#L1-L89)
- [server/src/services/alert.service.ts:1-62](file://server/src/services/alert.service.ts#L1-L62)
- [nlp-service/nlp/processor.py:1-19](file://nlp-service/nlp/processor.py#L1-L19)
- [nlp-service/nlp/analyzer.py:1-27](file://nlp-service/nlp/analyzer.py#L1-L27)

## Detailed Component Analysis

### AI Chat Assistant with VADER Sentiment Analysis
The chat module enables students to converse with BuddyAI, persisting conversations and messages, and displaying sentiment indicators derived from VADER sentiment analysis. The frontend posts messages, creates conversations when needed, and renders user and bot messages with sentiment badges.

```mermaid
sequenceDiagram
participant U as "User"
participant UI as "Chat UI"
participant API as "Chat Controller"
participant SVC as "Risk Service"
participant NLP_P as "Text Processor"
participant NLP_A as "VADER Analyzer"
U->>UI : "Type message and click Send"
UI->>API : "POST /api/conversations/{id}/messages"
API->>SVC : "sendMessage(conversationId, userId, messageText)"
SVC->>NLP_P : "preprocess(messageText)"
NLP_P-->>SVC : "cleaned text"
SVC->>NLP_A : "analyze(cleaned text)"
NLP_A-->>SVC : "{sentiment, scores}"
SVC-->>API : "result with sentiment and bot reply"
API-->>UI : "201 JSON with userMessage and botMessage"
UI-->>U : "Render message with sentiment badge"
```

**Diagram sources**
- [client/src/app/chat/page.tsx:55-107](file://client/src/app/chat/page.tsx#L55-L107)
- [server/src/controllers/chat.controller.ts:33-53](file://server/src/controllers/chat.controller.ts#L33-L53)
- [server/src/services/risk.service.ts:11-107](file://server/src/services/risk.service.ts#L11-L107)
- [nlp-service/nlp/processor.py:10-19](file://nlp-service/nlp/processor.py#L10-L19)
- [nlp-service/nlp/analyzer.py:8-27](file://nlp-service/nlp/analyzer.py#L8-L27)

Key behaviors:
- Conversation lifecycle: create a conversation if none exists; otherwise reuse the latest.
- Message submission validates presence of message text.
- Sentiment classification uses VADER compound score thresholds to label POSITIVE, NEGATIVE, or NEUTRAL.
- UI displays sentiment badges for user messages and a “typing” indicator for bot replies.

Practical workflow example:
- User opens chat, sends a message, receives an auto-generated bot response, and sees a sentiment label reflecting the detected emotional tone.

**Section sources**
- [client/src/app/chat/page.tsx:17-121](file://client/src/app/chat/page.tsx#L17-L121)
- [server/src/controllers/chat.controller.ts:33-53](file://server/src/controllers/chat.controller.ts#L33-L53)
- [server/src/services/risk.service.ts:11-107](file://server/src/services/risk.service.ts#L11-L107)
- [nlp-service/nlp/analyzer.py:8-27](file://nlp-service/nlp/analyzer.py#L8-L27)
- [nlp-service/nlp/processor.py:10-19](file://nlp-service/nlp/processor.py#L10-L19)

### PHQ-9 Depression Assessment
The assessment module presents nine standardized questions, collects ordinal responses, computes a total score, classifies severity, and optionally triggers recommendations and risk alerts. The frontend enforces completion of all questions before submission.

```mermaid
flowchart TD
Start(["Open Assessment"]) --> LoadQuestions["Load PHQ-9 Questions"]
LoadQuestions --> Answer["Select answers for all 9 questions"]
Answer --> Validate{"All questions answered?"}
Validate --> |No| ShowError["Show error and prevent submission"]
Validate --> |Yes| Submit["POST responses to /api/assessments/phq9"]
Submit --> Compute["Compute total score and severity"]
Compute --> Store["Persist assessment record"]
Store --> ModerateOrAbove{"Severity >= MODERATE?"}
ModerateOrAbove --> |Yes| Recommend["Generate recommendation"]
ModerateOrAbove --> |No| Done["Return results"]
Recommend --> Done
```

**Diagram sources**
- [client/src/app/assessment/page.tsx:52-73](file://client/src/app/assessment/page.tsx#L52-L73)
- [server/src/controllers/assessment.controller.ts:5-34](file://server/src/controllers/assessment.controller.ts#L5-L34)
- [server/src/services/assessment.service.ts:20-33](file://server/src/services/assessment.service.ts#L20-L33)
- [server/src/services/assessment.service.ts:48-88](file://server/src/services/assessment.service.ts#L48-L88)

Scoring and classification:
- Total score is the sum of responses (each 0–3).
- Severity levels: MINIMAL, MILD, MODERATE, MODERATELY_SEVERE, SEVERE.
- Risk level mapping supports downstream risk evaluation and alert creation.

Practical workflow example:
- Student completes the questionnaire, submits, views total score and severity classification, and receives guidance based on severity.

**Section sources**
- [client/src/app/assessment/page.tsx:33-96](file://client/src/app/assessment/page.tsx#L33-L96)
- [server/src/controllers/assessment.controller.ts:5-34](file://server/src/controllers/assessment.controller.ts#L5-L34)
- [server/src/services/assessment.service.ts:12-33](file://server/src/services/assessment.service.ts#L12-L33)
- [server/src/services/assessment.service.ts:48-88](file://server/src/services/assessment.service.ts#L48-L88)

### Mood Tracking System
The mood module allows daily logging of mood ratings with optional notes, displays recent history, and computes trend metrics including average mood and trend direction.

```mermaid
sequenceDiagram
participant U as "User"
participant UI as "Mood UI"
participant API as "Mood Controller"
participant SVC as "Risk Service"
U->>UI : "Select rating and optional notes"
UI->>API : "POST /api/mood"
API->>SVC : "createMoodEntry(userId, rating, notes)"
SVC-->>API : "MoodEntry persisted"
API-->>UI : "201 with entry"
UI->>UI : "Refresh history and trends"
UI-->>U : "Show updated history and trend summary"
```

**Diagram sources**
- [client/src/app/mood/page.tsx:63-91](file://client/src/app/mood/page.tsx#L63-L91)
- [server/src/controllers/mood.controller.ts:5-34](file://server/src/controllers/mood.controller.ts#L5-L34)
- [server/src/services/risk.service.ts:29-54](file://server/src/services/risk.service.ts#L29-L54)

Trend analysis:
- Compares recent 7-day average against 7–30 day average to determine IMPROVING, DECLINING, or STABLE.
- Provides average mood and total entries for quick insight.

Practical workflow example:
- Student logs mood daily, reviews recent entries, and observes trend changes over time.

**Section sources**
- [client/src/app/mood/page.tsx:29-112](file://client/src/app/mood/page.tsx#L29-L112)
- [server/src/controllers/mood.controller.ts:5-67](file://server/src/controllers/mood.controller.ts#L5-L67)
- [server/src/services/risk.service.ts:29-54](file://server/src/services/risk.service.ts#L29-L54)

### Personalized Recommendation Engine
Recommendations are generated from assessment severity and risk evaluation. When severity reaches MODERATE or above, a tailored recommendation is stored and associated with risk level. Risk evaluation aggregates PHQ-9 score, recent negative sentiment ratio, and mood trend to compute risk level and recommendation text.

```mermaid
flowchart TD
Start(["Assessment Submitted"]) --> Severity["Determine Severity"]
Severity --> RiskEval["Evaluate Risk Factors"]
RiskEval --> Score["PHQ-9 Score"]
RiskEval --> NegRatio["Negative Sentiment Ratio (7 days)"]
RiskEval --> MoodTrend["Mood Trend (7 vs 30 days avg)"]
Score --> Classify["Assign Risk Level"]
NegRatio --> Classify
MoodTrend --> Classify
Classify --> RecText["Generate Recommendation Text"]
RecText --> Persist["Persist Recommendation"]
Persist --> Alert{"Risk HIGH or SEVERE?"}
Alert --> |Yes| CreateAlert["Create Risk Alert"]
Alert --> |No| Done["Done"]
CreateAlert --> Done
```

**Diagram sources**
- [server/src/services/assessment.service.ts:48-88](file://server/src/services/assessment.service.ts#L48-L88)
- [server/src/services/risk.service.ts:11-107](file://server/src/services/risk.service.ts#L11-L107)

Recommendation categories:
- LOW/MODERATE/HIGH/SEVERE with distinct guidance text and alert creation for high-risk cases.

**Section sources**
- [server/src/services/assessment.service.ts:48-88](file://server/src/services/assessment.service.ts#L48-L88)
- [server/src/services/risk.service.ts:11-107](file://server/src/services/risk.service.ts#L11-L107)

### Counselor Dashboard and Alert Management
Counselors monitor risk alerts and student wellbeing via a dashboard that lists alerts with filtering by status and risk level, and provides a student summary including recent assessments, moods, sentiment breakdown, and recommendations.

```mermaid
sequenceDiagram
participant C as "Counsellor"
participant UI as "Counsellor Dashboard"
participant API as "Alert Controller"
participant SVC as "Alert Service"
participant DB as "Prisma"
C->>UI : "Open dashboard and apply filters"
UI->>API : "GET /api/alerts?status&riskLevel"
API->>SVC : "getAlerts(filters)"
SVC->>DB : "Find risk alerts with includes"
DB-->>SVC : "Alerts with user and assessment"
SVC-->>API : "Alert list"
API-->>UI : "200 JSON alerts"
UI-->>C : "Display stats and alert list"
C->>UI : "Click alert row"
UI->>API : "GET /api/alerts/ : id"
API->>SVC : "getAlertById(id)"
SVC-->>API : "Alert details"
API-->>UI : "200 JSON alert"
UI-->>C : "Show alert details and actions"
```

**Diagram sources**
- [client/src/app/counsellor/dashboard/page.tsx:49-81](file://client/src/app/counsellor/dashboard/page.tsx#L49-L81)
- [server/src/controllers/alert.controller.ts:5-53](file://server/src/controllers/alert.controller.ts#L5-L53)
- [server/src/services/alert.service.ts:3-26](file://server/src/services/alert.service.ts#L3-L26)

Administrative dashboard:
- The student dashboard aggregates latest mood, PHQ-9 severity, and risk level for quick overview and quick action links.

**Section sources**
- [client/src/app/counsellor/dashboard/page.tsx:28-107](file://client/src/app/counsellor/dashboard/page.tsx#L28-L107)
- [server/src/controllers/alert.controller.ts:5-53](file://server/src/controllers/alert.controller.ts#L5-L53)
- [server/src/services/alert.service.ts:35-61](file://server/src/services/alert.service.ts#L35-L61)
- [client/src/app/dashboard/page.tsx:29-95](file://client/src/app/dashboard/page.tsx#L29-L95)

### Administrative Dashboard
The administrative dashboard endpoint provides system-wide statistics for counselors, enabling oversight of alert volumes and statuses.

```mermaid
sequenceDiagram
participant Admin as "Admin/Counsellor"
participant UI as "Admin Dashboard"
participant API as "Dashboard Controller"
participant SVC as "Dashboard Service"
Admin->>UI : "Open dashboard"
UI->>API : "GET /api/dashboard/stats"
API->>SVC : "getDashboardStats()"
SVC-->>API : "Stats"
API-->>UI : "200 JSON stats"
UI-->>Admin : "Display totals and counts"
```

**Diagram sources**
- [client/src/app/counsellor/dashboard/page.tsx:49-63](file://client/src/app/counsellor/dashboard/page.tsx#L49-L63)
- [server/src/controllers/dashboard.controller.ts:5-12](file://server/src/controllers/dashboard.controller.ts#L5-L12)

**Section sources**
- [server/src/controllers/dashboard.controller.ts:1-13](file://server/src/controllers/dashboard.controller.ts#L1-L13)
- [client/src/app/counsellor/dashboard/page.tsx:117-136](file://client/src/app/counsellor/dashboard/page.tsx#L117-L136)

## Dependency Analysis
- Frontend pages depend on API endpoints exposed by controllers.
- Controllers depend on services for business logic.
- Services depend on Prisma for persistence and on the NLP service for sentiment analysis.
- Risk evaluation depends on assessment severity, recent messages’ sentiment, and mood trends.

```mermaid
graph LR
FE_Dash["Dashboard UI"] --> BE_Route["Routes"]
FE_Chat["Chat UI"] --> BE_Route
FE_Assess["Assessment UI"] --> BE_Route
FE_Mood["Mood UI"] --> BE_Route
FE_CDash["Counsellor Dashboard UI"] --> BE_Route
BE_Route --> Ctrl_Chat["Chat Controller"]
BE_Route --> Ctrl_Assess["Assessment Controller"]
BE_Route --> Ctrl_Mood["Mood Controller"]
BE_Route --> Ctrl_Alert["Alert Controller"]
BE_Route --> Ctrl_Dash["Dashboard Controller"]
Ctrl_Chat --> Svc_Risk["Risk Service"]
Ctrl_Assess --> Svc_Assess["Assessment Service"]
Ctrl_Mood --> Svc_Risk
Ctrl_Alert --> Svc_Alert["Alert Service"]
Ctrl_Dash --> Svc_Alert
Svc_Risk --> NLP_Proc["Text Processor"]
NLP_Proc --> NLP_VADER["VADER Analyzer"]
Svc_Risk --> DB["Prisma"]
Svc_Assess --> DB
Svc_Alert --> DB
```

**Diagram sources**
- [client/src/app/dashboard/page.tsx:1-206](file://client/src/app/dashboard/page.tsx#L1-L206)
- [client/src/app/chat/page.tsx:1-196](file://client/src/app/chat/page.tsx#L1-L196)
- [client/src/app/assessment/page.tsx:1-192](file://client/src/app/assessment/page.tsx#L1-L192)
- [client/src/app/mood/page.tsx:1-245](file://client/src/app/mood/page.tsx#L1-L245)
- [client/src/app/counsellor/dashboard/page.tsx:1-213](file://client/src/app/counsellor/dashboard/page.tsx#L1-L213)
- [server/src/controllers/chat.controller.ts:1-69](file://server/src/controllers/chat.controller.ts#L1-L69)
- [server/src/controllers/assessment.controller.ts:1-74](file://server/src/controllers/assessment.controller.ts#L1-L74)
- [server/src/controllers/mood.controller.ts:1-67](file://server/src/controllers/mood.controller.ts#L1-L67)
- [server/src/controllers/alert.controller.ts:1-70](file://server/src/controllers/alert.controller.ts#L1-L70)
- [server/src/controllers/dashboard.controller.ts:1-13](file://server/src/controllers/dashboard.controller.ts#L1-L13)
- [server/src/services/risk.service.ts:1-138](file://server/src/services/risk.service.ts#L1-L138)
- [server/src/services/assessment.service.ts:1-89](file://server/src/services/assessment.service.ts#L1-L89)
- [server/src/services/alert.service.ts:1-62](file://server/src/services/alert.service.ts#L1-L62)
- [nlp-service/nlp/processor.py:1-19](file://nlp-service/nlp/processor.py#L1-L19)
- [nlp-service/nlp/analyzer.py:1-27](file://nlp-service/nlp/analyzer.py#L1-L27)

**Section sources**
- [server/src/services/risk.service.ts:1-138](file://server/src/services/risk.service.ts#L1-L138)
- [server/src/services/assessment.service.ts:1-89](file://server/src/services/assessment.service.ts#L1-L89)
- [server/src/services/alert.service.ts:1-62](file://server/src/services/alert.service.ts#L1-L62)
- [nlp-service/nlp/analyzer.py:1-27](file://nlp-service/nlp/analyzer.py#L1-L27)
- [nlp-service/nlp/processor.py:1-19](file://nlp-service/nlp/processor.py#L1-L19)

## Performance Considerations
- Asynchronous loading: Client pages use concurrent API calls to reduce perceived latency (e.g., fetching mood history and trends together).
- Efficient sentiment analysis: Preprocessing cleans text to improve VADER performance while keeping overhead minimal.
- Trend computations: Aggregation over bounded windows (7 and 30 days) ensures predictable runtime and memory usage.
- Recommendations and alerts: Stored once per assessment or risk evaluation to avoid recomputation.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:
- Authentication redirects: Pages redirect unauthenticated users to the login route.
- Validation errors:
  - Chat requires non-empty message text.
  - Assessment requires exactly nine ordinal responses within the allowed range.
  - Mood requires a numeric rating between 1 and 5.
- Network failures: Client pages catch and surface errors during submissions or data fetches.
- Counselor access: Non-counselor users are redirected away from the counselor dashboard.

**Section sources**
- [client/src/app/chat/page.tsx:26-32](file://client/src/app/chat/page.tsx#L26-L32)
- [server/src/controllers/chat.controller.ts:43-46](file://server/src/controllers/chat.controller.ts#L43-L46)
- [server/src/controllers/assessment.controller.ts:14-21](file://server/src/controllers/assessment.controller.ts#L14-L21)
- [server/src/controllers/mood.controller.ts:14-22](file://server/src/controllers/mood.controller.ts#L14-L22)
- [client/src/app/counsellor/dashboard/page.tsx:36-46](file://client/src/app/counsellor/dashboard/page.tsx#L36-L46)

## Conclusion
BuddyAI’s key features integrate conversational AI with robust mental health workflows. The chat assistant leverages VADER sentiment to enrich interactions, the PHQ-9 assessment automates scoring and risk classification, the mood tracker provides actionable insights through trend analysis, and the recommendation engine personalizes support. Counselor and administrative dashboards streamline monitoring and intervention for high-risk cases.

[No sources needed since this section summarizes without analyzing specific files]