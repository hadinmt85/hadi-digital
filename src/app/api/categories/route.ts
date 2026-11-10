import { connection } from "next/server";
import { getCategories, getProducts } from "@/lib/data";

/** GET /api/categories */
export async function GET() {
  // آمار تعداد محصول باید در هر درخواست تازه باشد.
  await connection();

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ limit: 100 }),
  ]);

  return Response.json({
    categories: categories.map((category) => ({
      ...category,
      productCount: products.filter((product) => product.categorySlug === category.slug).length,
    })),
  });
}
