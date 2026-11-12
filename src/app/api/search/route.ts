import { getBrands, getCategories, getProducts } from "@/lib/data";

export async function GET(request: Request) {
  const query = (new URL(request.url).searchParams.get("q") ?? "").trim();

  if (query.length < 2) {
    return Response.json(
      { products: [], categories: [], brands: [] },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const [products, categories, brands] = await Promise.all([
    getProducts({ q: query, limit: 6 }),
    getCategories(),
    getBrands(),
  ]);

  return Response.json(
    {
      products: products.map((product) => ({
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        emoji: product.emoji,
      })),
      categories: categories
        .filter((category) => category.name.includes(query))
        .slice(0, 3)
        .map((category) => ({ slug: category.slug, name: category.name })),
      brands: brands.filter((brand) => brand.name.includes(query)).slice(0, 3),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
