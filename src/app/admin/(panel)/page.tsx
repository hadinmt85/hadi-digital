import { updateStatusAction } from "@/app/admin/(panel)/actions";
import { ProductForm } from "@/app/admin/(panel)/product-form";
import { ProductArt } from "@/components/product-art";
import { getCategories, getOrders, getProducts, getStats } from "@/lib/data";
import { faDate, faNumber, toman } from "@/lib/format";
import { connection } from "next/server";

const statuses = ["در حال پردازش", "ارسال شده", "تحویل شده", "لغو شده"];

const statusStyles: Record<string, string> = {
  "در حال پردازش": "bg-amber-100 text-amber-800",
  "ارسال شده": "bg-sky-100 text-sky-800",
  "تحویل شده": "bg-emerald-100 text-emerald-800",
  "لغو شده": "bg-rose-100 text-rose-800",
};

export default async function AdminDashboardPage() {
  // داده‌های پنل باید در هر درخواست تازه باشند (نه در بیلد).
  await connection();

  const [stats, orders, products, categories] = await Promise.all([
    getStats(),
    getOrders(15),
    getProducts({ limit: 100 }),
    getCategories(),
  ]);

  const cards = [
    { label: "کل سفارش‌ها", value: faNumber(stats.orders), tone: "bg-ink text-white" },
    { label: "فروش کل", value: toman(stats.revenue), tone: "bg-lime text-ink" },
    { label: "محصولات فعال", value: faNumber(stats.products), tone: "bg-paper text-ink" },
    {
      label: "موجودی کمتر از ۵",
      value: faNumber(stats.lowStock),
      tone: "bg-coral text-white",
    },
  ];

  return (
    <div className="mt-5 space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-[1.5rem] border border-line p-5 ${card.tone}`}
          >
            <p
              className={`text-[0.7rem] font-bold ${
                card.tone.includes("text-white") ? "text-white/55" : "text-mute"
              }`}
            >
              {card.label}
            </p>
            <p className="mt-2 text-xl font-black">{card.value}</p>
          </div>
        ))}
      </div>

      <section className="surface overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="text-base font-black">سفارش‌های اخیر</h2>
            <p className="mt-0.5 text-[0.7rem] text-mute">
              وضعیت هر سفارش را می‌توانی همین‌جا تغییر بدهی.
            </p>
          </div>
          <span className="rounded-full bg-ink/5 px-3 py-1 text-[0.65rem] font-bold text-mute">
            {faNumber(orders.length)} سفارش
          </span>
        </div>

        {orders.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-mute">
            هنوز سفارشی ثبت نشده است. یک خرید آزمایشی انجام بده تا اینجا نمایش داده شود.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] text-sm">
              <thead>
                <tr className="bg-cream/70 text-[0.7rem] text-mute">
                  <th className="px-4 py-3 text-start font-bold">کد سفارش</th>
                  <th className="px-4 py-3 text-start font-bold">مشتری</th>
                  <th className="px-4 py-3 text-start font-bold">مبلغ</th>
                  <th className="px-4 py-3 text-start font-bold">تاریخ</th>
                  <th className="px-4 py-3 text-start font-bold">وضعیت</th>
                  <th className="px-4 py-3 text-start font-bold">تغییر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.map((order) => (
                  <tr key={order.id} className="align-middle">
                    <td className="px-4 py-3 font-black" dir="ltr">
                      {order.code}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-bold">{order.customerName}</p>
                      <p className="text-[0.65rem] text-mute" dir="ltr">
                        {order.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs font-bold">{toman(order.total)}</td>
                    <td className="px-4 py-3 text-[0.65rem] text-mute">{faDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-[0.65rem] font-black ${
                          statusStyles[order.status] ?? "bg-ink/5 text-ink"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <form action={updateStatusAction} className="flex items-center gap-1.5">
                        <input type="hidden" name="id" value={order.id} />
                        <select
                          name="status"
                          defaultValue={order.status}
                          className="h-8 rounded-lg border border-line bg-white px-2 text-[0.7rem] font-bold"
                          aria-label="وضعیت سفارش"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="h-8 rounded-lg bg-ink px-2.5 text-[0.65rem] font-bold text-lime"
                        >
                          ثبت
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="surface overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <h2 className="text-base font-black">محصولات و موجودی</h2>
          <span className="rounded-full bg-ink/5 px-3 py-1 text-[0.65rem] font-bold text-mute">
            {faNumber(products.length)} محصول
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead>
              <tr className="bg-cream/70 text-[0.7rem] text-mute">
                <th className="px-4 py-3 text-start font-bold">محصول</th>
                <th className="px-4 py-3 text-start font-bold">دسته</th>
                <th className="px-4 py-3 text-start font-bold">قیمت</th>
                <th className="px-4 py-3 text-start font-bold">موجودی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <ProductArt product={product} size="sm" className="size-9 rounded-lg" />
                      <div>
                        <p className="text-xs font-bold">{product.name}</p>
                        <p className="text-[0.6rem] text-mute">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-[0.7rem] font-bold text-mute">
                    {product.categoryName}
                  </td>
                  <td className="px-4 py-2.5 text-xs font-bold">{toman(product.price)}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[0.65rem] font-black ${
                        product.stock <= 5
                          ? "bg-coral/15 text-coral"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {faNumber(product.stock)} عدد
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-black">افزودن محصول جدید</h2>
            <p className="mt-0.5 text-[0.7rem] text-mute">
              محصول بلافاصله در فروشگاه نمایش داده می‌شود.
            </p>
          </div>
          <span className="rounded-full bg-lime px-3 py-1 text-[0.65rem] font-black text-ink">
            فرم سریع
          </span>
        </div>
        <ProductForm categories={categories} />
      </section>
    </div>
  );
}
