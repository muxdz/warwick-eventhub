#!/usr/bin/env bash

set -euo pipefail

EXPECTED_DB="eventhub_test"

ACTUAL_DB=$(docker compose run --rm --entrypoint sh tests -c 'printf "%s" "$DB_NAME"')

if [ "$ACTUAL_DB" != "$EXPECTED_DB" ]; then
    echo "ERROR: Refusing to run migration smoke test against '$ACTUAL_DB'"
    exit 1
fi

echo "Recreating $EXPECTED_DB..."

docker compose exec -T db-test \
    psql -U postgres -d postgres \
    -c "DROP DATABASE IF EXISTS eventhub_test WITH (FORCE);"

docker compose exec -T db-test \
    psql -U postgres -d postgres \
    -c "CREATE DATABASE eventhub_test;"

echo "Running Alembic migrations..."

docker compose run --rm tests alembic upgrade head

echo "Checking Alembic revision..."

docker compose run --rm tests alembic current

echo "Migration smoke test passed."