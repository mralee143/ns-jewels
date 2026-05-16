"use client";

import { signOut } from "next-auth/react";

const INVALID_BROWSER_HOSTS = new Set(["0.0.0.0"]);

const trimTrailingSlash = (url: string): string => url.replace(/\/$/, "");

/** Auth.js sign-out redirect target; 0.0.0.0 is not a valid browser address. */
export const resolveSignOutCallbackUrl = (): string => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (typeof window === "undefined") {
    return configured ? `${trimTrailingSlash(configured)}/` : "/";
  }

  const { hostname, origin, port, protocol } = window.location;

  if (!INVALID_BROWSER_HOSTS.has(hostname)) {
    return `${origin}/`;
  }

  if (configured) {
    return `${trimTrailingSlash(configured)}/`;
  }

  const portSuffix = port ? `:${port}` : "";
  return `${protocol}//localhost${portSuffix}/`;
};

export const signOutToHome = (): void => {
  void signOut({ callbackUrl: resolveSignOutCallbackUrl() });
};
