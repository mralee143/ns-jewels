import { NextResponse } from "next/server";

import {
  hashPasswordResetOtp,
  passwordResetOtpIdentifier,
} from "@/lib/password-reset-otp";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetOtpEmail } from "@/lib/send-password-reset-otp-email";
import { generateSixDigitOtp } from "@/lib/signup-otp";

const EMAIL_MAX = 254;
const OTP_TTL_MS = 15 * 60 * 1000;

type ForgotPasswordBody = {
  email?: unknown;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function emailSendFailureResponse(error: unknown): Response {
  const configHint =
    error instanceof Error &&
    (error.message.includes("SMTP_") || error.message.includes("App Password"))
      ? error.message
      : null;
  return NextResponse.json(
    { error: configHint ?? "Could not send password reset email. Try again later." },
    { status: 503 },
  );
}

export async function POST(request: Request): Promise<Response> {
  let body: ForgotPasswordBody;
  try {
    body = (await request.json()) as ForgotPasswordBody;
  } catch {
    return NextResponse.json({ error: "Expected JSON body." }, { status: 400 });
  }

  const emailRaw = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!emailRaw || emailRaw.length > EMAIL_MAX || !isValidEmail(emailRaw)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    select: { passwordHash: true },
    where: { email: emailRaw },
  });

  if (!user?.passwordHash) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const identifier = passwordResetOtpIdentifier(emailRaw);
  const otp = generateSixDigitOtp();
  const digest = hashPasswordResetOtp(emailRaw, otp);
  const expires = new Date(Date.now() + OTP_TTL_MS);

  await prisma.$transaction(async (tx) => {
    await tx.verificationToken.deleteMany({ where: { identifier } });
    await tx.verificationToken.create({
      data: {
        expires,
        identifier,
        token: digest,
      },
    });
  });

  try {
    await sendPasswordResetOtpEmail(emailRaw, otp);
  } catch (error: unknown) {
    console.error(error);
    await prisma.verificationToken.deleteMany({ where: { identifier } });
    return emailSendFailureResponse(error);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
