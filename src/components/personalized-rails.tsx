"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CartIcon, EyeIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { readPurchased, readRecent } from "@/lib/recent-storage";
import type { Product } from "@/lib/types";

function Rail({
  title,
  subtitle,
  icon,
  products,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="rounded-xl border border-line bg-paper p-4">
      <header className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-[15px] font-black">
            <span className="grid size-6 place-items-center rounded-md bg-[#fff0f3] text-coral">
              {icon}
            </span>
            {title}
          </h2>
          <p className="mt-1 text-[10px] text-mute">{subtitle}</p>
        </div>
      </header>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export function PersonalizedRails({ products }: { products: Product[] }) {
  const [recent, setRecent] = useState<Product[]>([]);
  const [purchased, setPurchased] = useState<Product[]>([]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- خواندن تاریخچهٔ محلی فقط بعد از mount ممکن است */
    const recentIds = readRecent();
    const purchasedIds = readPurchased();
    setRecent(
      recentIds
        .map((id) => products.find((product) => product.id === id))
        .filter((product): product is Product => Boolean(product))
        .slice(0, 4),
    );
    setPurchased(
      purchasedIds
        .map((id) => products.find((product) => product.id === id))
        .filter((product): product is Product => Boolean(product))
        .slice(0, 4),
    );
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [products]);

  if (recent.length === 0 && purchased.length === 0) return null;

  return (
    <div className="space-y-3">
      <Rail
        title="بازدیدهای اخیر"
        subtitle="محصولاتی که اخیراً دیده‌ای"
        icon={<EyeIcon className="size-3.5" />}
        products={recent}
      />
      <Rail
        title="دوباره بخر"
        subtitle="خریدهای قبلی تو، برای سفارش سریع‌تر"
        icon={<CartIcon className="size-3.5" />}
        products={purchased}
      />
    </div>
  );
}
