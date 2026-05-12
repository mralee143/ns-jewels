import Image from "next/image";

import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { formatOrderNumber } from "@/lib/order-format";
import { formatPkrDetailed } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";

type OrderAddressRow = {
  readonly addressLine1: string | null;
  readonly city: string | null;
  readonly country: string;
  readonly postalCode: string | null;
};

const formatAddress = (order: OrderAddressRow): string =>
  [order.addressLine1, order.city, order.postalCode, order.country].filter(Boolean).join(", ") || "Address not set";

const formatOrderDate = (date: Date): string =>
  date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatOrderTime = (date: Date): string =>
  date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

function ProductImageFallback() {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#F0D3DA] bg-[#FDF2F5] text-cta">
      <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path d="m12 3 7 7-7 11-7-11 7-7Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="M5 10h14M9 10l3 11 3-11M9 10l3-7 3 7" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    </span>
  );
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cta">Order Management</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#2B2B2B]">Orders</h1>
        </div>
        <p className="mt-2 max-w-xl text-sm text-[#6E6E6E]">
          Review every checkout order, update fulfillment status, and track COD totals in one table.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#F0D3DA] bg-white shadow-[0_18px_40px_rgba(216,92,108,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0D3DA] px-5 py-4">
          <h2 className="font-display text-2xl font-semibold text-[#2B2B2B]">All Orders</h2>
          <span className="rounded-full bg-[#FDF2F5] px-4 py-2 text-xs font-semibold text-cta ring-1 ring-[#F0D3DA]">
            {orders.length} orders
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1100px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#F0D3DA] bg-[#FDF2F5]/60 text-xs font-semibold uppercase tracking-wider text-[#6E6E6E]">
                <th className="px-5 py-4">Order ID</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Products</th>
                <th className="px-5 py-4">Address</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0D3DA]">
              {orders.length === 0 ? (
                <tr>
                  <td className="px-5 py-10 text-center text-[#6E6E6E]" colSpan={8}>
                    No orders yet. Complete a test checkout from the storefront.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr className="transition-colors hover:bg-[#FDF2F5]/35" key={order.id}>
                    <td className="px-5 py-4 align-top">
                      <p className="font-mono text-xs font-semibold text-[#2B2B2B]">{formatOrderNumber(order.id)}</p>
                      <p className="mt-1 max-w-[120px] truncate font-mono text-[11px] text-[#6E6E6E]">{order.id}</p>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <p className="font-semibold text-[#2B2B2B]">{order.customerName ?? "Guest checkout"}</p>
                      <p className="mt-1 max-w-[180px] truncate text-xs text-[#6E6E6E]">{order.email ?? "No email"}</p>
                      <p className="mt-1 text-xs text-[#6E6E6E]">{order.phone ?? "No phone"}</p>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="space-y-3">
                        {order.items.length === 0 ? (
                          <p className="text-sm text-[#6E6E6E]">No items</p>
                        ) : (
                          order.items.map((item) => (
                            <div className="flex items-center gap-3" key={item.id}>
                              {item.imageSrc ? (
                                <a
                                  aria-label={`Open ${item.productTitle} image`}
                                  className="group shrink-0 rounded-2xl outline-none ring-0 transition focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2"
                                  href={item.imageSrc}
                                  rel="noreferrer"
                                  target="_blank"
                                >
                                  <Image
                                    alt={item.productTitle}
                                    className="h-12 w-12 rounded-2xl border border-[#F0D3DA] bg-[#FDF2F5] object-cover transition group-hover:scale-105"
                                    height={48}
                                    src={item.imageSrc}
                                    width={48}
                                  />
                                </a>
                              ) : (
                                <ProductImageFallback />
                              )}
                              <div className="min-w-0">
                                <p className="max-w-[220px] truncate text-sm font-semibold text-[#2B2B2B]">
                                  {item.productTitle}
                                </p>
                                <p className="mt-1 text-xs text-[#6E6E6E]">
                                  Qty {item.quantity} · {formatPkrDetailed(item.unitPricePaisa * item.quantity)}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <p className="max-w-[240px] text-xs leading-relaxed text-[#6E6E6E]">{formatAddress(order)}</p>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <OrderStatusSelect orderId={order.id} status={order.status} />
                    </td>
                    <td className="px-5 py-4 align-top">
                      <p className="font-medium text-[#2B2B2B]">{formatOrderDate(order.createdAt)}</p>
                      <p className="mt-1 text-xs text-[#6E6E6E]">{formatOrderTime(order.createdAt)}</p>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <span className="rounded-full bg-[#FDF2F5] px-3 py-1 text-xs font-semibold uppercase text-cta ring-1 ring-[#F0D3DA]">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right align-top font-semibold text-[#2B2B2B]">
                      {formatPkrDetailed(order.totalPaisa)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
