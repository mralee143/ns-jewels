import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const PROFILE_FIELDS = [
  "shippingFullName",
  "shippingPhone",
  "shippingCountry",
  "shippingAddressLine1",
  "shippingCity",
  "shippingPostalCode",
] as const;

type ProfilePatch = Partial<Record<(typeof PROFILE_FIELDS)[number], unknown>>;

function trimOrNull(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const t = value.trim();
  return t.length > 0 ? t : null;
}

export async function GET(): Promise<Response> {
  const session = await auth();
  if (!session?.user?.email || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    select: {
      email: true,
      name: true,
      shippingAddressLine1: true,
      shippingCity: true,
      shippingCountry: true,
      shippingFullName: true,
      shippingPhone: true,
      shippingPostalCode: true,
    },
    where: { id: session.user.id },
  });

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    include: {
      items: {
        select: {
          id: true,
          imageSrc: true,
          productTitle: true,
          quantity: true,
          unitPricePaisa: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    where: {
      OR: [{ userId: session.user.id }, { email: { equals: user.email } }],
    },
  });

  return NextResponse.json({
    orders: orders.map((order) => ({
      createdAt: order.createdAt.toISOString(),
      customerName: order.customerName,
      deliveryPaisa: order.deliveryPaisa,
      id: order.id,
      items: order.items,
      paymentMethod: order.paymentMethod,
      status: order.status,
      subtotalPaisa: order.subtotalPaisa,
      taxPaisa: order.taxPaisa,
      totalPaisa: order.totalPaisa,
    })),
    profile: {
      email: user.email,
      name: user.name,
      shippingAddressLine1: user.shippingAddressLine1,
      shippingCity: user.shippingCity,
      shippingCountry: user.shippingCountry,
      shippingFullName: user.shippingFullName,
      shippingPhone: user.shippingPhone,
      shippingPostalCode: user.shippingPostalCode,
    },
  });
}

export async function PATCH(request: Request): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ProfilePatch;
  try {
    body = (await request.json()) as ProfilePatch;
  } catch {
    return NextResponse.json({ error: "Expected JSON body." }, { status: 400 });
  }

  const data: {
    shippingAddressLine1?: string | null;
    shippingCity?: string | null;
    shippingCountry?: string | null;
    shippingFullName?: string | null;
    shippingPhone?: string | null;
    shippingPostalCode?: string | null;
  } = {};

  for (const key of PROFILE_FIELDS) {
    if (key in body) {
      data[key] = trimOrNull(body[key]);
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update." }, { status: 400 });
  }

  const updated = await prisma.user.update({
    data: data as Prisma.UserUpdateInput,
    select: {
      email: true,
      name: true,
      shippingAddressLine1: true,
      shippingCity: true,
      shippingCountry: true,
      shippingFullName: true,
      shippingPhone: true,
      shippingPostalCode: true,
    },
    where: { id: session.user.id },
  });

  return NextResponse.json({
    profile: {
      email: updated.email,
      name: updated.name,
      shippingAddressLine1: updated.shippingAddressLine1,
      shippingCity: updated.shippingCity,
      shippingCountry: updated.shippingCountry,
      shippingFullName: updated.shippingFullName,
      shippingPhone: updated.shippingPhone,
      shippingPostalCode: updated.shippingPostalCode,
    },
  });
}
