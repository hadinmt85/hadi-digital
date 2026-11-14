"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { CartIcon, MinusIcon, PlusIcon } from "@/components/icons";
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
  const soldOut = stock === 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[9px] font-bold text-mute">تعداد</span>
        <div className="flex h-9 items-center gap-0.5 rounded-lg border border-line bg-white px-1">
          <button
            type="button"
            onClick={() => setQty((value) => Math.min(max, value + 1))}
            disabled={qty >= max}
            aria-label="افزایش تعداد"
            className="grid size-7 place-items-center rounded-md text-ink transition hover:bg-ink/5 disabled:opacity-30"
          >
            <PlusIcon className="size-3.5" />
          </button>
          <span className="w-7 text-center text-[11px] font-black">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((value) => Math.max(1, value - 1))}
            disabled={qty <= 1}
            aria-label="کاهش تعداد"
            className="grid size-7 place-items-center rounded-md text-ink transition hover:bg-ink/5 disabled:opacity-30"
          >
            <MinusIcon className="size-3.5" />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => add(line, qty)}
        disabled={soldOut}
        className="btn btn-primary h-11 w-full text-[11px] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <CartIcon className="size-4" />
        {soldOut ? "ناموجود" : "افزودن به سبد خرید"}
      </button>

      <button
        type="button"
        onClick={() => {
          if (add(line, qty)) {
            router.push("/cart");
          }
        }}
        disabled={soldOut}
        className="btn btn-ghost h-9 w-full text-[9.5px] disabled:cursor-not-allowed disabled:opacity-40"
      >
        خرید سریع و تسویه
      </button>
    </div>
  );
}
