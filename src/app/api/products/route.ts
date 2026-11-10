import { getProducts } from "@/lib/data";

/**
 * GET /api/products?category=audio&q=هدفون&sort=cheap&limit=20
 * لیست محصولات با فیلتر و مرتب‌سازی.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;
  const sort = url.searchParams.get("sort") ?? undefined;
  const limitRaw = Number(url.searchParams.get("limit"));
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : undefined;

  const products = await getProducts({ category, q, sort, limit });

  return Response.json(
    { count: products.length, products },
    { headers: { "Cache-Control": "no-store" } },
  );
}
