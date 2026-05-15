import { NextResponse } from "next/server";

import { resolveAuthSecret } from "@/lib/auth-secret";
import {
  EMAIL_OTP_SESSION_COOKIE,
  signVerifiedEmailSession,
} from "@/lib/email-otp-session";
import { consumeEmailOtp } from "@/lib/email-otp-store";

const authSecret = resolveAuthSecret();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SESSION_COOKIE_MAX_AGE_SECONDS = 15 * 60;

function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") {
    return null;
  }
  const trimmed = raw.trim().toLowerCase();
  return emailPattern.test(trimmed) ? trimmed : null;
}

function normalizeCode(raw: unknown): string | null {
  if (typeof raw !== "string") {
    return null;
  }
  const digits = raw.replace(/\D/g, "");
  return /^\d{6}$/.test(digits) ? digits : null;
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const payload =
    typeof body === "object" && body !== null ? (body as { email?: unknown; code?: unknown }) : null;
  const email = normalizeEmail(payload?.email);
  const code = normalizeCode(payload?.code);
  if (!email || !code) {
    return NextResponse.json({ error: "Enter your email and the 6-digit code." }, { status: 400 });
  }

  const valid = consumeEmailOtp(email, code);
  if (!valid) {
    return NextResponse.json({ error: "Invalid or expired code. Request a new code from sign in." }, { status: 400 });
  }

  const token = signVerifiedEmailSession(email, authSecret, SESSION_COOKIE_MAX_AGE_SECONDS);
  const response = NextResponse.json({ ok: true as const, email });
  response.cookies.set(EMAIL_OTP_SESSION_COOKIE, token, {
    httpOnly: true,
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
