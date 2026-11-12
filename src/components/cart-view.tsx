"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/components/cart-provider";
import { clearPendingAdd, hasAuthHint, readPendingAdd } from "@/lib/cart-storage";
import {
  ArrowStartIcon,
  CartIcon,
  MinusIcon,
  PlusIcon,
  ShieldIcon,
  TrashIcon,
  TruckIcon,
} from "@/components/icons";
import { ProductArt } from "@/components/product-art";
import { faNumber, shippingFor, shippingRules, toman } from "@/lib/format";

export function CartView() {
  const { lines, ready, subtotal, setQty, remove, clear, add } = useCart();
  const consumedPending = useRef(false);

  // اگر کاربر مهمان قصد افزودن محصولی را داشته و بعد وارد شده،
  // همان محصول به‌صورت خودکار به سبد اضافه می‌شود.
  useEffect(() => {
    if (!ready || consumedPending.current) return;
    consumedPending.current = true;

    if (!hasAuthHint()) return;
    const pending = readPendingAdd();
    if (!pending) return;

    clearPendingAdd();
    add(pending.line, pending.qty);
  }, [ready, add]);

  if (!ready) {
    return (
      <div className="container-x py-4">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-paper" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="h-72 animate-pulse rounded-xl bg-paper" />
          <div className="h-72 animate-pulse rounded-xl bg-paper" />
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-x py-20">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto grid size-20 place-items-center rounded-xl bg-coral text-white">
            <CartIcon className="size-9" />
          </div>
          <h1 className="mt-5 text-xl font-black">سبد خریدت خالی است</h1>
          <p className="mt-3 text-sm leading-7 text-mute">
            هنوز هیچ گجتی انتخاب نکردی. یک سر به فروشگاه بزن؛ پیشنهادهای امروز منتظرت هستند.
          </p>
          <Link href="/products" className="btn btn-primary mt-7">
            رفتن به فروشگاه
            <ArrowStartIcon className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;
  const remaining = Math.max(0, shippingRules.freeThreshold - subtotal);
  const progress = Math.min(100, Math.round((subtotal / shippingRules.freeThreshold) * 100));

  return (
    <div className="container-x py-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-black sm:text-2xl">سبد خرید</h1>
          <p className="mt-1.5 text-sm text-mute">
            {faNumber(lines.length)} نوع کالا در سبد شما
          </p>
        </div>
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-mute transition hover:text-coral"
        >
          <TrashIcon className="size-3.5" />
          خالی کردن سبد
        </button>
      </div>

      <div className="mt-7 grid items-start gap-6 md:grid-cols-[1fr_20rem] lg:grid-cols-[1fr_22rem]">
        <ul className="space-y-3">
          {lines.map((line) => (
            <li
              key={line.id}
              className="flex flex-col gap-4 rounded-xl border border-line bg-paper p-3 sm:flex-row sm:items-center sm:p-4"
            >
              <Link href={`/products/${line.slug}`} className="shrink-0">
                <ProductArt
                  product={line}
                  size="sm"
                  className="size-24 rounded-2xl sm:size-28"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <p className="text-[0.7rem] font-bold text-mute">{line.brand}</p>
                <Link
                  href={`/products/${line.slug}`}
                  className="mt-0.5 block text-sm font-extrabold leading-6 transition hover:text-violet sm:text-base"
                >
                  {line.name}
                </Link>
                <p className="mt-1 text-xs text-mute">قیمت واحد: {toman(line.price)}</p>
                {line.stock <= 3 ? (
                  <p className="mt-1 text-[0.65rem] font-bold text-coral">
                    تنها {faNumber(line.stock)} عدد در انبار
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                <div className="flex h-10 items-center gap-1 rounded-full border border-line bg-white px-1">
                  <button
                    type="button"
                    onClick={() => setQty(line.id, line.qty + 1)}
                    disabled={line.qty >= line.stock}
                    aria-label="افزایش تعداد"
                    className="grid size-8 place-items-center rounded-full transition hover:bg-ink/5 disabled:opacity-30"
                  >
                    <PlusIcon className="size-4" />
                  </button>
                  <span className="w-7 text-center text-sm font-black">{faNumber(line.qty)}</span>
                  <button
                    type="button"
                    onClick={() => setQty(line.id, line.qty - 1)}
                    aria-label="کاهش تعداد"
                    className="grid size-8 place-items-center rounded-full transition hover:bg-ink/5"
                  >
                    <MinusIcon className="size-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <p className="text-sm font-black">{toman(line.price * line.qty)}</p>
                  <button
                    type="button"
                    onClick={() => remove(line.id)}
                    aria-label={`حذف ${line.name}`}
                    className="grid size-8 place-items-center rounded-full text-mute transition hover:bg-coral/10 hover:text-coral"
                  >
                    <TrashIcon className="size-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="surface sticky top-32 p-4">
          <h2 className="text-base font-black">خلاصه سفارش</h2>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-mute">جمع کالاها</span>
              <span className="font-bold">{toman(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-mute">هزینه ارسال</span>
              <span className="font-bold">
                {shipping === 0 ? <span className="text-emerald-700">رایگان</span> : toman(shipping)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-3 text-base">
              <span className="font-black">مبلغ قابل پرداخت</span>
              <span className="font-black">{toman(total)}</span>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-cream p-3">
            <div className="flex items-center gap-1.5 text-[0.7rem] font-bold text-ink-soft">
              <TruckIcon className="size-4 text-violet" />
              {remaining > 0 ? (
                <span>تا ارسال رایگان {toman(remaining)} مانده</span>
              ) : (
                <span>ارسال این سفارش رایگان است 🎉</span>
              )}
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-coral transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Link href="/checkout" className="btn btn-primary mt-5 w-full">
            ادامه و تسویه حساب
          </Link>

          <Link
            href="/products"
            className="mt-3 block text-center text-xs font-bold text-mute hover:text-ink"
          >
            ادامه خرید
          </Link>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-[0.65rem] text-mute">
            <ShieldIcon className="size-3.5" />
            پرداخت امن و ضمانت بازگشت ۷ روزه
          </p>
        </aside>
      </div>
    </div>
  );
}
