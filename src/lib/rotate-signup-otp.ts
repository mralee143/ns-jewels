import { prisma } from "@/lib/prisma";
import { sendSignupOtpEmail } from "@/lib/send-signup-otp-email";
import { generateSixDigitOtp, hashSignupOtp, signupOtpIdentifier } from "@/lib/signup-otp";

const OTP_TTL_MS = 15 * 60 * 1000;

/** Replaces any pending signup OTP and sends a fresh code (used when resending or recovering from a duplicate registration). */
export async function rotateSignupOtpAndSend(emailRaw: string): Promise<void> {
  const identifier = signupOtpIdentifier(emailRaw);
  const otp = generateSixDigitOtp();
  const digest = hashSignupOtp(emailRaw, otp);
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
    await sendSignupOtpEmail(emailRaw, otp);
  } catch (error: unknown) {
    await prisma.verificationToken.deleteMany({ where: { identifier } });
    throw error;
  }
}
