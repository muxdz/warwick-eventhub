# Warwick EventHub

EventHub lets students discover society events, register and log in, manage their
profile and password, bookmark events, and manage societies and events according
to their membership role. See the [product brief](docs/product-brief.md).

## Architecture

`frontend/` is a Next.js App Router application using React and TypeScript.
Browser requests go to the FastAPI JSON API in `backend/app/`. The API uses
Pydantic validation, JWT authentication, Argon2 password hashing, and psycopg to
access PostgreSQL. Alembic owns schema changes in `backend/migrations/`.
Python runtime and test dependencies live in `backend/requirements.txt` and
`backend/requirements-dev.txt`; Node dependencies are locked by `package-lock.json`.

## Prerequisites and environment

Use Python 3.14, Node.js 22.22.2 or newer in the 22.x line (with npm), Docker Engine with Compose v2, and Git.
Run the following from the repository root of a fresh clone:

```bash
cp .env.example .env
cp .env.test.example .env.test
cp backend/.env.example backend/.env
cp backend/.env.test.example backend/.env.test
cp backend/.env.e2e.example backend/.env.e2e
cp frontend/.env.example frontend/.env.local
python3 -m venv backend/.venv
backend/.venv/bin/python -m pip install -r backend/requirements-dev.txt
cd frontend
npm ci
npx playwright install --with-deps chromium
cd ..
```

On Linux, `--with-deps` installs system libraries and may request sudo. If those
libraries are already installed, use `npx playwright install chromium` instead.

Examples contain local-only credentials. Replace passwords and generate a unique
JWT secret before deployment. Never commit real environment files.

| Variable | Purpose |
| --- | --- |
| `ENV_FILE` | Backend dotenv path, relative to the current directory; defaults to `.env` |
| `ENVIRONMENT` | Development, test, e2e, or production; production validates JWT secret strength |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Backend PostgreSQL connection |
| `DB_CONNECT_TIMEOUT`, `DB_SSL_MODE` | Connection timeout in seconds and psycopg SSL mode |
| `JWT_SECRET_KEY`, `JWT_EXPIRE_MINUTES` | Token signing secret and lifetime |
| `CORS_ORIGIN` | Allowed browser origin, locally `http://localhost:3000` |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Docker database initialization (root `.env`) |
| `NEXT_PUBLIC_API_URL` | Browser API URL, locally `http://localhost:8000`; embedded at frontend build time |

The backend currently loads the selected dotenv file with override enabled, so
its values take precedence over existing shell variables. Select the correct
file explicitly. Host backend connections use port 5433 for development and
5544 for verification. Docker backend connections use service names and port 5432.

## Backend and frontend development

```bash
docker compose up -d --wait db
cd backend
ENV_FILE=.env .venv/bin/alembic upgrade head
ENV_FILE=.env .venv/bin/uvicorn app.main:app --reload
```

In another terminal, from the repository root:

```bash
cd frontend
npm run dev
```

Open `http://localhost:3000`; API docs are at `http://localhost:8000/docs`, and
`/health` provides the API health check. Stop servers with Ctrl-C.

## Docker

`docker compose up --build -d api` builds the backend, waits for PostgreSQL,
runs Alembic, then starts FastAPI on port 8000. Run the frontend separately as
above. Do not start host FastAPI on the same port at the same time.
`docker compose down` stops this stack, preserving its named database volumes.
Root `.env` configures Docker; `backend/.env` configures host Python commands.

The optional container test runner uses its own database:

```bash
docker compose --profile test run --build --rm tests
```

## Clean database, migrations, and pytest

The verification stack is separate from development. It exposes PostgreSQL on
5544 and uses disposable tmpfs storage, with no development volume attached.
Run these steps once after starting a fresh verification container:

```bash
docker compose -p eventhub-verify -f compose.verify.yaml up -d --wait
docker compose -p eventhub-verify -f compose.verify.yaml exec -T db createdb -U example_user eventhub_test
docker compose -p eventhub-verify -f compose.verify.yaml exec -T db createdb -U example_user eventhub_e2e
cd backend
ENV_FILE=.env.test .venv/bin/alembic upgrade head
ENV_FILE=.env.test .venv/bin/alembic current --check-heads
ENV_FILE=.env.test .venv/bin/python -m pytest
cd ..
```

`current --check-heads` must succeed and display `(head)`. pytest refuses any
database name other than `eventhub_test` and resets fixtures between tests.
For a brand-new migration smoke test, stop and remove **only** the verification
stack with the cleanup command below, then repeat this section. Normal schema
updates use `alembic upgrade head` with the intended `ENV_FILE` selected.

## Frontend gate and reproducible production E2E

Stop development FastAPI and Next.js first (including `docker compose stop api`
if using Docker). Ports 8000 and 3000 must be free. With FastAPI stopped:

```bash
cd frontend
npm ci
npm run lint
npm run test:run
npm run build
npm audit
cd ..
```

A production build must succeed without FastAPI running. To serve it manually,
run `npm start` inside `frontend/` (stop it before the automated E2E command).
After creating the verification databases above, run from the repository root:

```bash
bash scripts/e2e.sh
```

This checks that `.env.e2e` selects **eventhub_e2e** and port 8000 is free,
upgrades its schema, runs `ENV_FILE=.env.e2e python -m scripts.seed_e2e` using the
fresh virtual environment, starts FastAPI, waits for health, then runs
`npm run e2e`. Playwright starts `npm start` and refuses to reuse an existing
frontend. Both servers are stopped afterwards, including on failure.

The seed truncates E2E data and resets IDs. It independently refuses any database
other than `eventhub_e2e`. Never point E2E at `eventhub`. The fixture organiser is
`e2e-organiser@example.com` / `E2ETestPassword123!`; seeded events include
“E2E Cloud Workshop” at Oculus. Rerunning the script resets this data deterministically.
To reset/seed without starting servers:

```bash
cd backend
ENV_FILE=.env.e2e .venv/bin/python -m scripts.seed_e2e
cd ..
```

Remove the disposable verification databases when finished:

```bash
docker compose -p eventhub-verify -f compose.verify.yaml down
```

## CI and the clean-clone gate

`.github/workflows/ci.yml` runs backend migration/pytest, frontend lint/Vitest/
build/audit, and production Playwright jobs on pushes and pull requests. Each
backend job gets a fresh PostgreSQL service. CI performs no deployment.

Before AWS, clone into a new directory and follow this README from prerequisites
through E2E. Do not copy `.venv`, `node_modules`, `.next`, environment files, or
database state. Finish with these repository checks (both file searches should
print nothing):

```bash
git ls-files | grep -E 'coverage|test-results|playwright-report'
git ls-files | grep -E '(^|/)\.env($|\.test$|\.e2e$)'
git status --short
```

## Authentication rate limits

Login and registration each allow 10 POST requests per IP in a rolling 60-second
window, including failed attempts. Further attempts return 429 and `Retry-After`.
Counters are in memory and reset on restart. Before multiple workers or replicas,
use shared counters; behind a proxy, trust forwarded headers only from that proxy.
Passing local/CI checks is a pre-deployment gate, not a claim of public production readiness.
