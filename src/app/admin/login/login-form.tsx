"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/login/actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-bold text-ink-soft">
          رمز عبور مدیر
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="field"
          required
        />
      </div>

      {state.error ? (
        <p role="alert" className="rounded-xl bg-coral/10 px-4 py-2.5 text-xs font-bold text-coral">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary w-full disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "در حال ورود..." : "ورود به پنل"}
      </button>

      <p className="rounded-xl bg-cream px-4 py-2.5 text-[0.65rem] font-bold text-mute">
        رمز پیش‌فرض دمو: <span dir="ltr" className="font-black text-ink">admin123</span> — با
        متغیر محیطی ADMIN_PASSWORD قابل تغییر است.
      </p>
    </form>
  );
}
