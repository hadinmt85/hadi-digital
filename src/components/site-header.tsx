"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { ArcMark } from "@/components/brand-logo";
import { CartIcon, CloseIcon, MenuIcon, SearchIcon } from "@/components/icons";

const navLinks = [
  { href: "/", label: "خانه" },
  { href: "/products", label: "فروشگاه" },
  { href: "/products?category=gaming", label: "گیمینگ" },
  { href: "/products?category=audio", label: "صدا و هدفون" },
  { href: "/about", label: "درباره ما" },
];

const tickerItems = [
  "ارسال رایگان برای سفارش‌های بالای ۲ میلیون تومان",
  "گارانتی ۱۸ ماهه آرک",
  "۷ روز ضمانت بازگشت کالا",
  "پشتیبانی واقعی، ۹ صبح تا ۹ شب",
];

export function SiteHeader() {
  const pathname = usePathname();
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    const path = href.split("?")[0];
    return path === "/" ? pathname === "/" : pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="overflow-hidden bg-ink text-lime">
        <div className="flex w-max animate-marquee items-center py-2">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {tickerItems.map((item) => (
                <span key={item} className="flex items-center gap-3 px-6 text-[0.7rem] font-semibold">
                  <span className="size-1.5 rounded-full bg-lime" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="border-b border-line bg-cream/85 backdrop-blur-xl">
        <div className="container-x flex h-[4.6rem] items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5" aria-label="آرک، صفحه اصلی">
            <ArcMark className="size-11 rounded-[0.9rem] shadow-[0_10px_24px_-12px_rgba(18,16,22,0.9)]" />
            <span className="leading-tight">
              <span className="block text-lg font-black">آرک</span>
              <span className="block text-[0.55rem] font-bold tracking-[0.28em] text-mute">
                ARC.SHOP
              </span>
            </span>
          </Link>

          <nav className="ms-4 hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3.5 py-2 text-sm font-bold transition-colors ${
                  isActive(link.href)
                    ? "bg-ink text-white"
                    : "text-ink-soft hover:bg-ink/5 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <form action="/products" className="relative ms-auto hidden flex-1 md:block md:max-w-xs">
            <SearchIcon className="pointer-events-none absolute end-3.5 top-1/2 size-4 -translate-y-1/2 text-mute" />
            <input
              type="search"
              name="q"
              placeholder="جستجوی گجت، برند یا دسته..."
              aria-label="جستجوی محصولات"
              className="h-11 w-full rounded-full border border-line bg-white/80 pe-10 ps-4 text-sm outline-none transition focus:border-violet focus:bg-white focus:ring-4 focus:ring-violet/10"
            />
          </form>

          <div className="ms-auto flex items-center gap-2 md:ms-0">
            <Link
              href="/cart"
              className="relative inline-flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              <CartIcon className="size-5 text-lime" />
              <span className="hidden sm:inline">سبد خرید</span>
              {ready && count > 0 ? (
                <span
                  suppressHydrationWarning
                  className="grid min-w-6 place-items-center rounded-full bg-lime px-1.5 text-xs font-black text-ink"
                >
                  {count}
                </span>
              ) : null}
            </Link>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "بستن منو" : "باز کردن منو"}
              className="grid size-11 place-items-center rounded-full border border-line bg-white/70 text-ink transition hover:bg-white lg:hidden"
            >
              {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div id="mobile-menu" className="border-b border-line bg-cream lg:hidden">
          <div className="container-x space-y-4 py-5">
            <form action="/products" className="relative">
              <SearchIcon className="pointer-events-none absolute end-3.5 top-1/2 size-4 -translate-y-1/2 text-mute" />
              <input
                type="search"
                name="q"
                placeholder="جستجوی محصول..."
                aria-label="جستجوی محصولات"
                className="h-11 w-full rounded-full border border-line bg-white pe-10 ps-4 text-sm outline-none focus:border-violet"
              />
            </form>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-bold ${
                    isActive(link.href) ? "bg-ink text-white" : "bg-white/70 text-ink-soft"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/60 py-2 text-xs font-bold text-mute"
            >
              <CloseIcon className="size-4" />
              بستن
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
