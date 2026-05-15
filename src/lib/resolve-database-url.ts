const trim = (value: string | undefined): string | undefined => {
  const t = value?.trim();
  return t === "" ? undefined : t;
};

export const buildPostgresDatabaseUrl = (parts: {
  readonly host: string;
  readonly name: string;
  readonly password: string;
  readonly port: string;
  readonly user: string;
}): string => {
  const port = parts.port.trim() === "" ? "5432" : parts.port.trim();
  const auth =
    parts.password === ""
      ? encodeURIComponent(parts.user)
      : `${encodeURIComponent(parts.user)}:${encodeURIComponent(parts.password)}`;

  return `postgresql://${auth}@${parts.host}:${port}/${encodeURIComponent(parts.name)}`;
};

/**
 * If `DB_HOST`, `DB_USER`, and `DB_NAME` are set, builds `postgresql://…` from
 * `DB_PORT` (default 5432) and `DB_PASSWORD`. Otherwise uses `DATABASE_URL`.
 */
export const resolveDatabaseUrl = (): string | undefined => {
  const host = trim(process.env.DB_HOST);
  const user = trim(process.env.DB_USER);
  const name = trim(process.env.DB_NAME);

  if (host && user && name) {
    const port = trim(process.env.DB_PORT) ?? "5432";
    const password = process.env.DB_PASSWORD ?? "";
    return buildPostgresDatabaseUrl({ host, name, password, port, user });
  }

  return trim(process.env.DATABASE_URL);
};
