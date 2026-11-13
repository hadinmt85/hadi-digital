import type { Metadata } from "next";
import Link from "next/link";
import { FavoritesGrid } from "@/components/favorites-grid";
import { HeartIcon } from "@/components/icons";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "مورد علاقه‌ها",
  description: "لیست محصولات ذخیره‌شده در علاقه‌مندی‌های Hadi Digital.",
};

export default async function FavoritesPage() {
  const products = await getProducts();

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
        <span className="text-ink">مورد علاقه‌ها</span>
      </nav>

      <header className="mt-4 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-[#fff0f3] text-coral">
          <HeartIcon className="size-5" fill="currentColor" />
        </span>
        <div>
          <h1 className="text-lg font-black">مورد علاقه‌های من</h1>
          <p className="mt-0.5 text-[11px] text-mute">
            محصولاتی که ذخیره کرده‌ای؛ برای مقایسه یا خرید در آینده.
          </p>
        </div>
      </header>

      <div className="mt-5">
        <FavoritesGrid products={products} />
      </div>
    </div>
  );
}
