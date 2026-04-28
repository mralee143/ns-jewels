import Image from "next/image";
import Link from "next/link";

import { imageStemToAlt } from "@/data/product-categories";

type CategoryProductGridProps = {
  categoryLabel: string;
  images: readonly string[];
};

export function CategoryProductGrid({ categoryLabel, images }: CategoryProductGridProps) {
  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[#57534e]">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link className="text-[#581c87] transition-colors duration-200 hover:text-[#7e22ce]" href="/">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-[#a8a29e]">
            /
          </li>
          <li className="font-medium text-[#1c1917]">{categoryLabel}</li>
        </ol>
      </nav>
      <header className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78716c]">NS Jewels</p>
        <h1 className="mt-2 font-display text-3xl font-semibold italic tracking-[0.08em] text-[#1c1917] sm:text-4xl">
          {categoryLabel}
        </h1>
      </header>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((src) => {
          const alt = `${categoryLabel} — ${imageStemToAlt(src)}`;
          return (
            <figure
              className="group overflow-hidden rounded-2xl border border-[#f3e8ff] bg-white shadow-sm transition-[box-shadow,transform] duration-300 hover:shadow-lg"
              key={src}
            >
              <div className="relative aspect-square overflow-hidden bg-[#faf5ff]">
                <Image
                  alt={alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  src={src}
                />
              </div>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
