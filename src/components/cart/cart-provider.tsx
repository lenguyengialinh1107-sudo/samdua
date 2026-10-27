"use client";

import * as React from "react";

import { clampQuantity } from "@/lib/cart";

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  stockQuantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  /** false trong lần render đầu để tránh lệch hydration. */
  isReady: boolean;
  itemCount: number;
  addLine: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeLine: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

const STORAGE_KEY = "second-shot-cart-v1";

const CartContext = React.createContext<CartContextValue | null>(null);

function readStoredCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is CartLine => {
      if (typeof item !== "object" || item === null) return false;
      const candidate = item as Partial<CartLine>;
      return (
        typeof candidate.productId === "string" &&
        typeof candidate.slug === "string" &&
        typeof candidate.name === "string" &&
        typeof candidate.unitPrice === "number" &&
        typeof candidate.quantity === "number"
      );
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = React.useState<CartLine[]>([]);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    setLines(readStoredCart());
    setIsReady(true);
  }, []);

  React.useEffect(() => {
    if (!isReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Bỏ qua khi localStorage bị chặn (chế độ riêng tư).
    }
  }, [lines, isReady]);

  const value = React.useMemo<CartContextValue>(() => {
    return {
      lines,
      isReady,
      itemCount: lines.reduce((total, line) => total + line.quantity, 0),
      addLine(line, quantity = 1) {
        setLines((current) => {
          const existing = current.find((item) => item.productId === line.productId);
          if (!existing) {
            return [
              ...current,
              { ...line, quantity: clampQuantity(quantity, line.stockQuantity) },
            ];
          }
          return current.map((item) =>
            item.productId === line.productId
              ? {
                  ...item,
                  ...line,
                  quantity: clampQuantity(item.quantity + quantity, line.stockQuantity),
                }
              : item,
          );
        });
      },
      removeLine(productId) {
        setLines((current) => current.filter((item) => item.productId !== productId));
      },
      setQuantity(productId, quantity) {
        setLines((current) =>
          current
            .map((item) =>
              item.productId === productId
                ? { ...item, quantity: clampQuantity(quantity, item.stockQuantity) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        );
      },
      clear() {
        setLines([]);
      },
    };
  }, [lines, isReady]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart phải được dùng bên trong <CartProvider>.");
  }
  return context;
}
