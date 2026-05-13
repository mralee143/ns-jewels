import { NextResponse } from "next/server";

import { hashPassword } from "@/lib/password";
import {
  passwordResetOtpIdentifier,
  verifyPasswordResetOtp,
} from "@/lib/password-reset-otp";
import { prisma } from "@/lib/prisma";

const EMAIL_MAX = 254;
const PASSWORD_MIN = 6;
const OTP_PATTERN = /^\d{6}$/;

type ResetPasswordBody = {
  confirmPassword?: unknown;
  email?: unknown;
  otp?: unknown;
  password?: unknown;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request): Promise<Response> {
  let body: ResetPasswordBody;
  try {
    body = (await request.json()) as ResetPasswordBody;
  } catch {
    return NextResponse.json({ error: "Expected JSON body." }, { status: 400 });
  }

  const emailRaw = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const otpRaw = typeof body.otp === "string" ? body.otp.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const confirmPassword =
    typeof body.confirmPassword === "string" ? body.confirmPassword : "";

  if (!emailRaw || emailRaw.length > EMAIL_MAX || !isValidEmail(emailRaw)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (!OTP_PATTERN.test(otpRaw)) {
    return NextResponse.json({ error: "Enter the 6-digit code from your email." }, { status: 400 });
  }

  if (password.length < PASSWORD_MIN) {
    return NextResponse.json(
      { error: `Password must be at least ${PASSWORD_MIN} characters.` },
      { status: 400 },
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    select: { emailVerified: true, id: true, passwordHash: true },
    where: { email: emailRaw },
  });

  if (!user?.passwordHash) {
    return NextResponse.json({ error: "That code is wrong or expired." }, { status: 400 });
  }

  const identifier = passwordResetOtpIdentifier(emailRaw);
  const tokenRow = await prisma.verificationToken.findFirst({
    orderBy: { expires: "desc" },
    where: {
      expires: { gt: new Date() },
      identifier,
    },
  });

  if (!tokenRow || !verifyPasswordResetOtp(emailRaw, otpRaw, tokenRow.token)) {
    return NextResponse.json({ error: "That code is wrong or expired." }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.verificationToken.deleteMany({ where: { identifier } }),
    prisma.user.update({
      data: {
        emailVerified: user.emailVerified ?? new Date(),
        passwordHash,
      },
      where: { id: user.id },
    }),
  ]);

  return NextResponse.json({ ok: true }, { status: 200 });
}
