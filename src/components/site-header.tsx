"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArcMark } from "@/components/brand-logo";
import { CategoryIcon } from "@/components/category-icon";
import { useCart } from "@/components/cart-provider";
import { logoutAction } from "@/lib/auth-actions";
import {
  CartIcon,
  CloseIcon,
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
  { href: "/about", label: "درباره ما" },
];

export function SiteHeader({ user }: { user: { username: string } | null }) {
  const pathname = usePathname();
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-paper">
      <div className="border-b border-line">
        <div className="container-x flex h-8 items-center justify-between text-[10.5px] text-mute">
          <div className="hidden items-center gap-4 sm:flex">
            <Link href="/about#contact" className="transition hover:text-ink">
              پشتیبانی ۹ صبح تا ۹ شب
            </Link>
            <Link href="/cart" className="transition hover:text-ink">
              پیگیری سفارش
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

          <form
            action="/products"
            className="hidden h-11 flex-1 items-center gap-2 rounded-lg bg-[#f0f0f1] px-3 md:flex"
          >
            <SearchIcon className="size-5 shrink-0 text-mute" />
            <input
              type="search"
              name="q"
              placeholder="جستجو در Hadi Store"
              aria-label="جستجوی محصولات"
              className="h-full w-full bg-transparent text-xs outline-none placeholder:text-mute"
            />
            <kbd className="hidden rounded border border-line bg-white px-1.5 py-0.5 text-[9px] text-mute lg:block">
              ⌘ K
            </kbd>
          </form>

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
              onClick={() => setOpen((value) => !value)}
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
            {pathname === "/" ? "خرید آسان، تحویل سریع" : "Hadi Store | فروشگاه گجت"}
          </span>
        </nav>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="max-h-[72vh] overflow-y-auto border-b border-line bg-paper lg:hidden"
        >
          <div className="container-x space-y-3 py-4">
            <form action="/products" className="flex h-11 items-center gap-2 rounded-lg bg-[#f0f0f1] px-3">
              <SearchIcon className="size-4 shrink-0 text-mute" />
              <input
                type="search"
                name="q"
                placeholder="جستجو در Hadi Store..."
                aria-label="جستجوی محصولات"
                className="h-full w-full bg-transparent text-xs outline-none placeholder:text-mute"
              />
            </form>

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
