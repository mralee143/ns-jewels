import type { Metadata } from "next";

import { FooterSection } from "@/components/FooterSection";
import { VerifyEmailForm } from "@/components/login/verify-email-form";
import { Navbar } from "@/components/Navbar";
import { WhatsAppFloatButton } from "@/components/WhatsAppFloatButton";

export const metadata: Metadata = {
  description: "Enter the verification code we emailed you to finish creating your NS Jewels account.",
  title: "Verify email | NS Jewels",
};

type VerifyEmailPageProps = {
  readonly searchParams: Promise<{ callbackUrl?: string; email?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : undefined;
  const callbackUrl = typeof params.callbackUrl === "string" ? params.callbackUrl : undefined;
  const showTerminalOtpHint = process.env.NODE_ENV === "development";

  return (
    <div className="flex min-h-screen flex-col bg-background text-black">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <VerifyEmailForm
          defaultCallbackUrl={callbackUrl}
          defaultEmail={email}
          showTerminalOtpHint={showTerminalOtpHint}
        />
      </main>
      <FooterSection />
      <WhatsAppFloatButton />
    </div>
  );
}
