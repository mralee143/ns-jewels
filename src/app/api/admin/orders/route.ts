import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin-session";

export async function GET(): Promise<Response> {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({
    orders: orders.map((order) => ({
      addressLine1: order.addressLine1,
      city: order.city,
      country: order.country,
      createdAt: order.createdAt.toISOString(),
      customerName: order.customerName,
      deliveryPaisa: order.deliveryPaisa,
      email: order.email,
      id: order.id,
      items: order.items.map((item) => ({
        id: item.id,
        imageSrc: item.imageSrc,
        productSlug: item.productSlug,
        productTitle: item.productTitle,
        quantity: item.quantity,
        unitPricePaisa: item.unitPricePaisa,
      })),
      paymentMethod: order.paymentMethod,
      phone: order.phone,
      postalCode: order.postalCode,
      status: order.status,
      subtotalPaisa: order.subtotalPaisa,
      taxPaisa: order.taxPaisa,
      totalPaisa: order.totalPaisa,
    })),
  });
}
