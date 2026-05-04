"use client";

import Link from "next/link";

import { FillImage } from "@/components/FillImage";
import type { ProductCategorySlug } from "@/data/product-categories";
import type { ShopProduct } from "@/data/shop-products";
import { productCardImageFitClass, productCategoryCardTileBg } from "@/lib/product-image-display";
import {
  formatPkrLine,
  parsePriceLabelToNumber,
  resolveCompareAtAmount,
} from "@/lib/product-price-display";

type CategoryProductCardProps = {
  category: ProductCategorySlug;
  product: ShopProduct;
};

export function CategoryProductCard({ category, product }: CategoryProductCardProps) {
  const originalPrice = resolveCompareAtAmount(product);
  const salePrice = parsePriceLabelToNumber(product.price);

  return (
    <article className="group flex flex-col bg-white text-left">
      <Link
        className={`relative block aspect-square w-full overflow-hidden ${productCategoryCardTileBg(category)}`}
        href={`/product/${product.slug}`}
      >
        <FillImage
          alt={product.title}
          className={productCardImageFitClass(category)}
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          src={product.imageSrc}
        />
        <span className="absolute bottom-4 left-4 rounded-full bg-[#111] px-4 py-1.5 text-xs font-medium tracking-wide text-white">
          Sale
        </span>
      </Link>
      <div className="pt-4">
        <h3 className="font-serif text-base text-black">
          <Link className="transition-colors duration-200 hover:text-neutral-600" href={`/product/${product.slug}`}>
            {product.title}
          </Link>
        </h3>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-sm text-neutral-500 line-through">{formatPkrLine(originalPrice)}</span>
          <span className="text-base text-black">{formatPkrLine(salePrice)}</span>
        </div>
      </div>
    </article>
  );
}
