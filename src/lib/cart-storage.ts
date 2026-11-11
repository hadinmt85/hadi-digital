import type { CartLine } from "@/lib/types";

export const CART_STORAGE_KEY = "gadgetland-cart-v1";
export const PENDING_CART_KEY = "hadi_pending_cart";
const AUTH_HINT_COOKIE = "hadi_authed=";

export type PendingAdd = {
  line: Omit<CartLine, "qty">;
  qty: number;
};

/**
 * کوکی راهنما (غیر HttpOnly) که فقط برای تجربهٔ کاربری تنظیم می‌شود.
 * اعتبار واقعی سشن همیشه سمت سرور بررسی می‌شود.
 */
export function hasAuthHint(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((part) => part.trim().startsWith(AUTH_HINT_COOKIE));
}

export function savePendingAdd(line: Omit<CartLine, "qty">, qty: number): void {
  try {
    window.localStorage.setItem(PENDING_CART_KEY, JSON.stringify({ line, qty }));
  } catch {
    // حافظه در دسترس نیست
  }
}

export function readPendingAdd(): PendingAdd | null {
  try {
    const raw = window.localStorage.getItem(PENDING_CART_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PendingAdd;
    if (!parsed || typeof parsed !== "object" || !parsed.line) return null;
    if (typeof parsed.line.id !== "number" || typeof parsed.line.price !== "number") return null;

    return {
      line: parsed.line,
      qty: Math.max(1, Math.floor(Number(parsed.qty) || 1)),
    };
  } catch {
    return null;
  }
}

export function clearPendingAdd(): void {
  try {
    window.localStorage.removeItem(PENDING_CART_KEY);
  } catch {
    // نادیده بگیر
  }
}
