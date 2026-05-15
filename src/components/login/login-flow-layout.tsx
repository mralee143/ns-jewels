import type { ReactNode } from "react";

import { FooterSection } from "@/components/FooterSection";
import { Navbar } from "@/components/Navbar";
import { WhatsAppFloatButton } from "@/components/WhatsAppFloatButton";

type LoginFlowLayoutProps = {
  readonly children: ReactNode;
};

export function LoginFlowLayout({ children }: LoginFlowLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-black">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        {children}
      </main>
      <FooterSection />
      <WhatsAppFloatButton />
    </div>
  );
}
