import Link from "next/link";
import { ArcMarkInverse } from "@/components/brand-logo";
import {
  CardIcon,
  InstagramIcon,
  PhoneIcon,
  ReturnIcon,
  ShieldIcon,
  TelegramIcon,
  TruckIcon,
} from "@/components/icons";

const columns = [
  {
    title: "فروشگاه",
    links: [
      { label: "همه محصولات", href: "/products" },
      { label: "هدفون و صدا", href: "/products?category=audio" },
      { label: "ساعت هوشمند", href: "/products?category=wearables" },
      { label: "گیمینگ", href: "/products?category=gaming" },
      { label: "خانه هوشمند", href: "/products?category=smart-home" },
    ],
  },
  {
    title: "خدمات مشتریان",
    links: [
      { label: "پیگیری سفارش", href: "/cart" },
      { label: "شرایط بازگشت کالا", href: "/about#returns" },
      { label: "گارانتی و خدمات پس از فروش", href: "/about#warranty" },
      { label: "سؤالات متداول", href: "/about#faq" },
      { label: "تماس با ما", href: "/about#contact" },
    ],
  },
  {
    title: "آرک",
    links: [
      { label: "درباره ما", href: "/about" },
      { label: "پنل مدیریت", href: "/admin" },
      { label: "حریم خصوصی", href: "/about#privacy" },
      { label: "قوانین و مقررات", href: "/about#terms" },
      { label: "همکاری با ما", href: "/about#contact" },
    ],
  },
];

const trust = [
  { icon: TruckIcon, title: "ارسال سریع", text: "تهران ۲۴ ساعته" },
  { icon: ShieldIcon, title: "گارانتی اصالت", text: "۱۸ ماه ضمانت" },
  { icon: ReturnIcon, title: "بازگشت آسان", text: "تا ۷ روز" },
  { icon: CardIcon, title: "پرداخت امن", text: "درگاه معتبر" },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-ink text-white">
      <div className="container-x">
        <div className="grid gap-6 border-b border-white/10 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-lime">
                <item.icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-extrabold">{item.title}</p>
                <p className="text-xs text-white/55">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-12 py-14 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <ArcMarkInverse className="size-11 rounded-[0.9rem]" />
              <div className="leading-tight">
                <p className="text-xl font-black">آرک</p>
                <p className="text-[0.55rem] font-bold tracking-[0.28em] text-white/45">
                  ARC.SHOP
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
              آرک یک فروشگاه تخصصی کالای دیجیتال است؛ جایی که تکنولوژی را ساده، اصل و با
              پشتیبانی انسانی تحویل می‌دهیم. از هدفون تا خانه هوشمند، همه‌چیز برای زندگی روزمره.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
              <a
                href="tel:+982112345678"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-bold transition hover:bg-white/15"
              >
                <PhoneIcon className="size-4 text-lime" />
                ۰۲۱-۱۲۳۴۵۶۷۸
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="اینستاگرام آرک"
                className="grid size-10 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <InstagramIcon className="size-4" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                aria-label="تلگرام آرک"
                className="grid size-10 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <TelegramIcon className="size-4" />
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-extrabold text-lime">{column.title}</p>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/60 transition-colors hover:text-white"
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

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-white/45 sm:flex-row">
          <p>© ۲۰۲۶ آرک — ساخته‌شده با Next.js و ❤️ در تهران</p>
          <p>تمام قیمت‌ها به تومان و شامل مالیات بر ارزش افزوده است.</p>
        </div>
      </div>
    </footer>
  );
}
