import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartPanel } from "@/components/add-to-cart-panel";
import {
  CheckIcon,
  CardIcon,
  ReturnIcon,
  ShieldIcon,
  StarIcon,
  TruckIcon,
} from "@/components/icons";
import { ProductArt } from "@/components/product-art";
import { ProductCard, toCartLine } from "@/components/product-card";
import { getProductBySlug, getProductSlugs, getRelatedProducts } from "@/lib/data";
import { discountPercent, faNumber, toman } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "محصول پیدا نشد" };
  return {
    title: product.name,
    description: `${product.tagline} — خرید ${product.name} با گارانتی ۱۸ ماهه از Hadi Store.`,
  };
}

export default function ProductPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <ProductDetail params={params} />
    </Suspense>
  );
}

function DetailSkeleton() {
  return (
    <div className="container-x py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-[2rem] bg-paper" />
        <div className="space-y-4">
          <div className="h-4 w-32 animate-pulse rounded bg-paper" />
          <div className="h-9 w-3/4 animate-pulse rounded bg-paper" />
          <div className="h-24 animate-pulse rounded-2xl bg-paper" />
          <div className="h-12 animate-pulse rounded-full bg-paper" />
        </div>
      </div>
    </div>
  );
}

async function ProductDetail({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.categorySlug, 4);
  const off = discountPercent(product.price, product.oldPrice);

  return (
    <div className="container-x py-4">
      <nav aria-label="مسیر صفحه" className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-mute">
        <Link href="/" className="transition hover:text-ink">
          خانه
        </Link>
        <span aria-hidden>/</span>
        <Link href="/products" className="transition hover:text-ink">
          فروشگاه
        </Link>
        <span aria-hidden>/</span>
        <Link
          href={`/products?category=${product.categorySlug}`}
          className="transition hover:text-ink"
        >
          {product.categoryName}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
        <div className="relative">
          <ProductArt
            product={product}
            size="lg"
            priority
            imageSizes="(min-width: 1024px) 45vw, 100vw"
            className="aspect-square rounded-xl border border-line"
          />
          <div className="mt-3 grid grid-cols-3 gap-3">
            {product.specs.slice(0, 3).map((spec) => (
              <div
                key={spec}
                className="rounded-2xl border border-line bg-paper px-3 py-3 text-center text-[0.7rem] font-bold text-ink-soft"
              >
                {spec}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/products?category=${product.categorySlug}`}
              className="eyebrow hover:bg-ink/10"
            >
              {product.categoryName}
            </Link>
            <span className="text-xs font-bold text-mute">{product.brand}</span>
            {product.badge ? (
              <span className="rounded-full bg-coral px-2.5 py-1 text-[0.65rem] font-black text-white">
                {product.badge}
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 text-2xl font-black leading-snug sm:text-3xl">{product.name}</h1>
          <p className="mt-2 text-sm text-mute">{product.tagline}</p>

          <div className="mt-4 flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1 font-black">
              <StarIcon className="size-4 text-ink" />
              {faNumber(Number(product.rating.toFixed(1)))}
            </span>
            <span className="text-xs text-mute">
              ({faNumber(product.reviewCount)} نظر ثبت‌شده)
            </span>
            <span
              className={`text-xs font-bold ${product.stock > 0 ? "text-emerald-700" : "text-coral"}`}
            >
              {product.stock > 0 ? "موجود در انبار" : "ناموجود"}
            </span>
          </div>

          <div className="mt-4 rounded-xl border border-line bg-paper p-4">
            {product.oldPrice ? (
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-coral px-2 py-0.5 text-[10px] font-black text-white">
                  {faNumber(off)}٪ تخفیف
                </span>
                <span className="text-xs text-mute line-through">{toman(product.oldPrice)}</span>
              </div>
            ) : null}
            <p className="mt-1 whitespace-nowrap text-2xl font-black">{toman(product.price)}</p>
            <p className="mt-1 text-[10.5px] text-mute">
              قیمت شامل مالیات است. ارسال رایگان برای سفارش بالای ۲ میلیون تومان.
            </p>

            <div className="mt-5">
              <AddToCartPanel line={toCartLine(product)} stock={product.stock} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-[0.7rem] font-bold text-ink-soft">
              <span className="flex items-center gap-2">
                <TruckIcon className="size-4 text-violet" />
                ارسال ۲۴ ساعته در تهران
              </span>
              <span className="flex items-center gap-2">
                <ShieldIcon className="size-4 text-violet" />
                ۱۸ ماه گارانتی رسمی
              </span>
              <span className="flex items-center gap-2">
                <ReturnIcon className="size-4 text-violet" />
                ۷ روز ضمانت بازگشت
              </span>
              <span className="flex items-center gap-2">
                <CardIcon className="size-4 text-violet" />
                پرداخت در محل
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-[#f0f0f1] px-4 py-3 text-xs font-bold text-ink-soft">
            <CheckIcon className="mt-0.5 size-4 shrink-0" />
            اصالت کالا تضمین‌شده است؛ در صورت مغایرت، هزینه کامل بازگردانده می‌شود.
          </div>
        </div>
      </div>

      <section className="mt-6 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <div className="surface p-4">
          <h2 className="text-base font-black">درباره این محصول</h2>
          <p className="mt-4 text-sm leading-8 text-ink-soft/85">{product.description}</p>
          <p className="mt-4 text-sm leading-8 text-ink-soft/85">
            Hadi Store این محصول را با بسته‌بندی ضدضربه ارسال می‌کند و در صورت نیاز به راه‌اندازی،
            راهنمای تصویری اختصاصی در اختیار شما قرار می‌گیرد. برای مشاوره پیش از خرید هم می‌توانید
            با کارشناسان ما تماس بگیرید.
          </p>
        </div>

        <div className="surface p-4">
          <h2 className="text-base font-black">مشخصات کلیدی</h2>
          <dl className="mt-4 divide-y divide-line">
            {product.specs.map((spec, index) => (
              <div key={spec} className="flex items-center justify-between gap-4 py-3">
                <dt className="text-xs font-bold text-mute">ویژگی {faNumber(index + 1)}</dt>
                <dd className="text-sm font-extrabold">{spec}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-xs font-bold text-mute">برند</dt>
              <dd className="text-sm font-extrabold">{product.brand}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-xs font-bold text-mute">دسته</dt>
              <dd className="text-sm font-extrabold">{product.categoryName}</dd>
            </div>
          </dl>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-lg font-black">شاید این‌ها هم به کارت بیاید</h2>
            <Link
              href={`/products?category=${product.categorySlug}`}
              className="text-sm font-bold text-violet hover:underline"
            >
              همه {product.categoryName}
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
