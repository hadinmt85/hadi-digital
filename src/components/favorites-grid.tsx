"use client";

import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { HeartIcon } from "@/components/icons";
import { useWishlist } from "@/components/wishlist-provider";
import { faNumber } from "@/lib/format";
import type { Product } from "@/lib/types";

const gridClass =
  "grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 md:gap-3 xl:grid-cols-5";

export function FavoritesGrid({
  products,
  variant = "page",
  gridClassName = gridClass,
  limit,
}: {
  products: Product[];
  variant?: "page" | "inline";
  gridClassName?: string;
  limit?: number;
}) {
  const { ids, ready, clear } = useWishlist();
  const items = ready
    ? ids
        .map((id) => products.find((product) => product.id === id))
        .filter((product): product is Product => Boolean(product))
    : [];
  const shown = typeof limit === "number" ? items.slice(0, limit) : items;

  if (!ready) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: variant === "inline" ? 3 : 5 }).map((_, index) => (
          <div key={index} className="h-64 animate-pulse rounded-lg border border-line bg-paper" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        className={`rounded-xl border border-line bg-paper text-center ${
          variant === "inline" ? "px-4 py-8" : "px-6 py-16"
        }`}
      >
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#fff0f3] text-coral">
          <HeartIcon className="size-8" />
        </span>
        <p className="mt-4 text-sm font-black">هنوز چیزی به علاقه‌مندی‌ها اضافه نکردی</p>
        <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-mute">
          روی قلب بالای هر محصول بزن تا برای بعد ذخیره شود؛ این‌جا همه‌شان را یک‌جا می‌بینی.
        </p>
        <Link href="/products" className="btn btn-primary mt-5 h-10 px-5 text-xs">
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[11px] font-bold text-mute">
          {faNumber(items.length)} کالا در علاقه‌مندی‌های تو
        </p>
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center gap-1 text-[10.5px] font-bold text-mute transition hover:text-coral"
        >
          پاک کردن همه
        </button>
      </div>
      <div className={gridClassName}>
        {shown.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
