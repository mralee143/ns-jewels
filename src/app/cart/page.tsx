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
    <div className="min-h-screen bg-background text-black">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black">NS Jewels</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-[0.06em] text-black sm:text-4xl">
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
