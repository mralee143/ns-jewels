import nodemailer from "nodemailer";

const smtpFrom = process.env.SMTP_FROM?.trim() ?? "";
const smtpHost = process.env.SMTP_HOST?.trim() ?? "";
const smtpPassword = process.env.SMTP_PASSWORD?.trim() ?? "";
const smtpPortRaw = process.env.SMTP_PORT?.trim();
const smtpSecureRaw = process.env.SMTP_SECURE?.trim().toLowerCase();
const smtpUser = process.env.SMTP_USER?.trim() ?? "";
const authOtpConsoleFallback =
  process.env.AUTH_OTP_CONSOLE_FALLBACK ?? process.env.SIGNUP_OTP_CONSOLE_FALLBACK;
const nodeEnv = process.env.NODE_ENV;

type SendTransactionalEmailInput = {
  readonly fallbackLogMessage: string;
  readonly fromLabel: string;
  readonly html: string;
  readonly subject: string;
  readonly text: string;
  readonly toEmail: string;
};

/** Common hosted SMTP endpoints need authenticated relay; sending without user/pass always fails. */
function hostLikelyRequiresAuth(host: string): boolean {
  const h = host.toLowerCase();
  return (
    h.includes("gmail") ||
    h.includes("google") ||
    h.includes("outlook") ||
    h.includes("office365") ||
    h.includes("live.com") ||
    h.includes("yahoo") ||
    h.includes("zoho")
  );
}

function consoleFallbackAllowed(): boolean {
  return nodeEnv !== "production" || authOtpConsoleFallback === "true";
}

export async function sendTransactionalEmail({
  fallbackLogMessage,
  fromLabel,
  html,
  subject,
  text,
  toEmail,
}: SendTransactionalEmailInput): Promise<void> {
  const port = smtpPortRaw ? Number.parseInt(smtpPortRaw, 10) : 587;
  const secure = smtpSecureRaw === "true" || port === 465;
  const fallbackOk = consoleFallbackAllowed();

  const logToConsole = (reason: string): void => {
    console.warn(`[${fromLabel}] ${reason}`);
    console.info(`[${fromLabel}] ${fallbackLogMessage}`);
  };

  const missingBasics = !smtpHost || !smtpFrom;
  const missingAuthForHostedProvider =
    !missingBasics && hostLikelyRequiresAuth(smtpHost) && (!smtpUser || !smtpPassword);

  if (missingBasics) {
    if (nodeEnv === "production") {
      throw new Error("SMTP_HOST and SMTP_FROM are required in production.");
    }
    logToConsole("SMTP_HOST or SMTP_FROM is unset; printing email to the server console.");
    return;
  }

  if (missingAuthForHostedProvider) {
    if (fallbackOk) {
      logToConsole(
        "This SMTP host usually requires SMTP_USER and SMTP_PASSWORD (e.g. Gmail App Password). Printing email to the server console instead.",
      );
      return;
    }
    throw new Error(
      "SMTP_USER and SMTP_PASSWORD are required for this provider. For Gmail, create an App Password and set both variables.",
    );
  }

  const transporter = nodemailer.createTransport({
    auth:
      smtpUser && smtpPassword ?
        {
          pass: smtpPassword,
          user: smtpUser,
        }
      : undefined,
    host: smtpHost,
    port,
    requireTLS: !secure && port === 587,
    secure,
  });

  try {
    const info = await transporter.sendMail({
      from: smtpFrom,
      html,
      subject,
      text,
      to: toEmail,
    });
    console.info(
      `[${fromLabel}] SMTP accepted message for ${toEmail}. messageId=${String(info.messageId ?? "")}`,
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (fallbackOk) {
      logToConsole(`Email send failed (${message}). Printing email to the server console instead.`);
      return;
    }
    throw error instanceof Error ? error : new Error(message);
  }
}
