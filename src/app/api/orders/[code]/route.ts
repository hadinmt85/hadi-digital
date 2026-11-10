import { getOrderByCode } from "@/lib/data";

/** GET /api/orders/[code] — با کد عمومی سفارش (نه شناسهٔ ترتیبی) */
export async function GET(
  _request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;
  const order = await getOrderByCode(code);

  if (!order) {
    return Response.json({ error: "سفارش پیدا نشد." }, { status: 404 });
  }

  return Response.json({ order }, { headers: { "Cache-Control": "no-store" } });
}
