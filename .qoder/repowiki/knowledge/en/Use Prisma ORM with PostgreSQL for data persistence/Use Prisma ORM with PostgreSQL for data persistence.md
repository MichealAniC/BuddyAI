---
kind: design
name: Use Prisma ORM with PostgreSQL for data persistence
source: session
category: adr
---

# Use Prisma ORM with PostgreSQL for data persistence

_Source: coding plans from commit period eb23bcb → e2c8bb5 — records intent at planning time; the implementation may lag or differ._

**Status:** accepted

## Context
The application requires a relational database to store structured user data, conversations, assessments, and risk alerts with strict referential integrity (foreign keys between Users, Conversations, Messages, etc.). The team needs a type-safe way to interact with the database from TypeScript to minimize runtime errors and accelerate development.

## Decision drivers
- Type safety end-to-end (DB schema to TypeScript API)
- Developer productivity and migration management
- Relational data integrity requirements
- PostgreSQL reliability and feature set

## Considered options
- **Prisma ORM + PostgreSQL** — pros: Auto-generated type-safe clients; intuitive schema definition; built-in migration tooling; strong community support; excellent TypeScript integration.; cons: Abstraction layer may obscure complex SQL optimizations; slightly higher memory usage than raw drivers.
- **Raw SQL / Query Builder (e.g., pg library)** _(rejected)_ — pros: Maximum control over queries; no abstraction overhead.; cons: High risk of runtime errors; manual type mapping required; slower development velocity; no automated migration management.
- **NoSQL Database (e.g., MongoDB)** _(rejected)_ — pros: Flexible schema for unstructured data like chat logs.; cons: Poor fit for highly relational data (User-Assessment-Alert relationships); lack of ACID transactions for complex updates; harder to enforce data integrity.

## Decision
Adopt PostgreSQL as the primary database with Prisma ORM as the data access layer. The schema will define 7 core models (User, Conversation, Message, MoodEntry, Phq9Assessment, Recommendation, RiskAlert) with explicit foreign key relationships.

## Consequences
Developers benefit from auto-completion and type checking for database operations, reducing bugs. Schema changes are managed via Prisma migrations. The system is constrained to relational data patterns, which fits the domain well but may require careful design for any future unstructured data needs.