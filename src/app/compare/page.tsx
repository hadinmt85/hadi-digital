import type { Metadata } from "next";
import Link from "next/link";
import { CompareView } from "@/components/compare-view";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "مقایسهٔ محصولات",
  description: "محصولات Hadi Store را کنار هم مقایسه کن: قیمت، امتیاز، برند و مشخصات.",
};

export default async function ComparePage() {
  const products = await getProducts({ limit: 100 });

  return (
    <div className="container-x py-4">
      <nav
        aria-label="مسیر صفحه"
        className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-mute"
      >
        <Link href="/" className="transition hover:text-ink">
          خانه
        </Link>
        <span aria-hidden>/</span>
        <span className="text-ink">مقایسهٔ محصولات</span>
      </nav>

      <header className="mt-4">
        <h1 className="text-xl font-black sm:text-2xl">مقایسهٔ محصولات</h1>
        <p className="mt-1.5 text-xs leading-6 text-mute">
          قیمت، امتیاز و مشخصات کلیدی را کنار هم ببین و مطمئن‌تر انتخاب کن.
        </p>
      </header>

      <CompareView products={products} />
    </div>
  );
}
