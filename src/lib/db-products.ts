import { Prisma } from "@prisma/client";

import type { ShopProduct } from "@/data/shop-products";
import { DatabaseConfigError } from "@/lib/db";
import { dbProductToShopProduct } from "@/lib/db-product-mapper";
import { prisma } from "@/lib/prisma";

const withImages = {
  images: {
    orderBy: { sortOrder: "asc" as const },
  },
} as const;

const recoverableCatalogReadErrorCodes = new Set<unknown>([
  45028,
  "ECONNREFUSED",
  "ECONNRESET",
  "ENOTFOUND",
  "ETIMEDOUT",
  "P1001",
  "P2021",
  "45028",
]);

const recoverableCatalogReadMessageSnippets = [
  "ECONNREFUSED",
  "ECONNRESET",
  "ENOTFOUND",
  "ETIMEDOUT",
  "failed to retrieve a connection from pool",
  "getaddrinfo ENOTFOUND",
  "pool timeout",
] as const;

type ErrorLike = {
  readonly cause?: unknown;
  readonly code?: unknown;
  readonly message?: unknown;
  readonly name?: unknown;
  readonly originalCode?: unknown;
  readonly originalMessage?: unknown;
};

const isErrorLike = (value: unknown): value is ErrorLike =>
  typeof value === "object" && value !== null;

const errorCodesFrom = (error: ErrorLike): readonly unknown[] => [
  error.code,
  error.originalCode,
];

const errorTextFrom = (error: ErrorLike): string =>
  [error.name, error.message, error.originalMessage]
    .filter((value): value is string => typeof value === "string")
    .join("\n");

const isRecoverableCatalogReadErrorLike = (error: unknown, depth = 0): boolean => {
  if (!isErrorLike(error) || depth > 3) {
    return false;
  }

  const hasRecoverableCode = errorCodesFrom(error).some((code) =>
    recoverableCatalogReadErrorCodes.has(code)
  );
  const text = errorTextFrom(error);
  const hasRecoverableMessage = recoverableCatalogReadMessageSnippets.some((snippet) =>
    text.includes(snippet)
  );

  return (
    hasRecoverableCode ||
    hasRecoverableMessage ||
    isRecoverableCatalogReadErrorLike(error.cause, depth + 1)
  );
};

const isRecoverableCatalogReadError = (error: unknown): boolean =>
  error instanceof DatabaseConfigError ||
  (error instanceof Prisma.PrismaClientKnownRequestError &&
    recoverableCatalogReadErrorCodes.has(error.code)) ||
  isRecoverableCatalogReadErrorLike(error);

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
