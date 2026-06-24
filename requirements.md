# BuddyAI System Requirements

## 1. Introduction

This document defines the functional and non-functional requirements for BuddyAI, an AI-based system designed to support students experiencing symptoms of depression in tertiary institutions.

The system combines conversational interaction, sentiment analysis, PHQ-9 depression assessment, mood tracking, risk evaluation, and counsellor intervention to provide mental health support and early risk detection.

---

# 2. User Roles

The system supports two user roles:

## Student

The primary user of the system who interacts with BuddyAI for mental health support.

## Counsellor

A professional responsible for reviewing high-risk cases and providing intervention when necessary.

---

# 3. Functional Requirements

## 3.1 Authentication Module

### FR-001: Student Registration

The system shall allow students to create an account using:

- Full Name
- Email Address
- Password

### FR-002: User Login

The system shall allow registered users to authenticate using their credentials.

### FR-003: Secure Password Storage

The system shall store passwords using secure hashing techniques.

### FR-004: Role-Based Access

The system shall restrict access based on assigned user roles.

---

## 3.2 Chat Module

### FR-005: Chat Interaction

The system shall allow students to communicate with BuddyAI through a conversational interface.

### FR-006: Conversation Storage

The system shall store all conversation sessions for future reference and analysis.

### FR-007: Message Processing

The system shall process user messages before sentiment analysis.

---

## 3.3 Sentiment Analysis Module

### FR-008: Sentiment Analysis

The system shall analyze student messages using the VADER Sentiment Analyzer.

### FR-009: Sentiment Classification

The system shall classify messages as:

- Positive
- Neutral
- Negative

### FR-010: Sentiment Score Storage

The system shall store sentiment scores associated with each message.

---

## 3.4 PHQ-9 Assessment Module

### FR-011: Assessment Availability

The system shall provide access to the PHQ-9 questionnaire.

### FR-012: PHQ-9 Scoring

The system shall automatically calculate PHQ-9 scores.

### FR-013: Severity Classification

The system shall classify depression severity as:

- Minimal
- Mild
- Moderate
- Moderately Severe
- Severe

### FR-014: Assessment History

The system shall maintain historical assessment records.

---

## 3.5 Mood Tracking Module

### FR-015: Mood Recording

The system shall allow students to record daily mood entries.

### FR-016: Mood Scale

The system shall support a mood scale of 1–5.

### FR-017: Mood History

The system shall maintain historical mood records.

### FR-018: Mood Trend Analysis

The system shall identify mood trends over time.

---

## 3.6 Risk Evaluation Module

### FR-019: Risk Evaluation

The system shall evaluate student risk levels using:

- Sentiment Analysis Results
- PHQ-9 Assessment Results
- Mood History

### FR-020: Risk Classification

The system shall classify risk levels as:

- Low Risk
- Moderate Risk
- High Risk
- Severe Risk

### FR-021: Risk Score Storage

The system shall store generated risk classifications.

---

## 3.7 Recommendation Engine

### FR-022: Recommendation Generation

The system shall generate personalized support recommendations.

### FR-023: Recommendation Sources

Recommendations shall be generated using:

- Sentiment Results
- PHQ-9 Results
- Mood Trends
- Risk Level

### FR-024: Recommendation History

The system shall maintain recommendation records.

---

## 3.8 Counsellor Alert Module

### FR-025: Alert Generation

The system shall automatically generate alerts for High Risk and Severe Risk students.

### FR-026: Alert Storage

The system shall store generated alerts.

### FR-027: Alert Review

Counsellors shall be able to review generated alerts.

### FR-028: Alert Status Management

Counsellors shall be able to update alert status as:

- Pending
- Reviewed
- Resolved

---

## 3.9 Counsellor Dashboard

### FR-029: Alert Dashboard

The system shall provide counsellors with access to active alerts.

### FR-030: Student Risk Summary

The system shall display student risk summaries.

### FR-031: Assessment Review

The system shall allow counsellors to review assessment results.

### FR-032: Mood Trend Review

The system shall allow counsellors to review mood history and trends.

---

# 4. Artificial Intelligence Requirements

### AIR-001

The system shall use Natural Language Processing (NLP) techniques for text processing.

### AIR-002

The system shall use the VADER Sentiment Analyzer for sentiment analysis.

### AIR-003

The system shall use the PHQ-9 framework as the primary depression assessment mechanism.

### AIR-004

The system shall combine:

- Sentiment Analysis
- PHQ-9 Scores
- Mood History

to determine student risk levels.

### AIR-005

The system shall generate recommendations using rule-based decision logic.

### AIR-006

The system shall trigger counsellor alerts when severe mental health risks are detected.

---

# 5. Non-Functional Requirements

## Performance

### NFR-001

The system shall respond to user requests within acceptable time limits.

### NFR-002

Sentiment analysis shall be performed in near real-time.

### NFR-003

Recommendations shall be generated immediately after evaluation.

---

## Security

### NFR-004

Passwords shall be encrypted before storage.

### NFR-005

User authentication shall be required before accessing protected resources.

### NFR-006

Role-based authorization shall be enforced.

### NFR-007

Student mental health data shall be protected from unauthorized access.

---

## Reliability

### NFR-008

The system shall maintain data consistency across all modules.

### NFR-009

The system shall prevent loss of assessment records and mood history.

---

## Usability

### NFR-010

The system shall provide a simple and user-friendly interface.

### NFR-011

The chatbot interface shall be easy to use for students.

### NFR-012

The counsellor dashboard shall provide clear visibility into flagged cases.

---

# 6. Business Rules

### BR-001

Every student must have a registered account before accessing BuddyAI services.

### BR-002

Only counsellors may access risk alerts.

### BR-003

Every PHQ-9 assessment must generate a severity classification.

### BR-004

Every mood entry must be associated with a registered student.

### BR-005

High Risk and Severe Risk students must generate a risk alert.

### BR-006

Recommendations must be generated after each risk evaluation.

### BR-007

Students may view only their own records.

### BR-008

Counsellors may only access students associated with generated risk alerts.

---

# 7. System Constraints

### SC-001

The system uses the PHQ-9 framework for depression assessment.

### SC-002

The system uses the VADER Sentiment Analyzer for sentiment classification.

### SC-003

The system is designed as a support tool and not a medical diagnostic system.

### SC-004

The system does not replace professional counselling services.

---

# 8. Success Criteria

The BuddyAI system shall be considered successful when it can:

- Analyze student conversations.
- Evaluate sentiment accurately.
- Process PHQ-9 assessments correctly.
- Track mood history effectively.
- Classify student risk levels.
- Generate personalized recommendations.
- Alert counsellors for high-risk cases.
- Maintain secure and reliable student records.
