import { existsSync } from "node:fs";

import { resolveDatabaseUrl } from "@/lib/resolve-database-url";

const LOCAL_DB_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isRunningInDocker(): boolean {
  return existsSync("/.dockerenv");
}

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

  if (isRunningInDocker() && LOCAL_DB_HOSTS.has(url.hostname)) {
    throw new DatabaseConfigError(
      "DB_HOST or DATABASE_URL uses localhost inside Docker; that points at this app container, not PostgreSQL. Set DB_HOST to your Postgres service name on the Docker network (e.g. websites_ns-db or the compose service name postgres).",
    );
  }

  return databaseUrl;
}
