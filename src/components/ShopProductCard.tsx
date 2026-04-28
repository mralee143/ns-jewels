import Image from "next/image";

import type { ShopProduct } from "@/data/shop-products";

type ShopProductCardProps = {
  product: ShopProduct;
};

export function ShopProductCard({ product }: ShopProductCardProps) {
  return (
    <article className="product-card-3d group bg-white text-left">
      <div className="relative overflow-hidden rounded-sm">
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
      </div>
      <div className="pt-3">
        <h4 className="font-mono text-[1rem] font-bold text-[#111827]">{product.title}</h4>
        <p className="mt-1 text-sm font-semibold text-[#1f2937]">{product.price}</p>
      </div>
    </article>
  );
}
