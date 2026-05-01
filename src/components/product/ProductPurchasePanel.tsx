"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useCart } from "@/components/CartProvider";
import type { ShopProduct } from "@/data/shop-products";

type ProductPurchasePanelProps = {
  product: ShopProduct;
};

const parsePrice = (price: string): number => Number.parseFloat(price.replace(/[^\d.]/g, "")) || 0;

const toPkr = (value: number): string => `Rs.${value.toFixed(2)} PKR`;

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const discountedPrice = useMemo(() => parsePrice(product.price), [product.price]);
  const originalPrice = useMemo(() => discountedPrice + 301, [discountedPrice]);

  const decreaseQuantity = () => setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  const increaseQuantity = () => setQuantity((currentQuantity) => currentQuantity + 1);

  return (
    <div className="max-w-[420px]">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-black">Luxe Sparkles</p>
      <h1 className="mt-1 font-display text-4xl font-semibold leading-tight text-black">{product.title}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-xl text-black/55 line-through">{toPkr(originalPrice)}</span>
        <span className="text-3xl font-semibold text-black">{product.price}</span>
        <span className="rounded-full bg-[#F4A6A6] px-3 py-1 text-xs font-semibold text-black ring-1 ring-black/10">Sale</span>
      </div>

      <p className="mt-3 text-sm text-black">
        <span className="font-semibold underline decoration-black underline-offset-2">Shipping</span>{" "}
        calculated at checkout.
      </p>

      <div className="mt-6">
        <p className="text-sm text-black">Quantity</p>
        <div className="mt-2 flex h-12 w-[150px] items-center justify-between border border-[#a8a29e] px-3">
          <button
            aria-label="Decrease quantity"
            className="text-xl text-black transition-colors duration-200 hover:text-neutral-800"
            onClick={decreaseQuantity}
            type="button"
          >
            -
          </button>
          <span className="text-base font-medium text-black">{quantity}</span>
          <button
            aria-label="Increase quantity"
            className="text-xl text-black transition-colors duration-200 hover:text-neutral-800"
            onClick={increaseQuantity}
            type="button"
          >
            +
          </button>
        </div>
      </div>

      <button
        className="mt-6 h-12 w-full border border-black text-sm font-medium tracking-[0.08em] text-black transition-colors duration-200 hover:bg-[#F6C1CC]/40"
        onClick={() => addToCart(product, quantity)}
        type="button"
      >
        Add to cart
      </button>

      <Link
        className="mt-3 flex h-12 w-full items-center justify-center bg-cta text-sm font-semibold tracking-[0.08em] text-white transition-colors duration-200 hover:bg-cta-hover"
        href="/checkout"
        onClick={() => addToCart(product, quantity)}
      >
        Buy it now
      </Link>
    </div>
  );
}
