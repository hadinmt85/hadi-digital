import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowStartIcon,
  CheckIcon,
  PhoneIcon,
  ShieldIcon,
  TruckIcon,
} from "@/components/icons";
import { ProductArt } from "@/components/product-art";
import { getOrderByCode } from "@/lib/data";
import { faDate, faNumber, toFaDigits, toman } from "@/lib/format";

type Params = Promise<{ code: string }>;

export const metadata = {
  title: "سفارش ثبت شد",
};

export default function OrderPage({ params }: { params: Params }) {
  return (
    <Suspense
      fallback={
        <div className="container-x py-20">
          <div className="mx-auto h-72 max-w-2xl animate-pulse rounded-[2rem] bg-paper" />
        </div>
      }
    >
      <OrderDetail params={params} />
    </Suspense>
  );
}

async function OrderDetail({ params }: { params: Params }) {
  const { code } = await params;
  const order = await getOrderByCode(code);
  if (!order) notFound();

  return (
    <div className="container-x py-4">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl border border-line bg-paper p-6 sm:p-8">
          <span className="grid size-12 place-items-center rounded-xl bg-lime text-ink">
            <CheckIcon className="size-6" />
          </span>
          <h1 className="mt-4 text-xl font-black sm:text-2xl">سفارش شما با موفقیت ثبت شد</h1>
          <p className="mt-2 max-w-lg text-xs leading-6 text-mute">
            {order.customerName} عزیز، سفارش شما در صف پردازش قرار گرفت. جزئیات و کد پیگیری را
            پایین می‌بینی؛ وضعیت را می‌توانی با شماره سفارش پیگیری کنی.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <div className="rounded-lg bg-[#f7f7f8] px-4 py-2.5">
              <p className="text-[10px] font-bold text-mute">شماره سفارش</p>
              <p className="mt-1 text-sm font-black tracking-wider" dir="ltr">
                {order.code}
              </p>
            </div>
            <div className="rounded-lg bg-[#f7f7f8] px-4 py-2.5">
              <p className="text-[10px] font-bold text-mute">تاریخ ثبت</p>
              <p className="mt-1 text-xs font-bold">{faDate(order.createdAt)}</p>
            </div>
            <div className="rounded-lg bg-[#f7f7f8] px-4 py-2.5">
              <p className="text-[10px] font-bold text-mute">وضعیت</p>
              <p className="mt-1 text-xs font-bold text-coral">{order.status}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="surface p-4">
            <h2 className="text-sm font-black">اطلاعات ارسال</h2>
            <p className="mt-3 text-xs leading-6 text-ink-soft/80">{order.address}</p>
            <p className="mt-2 text-[11px] text-mute" dir="ltr">
              {order.phone}
            </p>
            {order.postalCode ? (
              <p className="mt-1 text-[11px] text-mute">کد پستی: {toFaDigits(order.postalCode)}</p>
            ) : null}
            {order.note ? (
              <p className="mt-3 rounded-lg bg-[#f7f7f8] px-3 py-2 text-[11px] text-ink-soft">
                یادداشت: {order.note}
              </p>
            ) : null}
          </div>

          <div className="surface p-4">
            <h2 className="text-sm font-black">پیگیری سفارش</h2>
            <ol className="mt-4 space-y-4">
              {[
                { title: "ثبت سفارش", done: true, text: "با موفقیت ثبت شد" },
                { title: "آماده‌سازی و بسته‌بندی", done: true, text: "امروز انجام می‌شود" },
                { title: "تحویل به پست/پیک", done: false, text: "حداکثر ۲۴ ساعت آینده" },
                { title: "تحویل به شما", done: false, text: "تهران ۱ روز، شهرستان ۲ تا ۴ روز" },
              ].map((step) => (
                <li key={step.title} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-[0.6rem] font-black ${
                      step.done ? "bg-lime text-ink" : "border border-line bg-white text-mute"
                    }`}
                  >
                    {step.done ? <CheckIcon className="size-3.5" /> : "•"}
                  </span>
                  <div>
                    <p className="text-xs font-extrabold">{step.title}</p>
                    <p className="text-[0.65rem] text-mute">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="surface mt-5 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black">اقلام سفارش</h2>
            <span className="text-[0.7rem] font-bold text-mute">
              {faNumber(order.items.reduce((sum, item) => sum + item.qty, 0))} کالا
            </span>
          </div>

          <ul className="mt-4 divide-y divide-line">
            {order.items.map((item) => (
              <li key={`${item.productId}-${item.name}`} className="flex items-center gap-3 py-3">
                <ProductArt
                  product={{
                    emoji: item.emoji,
                    image: null,
                    name: item.name,
                    brand: "",
                    gradientFrom: "#6c4cf1",
                    gradientTo: "#121016",
                  }}
                  size="sm"
                  className="size-14 shrink-0 rounded-xl"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-bold">{item.name}</p>
                  <p className="text-[0.65rem] text-mute">
                    {faNumber(item.qty)} × {toman(item.price)}
                  </p>
                </div>
                <p className="text-sm font-black">{toman(item.price * item.qty)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-mute">جمع کالاها</span>
              <span className="font-bold">{toman(order.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-mute">ارسال</span>
              <span className="font-bold">{order.shipping === 0 ? "رایگان" : toman(order.shipping)}</span>
            </div>
            <div className="flex items-center justify-between text-base">
              <span className="font-black">مبلغ کل</span>
              <span className="font-black">{toman(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link href="/products" className="btn btn-primary">
            ادامه خرید
            <ArrowStartIcon className="size-4" />
          </Link>
          <a href="tel:+982177984561" className="btn btn-ghost">
            <PhoneIcon className="size-4" />
            تماس با پشتیبانی
          </a>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { icon: TruckIcon, text: "ارسال سریع و بیمه‌شده" },
            { icon: ShieldIcon, text: "۱۸ ماه گارانتی رسمی" },
            { icon: CheckIcon, text: "۷ روز ضمانت بازگشت" },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-2 rounded-2xl border border-line bg-paper px-4 py-3 text-[0.7rem] font-bold text-ink-soft"
            >
              <item.icon className="size-4 text-violet" />
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
