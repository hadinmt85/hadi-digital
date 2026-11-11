# آرک (ARC)

فروشگاه اینترنتی کالای دیجیتال با **Next.js 16 (App Router)**، طراحی فارسی راست‌چین و دیتابیس **Postgres**.

> 🚀 نسخهٔ آنلاین: **https://gadgetland-zeta.vercel.app**
> 📦 سورس‌کد: **https://github.com/hadinmt85/arc-store**
> 🔐 پنل مدیریت: `/admin` — رمز فعلی: `GadgetLand-1405!`

- **تولید:** Postgres (سازگار با Vercel Postgres / Neon) از طریق `DATABASE_URL`
- **توسعهٔ محلی:** [PGlite](https://pglite.dev) — همان Postgres، کامپایل‌شده به WASM؛ بدون نصب چیزی

## اجرا

```bash
npm install
npm run dev      # http://localhost:3000
```

در حالت توسعه، دیتابیس PGlite در حافظه ساخته می‌شود و کاتالوگ نمونه (۱۲ دسته و ۲۸ محصول)
به‌صورت خودکار در اولین کوئری درج می‌شود. نیازی به seed دستی نیست.

> در حالت PGlite داده‌ها با ری‌استارت سرور پاک می‌شوند (مناسب دمو). اگر می‌خواهی سفارش‌ها و
> تغییرات محلی بمانند، از Postgres محلی یا `PGLITE_DATA_DIR` استفاده کن:
> `PGLITE_DATA_DIR=./data/pglite npm run dev`

### Postgres محلی (اختیاری)

اگر Docker داری:

```bash
docker compose up -d
# در .env.local:
# DATABASE_URL=postgres://gadget:gadget@localhost:5432/gadgetland
npm run db:setup
```

## استقرار روی Vercel + Postgres

1. پروژه را در Vercel ایمپورت کن (یا `vercel`).
2. از **Storage → Neon** یک دیتابیس Postgres بساز (یا از [neon.tech](https://neon.tech) بگیر).
   رشتهٔ اتصال Pooled را بردار: `postgres://...-pooler.../neondb?sslmode=require`
3. اسکیمای دیتابیس را بساز و کاتالوگ را درج کن:

   ```bash
   # .env.local
   DATABASE_URL="postgres://...-pooler.../neondb?sslmode=require"

   npm run db:setup   # ساخت جدول‌ها + درج محصولات (در صورت خالی بودن)
   # یا برای ریست کامل:
   npm run db:seed
   ```

4. در **Vercel → Project Settings → Environment Variables** این‌ها را تنظیم کن
   (برای Production، Preview و Build):

   | متغیر | مقدار |
   | --- | --- |
   | `DATABASE_URL` | رشتهٔ اتصال Neon (Pooled) |
   | `ADMIN_PASSWORD` | یک رمز قوی برای `/admin` |

5. Deploy کن.

> صفحه‌های فروشگاه در بیلد پیش‌رندر می‌شوند، بنابراین `DATABASE_URL` باید هنگام Build هم در دسترس
> باشد (Vercel به‌صورت پیش‌فرض متغیرها را به Build می‌دهد).
> اسکیمای Postgres با `npm run db:setup` ساخته می‌شود؛ آن را قبل از اولین Deploy اجرا کن.

پس از اتصال پروژه، دیپلوی‌های بعدی با یک دستور انجام می‌شوند:

```bash
npm run deploy         # production
npm run deploy:preview # preview
```

> `vercel env pull` فایل `.env.local` را با `DATABASE_URL` پر می‌کند؛ در این حالت `npm run dev`
> به همان دیتابیس Neon وصل می‌شود. اگر می‌خواهی محلی روی PGlite بمانی، `DATABASE_URL` را از
> `.env.local` موقتاً بردار.

## امکانات

- **فروشگاه کامل:** صفحه اصلی، لیست محصولات با فیلتر دسته/جستجو/مرتب‌سازی، صفحه محصول، سبد خرید، تسویه حساب و صفحه تأیید سفارش
- **حساب کاربری:** ثبت‌نام با نام کاربری، ایمیل، رمز و تکرار رمز؛ ورود با نام کاربری و رمز؛ سشن امن با کوکی HttpOnly و صفحهٔ حساب کاربری
- **۲۸ محصول در ۱۲ دسته‌بندی** با تصاویر واقعی (Unsplash و Wikimedia Commons — [منابع](public/products/CREDITS.md))
- **API واقعی (Route Handlers):** محصولات، دسته‌بندی‌ها و سفارش‌ها
- **ثبت سفارش امن:** قیمت‌ها فقط از سرور خوانده می‌شوند، موجودی و شماره موبایل اعتبارسنجی می‌شود و سفارش در یک تراکنش ثبت می‌شود
- **پنل مدیریت:** ورود با رمز، آمار فروش، جدول سفارش‌ها، تغییر وضعیت، جدول موجودی و افزودن محصول (با تصویر)
- **سبد خرید ماندگار:** ذخیره در `localStorage`
- **UI اختصاصی:** فونت وزیرمتن، تم رنگی بنفش/لیمویی/مرجانی، RTL کامل و ریسپانسیو

## ساختار

```
src/
  app/
    page.tsx                     صفحه اصلی
    products/                    لیست و جزئیات محصول
    cart/ checkout/ orders/      مسیر خرید
    admin/                       پنل مدیریت (login + panel)
    api/                         Route Handlers
  components/                    UI مشترک
  lib/
    db.ts                        درایور Postgres (pg) / PGlite + تراکنش
    data.ts                      کوئری‌ها (کش‌شده با use cache) و ثبت سفارش
    catalog.ts                   داده‌های کاتالوگ نمونه (۱۲ دسته، ۲۸ محصول)
    seed.ts                      اسکیمای Postgres و درج کاتالوگ
    format.ts                    قالب‌بندی قیمت/تاریخ و قوانین ارسال
scripts/
  seed.ts                        db:setup / db:seed
  build-product-images.mjs       ساخت تصاویر محصولات
assets/product-sources/          منابع تصاویر Wikimedia
public/products/                 تصاویر نهایی + CREDITS.md
```

## API

| متد | مسیر | توضیح |
| --- | --- | --- |
| GET | `/api/products?category=fitness&q=ساعت&sort=cheap&limit=10` | لیست محصولات |
| GET | `/api/products/[slug]` | جزئیات محصول |
| GET | `/api/categories` | دسته‌بندی‌ها + تعداد محصول |
| POST | `/api/orders` | ثبت سفارش |
| GET | `/api/orders/[code]` | جزئیات سفارش با کد عمومی (مثل `GL-123456`) |

نمونه:

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"سارا محمدی","phone":"09123456789","address":"تهران، خیابان ولیعصر، پلاک ۱۰","items":[{"productId":1,"qty":1}]}'
```

## پنل مدیریت

- نشانی: `/admin`
- رمز پیش‌فرض: `admin123` (متغیر `ADMIN_PASSWORD`)
- کوکی ورود هش‌شده و `httpOnly` است و مسیر `/admin` علاوه بر آن با `proxy.ts` محافظت می‌شود.

## حساب کاربری

| مسیر | توضیح |
| --- | --- |
| `/register` | نام کاربری، ایمیل، رمز عبور و تکرار رمز |
| `/login` | ورود با نام کاربری و رمز عبور |
| `/account` | پروفایل کاربر و خروج از حساب (محافظت‌شده) |

- رمزها با **scrypt** و نمک تصادفی هش می‌شوند (`src/lib/auth.ts`).
- سشن‌ها در جدول `sessions` ذخیره و با کوکی `arc_session` (HttpOnly، SameSite=Lax، ۳۰ روز) نگهداری می‌شوند.
- مسیر `/account` با `proxy.ts` برای کاربران بدون کوکی به `/login` هدایت می‌شود و اعتبار سشن در صفحه بررسی می‌شود.

## نکات فنی

- `cacheComponents` و `partialPrefetching` فعال‌اند. داده‌های فروشگاه با `use cache` و تگ
  `products` کش می‌شوند؛ بعد از ثبت سفارش یا افزودن محصول، `revalidateTag("products")`
  موجودی و لیست را به‌روز می‌کند.
- پنل مدیریت با `connection()` همیشه در زمان درخواست رندر می‌شود.
- `pg` و `@electric-sql/pglite` در `serverExternalPackages` هستند تا در باندل سرور قرار نگیرند.
- تصاویر با `next/image` و `sharp` بهینه می‌شوند.
- برای جایگزینی تصاویر، فایل‌ها را در `public/products/` بگذار یا آدرس تصویر را در فرم پنل
  مدیریت وارد کن. اگر محصول تصویر نداشته باشد، کارت گرادیانی با ایموجی نمایش داده می‌شود.
