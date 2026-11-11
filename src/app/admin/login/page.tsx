import Link from "next/link";
import { ArcMark } from "@/components/brand-logo";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "ورود به پنل مدیریت",
};

export default function AdminLoginPage() {
  return (
    <div className="container-x py-16">
      <div className="mx-auto max-w-sm">
        <div className="surface p-6 sm:p-8">
          <ArcMark className="size-12 rounded-xl" />
          <h1 className="mt-5 text-xl font-black">پنل مدیریت Hadi Store</h1>
          <p className="mt-2 text-xs leading-6 text-mute">
            برای مشاهده سفارش‌ها، مدیریت موجودی و افزودن محصول وارد شوید.
          </p>
          <LoginForm />
        </div>
        <Link
          href="/"
          className="mt-5 block text-center text-xs font-bold text-mute hover:text-ink"
        >
          بازگشت به فروشگاه
        </Link>
      </div>
    </div>
  );
}
