# Authentication API

<cite>
**Referenced Files in This Document**
- [server/src/index.ts](file://server/src/index.ts)
- [server/src/routes/auth.routes.ts](file://server/src/routes/auth.routes.ts)
- [server/src/controllers/auth.controller.ts](file://server/src/controllers/auth.controller.ts)
- [server/src/services/auth.service.ts](file://server/src/services/auth.service.ts)
- [server/src/middleware/auth.ts](file://server/src/middleware/auth.ts)
- [server/src/utils/password.ts](file://server/src/utils/password.ts)
- [server/src/utils/token.ts](file://server/src/utils/token.ts)
- [server/src/middleware/errorHandler.ts](file://server/src/middleware/errorHandler.ts)
- [server/src/types/index.ts](file://server/src/types/index.ts)
- [server/src/config/env.ts](file://server/src/config/env.ts)
- [prisma/schema.prisma](file://prisma/schema.prisma)
- [client/src/lib/api.ts](file://client/src/lib/api.ts)
- [client/src/lib/auth.ts](file://client/src/lib/auth.ts)
- [client/src/app/login/page.tsx](file://client/src/app/login/page.tsx)
- [client/src/app/register/page.tsx](file://client/src/app/register/page.tsx)
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
This document provides comprehensive API documentation for the authentication endpoints that enable user registration, login, and profile retrieval. It covers endpoint specifications, request/response schemas, authentication headers, error handling, and security considerations. Practical examples using curl and JavaScript fetch are included, along with integration patterns and troubleshooting guidance.

## Project Structure
The authentication system spans the backend server and the Next.js client application:
- Backend routes define the endpoints under /api/auth.
- Controllers handle request validation and orchestrate service calls.
- Services manage database interactions, password hashing, and JWT token generation.
- Middleware enforces authentication via Bearer tokens.
- The client integrates with the API using a shared fetch wrapper and local storage for tokens.

```mermaid
graph TB
subgraph "Server"
R["Routes (/api/auth)"]
C["Controllers (auth.controller.ts)"]
S["Services (auth.service.ts)"]
MW["Middleware (auth.ts)"]
U1["Utils (password.ts)"]
U2["Utils (token.ts)"]
CFG["Config (env.ts)"]
PRISMA["Prisma Schema (schema.prisma)"]
end
subgraph "Client"
API["api.ts (fetch wrapper)"]
AUTH["auth.ts (token helpers)"]
LOGIN["login/page.tsx"]
REGISTER["register/page.tsx"]
end
API --> R
LOGIN --> API
REGISTER --> API
R --> C
C --> S
S --> U1
S --> U2
S --> PRISMA
MW --> C
U2 --> CFG
```

**Diagram sources**
- [server/src/index.ts:1-35](file://server/src/index.ts#L1-L35)
- [server/src/routes/auth.routes.ts:1-12](file://server/src/routes/auth.routes.ts#L1-L12)
- [server/src/controllers/auth.controller.ts:1-50](file://server/src/controllers/auth.controller.ts#L1-L50)
- [server/src/services/auth.service.ts:1-72](file://server/src/services/auth.service.ts#L1-L72)
- [server/src/middleware/auth.ts:1-39](file://server/src/middleware/auth.ts#L1-L39)
- [server/src/utils/password.ts:1-12](file://server/src/utils/password.ts#L1-L12)
- [server/src/utils/token.ts:1-17](file://server/src/utils/token.ts#L1-L17)
- [server/src/config/env.ts:1-12](file://server/src/config/env.ts#L1-L12)
- [prisma/schema.prisma:1-134](file://prisma/schema.prisma#L1-L134)
- [client/src/lib/api.ts:1-36](file://client/src/lib/api.ts#L1-L36)
- [client/src/lib/auth.ts:1-27](file://client/src/lib/auth.ts#L1-L27)
- [client/src/app/login/page.tsx:1-108](file://client/src/app/login/page.tsx#L1-L108)
- [client/src/app/register/page.tsx:1-120](file://client/src/app/register/page.tsx#L1-L120)

**Section sources**
- [server/src/index.ts:1-35](file://server/src/index.ts#L1-L35)
- [server/src/routes/auth.routes.ts:1-12](file://server/src/routes/auth.routes.ts#L1-L12)

## Core Components
- Routes: Define three endpoints:
  - POST /api/auth/register
  - POST /api/auth/login
  - GET /api/auth/me (protected by authentication middleware)
- Controllers: Validate request bodies and delegate to services; handle errors via next().
- Services: Interact with Prisma, hash passwords, compare credentials, and generate JWT tokens.
- Middleware: Extract Authorization header, verify JWT, and attach user payload to request.
- Utilities: Password hashing and comparison; JWT signing and verification.
- Client: Centralized fetch wrapper adds Authorization header automatically; handles 401 responses.

**Section sources**
- [server/src/routes/auth.routes.ts:1-12](file://server/src/routes/auth.routes.ts#L1-L12)
- [server/src/controllers/auth.controller.ts:1-50](file://server/src/controllers/auth.controller.ts#L1-L50)
- [server/src/services/auth.service.ts:1-72](file://server/src/services/auth.service.ts#L1-L72)
- [server/src/middleware/auth.ts:1-39](file://server/src/middleware/auth.ts#L1-L39)
- [server/src/utils/password.ts:1-12](file://server/src/utils/password.ts#L1-L12)
- [server/src/utils/token.ts:1-17](file://server/src/utils/token.ts#L1-L17)
- [client/src/lib/api.ts:1-36](file://client/src/lib/api.ts#L1-L36)

## Architecture Overview
The authentication flow follows a layered architecture:
- HTTP requests reach routes, which call controllers.
- Controllers invoke services for business logic.
- Services use utilities for cryptographic operations and token management.
- Middleware validates tokens for protected routes.
- Client fetch wrapper centralizes request configuration and error handling.

```mermaid
sequenceDiagram
participant Client as "Client"
participant API as "api.ts"
participant Routes as "auth.routes.ts"
participant Ctrl as "auth.controller.ts"
participant Svc as "auth.service.ts"
participant Pass as "password.ts"
participant Tok as "token.ts"
participant Prisma as "Prisma"
Client->>API : "POST /api/auth/register"
API->>Routes : "POST /api/auth/register"
Routes->>Ctrl : "register(req)"
Ctrl->>Svc : "registerUser(fullName,email,password)"
Svc->>Pass : "hashPassword()"
Svc->>Prisma : "create user"
Svc->>Tok : "generateToken()"
Svc-->>Ctrl : "{ token, user }"
Ctrl-->>API : "201 JSON"
API-->>Client : "Response"
Client->>API : "POST /api/auth/login"
API->>Routes : "POST /api/auth/login"
Routes->>Ctrl : "login(req)"
Ctrl->>Svc : "loginUser(email,password)"
Svc->>Prisma : "find user"
Svc->>Pass : "comparePassword()"
Svc->>Tok : "generateToken()"
Svc-->>Ctrl : "{ token, user }"
Ctrl-->>API : "200 JSON"
API-->>Client : "Response"
Client->>API : "GET /api/auth/me (with Bearer)"
API->>Routes : "GET /api/auth/me"
Routes->>Ctrl : "getMe(req)"
Ctrl->>Svc : "getUserById(userId)"
Svc->>Prisma : "find user"
Svc-->>Ctrl : "user"
Ctrl-->>API : "200 JSON"
API-->>Client : "Response"
```

**Diagram sources**
- [server/src/routes/auth.routes.ts:1-12](file://server/src/routes/auth.routes.ts#L1-L12)
- [server/src/controllers/auth.controller.ts:1-50](file://server/src/controllers/auth.controller.ts#L1-L50)
- [server/src/services/auth.service.ts:1-72](file://server/src/services/auth.service.ts#L1-L72)
- [server/src/utils/password.ts:1-12](file://server/src/utils/password.ts#L1-L12)
- [server/src/utils/token.ts:1-17](file://server/src/utils/token.ts#L1-L17)
- [prisma/schema.prisma:47-61](file://prisma/schema.prisma#L47-L61)
- [client/src/lib/api.ts:1-36](file://client/src/lib/api.ts#L1-L36)

## Detailed Component Analysis

### Endpoint: POST /api/auth/register
- Purpose: Register a new user with full name, email, and password.
- Request body:
  - fullName: string (required)
  - email: string (required)
  - password: string (required)
- Validation:
  - Controller checks presence of required fields and returns 400 with error message if missing.
  - Service ensures email uniqueness; throws conflict error if duplicate.
- Processing:
  - Hashes password using bcrypt.
  - Creates user record with default role STUDENT.
  - Generates JWT token with 24-hour expiry.
- Response:
  - 201 Created with JSON containing token and user object (without password hash).
- Security:
  - Passwords are hashed before storage.
  - Token includes id, email, and role claims.

Example curl:
- curl -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d '{"fullName":"Jane Doe","email":"jane@example.com","password":"securepass"}'

JavaScript fetch:
- fetch("http://localhost:3001/api/auth/register", { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({fullName, email, password}) })

Common errors:
- 400 Bad Request: Missing required fields.
- 409 Conflict: Email already registered.

**Section sources**
- [server/src/controllers/auth.controller.ts:5-19](file://server/src/controllers/auth.controller.ts#L5-L19)
- [server/src/services/auth.service.ts:5-33](file://server/src/services/auth.service.ts#L5-L33)
- [server/src/utils/password.ts:1-12](file://server/src/utils/password.ts#L1-L12)
- [server/src/utils/token.ts:10-12](file://server/src/utils/token.ts#L10-L12)
- [prisma/schema.prisma:47-61](file://prisma/schema.prisma#L47-L61)

### Endpoint: POST /api/auth/login
- Purpose: Authenticate an existing user and issue a JWT.
- Request body:
  - email: string (required)
  - password: string (required)
- Validation:
  - Controller checks presence of required fields and returns 400 with error message if missing.
  - Service verifies user existence and password match; throws unauthorized error otherwise.
- Processing:
  - Compares provided password against stored hash.
  - Generates JWT token with 24-hour expiry.
- Response:
  - 200 OK with JSON containing token and user object (without password hash).
- Security:
  - Password comparison uses bcrypt.
  - Token includes id, email, and role claims.

Example curl:
- curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"jane@example.com","password":"securepass"}'

JavaScript fetch:
- fetch("http://localhost:3001/api/auth/login", { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({email, password}) })

Common errors:
- 400 Bad Request: Missing required fields.
- 401 Unauthorized: Invalid credentials.

**Section sources**
- [server/src/controllers/auth.controller.ts:21-35](file://server/src/controllers/auth.controller.ts#L21-L35)
- [server/src/services/auth.service.ts:35-59](file://server/src/services/auth.service.ts#L35-L59)
- [server/src/utils/password.ts:9-11](file://server/src/utils/password.ts#L9-L11)
- [server/src/utils/token.ts:10-12](file://server/src/utils/token.ts#L10-L12)

### Endpoint: GET /api/auth/me
- Purpose: Retrieve currently authenticated user’s profile.
- Authentication:
  - Requires Authorization header with Bearer token.
  - Protected route enforced by middleware.
- Processing:
  - Middleware decodes token and attaches user to request.
  - Controller retrieves user by ID from database.
- Response:
  - 200 OK with user object (without password hash).
- Security:
  - Token verified against secret; invalid/expired tokens return 401.

Example curl:
- curl -X GET http://localhost:3001/api/auth/me -H "Authorization: Bearer eyJhbGciOiJI...aY9KZQ"

JavaScript fetch:
- fetch("http://localhost:3001/api/auth/me", { headers: {"Authorization": "Bearer eyJhbGciOiJI...aY9KZQ"} })

Common errors:
- 401 Unauthorized: Missing or invalid token.
- 404 Not Found: User does not exist.

**Section sources**
- [server/src/routes/auth.routes.ts:9](file://server/src/routes/auth.routes.ts#L9)
- [server/src/middleware/auth.ts:5-22](file://server/src/middleware/auth.ts#L5-L22)
- [server/src/controllers/auth.controller.ts:37-49](file://server/src/controllers/auth.controller.ts#L37-L49)
- [server/src/services/auth.service.ts:61-71](file://server/src/services/auth.service.ts#L61-L71)

### Request/Response Schemas

- POST /api/auth/register
  - Request: { fullName: string, email: string, password: string }
  - Response: { token: string, user: { id: number, fullName: string, email: string, role: string, createdAt: string } }

- POST /api/auth/login
  - Request: { email: string, password: string }
  - Response: { token: string, user: { id: number, fullName: string, email: string, role: string, createdAt: string } }

- GET /api/auth/me
  - Response: { id: number, fullName: string, email: string, role: string, createdAt: string }

- Error response format:
  - { error: string }

Notes:
- All endpoints return JSON.
- Successful responses exclude sensitive fields (e.g., password hash).
- Error responses include a single error field with a descriptive message.

**Section sources**
- [server/src/services/auth.service.ts:24-32](file://server/src/services/auth.service.ts#L24-L32)
- [server/src/services/auth.service.ts:50-58](file://server/src/services/auth.service.ts#L50-L58)
- [server/src/services/auth.service.ts:69-70](file://server/src/services/auth.service.ts#L69-L70)
- [server/src/middleware/errorHandler.ts:7-12](file://server/src/middleware/errorHandler.ts#L7-L12)

### Authentication Header Requirements
- Header: Authorization: Bearer <JWT>
- Middleware behavior:
  - Rejects requests without Authorization header or missing Bearer scheme.
  - Verifies token signature and expiry.
  - Attaches decoded user payload to request for downstream handlers.

Integration pattern (client):
- api.ts automatically adds Authorization header when a token exists in localStorage.
- On 401 responses, api.ts clears token and redirects to login.

**Section sources**
- [server/src/middleware/auth.ts:5-22](file://server/src/middleware/auth.ts#L5-L22)
- [client/src/lib/api.ts:3-35](file://client/src/lib/api.ts#L3-L35)
- [client/src/lib/auth.ts:1-27](file://client/src/lib/auth.ts#L1-L27)

### Security Considerations
- Password hashing:
  - bcrypt is used with a fixed salt round count for hashing and comparison.
- Token lifecycle:
  - JWTs expire after 24 hours; clients should refresh or re-authenticate as needed.
  - Secret key is loaded from environment configuration.
- Session management:
  - Stateless JWTs; no server-side session storage.
  - Client stores token and user in localStorage for convenience.
- Additional recommendations:
  - Enforce HTTPS in production.
  - Rotate JWT secrets regularly.
  - Add rate limiting for login/register endpoints.
  - Consider adding refresh tokens for long-lived sessions.

**Section sources**
- [server/src/utils/password.ts:1-12](file://server/src/utils/password.ts#L1-L12)
- [server/src/utils/token.ts:10-16](file://server/src/utils/token.ts#L10-L16)
- [server/src/config/env.ts:6-11](file://server/src/config/env.ts#L6-L11)
- [client/src/lib/api.ts:20-26](file://client/src/lib/api.ts#L20-L26)

### Common Integration Patterns
- Frontend registration/login:
  - Use form submission to call /api/auth/register or /api/auth/login.
  - Store returned token and user in localStorage.
  - Redirect based on user role.
- Protected routes:
  - Ensure Authorization header is present for all authenticated requests.
  - Handle 401 responses by clearing token and redirecting to login.
- Token persistence:
  - api.ts reads token from localStorage and injects Authorization header automatically.

**Section sources**
- [client/src/app/register/page.tsx:17-36](file://client/src/app/register/page.tsx#L17-L36)
- [client/src/app/login/page.tsx:16-40](file://client/src/app/login/page.tsx#L16-L40)
- [client/src/lib/api.ts:3-35](file://client/src/lib/api.ts#L3-L35)
- [client/src/lib/auth.ts:1-27](file://client/src/lib/auth.ts#L1-L27)

## Dependency Analysis
Key dependencies and relationships:
- Routes depend on controllers.
- Controllers depend on services.
- Services depend on Prisma, password utilities, and token utilities.
- Middleware depends on token utilities and attaches user to request.
- Client fetch wrapper depends on localStorage and environment configuration.

```mermaid
graph LR
Routes["auth.routes.ts"] --> Controllers["auth.controller.ts"]
Controllers --> Services["auth.service.ts"]
Services --> Prisma["Prisma Client"]
Services --> Password["password.ts"]
Services --> Token["token.ts"]
Middleware["auth.ts"] --> Token
ClientAPI["client/api.ts"] --> Routes
ClientAuth["client/auth.ts"] --> ClientAPI
```

**Diagram sources**
- [server/src/routes/auth.routes.ts:1-12](file://server/src/routes/auth.routes.ts#L1-L12)
- [server/src/controllers/auth.controller.ts:1-50](file://server/src/controllers/auth.controller.ts#L1-L50)
- [server/src/services/auth.service.ts:1-72](file://server/src/services/auth.service.ts#L1-L72)
- [server/src/middleware/auth.ts:1-39](file://server/src/middleware/auth.ts#L1-L39)
- [client/src/lib/api.ts:1-36](file://client/src/lib/api.ts#L1-L36)
- [client/src/lib/auth.ts:1-27](file://client/src/lib/auth.ts#L1-L27)

**Section sources**
- [server/src/services/auth.service.ts:1-3](file://server/src/services/auth.service.ts#L1-L3)
- [server/src/utils/password.ts:1-2](file://server/src/utils/password.ts#L1-L2)
- [server/src/utils/token.ts:1-2](file://server/src/utils/token.ts#L1-L2)
- [prisma/schema.prisma:47-61](file://prisma/schema.prisma#L47-L61)

## Performance Considerations
- Password hashing cost:
  - bcrypt salt rounds are fixed; adjust based on hardware capacity if needed.
- Token verification:
  - Keep secret key secure and avoid excessive token issuance.
- Database queries:
  - Ensure indexes exist on frequently queried fields (e.g., email).
- Network overhead:
  - Minimize unnecessary requests; cache user data client-side when appropriate.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- 400 Bad Request during registration/login:
  - Cause: Missing required fields in request body.
  - Fix: Ensure fullName/email/password are provided.
- 409 Conflict on registration:
  - Cause: Email already exists.
  - Fix: Prompt user to log in or use another email.
- 401 Unauthorized on login:
  - Cause: Incorrect email or password.
  - Fix: Verify credentials; ensure password matches stored hash.
- 401 Unauthorized on /api/auth/me:
  - Cause: Missing Authorization header or invalid/expired token.
  - Fix: Re-authenticate to obtain a new token; ensure header format is "Bearer <token>".
- 404 Not Found on /api/auth/me:
  - Cause: User record deleted or ID mismatch.
  - Fix: Re-authenticate; confirm user still exists in database.
- Client-side 401 handling:
  - api.ts clears token and redirects to login; verify localStorage token removal and navigation.

**Section sources**
- [server/src/controllers/auth.controller.ts:9-12](file://server/src/controllers/auth.controller.ts#L9-L12)
- [server/src/controllers/auth.controller.ts:25-28](file://server/src/controllers/auth.controller.ts#L25-L28)
- [server/src/services/auth.service.ts:7-11](file://server/src/services/auth.service.ts#L7-L11)
- [server/src/services/auth.service.ts:37-48](file://server/src/services/auth.service.ts#L37-L48)
- [server/src/services/auth.service.ts:63-67](file://server/src/services/auth.service.ts#L63-L67)
- [server/src/middleware/auth.ts:8-21](file://server/src/middleware/auth.ts#L8-L21)
- [client/src/lib/api.ts:20-26](file://client/src/lib/api.ts#L20-L26)

## Conclusion
The authentication API provides secure, stateless user registration, login, and profile retrieval using bcrypt for password hashing and JWT for session tokens. The client integrates seamlessly with the backend via a centralized fetch wrapper that manages Authorization headers and error handling. Following the documented patterns and security recommendations will help maintain a robust and reliable authentication flow.

[No sources needed since this section summarizes without analyzing specific files]

## Appendices

### Endpoint Reference Summary
- POST /api/auth/register
  - Body: { fullName, email, password }
  - Responses: 201 (token, user), 400 (validation), 409 (duplicate)
- POST /api/auth/login
  - Body: { email, password }
  - Responses: 200 (token, user), 400 (validation), 401 (invalid credentials)
- GET /api/auth/me
  - Headers: Authorization: Bearer <token>
  - Responses: 200 (user), 401 (missing/invalid token), 404 (not found)

**Section sources**
- [server/src/routes/auth.routes.ts:7-9](file://server/src/routes/auth.routes.ts#L7-L9)
- [server/src/controllers/auth.controller.ts:5-19](file://server/src/controllers/auth.controller.ts#L5-L19)
- [server/src/controllers/auth.controller.ts:21-35](file://server/src/controllers/auth.controller.ts#L21-L35)
- [server/src/controllers/auth.controller.ts:37-49](file://server/src/controllers/auth.controller.ts#L37-L49)
- [server/src/middleware/auth.ts:5-22](file://server/src/middleware/auth.ts#L5-L22)