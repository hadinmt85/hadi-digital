import Link from "next/link";
import { ArcMark } from "@/components/brand-logo";
import { InstagramIcon, PhoneIcon, TelegramIcon } from "@/components/icons";

const columns = [
  {
    title: "دسترسی سریع",
    links: [
      { label: "همه محصولات", href: "/products" },
      { label: "پیشنهاد شگفت‌انگیز", href: "/products?sort=cheap" },
      { label: "مورد علاقه‌ها", href: "/favorites" },
      { label: "مقایسهٔ محصولات", href: "/compare" },
      { label: "برندها", href: "/brands" },
      { label: "پرفروش‌ترین‌ها", href: "/products?sort=rating" },
      { label: "هدفون و صدا", href: "/products?category=audio" },
      { label: "گیمینگ", href: "/products?category=gaming" },
    ],
  },
  {
    title: "خدمات مشتریان",
    links: [
      { label: "حساب کاربری", href: "/account" },
      { label: "پیگیری سفارش", href: "/track" },
      { label: "شرایط بازگشت کالا", href: "/about#returns" },
      { label: "گارانتی و خدمات", href: "/about#warranty" },
      { label: "سؤالات متداول", href: "/about#faq" },
      { label: "تماس با ما", href: "/about#contact" },
    ],
  },
  {
    title: "Hadi Store",
    links: [
      { label: "درباره ما", href: "/about" },
      { label: "پنل مدیریت", href: "/admin" },
      { label: "حریم خصوصی", href: "/about#privacy" },
      { label: "قوانین و مقررات", href: "/about#terms" },
      { label: "همکاری با ما", href: "/about#contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-10 bg-ink text-white">
      <div className="container-x">
        <div className="grid gap-10 py-10 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <div className="flex items-center gap-2">
              <ArcMark className="size-10" />
              <div className="leading-tight">
                <p className="text-lg font-black">Hadi Store</p>
                <p className="text-[0.5rem] font-bold tracking-[0.18em] text-white/40">
                  HADI STORE
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-sm text-xs leading-6 text-white/60">
              Hadi Store یک فروشگاه تخصصی کالای دیجیتال است؛ جایی که تکنولوژی را ساده، اصل و با
              پشتیبانی انسانی تحویل می‌دهیم. از هدفون تا خانه هوشمند، همه‌چیز برای زندگی روزمره.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
              <a
                href="tel:+989929999999"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 font-bold transition hover:bg-white/10"
              >
                <PhoneIcon className="size-4 text-white/60" />
                <span dir="ltr">۰۹۹۲ ۹۹۹ ۹۹۹۹</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="اینستاگرام Hadi Store"
                className="grid size-9 place-items-center rounded-lg border border-white/15 transition hover:bg-white/10"
              >
                <InstagramIcon className="size-4" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                aria-label="تلگرام Hadi Store"
                className="grid size-9 place-items-center rounded-lg border border-white/15 transition hover:bg-white/10"
              >
                <TelegramIcon className="size-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-xs font-extrabold text-white">{column.title}</p>
                <ul className="mt-3 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[11px] text-white/60 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-white/10 py-4 text-[10px] text-white/40 sm:flex-row">
          <p>© ۲۰۲۶ Hadi Store — تمام حقوق محفوظ است.</p>
          <p>قیمت‌ها به تومان و شامل مالیات بر ارزش افزوده است.</p>
        </div>
      </div>
    </footer>
  );
}
