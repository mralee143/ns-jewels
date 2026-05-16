#!/usr/bin/env sh
set -eu

db_host_for_wait() {
  if [ -n "${DB_HOST:-}" ]; then
    printf '%s' "$DB_HOST"
    return
  fi
  if [ -n "${DATABASE_URL:-}" ]; then
    node -e "
      const u = new URL(process.env.DATABASE_URL);
      process.stdout.write(u.hostname);
    "
    return
  fi
  printf '%s' "localhost"
}

wait_for_postgres() {
  host="$(db_host_for_wait)"
  port="${DB_PORT:-5432}"
  if [ -n "${DATABASE_URL:-}" ] && [ -z "${DB_HOST:-}" ]; then
    port="$(node -e "
      const u = new URL(process.env.DATABASE_URL);
      process.stdout.write(u.port || '5432');
    ")"
  fi

  echo "Waiting for PostgreSQL at ${host}:${port}…"
  attempts=0
  max_attempts=30
  while [ "$attempts" -lt "$max_attempts" ]; do
    if nc -z "$host" "$port" 2>/dev/null; then
      echo "PostgreSQL is reachable."
      return 0
    fi
    attempts=$((attempts + 1))
    sleep 2
  done
  echo "PostgreSQL not reachable at ${host}:${port} after ${max_attempts} attempts." >&2
  exit 1
}

export_database_url() {
  DATABASE_URL="$(node /app/scripts/resolve-database-url.mjs)"
  export DATABASE_URL
  host="$(node -e "const u=new URL(process.env.DATABASE_URL); process.stdout.write(u.hostname)")"
  db="$(node -e "const u=new URL(process.env.DATABASE_URL); process.stdout.write(u.pathname.replace(/^\\//,''))")"
  echo "Database target: host=${host} database=${db}"
}

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  export_database_url
  wait_for_postgres
  echo "Applying Prisma migrations…"
  node ./node_modules/prisma/build/index.js migrate deploy
  echo "Migrations applied."
else
  echo "Skipping migrations (RUN_MIGRATIONS=${RUN_MIGRATIONS})."
fi

exec "$@"
