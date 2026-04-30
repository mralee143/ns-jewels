import type { Metadata } from "next";

import { CheckoutPageContent } from "@/components/checkout/CheckoutPageContent";
import { FooterSection } from "@/components/FooterSection";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  description: "Complete your NS Jewels checkout with exact subtotal, shipping, taxes, and final total.",
  title: "Checkout | NS Jewels",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf8] text-[#1c1917]">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <CheckoutPageContent />
      </main>
      <FooterSection />
    </div>
  );
}
