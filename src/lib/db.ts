import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

type GlobalWithPool = typeof globalThis & {
  __nsJewelsPgPool?: Pool;
};

const globalWithPool = globalThis as GlobalWithPool;

function createPool(): Pool {
  if (!databaseUrl?.trim()) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and run npm run db:up.",
    );
  }
  return new Pool({
    connectionString: databaseUrl,
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 30_000,
    max: 10,
  });
}

/** Singleton pool — reuse connections across requests (Next.js dev HMR safe). */
export function getPool(): Pool {
  globalWithPool.__nsJewelsPgPool ??= createPool();
  return globalWithPool.__nsJewelsPgPool;
}
