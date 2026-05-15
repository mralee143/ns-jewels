import { config } from "dotenv";
import { defineConfig } from "prisma/config";

import { resolveMysqlDatabaseUrl } from "./src/lib/resolve-mysql-database-url";

config();
config({ path: ".env.local", override: true });

const databaseUrl = resolveMysqlDatabaseUrl();

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
