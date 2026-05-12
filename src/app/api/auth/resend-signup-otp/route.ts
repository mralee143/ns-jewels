import { NextResponse } from "next/server";

import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { rotateSignupOtpAndSend } from "@/lib/rotate-signup-otp";

const EMAIL_MAX = 254;
const PASSWORD_MIN = 6;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type ResendBody = {
  email?: unknown;
  password?: unknown;
};

export async function POST(request: Request): Promise<Response> {
  let body: ResendBody;
  try {
    body = (await request.json()) as ResendBody;
  } catch {
    return NextResponse.json({ error: "Expected JSON body." }, { status: 400 });
  }

  const emailRaw = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!emailRaw || emailRaw.length > EMAIL_MAX || !isValidEmail(emailRaw)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (password.length < PASSWORD_MIN) {
    return NextResponse.json({ error: "Password is required to resend the code." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: emailRaw },
  });

  if (!user?.passwordHash) {
    return NextResponse.json({ error: "Could not send a code." }, { status: 400 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Could not send a code." }, { status: 400 });
  }

  if (user.emailVerified) {
    return NextResponse.json({ error: "This email is already verified. Sign in instead." }, { status: 400 });
  }

  try {
    await rotateSignupOtpAndSend(emailRaw);
  } catch (error: unknown) {
    console.error(error);
    const configHint =
      error instanceof Error &&
      (error.message.includes("SMTP_") || error.message.includes("App Password"))
        ? error.message
        : null;
    return NextResponse.json(
      { error: configHint ?? "Could not send email. Try again later." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
