"use client";

import { useCart } from "@/components/cart-provider";
import { PlusIcon } from "@/components/icons";
import type { CartLine } from "@/lib/types";

export function AddAllToCart({
  lines,
  label = "افزودن همه به سبد",
}: {
  lines: Omit<CartLine, "qty">[];
  label?: string;
}) {
  const { add } = useCart();

  return (
    <button
      type="button"
      onClick={() => {
        for (const line of lines) add(line);
      }}
      className="btn btn-primary h-10 px-4 text-[11px]"
    >
      <PlusIcon className="size-4" />
      {label}
    </button>
  );
}
