"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import {
  ArrowStartIcon,
  CardIcon,
  CheckIcon,
  ShieldIcon,
  TrashIcon,
  TruckIcon,
} from "@/components/icons";
import { ProductArt } from "@/components/product-art";
import { faNumber, shippingFor, toman, toEnDigits } from "@/lib/format";

type Fields = {
  customerName: string;
  phone: string;
  address: string;
  postalCode: string;
  note: string;
};

const initialFields: Fields = {
  customerName: "",
  phone: "",
  address: "",
  postalCode: "",
  note: "",
};

export function CheckoutForm() {
  const { lines, ready, subtotal, remove, clear } = useCart();
  const router = useRouter();
  const [fields, setFields] = useState<Fields>(initialFields);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [serverError, setServerError] = useState("");
  const [pending, setPending] = useState(false);

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  const update = (key: keyof Fields) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  function validate(): boolean {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (fields.customerName.trim().length < 3) {
      next.customerName = "نام و نام خانوادگی را کامل بنویسید.";
    }
    if (!/^09\d{9}$/.test(toEnDigits(fields.phone).trim())) {
      next.phone = "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.";
    }
    if (fields.address.trim().length < 10) {
      next.address = "نشانی کامل پستی را وارد کنید (حداقل ۱۰ کاراکتر).";
    }
    if (fields.postalCode.trim() && !/^\d{10}$/.test(toEnDigits(fields.postalCode).trim())) {
      next.postalCode = "کد پستی باید ۱۰ رقم باشد.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError("");
    if (!validate()) return;

    setPending(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: fields.customerName,
          phone: toEnDigits(fields.phone),
          address: fields.address,
          postalCode: toEnDigits(fields.postalCode),
          note: fields.note,
          items: lines.map((line) => ({ productId: line.id, qty: line.qty })),
        }),
      });

      const payload: unknown = await response.json();
      const data = payload as { id?: number; code?: string; error?: string };

      if (!response.ok || typeof data.id !== "number" || typeof data.code !== "string") {
        setServerError(data.error ?? "ثبت سفارش ناموفق بود.");
        return;
      }

      clear();
      router.push(`/orders/${data.code}`);
    } catch {
      setServerError("ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.");
    } finally {
      setPending(false);
    }
  }

  if (!ready) {
    return (
      <div className="container-x py-4">
        <div className="h-10 w-52 animate-pulse rounded-xl bg-paper" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="h-96 animate-pulse rounded-xl bg-paper" />
          <div className="h-72 animate-pulse rounded-xl bg-paper" />
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-x py-20">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto grid size-20 place-items-center rounded-xl bg-lime">
            <ArrowStartIcon className="size-9" />
          </div>
          <h1 className="mt-5 text-xl font-black">سبد خرید خالی است</h1>
          <p className="mt-3 text-sm text-mute">برای تسویه، اول چند گجت به سبد اضافه کن.</p>
          <Link href="/products" className="btn btn-violet mt-7">
            رفتن به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-4">
      <div className="max-w-xl">
        <p className="eyebrow">مرحله نهایی</p>
        <h1 className="mt-3 text-xl font-black sm:text-2xl">تسویه حساب و اطلاعات ارسال</h1>
        <p className="mt-2 text-sm text-mute">
          سفارش شما پس از ثبت، پردازش می‌شود و کد رهگیری از طریق پیامک برای شما ارسال خواهد شد.
        </p>
      </div>

      <form onSubmit={submit} className="mt-8 grid items-start gap-6 md:grid-cols-[1fr_20rem] lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          <section className="surface p-4">
            <h2 className="text-base font-black">اطلاعات گیرنده</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field
                label="نام و نام خانوادگی"
                id="customerName"
                value={fields.customerName}
                onChange={update("customerName")}
                error={errors.customerName}
                placeholder="مثلا سارا محمدی"
                autoComplete="name"
              />
              <Field
                label="شماره موبایل"
                id="phone"
                value={fields.phone}
                onChange={update("phone")}
                error={errors.phone}
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                inputMode="tel"
                dir="ltr"
                autoComplete="tel"
              />
              <div className="sm:col-span-2">
                <Field
                  label="نشانی کامل پستی"
                  id="address"
                  value={fields.address}
                  onChange={update("address")}
                  error={errors.address}
                  placeholder="استان، شهر، خیابان، پلاک و واحد"
                  autoComplete="street-address"
                  multiline
                />
              </div>
              <Field
                label="کد پستی (اختیاری)"
                id="postalCode"
                value={fields.postalCode}
                onChange={update("postalCode")}
                error={errors.postalCode}
                placeholder="۱۰ رقم"
                inputMode="numeric"
                dir="ltr"
                autoComplete="postal-code"
              />
              <Field
                label="یادداشت برای پیک (اختیاری)"
                id="note"
                value={fields.note}
                onChange={update("note")}
                placeholder="مثلا زنگ واحد خراب است"
              />
            </div>
          </section>

          <section className="surface p-4">
            <h2 className="text-base font-black">روش ارسال</h2>
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-violet bg-violet/5 p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-violet text-white">
                <TruckIcon className="size-4" />
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-extrabold">ارسال سریع Hadi Store</p>
                  <p className="text-xs font-black">
                    {shipping === 0 ? "رایگان" : toman(shipping)}
                  </p>
                </div>
                <p className="mt-1 text-xs text-mute">
                  تهران ۲۴ ساعته، شهرستان ۲ تا ۴ روز کاری. بسته‌بندی ضدضربه.
                </p>
              </div>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-700">
              <CheckIcon className="size-4" />
              پرداخت در محل برای تهران و کرج فعال است.
            </p>
          </section>
        </div>

        <aside className="surface sticky top-32 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black">سفارش شما</h2>
            <Link href="/cart" className="text-xs font-bold text-violet hover:underline">
              ویرایش سبد
            </Link>
          </div>

          <ul className="mt-4 max-h-64 space-y-3 overflow-auto pe-1">
            {lines.map((line) => (
              <li key={line.id} className="flex items-center gap-2.5">
                <ProductArt product={line} size="sm" className="size-11 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-xs font-bold">{line.name}</p>
                  <p className="text-[0.65rem] text-mute">
                    {faNumber(line.qty)} × {toman(line.price)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(line.id)}
                  aria-label={`حذف ${line.name}`}
                  className="text-mute transition hover:text-coral"
                >
                  <TrashIcon className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-2.5 border-t border-line pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-mute">جمع کالاها</span>
              <span className="font-bold">{toman(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-mute">ارسال</span>
              <span className="font-bold">{shipping === 0 ? "رایگان" : toman(shipping)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-2.5 text-base">
              <span className="font-black">قابل پرداخت</span>
              <span className="font-black">{toman(total)}</span>
            </div>
          </div>

          {serverError ? (
            <p role="alert" className="mt-4 rounded-2xl bg-coral/10 px-4 py-3 text-xs font-bold text-coral">
              {serverError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="btn btn-primary mt-5 w-full disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? "در حال ثبت سفارش..." : "ثبت نهایی سفارش"}
          </button>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-[0.65rem] text-mute">
            <CardIcon className="size-3.5" />
            اطلاعات شما رمزنگاری و محفوظ می‌ماند
          </p>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-[0.65rem] text-mute">
            <ShieldIcon className="size-3.5" />
            ضمانت بازگشت ۷ روزه
          </p>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  error,
  placeholder,
  multiline = false,
  ...rest
}: {
  label: string;
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  multiline?: boolean;
  inputMode?: "tel" | "numeric" | "text";
  dir?: "ltr" | "rtl";
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold text-ink-soft">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          className="field resize-none"
          aria-invalid={Boolean(error)}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="field"
          aria-invalid={Boolean(error)}
          {...rest}
        />
      )}
      {error ? <p className="mt-1.5 text-[0.65rem] font-bold text-coral">{error}</p> : null}
    </div>
  );
}
