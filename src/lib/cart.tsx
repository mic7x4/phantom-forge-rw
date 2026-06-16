import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products, type Product } from "@/data/products";

export type CartItem = { id: string; qty: number };

type CartCtx = {
  items: CartItem[];
  detailed: { product: Product; qty: number }[];
  count: number;
  subtotal: number;
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  applyCode: (code: string) => void;
  discountCode?: string;
  discount: number;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE = "nps_cart_v1";
const CODE_STORAGE = "nps_code_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState<string | undefined>();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setItems(JSON.parse(raw));
      const code = localStorage.getItem(CODE_STORAGE);
      if (code) setDiscountCode(code);
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE, JSON.stringify(items)); } catch {}
  }, [items]);

  const detailed = useMemo(
    () =>
      items
        .map((i) => {
          const product = products.find((p) => p.id === i.id);
          return product ? { product, qty: i.qty } : null;
        })
        .filter((x): x is { product: Product; qty: number } => !!x),
    [items],
  );

  const subtotal = detailed.reduce((s, x) => s + x.product.price * x.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  const discountRate = discountCode === "PHANTOM10" ? 0.1 : discountCode === "GAMER5" ? 0.05 : 0;
  const discount = Math.round(subtotal * discountRate);

  const value: CartCtx = {
    items,
    detailed,
    count,
    subtotal,
    discountCode,
    discount,
    add: (id, qty = 1) =>
      setItems((prev) => {
        const existing = prev.find((i) => i.id === id);
        if (existing) return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
        return [...prev, { id, qty }];
      }),
    remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
    setQty: (id, qty) =>
      setItems((prev) => (qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i)))),
    clear: () => setItems([]),
    applyCode: (code) => {
      const c = code.trim().toUpperCase();
      setDiscountCode(c || undefined);
      try { c ? localStorage.setItem(CODE_STORAGE, c) : localStorage.removeItem(CODE_STORAGE); } catch {}
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
