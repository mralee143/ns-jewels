import type { Metadata } from "next";
import { Suspense } from "react";

import { CheckoutPageContent } from "@/components/checkout/CheckoutPageContent";
import { FooterSection } from "@/components/FooterSection";
import { Navbar } from "@/components/Navbar";

/** Avoid static prerender issues with `useSearchParams` and cart-backed UI in worker builds. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description: "Complete your NS Jewels checkout with exact subtotal, shipping, taxes, and final total.",
  title: "Checkout | NS Jewels",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background text-black">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <Suspense fallback={<p className="text-center text-sm text-neutral-600">Loading checkout…</p>}>
          <CheckoutPageContent />
        </Suspense>
      </main>
      <FooterSection />
    </div>
  );
}
