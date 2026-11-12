import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeftIcon, TruckIcon } from "@/components/icons";
import { TrackForm } from "@/components/track-form";

export const metadata: Metadata = {
  title: "پیگیری سفارش",
  description: "وضعیت سفارش Hadi Store را با کد سفارش و شمارهٔ موبایل پیگیری کن.",
};

export default function TrackPage() {
  return (
    <div className="container-x py-6">
      <div className="mx-auto max-w-xl">
        <nav
          aria-label="مسیر صفحه"
          className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-mute"
        >
          <Link href="/" className="transition hover:text-ink">
            خانه
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink">پیگیری سفارش</span>
        </nav>

        <header className="mt-4 flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#fff0f3] text-coral">
            <TruckIcon className="size-5" />
          </span>
          <div>
            <h1 className="text-xl font-black sm:text-2xl">پیگیری سفارش</h1>
            <p className="mt-1 text-xs leading-6 text-mute">
              کد سفارش و چهار رقم آخر شمارهٔ موبایل را وارد کن تا وضعیت و جزئیات سفارش را ببینی.
            </p>
          </div>
        </header>

        <Suspense fallback={<div className="mt-5 h-64 animate-pulse rounded-xl border border-line bg-paper" />}>
          <TrackForm />
        </Suspense>

        <div className="mt-4 rounded-xl border border-line bg-paper p-4">
          <p className="text-[11px] font-bold text-ink-soft">خرید مهمان هم امکان‌پذیر است</p>
          <p className="mt-1 text-[10.5px] leading-6 text-mute">
            برای ثبت سفارش لازم نیست حساب بسازی؛ فقط اطلاعات گیرنده را وارد کن. با کد سفارش
            می‌توانی هر زمان وضعیت را ببینی.
          </p>
          <Link href="/products" className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-coral hover:underline">
            شروع خرید
            <ArrowLeftIcon className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
