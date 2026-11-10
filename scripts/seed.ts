import { Pool } from "pg";
import { seedCatalog } from "../src/lib/seed";

function loadEnv(): void {
  for (const file of [".env.local", ".env"]) {
    try {
      process.loadEnvFile(file);
    } catch {
      // فایل وجود ندارد
    }
  }
}

async function main(): Promise<void> {
  loadEnv();

  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  const reset = process.argv.includes("--reset");

  if (!url) {
    console.log("ℹ️  DATABASE_URL تنظیم نشده است.");
    console.log("   برای توسعهٔ محلی نیازی به seed نیست؛ پروژه خودکار از PGlite");
    console.log("   (Postgres در WASM) استفاده می‌کند و کاتالوگ نمونه را می‌سازد.");
    console.log("   برای Postgres واقعی، DATABASE_URL را در .env.local قرار بده.");
    return;
  }

  const pool = new Pool({
    connectionString: url,
    ssl: /localhost|127\.0\.0\.1|::1/.test(url) ? undefined : { rejectUnauthorized: false },
  });

  const q = async <T = Record<string, unknown>>(sql: string, params: unknown[] = []) => {
    const result = await pool.query(sql, params);
    return result.rows as T[];
  };

  try {
    const result = await seedCatalog(q, { reset });
    const rows = await q<{ count: number }>("SELECT count(*)::int AS count FROM products");
    console.log(`✓ اسکیمای Postgres آماده است (${rows[0]?.count ?? 0} محصول).`);
    if (result.skipped) {
      console.log("  داده‌های موجود حفظ شدند. برای ریست کامل: npm run db:seed");
    }
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error("✗ خطا در آماده‌سازی دیتابیس:", error);
  process.exitCode = 1;
});
