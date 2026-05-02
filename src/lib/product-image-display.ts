import type { ProductCategorySlug } from "@/data/product-categories";

/** Wide / flat product shots (e.g. anklet laid in a circle) need contain so edges are not cropped in square tiles. */
export function productCardImageFitClass(category: ProductCategorySlug): string {
  return category === "anklets"
    ? "object-contain object-center p-4 sm:p-5 transition-transform duration-700 group-hover:scale-[1.03]"
    : "object-cover object-center transition-transform duration-700 group-hover:scale-105";
}

export function productDetailHeroImageFitClass(category: ProductCategorySlug): string {
  return category === "anklets"
    ? "object-contain object-center p-6 sm:p-10"
    : "object-cover object-center";
}

export function productGalleryThumbFitClass(category: ProductCategorySlug): string {
  return category === "anklets" ? "object-contain object-center p-3 sm:p-4" : "object-cover object-center";
}

export function productImageTileBg(category: ProductCategorySlug): string {
  return category === "anklets" ? "bg-white" : "bg-neutral-100";
}
