#!/usr/bin/env bash
set -euo pipefail

psql -h localhost -p 5432 -U postgres -d postgres \
  -c "DROP DATABASE IF EXISTS eventhub_test WITH (FORCE);"

psql -h localhost -p 5432 -U postgres -d postgres \
  -c "CREATE DATABASE eventhub_test;"

ENV_FILE=.env.test docker compose run --rm migrate alembic upgrade head
ENV_FILE=.env.test docker compose run --rm migrate alembic current