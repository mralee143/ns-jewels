import type { OrderStatus } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

import { isProductCategorySlug, PRODUCT_CATEGORY_LABELS } from "@/data/product-categories";
import { shopPriceLabelFromPaisa } from "@/lib/db-product-mapper";
import { formatPkrDetailed } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";

const ORDER_STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  CANCELLED: "bg-[#fff1f2] text-[#9f1239] ring-[#fecdd3]",
  CONFIRMED: "bg-[#ecfdf5] text-[#047857] ring-[#a7f3d0]",
  PENDING: "bg-[#fffbeb] text-[#92400e] ring-[#fde68a]",
  SHIPPED: "bg-[#eff6ff] text-[#1d4ed8] ring-[#bfdbfe]",
};

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  CANCELLED: "Cancelled",
  CONFIRMED: "Paid",
  PENDING: "Pending",
  SHIPPED: "Shipped",
};

type DashboardOrderItem = {
  readonly imageSrc: string | null;
  readonly productTitle: string;
  readonly quantity: number;
};

const formatItemsLine = (items: readonly DashboardOrderItem[]): string =>
  items.map((item) => `${item.productTitle} ×${item.quantity}`).join(", ") || "No items";

const formatOrderId = (id: string): string => `#${id.slice(-8).toUpperCase()}`;

const formatDate = (date: Date): string =>
  date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatTime = (date: Date): string =>
  date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

function RevenueIcon() {
  return (
    <svg aria-hidden="true" className="h-8 w-8" fill="none" viewBox="0 0 24 24">
      <path d="M6 9h12l-1.2 9H7.2L6 9Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="m8 9 4-5 4 5M9 13h6M10 16h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg aria-hidden="true" className="h-8 w-8" fill="none" viewBox="0 0 24 24">
      <path d="M7 8h10l-.7 11H7.7L7 8Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M9 8a3 3 0 0 1 6 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function ProductsIcon() {
  return (
    <svg aria-hidden="true" className="h-8 w-8" fill="none" viewBox="0 0 24 24">
      <path d="m12 3 7 7-7 11-7-11 7-7Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M5 10h14M9 10l3 11 3-11M9 10l3-7 3 7" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function ShipmentsIcon() {
  return (
    <svg aria-hidden="true" className="h-8 w-8" fill="none" viewBox="0 0 24 24">
      <path d="M4 7h10v9H4V7Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M14 10h3l3 3v3h-6v-6Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export default async function AdminDashboardPage() {
  const [revenue, orderCount, pendingShipmentCount, productCount, recentOrders, topProducts] = await Promise.all([
    prisma.order.aggregate({
      _sum: { totalPaisa: true },
    }),
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ["PENDING", "CONFIRMED"] } } }),
    prisma.product.count(),
    prisma.order.findMany({
      include: {
        items: {
          select: { imageSrc: true, productTitle: true, quantity: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.product.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        category: true,
        id: true,
        imageSrc: true,
        pricePaisa: true,
        published: true,
        title: true,
        updatedAt: true,
      },
      take: 5,
    }),
  ]);

  const stats = [
    {
      detail: "Store earnings",
      icon: RevenueIcon,
      label: "Total Revenue",
      value: formatPkrDetailed(revenue._sum.totalPaisa ?? 0),
    },
    {
      detail: "All checkout orders",
      icon: OrdersIcon,
      label: "New Orders",
      value: orderCount.toString(),
    },
    {
      detail: "Catalog products",
      icon: ProductsIcon,
      label: "Products",
      value: productCount.toString(),
    },
    {
      detail: "Needs attention",
      icon: ShipmentsIcon,
      label: "Pending Shipments",
      value: pendingShipmentCount.toString(),
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <section className="rounded-3xl border border-[#F0D3DA] bg-white p-4 shadow-[0_18px_40px_rgba(216,92,108,0.08)] sm:p-5" key={stat.label}>
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FDF2F5] text-cta ring-1 ring-[#F0D3DA] sm:h-16 sm:w-16">
                  <Icon />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#2B2B2B] sm:text-sm">{stat.label}</p>
                  <p className="mt-1 truncate font-display text-2xl font-semibold text-[#2B2B2B] sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs text-[#6E6E6E]">
                    <span className="font-semibold text-emerald-600">↑</span> {stat.detail}
                  </p>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="overflow-hidden rounded-3xl border border-[#F0D3DA] bg-white shadow-[0_18px_40px_rgba(216,92,108,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0D3DA] px-5 py-4">
            <h1 className="font-display text-xl font-semibold tracking-tight text-[#2B2B2B] sm:text-2xl">Recent Orders</h1>
            <Link
              className="rounded-xl border border-[#F0D3DA] px-4 py-2 text-xs font-semibold text-cta transition-colors hover:bg-[#FDF2F5]"
              href="/admin/orders"
            >
              View All Orders
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[820px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#F0D3DA] bg-[#FDF2F5]/50 text-xs font-semibold text-[#6E6E6E]">
                  <th className="px-5 py-4">Order ID</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0D3DA]">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td className="px-5 py-10 text-center text-[#6E6E6E]" colSpan={6}>
                      No orders yet. Complete a checkout to see orders here.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => {
                    const firstItem = order.items[0] ?? null;

                    return (
                      <tr className="transition-colors hover:bg-[#FDF2F5]/35" key={order.id}>
                        <td className="px-5 py-4 font-mono text-xs font-semibold text-[#2B2B2B]">
                          {formatOrderId(order.id)}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-[#2B2B2B]">{order.customerName ?? "Guest checkout"}</p>
                          <p className="mt-1 max-w-[180px] truncate text-xs text-[#6E6E6E]">{order.email ?? order.phone ?? "No contact"}</p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {firstItem?.imageSrc ? (
                              <Image
                                alt={firstItem.productTitle}
                                className="h-11 w-11 rounded-xl border border-[#F0D3DA] bg-[#FDF2F5] object-cover"
                                height={44}
                                src={firstItem.imageSrc}
                                width={44}
                              />
                            ) : (
                              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#F0D3DA] bg-[#FDF2F5] text-cta">
                                <ProductsIcon />
                              </span>
                            )}
                            <div className="min-w-0">
                              <p className="max-w-[160px] truncate font-semibold text-[#2B2B2B]">
                                {firstItem?.productTitle ?? "No product"}
                              </p>
                              <p className="mt-1 max-w-[180px] truncate text-xs text-[#6E6E6E]">{formatItemsLine(order.items)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${ORDER_STATUS_BADGE_CLASSES[order.status]}`}
                          >
                            {ORDER_STATUS_LABELS[order.status]}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-[#2B2B2B]">{formatDate(order.createdAt)}</p>
                          <p className="mt-1 text-xs text-[#6E6E6E]">{formatTime(order.createdAt)}</p>
                        </td>
                        <td className="px-5 py-4 text-right font-semibold text-[#2B2B2B]">
                          {formatPkrDetailed(order.totalPaisa)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-[#F0D3DA] bg-white p-5 shadow-[0_18px_40px_rgba(216,92,108,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-[#2B2B2B]">Top Products</h2>
            <Link
              className="rounded-xl border border-[#F0D3DA] px-4 py-2 text-xs font-semibold text-cta transition-colors hover:bg-[#FDF2F5]"
              href="/admin/products"
            >
              View All Products
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {topProducts.length === 0 ? (
              null
            ) : (
              topProducts.map((product) => (
                <article className="flex items-center gap-4 border-b border-[#F0D3DA] pb-4 last:border-0 last:pb-0" key={product.id}>
                  <Image
                    alt={product.title}
                    className="h-16 w-16 rounded-2xl border border-[#F0D3DA] bg-[#FDF2F5] object-cover"
                    height={64}
                    src={product.imageSrc}
                    width={64}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-[#2B2B2B]">{product.title}</h3>
                    <p className="mt-1 truncate text-xs text-[#6E6E6E]">
                      {isProductCategorySlug(product.category) ? PRODUCT_CATEGORY_LABELS[product.category] : product.category}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#2B2B2B]">{shopPriceLabelFromPaisa(product.pricePaisa)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-cta">{product.published ? "Live" : "Draft"}</p>
                    <p className="mt-1 text-xs text-[#6E6E6E]">{formatDate(product.updatedAt)}</p>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
