/** Keep in sync with `src/lib/resolve-database-url.ts` (used by Docker entrypoint). */

const trim = (value) => {
  const t = value?.trim();
  return t === "" ? undefined : t;
};

export const buildPostgresDatabaseUrl = (parts) => {
  const port = parts.port.trim() === "" ? "5432" : parts.port.trim();
  const auth =
    parts.password === ""
      ? encodeURIComponent(parts.user)
      : `${encodeURIComponent(parts.user)}:${encodeURIComponent(parts.password)}`;

  return `postgresql://${auth}@${parts.host}:${port}/${encodeURIComponent(parts.name)}`;
};

export const resolveDatabaseUrl = () => {
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

import path from "node:path";
import { fileURLToPath } from "node:url";

const isMain =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]).toLowerCase() ===
    path.resolve(fileURLToPath(import.meta.url)).toLowerCase();

if (isMain) {
  const url = resolveDatabaseUrl();
  if (!url) {
    console.error(
      "Set DATABASE_URL or DB_HOST, DB_USER, DB_NAME (and optional DB_PORT, DB_PASSWORD).",
    );
    process.exit(1);
  }
  process.stdout.write(url);
}
