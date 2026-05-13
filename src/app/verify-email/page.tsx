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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-black">
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-28 h-72 w-72 -translate-x-1/2 rounded-full bg-[#F6C1CC]/55 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-24 right-0 h-80 w-80 translate-x-1/3 rounded-full bg-white/80 blur-3xl"
      />
      <Navbar />
      <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-12 lg:py-16">
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
