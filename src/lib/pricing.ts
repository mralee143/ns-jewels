import type { ShopProduct } from "@/data/shop-products";

export const DELIVERY_CHARGE_PKR = 199;
export const TAX_RATE = 0.04;

type CartLikeItem = {
  readonly product: ShopProduct;
  readonly quantity: number;
};

export type OrderTotals = {
  readonly deliveryPaisa: number;
  readonly subtotalPaisa: number;
  readonly taxPaisa: number;
  readonly totalPaisa: number;
};

/** First major amount in a PKR label (avoids ".950.00" → parseFloat 0.95 bug). */
export const parsePriceStringToRupees = (price: string): number => {
  const normalized = price.replace(/,/g, "");
  const matchedAmount = normalized.match(/\d+(?:\.\d+)?/);
  const asNumber = Number.parseFloat(matchedAmount?.[0] ?? "");
  return Number.isNaN(asNumber) ? 0 : asNumber;
};

export const parsePriceToPaisa = (price: string): number =>
  Math.round(parsePriceStringToRupees(price) * 100);

export const formatPkrDatasetValue = (valuePaisa: number): string =>
  (Math.max(0, valuePaisa) / 100).toFixed(2);

export const formatPkr = (valuePaisa: number): string => `Rs ${formatPkrDatasetValue(valuePaisa)}`;

export const formatPkrDetailed = (valuePaisa: number): string => `Rs ${formatPkrDatasetValue(valuePaisa)}`;

export const calculateOrderTotals = (items: readonly CartLikeItem[]): OrderTotals => {
  const subtotalPaisa = items.reduce(
    (total, item) => total + parsePriceToPaisa(item.product.price) * item.quantity,
    0
  );
  const taxPaisa = Math.round(subtotalPaisa * TAX_RATE);
  const deliveryPaisa = DELIVERY_CHARGE_PKR * 100;
  const totalPaisa = subtotalPaisa + taxPaisa + deliveryPaisa;

  return {
    deliveryPaisa,
    subtotalPaisa,
    taxPaisa,
    totalPaisa,
  };
};
