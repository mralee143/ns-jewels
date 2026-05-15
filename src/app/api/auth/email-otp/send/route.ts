import { NextResponse } from "next/server";

import { generateSixDigitOtp, rememberEmailOtp } from "@/lib/email-otp-store";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") {
    return null;
  }
  const trimmed = raw.trim().toLowerCase();
  return emailPattern.test(trimmed) ? trimmed : null;
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const payload =
    typeof body === "object" && body !== null ? (body as { email?: unknown }) : null;
  const email = normalizeEmail(payload?.email);
  if (!email) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const code = generateSixDigitOtp();
  rememberEmailOtp(email, code);

  if (process.env.NODE_ENV === "development") {
    console.info(`[email-otp] Code for ${email}: ${code}`);
  }

  return NextResponse.json({ ok: true as const });
}
