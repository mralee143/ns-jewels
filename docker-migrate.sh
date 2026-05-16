#!/usr/bin/env bash
# Run Prisma migrations against the DB from your shell env (.env / .env.prod).
# On the server: exec into the app container or run a one-off with the same env as production.
set -euo pipefail

export DATABASE_URL="$(node scripts/resolve-database-url.mjs)"
echo "Target: $(node -e "const u=new URL(process.env.DATABASE_URL); console.log(u.hostname+'/'+u.pathname.slice(1))")"
echo "Applying migrations…"
npx prisma migrate deploy
echo "Done. Optional admin user: npm run db:seed"
