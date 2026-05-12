import nodemailer from "nodemailer";

type SmtpEnv = {
  from: string;
  host: string;
  password: string;
  portRaw: string | undefined;
  secureRaw: string | undefined;
  user: string;
};

function readSmtpEnv(): SmtpEnv {
  return {
    from: process.env.SMTP_FROM?.trim() ?? "",
    host: process.env.SMTP_HOST?.trim() ?? "",
    password: process.env.SMTP_PASSWORD?.trim() ?? "",
    portRaw: process.env.SMTP_PORT?.trim(),
    secureRaw: process.env.SMTP_SECURE?.trim().toLowerCase(),
    user: process.env.SMTP_USER?.trim() ?? "",
  };
}

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
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.SIGNUP_OTP_CONSOLE_FALLBACK === "true"
  );
}

export async function sendSignupOtpEmail(toEmail: string, otp: string): Promise<void> {
  const subject = "Your NS Jewels verification code";
  const text = `Your verification code is ${otp}. It expires in 15 minutes.\n\nIf you did not create an account, you can ignore this email.`;

  const { from, host, password, portRaw, secureRaw, user } = readSmtpEnv();
  const port = portRaw ? Number.parseInt(portRaw, 10) : 587;
  const secure = secureRaw === "true" || port === 465;
  const fallbackOk = consoleFallbackAllowed();

  const logOtpToConsole = (reason: string): void => {
    console.warn(`[signup OTP] ${reason}`);
    console.info(`[signup OTP] To ${toEmail}: code=${otp} — ${text.replace(/\n/g, " ")}`);
  };

  const missingBasics = !host || !from;
  const missingAuthForHostedProvider =
    !missingBasics && hostLikelyRequiresAuth(host) && (!user || !password);

  if (missingBasics) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMTP_HOST and SMTP_FROM are required in production.");
    }
    logOtpToConsole("SMTP_HOST or SMTP_FROM is unset; printing OTP to the server console.");
    return;
  }

  if (missingAuthForHostedProvider) {
    if (fallbackOk) {
      logOtpToConsole(
        "This SMTP host usually requires SMTP_USER and SMTP_PASSWORD (e.g. Gmail App Password). Printing OTP to the server console instead.",
      );
      return;
    }
    throw new Error(
      "SMTP_USER and SMTP_PASSWORD are required for this provider. For Gmail, create an App Password and set both variables.",
    );
  }

  const transporter = nodemailer.createTransport({
    auth:
      user && password ?
        {
          pass: password,
          user,
        }
      : undefined,
    host,
    port,
    requireTLS: !secure && port === 587,
    secure,
  });

  try {
    const info = await transporter.sendMail({
      from,
      subject,
      text,
      to: toEmail,
    });
    console.info(
      `[signup OTP] SMTP accepted message for ${toEmail}. messageId=${String(info.messageId ?? "")}`,
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (fallbackOk) {
      logOtpToConsole(`Email send failed (${message}). Printing OTP to the server console instead.`);
      return;
    }
    throw error instanceof Error ? error : new Error(message);
  }
}
