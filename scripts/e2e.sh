#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$PWD"
PYTHON="$ROOT/backend/.venv/bin/python"
# Check configuration and reserve the API port before any database mutation.
cd backend
ENV_FILE=.env.e2e "$PYTHON" - <<'CHECK'
import socket
from app.config import settings
if settings.db_name != "eventhub_e2e":
    raise SystemExit("E2E requires DB_NAME=eventhub_e2e")
with socket.socket() as sock:
    sock.bind(("127.0.0.1", 8000))
CHECK
ENV_FILE=.env.e2e "$PYTHON" -m alembic upgrade head
ENV_FILE=.env.e2e "$PYTHON" -m scripts.seed_e2e
ENV_FILE=.env.e2e "$PYTHON" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 &
API_PID=$!
trap 'kill "$API_PID" 2>/dev/null || true; wait "$API_PID" 2>/dev/null || true' EXIT
"$PYTHON" - <<'WAIT'
import time
import urllib.request
for _ in range(60):
    try:
        urllib.request.urlopen("http://localhost:8000/health", timeout=1)
        break
    except OSError:
        time.sleep(1)
else:
    raise SystemExit("FastAPI did not become healthy")
WAIT
cd "$ROOT/frontend"
npm run e2e
