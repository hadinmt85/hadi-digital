import Link from "next/link";
import { buildProductsUrl, PRODUCTS_PAGE_SIZE, type ProductListParams } from "@/lib/product-query";
import { faNumber } from "@/lib/format";
import { ArrowLeftIcon } from "@/components/icons";

export function ProductPagination({
  params,
  total,
}: {
  params: ProductListParams;
  total: number;
}) {
  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PAGE_SIZE));
  if (totalPages <= 1) return null;

  const page = Math.min(params.page, totalPages);
  const pages: (number | "gap")[] = [];
  const windowStart = Math.max(1, Math.min(page - 2, totalPages - 4));
  const windowEnd = Math.min(totalPages, windowStart + 4);

  if (windowStart > 1) {
    pages.push(1);
    if (windowStart > 2) pages.push("gap");
  }
  for (let index = windowStart; index <= windowEnd; index += 1) {
    pages.push(index);
  }
  if (windowEnd < totalPages) {
    if (windowEnd < totalPages - 1) pages.push("gap");
    pages.push(totalPages);
  }

  return (
    <nav aria-label="صفحه‌بندی محصولات" className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link
          href={buildProductsUrl(params, { page: page - 1 })}
          rel="prev"
          className="flex h-9 items-center gap-1 rounded-lg border border-line bg-paper px-3 text-[11px] font-bold text-ink-soft transition hover:border-coral/40 hover:text-coral"
        >
          <ArrowLeftIcon className="size-3.5 rotate-180" />
          قبلی
        </Link>
      ) : (
        <span className="flex h-9 items-center gap-1 rounded-lg border border-line bg-[#f7f7f8] px-3 text-[11px] font-bold text-mute/50">
          <ArrowLeftIcon className="size-3.5 rotate-180" />
          قبلی
        </span>
      )}

      {pages.map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="px-1 text-xs text-mute">
            …
          </span>
        ) : item === page ? (
          <span
            key={item}
            aria-current="page"
            className="grid size-9 place-items-center rounded-lg bg-coral text-[11px] font-black text-white"
          >
            {faNumber(item)}
          </span>
        ) : (
          <Link
            key={item}
            href={buildProductsUrl(params, { page: item })}
            className="grid size-9 place-items-center rounded-lg border border-line bg-paper text-[11px] font-bold text-ink-soft transition hover:border-coral/40 hover:text-coral"
          >
            {faNumber(item)}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          href={buildProductsUrl(params, { page: page + 1 })}
          rel="next"
          className="flex h-9 items-center gap-1 rounded-lg border border-line bg-paper px-3 text-[11px] font-bold text-ink-soft transition hover:border-coral/40 hover:text-coral"
        >
          بعدی
          <ArrowLeftIcon className="size-3.5" />
        </Link>
      ) : (
        <span className="flex h-9 items-center gap-1 rounded-lg border border-line bg-[#f7f7f8] px-3 text-[11px] font-bold text-mute/50">
          بعدی
          <ArrowLeftIcon className="size-3.5" />
        </span>
      )}
    </nav>
  );
}
