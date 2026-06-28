## Build System Overview

The BuddyAI repository uses a **monorepo-style orchestration** approach centered around a root-level `package.json` that coordinates three independent services: a Next.js client, an Express/TypeScript API server, and a Python FastAPI NLP service. There is no dedicated build tool like Make, CMake, or Turborepo — instead, npm scripts serve as the primary build orchestrator.

## Key Components

### Root-Level Orchestration (`package.json`)
The root `package.json` defines composite scripts that delegate to subdirectories:
- **`npm run dev`**: Uses `concurrently` to launch all three services in parallel with color-coded output (server=blue, client=green, nlp=yellow)
- **`npm run build`**: Sequentially builds the server (`tsc`) then the client (`next build`)
- **`npm run setup`**: Installs dependencies across all three services in one command (npm for JS/TS, pip for Python)
- **Database management**: Prisma CLI commands for migrations, client generation, and Studio UI

### Service-Specific Build Configurations

**Client (Next.js)**
- Build tool: Next.js built-in compiler (`next build`)
- TypeScript config: `noEmit: true` (Next.js handles compilation), module resolution set to `bundler`
- Linting: ESLint with `eslint-config-next`
- Output: `.next/` directory (standard Next.js build artifact)

**Server (Express + TypeScript)**
- Build tool: TypeScript compiler (`tsc`)
- Output: Compiled JavaScript to `dist/` directory
- Development: `nodemon` with `ts-node` for hot-reload during development
- Testing: Vitest with globals enabled, 10s timeout, Node environment
- Entry point: `dist/index.js` (compiled output)

**NLP Service (Python/FastAPI)**
- No formal build step — runs directly via `python main.py` or `uvicorn main:app`
- Dependencies managed via `requirements.txt` (pip)
- NLTK data pre-downloaded into `nltk_data/` directory (stopwords, VADER lexicon, punkt tokenizer)

### Database Layer
- **Prisma ORM** serves as the shared data model across services
- Schema defined at root level: `prisma/schema.prisma`
- Migrations and client generation executed from root via `npx prisma`
- PostgreSQL 16 (Alpine) containerized via `docker-compose.yml`

### Containerization
- **Docker Compose** only manages the PostgreSQL database (`postgres:16-alpine`)
- No Dockerfiles exist for the application services themselves
- Database persists via named volume `postgres_data`
- Port 5432 exposed for local development access

## Architecture Decisions

1. **Loose monorepo coupling**: Each service maintains its own `package.json`, `node_modules`, and build pipeline. The root only orchestrates lifecycle commands.
2. **No CI/CD configuration**: No `.github/workflows/`, GitLab CI, or other pipeline definitions found in the repository.
3. **No containerized application builds**: Services are not Dockerized; only the database runs in a container.
4. **Sequential build order**: Server builds before client, reflecting dependency direction (client consumes server APIs).
5. **Environment configuration**: `.env`, `.env.example` at root; `.env.local` in client; `.env` in server — suggesting per-service environment isolation.

## Developer Conventions

- **Single entry point for development**: Run `npm run dev` from root to start all services
- **Dependency installation**: Use `npm run setup` from root rather than installing per-service manually
- **Database operations**: All Prisma commands execute from root with `--schema prisma/schema.prisma` flag
- **Testing**: Only the server has a test suite (Vitest); run via `npm test` from `server/` directory
- **No versioning strategy**: Root package is `1.0.0`, client is `0.1.0`, server is `1.0.0` — inconsistent versioning suggests independent release cycles are not yet formalized
- **Build artifacts**: Server outputs to `dist/`, client to `.next/` — both gitignored per standard conventions

## Gaps & Limitations

- No CI/CD pipeline configuration
- No Dockerfiles for application services (only database)
- No Makefile or shell scripts for complex build workflows
- No release automation or version bumping strategy
- No linting or formatting enforcement at the monorepo level (only client has ESLint configured)
- NLP service has no test framework configured