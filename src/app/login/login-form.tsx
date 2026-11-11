"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { EyeIcon, EyeOffIcon, UserIcon } from "@/components/icons";
import { loginAction, type LoginState } from "@/lib/auth-actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

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
            defaultValue={state.username}
            autoComplete="username"
            placeholder="hadi123"
            className="field pe-10"
            required
          />
        </div>
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
            autoComplete="current-password"
            placeholder="••••••••"
            className="field pe-11"
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
        {pending ? "در حال ورود..." : "ورود به حساب"}
      </button>

      <p className="text-center text-[11px] text-mute">
        حساب نداری؟{" "}
        <Link href="/register" className="font-black text-coral hover:underline">
          ثبت‌نام کن
        </Link>
      </p>
    </form>
  );
}
