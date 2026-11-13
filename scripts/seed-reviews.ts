import { Pool } from "pg";

function loadEnv(): void {
  for (const file of [".env.local", ".env"]) {
    try {
      process.loadEnvFile(file);
    } catch {
      // فایل وجود ندارد
    }
  }
}

type ProductRow = {
  id: number;
  name: string;
  rating: number;
  review_count: number;
};

const names = [
  "سارا محمدی",
  "علی رضایی",
  "مریم احمدی",
  "رضا کریمی",
  "نگار موسوی",
  "امیر حسینی",
  "الهام صادقی",
  "محمد قاسمی",
];

async function main(): Promise<void> {
  loadEnv();
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!url) {
    console.log("DATABASE_URL تنظیم نشده است.");
    return;
  }

  const pool = new Pool({
    connectionString: url,
    ssl: /localhost|127\.0\.0\.1|::1/.test(url) ? undefined : { rejectUnauthorized: false },
  });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        body TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
    `);

    const products = (
      await pool.query<ProductRow>(
        "SELECT id, name, rating, review_count FROM products ORDER BY id",
      )
    ).rows;

    let inserted = 0;
    let skipped = 0;

    for (const [index, product] of products.entries()) {
      const existing = await pool.query<{ count: number }>(
        "SELECT count(*)::int AS count FROM reviews WHERE product_id = $1",
        [product.id],
      );
      if (Number(existing.rows[0]?.count ?? 0) > 0) {
        skipped += 1;
        continue;
      }

      const rounded = Math.min(5, Math.max(3, Math.round(product.rating)));
      const ratings = [5, rounded, Math.max(3, rounded - 1)];
      const bodies = [
        `کیفیت ساخت ${product.name} واقعاً خوبه؛ بعد از چند روز استفاده کاملاً راضی‌ام.`,
        "بسته‌بندی و ارسال سریع بود. محصول دقیقاً همون چیزی بود که توضیح داده شده بود.",
        "قیمت به نسبت کیفیت منصفانه‌ست؛ پشتیبانی هم سریع جواب داد.",
        "برای استفادهٔ روزمره عالیه؛ عملکردش پایدار بوده و مشکلی ندیدم.",
        "یک هفته‌ست استفاده می‌کنم؛ همون‌طور که انتظار داشتم بود و ارزش خرید داره.",
        "بعد از کلی مقایسه این مدل را انتخاب کردم و پشیمون نشدم.",
      ];

      for (let reviewIndex = 0; reviewIndex < 3; reviewIndex += 1) {
        const createdAt = new Date(
          Date.now() -
            ((index * 3 + reviewIndex + 1) * 86400000 + ((index * 7 + reviewIndex) % 20) * 3600000),
        ).toISOString();

        await pool.query(
          `INSERT INTO reviews (product_id, name, rating, body, created_at)
           VALUES ($1, $2, $3, $4, $5::timestamptz)`,
          [
            product.id,
            names[(index + reviewIndex) % names.length],
            ratings[reviewIndex],
            bodies[(index + reviewIndex) % bodies.length],
            createdAt,
          ],
        );
        inserted += 1;
      }
    }

    console.log(`✓ ${inserted} نظر نمونه ثبت شد. ${skipped} محصول از قبل نظر داشتند.`);
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error("✗ خطا در ثبت نظرات:", error);
  process.exitCode = 1;
});
