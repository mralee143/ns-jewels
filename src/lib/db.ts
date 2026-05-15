import { resolveDatabaseUrl } from "@/lib/resolve-database-url";

export class DatabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseConfigError";
  }
}

export function getDatabaseUrl(): string {
  const databaseUrl = resolveDatabaseUrl();

  if (!databaseUrl?.trim()) {
    throw new DatabaseConfigError(
      "Set DATABASE_URL or DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME for PostgreSQL.",
    );
  }

  let url: URL;

  try {
    url = new URL(databaseUrl);
  } catch {
    throw new DatabaseConfigError(
      "DATABASE_URL must be a PostgreSQL URL like postgresql://user:password@host:5432/database.",
    );
  }

  if (url.protocol !== "postgresql:" && url.protocol !== "postgres:") {
    throw new DatabaseConfigError(
      "DATABASE_URL must use the postgresql:// scheme.",
    );
  }

  if (!url.hostname || !url.username || !url.pathname.replace(/^\//, "")) {
    throw new DatabaseConfigError(
      "DATABASE_URL must include host, user, and database name.",
    );
  }

  return databaseUrl;
}
