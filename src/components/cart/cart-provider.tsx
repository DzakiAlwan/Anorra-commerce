"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useIsClient } from "@/lib/use-is-client";

export type CartItem = {
  variantId: string;
  productId: string;
  slug: string;
  name: string;
  size: string;
  color: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
};

type NewCartItem = Omit<CartItem, "quantity">;

type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (item: NewCartItem, quantity?: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "anorra-cart-v1";
const MAX_QUANTITY = 99;
const EMPTY_CART: CartItem[] = [];

const CartContext = createContext<CartContextValue | null>(null);

let cartItems: CartItem[] = EMPTY_CART;
let initialized = false;
const listeners = new Set<() => void>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCartItem(value: unknown): value is CartItem {
  if (!isRecord(value)) return false;

  return (
    typeof value.variantId === "string" &&
    typeof value.productId === "string" &&
    typeof value.slug === "string" &&
    typeof value.name === "string" &&
    typeof value.size === "string" &&
    typeof value.color === "string" &&
    typeof value.price === "number" &&
    typeof value.quantity === "number" &&
    (typeof value.imageUrl === "string" || value.imageUrl === null)
  );
}

function clampQuantity(quantity: number): number {
  return Math.min(MAX_QUANTITY, Math.max(1, Math.floor(quantity)));
}

function readCart(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_CART;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY_CART;

    const items = parsed.filter(isCartItem).map((item) => ({
      ...item,
      quantity: clampQuantity(item.quantity),
    }));

    return items.length > 0 ? items : EMPTY_CART;
  } catch {
    return EMPTY_CART;
  }
}

function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage may be unavailable (private mode/quota); cart stays in memory.
  }
}

function ensureInitialized() {
  if (initialized) return;
  initialized = true;
  cartItems = readCart();
}

function getSnapshot(): CartItem[] {
  ensureInitialized();
  return cartItems;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  function handleStorage(event: StorageEvent) {
    if (event.key !== STORAGE_KEY) return;
    cartItems = readCart();
    listener();
  }

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function commit(next: CartItem[]) {
  cartItems = next;
  writeCart(next);

  for (const listener of listeners) {
    listener();
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useIsClient();

  const addItem = useCallback((item: NewCartItem, quantity = 1) => {
    const safeQuantity = clampQuantity(quantity);
    const previous = getSnapshot();
    const existing = previous.find((entry) => entry.variantId === item.variantId);

    if (existing) {
      commit(
        previous.map((entry) =>
          entry.variantId === item.variantId
            ? {
                ...entry,
                ...item,
                quantity: Math.min(MAX_QUANTITY, entry.quantity + safeQuantity),
              }
            : entry,
        ),
      );
      return;
    }

    commit([...previous, { ...item, quantity: safeQuantity }]);
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    const safeQuantity = clampQuantity(quantity);

    commit(
      getSnapshot().map((entry) =>
        entry.variantId === variantId ? { ...entry, quantity: safeQuantity } : entry,
      ),
    );
  }, []);

  const removeItem = useCallback((variantId: string) => {
    commit(getSnapshot().filter((entry) => entry.variantId !== variantId));
  }, []);

  const clearCart = useCallback(() => {
    commit(EMPTY_CART);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    return {
      items,
      ready,
      itemCount,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    };
  }, [items, ready, addItem, updateQuantity, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart harus dipakai di dalam CartProvider.");
  }

  return context;
}
