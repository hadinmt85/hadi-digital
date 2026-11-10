import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeftIcon, CloseIcon, SearchIcon } from "@/components/icons";
import { ProductGrid } from "@/components/product-card";
import { getCategories, getProducts } from "@/lib/data";
import { faNumber } from "@/lib/format";

type Search = {
  category?: string | string[];
  q?: string | string[];
  sort?: string | string[];
};

export const metadata = {
  title: "فروشگاه گجت و کالای دیجیتال",
  description:
    "همه محصولات آرک: هدفون، ساعت هوشمند، موبایل، لپ‌تاپ، گیمینگ و خانه هوشمند با قیمت و موجودی به‌روز.",
};

const sortOptions = [
  { value: "featured", label: "پیشنهادی" },
  { value: "new", label: "جدیدترین" },
  { value: "cheap", label: "ارزان‌ترین" },
  { value: "expensive", label: "گران‌ترین" },
  { value: "rating", label: "محبوب‌ترین" },
];

function one(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function buildHref(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const query = search.toString();
  return `/products${query ? `?${query}` : ""}`;
}

function ResultsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-80 animate-pulse rounded-[1.75rem] bg-paper" />
      ))}
    </div>
  );
}

export default function ProductsPage({ searchParams }: { searchParams: Promise<Search> }) {
  return (
    <div className="container-x py-10">
      <div className="max-w-2xl">
        <p className="eyebrow">فروشگاه</p>
        <h1 className="mt-4 text-3xl font-black sm:text-4xl">همه گجت‌ها، یک‌جا</h1>
        <p className="mt-3 text-sm leading-7 text-mute">
          همه محصولات اصل با گارانتی ۱۸ ماهه. با فیلتر دسته و مرتب‌سازی، سریع‌تر به انتخاب درست
          برس.
        </p>
      </div>

      <Suspense fallback={<div className="mt-10"><ResultsSkeleton /></div>}>
        <Results searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Results({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const category = one(params.category);
  const q = one(params.q);
  const sort = one(params.sort) ?? "featured";

  const categories = await getCategories();
  const [products, allProducts] = await Promise.all([
    getProducts({ category, q, sort }),
    getProducts({ limit: 100 }),
  ]);
  const activeCategory = categories.find((item) => item.slug === category);

  return (
    <div className="mt-8 grid gap-8 md:grid-cols-[15rem_1fr]">
      <aside className="md:sticky md:top-32 md:h-fit">
        <div className="surface p-5">
          <p className="text-sm font-black">دسته‌بندی</p>
          <ul className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1 md:block md:space-y-1 md:overflow-visible md:pb-0">
            <li className="shrink-0 md:block">
              <Link
                href={buildHref({ q, sort })}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-bold transition ${
                  !category ? "bg-ink text-white" : "text-ink-soft hover:bg-ink/5"
                }`}
              >
                همه محصولات
                <span className="rounded-full bg-current/10 px-1.5 text-[0.6rem] opacity-60">
                  {faNumber(allProducts.length)}
                </span>
              </Link>
            </li>
            {categories.map((item) => {
              const active = item.slug === category;
              return (
                <li key={item.slug} className="shrink-0 md:block">
                  <Link
                    href={buildHref({ category: item.slug, q, sort })}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-bold transition ${
                      active ? "bg-ink text-white" : "text-ink-soft hover:bg-ink/5"
                    }`}
                  >
                    <span aria-hidden>{item.emoji}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-4 overflow-hidden rounded-3xl bg-violet p-5 text-white">
          <p className="text-xs font-black text-lime">مشاوره خرید</p>
          <p className="mt-2 text-sm font-bold leading-6">
            مطمئن نیستی کدام گجت مناسبته؟
          </p>
          <p className="mt-1 text-xs text-white/60">تیم پشتیبانی هر روز ۹ تا ۲۱ پاسخ می‌دهد.</p>
          <a href="tel:+982112345678" className="btn btn-lime mt-4 h-10 px-4 text-xs">
            تماس با کارشناس
          </a>
        </div>
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-mute">مرتب‌سازی:</span>
            {sortOptions.map((option) => (
              <Link
                key={option.value}
                href={buildHref({ category, q, sort: option.value })}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                  sort === option.value
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-paper text-ink-soft hover:border-ink/30"
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
          <p className="text-xs font-bold text-mute">
            {faNumber(products.length)} محصول
            {activeCategory ? ` در «${activeCategory.name}»` : ""}
          </p>
        </div>

        {q ? (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-line bg-paper px-4 py-3">
            <p className="flex items-center gap-2 text-sm font-bold">
              <SearchIcon className="size-4 text-violet" />
              نتایج جستجو برای «{q}»
            </p>
            <Link
              href={buildHref({ category, sort })}
              className="inline-flex items-center gap-1 text-xs font-bold text-mute hover:text-ink"
            >
              <CloseIcon className="size-3.5" />
              حذف
            </Link>
          </div>
        ) : null}

        {products.length > 0 ? (
          <div className="mt-5">
            <ProductGrid products={products} />
          </div>
        ) : (
          <div className="mt-5 rounded-[2rem] border border-dashed border-line bg-paper/60 px-6 py-16 text-center">
            <p className="text-5xl" aria-hidden>
              🔍
            </p>
            <h2 className="mt-4 text-xl font-black">چیزی پیدا نکردیم</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-mute">
              فیلترها را ساده‌تر کن یا عبارت دیگری جستجو کن. شاید گجت مورد علاقه‌ات در دسته دیگری
              باشد.
            </p>
            <Link href="/products" className="btn btn-primary mt-6">
              دیدن همه محصولات
              <ArrowLeftIcon className="size-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
