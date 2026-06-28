## Overview

The BuddyAI repository uses a **monorepo-style dependency orchestration** pattern across three independent services (Next.js client, Node.js/Express server, Python NLP service), each with its own package manager and lockfile strategy. A root-level `package.json` provides unified lifecycle scripts that coordinate installation and execution across all services.

## Systems and Tools

### JavaScript/TypeScript Services (npm)
- **Package Manager**: npm (v10+ implied by `package-lock.json` presence)
- **Lockfiles**: Three separate `package-lock.json` files exist at root, `client/`, and `server/` levels
- **No yarn/pnpm**: Despite `.gitignore` entries referencing `.yarn/` and `.pnpm-debug.log*`, the project exclusively uses npm

### Python Service (pip)
- **Package Manager**: pip via `requirements.txt`
- **No lockfile**: The `nlp-service/requirements.txt` lists dependencies without version pinning (bare package names like `fastapi`, `uvicorn[standard]`, `nltk`)
- **Root requirements.txt**: A comprehensive 68-line file exists at repo root but appears unused by any active service — it contains broader dependencies (sqlalchemy, pytest, black, isort) not referenced in `nlp-service/requirements.txt`

### Prisma ORM (Shared Data Layer)
- **Version mismatch**: Root `package.json` declares `@prisma/client@^6.19.3` and `prisma@^6.19.3`, while `server/package.json` pins `@prisma/client@^6.10.1` and `prisma@^6.10.1`. This creates potential schema/client generation conflicts.
- **Centralized schema**: Single `prisma/schema.prisma` at repo root, managed via root-level npm scripts (`db:migrate`, `db:generate`, `db:studio`)

## Key Files

| File | Purpose |
|------|---------|
| `package.json` (root) | Orchestrates multi-service dev/build/start workflows via `concurrently`; defines shared Prisma dependencies |
| `client/package.json` | Next.js frontend dependencies (react 19.2.4, next 16.2.9, tailwindcss 4) |
| `server/package.json` | Express API dependencies (express 4.21.2, bcrypt, jsonwebtoken, vitest for testing) |
| `nlp-service/requirements.txt` | Python NLP service dependencies (fastapi, uvicorn, nltk, pydantic) |
| `requirements.txt` (root) | Unused comprehensive Python dependency list — likely legacy or template |
| `docker-compose.yml` | Defines PostgreSQL 16-alpine as external infrastructure dependency |

## Architecture and Conventions

### Installation Strategy
The root `setup` script chains installations sequentially:
```bash
npm install && cd server && npm install && cd ../client && npm install && cd ../nlp-service && pip install -r requirements.txt
```
This assumes developers run `npm run setup` from the repo root to bootstrap all services.

### Version Pinning Approach
- **Client**: Uses exact versions for core deps (`next: "16.2.9"`, `react: "19.2.4"`) but caret ranges for devDependencies (`^4`, `^20`, `^19`, `^5`)
- **Server**: All dependencies use caret ranges (`^6.10.1`, `^5.1.1`, `^2.8.5`), allowing minor/patch updates
- **NLP Service**: No version constraints at all — bare package names mean `pip install` resolves to latest compatible versions, creating reproducibility risks

### Vendoring and Caching
- **NLTK data vendored**: The `nlp-service/nltk_data/` directory contains pre-downloaded corpora (stopwords for 30+ languages, VADER lexicon, punkt tokenizers). This is explicitly gitignored at root level but committed in the tree, suggesting intentional offline capability
- **node_modules excluded**: Standard npm practice; all three `.gitignore` files exclude `node_modules/`
- **Python caches excluded**: `__pycache__/` and `*.pyc` ignored across root and nlp-service

### Environment Configuration
- `.env.example` at root provides template; actual `.env` files are gitignored per service
- No `.env.local` tracking strategy documented beyond standard Next.js conventions in client

## Rules Developers Should Follow

1. **Always use `npm run setup` for initial installation** — do not manually `cd` into subdirectories and run `npm install` or `pip install` independently, as this may create version drift

2. **Do not add dependencies to root `package.json`** unless they are truly shared across services (currently only Prisma and `concurrently`). Service-specific dependencies belong in their respective `package.json` or `requirements.txt`

3. **Pin Python dependency versions** — The `nlp-service/requirements.txt` should adopt explicit version constraints (e.g., `fastapi==0.115.0`) or migrate to `pip-tools`/`poetry` for reproducible builds. Current bare package names risk CI/production environment divergence

4. **Resolve Prisma version conflict** — Align `@prisma/client` and `prisma` versions between root (`^6.19.3`) and server (`^6.10.1`) to prevent schema generation mismatches. The root-level Prisma scripts assume a single authoritative version

5. **Do not commit `nltk_data/` changes casually** — The vendored NLTK corpora are large binary assets. Updates should be deliberate and documented, as they affect sentiment analysis behavior

6. **Use root-level scripts for cross-service operations** — `npm run dev`, `npm run build`, and `npm run start` orchestrate all three services via `concurrently`. Direct service invocation bypasses this coordination

7. **Ignore the root `requirements.txt`** — This file appears orphaned and is not referenced by any active service or script. Adding Python dependencies here has no effect on the running system

8. **Lockfile discipline** — Commit `package-lock.json` files for all three npm workspaces. Do not delete or regenerate them without testing, as they ensure deterministic installs across environments
