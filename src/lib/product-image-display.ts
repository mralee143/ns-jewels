import type { ProductCategorySlug } from "@/data/product-categories";

/** Category grid: anklets only use contain (flat circular lay). */
const categoryCardContainCategories: ReadonlySet<ProductCategorySlug> = new Set(["anklets"]);

/** PDP + gallery: anklets only use contain so thin layouts stay uncropped. */
const detailPageContainCategories: ReadonlySet<ProductCategorySlug> = new Set(["anklets"]);

/**
 * Category grid: sets and most categories use cover (edge-to-edge, no letterboxing). Anklets use
 * contain on a square tile.
 */
export function productCardImageFitClass(category: ProductCategorySlug): string {
  return categoryCardContainCategories.has(category)
    ? "object-contain object-center p-4 sm:p-5 transition-transform duration-700 group-hover:scale-[1.03]"
    : "object-cover object-center transition-transform duration-700 group-hover:scale-105";
}

export function productDetailHeroImageFitClass(category: ProductCategorySlug): string {
  return detailPageContainCategories.has(category)
    ? "object-contain object-center p-6 sm:p-10"
    : "object-cover object-center";
}

export function productGalleryThumbFitClass(category: ProductCategorySlug): string {
  return detailPageContainCategories.has(category)
    ? "object-contain object-center p-3 sm:p-4"
    : "object-cover object-center";
}

/** Category listing tiles: white behind contain (anklets); neutral behind cover. */
export function productCategoryCardTileBg(category: ProductCategorySlug): string {
  return categoryCardContainCategories.has(category) ? "bg-white" : "bg-neutral-100";
}

/** Product detail hero / gallery tile wash behind the image (mostly visible with contain). */
export function productDetailImageTileBg(category: ProductCategorySlug): string {
  return detailPageContainCategories.has(category) ? "bg-white" : "bg-neutral-100";
}

/**
 * Cart & checkout thumbnails: anklets use contain; sets and others use cover (no empty bands).
 */
export function productCartThumbFitClass(category: ProductCategorySlug): string {
  return detailPageContainCategories.has(category)
    ? "object-contain object-center p-1.5 sm:p-2"
    : "object-cover object-center";
}

/** Checkout sidebar — lighter padding for contain (anklets) only. */
export function productCheckoutThumbFitClass(category: ProductCategorySlug): string {
  return detailPageContainCategories.has(category)
    ? "object-contain object-center p-0.5 sm:p-1"
    : "object-cover object-center";
}

export function productCartThumbBg(category: ProductCategorySlug): string {
  return detailPageContainCategories.has(category) ? "bg-white" : "bg-neutral-100";
}

/** Cart page row thumbnail. */
export function productCartPageThumbShellClass(category: ProductCategorySlug): string {
  return `relative h-24 w-24 shrink-0 overflow-hidden rounded-xl ${productCartThumbBg(category)}`;
}

/** Cart page — larger thumb for coordinated sets (still cover-filled). */
export function productCartPageSetsThumbShellClass(category: ProductCategorySlug): string {
  return `relative h-32 w-32 shrink-0 overflow-hidden rounded-xl sm:h-36 sm:w-36 ${productCartThumbBg(category)}`;
}

/** Checkout summary — slightly larger hit area for set rows. */
export function productCheckoutThumbShellClass(category: ProductCategorySlug): string {
  const dim = category === "sets" ? "h-20 w-20 sm:h-[5.25rem] sm:w-[5.25rem]" : "h-14 w-14";
  return `relative ${dim} shrink-0 overflow-hidden rounded-lg border border-[#cbd5e1] ${productCartThumbBg(category)}`;
}
