import { NextResponse } from "next/server";

import { auth } from "@/auth";
import type { ShopProduct } from "@/data/shop-products";
import { getProductBySlug } from "@/lib/get-product-by-slug";
import { sendOrderPlacedEmails } from "@/lib/order-emails";
import { formatOrderNumber } from "@/lib/order-format";
import { calculateOrderTotals, parsePriceToPaisa } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";

type OrderItemInput = {
  readonly quantity: number;
  readonly slug: string;
};

const readTrimmed = (value: unknown): string | null =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : null;

export async function POST(request: Request): Promise<Response> {
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
  const itemsRaw = record.items;

  if (!Array.isArray(itemsRaw) || itemsRaw.length === 0) {
    return NextResponse.json({ error: "items required" }, { status: 400 });
  }

  const items: OrderItemInput[] = [];

  for (const row of itemsRaw) {
    if (!row || typeof row !== "object") {
      return NextResponse.json({ error: "Invalid item" }, { status: 400 });
    }
    const itemRecord = row as Record<string, unknown>;
    const slug = typeof itemRecord.slug === "string" ? itemRecord.slug.trim() : "";
    const quantity = Math.floor(Number(itemRecord.quantity));

    if (!slug || quantity < 1) {
      return NextResponse.json({ error: "Invalid item" }, { status: 400 });
    }

    items.push({ slug, quantity });
  }

  const resolved: { product: ShopProduct; quantity: number }[] = [];

  for (const { slug, quantity } of items) {
    const product = await getProductBySlug(slug);
    if (!product) {
      return NextResponse.json({ error: `Unknown product: ${slug}` }, { status: 400 });
    }
    resolved.push({ product, quantity });
  }

  const totals = calculateOrderTotals(resolved);

  const email = readTrimmed(record.email);
  const customerName = readTrimmed(record.customerName);
  const phone = readTrimmed(record.phone);
  const country = readTrimmed(record.country) ?? "Pakistan";
  const addressLine1 = readTrimmed(record.addressLine1);
  const city = readTrimmed(record.city);
  const postalCode = readTrimmed(record.postalCode);
  const paymentMethod =
    typeof record.paymentMethod === "string" && record.paymentMethod.trim().length > 0
      ? record.paymentMethod.trim()
      : "cod";

  const session = await auth();
  const userId = session?.user?.id;
  const sessionEmail = session?.user?.email?.trim().toLowerCase() ?? "";
  const orderEmailNorm = email?.trim().toLowerCase() ?? "";
  const linkUser =
    Boolean(userId) &&
    orderEmailNorm.length > 0 &&
    sessionEmail.length > 0 &&
    sessionEmail === orderEmailNorm;

  const order = await prisma.order.create({
    data: {
      addressLine1,
      city,
      country,
      customerName,
      deliveryPaisa: totals.deliveryPaisa,
      email,
      items: {
        create: resolved.map(({ product, quantity }) => ({
          imageSrc: product.imageSrc,
          productSlug: product.slug,
          productTitle: product.title,
          quantity,
          unitPricePaisa: parsePriceToPaisa(product.price),
        })),
      },
      paymentMethod,
      phone,
      postalCode,
      subtotalPaisa: totals.subtotalPaisa,
      taxPaisa: totals.taxPaisa,
      totalPaisa: totals.totalPaisa,
      userId: linkUser ? userId : undefined,
    },
    include: { items: true },
  });

  if (linkUser && userId) {
    await prisma.user.update({
      data: {
        shippingAddressLine1: addressLine1,
        shippingCity: city,
        shippingCountry: country,
        shippingFullName: customerName,
        shippingPhone: phone,
        shippingPostalCode: postalCode,
      },
      where: { id: userId },
    });
  }

  try {
    await sendOrderPlacedEmails(order);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[order email] Order ${order.id} notification failed: ${message}`);
  }

  return NextResponse.json({
    id: order.id,
    orderNumber: formatOrderNumber(order.id),
    receiverEmail: order.email,
  });
}
