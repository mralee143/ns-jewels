/** Same fallback NextAuth uses when `AUTH_SECRET` is unset (dev only). */
export function getAuthSecret(): string {
  return (
    process.env.AUTH_SECRET ??
    (process.env.NODE_ENV === "production"
      ? "placeholder-auth-secret-set-env-AUTH_SECRET"
      : "development-auth-secret-not-for-production")
  );
}
