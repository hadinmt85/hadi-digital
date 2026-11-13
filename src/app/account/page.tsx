import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { logoutAction } from "@/lib/auth-actions";
import { faDate } from "@/lib/format";
import { getProducts } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";
import { FavoritesGrid } from "@/components/favorites-grid";
import { ArrowLeftIcon, CartIcon, HeartIcon, LogoutIcon } from "@/components/icons";

export const metadata = {
  title: "حساب کاربری",
  description: "مشاهده اطلاعات حساب کاربری Hadi Digital.",
};

export default function AccountPage() {
  return (
    <div className="container-x py-6">
      <div className="mx-auto max-w-3xl space-y-3">
        <Suspense fallback={<AccountSkeleton />}>
          <AccountContent />
        </Suspense>
      </div>
    </div>
  );
}

function AccountSkeleton() {
  return (
    <>
      <div className="h-44 animate-pulse rounded-xl border border-line bg-paper" />
      <div className="h-14 animate-pulse rounded-xl border border-line bg-paper" />
      <div className="h-72 animate-pulse rounded-xl border border-line bg-paper" />
    </>
  );
}

async function AccountContent() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const products = await getProducts();
  const initial = user.username.slice(0, 1).toUpperCase();

  return (
    <>
      <div className="rounded-xl border border-line bg-paper p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="grid size-14 place-items-center rounded-full bg-coral text-lg font-black text-white">
            {initial}
          </span>
          <div>
            <h1 className="text-lg font-black">حساب من</h1>
            <p className="mt-0.5 text-[11px] text-mute">
              خوش آمدی،{" "}
              <span dir="ltr" className="font-bold text-ink">
                {user.username}
              </span>
            </p>
          </div>
          <form action={logoutAction} className="ms-auto">
            <button type="submit" className="btn btn-ghost h-9 px-3 text-[11px]">
              <LogoutIcon className="size-4" />
              خروج از حساب
            </button>
          </form>
        </div>

        <dl className="mt-5 grid gap-2 sm:grid-cols-3">
          <div className="rounded-lg bg-[#f7f7f8] px-3 py-2.5">
            <dt className="text-[10px] font-bold text-mute">نام کاربری</dt>
            <dd className="mt-1 text-xs font-black" dir="ltr">
              {user.username}
            </dd>
          </div>
          <div className="rounded-lg bg-[#f7f7f8] px-3 py-2.5">
            <dt className="text-[10px] font-bold text-mute">ایمیل</dt>
            <dd className="mt-1 truncate text-xs font-bold" dir="ltr">
              {user.email}
            </dd>
          </div>
          <div className="rounded-lg bg-[#f7f7f8] px-3 py-2.5">
            <dt className="text-[10px] font-bold text-mute">تاریخ عضویت</dt>
            <dd className="mt-1 text-xs font-bold">{faDate(user.createdAt)}</dd>
          </div>
        </dl>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <Link
          href="/products"
          className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3.5 text-xs font-bold transition hover:bg-[#f7f7f8]"
        >
          ادامه خرید
          <ArrowLeftIcon className="size-4 text-mute" />
        </Link>
        <Link
          href="/cart"
          className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3.5 text-xs font-bold transition hover:bg-[#f7f7f8]"
        >
          سبد خرید
          <CartIcon className="size-4 text-mute" />
        </Link>
        <Link
          href="#favorites"
          className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3.5 text-xs font-bold transition hover:bg-[#f7f7f8]"
        >
          مورد علاقه‌ها
          <HeartIcon className="size-4 text-coral" />
        </Link>
        <Link
          href="/about#contact"
          className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3.5 text-xs font-bold transition hover:bg-[#f7f7f8]"
        >
          پشتیبانی
          <ArrowLeftIcon className="size-4 text-mute" />
        </Link>
      </div>

      <section
        id="favorites"
        className="scroll-mt-28 rounded-xl border border-line bg-paper p-4 sm:p-5"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-black">
              <HeartIcon className="size-4 text-coral" fill="currentColor" />
              مورد علاقه‌های من
            </h2>
            <p className="mt-1 text-[10.5px] text-mute">ذخیره‌شده‌ها برای خرید بعدی</p>
          </div>
          <Link
            href="/favorites"
            className="inline-flex items-center gap-1 text-[10.5px] font-bold text-coral hover:underline"
          >
            مشاهده همه
            <ArrowLeftIcon className="size-3.5" />
          </Link>
        </div>

        <FavoritesGrid
          products={products}
          variant="inline"
          limit={3}
          gridClassName="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
        />
      </section>
    </>
  );
}
