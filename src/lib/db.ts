import { resolveMysqlDatabaseUrl } from "@/lib/resolve-mysql-database-url";

export class DatabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseConfigError";
  }
}

type MySqlConnectionConfig = {
  readonly host: string;
  readonly port: number;
  readonly user: string;
  readonly password: string;
  readonly database: string;
  readonly connectionLimit: number;
};

const mysqlPortFromUrl = (url: URL): number => Number.parseInt(url.port || "3306", 10);

const databaseNameFromUrl = (url: URL): string =>
  decodeURIComponent(url.pathname.replace(/^\//, ""));

const mysqlConnectionConfigFromUrl = (rawUrl: string): MySqlConnectionConfig => {
  let url: URL;

  try {
    url = new URL(rawUrl);
  } catch {
    throw new DatabaseConfigError(
      "DATABASE_URL must be a MySQL URL like mysql://user:password@host:3306/database.",
    );
  }

  const database = databaseNameFromUrl(url);

  if (url.protocol !== "mysql:" || !url.hostname || !url.username || !database) {
    throw new DatabaseConfigError(
      "DATABASE_URL must be a MySQL URL like mysql://user:password@host:3306/database.",
    );
  }

  return {
    host: url.hostname,
    port: mysqlPortFromUrl(url),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database,
    connectionLimit: 10,
  };
};

export function getDatabaseConfig(): MySqlConnectionConfig {
  const databaseUrl = resolveMysqlDatabaseUrl();

  if (!databaseUrl?.trim()) {
    throw new DatabaseConfigError(
      "Set DATABASE_URL or DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME for MySQL.",
    );
  }

  return mysqlConnectionConfigFromUrl(databaseUrl);
}
