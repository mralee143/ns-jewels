import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { EmailRegisterContent } from "@/components/login/email-register-content";
import { LoginFlowLayout } from "@/components/login/login-flow-layout";
import { resolveAuthSecret } from "@/lib/auth-secret";
import { EMAIL_OTP_SESSION_COOKIE, parseVerifiedEmailSession } from "@/lib/email-otp-session";

export const metadata: Metadata = {
  description: "Complete your NS Jewels account registration.",
  title: "Register | NS Jewels",
};

export default async function LoginRegisterPage() {
  const jar = await cookies();
  const token = jar.get(EMAIL_OTP_SESSION_COOKIE)?.value ?? "";
  const session = token ? parseVerifiedEmailSession(token, resolveAuthSecret()) : null;
  if (!session) {
    redirect("/login");
  }

  return (
    <LoginFlowLayout>
      <EmailRegisterContent email={session.email} />
    </LoginFlowLayout>
  );
}
