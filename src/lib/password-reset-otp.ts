import { createHash, timingSafeEqual } from "crypto";

import { getAuthSecret } from "@/lib/auth-secret";

const PASSWORD_RESET_IDENTIFIER_PREFIX = "password-reset-otp:";

export function passwordResetOtpIdentifier(email: string): string {
  return `${PASSWORD_RESET_IDENTIFIER_PREFIX}${email.trim().toLowerCase()}`;
}

export function hashPasswordResetOtp(email: string, otp: string): string {
  const secret = getAuthSecret();
  const normalizedEmail = email.trim().toLowerCase();
  return createHash("sha256")
    .update(`${secret}:password-reset-otp:${normalizedEmail}:${otp}`)
    .digest("hex");
}

export function verifyPasswordResetOtp(email: string, otp: string, storedDigest: string): boolean {
  const expected = hashPasswordResetOtp(email, otp);
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(storedDigest, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
