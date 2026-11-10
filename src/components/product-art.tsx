import Image from "next/image";
import type { Product } from "@/lib/types";

type ArtProduct = Pick<
  Product,
  "emoji" | "image" | "gradientFrom" | "gradientTo" | "name" | "brand"
>;

const sizes = {
  sm: { emoji: "text-4xl", brand: "text-[0.55rem]", pad: "p-3" },
  md: { emoji: "text-5xl", brand: "text-[0.6rem]", pad: "p-4" },
  lg: { emoji: "text-[clamp(4.5rem,11vw,9.5rem)]", brand: "text-xs", pad: "p-6" },
} as const;

export function ProductArt({
  product,
  size = "md",
  className = "",
  imageSizes = "(min-width: 1280px) 20vw, (min-width: 768px) 25vw, 50vw",
  priority = false,
  plain = false,
}: {
  product: ArtProduct;
  size?: keyof typeof sizes;
  className?: string;
  imageSizes?: string;
  priority?: boolean;
  plain?: boolean;
}) {
  const scale = sizes[size];

  return (
    <div
      className={`relative isolate overflow-hidden ${plain ? "" : scale.pad} ${className}`}
      style={{
        backgroundImage: `linear-gradient(145deg, ${product.gradientFrom}, ${product.gradientTo})`,
      }}
      role={!product.image && !plain ? "img" : undefined}
      aria-label={!product.image && !plain ? `تصویر ${product.name}` : undefined}
    >
      {product.image ? (
        <>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes={imageSizes}
            priority={priority}
            className="object-cover"
          />
          {plain ? null : (
            <>
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-white/5"
                aria-hidden
              />
              <span
                className={`absolute bottom-3 start-4 z-10 font-black tracking-[0.22em] text-white/80 drop-shadow ${scale.brand}`}
                aria-hidden
              >
                {product.brand}
              </span>
            </>
          )}
        </>
      ) : (
        <>
          {plain ? (
            <div className="absolute inset-0 opacity-30 grid-dots" aria-hidden />
          ) : (
            <>
              <div className="grid-dots absolute inset-0 opacity-40" aria-hidden />
              <div className="absolute -top-10 -end-10 size-40 rounded-full bg-white/25 blur-2xl" aria-hidden />
              <div className="absolute -bottom-16 -start-6 size-44 rounded-full bg-black/30 blur-2xl" aria-hidden />
              <div className="absolute inset-6 rounded-full border border-white/25" aria-hidden />
              <div className="absolute inset-12 rounded-full border border-white/15" aria-hidden />
            </>
          )}
          <span
            className={`relative z-10 grid h-full w-full place-items-center ${scale.emoji} drop-shadow-[0_18px_28px_rgba(0,0,0,0.35)]`}
            aria-hidden
          >
            {product.emoji}
          </span>
          {plain ? null : (
            <span
              className={`absolute bottom-3 start-4 z-10 font-black tracking-[0.22em] text-white/60 ${scale.brand}`}
              aria-hidden
            >
              {product.brand}
            </span>
          )}
        </>
      )}
    </div>
  );
}
