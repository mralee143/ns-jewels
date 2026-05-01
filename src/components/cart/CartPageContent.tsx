"use client";

import Link from "next/link";

import { useCart } from "@/components/CartProvider";
import { FillImage } from "@/components/FillImage";
import { calculateOrderTotals, formatPkrDetailed, parsePriceToPaisa, TAX_RATE } from "@/lib/pricing";

export function CartPageContent() {
  const { decreaseItem, increaseItem, items, removeItem } = useCart();

  const totals = calculateOrderTotals(items);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-[#f3e8ff] bg-white p-8 text-center">
        <h2 className="font-display text-2xl font-semibold text-black">Your cart is empty</h2>
        <p className="mt-2 text-sm text-black">Add products to your cart to continue shopping.</p>
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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {items.map((item) => (
          <article
            className="flex flex-col gap-4 rounded-2xl border border-[#f3e8ff] bg-white p-4 sm:flex-row sm:items-center"
            key={item.product.id}
          >
            <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-[#faf5ff]">
              <FillImage
                alt={item.product.title}
                className="h-full w-full object-cover"
                sizes="96px"
                src={item.product.imageSrc}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-black">{item.product.title}</h3>
              <p className="mt-1 text-sm text-black">{item.product.price} each</p>
              <p className="mt-1 text-xs font-medium text-black">
                Line total: {formatPkrDetailed(parsePriceToPaisa(item.product.price) * item.quantity)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="h-8 w-8 rounded-full border border-[#F0D3DA] text-sm text-black transition-colors duration-200 hover:bg-[#F6C1CC]/35"
                onClick={() => decreaseItem(item.product.slug)}
                type="button"
              >
                -
              </button>
              <span className="min-w-8 text-center text-sm font-semibold text-black">{item.quantity}</span>
              <button
                className="h-8 w-8 rounded-full border border-[#F0D3DA] text-sm text-black transition-colors duration-200 hover:bg-[#F6C1CC]/35"
                onClick={() => increaseItem(item.product.slug)}
                type="button"
              >
                +
              </button>
              <button
                className="ml-2 text-xs font-semibold uppercase tracking-[0.08em] text-black"
                onClick={() => removeItem(item.product.id)}
                type="button"
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
      <aside className="h-fit rounded-2xl border border-[#f3e8ff] bg-white p-6">
        <h3 className="font-display text-xl font-semibold text-black">Order Summary</h3>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-black">Subtotal</span>
          <span className="font-semibold text-black">{formatPkrDetailed(totals.subtotalPaisa)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-black">Estimated taxes ({(TAX_RATE * 100).toFixed(0)}%)</span>
          <span className="font-semibold text-black">{formatPkrDetailed(totals.taxPaisa)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-black">Shipping</span>
          <span className="font-semibold text-black">{formatPkrDetailed(totals.deliveryPaisa)}</span>
        </div>
        <div className="mt-4 border-t border-[#f3e8ff] pt-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-black">Total</span>
            <span className="text-lg font-bold text-black">{formatPkrDetailed(totals.totalPaisa)}</span>
          </div>
        </div>
        <Link
          className="mt-6 block w-full rounded-full bg-cta px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-cta-hover"
          href="/checkout"
        >
          Checkout
        </Link>
      </aside>
    </div>
  );
}
