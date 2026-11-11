import Link from "next/link";
import { CardIcon, CheckIcon, PhoneIcon, ReturnIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import { faNumber } from "@/lib/format";

export const metadata = {
  title: "درباره ما و پشتیبانی",
  description:
    "داستان آرک، شرایط گارانتی و بازگشت کالا، سؤالات متداول و راه‌های ارتباط با پشتیبانی.",
};

const statItems = [
  { value: "۱۳۹۸", label: "سال شروع" },
  { value: "۱۲٬۴۰۰+", label: "سفارش تحویل‌شده" },
  { value: "۹۸٪", label: "رضایت مشتری" },
  { value: "۱۸ ماه", label: "گارانتی رسمی" },
];

const values = [
  {
    icon: ShieldIcon,
    title: "اصالت، بدون استثنا",
    text: "هر کالا با سریال و گارانتی رسمی عرضه می‌شود. اگر مغایرتی پیدا کردی، کل مبلغ برمی‌گردد.",
  },
  {
    icon: TruckIcon,
    title: "ارسال واقعاً سریع",
    text: "سفارش‌های قبل از ساعت ۱۴ همان روز بسته‌بندی و تحویل پیک می‌شوند.",
  },
  {
    icon: ReturnIcon,
    title: "بازگشت بدون دردسر",
    text: "تا ۷ روز پس از تحویل، اگر محصول را نپسندیدی، در بسته‌بندی سالم برگردان.",
  },
  {
    icon: CardIcon,
    title: "قیمت شفاف",
    text: "همه هزینه‌ها پیش از پرداخت مشخص است؛ بدون هزینه پنهان یا اضافه‌بهای غیرمنتظره.",
  },
];

const faqs = [
  {
    q: "سفارش من چه زمانی ارسال می‌شود؟",
    a: "سفارش‌های ثبت‌شده تا ساعت ۱۴ در همان روز کاری بسته‌بندی و تحویل پست یا پیک می‌شوند. تهران معمولاً ۲۴ ساعته و شهرستان‌ها ۲ تا ۴ روز کاری تحویل می‌گیرند.",
  },
  {
    q: "اگر محصول مشکل داشته باشد چه کنم؟",
    a: "تا ۷ روز پس از تحویل می‌توانی از طریق صفحه پیگیری سفارش یا شماره پشتیبانی درخواست بازگشت ثبت کنی. پس از بررسی، تعویض یا بازگشت وجه انجام می‌شود.",
  },
  {
    q: "گارانتی محصولات چگونه است؟",
    a: "همه کالاها حداقل ۱۸ ماه گارانتی رسمی دارند. کارت گارانتی همراه بسته ارسال می‌شود و مراکز خدمات مجاز در تهران و شهرهای بزرگ فعال هستند.",
  },
  {
    q: "پرداخت در محل دارید؟",
    a: "برای تهران و کرج بله. برای سایر شهرها پرداخت آنلاین از درگاه امن انجام می‌شود.",
  },
  {
    q: "امکان خرید اقساطی وجود دارد؟",
    a: "برای سفارش‌های بالای ۱۰ میلیون تومان، پرداخت در ۴ قسط با کارت‌های اعتباری همکار فراهم است.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="container-x relative grid gap-10 py-14 lg:grid-cols-[1.2fr_1fr] lg:py-20">
          <div>
            <p className="eyebrow">درباره آرک</p>
            <h1 className="mt-5 text-[clamp(2rem,4.5vw,3.4rem)] font-black leading-tight">
              تکنولوژی را ساده، اصل و
              <span className="relative mx-1 inline-block px-2">
                <span className="absolute inset-x-0 bottom-1 h-[55%] -rotate-1 rounded-xl bg-lime" aria-hidden />
                <span className="relative">انسانی</span>
              </span>
              تحویل می‌دهیم
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-8 text-ink-soft/85">
              آرک در سال ۱۳۹۸ با یک ایده ساده شروع شد: خرید گجت نباید پیچیده باشد. امروز بیش از
              دوازده هزار سفارش را تحویل داده‌ایم و همچنان همان وسواس روز اول را روی انتخاب محصول،
              بسته‌بندی و پاسخ‌گویی داریم.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn btn-primary">
                دیدن محصولات
              </Link>
              <a href="#contact" className="btn btn-ghost">
                تماس با ما
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 self-center">
            {statItems.map((item, index) => (
              <div
                key={item.label}
                className={`rounded-3xl border border-line p-5 ${
                  index === 0 ? "bg-lime" : "bg-paper"
                }`}
              >
                <p className="text-2xl font-black text-ink">{item.value}</p>
                <p className="mt-1 text-[0.7rem] font-bold text-mute">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-14">
        <h2 className="text-2xl font-black sm:text-3xl">چرا آرک؟</h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div key={value.title} className="surface p-5">
              <span className="grid size-11 place-items-center rounded-2xl bg-violet/10 text-violet">
                <value.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-sm font-black">{value.title}</h3>
              <p className="mt-2 text-xs leading-6 text-mute">{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x grid gap-5 pb-14 lg:grid-cols-3">
        <article id="warranty" className="surface scroll-mt-32 p-6">
          <h2 className="text-lg font-black">گارانتی و خدمات پس از فروش</h2>
          <p className="mt-3 text-sm leading-7 text-ink-soft/80">
            تمام محصولات آرک با گارانتی رسمی حداقل ۱۸ ماهه ارائه می‌شوند. برای استفاده از
            گارانتی، کارت گارانتی و فاکتور خرید را نگه دارید. مراکز خدمات مجاز در تهران، مشهد،
            اصفهان و شیراز فعال هستند و درخواست‌ها حداکثر تا ۷۲ ساعت بررسی می‌شوند.
          </p>
          <ul className="mt-4 space-y-2 text-xs font-bold text-ink-soft">
            {["پوشش نقص فنی کارخانه", "تعویض در ۷ روز اول", "پیگیری آنلاین درخواست"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckIcon className="size-4 text-violet" />
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article id="returns" className="surface scroll-mt-32 p-6">
          <h2 className="text-lg font-black">شرایط بازگشت کالا</h2>
          <p className="mt-3 text-sm leading-7 text-ink-soft/80">
            تا ۷ روز پس از تحویل، اگر کالا در بسته‌بندی اولیه و بدون آسیب باشد، می‌توانید درخواست
            بازگشت ثبت کنید. هزینه ارسال بازگشت در صورت ایراد کالا با آرک است.
          </p>
          <p className="mt-3 text-sm leading-7 text-ink-soft/80">
            کالاهای شخصی مانند هندزفری درون‌گوشی، در صورت باز شدن بسته‌بندی، تنها در صورت نقص فنی
            قابل بازگشت هستند.
          </p>
        </article>

        <article id="privacy" className="surface scroll-mt-32 p-6">
          <h2 className="text-lg font-black">حریم خصوصی و قوانین</h2>
          <p className="mt-3 text-sm leading-7 text-ink-soft/80">
            اطلاعات شما فقط برای پردازش سفارش، ارسال و پشتیبانی استفاده می‌شود و در اختیار شخص ثالث
            قرار نمی‌گیرد. شماره تماس و نشانی پس از تحویل سفارش، طبق الزامات قانونی نگهداری می‌شود.
          </p>
          <p id="terms" className="mt-3 scroll-mt-32 text-sm leading-7 text-ink-soft/80">
            استفاده از سایت به معنی پذیرش قوانین فروشگاه است؛ قیمت‌ها و موجودی‌ها ممکن است بدون اطلاع
            قبلی تغییر کنند.
          </p>
        </article>
      </section>

      <section id="faq" className="container-x scroll-mt-28 pb-14">
        <h2 className="text-2xl font-black sm:text-3xl">سؤالات متداول</h2>
        <div className="mt-6 space-y-3">
          {faqs.map((faq, index) => (
            <details
              key={faq.q}
              className="group surface overflow-hidden p-0"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-extrabold">
                {faq.q}
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink/5 text-lg text-ink transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 text-sm leading-7 text-mute">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="contact" className="container-x scroll-mt-28 pb-6">
        <div className="grid gap-4 rounded-xl border border-line bg-paper p-7 sm:p-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-xs font-black tracking-widest text-coral">پشتیبانی</p>
            <h2 className="mt-3 text-2xl font-black sm:text-3xl">هر روز، ۹ صبح تا ۹ شب</h2>
            <p className="mt-3 max-w-md text-xs leading-7 text-mute">
              تلفن، ایمیل یا پیام مستقیم؛ تیم ما درباره انتخاب محصول، وضعیت سفارش و گارانتی پاسخ
              می‌دهد. میانگین زمان پاسخ‌گویی: کمتر از ۱۵ دقیقه.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="tel:+982177984561" className="btn btn-primary">
                <PhoneIcon className="size-4" />
                ۰۲۱-۷۷۹۸۴۵۶۱
              </a>
              <a href="mailto:hello@arc.shop" className="btn btn-ghost">
                hello@arc.shop
              </a>
            </div>
          </div>
          <div className="rounded-xl border border-line bg-[#f7f7f8] p-5 text-xs text-mute">
            <p className="font-extrabold text-ink">نشانی دفتر</p>
            <p className="mt-2 leading-7">
              تهران، خیابان ولیعصر، بالاتر از پارک ساعی، کوچه گجت، پلاک {faNumber(12)}، طبقه سوم
            </p>
            <p className="mt-4 font-extrabold text-ink">ساعت کاری</p>
            <p className="mt-2 leading-7">شنبه تا پنجشنبه ۹ تا ۲۱ — جمعه‌ها ۱۰ تا ۱۶</p>
          </div>
        </div>
      </section>
    </div>
  );
}
