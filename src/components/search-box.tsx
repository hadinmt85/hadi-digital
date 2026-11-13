"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeftIcon, SearchIcon } from "@/components/icons";
import { faNumber } from "@/lib/format";

type SearchProduct = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string | null;
  emoji: string;
};

type SearchPayload = {
  products: SearchProduct[];
  categories: { slug: string; name: string }[];
  brands: { name: string; slug: string; count: number }[];
};

const empty: SearchPayload = { products: [], categories: [], brands: [] };

type FlatItem = {
  key: string;
  href: string;
  label: string;
};

export function SearchBox({
  variant = "desktop",
  className = "",
  autoFocus = false,
  onNavigate,
}: {
  variant?: "desktop" | "panel";
  className?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const suggestionsId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLFormElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchPayload>(empty);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      /* eslint-disable react-hooks/set-state-in-effect -- پاک‌کردن نتایج وقتی عبارت کوتاه است */
      setResults(empty);
      setLoading(false);
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const payload = (await response.json()) as SearchPayload;
        setResults(payload);
        setActive(-1);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  const flat = useMemo<FlatItem[]>(() => {
    const items: FlatItem[] = [];
    for (const product of results.products) {
      items.push({
        key: `p-${product.id}`,
        href: `/products/${product.slug}`,
        label: product.name,
      });
    }
    for (const category of results.categories) {
      items.push({
        key: `c-${category.slug}`,
        href: `/products?category=${category.slug}`,
        label: category.name,
      });
    }
    for (const brand of results.brands) {
      items.push({ key: `b-${brand.slug}`, href: `/brands/${brand.slug}`, label: brand.name });
    }
    return items;
  }, [results]);

  const hasResults =
    results.products.length > 0 || results.categories.length > 0 || results.brands.length > 0;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setOpen(false);
    onNavigate?.();
    if (active >= 0 && flat[active]) {
      router.push(flat[active].href);
      return;
    }
    router.push(`/products?q=${encodeURIComponent(trimmed)}`);
  }

  function go() {
    setOpen(false);
    onNavigate?.();
  }

  return (
    <form
      ref={rootRef}
      role="search"
      onSubmit={submit}
      className={`relative ${variant === "desktop" ? "hidden h-11 flex-1 items-center gap-2 rounded-lg bg-[#f0f0f1] px-3 md:flex" : "flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg bg-[#f0f0f1] px-3"} ${className}`}
    >
      <SearchIcon className="size-5 shrink-0 text-mute" />
      <input
        ref={inputRef}
        type="search"
        name="q"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        autoFocus={autoFocus}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActive((value) => Math.min(flat.length - 1, value + 1));
            setOpen(true);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((value) => Math.max(-1, value - 1));
          } else if (event.key === "Escape") {
            setOpen(false);
            setActive(-1);
          }
        }}
        placeholder="جستجو در Hadi Digital"
        aria-label="جستجوی محصولات"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={suggestionsId}
        aria-autocomplete="list"
        autoComplete="off"
        className="h-full w-full bg-transparent text-xs outline-none placeholder:text-mute"
      />
      {loading ? (
        <span className="size-4 shrink-0 animate-spin rounded-full border-2 border-mute/30 border-t-coral" />
      ) : null}

      {open && query.trim().length >= 2 ? (
        <div
          id={suggestionsId}
          role="listbox"
          className="absolute inset-x-0 top-[calc(100%+6px)] z-[60] overflow-hidden rounded-xl border border-line bg-paper shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)]"
        >
          {hasResults ? (
            <>
              {results.products.length > 0 ? (
                <div className="p-1.5">
                  <p className="px-2 py-1 text-[9.5px] font-bold tracking-wide text-mute">محصولات</p>
                  {results.products.map((product) => {
                    const index = flat.findIndex((item) => item.key === `p-${product.id}`);
                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={go}
                        role="option"
                        aria-selected={index === active}
                        onMouseEnter={() => setActive(index)}
                        className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition ${
                          index === active ? "bg-[#fff0f3]" : "hover:bg-[#f7f7f8]"
                        }`}
                      >
                        <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-md bg-[#f7f7f8] text-lg">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt=""
                              width={36}
                              height={36}
                              className="size-9 object-cover"
                            />
                          ) : (
                            product.emoji
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="line-clamp-1 block text-[11px] font-bold text-ink">
                            {product.name}
                          </span>
                          <span className="mt-0.5 block text-[9px] text-mute">{product.brand}</span>
                        </span>
                        <span className="shrink-0 text-[10px] font-black text-ink-soft">
                          {faNumber(product.price)}
                          <span className="ms-1 text-[8px] font-normal text-mute">تومان</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ) : null}

              {results.categories.length > 0 ? (
                <div className="border-t border-line p-1.5">
                  <p className="px-2 py-1 text-[9.5px] font-bold tracking-wide text-mute">دسته‌بندی</p>
                  {results.categories.map((category) => {
                    const index = flat.findIndex((item) => item.key === `c-${category.slug}`);
                    return (
                      <Link
                        key={category.slug}
                        href={`/products?category=${category.slug}`}
                        onClick={go}
                        role="option"
                        aria-selected={index === active}
                        onMouseEnter={() => setActive(index)}
                        className={`flex items-center justify-between rounded-lg px-2 py-2 text-[11px] font-bold text-ink-soft transition ${
                          index === active ? "bg-[#fff0f3] text-coral" : "hover:bg-[#f7f7f8]"
                        }`}
                      >
                        {category.name}
                        <ArrowLeftIcon className="size-3.5 text-mute" />
                      </Link>
                    );
                  })}
                </div>
              ) : null}

              {results.brands.length > 0 ? (
                <div className="border-t border-line p-1.5">
                  <p className="px-2 py-1 text-[9.5px] font-bold tracking-wide text-mute">برندها</p>
                  {results.brands.map((brand) => {
                    const index = flat.findIndex((item) => item.key === `b-${brand.slug}`);
                    return (
                      <Link
                        key={brand.slug}
                        href={`/brands/${brand.slug}`}
                        onClick={go}
                        role="option"
                        aria-selected={index === active}
                        onMouseEnter={() => setActive(index)}
                        className={`flex items-center gap-2 rounded-lg px-2 py-2 text-[11px] font-bold text-ink-soft transition ${
                          index === active ? "bg-[#fff0f3] text-coral" : "hover:bg-[#f7f7f8]"
                        }`}
                      >
                        <span className="grid size-5 place-items-center rounded-full bg-[#f2f3f5] text-[9px] font-black text-ink-soft">
                          {brand.name.slice(0, 1)}
                        </span>
                        {brand.name}
                      </Link>
                    );
                  })}
                </div>
              ) : null}

              <Link
                href={`/products?q=${encodeURIComponent(query.trim())}`}
                onClick={go}
                className="flex items-center justify-center gap-1.5 border-t border-line bg-[#f7f7f8] px-4 py-2.5 text-[10.5px] font-bold text-coral transition hover:bg-[#fff0f3]"
              >
                مشاهدهٔ همهٔ نتایج برای «{query.trim()}»
                <ArrowLeftIcon className="size-3.5" />
              </Link>
            </>
          ) : (
            <p className="px-4 py-6 text-center text-[11px] text-mute">
              {loading ? "در حال جستجو…" : "نتیجه‌ای پیدا نشد. عبارت دیگری را امتحان کن."}
            </p>
          )}
        </div>
      ) : null}
    </form>
  );
}
