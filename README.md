# BuddyAI

### AI-Based System for Supporting Students with Depression in Tertiary Institutions

## Overview

BuddyAI is an AI-powered mental health support system designed to assist students in tertiary institutions who may be experiencing symptoms of depression. The system leverages Natural Language Processing (NLP), sentiment analysis, mood monitoring, and the Patient Health Questionnaire (PHQ-9) framework to identify potential signs of depression and provide timely support resources.

The primary objective of the system is not to replace professional mental health practitioners but to serve as an early intervention and support tool that encourages students to seek appropriate assistance when needed.

This project was developed as a Final Year Project in partial fulfillment of the requirements for the award of a Bachelor's Degree in Computer Science.

---

## Problem Statement

Depression is one of the most common mental health challenges affecting students in tertiary institutions. Academic pressure, financial difficulties, social isolation, and personal challenges often contribute to emotional distress among students.

Unfortunately, many students do not seek professional help due to stigma, lack of awareness, limited access to counseling services, or delayed recognition of their symptoms.

BuddyAI addresses this challenge by providing:

- Early detection of depressive symptoms
- Continuous emotional monitoring
- Personalized support recommendations
- Easy access to mental health resources
- Referral guidance for professional intervention when necessary

---

## Project Objectives

### Main Objective

To develop an AI-based system capable of supporting students experiencing symptoms of depression through intelligent conversational interaction and mood assessment.

### Specific Objectives

- Develop a conversational AI capable of interacting with students naturally
- Implement sentiment analysis for emotional state detection
- Integrate PHQ-9-based depression assessment
- Monitor mood trends over time
- Generate depression risk assessments
- Provide personalized coping recommendations
- Facilitate referrals to counseling services when necessary
- Maintain secure storage of student interaction records

---

## Key Features

### User Authentication

- Student Registration
- Secure Login
- Password Management
- Session Management

### Conversational AI Support

- Natural language conversations
- Emotional expression analysis
- Mental wellness check-ins
- Context-aware responses

### Sentiment Analysis Engine

- Detection of positive emotions
- Detection of neutral emotions
- Detection of negative emotions
- Sentiment score generation

### Depression Assessment

- PHQ-9 questionnaire integration
- Automated scoring
- Depression severity classification

### Mood Tracking

- Daily mood logging
- Mood history visualization
- Mood trend analysis

### Recommendation System

- Personalized self-help suggestions
- Mental wellness tips
- Stress management techniques
- Referral recommendations

### Administrative Dashboard

- User management
- System monitoring
- Assessment statistics
- Report generation

---

## System Architecture

The system follows a multi-layer architecture consisting of:

### Presentation Layer

Provides the user interface through which students interact with the system.

### Application Layer

Handles business logic including:

- User management
- Chat processing
- Sentiment analysis
- Assessment management

### AI Processing Layer

Responsible for:

- Natural Language Processing (NLP)
- Sentiment Classification
- Depression Risk Evaluation
- Recommendation Generation

### Data Layer

Stores:

- User profiles
- Chat histories
- Mood records
- Assessment results
- System logs

---

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Node.js
- Express.js
- REST API

### Database

- PostgreSQL

### Artificial Intelligence & Machine Learning

- Python
- Scikit-Learn
- Pandas
- NumPy
- NLTK

### Authentication

- JWT Authentication

### Deployment

- Docker
- Vercel
- Railway

---

## Machine Learning Component

### Model Purpose

The machine learning model is designed to identify depressive tendencies from user responses and sentiment patterns.

### Input Features

The model utilizes:

- PHQ-9 responses
- Sentiment scores
- Mood ratings
- Interaction frequency
- Emotional indicators

### Output

The model predicts the following depression severity levels:

- Minimal Depression
- Mild Depression
- Moderate Depression
- Moderately Severe Depression
- Severe Depression

### Evaluation Metrics

The model is evaluated using:

- Accuracy
- Precision
- Recall
- F1-Score

---

## PHQ-9 Assessment Framework

The Patient Health Questionnaire-9 (PHQ-9) serves as the primary assessment instrument within the system.

The PHQ-9 evaluates nine symptoms associated with depression over the previous two weeks and provides a standardized method for assessing depression severity.

### Depression Severity Categories

| PHQ-9 Score | Severity |
|------------|----------|
| 0 – 4 | Minimal Depression |
| 5 – 9 | Mild Depression |
| 10 – 14 | Moderate Depression |
| 15 – 19 | Moderately Severe Depression |
| 20 – 27 | Severe Depression |

---

## Security and Privacy

Because the system handles sensitive user information, several security measures are implemented:

- Password hashing
- JWT authentication
- Secure API communication
- Input validation
- Data encryption
- Role-based access control (RBAC)

---

## Ethical Considerations

BuddyAI is designed as a support tool and not a diagnostic medical system.

Important considerations include:

- User consent before assessments
- Protection of user privacy
- Transparency regarding AI-generated recommendations
- Encouragement of professional mental health consultation when required

---

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/buddyai.git

cd buddyai
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=
JWT_SECRET=
OPENAI_API_KEY=
```

### Run Development Server

```bash
npm run dev
```

---

## Future Improvements

Planned enhancements include:

- Mobile application development
- Voice-based emotional analysis
- Real-time counselor integration
- Multilingual support
- Advanced deep learning models
- Emergency risk detection

---

## Research Contribution

This study contributes to the growing field of Artificial Intelligence in Mental Health by demonstrating how AI technologies can assist in the early detection and support of students experiencing symptoms of depression in tertiary institutions.

---

## Disclaimer

BuddyAI does not provide medical diagnoses and should not be used as a replacement for professional mental health services.

Users experiencing severe emotional distress are strongly encouraged to seek assistance from qualified mental health professionals, counselors, healthcare providers, or emergency services.

---

## Author

**Micheal Ani**

Final Year Project

Department of Computer Science

2026

---

## License

This project is developed for academic and research purposes. Licensing terms will be specified upon project completion.
