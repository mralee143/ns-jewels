"use client";

import Link from "next/link";

import { useCart } from "@/components/CartProvider";
import { FillImage } from "@/components/FillImage";
import {
  productCheckoutThumbFitClass,
  productCheckoutThumbShellClass,
} from "@/lib/product-image-display";
import { calculateOrderTotals, formatPkrDetailed, parsePriceToPaisa, TAX_RATE } from "@/lib/pricing";

export function CheckoutPageContent() {
  const { items } = useCart();
  const totals = calculateOrderTotals(items);

  if (items.length === 0) {
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
    <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-black">Contact</h2>
            <button className="text-sm font-medium text-black transition-colors duration-200 hover:text-neutral-800" type="button">
              Sign in
            </button>
          </div>
          <input
            className="mt-3 w-full rounded-md border border-[#cbd5e1] px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
            placeholder="Email or mobile phone number"
            type="text"
          />
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-black">Delivery</h2>
          <div className="mt-3 space-y-3">
            <input
              className="w-full rounded-md border border-[#cbd5e1] px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
              defaultValue="Pakistan"
              placeholder="Country/Region"
              type="text"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                className="rounded-md border border-[#cbd5e1] px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
                placeholder="First name"
                type="text"
              />
              <input
                className="rounded-md border border-[#cbd5e1] px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
                placeholder="Last name"
                type="text"
              />
            </div>
            <input
              className="w-full rounded-md border border-[#cbd5e1] px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
              placeholder="Address"
              type="text"
            />
            <input
              className="w-full rounded-md border border-[#cbd5e1] px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
              placeholder="Apartment, suite, etc. (optional)"
              type="text"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                className="rounded-md border border-[#cbd5e1] px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
                placeholder="City"
                type="text"
              />
              <input
                className="rounded-md border border-[#cbd5e1] px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
                placeholder="Postal code (optional)"
                type="text"
              />
            </div>
            <input
              className="w-full rounded-md border border-[#cbd5e1] px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
              placeholder="Phone"
              type="text"
            />
          </div>
        </div>
      </div>

      <aside className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-6">
        <div className="space-y-4">
          {items.map((item) => (
            <div className="flex items-center gap-3" key={item.product.id}>
              <div className={productCheckoutThumbShellClass(item.product.category)}>
                <FillImage
                  alt={item.product.title}
                  className={productCheckoutThumbFitClass(item.product.category)}
                  sizes={item.product.category === "sets" ? "96px" : "56px"}
                  src={item.product.imageSrc}
                />
                <span className="absolute right-1 top-1 rounded-full bg-[#F6C1CC] px-1.5 text-[10px] font-semibold text-black ring-1 ring-black/10">
                  {item.quantity}
                </span>
              </div>
              <p className="flex-1 text-sm text-black">{item.product.title}</p>
              <p className="text-sm font-medium text-black">
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
      </aside>
    </section>
  );
}
