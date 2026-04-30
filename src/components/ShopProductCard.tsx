"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/components/CartProvider";
import type { ShopProduct } from "@/data/shop-products";

type ShopProductCardProps = {
  product: ShopProduct;
};

const parsePrice = (price: string): number => Number.parseFloat(price.replace(/,/g, "").replace(/[^\d.]/g, "")) || 0;

const formatPkr = (value: number): string => `Rs.${value.toFixed(2)} PKR`;

export function ShopProductCard({ product }: ShopProductCardProps) {
  const { addToCart } = useCart();
  const discountedPrice = parsePrice(product.price);
  const originalPrice = discountedPrice + 301;
  const handleMouseMove: React.MouseEventHandler<HTMLElement> = (event) => {
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    const rotateY = ((x - centerX) / centerX) * 7;
    const rotateX = ((centerY - y) / centerY) * 5;

    card.style.setProperty("--card-rotate-x", `${rotateX.toFixed(2)}deg`);
    card.style.setProperty("--card-rotate-y", `${rotateY.toFixed(2)}deg`);
    card.style.setProperty("--shine-x", `${((x / bounds.width) * 100).toFixed(2)}%`);
    card.style.setProperty("--shine-y", `${((y / bounds.height) * 100).toFixed(2)}%`);
  };

  const handleMouseLeave: React.MouseEventHandler<HTMLElement> = (event) => {
    const card = event.currentTarget;
    card.style.setProperty("--card-rotate-x", "0deg");
    card.style.setProperty("--card-rotate-y", "0deg");
    card.style.setProperty("--shine-x", "50%");
    card.style.setProperty("--shine-y", "50%");
  };

  return (
    <article
      className="product-card-3d group bg-white text-left"
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div className="product-card-3d-surface">
      <Link className="relative block overflow-hidden rounded-sm" href={`/product/${product.slug}`}>
        <Image
          alt={product.title}
          className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-60"
          height={330}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          src={product.imageSrc}
          width={320}
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-[#111827] px-3 py-1 text-[0.65rem] font-medium text-white">
          Sale
        </span>
      </Link>
      <div className="pt-3">
        <h4 className="font-mono text-[1rem] font-bold text-[#111827]">
          <Link className="transition-colors duration-200 hover:text-[#7e22ce]" href={`/product/${product.slug}`}>
            {product.title}
          </Link>
        </h4>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs text-[#78716c] line-through">{formatPkr(originalPrice)}</span>
          <span className="text-sm font-semibold text-[#1f2937]">{product.price}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-[#57534e]">{product.description}</p>
        <div className="mt-3 flex items-center gap-2">
          <button
            className="rounded-full bg-[#581c87] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:bg-[#7e22ce]"
            onClick={() => addToCart(product)}
            type="button"
          >
            Add to cart
          </button>
          <Link
            className="rounded-full border border-[#581c87] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#581c87] transition-colors duration-200 hover:bg-[#f3e8ff]"
            href={`/product/${product.slug}`}
          >
            Details
          </Link>
        </div>
      </div>
      </div>
    </article>
  );
}
