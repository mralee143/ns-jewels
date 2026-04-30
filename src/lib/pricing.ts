import type { ShopProduct } from "@/data/shop-products";

export const DELIVERY_CHARGE_PKR = 250;
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

export const parsePriceToPaisa = (price: string): number => {
  const normalized = price.replace(/,/g, "");
  const matchedAmount = normalized.match(/\d+(?:\.\d+)?/);
  const asNumber = Number.parseFloat(matchedAmount?.[0] ?? "");
  if (Number.isNaN(asNumber)) {
    return 0;
  }
  return Math.round(asNumber * 100);
};

export const formatPkr = (valuePaisa: number): string => `Rs ${Math.max(0, valuePaisa / 100).toFixed(2)}`;

export const formatPkrDetailed = (valuePaisa: number): string =>
  `Rs ${Math.max(0, valuePaisa / 100).toFixed(2)}`;

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
