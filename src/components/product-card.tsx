import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { StarIcon } from "@/components/icons";
import { ProductArt } from "@/components/product-art";
import { discountPercent, faNumber, shippingRules, toman } from "@/lib/format";
import type { CartLine, Product } from "@/lib/types";

export function toCartLine(product: Product): Omit<CartLine, "qty"> {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    price: product.price,
    emoji: product.emoji,
    image: product.image,
    gradientFrom: product.gradientFrom,
    gradientTo: product.gradientTo,
    stock: product.stock,
  };
}

export function ProductCard({
  product,
  bare = false,
}: {
  product: Product;
  bare?: boolean;
}) {
  const off = discountPercent(product.price, product.oldPrice);
  const freeShipping = product.price >= shippingRules.freeThreshold;

  return (
    <article
      className={`group flex flex-col bg-paper ${
        bare
          ? "min-w-0"
          : "rounded-lg border border-line p-2.5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-18px_rgba(28,27,34,0.35)]"
      }`}
    >
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden rounded-md bg-[#f7f7f8]">
        <ProductArt product={product} plain className="aspect-square" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2">
          {off > 0 ? (
            <span className="rounded-full bg-coral px-2 py-0.5 text-[10px] font-black text-white">
              {faNumber(off)}٪
            </span>
          ) : (
            <span />
          )}
          {product.badge ? (
            <span className="rounded-full bg-ink/80 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur">
              {product.badge}
            </span>
          ) : null}
        </div>
        {product.stock === 0 ? (
          <span className="absolute inset-x-0 bottom-0 bg-ink/70 py-1 text-center text-[9px] font-bold text-white">
            ناموجود
          </span>
        ) : null}
      </Link>

      <h3 className="mt-2 line-clamp-2 min-h-[44px] text-[11.5px] leading-[1.9] text-ink-soft">
        <Link href={`/products/${product.slug}`} className="transition-colors hover:text-ink">
          {product.name}
        </Link>
      </h3>

      <div className="mt-1 flex items-center gap-1 text-[10px] text-mute">
        <StarIcon className="size-3 text-gold" />
        <span className="font-bold text-ink-soft">{faNumber(Number(product.rating.toFixed(1)))}</span>
        <span className="text-[9px]">({faNumber(product.reviewCount)})</span>
      </div>

      <div className="mt-auto pt-2">
        {product.oldPrice ? (
          <div className="text-[10px] text-[#a1a1aa] line-through">{toman(product.oldPrice)}</div>
        ) : null}
        <div className="flex items-end justify-between gap-2">
          <p className="flex items-baseline gap-1 text-[14px] font-black">
            {faNumber(product.price)}
            <span className="text-[9px] font-medium text-mute">تومان</span>
          </p>
          <AddToCartButton line={toCartLine(product)} disabled={product.stock === 0} />
        </div>
        <p
          className={`mt-1 flex items-center gap-1 text-[9.5px] font-semibold ${
            freeShipping ? "text-green" : "text-mute"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <path d="M2 7h11v9H2z" />
            <path d="M13 10h4l4 3.5V16h-8" />
            <circle cx="6" cy="18" r="1.6" />
            <circle cx="17" cy="18" r="1.6" />
          </svg>
          {freeShipping ? "ارسال رایگان" : `ارسال ${toman(shippingRules.fee)}`}
        </p>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 md:gap-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
