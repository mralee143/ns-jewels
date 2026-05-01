"use client";

import Image from "next/image";
import Link from "next/link";

import { StarRating } from "@/components/StarRating";
import type { ShopProduct } from "@/data/shop-products";

type BestSellerProductCardProps = {
  readonly product: ShopProduct;
};

const parsePriceNumber = (price: string): number =>
  Number.parseFloat(price.replace(/,/g, "").replace(/[^\d.]/g, "")) || 0;

export function BestSellerProductCard({ product }: BestSellerProductCardProps) {
  const numericPrice = parsePriceNumber(product.price);

  return (
    <article className="group flex flex-col rounded-lg bg-white p-3 shadow-sm ring-1 ring-[#EFE9FF] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-[#C4B5FD]/80">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-[#F7F5FF]">
        <Link className="absolute inset-0 block" href={`/product/${product.slug}`}>
          <Image
            alt={product.title}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            src={product.imageSrc}
          />
        </Link>
        <span className="pointer-events-none absolute left-2 top-2 rounded-md bg-[#F6C1CC] px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-black ring-1 ring-black/10">
          Best seller
        </span>
        <Link
          aria-label={`Save ${product.title} to wishlist`}
          className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-black shadow-sm backdrop-blur-sm ring-1 ring-black/10 transition-colors duration-200 hover:bg-white hover:text-neutral-800"
          href="/wishlist"
        >
          <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z" />
          </svg>
        </Link>
      </div>
      <div className="mt-3 flex flex-1 flex-col px-0.5 pb-1 pt-0">
        <Link className="font-display text-base font-semibold text-black transition-colors duration-200 hover:text-neutral-800" href={`/product/${product.slug}`}>
          {product.title}
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold tabular-nums text-black">
            Rs. {numericPrice.toLocaleString("en-PK")}
          </span>
        </div>
        <div className="mt-2">
          <StarRating />
        </div>
      </div>
    </article>
  );
}
