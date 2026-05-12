import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { hashPassword, verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { rotateSignupOtpAndSend } from "@/lib/rotate-signup-otp";
import { sendSignupOtpEmail } from "@/lib/send-signup-otp-email";
import { generateSixDigitOtp, hashSignupOtp, signupOtpIdentifier } from "@/lib/signup-otp";

const EMAIL_MAX = 254;
const NAME_MIN = 2;
const NAME_MAX = 120;
const PASSWORD_MIN = 6;
const OTP_TTL_MS = 15 * 60 * 1000;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type RegisterBody = {
  email?: unknown;
  password?: unknown;
  name?: unknown;
  marketingOptIn?: unknown;
};

function emailSendFailureResponse(error: unknown): Response {
  const configHint =
    error instanceof Error &&
    (error.message.includes("SMTP_") || error.message.includes("App Password"))
      ? error.message
      : null;
  return NextResponse.json(
    {
      error:
        configHint ??
        "Could not send verification email. Check SMTP settings or try again.",
    },
    { status: 503 },
  );
}

export async function POST(request: Request): Promise<Response> {
  let body: RegisterBody;
  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return NextResponse.json({ error: "Expected JSON body." }, { status: 400 });
  }

  const emailRaw = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const nameRaw = typeof body.name === "string" ? body.name.trim() : "";
  const marketingOptIn = body.marketingOptIn === true;

  if (!emailRaw || emailRaw.length > EMAIL_MAX || !isValidEmail(emailRaw)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (nameRaw.length < NAME_MIN || nameRaw.length > NAME_MAX) {
    return NextResponse.json(
      { error: `Name must be between ${NAME_MIN} and ${NAME_MAX} characters.` },
      { status: 400 },
    );
  }

  if (password.length < PASSWORD_MIN) {
    return NextResponse.json(
      { error: `Password must be at least ${PASSWORD_MIN} characters.` },
      { status: 400 },
    );
  }

  const passwordHash = await hashPassword(password);
  const identifier = signupOtpIdentifier(emailRaw);

  const existing = await prisma.user.findUnique({
    select: {
      emailVerified: true,
      id: true,
      passwordHash: true,
    },
    where: { email: emailRaw },
  });

  if (existing) {
    if (existing.emailVerified) {
      return NextResponse.json(
        { error: "An account with this email already exists. Sign in instead." },
        { status: 409 },
      );
    }

    if (!existing.passwordHash) {
      return NextResponse.json(
        {
          error:
            "This email is already linked to another sign-in method. Use Google or contact support.",
        },
        { status: 409 },
      );
    }

    const matches = await verifyPassword(password, existing.passwordHash);
    if (!matches) {
      return NextResponse.json(
        {
          error:
            "This email is already registered but not verified. Enter the same password you used when signing up, or use “Resend code” on the verify page.",
        },
        { status: 409 },
      );
    }

    await prisma.user.update({
      data: { marketingOptIn, name: nameRaw },
      where: { id: existing.id },
    });

    try {
      await rotateSignupOtpAndSend(emailRaw);
    } catch (error: unknown) {
      console.error(error);
      return emailSendFailureResponse(error);
    }

    return NextResponse.json({ needsVerification: true, ok: true }, { status: 200 });
  }

  const otp = generateSixDigitOtp();
  const digest = hashSignupOtp(emailRaw, otp);
  const expires = new Date(Date.now() + OTP_TTL_MS);

  let createdUserId: string | null = null;

  try {
    await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email: emailRaw,
          emailVerified: null,
          marketingOptIn,
          name: nameRaw,
          passwordHash,
          role: Role.USER,
        },
        select: { id: true },
      });
      createdUserId = created.id;

      await tx.verificationToken.deleteMany({ where: { identifier } });
      await tx.verificationToken.create({
        data: {
          expires,
          identifier,
          token: digest,
        },
      });
    });
  } catch (error: unknown) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (code === "P2002") {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }

  try {
    await sendSignupOtpEmail(emailRaw, otp);
  } catch (error: unknown) {
    console.error(error);
    await prisma.verificationToken.deleteMany({ where: { identifier } });
    if (createdUserId) {
      await prisma.user.delete({ where: { id: createdUserId } }).catch(() => {});
    }
    return emailSendFailureResponse(error);
  }

  return NextResponse.json({ needsVerification: true, ok: true }, { status: 201 });
}
