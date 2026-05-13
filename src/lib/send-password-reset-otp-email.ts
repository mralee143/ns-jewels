import { sendTransactionalEmail } from "@/lib/send-transactional-email";

type PasswordResetOtpEmailContent = {
  html: string;
  subject: string;
  text: string;
};

function otpToDigitCells(otp: string): string {
  return otp
    .split("")
    .map(
      (digit) => `
        <td style="padding: 0 4px;">
          <span style="display: inline-block; width: 44px; border: 1px solid #f0d3da; border-radius: 16px; background: #fff8fa; color: #2b2b2b; font-family: 'Courier New', Courier, monospace; font-size: 28px; font-weight: 700; line-height: 54px; text-align: center; box-shadow: 0 10px 24px rgba(233, 106, 122, 0.12);">
            ${digit}
          </span>
        </td>`,
    )
    .join("");
}

function createPasswordResetOtpEmailContent(otp: string): PasswordResetOtpEmailContent {
  const subject = "Reset your NS Jewels password";
  const text = `Your password reset code is ${otp}. It expires in 15 minutes.\n\nIf you did not request this, you can ignore this email.`;
  const digitCells = otpToDigitCells(otp);

  return {
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta content="light" name="color-scheme">
    <title>${subject}</title>
  </head>
  <body style="margin: 0; background: #fdf2f5; color: #2b2b2b; font-family: Arial, Helvetica, sans-serif;">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
      Your NS Jewels password reset code is ${otp}. It expires in 15 minutes.
    </div>
    <table cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; border-collapse: collapse; background: #fdf2f5;">
      <tr>
        <td align="center" style="padding: 36px 16px;">
          <table cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; max-width: 560px; overflow: hidden; border-collapse: collapse; border: 1px solid #f0d3da; border-radius: 32px; background: #ffffff; box-shadow: 0 24px 70px rgba(216, 92, 108, 0.16);">
            <tr>
              <td style="padding: 30px 28px 0;">
                <div style="height: 7px; border-radius: 999px; background: linear-gradient(135deg, #e96a7a, #f6c1cc);"></div>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px 28px 8px; text-align: center;">
                <div style="display: inline-block; border: 1px solid #f0d3da; border-radius: 999px; background: #fdf2f5; padding: 8px 14px; color: #e96a7a; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;">
                  Password reset code
                </div>
                <h1 style="margin: 22px 0 0; color: #2b2b2b; font-family: Georgia, 'Times New Roman', serif; font-size: 34px; font-weight: 600; line-height: 1.15;">
                  Create a new password
                </h1>
                <p style="margin: 14px auto 0; max-width: 390px; color: #6e6e6e; font-size: 15px; line-height: 1.7;">
                  Use this one-time code to reset your NS Jewels account password.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 26px 20px 14px;">
                <table cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse;">
                  <tr>${digitCells}</tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 28px 30px;">
                <div style="border: 1px solid #f0d3da; border-radius: 22px; background: #fdf2f5; padding: 16px 18px; text-align: center;">
                  <p style="margin: 0; color: #2b2b2b; font-size: 14px; font-weight: 700;">
                    This code expires in 15 minutes.
                  </p>
                  <p style="margin: 8px 0 0; color: #6e6e6e; font-size: 13px; line-height: 1.6;">
                    If you did not request this reset, you can safely ignore this email.
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="border-top: 1px solid #f0d3da; padding: 18px 28px 24px; text-align: center;">
                <p style="margin: 0; color: #6e6e6e; font-size: 12px; line-height: 1.6;">
                  NS Jewels - refined pieces for everyday sparkle.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
    subject,
    text,
  };
}

export async function sendPasswordResetOtpEmail(toEmail: string, otp: string): Promise<void> {
  const { html, subject, text } = createPasswordResetOtpEmailContent(otp);

  await sendTransactionalEmail({
    fallbackLogMessage: `To ${toEmail}: code=${otp} - ${text.replace(/\n/g, " ")}`,
    fromLabel: "password reset OTP",
    html,
    subject,
    text,
    toEmail,
  });
}
