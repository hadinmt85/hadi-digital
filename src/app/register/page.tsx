import { AuthShell } from "@/components/auth-shell";
import { Suspense } from "react";
import { RegisterForm } from "./register-form";

export const metadata = {
  title: "ثبت‌نام",
  description: "ساخت حساب کاربری در Hadi Digital با نام کاربری، ایمیل و رمز عبور.",
};

export default function RegisterPage() {
  return (
    <AuthShell>
      <h1 className="text-xl font-black">ساخت حساب کاربری</h1>
      <p className="mt-1.5 text-[11px] leading-6 text-mute">
        در کمتر از یک دقیقه عضو Hadi Digital شو؛ سفارش‌ها و پیگیری‌ها یک‌جا ذخیره می‌شوند.
      </p>
      <Suspense fallback={<div className="mt-5 h-80 animate-pulse rounded-lg bg-[#f7f7f8]" />}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
