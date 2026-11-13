import { cacheLife, cacheTag } from "next/cache";
import { query, withTransaction } from "@/lib/db";
import type { Review } from "@/lib/types";

type ReviewRow = {
  id: number;
  product_id: number;
  name: string;
  rating: number;
  body: string;
  created_at: string | Date;
};

function mapReview(row: ReviewRow): Review {
  return {
    id: Number(row.id),
    productId: Number(row.product_id),
    name: row.name,
    rating: Number(row.rating),
    body: row.body,
    createdAt:
      row.created_at instanceof Date ? row.created_at.toISOString() : new Date(row.created_at).toISOString(),
  };
}

export async function getProductReviews(productId: number, limit = 6): Promise<Review[]> {
  "use cache";
  cacheTag("products");
  cacheLife("hours");

  const rows = await query<ReviewRow>(
    `SELECT id, product_id, name, rating, body, created_at
     FROM reviews
     WHERE product_id = $1
     ORDER BY created_at DESC, id DESC
     LIMIT $2`,
    [productId, limit],
  );

  return rows.map(mapReview);
}

export async function createReview(input: {
  productId: number;
  name: string;
  rating: number;
  body: string;
}): Promise<Review | null> {
  return withTransaction(async (q) => {
    const products = await q<{ id: number }>("SELECT id FROM products WHERE id = $1", [input.productId]);
    if (!products[0]) return null;

    const rows = await q<ReviewRow>(
      `INSERT INTO reviews (product_id, name, rating, body)
       VALUES ($1, $2, $3, $4)
       RETURNING id, product_id, name, rating, body, created_at`,
      [input.productId, input.name, input.rating, input.body],
    );

    await q(
      `UPDATE products
       SET rating = ROUND(((rating::numeric * review_count) + $2::numeric) / (review_count + 1), 2)::real,
           review_count = review_count + 1
       WHERE id = $1`,
      [input.productId, input.rating],
    );

    return mapReview(rows[0]);
  });
}
