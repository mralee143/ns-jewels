"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useCart } from "@/components/CartProvider";
import { ProductShareButton } from "@/components/product/ProductShareButton";
import type { ShopProduct } from "@/data/shop-products";
import { getProductFeatureBullets } from "@/lib/product-feature-bullets";
import {
  formatPkrLine,
  parsePriceLabelToNumber,
  resolveCompareAtAmount,
} from "@/lib/product-price-display";

type ProductPurchasePanelProps = {
  product: ShopProduct;
};

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const originalPrice = useMemo(() => resolveCompareAtAmount(product), [product]);
  const salePrice = useMemo(() => parsePriceLabelToNumber(product.price), [product.price]);
  const featureBullets = useMemo(() => getProductFeatureBullets(product), [product]);

  const decreaseQuantity = () => setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  const increaseQuantity = () => setQuantity((currentQuantity) => currentQuantity + 1);

  return (
    <div className="max-w-[420px]">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-black">Luxe Sparkles</p>
      <h1 className="mt-1 font-display text-4xl font-semibold leading-tight text-black">{product.title}</h1>

      <div className="mt-8 border-t border-[#F0D3DA] pt-8">
        <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
          <div className="flex flex-col gap-2">
            <span className="text-xl font-normal leading-tight text-neutral-500 line-through">
              {formatPkrLine(originalPrice)}
            </span>
            <span className="w-fit rounded-full bg-[#F4A6A6] px-3 py-1 text-xs font-semibold text-black ring-1 ring-black/10">
              Sale
            </span>
          </div>
          <p className="font-display text-3xl font-semibold leading-none tracking-tight text-black">
            {formatPkrLine(salePrice)}
          </p>
        </div>

        <p className="mt-6 text-sm text-black">
          <span className="font-semibold underline decoration-black underline-offset-2">Shipping</span>{" "}
          calculated at checkout.
        </p>

        <div className="mt-6">
          <p className="text-sm text-black">Quantity</p>
          <div className="mt-2 flex h-12 w-[150px] items-center justify-between border border-black bg-white px-3">
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
          className="mt-6 h-12 w-full border border-black bg-white text-sm font-medium tracking-[0.08em] text-black transition-colors duration-200 hover:bg-[#F6C1CC]/40"
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

      <ul className="mt-10 space-y-5">
        {featureBullets.map((line, index) => (
          <li className="list-none" key={`${index.toString()}-${line}`}>
            <span aria-hidden className="block leading-none text-black">
              •
            </span>
            <span className="mt-1 block font-sans text-sm leading-relaxed text-neutral-600">{line}</span>
          </li>
        ))}
      </ul>

      <ProductShareButton title={product.title} />
    </div>
  );
}
