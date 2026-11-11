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
import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";

const STORAGE_KEY = "hadi-wishlist-v1";

type WishlistItem = { id: number; name: string };

type WishlistContextValue = {
  ids: number[];
  ready: boolean;
  count: number;
  has: (id: number) => boolean;
  toggle: (item: WishlistItem) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

function readIds(raw: string | null): number[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<{ message: string; added: boolean } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- خواندن علاقه‌مندی‌های ذخیره‌شده فقط پس از mount در کلاینت ممکن است */
    try {
      setIds(readIds(window.localStorage.getItem(STORAGE_KEY)));
    } catch {
      // دسترسی به حافظه ممکن نیست
    }
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // حالت مرور خصوصی — ذخیره ممکن نیست
    }
  }, [ids, ready]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = useCallback((message: string, added: boolean) => {
    setToast({ message, added });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const toggle = useCallback(
    (item: WishlistItem) => {
      const active = ids.includes(item.id);
      showToast(
        active
          ? `«${item.name}» از علاقه‌مندی‌ها حذف شد`
          : `«${item.name}» به علاقه‌مندی‌ها اضافه شد`,
        !active,
      );
      setIds((current) =>
        active ? current.filter((id) => id !== item.id) : [item.id, ...current.filter((id) => id !== item.id)],
      );
    },
    [ids, showToast],
  );

  const remove = useCallback((id: number) => {
    setIds((current) => current.filter((value) => value !== id));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const has = useCallback((id: number) => ids.includes(id), [ids]);
  const count = ids.length;

  const value = useMemo(
    () => ({ ids, ready, count, has, toggle, remove, clear }),
    [ids, ready, count, has, toggle, remove, clear],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[61] flex justify-center px-4"
      >
        {toast ? (
          <div className="animate-rise pointer-events-auto flex items-center gap-2 rounded-full bg-ink py-2 ps-2 pe-4 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)]">
            <span className="grid size-7 place-items-center rounded-full bg-coral text-white">
              {toast.added ? "♥" : "✓"}
            </span>
            <span className="max-w-[240px] truncate">{toast.message}</span>
            {toast.added ? (
              <Link
                href="/favorites"
                onClick={() => setToast(null)}
                className="ms-1 inline-flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-black text-white transition hover:bg-white/20"
              >
                مشاهده لیست
                <ArrowLeftIcon className="size-3.5" />
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist باید داخل WishlistProvider استفاده شود.");
  }
  return context;
}
