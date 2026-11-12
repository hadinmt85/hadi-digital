import type { ProductQuery } from "@/lib/types";

export const PRODUCTS_PAGE_SIZE = 12;

export type ProductListParams = {
  q?: string;
  category?: string;
  sort?: string;
  min?: string;
  max?: string;
  brands: string[];
  rating?: string;
  instock?: string;
  free?: string;
  page: number;
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function all(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value.filter(Boolean);
  return value ? [value] : [];
}

function numeric(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const normalized = value.replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)));
  const parsed = Number(normalized.replace(/[^\d]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? String(parsed) : undefined;
}

export function parseProductListParams(params: RawSearchParams): ProductListParams {
  const pageValue = Number(first(params.page));
  return {
    q: first(params.q)?.trim() || undefined,
    category: first(params.category) || undefined,
    sort: first(params.sort) || undefined,
    min: numeric(first(params.min)),
    max: numeric(first(params.max)),
    brands: all(params.brand),
    rating: first(params.rating) || undefined,
    instock: first(params.instock) === "1" ? "1" : undefined,
    free: first(params.free) === "1" ? "1" : undefined,
    page: Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : 1,
  };
}

export function buildProductsUrl(
  params: ProductListParams,
  patch: Partial<ProductListParams> = {},
): string {
  const merged: ProductListParams = { ...params, ...patch };
  const search = new URLSearchParams();

  if (merged.q) search.set("q", merged.q);
  if (merged.category) search.set("category", merged.category);
  if (merged.sort && merged.sort !== "featured") search.set("sort", merged.sort);
  if (merged.min) search.set("min", merged.min);
  if (merged.max) search.set("max", merged.max);
  for (const brand of merged.brands) search.append("brand", brand);
  if (merged.rating) search.set("rating", merged.rating);
  if (merged.instock === "1") search.set("instock", "1");
  if (merged.free === "1") search.set("free", "1");
  if (merged.page > 1) search.set("page", String(merged.page));

  const query = search.toString();
  return `/products${query ? `?${query}` : ""}`;
}

export function toProductQuery(params: ProductListParams): ProductQuery {
  const min = params.min ? Number(params.min) : undefined;
  const max = params.max ? Number(params.max) : undefined;
  const rating = params.rating ? Number(params.rating) : undefined;

  return {
    q: params.q,
    category: params.category,
    sort: params.sort,
    brands: params.brands.length > 0 ? params.brands : undefined,
    minPrice: Number.isFinite(min) ? min : undefined,
    maxPrice: Number.isFinite(max) ? max : undefined,
    minRating: Number.isFinite(rating) ? rating : undefined,
    inStock: params.instock === "1",
    freeShipping: params.free === "1",
  };
}

export const ratingOptions = [
  { value: "4.5", label: "۴.۵ به بالا" },
  { value: "4", label: "۴ به بالا" },
  { value: "3", label: "۳ به بالا" },
];
