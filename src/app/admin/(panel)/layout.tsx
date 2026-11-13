import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { logout } from "@/app/admin/login/actions";
import { ADMIN_COOKIE, isAdmin } from "@/lib/admin-auth";

export const metadata = {
  title: "پنل مدیریت",
};

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="container-x py-16">
          <div className="h-64 animate-pulse rounded-[1.75rem] bg-paper" />
        </div>
      }
    >
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}

async function AdminGate({ children }: { children: ReactNode }) {
  const store = await cookies();
  if (!isAdmin(store.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin/login");
  }

  return (
    <div className="container-x py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.75rem] bg-ink px-5 py-4 text-white">
        <div>
          <p className="text-[0.65rem] font-bold tracking-widest text-white/45">پنل مدیریت</p>
          <p className="text-lg font-black">داشبورد Hadi Digital</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold transition hover:bg-white/20"
          >
            مشاهده فروشگاه
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-full bg-coral px-4 py-2 text-xs font-black text-white transition hover:bg-[#d9364b]"
            >
              خروج
            </button>
          </form>
        </div>
      </div>

      {children}
    </div>
  );
}
