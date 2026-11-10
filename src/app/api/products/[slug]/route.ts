import { getProductBySlug } from "@/lib/data";

/** GET /api/products/[slug] */
export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return Response.json({ error: "محصول پیدا نشد." }, { status: 404 });
  }

  return Response.json({ product }, { headers: { "Cache-Control": "no-store" } });
}
