import type { ProductCategorySlug } from "@/data/product-categories";

/**
 * Category grid: cover fills the tile edge-to-edge (same for all categories).
 */
export function productCardImageFitClass(category: ProductCategorySlug): string {
  void category;
  return "object-cover object-center transition-transform duration-700 group-hover:scale-105";
}

export function productDetailHeroImageFitClass(category: ProductCategorySlug): string {
  void category;
  return "object-cover object-center";
}

export function productGalleryThumbFitClass(category: ProductCategorySlug): string {
  void category;
  return "object-cover object-center";
}

/** Category listing tiles: neutral wash behind product photos. */
export function productCategoryCardTileBg(category: ProductCategorySlug): string {
  void category;
  return "bg-neutral-100";
}

/** Product detail hero / gallery tile wash behind the image. */
export function productDetailImageTileBg(category: ProductCategorySlug): string {
  void category;
  return "bg-neutral-100";
}

/**
 * Cart & checkout thumbnails: cover fills the thumb (no empty bands from letterboxing).
 */
export function productCartThumbFitClass(category: ProductCategorySlug): string {
  void category;
  return "object-cover object-center";
}

export function productCheckoutThumbFitClass(category: ProductCategorySlug): string {
  void category;
  return "object-cover object-center";
}

export function productCartThumbBg(category: ProductCategorySlug): string {
  void category;
  return "bg-neutral-100";
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
