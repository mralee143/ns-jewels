import type { Metadata } from "next";

import { CartPageContent } from "@/components/cart/CartPageContent";
import { FooterSection } from "@/components/FooterSection";
import { Navbar } from "@/components/Navbar";
import { WhatsAppFloatButton } from "@/components/WhatsAppFloatButton";

export const metadata: Metadata = {
  description: "Review products added to your NS Jewels cart and continue to checkout.",
  title: "Cart | NS Jewels",
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf8] text-[#1c1917]">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78716c]">NS Jewels</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-[0.06em] text-[#1c1917] sm:text-4xl">
            Your Cart
          </h1>
        </header>
        <CartPageContent />
      </main>
      <FooterSection />
      <WhatsAppFloatButton />
    </div>
  );
}
