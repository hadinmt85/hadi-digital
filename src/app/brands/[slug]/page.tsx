import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@/components/icons";
import { ProductGrid } from "@/components/product-card";
import { brandFromSlug, brandToSlug } from "@/lib/brands";
import { getBrands, getProducts } from "@/lib/data";
import { faNumber } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const brand = brandFromSlug(slug);
  if (!brand) return { title: "برند پیدا نشد" };
  return {
    title: `محصولات ${brand}`,
    description: `خرید محصولات برند ${brand} از Hadi Store با گارانتی و ارسال سریع.`,
  };
}

export default async function BrandPage({ params }: { params: Params }) {
  const { slug } = await params;
  const brand = brandFromSlug(slug);
  if (!brand) notFound();

  const products = await getProducts({ brands: [brand], limit: 100 });

  return (
    <div className="container-x py-4">
      <nav
        aria-label="مسیر صفحه"
        className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-mute"
      >
        <Link href="/" className="transition hover:text-ink">
          خانه
        </Link>
        <span aria-hidden>/</span>
        <Link href="/brands" className="transition hover:text-ink">
          برندها
        </Link>
        <span aria-hidden>/</span>
        <span className="text-ink">{brand}</span>
      </nav>

      <header className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-line bg-paper p-4 sm:p-5">
        <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#3f4064] to-[#ef4056] text-2xl font-black text-white">
          {brand.slice(0, 1)}
        </span>
        <div className="min-w-0">
          <h1 className="text-xl font-black sm:text-2xl">محصولات {brand}</h1>
          <p className="mt-1 text-[11px] leading-6 text-mute">
            {faNumber(products.length)} محصول از برند {brand} با گارانتی رسمی و ارسال سریع.
          </p>
        </div>
        <Link
          href={`/products?brand=${encodeURIComponent(brand)}`}
          className="ms-auto inline-flex items-center gap-1 text-[10.5px] font-bold text-coral hover:underline"
        >
          فیلتر در همهٔ محصولات
          <ArrowLeftIcon className="size-3.5" />
        </Link>
      </header>

      <div className="mt-5">
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="rounded-xl border border-dashed border-line bg-paper px-6 py-14 text-center">
            <h2 className="text-base font-black">محصولی از این برند موجود نیست</h2>
            <Link href="/brands" className="btn btn-primary mt-5 h-10 px-4 text-xs">
              دیدن همهٔ برندها
            </Link>
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-[10px] text-mute">
        مسیر این برند: <span className="font-mono" dir="ltr">/brands/{brandToSlug(brand)}</span>
      </p>
    </div>
  );
}
