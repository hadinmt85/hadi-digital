import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
import { getBrands } from "@/lib/data";
import { faNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "برندها",
  description: "همهٔ برندهای موجود در Hadi Digital و محصولات هر برند.",
};

export default async function BrandsPage() {
  const brands = await getBrands();

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
        <span className="text-ink">برندها</span>
      </nav>

      <header className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-black sm:text-2xl">برندهای Hadi Digital</h1>
          <p className="mt-1.5 text-xs leading-6 text-mute">
            {faNumber(brands.length)} برند منتخب؛ محصولات هر برند را یک‌جا ببین.
          </p>
        </div>
        <Link href="/products" className="text-[11px] font-bold text-coral hover:underline">
          همهٔ محصولات
          <ArrowLeftIcon className="ms-1 inline size-3.5" />
        </Link>
      </header>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {brands.map((brand, index) => (
          <Link
            key={brand.slug}
            href={`/brands/${brand.slug}`}
            className="group flex items-center gap-3 rounded-xl border border-line bg-paper p-3.5 transition hover:-translate-y-0.5 hover:border-coral/30 hover:shadow-[0_12px_30px_-18px_rgba(28,27,34,0.35)]"
          >
            <span
              className="grid size-12 shrink-0 place-items-center rounded-xl text-base font-black text-white"
              style={{
                backgroundImage: [
                  "linear-gradient(135deg,#3f4064,#ef4056)",
                  "linear-gradient(135deg,#ef4056,#ff8fa0)",
                  "linear-gradient(135deg,#2b2c46,#5a5c86)",
                  "linear-gradient(135deg,#1f9d55,#5cd6a0)",
                ][index % 4],
              }}
              aria-hidden
            >
              {brand.name.slice(0, 1)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-black text-ink group-hover:text-coral">
                {brand.name}
              </span>
              <span className="mt-0.5 block text-[10px] text-mute">
                {faNumber(brand.count)} محصول
              </span>
            </span>
            <ArrowLeftIcon className="ms-auto size-4 shrink-0 text-mute transition group-hover:text-coral" />
          </Link>
        ))}
      </div>
    </div>
  );
}
