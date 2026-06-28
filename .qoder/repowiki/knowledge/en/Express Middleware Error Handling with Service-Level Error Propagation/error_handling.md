## Overview

The BuddyAI platform uses a centralized Express middleware-based error handling pattern in the server, combined with direct HTTP status responses in controllers and service-layer error throwing. The NLP service (FastAPI) uses framework-native `HTTPException` for error propagation.

## Server-Side Error Handling (Node.js/Express)

### Centralized Error Handler

**File: `server/src/middleware/errorHandler.ts`**

A single Express error-handling middleware captures all errors passed via `next(err)`:

```typescript
export interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(err: AppError, _req: Request, res: Response, _next: NextFunction): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ error: message });
}
```

Key characteristics:
- Errors are typed as `AppError` — standard `Error` objects optionally augmented with a `statusCode` property
- Default status code is `500` if not specified
- Default message is `'Internal Server Error'` if not present
- Response format is always `{ error: string }`
- Registered last in the middleware chain in `server/src/index.ts` via `app.use(errorHandler)`

### Controller Pattern: Try/Catch with next(err)

All controllers follow a consistent pattern:

1. Wrap logic in `try/catch`
2. Perform inline validation checks that return early with `res.status(code).json({ error: ... })`
3. Delegate business logic to services
4. Catch errors and forward them via `next(err)` to the centralized handler

Example from `server/src/controllers/auth.controller.ts`:

```typescript
export async function register(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      res.status(400).json({ error: 'fullName, email, and password are required.' });
      return;
    }
    const result = await authService.registerUser(fullName, email, password);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}
```

This pattern appears consistently across all controllers (`auth`, `chat`, `risk`, `assessment`, `mood`, `alert`, `dashboard`).

### Service-Layer Error Throwing

Services throw errors with attached `statusCode` properties using two patterns:

**Pattern 1: Augmented Error object**
```typescript
const error: Error & { statusCode?: number } = new Error('Email already registered.');
error.statusCode = 409;
throw error;
```

**Pattern 2: Object.assign shorthand**
```typescript
throw Object.assign(new Error('Conversation not found'), { statusCode: 404 });
```

Both patterns appear in `server/src/services/` files. Common status codes used:
- `401` — Invalid credentials, authentication failures
- `404` — Resource not found (user, conversation)
- `409` — Conflict (duplicate email registration)

### Authentication Middleware

**File: `server/src/middleware/auth.ts`**

The auth middleware handles its own errors directly (does NOT use `next(err)`):

- Missing or malformed token → `res.status(401).json({ error: 'Access denied. No token provided.' })`
- Invalid/expired token → `res.status(401).json({ error: 'Invalid or expired token.' })`
- Insufficient role permissions → `res.status(403).json({ error: 'Access denied. Insufficient permissions.' })`

This is an intentional deviation: auth failures are handled inline because they are expected control-flow outcomes, not exceptional errors.

### External Service Error Handling

In `server/src/services/chat.service.ts`, calls to the NLP service are wrapped in try/catch with graceful degradation:

```typescript
try {
  const nlpResult = await analyzeSentiment(messageText);
  sentiment = mapSentiment(nlpResult.sentiment);
  sentimentScore = nlpResult.compound_score;
} catch (error) {
  console.error('NLP service unavailable:', error);
}
```

If the NLP service fails, the system continues with default values rather than propagating the error to the client.

## Client-Side Error Handling (Next.js)

**File: `client/src/lib/api.ts`**

The client uses a centralized `apiRequest` helper that:

1. Attaches JWT tokens from localStorage automatically
2. Handles `401` responses by clearing the token and redirecting to `/login`
3. Throws `Error` with the server's error message for non-ok responses

```typescript
if (response.status === 401) {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  throw new Error('Unauthorized');
}

const data = await response.json();
if (!response.ok) {
  throw new Error(data.error || 'Request failed');
}
```

Client components must wrap `apiRequest` calls in try/catch blocks to handle errors. There is no global React error boundary or toast notification system visible in the codebase.

## NLP Service Error Handling (Python/FastAPI)

**File: `nlp-service/main.py`**

The FastAPI service uses framework-native error handling:

```python
@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_text(request: AnalyzeRequest):
    try:
        processed_text = processor.preprocess(request.text)
        if not processed_text:
            processed_text = request.text.lower()
        result = analyzer.analyze(processed_text)
        return AnalyzeResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
```

- All exceptions are caught and re-raised as `HTTPException` with status `500`
- NLTK download failures during startup are logged as warnings but do not crash the service
- No custom error types or structured error responses beyond FastAPI defaults

## Conventions and Rules for Developers

1. **Server controllers**: Always wrap async logic in `try/catch` and forward errors via `next(err)`. Use inline `res.status().json()` only for input validation failures.

2. **Server services**: Throw errors with `statusCode` attached. Use either the augmented-error pattern or `Object.assign` — both are acceptable.

3. **Auth middleware**: Handle auth failures inline with direct `res.status()` responses. Do NOT use `next(err)` for expected auth failures.

4. **External service calls**: Wrap in try/catch with graceful degradation when possible. Log errors but continue operation if the failure is non-critical.

5. **Client API calls**: Use the `apiRequest` helper. Handle thrown errors in component-level try/catch blocks. Expect `{ error: string }` response format from the server.

6. **Error response format**: Always `{ error: string }` on the server side. The client extracts `data.error` for user-facing messages.

7. **No custom error classes**: The codebase does not define custom error subclasses. All errors are plain `Error` objects with optional `statusCode` augmentation.

8. **No panic/recover pattern**: Neither the Node.js nor Python services implement panic/recover or unhandled exception handlers beyond the middleware layer.
