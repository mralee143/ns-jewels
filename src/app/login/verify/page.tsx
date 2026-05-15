import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginFlowLayout } from "@/components/login/login-flow-layout";
import { OtpVerifyContent } from "@/components/login/otp-verify-content";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const metadata: Metadata = {
  description: "Enter the verification code sent to your email.",
  title: "Verify email | NS Jewels",
};

export default async function LoginVerifyPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ email?: string }>;
}>) {
  const params = await searchParams;
  const raw = typeof params.email === "string" ? decodeURIComponent(params.email.trim()) : "";
  const email = raw.toLowerCase();
  if (!emailPattern.test(email)) {
    redirect("/login");
  }

  return (
    <LoginFlowLayout>
      <OtpVerifyContent email={email} />
    </LoginFlowLayout>
  );
}
