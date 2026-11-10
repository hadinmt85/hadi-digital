import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import {
  ArrowLeftIcon,
  BoltIcon,
  CardIcon,
  ReturnIcon,
  ShieldIcon,
  StarIcon,
  TruckIcon,
} from "@/components/icons";
import { ProductArt } from "@/components/product-art";
import { ProductGrid } from "@/components/product-card";
import { discountPercent, faNumber, toman } from "@/lib/format";
import { getCategories, getProducts } from "@/lib/data";

const trustItems = [
  { icon: TruckIcon, title: "ارسال سریع", text: "تهران ۲۴ ساعته، شهرستان ۴۸ ساعته" },
  { icon: ShieldIcon, title: "گارانتی اصالت", text: "۱۸ ماه ضمانت رسمی روی همه کالاها" },
  { icon: ReturnIcon, title: "۷ روز بازگشت", text: "بدون سؤال، اگر نپسندیدی برگردان" },
  { icon: CardIcon, title: "پرداخت امن", text: "درگاه معتبر و پرداخت در محل" },
];

const brands = ["آیریس", "نیوا", "کوب", "هایپر", "پیکسا", "زنیت", "رودی", "ایرو"];

const testimonials = [
  {
    name: "سارا محمدی",
    role: "طراح محصول",
    text: "هدفون آیریس رو دو ماهه استفاده می‌کنم؛ حذف نویزش واقعاً عالیه. بسته‌بندی و ارسال هم بی‌نقص بود.",
    emoji: "🎧",
  },
  {
    name: "آرمان رضایی",
    role: "گیمر",
    text: "کیبورد K87 رو برای گیم گرفتم، حس تایپش فوق‌العاده‌ست. پشتیبانی هم توی انتخاب سوییچ کمک کرد.",
    emoji: "⌨️",
  },
  {
    name: "نگار کاظمی",
    role: "دانشجوی معماری",
    text: "مانیتور پیکسا برای رندرها دقیقاً همون چیزی بود که لازم داشتم. با USB-C فقط یک کابل روی میزمه.",
    emoji: "🖥️",
  },
];

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ limit: 100 }),
  ]);
  const featured = products.slice(0, 8);
  const spotlight =
    products.find((product) => product.slug === "iris-pro-headphones") ?? featured[0];
  const spotlightOff = spotlight ? discountPercent(spotlight.price, spotlight.oldPrice) : 0;

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div
          className="pointer-events-none absolute -top-32 start-1/3 size-[30rem] rounded-full bg-violet/15 blur-3xl"
          aria-hidden
        />

        <div className="container-x relative grid items-center gap-12 py-12 md:grid-cols-[1.05fr_0.95fr] md:py-16 lg:py-20">
          <div className="animate-rise">
            <span className="eyebrow">
              <span className="size-1.5 rounded-full bg-coral" />
              کالکشن پاییز ۱۴۰۵ رسید
            </span>

            <h1 className="mt-5 text-[clamp(2.2rem,4.6vw,4.2rem)] font-black leading-[1.15]">
              گجت بعدی‌ات را
              <br />
              <span className="relative mx-1 inline-block px-2">
                <span className="absolute inset-x-0 bottom-1 -z-0 h-[55%] -rotate-1 rounded-xl bg-lime" aria-hidden />
                <span className="relative">اینجا</span>
              </span>
              پیدا کن
            </h1>

            <p className="mt-5 max-w-lg text-base leading-8 text-ink-soft/80">
              از هدفون‌های استودیویی تا خانه هوشمند؛ آرک محصولات اصل را با قیمت شفاف، گارانتی
              واقعی و ارسال سریع به دستت می‌رساند.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/products" className="btn btn-violet">
                دیدن همه محصولات
                <ArrowLeftIcon className="size-4" />
              </Link>
              <Link href="/products?sort=cheap" className="btn btn-ghost">
                پیشنهادهای امروز
              </Link>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
              {[
                { value: "۱۲هزار+", label: "مشتری راضی" },
                { value: "۴.۸ از ۵", label: "امتیاز خریداران" },
                { value: "۲۴ ساعته", label: "ارسال در تهران" },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-lg font-black">{item.value}</dt>
                  <dd className="mt-1 text-[0.7rem] font-bold text-mute">{item.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {spotlight ? (
            <div className="relative mx-auto w-full max-w-md animate-rise [animation-delay:120ms]">
              <div
                className="absolute -inset-6 rounded-[3rem] bg-violet/20 blur-2xl"
                aria-hidden
              />
              <div className="relative rounded-[2.5rem] bg-ink p-4 shadow-[0_40px_80px_-40px_rgba(18,16,22,0.75)]">
                <div className="flex items-center justify-between px-3 pb-3 pt-1 text-white">
                  <span className="text-xs font-bold text-white/60">پیشنهاد ویژه این هفته</span>
                  <span className="flex items-center gap-1 text-xs font-black text-lime">
                    <StarIcon className="size-3.5" />
                    {faNumber(spotlight.rating)}
                  </span>
                </div>

                <ProductArt product={spotlight} size="lg" className="aspect-square rounded-[2rem]" />

                <div className="flex items-center justify-between gap-3 px-3 pb-2 pt-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-white">{spotlight.name}</p>
                    <p className="mt-1 text-xs text-white/50">{spotlight.brand}</p>
                  </div>
                  <div className="shrink-0 text-left">
                    {spotlight.oldPrice ? (
                      <p className="text-[0.65rem] text-white/40 line-through">
                        {toman(spotlight.oldPrice)}
                      </p>
                    ) : null}
                    <p className="text-base font-black text-lime">{toman(spotlight.price)}</p>
                  </div>
                </div>

                <Link
                  href={`/products/${spotlight.slug}`}
                  className="mt-2 flex h-12 items-center justify-center gap-2 rounded-[1.4rem] bg-lime text-sm font-black text-ink transition hover:bg-white"
                >
                  مشاهده و خرید
                  <ArrowLeftIcon className="size-4" />
                </Link>
              </div>

              {spotlightOff > 0 ? (
                <span className="animate-float absolute -start-4 top-24 rounded-2xl bg-coral px-3 py-2 text-xs font-black text-white shadow-lg [--tilt:-6deg]">
                  {faNumber(spotlightOff)}٪ تخفیف
                </span>
              ) : null}
              <span className="animate-float absolute -end-3 bottom-28 flex items-center gap-1.5 rounded-2xl bg-white px-3 py-2 text-xs font-black text-ink shadow-lg [animation-delay:1.2s] [--tilt:5deg]">
                <BoltIcon className="size-3.5 text-violet" />
                ارسال امروز
              </span>
            </div>
          ) : null}
        </div>
      </section>

      {/* ---------- Trust ---------- */}
      <section className="border-y border-line bg-paper/60">
        <div className="container-x grid gap-5 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink text-lime">
                <item.icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-extrabold">{item.title}</p>
                <p className="text-[0.7rem] text-mute">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Categories ---------- */}
      <section className="container-x py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black tracking-widest text-violet">دسته‌بندی‌ها</p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">دنبال چه چیزی هستی؟</h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-violet"
          >
            همه محصولات
            <ArrowLeftIcon className="size-4" />
          </Link>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => {
            const count = products.filter((product) => product.categorySlug === category.slug).length;
            return (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group flex flex-col items-center gap-3 rounded-3xl border border-line bg-paper px-3 py-5 text-center transition hover:-translate-y-1 hover:border-transparent hover:shadow-[0_20px_40px_-28px_rgba(18,16,22,0.5)]"
              >
                <span
                  className="grid size-14 place-items-center rounded-2xl text-2xl transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${category.color}22` }}
                >
                  {category.emoji}
                </span>
                <span className="text-xs font-extrabold leading-5">{category.name}</span>
                <span className="text-[0.65rem] font-bold text-mute">{faNumber(count)} محصول</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------- Featured ---------- */}
      <section className="container-x pb-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black tracking-widest text-coral">پرفروش‌ترین‌ها</p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">انتخاب مشتری‌های آرک</h2>
            <p className="mt-2 max-w-lg text-sm text-mute">
              محصولاتی که بیشترین امتیاز و رضایت را داشته‌اند؛ با موجودی به‌روز و قیمت همین امروز.
            </p>
          </div>
          <Link href="/products?sort=rating" className="btn btn-ghost">
            دیدن همه
            <ArrowLeftIcon className="size-4" />
          </Link>
        </div>

        <div className="mt-7">
          <ProductGrid products={featured} />
        </div>
      </section>

      {/* ---------- Brand strip ---------- */}
      <section className="border-y border-line bg-paper/50">
        <div className="container-x flex flex-wrap items-center justify-between gap-6 py-7">
          <span className="text-xs font-bold text-mute">برندهای همراه آرک</span>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {brands.map((brand) => (
              <span
                key={brand}
                className="text-base font-black text-ink/25 transition-colors hover:text-ink/60"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Promo ---------- */}
      <section className="container-x grid gap-4 py-14 lg:grid-cols-2">
        <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-lime p-8 text-ink sm:p-10">
          <div className="absolute -end-10 -top-10 size-48 rounded-full border-[20px] border-ink/10" aria-hidden />
          <div className="absolute -bottom-16 end-10 size-40 rounded-full bg-white/30 blur-xl" aria-hidden />
          <p className="text-xs font-black tracking-widest text-ink/60">حراج فصل</p>
          <h2 className="mt-3 max-w-xs text-3xl font-black leading-tight sm:text-4xl">
            تا ۴۰٪ تخفیف روی گجت‌های منتخب
          </h2>
          <p className="mt-3 max-w-sm text-sm font-medium text-ink/70">
            موجودی محدود است؛ محصولات دارای تخفیف را ببین و قبل از تمام‌شدن سفارش بده.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/products?sort=cheap" className="btn btn-primary">
              خرید با تخفیف
              <ArrowLeftIcon className="size-4" />
            </Link>
            <span className="text-5xl" aria-hidden>
              🎁
            </span>
          </div>
        </div>

        <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-violet p-8 text-white sm:p-10">
          <div className="grid-dots absolute inset-0 opacity-30" aria-hidden />
          <div className="absolute -end-8 -bottom-10 size-56 rounded-full bg-ink/25 blur-2xl" aria-hidden />
          <p className="text-xs font-black tracking-widest text-lime">کالکشن گیمینگ</p>
          <h2 className="mt-3 max-w-xs text-3xl font-black leading-tight sm:text-4xl">
            ست کامل برای یک میز گیمینگ واقعی
          </h2>
          <p className="mt-3 max-w-sm text-sm text-white/70">
            کیبورد مکانیکی، ماوس سبک و دسته بازی؛ همه با تأخیر نزدیک به صفر و هماهنگ با هم.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/products?category=gaming" className="btn btn-lime">
              ورود به کالکشن
              <ArrowLeftIcon className="size-4" />
            </Link>
            <span className="text-5xl" aria-hidden>
              🎮
            </span>
          </div>
        </div>
      </section>

      {/* ---------- Stats + testimonials ---------- */}
      <section className="container-x pb-14">
        <div className="rounded-[2.5rem] bg-ink px-6 py-10 text-white sm:px-10">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { value: "۱۲٬۴۰۰+", label: "سفارش تحویل‌شده" },
              { value: "۹۸٪", label: "رضایت از خرید" },
              { value: "۱۸ ماه", label: "گارانتی رسمی" },
            ].map((item, index) => (
              <div
                key={item.label}
                className={index > 0 ? "sm:border-s sm:border-white/10 sm:ps-8" : ""}
              >
                <p className="text-3xl font-black text-lime sm:text-4xl">{item.value}</p>
                <p className="mt-2 text-xs font-bold text-white/50">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {testimonials.map((item) => (
              <figure
                key={item.name}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="flex items-center gap-1 text-lime" aria-label="۵ از ۵">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon key={index} className="size-3.5" />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm leading-7 text-white/75">
                  «{item.text}»
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-2.5">
                  <span className="grid size-9 place-items-center rounded-full bg-white/10 text-base">
                    {item.emoji}
                  </span>
                  <span>
                    <span className="block text-xs font-extrabold">{item.name}</span>
                    <span className="block text-[0.65rem] text-white/40">{item.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Newsletter ---------- */}
      <section className="container-x pb-4">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-line bg-paper px-6 py-10 sm:px-10">
          <div className="absolute -start-16 -top-20 size-56 rounded-full bg-violet/10 blur-2xl" aria-hidden />
          <div className="relative grid items-center gap-6 md:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="text-2xl font-black sm:text-3xl">
                عضو خبرنامه شو، <span className="text-violet">۱۰٪ تخفیف</span> بگیر
              </h2>
              <p className="mt-2 max-w-md text-sm text-mute">
                هر دو هفته یک ایمیل کوتاه: تخفیف‌های تازه، گجت‌های جدید و راهنمای خرید. بدون اسپم.
              </p>
            </div>
            <div className="rounded-3xl bg-ink p-5">
              <NewsletterForm />
              <p className="mt-3 text-[0.65rem] text-white/35">
                با عضویت، قوانین حریم خصوصی آرک را می‌پذیرید.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
