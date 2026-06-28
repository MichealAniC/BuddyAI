## Configuration Approach

The BuddyAI platform uses a **dotenv-based environment variable system** for runtime configuration across its three services (Next.js client, Node.js API server, Python NLP service). There is no centralized configuration framework or YAML/TOML files — configuration is managed through `.env` files and environment variables.

## Key Files and Packages

### Root-Level Configuration
- **`.env.example`** — Documents the required environment variables for the server: `DATABASE_URL`, `JWT_SECRET`, `NLP_SERVICE_URL`, `PORT`
- **`docker-compose.yml`** — Defines PostgreSQL database credentials (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) as Docker environment variables, decoupled from application `.env` files

### Server Configuration (`server/`)
- **`server/src/config/env.ts`** — Central configuration module that loads `.env` via `dotenv` and exports a typed `config` object with defaults:
  - `port`: parsed integer from `PORT` (default: `3001`)
  - `databaseUrl`: from `DATABASE_URL` (required, no fallback)
  - `jwtSecret`: from `JWT_SECRET` (fallback: `'dev-secret'`)
  - `nlpServiceUrl`: from `NLP_SERVICE_URL` (fallback: `'http://localhost:8001'`)
- **`server/.env`** — Actual runtime values for local development
- **`server/src/config/prisma.ts`** — Instantiates PrismaClient; reads `DATABASE_URL` from environment via Prisma's built-in `env()` function in `schema.prisma`
- **`prisma/schema.prisma`** — Declares `datasource db { url = env("DATABASE_URL") }`, linking ORM configuration to the same environment variable

### Client Configuration (`client/`)
- **`client/.env.local`** — Contains `NEXT_PUBLIC_API_URL=http://localhost:3001`, which Next.js exposes to the browser at build time. The `NEXT_PUBLIC_` prefix is required for client-side access.
- **`client/next.config.ts`** — Minimal config; no custom environment mapping or rewrites defined

### NLP Service Configuration (`nlp-service/`)
- **`nlp-service/main.py`** — Reads `NLP_PORT` from environment with default `8001` via `os.getenv("NLP_PORT", "8001")`. No dedicated config file; NLTK data path is derived from the script's directory location.

## Architecture and Conventions

### Layering Strategy
1. **Docker Compose layer**: Infrastructure-level config (database credentials) lives in `docker-compose.yml` under `environment:` keys
2. **Application layer**: Each service reads its own `.env` file independently
3. **Code layer**: Server centralizes config in `server/src/config/env.ts`; client and NLP service read env vars directly

### Design Decisions
- **No shared config package**: Each service manages its own environment variables independently. Cross-service URLs (e.g., `NLP_SERVICE_URL`, `NEXT_PUBLIC_API_URL`) are duplicated across `.env` files rather than sourced from a single manifest.
- **Fallbacks for development**: The server config provides safe defaults for `jwtSecret` and `nlpServiceUrl` to enable out-of-the-box local development, but `DATABASE_URL` has no fallback (will fail if unset).
- **Prisma integrates with env**: The Prisma schema uses `env("DATABASE_URL")` natively, avoiding the need to pass the URL through the TypeScript config layer.
- **NLTK data is self-contained**: The NLP service downloads and caches NLTK resources in a local `nltk_data/` directory at startup, configured via filesystem path derivation rather than environment variables.

### Security Considerations
- `.env` files are gitignored (via `.gitignore`), but `.env.example` serves as documentation
- The `JWT_SECRET` in `server/.env` contains a warning comment (`change-in-production`), indicating manual rotation is expected
- CORS in the NLP service allows all origins (`"*"`), suitable for development but not production

## Rules Developers Should Follow

1. **Add new env vars to `.env.example`**: Any new configuration variable must be documented in the root `.env.example` file with a placeholder value.
2. **Use `NEXT_PUBLIC_` prefix for client-side vars**: Only variables prefixed with `NEXT_PUBLIC_` in `client/.env.local` are accessible in browser code.
3. **Centralize server config in `env.ts`**: All server-side environment variable access should go through `server/src/config/env.ts` rather than reading `process.env` directly in controllers or services.
4. **Keep `.env` files out of version control**: Never commit actual `.env` files; use `.env.example` as the template for new developers.
5. **Sync cross-service URLs**: When changing service ports or hosts, update both `NLP_SERVICE_URL` in `server/.env` and `NEXT_PUBLIC_API_URL` in `client/.env.local` consistently.
6. **Use Docker Compose for infrastructure config**: Database credentials should remain in `docker-compose.yml`; do not duplicate them in application `.env` files unless needed for direct local runs without Docker.