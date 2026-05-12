import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { isProductCategorySlug } from "@/data/product-categories";
import {
  dbProductToShopProduct,
  parseRupeesInputToPaisa,
} from "@/lib/db-product-mapper";
import { normalizeProductSlug } from "@/lib/normalize-product-slug";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin-session";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const parseStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((entry): entry is string => typeof entry === "string").map((entry) => entry.trim());
};

export async function GET(_request: Request, context: RouteContext): Promise<Response> {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const row = await prisma.product.findUnique({
    include: {
      images: { orderBy: { sortOrder: "asc" } },
    },
    where: { id },
  });

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    product: {
      category: row.category,
      compareAtPricePaisa: row.compareAtPricePaisa,
      description: row.description,
      featureBullets: row.featureBullets,
      id: row.id,
      imageSrc: row.imageSrc,
      images: row.images.map((image) => ({
        id: image.id,
        sortOrder: image.sortOrder,
        url: image.url,
      })),
      pricePaisa: row.pricePaisa,
      published: row.published,
      slug: row.slug,
      title: row.title,
      updatedAt: row.updatedAt.toISOString(),
    },
  });
}

export async function PATCH(request: Request, context: RouteContext): Promise<Response> {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const existing = await prisma.product.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const record = body as Record<string, unknown>;

  const title =
    typeof record.title === "string" ? record.title.trim() : existing.title;
  const description =
    typeof record.description === "string" ? record.description.trim() : existing.description;
  const categoryRaw =
    typeof record.category === "string" ? record.category.trim() : existing.category;

  if (!title || !description || !isProductCategorySlug(categoryRaw)) {
    return NextResponse.json({ error: "Invalid title, description, or category" }, { status: 400 });
  }

  let nextSlug = existing.slug;
  if (typeof record.slug === "string" && record.slug.trim().length > 0) {
    nextSlug = normalizeProductSlug(record.slug.trim());
  }
  if (!nextSlug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  if (nextSlug !== existing.slug) {
    const slugTaken = await prisma.product.findUnique({ where: { slug: nextSlug } });
    if (slugTaken) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
  }

  const imageSrc =
    typeof record.imageSrc === "string" ? record.imageSrc.trim() : existing.imageSrc;
  if (!imageSrc.startsWith("/")) {
    return NextResponse.json({ error: "imageSrc must be a path starting with /" }, { status: 400 });
  }

  let pricePaisa = existing.pricePaisa;
  if (record.price !== undefined || record.priceRupees !== undefined) {
    const parsed = parseRupeesInputToPaisa(record.price ?? record.priceRupees);
    if (parsed === null || parsed < 1) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }
    pricePaisa = parsed;
  }

  let compareAtPricePaisa = existing.compareAtPricePaisa;
  if (record.compareAtPrice !== undefined || record.compareAtPriceRupees !== undefined) {
    const parsed = parseRupeesInputToPaisa(record.compareAtPrice ?? record.compareAtPriceRupees);
    compareAtPricePaisa = parsed === null ? null : parsed;
  }

  const published =
    typeof record.published === "boolean" ? record.published : existing.published;

  let featureBulletsValue: string[] | undefined;
  if (typeof record.featureBullets === "string") {
    featureBulletsValue = record.featureBullets
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  } else if (Array.isArray(record.featureBullets)) {
    featureBulletsValue = parseStringArray(record.featureBullets).filter((line) => line.length > 0);
  }

  const featureBulletsUpdate =
    featureBulletsValue !== undefined
      ? featureBulletsValue.length > 0
        ? featureBulletsValue
        : null
      : undefined;

  const shouldReplaceImages = Object.prototype.hasOwnProperty.call(record, "additionalImageUrls");
  const replacementImages = shouldReplaceImages
    ? parseStringArray(record.additionalImageUrls).filter((url) => url.startsWith("/"))
    : null;

  const updated = await prisma.$transaction(async (tx) => {
    if (shouldReplaceImages) {
      await tx.productImage.deleteMany({ where: { productId: id } });
    }

    return tx.product.update({
      data: {
        category: categoryRaw,
        compareAtPricePaisa,
        description,
        ...(featureBulletsUpdate !== undefined
          ? {
              featureBullets:
                featureBulletsUpdate === null ? Prisma.DbNull : featureBulletsUpdate,
            }
          : {}),
        imageSrc,
        pricePaisa,
        published,
        slug: nextSlug,
        title,
        ...(shouldReplaceImages && replacementImages !== null
          ? {
              images: {
                create: replacementImages.map((url, index) => ({
                  sortOrder: index,
                  url,
                })),
              },
            }
          : {}),
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
      },
      where: { id },
    });
  });

  const shop = dbProductToShopProduct(updated);
  return NextResponse.json({ product: shop });
}

export async function DELETE(_request: Request, context: RouteContext): Promise<Response> {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;

  try {
    await prisma.product.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
