import { createHmac, timingSafeEqual } from "crypto";

export const EMAIL_OTP_SESSION_COOKIE = "nsjewels_email_otp_session";

export type VerifiedEmailSession = {
  readonly email: string;
};

export function signVerifiedEmailSession(
  email: string,
  secret: string,
  ttlSeconds: number,
): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payloadJson = JSON.stringify({ email, exp });
  const payload = Buffer.from(payloadJson, "utf8").toString("base64url");
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function parseVerifiedEmailSession(
  token: string,
  secret: string,
): VerifiedEmailSession | null {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) {
    return null;
  }
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expectedSig = createHmac("sha256", secret).update(payload).digest("base64url");
  try {
    const sigBuf = Buffer.from(sig, "utf8");
    const expBuf = Buffer.from(expectedSig, "utf8");
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
  } catch {
    return null;
  }

  let parsed: unknown;
  try {
    const json = Buffer.from(payload, "base64url").toString("utf8");
    parsed = JSON.parse(json);
  } catch {
    return null;
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as { email?: unknown }).email !== "string" ||
    typeof (parsed as { exp?: unknown }).exp !== "number"
  ) {
    return null;
  }

  const { email, exp } = parsed as { email: string; exp: number };
  if (Math.floor(Date.now() / 1000) > exp) {
    return null;
  }

  return { email };
}
