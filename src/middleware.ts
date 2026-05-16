import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { resolveAuthSecret } from "@/lib/auth-secret";
import { sanitizeCallbackUrl } from "@/lib/sanitize-callback-url";
import { getConfiguredSiteUrl } from "@/lib/site-url";

const redirectInvalidBrowserHost = (
  request: NextRequest,
): NextResponse | null => {
  const hostHeader =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "";
  const hostname = hostHeader.split(":")[0]?.toLowerCase();

  if (hostname !== "0.0.0.0") {
    return null;
  }

  const redirectUrl = request.nextUrl.clone();
  const configured = getConfiguredSiteUrl();

  if (configured) {
    const target = new URL(configured);
    redirectUrl.protocol = target.protocol;
    redirectUrl.host = target.host;
  } else {
    redirectUrl.hostname = "localhost";
  }

  return NextResponse.redirect(redirectUrl);
};

const protectAdminRoutes = async (
  request: NextRequest,
): Promise<NextResponse> => {
  const pathname = request.nextUrl.pathname;

  const token = await getToken({
    req: request,
    secret: resolveAuthSecret(),
    secureCookie: process.env.NODE_ENV === "production",
  });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "callbackUrl",
      sanitizeCallbackUrl(pathname, "/admin"),
    );
    return NextResponse.redirect(loginUrl);
  }

  if (token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
};

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const invalidHostRedirect = redirectInvalidBrowserHost(request);
  if (invalidHostRedirect) {
    return invalidHostRedirect;
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    return protectAdminRoutes(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
};
