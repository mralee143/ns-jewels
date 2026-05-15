export function resolveAuthSecret(): string {
  const fromEnv = process.env.AUTH_SECRET;
  if (fromEnv && fromEnv.length > 0) {
    return fromEnv;
  }
  if (process.env.NODE_ENV === "production") {
    return "placeholder-auth-secret-set-env-AUTH_SECRET";
  }
  return "development-auth-secret-not-for-production";
}
