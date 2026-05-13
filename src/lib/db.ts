const databaseUrl = process.env.DATABASE_URL;

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
  const url = new URL(rawUrl);
  const database = databaseNameFromUrl(url);

  if (url.protocol !== "mysql:" || !url.hostname || !url.username || !database) {
    throw new Error(
      "DATABASE_URL must be a MySQL URL like mysql://ns-app:password@localhost:3306/ns_jewel.",
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
  if (!databaseUrl?.trim()) {
    throw new Error(
      "DATABASE_URL is not set. Add mysql://ns-app:password@localhost:3306/ns_jewel to .env.local.",
    );
  }

  return mysqlConnectionConfigFromUrl(databaseUrl);
}
