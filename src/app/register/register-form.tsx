"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { EyeIcon, EyeOffIcon, MailIcon, UserIcon } from "@/components/icons";
import { registerAction, type RegisterState } from "@/lib/auth-actions";

const initialState: RegisterState = {};

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="mt-5 space-y-4">
      <div>
        <label htmlFor="username" className="mb-1.5 block text-[11px] font-bold text-ink-soft">
          نام کاربری
        </label>
        <div className="relative">
          <UserIcon className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-mute" />
          <input
            id="username"
            name="username"
            defaultValue={state.values?.username}
            autoComplete="username"
            placeholder="حروف، عدد و _ (۳ تا ۲۰ کاراکتر)"
            className="field pe-10"
            aria-invalid={Boolean(errors.username)}
            required
          />
        </div>
        {errors.username ? (
          <p className="mt-1.5 text-[10px] font-bold text-coral">{errors.username}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-[11px] font-bold text-ink-soft">
          ایمیل
        </label>
        <div className="relative">
          <MailIcon className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-mute" />
          <input
            id="email"
            name="email"
            type="email"
            dir="ltr"
            defaultValue={state.values?.email}
            autoComplete="email"
            placeholder="you@example.com"
            className="field pe-10 text-left"
            aria-invalid={Boolean(errors.email)}
            required
          />
        </div>
        {errors.email ? (
          <p className="mt-1.5 text-[10px] font-bold text-coral">{errors.email}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-[11px] font-bold text-ink-soft">
          رمز عبور
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="حداقل ۸ کاراکتر"
            className="field pe-11"
            aria-invalid={Boolean(errors.password)}
            minLength={8}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}
            className="absolute end-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-mute transition hover:bg-[#f2f2f4] hover:text-ink"
          >
            {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
          </button>
        </div>
        {errors.password ? (
          <p className="mt-1.5 text-[10px] font-bold text-coral">{errors.password}</p>
        ) : (
          <p className="mt-1.5 text-[10px] text-mute">رمز عبور حداقل ۸ کاراکتر باشد.</p>
        )}
      </div>

      <div>
        <label htmlFor="confirm" className="mb-1.5 block text-[11px] font-bold text-ink-soft">
          تکرار رمز عبور
        </label>
        <input
          id="confirm"
          name="confirm"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="رمز را دوباره وارد کن"
          className="field"
          aria-invalid={Boolean(errors.confirm)}
          minLength={8}
          required
        />
        {errors.confirm ? (
          <p className="mt-1.5 text-[10px] font-bold text-coral">{errors.confirm}</p>
        ) : null}
      </div>

      {state.error ? (
        <p role="alert" className="rounded-lg bg-coral/10 px-3 py-2.5 text-[11px] font-bold text-coral">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary w-full disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "در حال ساخت حساب..." : "ساخت حساب کاربری"}
      </button>

      <p className="text-center text-[11px] text-mute">
        قبلاً ثبت‌نام کرده‌ای؟{" "}
        <Link href="/login" className="font-black text-coral hover:underline">
          وارد شو
        </Link>
      </p>
    </form>
  );
}
