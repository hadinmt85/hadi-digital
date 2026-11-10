import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { StarIcon } from "@/components/icons";
import { ProductArt } from "@/components/product-art";
import { discountPercent, faNumber, toman } from "@/lib/format";
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

export function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product.price, product.oldPrice);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-line bg-paper transition duration-300 hover:-translate-y-1.5 hover:border-ink/25 hover:shadow-[0_30px_60px_-38px_rgba(18,16,22,0.55)]">
      <div className="absolute top-5 start-5 z-20 flex flex-col items-start gap-1.5">
        {product.badge ? (
          <span className="rounded-full bg-ink/90 px-2.5 py-1 text-[0.65rem] font-black text-lime backdrop-blur">
            {product.badge}
          </span>
        ) : null}
        {off > 0 ? (
          <span className="rounded-full bg-coral px-2.5 py-1 text-[0.65rem] font-black text-white">
            {faNumber(off)}٪ تخفیف
          </span>
        ) : null}
      </div>

      <Link href={`/products/${product.slug}`} className="block p-2.5 pb-0">
        <ProductArt product={product} className="aspect-[5/4] rounded-[1.4rem]" />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2 text-[0.7rem] font-bold text-mute">
          <span>{product.categoryName}</span>
          <span className="flex items-center gap-1">
            <StarIcon className="size-3.5 text-ink" />
            <span className="text-ink">{faNumber(Number(product.rating.toFixed(1)))}</span>
            <span className="text-mute/70">({faNumber(product.reviewCount)})</span>
          </span>
        </div>

        <div>
          <h3 className="text-base font-extrabold leading-6">
            <Link href={`/products/${product.slug}`} className="transition-colors hover:text-violet">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 line-clamp-1 text-xs text-mute">{product.tagline}</p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div>
            {product.oldPrice ? (
              <p className="text-[0.7rem] text-mute line-through">{toman(product.oldPrice)}</p>
            ) : null}
            <p className="text-lg font-black">{toman(product.price)}</p>
            {product.stock <= 3 && product.stock > 0 ? (
              <p className="mt-0.5 text-[0.65rem] font-bold text-coral">
                تنها {faNumber(product.stock)} عدد باقی مانده
              </p>
            ) : null}
          </div>
          <AddToCartButton line={toCartLine(product)} disabled={product.stock === 0} />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
