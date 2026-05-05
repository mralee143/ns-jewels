"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useCart } from "@/components/CartProvider";
import { SHOP_PRODUCTS_BY_SLUG } from "@/data/shop-products";
import { calculateOrderTotals, formatPkrDetailed, parsePriceToPaisa, TAX_RATE } from "@/lib/pricing";

export function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart, items } = useCart();
  const buyNowSlug = searchParams.get("buyNowSlug");
  const buyNowQuantityRaw = searchParams.get("quantity");
  const buyNowQuantity = Math.max(1, Number.parseInt(buyNowQuantityRaw ?? "1", 10) || 1);
  const buyNowProduct = buyNowSlug ? SHOP_PRODUCTS_BY_SLUG[buyNowSlug] : undefined;

  const checkoutItems = buyNowProduct ? [{ product: buyNowProduct, quantity: buyNowQuantity }] : items;
  const totals = calculateOrderTotals(checkoutItems);

  if (checkoutItems.length === 0) {
    return (
      <div className="rounded-2xl border border-[#f3e8ff] bg-white p-8 text-center">
        <h2 className="text-2xl font-semibold text-black">Your cart is empty</h2>
        <p className="mt-2 text-sm text-black">Add items to continue checkout.</p>
        <Link
          className="mt-6 inline-flex rounded-full bg-cta px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-cta-hover"
          href="/"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <form
      className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]"
      onSubmit={(event) => {
        event.preventDefault();
        if (!buyNowProduct) {
          clearCart();
        }
        router.push("/");
      }}
    >
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-black">Contact</h2>
            <button className="text-sm font-medium text-black transition-colors duration-200 hover:text-neutral-800" type="button">
              Sign in
            </button>
          </div>
          <input
            className="mt-3 w-full rounded-md border border-[#cbd5e1] bg-white px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
            placeholder="Email or mobile phone number"
            type="text"
          />
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-black">Delivery</h2>
          <div className="mt-3 space-y-3">
            <input
              className="w-full rounded-md border border-[#cbd5e1] bg-white px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
              defaultValue="Pakistan"
              placeholder="Country/Region"
              type="text"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                className="rounded-md border border-[#cbd5e1] bg-white px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
                placeholder="First name"
                type="text"
              />
              <input
                className="rounded-md border border-[#cbd5e1] bg-white px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
                placeholder="Last name"
                type="text"
              />
            </div>
            <input
              className="w-full rounded-md border border-[#cbd5e1] bg-white px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
              placeholder="Address"
              type="text"
            />
            <input
              className="w-full rounded-md border border-[#cbd5e1] bg-white px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
              placeholder="Apartment, suite, etc. (optional)"
              type="text"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                className="rounded-md border border-[#cbd5e1] bg-white px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
                placeholder="City"
                type="text"
              />
              <input
                className="rounded-md border border-[#cbd5e1] bg-white px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
                placeholder="Postal code (optional)"
                type="text"
              />
            </div>
            <input
              className="w-full rounded-md border border-[#cbd5e1] bg-white px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
              placeholder="Phone"
              type="text"
            />
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-black">Payment</h2>
          <fieldset className="mt-3">
            <legend className="sr-only">Payment method</legend>
            <label className="flex cursor-pointer items-center gap-3 rounded-md border border-[#cbd5e1] bg-white px-4 py-3 text-sm text-black transition-colors duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cta/40">
              <input
                className="size-4 shrink-0 accent-cta"
                defaultChecked
                name="paymentMethod"
                type="radio"
                value="cod"
              />
              <span>
                <span className="font-medium">Cash on delivery (COD)</span>
                <span className="mt-0.5 block text-xs text-[#6E6E6E]">Pay when your order arrives.</span>
              </span>
            </label>
          </fieldset>
        </div>
      </div>

      <aside className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <div className="space-y-4">
          {checkoutItems.map((item) => (
            <div className="flex items-center gap-3" key={item.product.id}>
              <p className="min-w-0 flex-1 text-sm text-black">
                <span className="font-medium">{item.product.title}</span>
                <span className="ml-2 shrink-0 text-[#6E6E6E]">×{item.quantity}</span>
              </p>
              <p className="shrink-0 text-sm font-medium text-black">
                {formatPkrDetailed(parsePriceToPaisa(item.product.price) * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2 border-t border-[#e2e8f0] pt-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-black">Subtotal</span>
            <span className="text-black">{formatPkrDetailed(totals.subtotalPaisa)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black">Shipping</span>
            <span className="text-black">{formatPkrDetailed(totals.deliveryPaisa)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black">Estimated taxes ({(TAX_RATE * 100).toFixed(0)}%)</span>
            <span className="text-black">{formatPkrDetailed(totals.taxPaisa)}</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#e2e8f0] pt-4">
            <span className="text-2xl font-semibold text-black">Total</span>
            <span className="text-3xl font-bold text-black">{formatPkrDetailed(totals.totalPaisa)}</span>
          </div>
        </div>

        <button
          className="mt-6 w-full rounded-full bg-cta px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-cta-hover"
          type="submit"
        >
          Confirm order
        </button>
      </aside>
    </form>
  );
}
