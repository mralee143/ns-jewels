import { Prisma } from "@prisma/client";

import type { ShopProduct } from "@/data/shop-products";
import { dbProductToShopProduct } from "@/lib/db-product-mapper";
import { prisma } from "@/lib/prisma";

const withImages = {
  images: {
    orderBy: { sortOrder: "asc" as const },
  },
} as const;

const recoverableCatalogReadErrorCodes = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ENOTFOUND",
  "ETIMEDOUT",
  "P1001",
  "P2021",
]);

const isRecoverableCatalogReadError = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  recoverableCatalogReadErrorCodes.has(error.code);

export async function findPublishedShopProducts(): Promise<readonly ShopProduct[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { published: true },
      include: withImages,
    });

    return rows
      .map(dbProductToShopProduct)
      .filter((product): product is ShopProduct => product !== null);
  } catch (error) {
    if (isRecoverableCatalogReadError(error)) {
      return [];
    }
    throw error;
  }
}

export async function findPublishedShopProductsByCategory(
  category: string
): Promise<readonly ShopProduct[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { published: true, category },
      include: withImages,
    });

    return rows
      .map(dbProductToShopProduct)
      .filter((product): product is ShopProduct => product !== null);
  } catch (error) {
    if (isRecoverableCatalogReadError(error)) {
      return [];
    }
    throw error;
  }
}

export async function findShopProductBySlugFromDb(slug: string): Promise<ShopProduct | null> {
  try {
    const row = await prisma.product.findFirst({
      where: { slug, published: true },
      include: withImages,
    });

    return row ? dbProductToShopProduct(row) : null;
  } catch (error) {
    if (isRecoverableCatalogReadError(error)) {
      return null;
    }
    throw error;
  }
}
