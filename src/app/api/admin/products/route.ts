import { NextResponse } from "next/server";

import { isProductCategorySlug } from "@/data/product-categories";
import {
  dbProductToShopProduct,
  parseRupeesInputToPaisa,
} from "@/lib/db-product-mapper";
import { normalizeProductSlug } from "@/lib/normalize-product-slug";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin-session";

const parseStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((entry): entry is string => typeof entry === "string").map((entry) => entry.trim());
};

export async function GET(): Promise<Response> {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await prisma.product.findMany({
    include: {
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { updatedAt: "desc" },
    take: 500,
  });

  return NextResponse.json({
    products: rows.map((row) => ({
      category: row.category,
      compareAtPricePaisa: row.compareAtPricePaisa,
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
      description: row.description,
      updatedAt: row.updatedAt.toISOString(),
    })),
  });
}

export async function POST(request: Request): Promise<Response> {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
  const title = typeof record.title === "string" ? record.title.trim() : "";
  const description = typeof record.description === "string" ? record.description.trim() : "";
  const categoryRaw = typeof record.category === "string" ? record.category.trim() : "";

  if (!title || !description || !isProductCategorySlug(categoryRaw)) {
    return NextResponse.json({ error: "Invalid title, description, or category" }, { status: 400 });
  }

  const slugSource =
    typeof record.slug === "string" && record.slug.trim().length > 0
      ? record.slug.trim()
      : title;
  const slug = normalizeProductSlug(slugSource);

  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const imageSrc = typeof record.imageSrc === "string" ? record.imageSrc.trim() : "";
  if (!imageSrc.startsWith("/")) {
    return NextResponse.json({ error: "imageSrc must be a path starting with /" }, { status: 400 });
  }

  const pricePaisa = parseRupeesInputToPaisa(record.price ?? record.priceRupees);
  if (pricePaisa === null || pricePaisa < 1) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  let compareAtPricePaisa: number | null = null;
  if (record.compareAtPrice !== undefined || record.compareAtPriceRupees !== undefined) {
    const parsed = parseRupeesInputToPaisa(record.compareAtPrice ?? record.compareAtPriceRupees);
    compareAtPricePaisa = parsed === null ? null : parsed;
  }

  const additionalUrls = parseStringArray(record.additionalImageUrls).filter(
    (url) => url.startsWith("/")
  );
  const featureLines =
    typeof record.featureBullets === "string"
      ? record.featureBullets
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
      : parseStringArray(record.featureBullets);
  const published = record.published === false ? false : true;

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const created = await prisma.product.create({
    data: {
      category: categoryRaw,
      compareAtPricePaisa,
      description,
      featureBullets: featureLines.length > 0 ? featureLines : undefined,
      imageSrc,
      images: {
        create: additionalUrls.map((url, index) => ({
          sortOrder: index,
          url,
        })),
      },
      pricePaisa,
      published,
      slug,
      title,
    },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  const shop = dbProductToShopProduct(created);
  return NextResponse.json({ product: shop, id: created.id }, { status: 201 });
}
