# Pre-AWS verification — 7 September 2026

Verified application/configuration commit: `df68323`, on
`chore/repository-cleanup`. The subsequent documentation commit records these
results without changing application behavior.

A separate `git clone --no-local` in `/tmp/eventhub-clean-check` used fresh Python
and Node installations, environment files copied only from tracked examples,
and newly created databases. No `.venv`, `node_modules`, `.next`, or database
state was copied from the working repository. Package download and Docker image
layer caches were allowed. Final frontend checks used Node 22.22.2; Python was
3.14.4 and PostgreSQL was 18.

| Gate | Result |
| --- | --- |
| Python virtual environment and requirements-dev install | Passed |
| New `eventhub_test`: Alembic upgrade and current --check-heads | `7b89731366bd (head)` |
| Host pytest | 116 passed |
| Docker image build and container pytest | Passed; 116 tests |
| Fresh Docker database → migration → API startup | Passed; `/health` and `/ready` returned 200 |
| npm ci | Passed |
| ESLint | Passed |
| Vitest | 42 tests passed across 6 files |
| Production build, FastAPI stopped and `.next` deleted | Passed |
| Production `npm start` and Playwright | 7 passed |
| Repeated E2E migrate/reset/seed/server/test sequence | 7 passed again |
| E2E seed against `eventhub_test` | Refused before mutation, as intended |
| npm audit (including development dependencies) | 0 vulnerabilities |
| Tracked coverage/test-results/playwright-report search | No matches |
| Tracked real `.env`, `.env.test`, `.env.e2e` search | No matches |
| Clean-clone Git status after tests | Clean |

The experiment exposed missing backend settings in environment examples and a
Compose profile indentation error; both were corrected and the affected checks
rerun. The host initially had Node 22.22.1, below jsdom's declared minimum, so the
final frontend gate and E2E were rerun on 22.22.2. Playwright's privileged Linux
dependency installation could not authenticate sudo; existing OS libraries were
sufficient with `npx playwright install chromium`, now documented in the README.

Non-failing upstream deprecation notices remain in the Python test client and
frontend toolchain. GitHub-hosted Actions execution has not been observed: the
workflow is committed locally and will run after pushing. No deployment was
performed. These checks establish the local pre-AWS gate, not public production
readiness.
