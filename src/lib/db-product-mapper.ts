import type { Product as DbProduct, ProductImage } from "@prisma/client";

import { isProductCategorySlug, type ProductCategorySlug } from "@/data/product-categories";
import type { ShopProduct } from "@/data/shop-products";

type DbProductWithImages = DbProduct & {
  readonly images?: readonly ProductImage[];
};

export const shopPriceLabelFromPaisa = (paisa: number): string =>
  `Rs. ${(Math.max(0, paisa) / 100).toFixed(2)} PKR`;

export const parseRupeesInputToPaisa = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(Math.max(0, value) * 100);
  }
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return null;
  }
  const parsed = Number.parseFloat(trimmed.replace(/,/g, ""));
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return Math.round(Math.max(0, parsed) * 100);
};

const featureBulletsFromJson = (value: unknown): readonly string[] | undefined => {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const strings = value.filter((entry): entry is string => typeof entry === "string");
  return strings.length > 0 ? strings : undefined;
};

export const dbProductToShopProduct = (row: DbProductWithImages): ShopProduct | null => {
  if (!isProductCategorySlug(row.category)) {
    return null;
  }

  const category: ProductCategorySlug = row.category;
  const additionalOrdered = [...(row.images ?? [])]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((image) => image.url);

  const featureBullets = featureBulletsFromJson(row.featureBullets);

  return {
    category,
    description: row.description,
    id: row.slug,
    imageSrc: row.imageSrc,
    slug: row.slug,
    title: row.title,
    price: shopPriceLabelFromPaisa(row.pricePaisa),
    ...(row.compareAtPricePaisa !== null && row.compareAtPricePaisa !== undefined
      ? { compareAtPrice: shopPriceLabelFromPaisa(row.compareAtPricePaisa) }
      : {}),
    ...(additionalOrdered.length > 0 ? { additionalImages: additionalOrdered } : {}),
    ...(featureBullets ? { featureBullets } : {}),
  };
};
