import { NextResponse } from "next/server";

import { formatPkrDatasetValue, formatPkrDetailed } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin-session";

const priceDatasetFieldsFromPaisa = (valuePaisa: number) => ({
  label: formatPkrDetailed(valuePaisa),
  pkr: formatPkrDatasetValue(valuePaisa),
});

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
    orders: orders.map((order) => {
      const delivery = priceDatasetFieldsFromPaisa(order.deliveryPaisa);
      const subtotal = priceDatasetFieldsFromPaisa(order.subtotalPaisa);
      const tax = priceDatasetFieldsFromPaisa(order.taxPaisa);
      const total = priceDatasetFieldsFromPaisa(order.totalPaisa);

      return {
        addressLine1: order.addressLine1,
        city: order.city,
        country: order.country,
        createdAt: order.createdAt.toISOString(),
        customerName: order.customerName,
        deliveryLabel: delivery.label,
        deliveryPaisa: order.deliveryPaisa,
        deliveryPkr: delivery.pkr,
        email: order.email,
        id: order.id,
        items: order.items.map((item) => {
          const lineTotal = priceDatasetFieldsFromPaisa(item.unitPricePaisa * item.quantity);
          const unitPrice = priceDatasetFieldsFromPaisa(item.unitPricePaisa);

          return {
            id: item.id,
            imageSrc: item.imageSrc,
            lineTotalLabel: lineTotal.label,
            lineTotalPkr: lineTotal.pkr,
            productSlug: item.productSlug,
            productTitle: item.productTitle,
            quantity: item.quantity,
            unitPriceLabel: unitPrice.label,
            unitPricePaisa: item.unitPricePaisa,
            unitPricePkr: unitPrice.pkr,
          };
        }),
        paymentMethod: order.paymentMethod,
        phone: order.phone,
        postalCode: order.postalCode,
        status: order.status,
        subtotalLabel: subtotal.label,
        subtotalPaisa: order.subtotalPaisa,
        subtotalPkr: subtotal.pkr,
        taxLabel: tax.label,
        taxPaisa: order.taxPaisa,
        taxPkr: tax.pkr,
        totalLabel: total.label,
        totalPaisa: order.totalPaisa,
        totalPkr: total.pkr,
      };
    }),
  });
}
