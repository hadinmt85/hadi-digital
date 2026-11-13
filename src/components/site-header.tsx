"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArcMark } from "@/components/brand-logo";
import { CategoryIcon } from "@/components/category-icon";
import { SearchBox } from "@/components/search-box";
import { useCart } from "@/components/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { logoutAction } from "@/lib/auth-actions";
import {
  CartIcon,
  CloseIcon,
  HeartIcon,
  LogoutIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "@/components/icons";
import { navCategories } from "@/lib/nav-categories";

const navCats = navCategories.slice(0, 10).map((category) => ({
  href: `/products?category=${category.slug}`,
  label: category.name.replace("گوشی موبایل", "موبایل").replace("تبلت و کتاب‌خوان", "تبلت"),
}));

const mobileLinks = [
  { href: "/", label: "خانه" },
  { href: "/products", label: "همه محصولات" },
  { href: "/products?sort=cheap", label: "پیشنهاد شگفت‌انگیز" },
  { href: "/brands", label: "برندها" },
  { href: "/favorites", label: "مورد علاقه‌ها" },
  { href: "/compare", label: "مقایسه" },
  { href: "/track", label: "پیگیری سفارش" },
  { href: "/about", label: "درباره ما" },
];

export function SiteHeader() {
  const { count, ready } = useCart();
  const { count: favoriteCount, ready: wishlistReady } = useWishlist();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const response = await fetch("/api/me", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as { user?: { username: string } | null };
        if (active) setUser(payload.user ?? null);
      } catch {
        // وضعیت مهمان نمایش داده می‌شود
      }
    }

    loadUser();
    const onSync = () => {
      loadUser();
    };
    window.addEventListener("hadi-auth-sync", onSync);

    return () => {
      active = false;
      window.removeEventListener("hadi-auth-sync", onSync);
    };
  }, []);

  useEffect(() => {
    if (!searchOpen) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setSearchOpen(false);
    }
    function onPointer(event: MouseEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setSearchOpen(false);
    }

    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [searchOpen]);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-paper">
      <div className="border-b border-line">
        <div className="container-x flex h-8 items-center justify-between text-[10.5px] text-mute">
          <div className="hidden items-center gap-4 sm:flex">
            <Link href="/about#contact" className="transition hover:text-ink">
              پشتیبانی ۹ صبح تا ۹ شب
            </Link>
            <Link href="/track" className="transition hover:text-ink">
              پیگیری سفارش
            </Link>
            <Link href="/brands" className="transition hover:text-ink">
              برندها
            </Link>
            <Link href="/about" className="transition hover:text-ink">
              درباره Hadi Store
            </Link>
          </div>
          <span className="flex items-center gap-1.5 font-semibold text-ink">
            <span className="size-1.5 rounded-full bg-coral" />
            ارسال رایگان برای سفارش‌های بالای ۲ میلیون تومان
          </span>
        </div>
      </div>

      <div className="border-b border-line">
        <div className="container-x flex h-[70px] items-center gap-3 lg:gap-4">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2"
            aria-label="Hadi Store، صفحه اصلی"
          >
            <ArcMark className="size-10" />
            <span className="leading-tight">
              <span className="block text-lg font-black">Hadi Store</span>
              <span className="block text-[0.5rem] font-bold tracking-[0.18em] text-mute">
                HADI STORE
              </span>
            </span>
          </Link>

          <SearchBox variant="desktop" />

          <div className="ms-auto flex items-center gap-2 md:ms-0">
            {user ? (
              <Link
                href="/account"
                className="hidden h-10 items-center gap-2 rounded-lg border border-line px-3 text-[11px] font-bold transition hover:bg-[#f7f7f8] sm:flex"
              >
                <UserIcon className="size-4 text-mute" />
                <span className="max-w-[90px] truncate" dir="ltr">
                  {user.username}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden h-10 items-center gap-2 rounded-lg border border-line px-3 text-[11px] font-bold transition hover:bg-[#f7f7f8] sm:flex"
              >
                ورود | ثبت‌نام
              </Link>
            )}

            <Link
              href="/favorites"
              aria-label="مورد علاقه‌ها"
              className="relative hidden size-10 place-items-center rounded-lg border border-line transition hover:bg-[#f7f7f8] sm:grid"
            >
              <HeartIcon className="size-5" />
              {wishlistReady && favoriteCount > 0 ? (
                <span
                  suppressHydrationWarning
                  className="absolute -end-1.5 -top-1.5 grid min-w-[17px] place-items-center rounded-full bg-coral px-1 text-[9px] font-black text-white"
                >
                  {favoriteCount}
                </span>
              ) : null}
            </Link>

            <button
              type="button"
              onClick={() => {
                setSearchOpen((value) => !value);
                setOpen(false);
              }}
              aria-expanded={searchOpen}
              aria-controls="mobile-search-panel"
              aria-label={searchOpen ? "بستن جستجو" : "جستجو"}
              className="grid size-10 place-items-center rounded-lg border border-line transition hover:bg-[#f7f7f8] md:hidden"
            >
              <SearchIcon className="size-5" />
            </button>

            <Link
              href="/cart"
              aria-label="سبد خرید"
              className="relative grid size-10 place-items-center rounded-lg border border-line transition hover:bg-[#f7f7f8]"
            >
              <CartIcon className="size-5" />
              {ready && count > 0 ? (
                <span
                  suppressHydrationWarning
                  className="absolute -end-1.5 -top-1.5 grid min-w-[17px] place-items-center rounded-full bg-coral px-1 text-[9px] font-black text-white"
                >
                  {count}
                </span>
              ) : null}
            </Link>

            <button
              type="button"
              onClick={() => {
                setOpen((value) => !value);
                setSearchOpen(false);
              }}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "بستن منو" : "باز کردن منو"}
              className="grid size-10 place-items-center rounded-lg border border-line transition hover:bg-[#f7f7f8] lg:hidden"
            >
              {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {searchOpen ? (
        <div id="mobile-search-panel" className="border-b border-line bg-paper md:hidden">
          <div className="container-x flex items-center gap-2 py-2.5">
            <SearchBox
              variant="panel"
              autoFocus
              onNavigate={() => setSearchOpen(false)}
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="بستن جستجو"
              className="grid size-10 shrink-0 place-items-center rounded-lg border border-line text-mute transition hover:bg-[#f7f7f8] hover:text-ink"
            >
              <CloseIcon className="size-4" />
            </button>
          </div>
        </div>
      ) : null}

      <div className="hidden border-b border-line lg:block">
        <nav className="container-x flex h-10 items-center gap-0.5 overflow-hidden text-[11.5px]">
          <Link
            href="/products"
            className="me-2 flex h-6 items-center gap-1.5 border-e border-line pe-3 font-extrabold"
          >
            <MenuIcon className="size-4" />
            دسته‌بندی کالاها
          </Link>
          <Link
            href="/products?sort=cheap"
            className="me-1 flex items-center gap-1.5 rounded-md px-2 py-1.5 font-extrabold text-coral hover:bg-[#fff0f3]"
          >
            <span className="size-1.5 rounded-full bg-coral" />
            پیشنهاد شگفت‌انگیز
          </Link>
          {navCats.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-md px-2 py-1.5 text-ink-soft transition hover:bg-[#f5f5f6] hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <span className="ms-auto hidden text-[10px] text-mute xl:inline">
            خرید آسان، تحویل سریع
          </span>
        </nav>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="max-h-[72vh] overflow-y-auto border-b border-line bg-paper lg:hidden"
        >
          <div className="container-x space-y-3 py-4">
            <p className="text-[10px] font-extrabold text-mute">دسته‌بندی کالاها</p>
            <div className="grid grid-cols-3 gap-1.5">
              {navCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/products?category=${category.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-line bg-paper py-2.5 text-[9.5px] font-bold text-ink-soft"
                >
                  <CategoryIcon slug={category.slug} className="size-5" />
                  <span className="px-1 text-center leading-4">{category.name}</span>
                </Link>
              ))}
            </div>

            <p className="text-[10px] font-extrabold text-mute">صفحات</p>
            <div className="grid grid-cols-2 gap-1.5">
              {mobileLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-line px-3 py-2.5 text-[11.5px] font-bold text-ink-soft"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {user ? (
              <div className="space-y-1.5">
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-ink py-2.5 text-[11.5px] font-bold text-white"
                >
                  <UserIcon className="size-4" />
                  حساب من
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-line py-2.5 text-[11.5px] font-bold text-ink-soft"
                  >
                    <LogoutIcon className="size-4" />
                    خروج از حساب
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center justify-center rounded-lg bg-ink py-2.5 text-[11.5px] font-bold text-white"
              >
                ورود | ثبت‌نام
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
