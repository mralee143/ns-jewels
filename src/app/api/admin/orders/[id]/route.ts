import type { OrderStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { sendOrderConfirmedEmail, sendOrderShippedEmail } from "@/lib/order-emails";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin-session";

const ORDER_STATUSES: readonly OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "CANCELLED",
];

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext): Promise<Response> {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;

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
  const statusRaw = record.status;

  if (typeof statusRaw !== "string") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const status = ORDER_STATUSES.find((entry) => entry === statusRaw);
  if (!status) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const existingOrder = await prisma.order.findUnique({
    select: { status: true },
    where: { id },
  });

  if (!existingOrder) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const order = await prisma.order.update({
    data: { status },
    include: { items: true },
    where: { id },
  });

  const shouldSendConfirmedEmail = status === "CONFIRMED" && existingOrder.status !== "CONFIRMED";
  const shouldSendShippedEmail = status === "SHIPPED" && existingOrder.status !== "SHIPPED";
  let customerEmailSent = false;
  let customerEmailError: string | null = null;
  let customerEmailType: "confirmed" | "shipped" | null = null;

  if (shouldSendConfirmedEmail) {
    try {
      await sendOrderConfirmedEmail(order);
      customerEmailSent = true;
      customerEmailType = "confirmed";
    } catch (error: unknown) {
      customerEmailError = error instanceof Error ? error.message : String(error);
      customerEmailType = "confirmed";
      console.error(`[order email] Order ${order.id} confirmed notification failed: ${customerEmailError}`);
    }
  }

  if (shouldSendShippedEmail) {
    try {
      await sendOrderShippedEmail(order);
      customerEmailSent = true;
      customerEmailType = "shipped";
    } catch (error: unknown) {
      customerEmailError = error instanceof Error ? error.message : String(error);
      customerEmailType = "shipped";
      console.error(`[order email] Order ${order.id} shipped notification failed: ${customerEmailError}`);
    }
  }

  return NextResponse.json({ customerEmailError, customerEmailSent, customerEmailType, ok: true, status });
}
