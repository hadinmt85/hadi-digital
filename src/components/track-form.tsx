"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SearchIcon } from "@/components/icons";
import { toEnDigits } from "@/lib/format";

export function TrackForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code") ?? "");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const normalizedCode = toEnDigits(code).trim().toUpperCase();
    const normalizedPhone = toEnDigits(phone).replace(/\D/g, "");

    if (!/^GL-\d{6}$/.test(normalizedCode)) {
      setError("کد سفارش باید به شکل GL-123456 باشد.");
      return;
    }
    if (normalizedPhone.length < 4) {
      setError("چهار رقم آخر شمارهٔ موبایل را وارد کنید.");
      return;
    }

    setPending(true);
    try {
      const response = await fetch(
        `/api/orders/${encodeURIComponent(normalizedCode)}?phone=${encodeURIComponent(normalizedPhone)}`,
        { cache: "no-store" },
      );
      if (response.status === 404) {
        setError("سفارشی با این کد پیدا نشد.");
        return;
      }
      if (response.status === 403) {
        setError("شمارهٔ موبایل با این سفارش هم‌خوانی ندارد.");
        return;
      }
      if (!response.ok) {
        setError("پیگیری سفارش انجام نشد. دوباره تلاش کنید.");
        return;
      }
      router.push(`/orders/${normalizedCode}`);
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="surface mt-5 p-5 sm:p-6">
      <div>
        <label htmlFor="track-code" className="mb-1.5 block text-[11px] font-bold text-ink-soft">
          کد سفارش
        </label>
        <input
          id="track-code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="GL-123456"
          dir="ltr"
          className="field font-mono tracking-widest"
          required
        />
      </div>

      <div className="mt-4">
        <label htmlFor="track-phone" className="mb-1.5 block text-[11px] font-bold text-ink-soft">
          چهار رقم آخر شمارهٔ موبایل
        </label>
        <input
          id="track-phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="۴ رقم"
          inputMode="numeric"
          dir="ltr"
          className="field"
          required
        />
      </div>

      {error ? (
        <p role="alert" className="mt-4 rounded-lg bg-[#fff0f3] px-3 py-2.5 text-[11px] font-bold text-coral">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary mt-5 h-11 w-full text-[12px] disabled:cursor-wait disabled:opacity-60"
      >
        <SearchIcon className="size-4" />
        {pending ? "در حال جستجو..." : "پیگیری سفارش"}
      </button>

      <p className="mt-4 text-center text-[10px] leading-5 text-mute">
        کد سفارش بعد از ثبت خرید نمایش داده می‌شود و با پیامک هم ارسال می‌شود.
      </p>
    </form>
  );
}
