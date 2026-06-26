# Scoring Algorithm

<cite>
**Referenced Files in This Document**
- [assessment.service.ts](file://server/src/services/assessment.service.ts)
- [assessment.controller.ts](file://server/src/controllers/assessment.controller.ts)
- [assessment.routes.ts](file://server/src/routes/assessment.routes.ts)
- [assessment.test.ts](file://server/src/__tests__/assessment.test.ts)
- [page.tsx](file://client/src/app/assessment/page.tsx)
- [schema.prisma](file://prisma/schema.prisma)
- [risk.service.ts](file://server/src/services/risk.service.ts)
- [errorHandler.ts](file://server/src/middleware/errorHandler.ts)
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
This document provides comprehensive documentation for the PHQ-9 (Patient Health Questionnaire-9) scoring algorithm implementation within the BuddyAI platform. The PHQ-9 is a widely used 9-item depression screening tool that generates a total score ranging from 0-27 points, with automated severity classification and integration with risk assessment workflows.

The implementation follows evidence-based clinical guidelines for depression severity classification and integrates seamlessly with the broader mental health monitoring system, including automated recommendation generation and counsellor alert notifications.

## Project Structure
The PHQ-9 scoring functionality is implemented across multiple layers of the application architecture:

```mermaid
graph TB
subgraph "Client Layer"
UI[Assessment Page<br/>React Component]
end
subgraph "Server Layer"
Routes[Assessment Routes]
Controller[Assessment Controller]
Service[Assessment Service]
Risk[Risk Service]
end
subgraph "Data Layer"
Prisma[Prisma Schema]
DB[(PostgreSQL Database)]
end
UI --> Routes
Routes --> Controller
Controller --> Service
Service --> Prisma
Prisma --> DB
Service --> Risk
Risk --> DB
```

**Diagram sources**
- [assessment.routes.ts:1-12](file://server/src/routes/assessment.routes.ts#L1-L12)
- [assessment.controller.ts:1-74](file://server/src/controllers/assessment.controller.ts#L1-L74)
- [assessment.service.ts:1-89](file://server/src/services/assessment.service.ts#L1-L89)
- [schema.prisma:97-108](file://prisma/schema.prisma#L97-L108)

**Section sources**
- [assessment.routes.ts:1-12](file://server/src/routes/assessment.routes.ts#L1-L12)
- [assessment.controller.ts:1-74](file://server/src/controllers/assessment.controller.ts#L1-L74)
- [assessment.service.ts:1-89](file://server/src/services/assessment.service.ts#L1-L89)

## Core Components

### PHQ-9 Scoring Methodology
The PHQ-9 scoring algorithm implements a straightforward summative approach where each of the 9 depression-related symptoms is rated on a 4-point Likert scale:

- **0**: Not at all
- **1**: Several days  
- **2**: More than half the days
- **3**: Nearly every day

**Total Score Calculation**: Sum of all 9 individual item scores (0-3 each) = Total score 0-27

**Severity Classification Thresholds**:
- **Minimal Depression**: 0-4 points
- **Mild Depression**: 5-9 points  
- **Moderate Depression**: 10-14 points
- **Moderately Severe Depression**: 15-19 points
- **Severe Depression**: 20-27 points

### Automated Scoring Logic
The scoring implementation uses a simple threshold-based classification system that ensures consistent, reproducible results across all assessments.

**Section sources**
- [assessment.service.ts:12-18](file://server/src/services/assessment.service.ts#L12-L18)
- [assessment.test.ts:25-154](file://server/src/__tests__/assessment.test.ts#L25-L154)

## Architecture Overview

```mermaid
sequenceDiagram
participant Client as "Client Browser"
participant API as "Assessment Routes"
participant Controller as "Assessment Controller"
participant Service as "Assessment Service"
participant Database as "Prisma ORM"
participant Risk as "Risk Service"
Client->>API : POST /api/assessments/phq9
API->>Controller : submit()
Controller->>Controller : Validate input format
Controller->>Service : submitAssessment(userId, responses)
Service->>Service : Calculate total score
Service->>Service : Classify severity
Service->>Database : Create assessment record
Database-->>Service : Assessment data
Service-->>Controller : Assessment result
Controller->>Controller : Check severity threshold
alt Moderate or higher
Controller->>Service : generateRecommendation()
Service->>Risk : Generate recommendation
Risk->>Database : Create recommendation
end
Controller-->>Client : 201 Created Assessment
Note over Client,Database : Assessment stored with severity classification
```

**Diagram sources**
- [assessment.routes.ts:7](file://server/src/routes/assessment.routes.ts#L7)
- [assessment.controller.ts:5-34](file://server/src/controllers/assessment.controller.ts#L5-L34)
- [assessment.service.ts:20-33](file://server/src/services/assessment.service.ts#L20-L33)
- [risk.service.ts:78-104](file://server/src/services/risk.service.ts#L78-L104)

## Detailed Component Analysis

### Assessment Service Implementation
The assessment service provides the core scoring functionality with robust validation and classification capabilities.

```mermaid
classDiagram
class AssessmentService {
+submitAssessment(userId, responses) Assessment
+getAssessmentHistory(userId) Assessment[]
+getAssessmentById(id, userId) Assessment
-classifySeverity(score) SeverityLevel
-severityToRiskLevel(severity) RiskLevel
-buildRecommendationText(severity, totalScore) string
+generateRecommendation(assessment) Recommendation
}
class SeverityClassification {
<<enumeration>>
MINIMAL
MILD
MODERATE
MODERATELY_SEVERE
SEVERE
}
class RiskLevels {
<<enumeration>>
LOW
MODERATE
HIGH
SEVERE
}
AssessmentService --> SeverityClassification : "uses"
AssessmentService --> RiskLevels : "maps to"
```

**Diagram sources**
- [assessment.service.ts:3](file://server/src/services/assessment.service.ts#L3-L10)
- [assessment.service.ts:12-18](file://server/src/services/assessment.service.ts#L12-L18)
- [assessment.service.ts:48-61](file://server/src/services/assessment.service.ts#L48-L61)

#### Validation Requirements
The service enforces strict input validation to ensure data integrity:

- **Response Array Format**: Exactly 9 elements required
- **Individual Values**: Must be integers between 0-3 (inclusive)
- **Data Type**: All responses must be numeric
- **Array Type**: Must be a JavaScript Array

#### Severity Classification Logic
The classification system uses a tiered threshold approach:

```mermaid
flowchart TD
Start([Score Input]) --> Check04{"Score ≤ 4?"}
Check04 --> |Yes| Minimal["MINIMAL (0-4)"]
Check04 --> |No| Check59{"Score ≤ 9?"}
Check59 --> |Yes| Mild["MILD (5-9)"]
Check59 --> |No| Check1014{"Score ≤ 14?"}
Check1014 --> |Yes| Moderate["MODERATE (10-14)"]
Check1014 --> |No| Check1519{"Score ≤ 19?"}
Check1519 --> |Yes| ModeratelySevere["MODERATELY_SEVERE (15-19)"]
Check1519 --> |No| Severe["SEVERE (20-27)"]
```

**Diagram sources**
- [assessment.service.ts:12-18](file://server/src/services/assessment.service.ts#L12-L18)

**Section sources**
- [assessment.service.ts:20-33](file://server/src/services/assessment.service.ts#L20-L33)
- [assessment.controller.ts:14-21](file://server/src/controllers/assessment.controller.ts#L14-L21)

### Client-Side Implementation
The client-side assessment interface provides an intuitive 4-point Likert scale for each PHQ-9 question:

```mermaid
graph LR
subgraph "PHQ-9 Questions"
Q1[Question 1]
Q2[Question 2]
Q3[Question 3]
Q4[Question 4]
Q5[Question 5]
Q6[Question 6]
Q7[Question 7]
Q8[Question 8]
Q9[Question 9]
end
subgraph "Response Options"
A[0 - Not at all]
B[1 - Several days]
C[2 - More than half the days]
D[3 - Nearly every day]
end
Q1 --> A
Q1 --> B
Q1 --> C
Q1 --> D
Q2 --> A
Q2 --> B
Q2 --> C
Q2 --> D
Q3 --> A
Q3 --> B
Q3 --> C
Q3 --> D
Q4 --> A
Q4 --> B
Q4 --> C
Q4 --> D
Q5 --> A
Q5 --> B
Q5 --> C
Q5 --> D
Q6 --> A
Q6 --> B
Q6 --> C
Q6 --> D
Q7 --> A
Q7 --> B
Q7 --> C
Q7 --> D
Q8 --> A
Q8 --> B
Q8 --> C
Q8 --> D
Q9 --> A
Q9 --> B
Q9 --> C
Q9 --> D
```

**Diagram sources**
- [page.tsx:8-18](file://client/src/app/assessment/page.tsx#L8-L18)
- [page.tsx:20-25](file://client/src/app/assessment/page.tsx#L20-L25)

**Section sources**
- [page.tsx:52-73](file://client/src/app/assessment/page.tsx#L52-L73)

### Risk Assessment Integration
The PHQ-9 scoring integrates with broader risk assessment workflows:

```mermaid
flowchart TD
PHQ9[PHQ-9 Assessment] --> ScoreCalc[Score Calculation]
ScoreCalc --> Severity[Severity Classification]
Severity --> RiskEval[Risk Evaluation]
RiskEval --> LowRisk{"Risk Level"}
LowRisk --> |LOW| NoAlert[No Alert Generated]
LowRisk --> |MODERATE| ModerateAlert[Generate Recommendation]
LowRisk --> |HIGH| HighAlert[Generate Recommendation + Alert]
LowRisk --> |SEVERE| SevereAlert[Generate Recommendation + Alert]
ModerateAlert --> StoreRec[Store Recommendation]
HighAlert --> StoreRec
SevereAlert --> StoreRec
StoreRec --> AlertGen[Generate Alert]
AlertGen --> Notify[Notify Counsellor]
```

**Diagram sources**
- [risk.service.ts:11-107](file://server/src/services/risk.service.ts#L11-L107)
- [assessment.service.ts:76-88](file://server/src/services/assessment.service.ts#L76-L88)

**Section sources**
- [risk.service.ts:87-104](file://server/src/services/risk.service.ts#L87-L104)
- [assessment.controller.ts:25-28](file://server/src/controllers/assessment.controller.ts#L25-L28)

## Dependency Analysis

```mermaid
graph TB
subgraph "External Dependencies"
Express[Express.js]
Prisma[Prisma Client]
PostgreSQL[PostgreSQL Database]
end
subgraph "Internal Modules"
AssessmentRoutes[Assessment Routes]
AssessmentController[Assessment Controller]
AssessmentService[Assessment Service]
RiskService[Risk Service]
ErrorHandler[Error Handler]
end
AssessmentRoutes --> AssessmentController
AssessmentController --> AssessmentService
AssessmentService --> Prisma
RiskService --> Prisma
AssessmentController --> ErrorHandler
AssessmentRoutes --> Express
AssessmentService --> PostgreSQL
RiskService --> PostgreSQL
```

**Diagram sources**
- [assessment.routes.ts:1](file://server/src/routes/assessment.routes.ts#L1)
- [assessment.controller.ts:1](file://server/src/controllers/assessment.controller.ts#L1)
- [assessment.service.ts:1](file://server/src/services/assessment.service.ts#L1)
- [risk.service.ts:1](file://server/src/services/risk.service.ts#L1)

**Section sources**
- [schema.prisma:1-8](file://prisma/schema.prisma#L1-L8)
- [assessment.controller.ts:1](file://server/src/controllers/assessment.controller.ts#L1)

## Performance Considerations
The PHQ-9 scoring implementation is computationally lightweight with O(n) time complexity where n equals the number of questions (constant 9). Memory usage is minimal with constant space complexity O(1).

Key performance characteristics:
- **Processing Time**: Sub-millisecond for score calculation
- **Memory Footprint**: Minimal - only stores response array and calculated values
- **Database Operations**: Single write operation per assessment submission
- **Scalability**: Linear scaling with concurrent users, no bottlenecks

## Troubleshooting Guide

### Common Validation Errors
| Error Condition | Error Message | Resolution |
|----------------|---------------|------------|
| Missing responses array | "responses must be an array of exactly 9 numbers, each between 0 and 3." | Ensure exactly 9 numeric responses (0-3) are provided |
| Invalid response values | Same as above | Verify all responses are integers between 0-3 |
| Incorrect array length | Same as above | Check that exactly 9 responses are submitted |
| Authentication failure | "Authentication required." | Ensure user is logged in before submitting |

### Database Schema Issues
The PHQ-9 assessment schema supports JSON storage for responses, enabling flexible data representation while maintaining type safety through validation layers.

**Section sources**
- [assessment.controller.ts:14-21](file://server/src/controllers/assessment.controller.ts#L14-L21)
- [errorHandler.ts:7-12](file://server/src/middleware/errorHandler.ts#L7-L12)

## Conclusion
The PHQ-9 scoring algorithm implementation provides a robust, clinically validated approach to depression screening within the BuddyAI platform. The implementation ensures:

- **Clinical Accuracy**: Evidence-based scoring thresholds and severity classifications
- **Data Integrity**: Comprehensive input validation prevents malformed submissions
- **Integration**: Seamless connection to risk assessment workflows and recommendation systems
- **User Experience**: Intuitive client interface with immediate feedback
- **Scalability**: Lightweight implementation supports high-volume usage

The system successfully bridges clinical assessment with digital health monitoring, providing automated severity classification and appropriate intervention pathways for different risk levels. The modular architecture ensures maintainability and extensibility for future enhancements to the mental health assessment capabilities.