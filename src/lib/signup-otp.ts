import { createHash, randomInt, timingSafeEqual } from "crypto";

import { getAuthSecret } from "@/lib/auth-secret";

const OTP_IDENTIFIER_PREFIX = "signup-otp:";

export function signupOtpIdentifier(email: string): string {
  return `${OTP_IDENTIFIER_PREFIX}${email.trim().toLowerCase()}`;
}

export function generateSixDigitOtp(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashSignupOtp(email: string, otp: string): string {
  const secret = getAuthSecret();
  const normalizedEmail = email.trim().toLowerCase();
  return createHash("sha256")
    .update(`${secret}:signup-otp:${normalizedEmail}:${otp}`)
    .digest("hex");
}

export function verifySignupOtp(email: string, otp: string, storedDigest: string): boolean {
  const expected = hashSignupOtp(email, otp);
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(storedDigest, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
