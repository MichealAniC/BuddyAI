---
kind: design
name: Adopt polyglot microservices architecture with Node.js backend and Python NLP service
source: session
category: adr
---

# Adopt polyglot microservices architecture with Node.js backend and Python NLP service

_Source: coding plans from commit period eb23bcb → e2c8bb5 — records intent at planning time; the implementation may lag or differ._

**Status:** accepted

## Context
The system requires both robust web API capabilities (auth, data persistence, RBAC) and specialized natural language processing (sentiment analysis). A single technology stack would either lack optimal NLP libraries (Node.js) or require complex bridging for web standards (Python). The project needs to support distinct development lifecycles for the core application logic and the AI/ML components.

## Decision drivers
- Access to specialized NLP libraries (NLTK, VADER)
- Separation of concerns between web serving and AI processing
- Team familiarity with TypeScript for web development and Python for data tasks
- Independent scaling of compute-intensive NLP tasks

## Considered options
- **Polyglot Microservices (Node.js + Python)** — pros: Best-in-class tools for each domain (Express/Prisma for API, NLTK/VADER for NLP); independent deployment and scaling; clear boundary between business logic and AI logic.; cons: Increased operational complexity (managing two runtimes, inter-service communication overhead, separate dependency management).
- **Monolithic Node.js Application** _(rejected)_ — pros: Simpler deployment and codebase management; no network latency between API and NLP logic.; cons: Limited access to mature Python-based NLP ecosystems; potential performance bottlenecks if NLP processing blocks the Node.js event loop; harder to swap out AI models later.
- **Monolithic Python Application (e.g., Django/FastAPI only)** _(rejected)_ — pros: Unified language stack; direct access to NLP libraries.; cons: Less ergonomic ecosystem for modern reactive frontends compared to Next.js/Node tooling; potentially slower development velocity for standard CRUD/API features compared to Express/Prisma stack.

## Decision
Implement a distributed architecture with three distinct services: a Next.js frontend, a Node.js/Express backend for API/Auth/Data, and a standalone Python/FastAPI microservice for NLP. The backend will communicate with the NLP service via HTTP calls to the `/analyze` endpoint.

## Consequences
The system gains modularity and access to optimal libraries for each task. However, it introduces network dependency between the backend and NLP service, requiring error handling for service unavailability. Deployment requires orchestrating multiple services (via docker-compose or similar), and developers must maintain two separate runtime environments (Node.js and Python).