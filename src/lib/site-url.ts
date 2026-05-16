const trimTrailingSlash = (value: string): string => value.replace(/\/$/, "");

/** Public site origin for redirects (runtime on server; optional at build for client). */
export const getConfiguredSiteUrl = (): string | undefined => {
  const authUrl = process.env.AUTH_URL?.trim();
  if (authUrl) {
    return trimTrailingSlash(authUrl);
  }

  const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (publicSiteUrl) {
    return trimTrailingSlash(publicSiteUrl);
  }

  return undefined;
};
