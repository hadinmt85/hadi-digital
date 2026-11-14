"use client";

import { useCart } from "@/components/cart-provider";
import { CartIcon } from "@/components/icons";
import { toman } from "@/lib/format";
import type { CartLine } from "@/lib/types";

export function MobileBuyBar({ line }: { line: Omit<CartLine, "qty"> }) {
  const { add } = useCart();
  const soldOut = line.stock === 0;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-line bg-paper/95 px-3 py-2 shadow-[0_-12px_30px_-24px_rgba(0,0,0,0.45)] backdrop-blur lg:hidden"
      style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
    >
      <div>
        <p className="text-[9px] text-mute">قیمت</p>
        <p className="text-[13px] font-black">{toman(line.price)}</p>
      </div>
      <button
        type="button"
        onClick={() => add(line)}
        disabled={soldOut}
        className="btn btn-primary h-10 shrink-0 px-4 text-[11px] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <CartIcon className="size-4" />
        {soldOut ? "ناموجود" : "افزودن به سبد خرید"}
      </button>
    </div>
  );
}
