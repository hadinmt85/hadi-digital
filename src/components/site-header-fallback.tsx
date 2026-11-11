import Link from "next/link";
import { ArcMark } from "@/components/brand-logo";
import { CartIcon, MenuIcon, SearchIcon } from "@/components/icons";

/**
 * نسخهٔ بدون هوک از هدر؛ تا زمانی که `usePathname` در کلاینت resolve شود
 * به‌عنوان fallback استریم می‌شود و از جهش چیدمان جلوگیری می‌کند.
 */
export function SiteHeaderFallback() {
  return (
    <header className="sticky top-0 z-50 bg-paper">
      <div className="border-b border-line">
        <div className="container-x flex h-8 items-center justify-between text-[10.5px] text-mute">
          <div className="hidden items-center gap-4 sm:flex">
            <span>پشتیبانی ۹ صبح تا ۹ شب</span>
            <span>پیگیری سفارش</span>
          </div>
          <span className="flex items-center gap-1.5 font-semibold text-ink">
            <span className="size-1.5 rounded-full bg-coral" />
            ارسال رایگان برای سفارش‌های بالای ۲ میلیون تومان
          </span>
        </div>
      </div>

      <div className="border-b border-line">
        <div className="container-x flex h-[70px] items-center gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <ArcMark className="size-10" />
            <span className="leading-tight">
              <span className="block text-lg font-black">آرک</span>
              <span className="block text-[0.5rem] font-bold tracking-[0.3em] text-mute">
                ARC.SHOP
              </span>
            </span>
          </Link>

          <div className="hidden h-11 flex-1 items-center gap-2 rounded-lg bg-[#f0f0f1] px-3 md:flex">
            <SearchIcon className="size-5 shrink-0 text-mute" />
            <span className="text-xs text-mute">جستجو در آرک</span>
          </div>

          <div className="ms-auto flex items-center gap-2 md:ms-0">
            <Link href="/login" className="hidden h-10 items-center rounded-lg border border-line px-3 text-[11px] font-bold sm:flex">
              ورود | ثبت‌نام
            </Link>
            <span className="relative grid size-10 place-items-center rounded-lg border border-line">
              <CartIcon className="size-5" />
            </span>
            <span className="grid size-10 place-items-center rounded-lg border border-line lg:hidden">
              <MenuIcon className="size-5" />
            </span>
          </div>
        </div>
      </div>

      <div className="hidden border-b border-line lg:block">
        <div className="container-x flex h-10 items-center gap-3 text-[11.5px] text-ink-soft">
          <span className="font-extrabold">دسته‌بندی کالاها</span>
          <span className="font-extrabold text-coral">پیشنهاد شگفت‌انگیز</span>
          <span>هدفون</span>
          <span>ساعت هوشمند</span>
          <span>گیمینگ</span>
          <span>لپ‌تاپ</span>
        </div>
      </div>
    </header>
  );
}
