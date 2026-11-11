"use client";

import { useWishlist } from "@/components/wishlist-provider";
import { HeartIcon } from "@/components/icons";
import type { Product } from "@/lib/types";

type FavoriteProduct = Pick<Product, "id" | "slug" | "name">;

export function FavoriteButton({
  product,
  size = "sm",
  className = "",
}: {
  product: FavoriteProduct;
  size?: "sm" | "md";
  className?: string;
}) {
  const { has, toggle, ready } = useWishlist();
  const active = ready && has(product.id);

  return (
    <button
      type="button"
      onClick={() => toggle({ id: product.id, name: product.name })}
      aria-pressed={active}
      aria-label={
        active ? `حذف ${product.name} از علاقه‌مندی‌ها` : `افزودن ${product.name} به علاقه‌مندی‌ها`
      }
      title={active ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      className={`grid place-items-center rounded-full bg-white/95 shadow-[0_2px_8px_rgba(0,0,0,0.12)] ring-1 ring-black/5 transition hover:scale-105 hover:bg-white ${
        size === "md" ? "size-10" : "size-8"
      } ${active ? "text-coral" : "text-[#a1a1aa] hover:text-ink-soft"} ${className}`}
    >
      <HeartIcon
        className={size === "md" ? "size-5" : "size-[17px]"}
        fill={active ? "currentColor" : "none"}
      />
    </button>
  );
}
