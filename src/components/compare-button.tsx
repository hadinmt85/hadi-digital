"use client";

import { useCompare } from "@/components/compare-provider";
import { CompareIcon } from "@/components/icons";
import type { Product } from "@/lib/types";

export function CompareButton({
  product,
  variant = "icon",
  className = "",
}: {
  product: Product;
  variant?: "icon" | "full";
  className?: string;
}) {
  const { has, toggle, ready } = useCompare();
  const active = ready && has(product.id);
  const label = active ? `حذف ${product.name} از مقایسه` : `افزودن ${product.name} به مقایسه`;

  const item = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    price: product.price,
    image: product.image,
    emoji: product.emoji,
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={() => toggle(item)}
        aria-pressed={active}
        className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-[11px] font-bold transition ${
          active
            ? "border-coral/40 bg-[#fff0f3] text-coral"
            : "border-line bg-paper text-ink-soft hover:border-coral/30 hover:text-coral"
        } ${className}`}
      >
        <CompareIcon className="size-4" />
        {active ? "در لیست مقایسه" : "افزودن به مقایسه"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggle(item)}
      aria-pressed={active}
      aria-label={label}
      title={active ? "حذف از مقایسه" : "افزودن به مقایسه"}
      className={`grid size-8 place-items-center rounded-full bg-white/95 text-[#a1a1aa] shadow-[0_2px_8px_rgba(0,0,0,0.12)] ring-1 ring-black/5 transition hover:scale-105 hover:bg-white hover:text-ink-soft ${
        active ? "text-coral" : ""
      } ${className}`}
    >
      <CompareIcon className="size-[17px]" />
    </button>
  );
}
