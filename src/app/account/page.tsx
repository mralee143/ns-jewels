import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  AccountPageContent,
  type AccountOrderPayload,
  type AccountProfilePayload,
} from "@/components/account/account-page-content";
import { FooterSection } from "@/components/FooterSection";
import { Navbar } from "@/components/Navbar";
import { WhatsAppFloatButton } from "@/components/WhatsAppFloatButton";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description: "Manage your NS Jewels delivery address and view your orders.",
  title: "My account | NS Jewels",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    redirect("/login?callbackUrl=/account");
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
    redirect("/login?callbackUrl=/account");
  }

  const ordersRaw = await prisma.order.findMany({
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

  const initialProfile: AccountProfilePayload = {
    email: user.email,
    name: user.name,
    shippingAddressLine1: user.shippingAddressLine1,
    shippingCity: user.shippingCity,
    shippingCountry: user.shippingCountry,
    shippingFullName: user.shippingFullName,
    shippingPhone: user.shippingPhone,
    shippingPostalCode: user.shippingPostalCode,
  };

  const initialOrders: AccountOrderPayload[] = ordersRaw.map((order) => ({
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
  }));

  return (
    <div className="flex min-h-screen flex-col bg-[#FDF2F5] text-black">
      <Navbar />
      <main className="flex-1">
        <AccountPageContent initialOrders={initialOrders} initialProfile={initialProfile} />
      </main>
      <FooterSection />
      <WhatsAppFloatButton />
    </div>
  );
}
