import { config } from "dotenv";
import { defineConfig } from "prisma/config";

import { resolveDatabaseUrl } from "./src/lib/resolve-database-url";

config();
config({ path: ".env.local", override: true });
// Do not override shell/Docker env (e.g. DB_HOST=76.13.152.159 for remote migrate).
config({ path: ".env.prod", override: false });

const databaseUrl = resolveDatabaseUrl();

if (!databaseUrl?.trim()) {
  throw new Error(
    "Prisma: set DATABASE_URL, or set DB_HOST, DB_USER, DB_NAME (and optional DB_PORT, DB_PASSWORD) in .env / .env.local.",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
