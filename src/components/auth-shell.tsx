import type { ReactNode } from "react";
import { ArcMarkInverse } from "@/components/brand-logo";
import { CheckIcon } from "@/components/icons";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="container-x py-6">
      <div className="mx-auto grid max-w-4xl overflow-hidden rounded-xl border border-line bg-paper lg:grid-cols-[1fr_340px]">
        <div className="p-6 sm:p-8">{children}</div>

        <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink p-7 text-white lg:flex">
          <div className="grid-dots pointer-events-none absolute inset-0 opacity-20" aria-hidden />
          <div className="relative">
            <ArcMarkInverse className="size-12" />
          </div>
          <div className="relative">
            <p className="text-lg font-black leading-8">خرید مطمئن از Hadi Store</p>
            <p className="mt-2 text-[11px] leading-6 text-white/55">
              حساب کاربری بساز تا سفارش‌ها، پیگیری و پیشنهادهای ویژه‌ات یک‌جا باشد.
            </p>
            <ul className="mt-5 space-y-2.5 text-[11px] text-white/70">
              {["گارانتی ۱۸ ماهه", "ارسال سریع", "۷ روز بازگشت کالا"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-lime" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative text-[9px] font-bold tracking-[0.18em] text-white/35">
            HADI STORE
          </div>
        </aside>
      </div>
    </div>
  );
}
