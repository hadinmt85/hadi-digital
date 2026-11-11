"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { hasAuthHint, savePendingAdd } from "@/lib/cart-storage";
import type { CartLine } from "@/lib/types";

const STORAGE_KEY = "gadgetland-cart-v1";

type CartContextValue = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, "qty">, qty?: number) => boolean;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as Record<string, unknown>;
  return (
    typeof line.id === "number" &&
    typeof line.name === "string" &&
    typeof line.price === "number" &&
    typeof line.qty === "number"
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- خواندن سبد ذخیره‌شده فقط پس از mount و در کلاینت ممکن است */
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setLines(parsed.filter(isCartLine));
        }
      }
    } catch {
      // سبد خراب را نادیده بگیر
    }
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // حالت مرور خصوصی — ذخیره ممکن نیست
    }
  }, [lines, ready]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const add = useCallback(
    (line: Omit<CartLine, "qty">, qty = 1): boolean => {
      if (!hasAuthHint()) {
        savePendingAdd(line, qty);
        router.push("/login?next=/cart");
        return false;
      }

      setLines((current) => {
        const existing = current.find((item) => item.id === line.id);
        if (existing) {
          return current.map((item) =>
            item.id === line.id
              ? { ...item, qty: Math.min(item.stock, item.qty + qty) }
              : item,
          );
        }
        return [...current, { ...line, qty: Math.min(line.stock, Math.max(1, qty)) }];
      });
      showToast(`${line.name} به سبد خرید اضافه شد`);
      return true;
    },
    [showToast, router],
  );

  const setQty = useCallback((id: number, qty: number) => {
    setLines((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, qty: Math.max(0, Math.min(item.stock, Math.floor(qty))) }
            : item,
        )
        .filter((item) => item.qty > 0),
    );
  }, []);

  const remove = useCallback((id: number) => {
    setLines((current) => current.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = useMemo(() => lines.reduce((sum, line) => sum + line.qty, 0), [lines]);
  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.price * line.qty, 0),
    [lines],
  );

  const value = useMemo(
    () => ({ lines, ready, count, subtotal, add, setQty, remove, clear }),
    [lines, ready, count, subtotal, add, setQty, remove, clear],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4"
      >
        {toast ? (
          <div className="animate-rise flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)]">
            <span className="grid size-6 place-items-center rounded-full bg-lime text-ink">✓</span>
            {toast}
          </div>
        ) : null}
      </div>
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart باید داخل CartProvider استفاده شود.");
  }
  return context;
}
