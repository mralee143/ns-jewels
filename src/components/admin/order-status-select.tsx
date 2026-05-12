"use client";

import type { OrderStatus } from "@prisma/client";
import { useState } from "react";

const OPTIONS: readonly OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPED", "CANCELLED"];

type OrderStatusSelectProps = {
  readonly orderId: string;
  readonly status: OrderStatus;
};

type StatusUpdateResponse = {
  readonly customerEmailError?: string | null;
  readonly customerEmailSent?: boolean;
  readonly customerEmailType?: "confirmed" | "shipped" | null;
  readonly status?: OrderStatus;
};

export function OrderStatusSelect({ orderId, status: initialStatus }: OrderStatusSelectProps) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="space-y-2">
      <select
        className="rounded-lg border border-[#F0D3DA] bg-white px-2 py-1 text-xs font-medium text-[#2B2B2B] outline-none focus:border-cta disabled:opacity-50"
        disabled={pending}
        onChange={async (event) => {
          const next = event.target.value as OrderStatus;
          setNotice(null);
          setPending(true);
          try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
              body: JSON.stringify({ status: next }),
              headers: { "Content-Type": "application/json" },
              method: "PATCH",
            });
            const payload = (await response.json().catch(() => null)) as StatusUpdateResponse | null;
            if (response.ok) {
              setStatus(next);
              setNotice(
                payload?.customerEmailSent
                  ? payload.customerEmailType === "confirmed"
                    ? "Order confirmed email sent."
                    : "Shipment email sent."
                  : payload?.customerEmailError
                    ? "Status saved; customer email failed."
                    : "Status updated.",
              );
              return;
            }
            setNotice("Could not update status.");
          } finally {
            setPending(false);
          }
        }}
        value={status}
      >
        {OPTIONS.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      {notice ? <p className="max-w-[150px] text-[11px] leading-snug text-[#6E6E6E]">{notice}</p> : null}
    </div>
  );
}
