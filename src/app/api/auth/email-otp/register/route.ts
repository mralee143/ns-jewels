import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { resolveAuthSecret } from "@/lib/auth-secret";
import {
  EMAIL_OTP_SESSION_COOKIE,
  parseVerifiedEmailSession,
} from "@/lib/email-otp-session";

const authSecret = resolveAuthSecret();

export async function POST(request: Request): Promise<NextResponse> {
  const jar = await cookies();
  const token = jar.get(EMAIL_OTP_SESSION_COOKIE)?.value;
  const session = token ? parseVerifiedEmailSession(token, authSecret) : null;
  if (!session) {
    return NextResponse.json(
      { error: "Verification expired. Start again from sign in." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const payload =
    typeof body === "object" && body !== null
      ? (body as { marketingOptIn?: unknown; name?: unknown; password?: unknown })
      : null;

  const nameRaw = payload?.name;
  const passwordRaw = payload?.password;
  const name = typeof nameRaw === "string" ? nameRaw.trim() : "";
  const password = typeof passwordRaw === "string" ? passwordRaw : "";

  if (name.length < 2) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  const response = NextResponse.json({
    ok: true as const,
    email: session.email,
    marketingOptIn: Boolean(payload?.marketingOptIn),
    name,
  });
  response.cookies.set(EMAIL_OTP_SESSION_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
