"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { MinusIcon, PlusIcon } from "@/components/icons";
import type { CartLine } from "@/lib/types";

export function AddToCartPanel({
  line,
  stock,
}: {
  line: Omit<CartLine, "qty">;
  stock: number;
}) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const max = Math.max(1, stock);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-12 items-center gap-1 rounded-full border border-line bg-white px-1.5">
          <button
            type="button"
            onClick={() => setQty((value) => Math.min(max, value + 1))}
            disabled={qty >= max}
            aria-label="افزایش تعداد"
            className="grid size-9 place-items-center rounded-full text-ink transition hover:bg-ink/5 disabled:opacity-30"
          >
            <PlusIcon className="size-4" />
          </button>
          <span className="w-8 text-center text-sm font-black">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((value) => Math.max(1, value - 1))}
            disabled={qty <= 1}
            aria-label="کاهش تعداد"
            className="grid size-9 place-items-center rounded-full text-ink transition hover:bg-ink/5 disabled:opacity-30"
          >
            <MinusIcon className="size-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => add(line, qty)}
          disabled={stock === 0}
          className="btn btn-primary h-12 flex-1 px-5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {stock === 0 ? "ناموجود" : "افزودن به سبد خرید"}
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          if (add(line, qty)) {
            router.push("/cart");
          }
        }}
        disabled={stock === 0}
        className="btn btn-ghost h-12 w-full disabled:cursor-not-allowed disabled:opacity-40"
      >
        خرید سریع و تسویه
      </button>
    </div>
  );
}
