"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useCart } from "@/components/CartProvider";
import { SHOP_PRODUCTS_BY_SLUG, type ShopProduct } from "@/data/shop-products";
import { formatOrderNumber } from "@/lib/order-format";
import { calculateOrderTotals, formatPkrDetailed, parsePriceToPaisa, TAX_RATE } from "@/lib/pricing";

type CreateOrderResponse = {
  readonly error?: string;
  readonly id?: string;
  readonly orderNumber?: string;
  readonly receiverEmail?: string | null;
};

type OrderConfirmation = {
  readonly orderNumber: string;
  readonly receiverEmail: string | null;
};

export function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();
  const checkoutPrefilled = useRef(false);
  const { clearCart, items } = useCart();
  const buyNowSlug = searchParams.get("buyNowSlug");
  const buyNowQuantityRaw = searchParams.get("quantity");
  const buyNowQuantity = Math.max(1, Number.parseInt(buyNowQuantityRaw ?? "1", 10) || 1);

  const localBuyNowProduct = buyNowSlug ? SHOP_PRODUCTS_BY_SLUG[buyNowSlug] : undefined;
  const needsRemoteBuyNow = Boolean(buyNowSlug && !localBuyNowProduct);

  const [remoteBuyNowProduct, setRemoteBuyNowProduct] = useState<ShopProduct | undefined>(undefined);
  const [remoteBuyNowLoading, setRemoteBuyNowLoading] = useState(needsRemoteBuyNow);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("Pakistan");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (
      checkoutPrefilled.current ||
      sessionStatus !== "authenticated" ||
      !session?.user?.email
    ) {
      return;
    }

    let cancelled = false;

    void fetch("/api/account")
      .then((response) => {
        if (!response.ok) {
          throw new Error("account");
        }
        return response.json() as Promise<{
          profile: {
            shippingAddressLine1: string | null;
            shippingCity: string | null;
            shippingCountry: string | null;
            shippingFullName: string | null;
            shippingPhone: string | null;
            shippingPostalCode: string | null;
          };
        }>;
      })
      .then((data) => {
        if (cancelled || !data.profile) {
          return;
        }
        checkoutPrefilled.current = true;
        const emailValue = session.user?.email;
        if (emailValue) {
          setEmail(emailValue);
        }
        const profile = data.profile;
        if (profile.shippingFullName?.trim()) {
          const parts = profile.shippingFullName.trim().split(/\s+/);
          setFirstName(parts[0] ?? "");
          setLastName(parts.slice(1).join(" "));
        }
        setCountry(profile.shippingCountry?.trim() || "Pakistan");
        setAddressLine1(profile.shippingAddressLine1 ?? "");
        setCity(profile.shippingCity ?? "");
        setPostalCode(profile.shippingPostalCode ?? "");
        setPhone(profile.shippingPhone ?? "");
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [session?.user?.email, sessionStatus]);

  useEffect(() => {
    if (!needsRemoteBuyNow || !buyNowSlug) {
      return;
    }

    const slug = buyNowSlug;
    let cancelled = false;

    fetch(`/api/products/${encodeURIComponent(slug)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("fetch");
        }
        return res.json() as Promise<ShopProduct>;
      })
      .then((data) => {
        if (!cancelled) {
          setRemoteBuyNowProduct(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRemoteBuyNowProduct(undefined);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setRemoteBuyNowLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [buyNowSlug, needsRemoteBuyNow]);

  const resolvedBuyNowProduct = localBuyNowProduct ?? remoteBuyNowProduct;

  const checkoutItems = useMemo(() => {
    if (buyNowSlug && resolvedBuyNowProduct) {
      return [{ product: resolvedBuyNowProduct, quantity: buyNowQuantity }];
    }
    if (buyNowSlug) {
      return [];
    }
    return items;
  }, [buyNowQuantity, buyNowSlug, items, resolvedBuyNowProduct]);

  const totals = calculateOrderTotals(checkoutItems);

  if (buyNowSlug && needsRemoteBuyNow && remoteBuyNowLoading) {
    return (
      <div className="rounded-2xl border border-[#F0D3DA] bg-white p-10 text-center">
        <p className="text-sm font-medium text-[#2B2B2B]">Loading checkout…</p>
      </div>
    );
  }

  if (buyNowSlug && needsRemoteBuyNow && !remoteBuyNowLoading && !remoteBuyNowProduct) {
    return (
      <div className="rounded-2xl border border-[#F0D3DA] bg-white p-8 text-center">
        <h2 className="text-2xl font-semibold text-[#2B2B2B]">Product not found</h2>
        <p className="mt-2 text-sm text-[#6E6E6E]">This buy-now link may be outdated.</p>
        <Link
          className="mt-6 inline-flex rounded-full bg-cta px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-cta-hover"
          href="/products?page=1"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  if (orderConfirmation) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-[#F0D3DA] bg-white p-6 text-center shadow-[0_18px_45px_rgba(216,92,108,0.12)] sm:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FDF2F5] text-cta ring-1 ring-[#F0D3DA]">
          <svg aria-hidden="true" className="h-8 w-8" fill="none" viewBox="0 0 24 24">
            <path
              d="m5 12 4 4L19 6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-cta">Order Confirmed</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-[#2B2B2B]">Thank you for your order</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6E6E6E]">
          We received your order and sent the details to the receiver email below. Our admin team has also been
          notified.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#F0D3DA] bg-[#FDF2F5]/70 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6E6E6E]">Order number</p>
            <p className="mt-2 font-mono text-lg font-semibold text-[#2B2B2B]">{orderConfirmation.orderNumber}</p>
          </div>
          <div className="rounded-2xl border border-[#F0D3DA] bg-[#FDF2F5]/70 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6E6E6E]">Receiver email</p>
            <p className="mt-2 break-all text-sm font-semibold text-[#2B2B2B]">
              {orderConfirmation.receiverEmail ?? "No email provided"}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-full bg-cta px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-cta-hover"
            href="/products?page=1"
          >
            Continue shopping
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-[#F0D3DA] bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#2B2B2B] transition-colors duration-200 hover:bg-[#FDF2F5]"
            href="/"
          >
            Back home
          </Link>
        </div>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="rounded-2xl border border-[#f3e8ff] bg-white p-8 text-center">
        <h2 className="text-2xl font-semibold text-black">Your cart is empty</h2>
        <p className="mt-2 text-sm text-black">Add items to continue checkout.</p>
        <Link
          className="mt-6 inline-flex rounded-full bg-cta px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-cta-hover"
          href="/products?page=1"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <form
      className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]"
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitError(null);
        setIsSubmitting(true);

        const customerName = `${firstName} ${lastName}`.trim();

        try {
          const response = await fetch("/api/orders", {
            body: JSON.stringify({
              addressLine1,
              city,
              country,
              customerName: customerName.length > 0 ? customerName : undefined,
              email: email.trim().length > 0 ? email.trim() : undefined,
              items: checkoutItems.map((line) => ({
                quantity: line.quantity,
                slug: line.product.slug,
              })),
              paymentMethod: "cod",
              phone: phone.trim().length > 0 ? phone.trim() : undefined,
              postalCode: postalCode.trim().length > 0 ? postalCode.trim() : undefined,
            }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
          });

          if (!response.ok) {
            const payload = (await response.json().catch(() => null)) as CreateOrderResponse | null;
            setSubmitError(payload?.error ?? "Could not place order.");
            return;
          }

          const payload = (await response.json().catch(() => null)) as CreateOrderResponse | null;
          const orderNumber =
            typeof payload?.orderNumber === "string"
              ? payload.orderNumber
              : typeof payload?.id === "string"
                ? formatOrderNumber(payload.id)
                : "Confirmed";

          if (!searchParams.get("buyNowSlug")) {
            clearCart();
          }
          setOrderConfirmation({
            orderNumber,
            receiverEmail: typeof payload?.receiverEmail === "string" ? payload.receiverEmail : null,
          });
        } catch {
          setSubmitError("Could not place order. Try again.");
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <div className="space-y-6">
        {submitError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {submitError}
          </div>
        ) : null}

        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-black">Contact</h2>
            <Link
              className="text-sm font-medium text-black transition-colors duration-200 hover:text-neutral-800"
              href="/login"
            >
              Sign in
            </Link>
          </div>
          <input
            className="mt-3 w-full rounded-md border border-[#cbd5e1] bg-white px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email or mobile phone number"
            type="text"
            value={email}
          />
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-black">Delivery</h2>
          <div className="mt-3 space-y-3">
            <input
              className="w-full rounded-md border border-[#cbd5e1] bg-white px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
              onChange={(event) => setCountry(event.target.value)}
              placeholder="Country/Region"
              type="text"
              value={country}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                className="rounded-md border border-[#cbd5e1] bg-white px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="First name"
                type="text"
                value={firstName}
              />
              <input
                className="rounded-md border border-[#cbd5e1] bg-white px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Last name"
                type="text"
                value={lastName}
              />
            </div>
            <input
              className="w-full rounded-md border border-[#cbd5e1] bg-white px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
              onChange={(event) => setAddressLine1(event.target.value)}
              placeholder="Address"
              type="text"
              value={addressLine1}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                className="rounded-md border border-[#cbd5e1] bg-white px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
                onChange={(event) => setCity(event.target.value)}
                placeholder="City"
                type="text"
                value={city}
              />
              <input
                className="rounded-md border border-[#cbd5e1] bg-white px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
                onChange={(event) => setPostalCode(event.target.value)}
                placeholder="Postal code (optional)"
                type="text"
                value={postalCode}
              />
            </div>
            <input
              className="w-full rounded-md border border-[#cbd5e1] bg-white px-4 py-3 text-sm outline-none focus:border-[#94a3b8]"
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Phone"
              type="text"
              value={phone}
            />
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-black">Payment</h2>
          <fieldset className="mt-3">
            <legend className="sr-only">Payment method</legend>
            <label className="flex cursor-pointer items-center gap-3 rounded-md border border-[#cbd5e1] bg-white px-4 py-3 text-sm text-black transition-colors duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cta/40">
              <input
                className="size-4 shrink-0 accent-cta"
                defaultChecked
                name="paymentMethod"
                type="radio"
                value="cod"
              />
              <span>
                <span className="font-medium">Cash on delivery (COD)</span>
                <span className="mt-0.5 block text-xs text-[#6E6E6E]">Pay when your order arrives.</span>
              </span>
            </label>
          </fieldset>
        </div>
      </div>

      <aside className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <div className="space-y-4">
          {checkoutItems.map((item) => (
            <div className="flex items-center gap-3" key={item.product.id}>
              <p className="min-w-0 flex-1 text-sm text-black">
                <span className="font-medium">{item.product.title}</span>
                <span className="ml-2 shrink-0 text-[#6E6E6E]">×{item.quantity}</span>
              </p>
              <p className="shrink-0 text-sm font-medium text-black">
                {formatPkrDetailed(parsePriceToPaisa(item.product.price) * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2 border-t border-[#e2e8f0] pt-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-black">Subtotal</span>
            <span className="text-black">{formatPkrDetailed(totals.subtotalPaisa)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black">Shipping</span>
            <span className="text-black">{formatPkrDetailed(totals.deliveryPaisa)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black">Estimated taxes ({(TAX_RATE * 100).toFixed(0)}%)</span>
            <span className="text-black">{formatPkrDetailed(totals.taxPaisa)}</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#e2e8f0] pt-4">
            <span className="text-2xl font-semibold text-black">Total</span>
            <span className="text-3xl font-bold text-black">{formatPkrDetailed(totals.totalPaisa)}</span>
          </div>
        </div>

        <button
          className="mt-6 w-full rounded-full bg-cta px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Placing order…" : "Confirm order"}
        </button>
      </aside>
    </form>
  );
}
