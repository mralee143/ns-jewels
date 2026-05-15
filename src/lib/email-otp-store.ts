import { randomInt, timingSafeEqual } from "crypto";

type OtpEntry = {
  readonly code: string;
  readonly expiresAt: number;
};

const otpByEmail = new Map<string, OtpEntry>();

const OTP_TTL_MS = 10 * 60 * 1000;

export function generateSixDigitOtp(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function rememberEmailOtp(email: string, code: string): void {
  otpByEmail.set(email, { code, expiresAt: Date.now() + OTP_TTL_MS });
}

function codesEqual(expected: string, given: string): boolean {
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(given, "utf8");
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}

export function consumeEmailOtp(email: string, givenCode: string): boolean {
  const entry = otpByEmail.get(email);
  if (!entry) {
    return false;
  }
  if (Date.now() > entry.expiresAt) {
    otpByEmail.delete(email);
    return false;
  }
  if (!codesEqual(entry.code, givenCode)) {
    return false;
  }
  otpByEmail.delete(email);
  return true;
}
