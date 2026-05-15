const trim = (value: string | undefined): string | undefined => {
  const t = value?.trim();
  return t === "" ? undefined : t;
};

export const buildMysqlDatabaseUrl = (parts: {
  readonly host: string;
  readonly name: string;
  readonly password: string;
  readonly port: string;
  readonly user: string;
}): string => {
  const port = parts.port.trim() === "" ? "3306" : parts.port.trim();
  return `mysql://${encodeURIComponent(parts.user)}:${encodeURIComponent(parts.password)}@${parts.host}:${port}/${encodeURIComponent(parts.name)}`;
};

/**
 * If `DB_HOST`, `DB_USER`, and `DB_NAME` are set, builds `mysql://…` from
 * `DB_PORT` (default 3306) and `DB_PASSWORD`. Otherwise uses `DATABASE_URL`.
 */
export const resolveMysqlDatabaseUrl = (): string | undefined => {
  const host = trim(process.env.DB_HOST);
  const user = trim(process.env.DB_USER);
  const name = trim(process.env.DB_NAME);

  if (host && user && name) {
    const port = trim(process.env.DB_PORT) ?? "3306";
    const password = process.env.DB_PASSWORD ?? "";
    return buildMysqlDatabaseUrl({ host, name, password, port, user });
  }

  return trim(process.env.DATABASE_URL);
};
