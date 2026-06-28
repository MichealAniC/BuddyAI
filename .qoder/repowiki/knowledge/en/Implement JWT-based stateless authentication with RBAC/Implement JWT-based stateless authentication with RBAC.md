---
kind: design
name: Implement JWT-based stateless authentication with RBAC
source: session
category: adr
---

# Implement JWT-based stateless authentication with RBAC

_Source: coding plans from commit period eb23bcb → e2c8bb5 — records intent at planning time; the implementation may lag or differ._

**Status:** accepted

## Context
The application has two distinct user roles (Student and Counsellor) with different access permissions. The frontend (Next.js) and backend (Express) need a secure, scalable way to authenticate requests without maintaining server-side session state, which would complicate horizontal scaling.

## Decision drivers
- Stateless scalability
- Clear role-based access control (RBAC)
- Simplicity of implementation
- Compatibility with React/Next.js frontend

## Considered options
- **JWT Access Tokens** — pros: Stateless verification allows any backend instance to validate requests; easy to pass in HTTP headers; standard support in frontend libraries.; cons: Tokens cannot be easily revoked before expiry (requires short TTLs or deny-lists); payload size limits.
- **Server-side Sessions (Cookie-based)** _(rejected)_ — pros: Immediate revocation capability; smaller client-side footprint.; cons: Requires shared session store (Redis/DB) for scaling; sticky sessions or distributed cache needed; more complex infrastructure.

## Decision
Use JSON Web Tokens (JWT) for authentication. Upon login, the server issues a JWT containing the user ID and role. Middleware verifies the token signature and enforces role-based guards (Student/Counsellor) on protected routes. Passwords are hashed using bcrypt.

## Consequences
Authentication is scalable and simple to implement. Revocation is handled by setting a 24-hour expiry, meaning compromised tokens remain valid for up to 24 hours unless a deny-list mechanism is added later. Frontend must securely store and attach the token to requests.