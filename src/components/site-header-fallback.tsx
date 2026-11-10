import Link from "next/link";
import { ArcMark } from "@/components/brand-logo";
import { CartIcon, SearchIcon } from "@/components/icons";

/**
 * نسخهٔ بدون هوک از هدر؛ تا زمانی که `usePathname` در کلاینت resolve شود
 * به‌عنوان fallback استریم می‌شود و از جهش چیدمان جلوگیری می‌کند.
 */
export function SiteHeaderFallback() {
  return (
    <header className="sticky top-0 z-50">
      <div className="overflow-hidden bg-ink py-2 text-lime">
        <p className="container-x flex items-center gap-2 text-[0.7rem] font-semibold">
          <span className="size-1.5 rounded-full bg-lime" />
          ارسال رایگان برای سفارش‌های بالای ۲ میلیون تومان
        </p>
      </div>
      <div className="border-b border-line bg-cream/85 backdrop-blur-xl">
        <div className="container-x flex h-[4.6rem] items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <ArcMark className="size-11 rounded-[0.9rem]" />
            <span className="leading-tight">
              <span className="block text-lg font-black">آرک</span>
              <span className="block text-[0.55rem] font-bold tracking-[0.28em] text-mute">
                ARC.SHOP
              </span>
            </span>
          </Link>

          <div className="relative ms-auto hidden w-full max-w-xs md:block">
            <SearchIcon className="pointer-events-none absolute end-3.5 top-1/2 size-4 -translate-y-1/2 text-mute" />
            <div className="h-11 w-full rounded-full border border-line bg-white/80 pe-10 ps-4" />
          </div>

          <span className="ms-auto inline-flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-bold text-white md:ms-0">
            <CartIcon className="size-5 text-lime" />
            <span className="hidden sm:inline">سبد خرید</span>
          </span>
        </div>
      </div>
    </header>
  );
}
