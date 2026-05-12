/** Allows same-origin relative paths only (blocks protocol-relative and external redirects). */
export function sanitizeCallbackUrl(raw: string | undefined, fallback: string): string {
  if (!raw?.startsWith("/") || raw.startsWith("//")) {
    return fallback;
  }
  return raw;
}
