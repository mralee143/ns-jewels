"use client";

import Image from "next/image";
import Link from "next/link";

import {
  productCardImageFitClass,
  productImageTileBg,
} from "@/lib/product-image-display";
import type { ShopProduct } from "@/data/shop-products";

type ShopProductCardProps = {
  product: ShopProduct;
};

const parsePrice = (price: string): number => Number.parseFloat(price.replace(/,/g, "").replace(/[^\d.]/g, "")) || 0;

const formatPkr = (value: number): string => `Rs.${value.toFixed(2)} PKR`;

export function ShopProductCard({ product }: ShopProductCardProps) {
  const discountedPrice = parsePrice(product.price);
  const originalPrice = discountedPrice + 301;

  return (
    <article className="group flex flex-col bg-white text-left">
      <Link className="relative block aspect-square w-full overflow-hidden bg-neutral-100" href={`/product/${product.slug}`}>
        <Image
          alt={product.title}
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          src={product.imageSrc}
        />
        <span className="absolute bottom-4 left-4 rounded-full bg-[#111] px-4 py-1.5 text-xs font-medium tracking-wide text-white">
          Sale
        </span>
      </Link>
      <div className="pt-4">
        <h4 className="font-serif text-base text-black">
          <Link className="transition-colors duration-200 hover:text-neutral-600" href={`/product/${product.slug}`}>
            {product.title}
          </Link>
        </h4>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-sm text-neutral-500 line-through">{formatPkr(originalPrice)}</span>
          <span className="text-base text-black">{product.price}</span>
        </div>
      </div>
    </article>
  );
}
