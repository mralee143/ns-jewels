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
