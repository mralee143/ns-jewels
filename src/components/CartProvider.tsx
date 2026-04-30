"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react";

import { SHOP_PRODUCTS_BY_SLUG, type ShopProduct } from "@/data/shop-products";

type CartItem = {
  readonly product: ShopProduct;
  readonly quantity: number;
};

type CartState = {
  readonly items: readonly CartItem[];
};

type CartAction =
  | {
      readonly type: "ADD_ITEM";
      readonly payload: { readonly product: ShopProduct; readonly quantity: number };
    }
  | { readonly type: "DECREASE_ITEM"; readonly payload: { readonly productId: string } }
  | { readonly type: "HYDRATE"; readonly payload: CartState }
  | { readonly type: "INCREASE_ITEM"; readonly payload: { readonly productId: string } }
  | { readonly type: "REMOVE_ITEM"; readonly payload: { readonly productId: string } };

type CartContextValue = {
  readonly addToCart: (product: ShopProduct, quantity?: number) => void;
  readonly cartCount: number;
  readonly decreaseItem: (productId: string) => void;
  readonly increaseItem: (productId: string) => void;
  readonly items: readonly CartItem[];
  readonly removeItem: (productId: string) => void;
};

const CART_STORAGE_KEY = "ns-jewels-cart";
const EMPTY_CART_STATE: CartState = { items: [] };

const resolveProduct = (item: { product?: ShopProduct; productId?: string }): ShopProduct | null => {
  if (item.productId) {
    const canonicalProduct = SHOP_PRODUCTS_BY_SLUG[item.productId];
    if (canonicalProduct) {
      return canonicalProduct;
    }
  }
  if (item.product) {
    return item.product;
  }
  return null;
};

const buildCartItem = (item: { product?: ShopProduct; productId?: string; quantity: number }): CartItem | null => {
  const product = resolveProduct(item);
  if (!product || item.quantity <= 0) {
    return null;
  }
  return { product, quantity: item.quantity };
};

const loadCartState = (serialized: string | null): CartState => {
  if (!serialized) {
    return EMPTY_CART_STATE;
  }

  try {
    const parsed = JSON.parse(serialized) as {
      items?: readonly { product?: ShopProduct; productId?: string; quantity: number }[];
    };
    const parsedItems = parsed.items ?? [];
    const items = parsedItems
      .map(buildCartItem)
      .filter((item): item is CartItem => item !== null);
    return { items };
  } catch {
    return EMPTY_CART_STATE;
  }
};

const toPersistedState = (state: CartState): string =>
  JSON.stringify({
    items: state.items.map((item) => ({
      product: item.product,
      productId: item.product.slug,
      quantity: item.quantity,
    })),
  });

const upsertItem = (items: readonly CartItem[], product: ShopProduct, delta: number): readonly CartItem[] => {
  const existing = items.find((item) => item.product.id === product.id);
  if (!existing) {
    return delta > 0 ? [...items, { product, quantity: delta }] : items;
  }

  const nextQuantity = existing.quantity + delta;
  if (nextQuantity <= 0) {
    return items.filter((item) => item.product.id !== product.id);
  }

  return items.map((item) =>
    item.product.id === product.id ? { ...item, quantity: nextQuantity } : item
  );
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "ADD_ITEM":
      return {
        items: upsertItem(state.items, action.payload.product, action.payload.quantity),
      };
    case "INCREASE_ITEM": {
      const product =
        state.items.find((item) => item.product.slug === action.payload.productId)?.product ??
        SHOP_PRODUCTS_BY_SLUG[action.payload.productId];
      if (!product) {
        return state;
      }
      return {
        items: upsertItem(state.items, product, 1),
      };
    }
    case "DECREASE_ITEM": {
      const product =
        state.items.find((item) => item.product.slug === action.payload.productId)?.product ??
        SHOP_PRODUCTS_BY_SLUG[action.payload.productId];
      if (!product) {
        return state;
      }
      return {
        items: upsertItem(state.items, product, -1),
      };
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter((item) => item.product.id !== action.payload.productId),
      };
    default:
      return state;
  }
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [state, dispatch] = useReducer(cartReducer, EMPTY_CART_STATE);
  const isHydratedRef = useRef(false);

  useEffect(() => {
    const loadedState = loadCartState(window.localStorage.getItem(CART_STORAGE_KEY));
    dispatch({ type: "HYDRATE", payload: loadedState });
    isHydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!isHydratedRef.current) {
      return;
    }
    window.localStorage.setItem(CART_STORAGE_KEY, toPersistedState(state));
  }, [state]);

  const contextValue = useMemo<CartContextValue>(
    () => ({
      addToCart: (product, quantity = 1) =>
        dispatch({
          type: "ADD_ITEM",
          payload: { product, quantity: Math.max(1, Math.floor(quantity)) },
        }),
      cartCount: state.items.reduce((total, item) => total + item.quantity, 0),
      decreaseItem: (productId) => dispatch({ type: "DECREASE_ITEM", payload: { productId } }),
      increaseItem: (productId) => dispatch({ type: "INCREASE_ITEM", payload: { productId } }),
      items: state.items,
      removeItem: (productId) => dispatch({ type: "REMOVE_ITEM", payload: { productId } }),
    }),
    [state.items]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
