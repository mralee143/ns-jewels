"use client";

import type { OrderStatus } from "@prisma/client";
import { signOutToHome } from "@/lib/sign-out-client";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { formatPkrDetailed } from "@/lib/pricing";

export type AccountProfilePayload = {
  readonly email: string;
  readonly name: string | null;
  readonly shippingAddressLine1: string | null;
  readonly shippingCity: string | null;
  readonly shippingCountry: string | null;
  readonly shippingFullName: string | null;
  readonly shippingPhone: string | null;
  readonly shippingPostalCode: string | null;
};

export type AccountOrderItemPayload = {
  readonly id: string;
  readonly imageSrc: string | null;
  readonly productTitle: string;
  readonly quantity: number;
  readonly unitPricePaisa: number;
};

export type AccountOrderPayload = {
  readonly createdAt: string;
  readonly customerName: string | null;
  readonly deliveryPaisa: number;
  readonly id: string;
  readonly items: readonly AccountOrderItemPayload[];
  readonly paymentMethod: string;
  readonly status: OrderStatus;
  readonly subtotalPaisa: number;
  readonly taxPaisa: number;
  readonly totalPaisa: number;
};

function statusLabel(status: OrderStatus): string {
  switch (status) {
    case "CANCELLED":
      return "Cancelled";
    case "CONFIRMED":
      return "Confirmed";
    case "PENDING":
      return "Pending";
    case "SHIPPED":
      return "Shipped";
    default:
      return status;
  }
}

type AccountPageContentProps = {
  readonly initialOrders: readonly AccountOrderPayload[];
  readonly initialProfile: AccountProfilePayload;
};

export function AccountPageContent({ initialOrders, initialProfile }: AccountPageContentProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveAddress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveError(null);
    setSaveOk(false);
    setSaving(true);
    try {
      const response = await fetch("/api/account", {
        body: JSON.stringify({
          shippingAddressLine1: profile.shippingAddressLine1,
          shippingCity: profile.shippingCity,
          shippingCountry: profile.shippingCountry,
          shippingFullName: profile.shippingFullName,
          shippingPhone: profile.shippingPhone,
          shippingPostalCode: profile.shippingPostalCode,
        }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });

      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const message =
          payload &&
          typeof payload === "object" &&
          "error" in payload &&
          typeof (payload as { error: unknown }).error === "string"
            ? (payload as { error: string }).error
            : null;
        setSaveError(message ?? "Could not save.");
        return;
      }

      const nextProfile =
        payload &&
        typeof payload === "object" &&
        "profile" in payload &&
        typeof (payload as { profile: unknown }).profile === "object" &&
        (payload as { profile: AccountProfilePayload }).profile
          ? (payload as { profile: AccountProfilePayload }).profile
          : null;

      if (nextProfile) {
        setProfile(nextProfile);
      }
      setSaveOk(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-8 flex flex-col gap-4 border-b border-[#F0D3DA] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[#2B2B2B]">My account</h1>
          <p className="mt-1 text-sm text-[#6E6E6E]">{profile.email}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            className="rounded-full border border-[#F0D3DA] bg-white px-4 py-2 text-sm font-semibold text-[#2B2B2B] transition-colors hover:bg-[#FDF2F5]"
            href="/products?page=1"
          >
            Continue shopping
          </Link>
          <button
            className="rounded-full bg-cta px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cta-hover"
            onClick={signOutToHome}
            type="button"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr]">
        <section className="rounded-2xl border border-[#F0D3DA] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#2B2B2B]">Saved delivery address</h2>
          <p className="mt-1 text-sm text-[#6E6E6E]">
            Used at checkout when you are signed in. Updating here saves it to your profile.
          </p>

          <form className="mt-6 space-y-4" noValidate onSubmit={(event) => void handleSaveAddress(event)}>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#2B2B2B]" htmlFor="ship-name">
                Full name
              </label>
              <input
                className="w-full rounded-xl border border-[#F0D3DA] bg-[#FDF2F5]/40 px-4 py-3 text-sm text-[#2B2B2B] outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20"
                id="ship-name"
                onChange={(event) => setProfile((previous) => ({ ...previous, shippingFullName: event.target.value }))}
                type="text"
                value={profile.shippingFullName ?? ""}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#2B2B2B]" htmlFor="ship-phone">
                Phone
              </label>
              <input
                className="w-full rounded-xl border border-[#F0D3DA] bg-[#FDF2F5]/40 px-4 py-3 text-sm text-[#2B2B2B] outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20"
                id="ship-phone"
                inputMode="tel"
                onChange={(event) => setProfile((previous) => ({ ...previous, shippingPhone: event.target.value }))}
                type="text"
                value={profile.shippingPhone ?? ""}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#2B2B2B]" htmlFor="ship-country">
                Country
              </label>
              <input
                className="w-full rounded-xl border border-[#F0D3DA] bg-[#FDF2F5]/40 px-4 py-3 text-sm text-[#2B2B2B] outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20"
                id="ship-country"
                onChange={(event) => setProfile((previous) => ({ ...previous, shippingCountry: event.target.value }))}
                type="text"
                value={profile.shippingCountry ?? ""}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#2B2B2B]" htmlFor="ship-line1">
                Address
              </label>
              <input
                className="w-full rounded-xl border border-[#F0D3DA] bg-[#FDF2F5]/40 px-4 py-3 text-sm text-[#2B2B2B] outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20"
                id="ship-line1"
                onChange={(event) =>
                  setProfile((previous) => ({ ...previous, shippingAddressLine1: event.target.value }))
                }
                type="text"
                value={profile.shippingAddressLine1 ?? ""}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#2B2B2B]" htmlFor="ship-city">
                  City
                </label>
                <input
                  className="w-full rounded-xl border border-[#F0D3DA] bg-[#FDF2F5]/40 px-4 py-3 text-sm text-[#2B2B2B] outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20"
                  id="ship-city"
                  onChange={(event) => setProfile((previous) => ({ ...previous, shippingCity: event.target.value }))}
                  type="text"
                  value={profile.shippingCity ?? ""}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#2B2B2B]" htmlFor="ship-postal">
                  Postal code
                </label>
                <input
                  className="w-full rounded-xl border border-[#F0D3DA] bg-[#FDF2F5]/40 px-4 py-3 text-sm text-[#2B2B2B] outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20"
                  id="ship-postal"
                  onChange={(event) =>
                    setProfile((previous) => ({ ...previous, shippingPostalCode: event.target.value }))
                  }
                  type="text"
                  value={profile.shippingPostalCode ?? ""}
                />
              </div>
            </div>

            {saveError ? (
              <p className="rounded-xl bg-[#FDE7EF] px-3 py-2 text-sm text-[#b84860]" role="alert">
                {saveError}
              </p>
            ) : null}
            {saveOk ? (
              <p className="rounded-xl bg-[#e8f8ef] px-3 py-2 text-sm text-[#1d6b45]" role="status">
                Address saved.
              </p>
            ) : null}

            <button
              className="w-full rounded-full bg-cta py-3 text-sm font-semibold text-white transition-colors hover:bg-cta-hover disabled:opacity-60"
              disabled={saving}
              type="submit"
            >
              {saving ? "Saving…" : "Save address"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-[#F0D3DA] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#2B2B2B]">Order history</h2>
          <p className="mt-1 text-sm text-[#6E6E6E]">Orders placed with this email while signed in are linked here.</p>

          {initialOrders.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-[#F0D3DA] bg-[#FDF2F5]/50 px-4 py-10 text-center">
              <p className="text-sm text-[#6E6E6E]">You have not placed an order yet.</p>
              <Link
                className="mt-4 inline-flex rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cta-hover"
                href="/products?page=1"
              >
                Browse jewelry
              </Link>
            </div>
          ) : (
            <ul className="mt-6 space-y-5">
              {initialOrders.map((order) => (
                <li className="rounded-xl border border-[#F0D3DA] bg-[#FDF2F5]/30 p-4" key={order.id}>
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#F0D3DA]/80 pb-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#6E6E6E]">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="mt-1 font-mono text-xs text-[#6E6E6E]">Order #{order.id.slice(-8)}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#2B2B2B] ring-1 ring-[#F0D3DA]">
                        {statusLabel(order.status)}
                      </span>
                      <p className="mt-2 text-lg font-semibold text-[#2B2B2B]">
                        {formatPkrDetailed(order.totalPaisa)}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-3">
                    {order.items.map((line) => (
                      <li className="flex gap-3" key={line.id}>
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-[#FDF2F5] ring-1 ring-[#F0D3DA]">
                          {line.imageSrc ?
                            // eslint-disable-next-line @next/next/no-img-element -- product URLs may be remote or local
                            <img alt={line.productTitle} className="h-full w-full object-cover" src={line.imageSrc} />
                          : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-[#2B2B2B]">{line.productTitle}</p>
                          <p className="text-xs text-[#6E6E6E]">
                            ×{line.quantity} · {formatPkrDetailed(line.unitPricePaisa * line.quantity)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-[#6E6E6E]">
                    Payment: {order.paymentMethod.toUpperCase()}
                    {order.customerName ? ` · ${order.customerName}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
