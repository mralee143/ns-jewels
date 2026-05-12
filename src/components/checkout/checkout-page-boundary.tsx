"use client";

import { useSearchParams } from "next/navigation";

import { CheckoutPageContent } from "@/components/checkout/CheckoutPageContent";

/** Remount checkout when buy-now query changes so client state stays in sync without effect resets. */
export function CheckoutPageBoundary() {
  const searchParams = useSearchParams();
  const buyNowSlug = searchParams.get("buyNowSlug") ?? "";
  const quantity = searchParams.get("quantity") ?? "";

  return <CheckoutPageContent key={`${buyNowSlug}:${quantity}`} />;
}
