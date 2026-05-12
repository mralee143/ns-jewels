import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { signupOtpIdentifier, verifySignupOtp } from "@/lib/signup-otp";

const EMAIL_MAX = 254;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type VerifyBody = {
  email?: unknown;
  otp?: unknown;
};

export async function POST(request: Request): Promise<Response> {
  let body: VerifyBody;
  try {
    body = (await request.json()) as VerifyBody;
  } catch {
    return NextResponse.json({ error: "Expected JSON body." }, { status: 400 });
  }

  const emailRaw = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const otpRaw = typeof body.otp === "string" ? body.otp.trim() : "";

  if (!emailRaw || emailRaw.length > EMAIL_MAX || !isValidEmail(emailRaw)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (!/^\d{6}$/.test(otpRaw)) {
    return NextResponse.json({ error: "Enter the 6-digit code from your email." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    select: { emailVerified: true, id: true },
    where: { email: emailRaw },
  });

  if (!user) {
    return NextResponse.json(
      {
        error:
          "No account found for this email. Use the exact address you signed up with, or create a new account.",
      },
      { status: 404 },
    );
  }

  if (user.emailVerified) {
    return NextResponse.json({ alreadyVerified: true, ok: true }, { status: 200 });
  }

  const identifier = signupOtpIdentifier(emailRaw);

  const tokenRow = await prisma.verificationToken.findFirst({
    orderBy: { expires: "desc" },
    where: {
      expires: { gt: new Date() },
      identifier,
    },
  });

  if (!tokenRow || !verifySignupOtp(emailRaw, otpRaw, tokenRow.token)) {
    return NextResponse.json(
      {
        error:
          "That code is wrong or expired. Use “Resend code” to get a new one (check spam/junk too).",
      },
      { status: 400 },
    );
  }

  await prisma.$transaction([
    prisma.verificationToken.deleteMany({ where: { identifier } }),
    prisma.user.update({
      data: { emailVerified: new Date() },
      where: { id: user.id },
    }),
  ]);

  return NextResponse.json({ ok: true }, { status: 200 });
}
