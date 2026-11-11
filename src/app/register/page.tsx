import { AuthShell } from "@/components/auth-shell";
import { RegisterForm } from "./register-form";

export const metadata = {
  title: "ثبت‌نام",
  description: "ساخت حساب کاربری در آرک با نام کاربری، ایمیل و رمز عبور.",
};

export default function RegisterPage() {
  return (
    <AuthShell>
      <h1 className="text-xl font-black">ساخت حساب کاربری</h1>
      <p className="mt-1.5 text-[11px] leading-6 text-mute">
        در کمتر از یک دقیقه عضو آرک شو؛ سفارش‌ها و پیگیری‌ها یک‌جا ذخیره می‌شوند.
      </p>
      <RegisterForm />
    </AuthShell>
  );
}
