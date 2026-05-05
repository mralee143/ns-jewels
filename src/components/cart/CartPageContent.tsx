"use client";

import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/components/CartProvider";
import { FillImage } from "@/components/FillImage";
import { calculateOrderTotals, formatPkrDetailed, parsePriceToPaisa, TAX_RATE } from "@/lib/pricing";
import { formatPkrLine, parsePriceLabelToNumber } from "@/lib/product-price-display";

export function CartPageContent() {
  const { decreaseItem, increaseItem, items, removeItem } = useCart();
  const [previewImage, setPreviewImage] = useState<{ alt: string; src: string } | null>(null);

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
            <button
              aria-label={`Open image preview for ${item.product.title}`}
              className="relative h-20 w-20 overflow-hidden rounded-xl bg-neutral-100"
              onClick={() =>
                setPreviewImage({
                  alt: item.product.title,
                  src: item.product.additionalImages?.[0] ?? item.product.imageSrc,
                })
              }
              type="button"
            >
              <FillImage
                alt={item.product.title}
                className="object-cover object-center"
                sizes="80px"
                src={item.product.additionalImages?.[0] ?? item.product.imageSrc}
              />
            </button>
            <div className="flex min-w-0 flex-1 flex-col">
              <h3 className="font-semibold text-black">
                <Link className="transition-colors duration-200 hover:text-cta" href={`/product/${item.product.slug}`}>
                  {item.product.title}
                </Link>
              </h3>
              <p className="mt-1 text-sm text-black">
                {formatPkrLine(parsePriceLabelToNumber(item.product.price))} each
              </p>
              <p className="mt-1 text-xs font-medium text-black">
                Line total: {formatPkrDetailed(parsePriceToPaisa(item.product.price) * item.quantity)}
              </p>
            </div>
            <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
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
      {previewImage ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
        >
          <div className="w-full max-w-3xl rounded-2xl bg-white p-3">
            <div className="flex justify-end">
              <button
                className="rounded-full border border-[#F0D3DA] px-3 py-1 text-sm font-semibold text-black transition-colors duration-200 hover:bg-[#F6C1CC]/35"
                onClick={() => setPreviewImage(null)}
                type="button"
              >
                Close
              </button>
            </div>
            <div className="relative mt-2 h-[70vh] w-full overflow-hidden rounded-xl bg-neutral-100">
              <FillImage
                alt={previewImage.alt}
                className="object-contain object-center"
                sizes="(max-width: 1024px) 100vw, 900px"
                src={previewImage.src}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
