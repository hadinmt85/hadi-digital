import { revalidateTag } from "next/cache";
import { createReview } from "@/lib/reviews";

type Body = {
  productId?: unknown;
  name?: unknown;
  rating?: unknown;
  body?: unknown;
};

export async function POST(request: Request) {
  let payload: Body;
  try {
    payload = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "بدنهٔ درخواست معتبر نیست." }, { status: 400 });
  }

  const productId = Number(payload.productId);
  const rating = Number(payload.rating);
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const body = typeof payload.body === "string" ? payload.body.trim() : "";

  if (!Number.isInteger(productId) || productId <= 0) {
    return Response.json({ error: "محصول معتبر نیست." }, { status: 400 });
  }
  if (name.length < 2 || name.length > 40) {
    return Response.json({ error: "نام باید بین ۲ تا ۴۰ کاراکتر باشد." }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return Response.json({ error: "امتیاز باید بین ۱ تا ۵ باشد." }, { status: 400 });
  }
  if (body.length < 10 || body.length > 600) {
    return Response.json({ error: "متن نظر باید بین ۱۰ تا ۶۰۰ کاراکتر باشد." }, { status: 400 });
  }

  const review = await createReview({ productId, name, rating, body });
  if (!review) {
    return Response.json({ error: "محصول پیدا نشد." }, { status: 404 });
  }

  revalidateTag("products", "max");

  return Response.json({ review }, { status: 201 });
}
