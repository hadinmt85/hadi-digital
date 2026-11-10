import { revalidateTag } from "next/cache";
import { createOrder } from "@/lib/data";import { toEnDigits } from "@/lib/format";

type Body = {
  customerName?: unknown;
  phone?: unknown;
  address?: unknown;
  postalCode?: unknown;
  note?: unknown;
  items?: unknown;
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * POST /api/orders
 * سفارش را سمت سرور اعتبارسنجی و ثبت می‌کند؛ قیمت‌ها از دیتابیس خوانده می‌شوند.
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "بدنه درخواست معتبر نیست." }, { status: 400 });
  }

  const customerName = text(body.customerName);
  const phone = toEnDigits(text(body.phone));
  const address = text(body.address);
  const postalCode = toEnDigits(text(body.postalCode));
  const note = text(body.note);

  if (customerName.length < 3) {
    return Response.json({ error: "نام و نام خانوادگی را کامل وارد کنید." }, { status: 400 });
  }
  if (!/^09\d{9}$/.test(phone)) {
    return Response.json({ error: "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)." }, { status: 400 });
  }
  if (address.length < 10) {
    return Response.json({ error: "نشانی پستی کامل را وارد کنید." }, { status: 400 });
  }
  if (postalCode && !/^\d{10}$/.test(postalCode)) {
    return Response.json({ error: "کد پستی باید ۱۰ رقم باشد." }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return Response.json({ error: "سبد خرید خالی است." }, { status: 400 });
  }

  const items: { productId: number; qty: number }[] = [];
  for (const raw of body.items) {
    if (!raw || typeof raw !== "object") {
      return Response.json({ error: "اقلام سفارش معتبر نیستند." }, { status: 400 });
    }
    const item = raw as { productId?: unknown; qty?: unknown };
    items.push({ productId: Number(item.productId), qty: Number(item.qty) });
  }

  const result = await createOrder({ customerName, phone, address, postalCode, note, items });

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  // موجودی محصولات تغییر کرده است.
  revalidateTag("products", "max");

  return Response.json(
    {
      id: result.order.id,
      code: result.order.code,
      total: result.order.total,
      status: result.order.status,
    },
    { status: 201 },
  );
}
