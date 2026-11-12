import { getOrderByCode } from "@/lib/data";

/** GET /api/orders/[code] — با کد عمومی سفارش (نه شناسهٔ ترتیبی) */
export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;
  const order = await getOrderByCode(code);

  if (!order) {
    return Response.json({ error: "سفارش پیدا نشد." }, { status: 404 });
  }

  const phone = (new URL(request.url).searchParams.get("phone") ?? "").replace(/\D/g, "");
  if (phone) {
    const orderPhone = order.phone.replace(/\D/g, "");
    const matches =
      phone.length === 4
        ? orderPhone.endsWith(phone)
        : phone.length >= 10 && orderPhone.endsWith(phone);
    if (!matches) {
      return Response.json({ error: "شمارهٔ موبایل با این سفارش هم‌خوانی ندارد." }, { status: 403 });
    }
  }

  return Response.json({ order }, { headers: { "Cache-Control": "no-store" } });
}
