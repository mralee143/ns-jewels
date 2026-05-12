import type { Metadata } from "next";

import { FooterSection } from "@/components/FooterSection";
import { LoginPageContent } from "@/components/login/login-page-content";
import { Navbar } from "@/components/Navbar";
import { WhatsAppFloatButton } from "@/components/WhatsAppFloatButton";

const googleId = process.env.AUTH_GOOGLE_ID;
const googleSecret = process.env.AUTH_GOOGLE_SECRET;

export const metadata: Metadata = {
  description: "Sign in or create your NS Jewels account with email or Google.",
  title: "Sign in | NS Jewels",
};

type LoginPageProps = {
  readonly searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const googleOAuthConfigured = Boolean(googleId && googleSecret);
  const params = await searchParams;
  const callbackUrl = typeof params.callbackUrl === "string" ? params.callbackUrl : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-background text-black">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <LoginPageContent
          defaultCallbackUrl={callbackUrl}
          googleOAuthConfigured={googleOAuthConfigured}
        />
      </main>
      <FooterSection />
      <WhatsAppFloatButton />
    </div>
  );
}
