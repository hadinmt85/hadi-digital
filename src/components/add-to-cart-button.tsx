"use client";

import { useCart } from "@/components/cart-provider";
import { PlusIcon } from "@/components/icons";
import type { CartLine } from "@/lib/types";

export function AddToCartButton({
  line,
  variant = "icon",
  disabled = false,
}: {
  line: Omit<CartLine, "qty">;
  variant?: "icon" | "full";
  disabled?: boolean;
}) {
  const { add } = useCart();

  if (variant === "full") {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => add(line)}
        className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40"
      >
        <PlusIcon className="size-5" />
        {disabled ? "ناموجود" : "افزودن به سبد خرید"}
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => add(line)}
      aria-label={`افزودن ${line.name} به سبد خرید`}
      className="grid size-10 place-items-center rounded-full bg-ink text-lime transition hover:scale-105 hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-30"
    >
      <PlusIcon className="size-4" />
    </button>
  );
}
