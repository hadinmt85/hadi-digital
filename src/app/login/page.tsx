import { AuthShell } from "@/components/auth-shell";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "ورود به حساب",
  description: "ورود به حساب کاربری Hadi Store با نام کاربری و رمز عبور.",
};

export default function LoginPage() {
  return (
    <AuthShell>
      <h1 className="text-xl font-black">ورود به حساب</h1>
      <p className="mt-1.5 text-[11px] leading-6 text-mute">
        برای ادامه، نام کاربری و رمز عبورت را وارد کن.
      </p>
      <Suspense fallback={<div className="mt-5 h-64 animate-pulse rounded-lg bg-[#f7f7f8]" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
