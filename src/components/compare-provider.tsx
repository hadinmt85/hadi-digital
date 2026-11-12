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
import type { CompareItem } from "@/lib/types";

const STORAGE_KEY = "hadi-compare-v1";
const MAX_ITEMS = 3;

type CompareContextValue = {
  items: CompareItem[];
  ready: boolean;
  count: number;
  has: (id: number) => boolean;
  toggle: (item: CompareItem) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const CompareContext = createContext<CompareContextValue | null>(null);

function isCompareItem(value: unknown): value is CompareItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "number" &&
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.price === "number"
  );
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- خواندن مقایسهٔ ذخیره‌شده فقط پس از mount ممکن است */
    try {
      const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(parsed)) setItems(parsed.filter(isCompareItem).slice(0, MAX_ITEMS));
    } catch {
      // نادیده بگیر
    }
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // حافظه در دسترس نیست
    }
  }, [items, ready]);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    };
  }, []);

  const showNotice = useCallback((message: string) => {
    setNotice(message);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 2800);
  }, []);

  const toggle = useCallback(
    (item: CompareItem) => {
      if (items.some((entry) => entry.id === item.id)) {
        setItems(items.filter((entry) => entry.id !== item.id));
        return;
      }
      if (items.length >= MAX_ITEMS) {
        showNotice("حداکثر ۳ محصول را می‌توانی با هم مقایسه کنی.");
        return;
      }
      setItems([...items, item]);
    },
    [items, showNotice],
  );

  const remove = useCallback((id: number) => {
    setItems((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const has = useCallback((id: number) => items.some((entry) => entry.id === id), [items]);
  const count = items.length;

  const value = useMemo(
    () => ({ items, ready, count, has, toggle, remove, clear }),
    [items, ready, count, has, toggle, remove, clear],
  );

  return (
    <CompareContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[62] flex justify-center px-4"
      >
        {notice ? (
          <div className="animate-rise rounded-full bg-ink px-4 py-2.5 text-xs font-bold text-white shadow-lg">
            {notice}
          </div>
        ) : null}
      </div>
    </CompareContext.Provider>
  );
}

export function useCompare(): CompareContextValue {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare باید داخل CompareProvider استفاده شود.");
  }
  return context;
}
