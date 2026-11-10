"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/icons";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  return (
    <div>
      {done ? (
        <p className="flex items-center gap-2 rounded-2xl bg-lime px-4 py-3 text-sm font-bold text-ink">
          <CheckIcon className="size-5" />
          ثبت شد! کد تخفیف اولین خرید به ایمیل شما ارسال می‌شود.
        </p>
      ) : (
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              setError("ایمیل را درست وارد کنید.");
              return;
            }
            setError("");
            setDone(true);
          }}
        >
          <label className="sr-only" htmlFor="newsletter-email">
            ایمیل
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="ایمیل شما"
            dir="ltr"
            className="h-12 w-full rounded-full border border-white/20 bg-white/10 px-5 text-sm text-white placeholder:text-white/45 focus:border-lime focus:outline-none"
          />
          <button type="submit" className="btn btn-lime h-12 shrink-0 px-6">
            عضویت
          </button>
        </form>
      )}
      {error ? <p className="mt-2 text-xs font-bold text-coral">{error}</p> : null}
    </div>
  );
}
