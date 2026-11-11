import { categories, products } from "./catalog";
import type { QueryFn } from "./db-types";

export const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS categories (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    emoji TEXT NOT NULL,
    color TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category_slug TEXT NOT NULL REFERENCES categories(slug),
    emoji TEXT NOT NULL,
    image TEXT,
    gradient_from TEXT NOT NULL,
    gradient_to TEXT NOT NULL,
    price INTEGER NOT NULL,
    old_price INTEGER,
    rating REAL NOT NULL DEFAULT 4.5,
    review_count INTEGER NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    badge TEXT,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    specs JSONB NOT NULL DEFAULT '[]'::jsonb,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    code TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    postal_code TEXT NOT NULL DEFAULT '',
    note TEXT NOT NULL DEFAULT '',
    shipping INTEGER NOT NULL,
    subtotal INTEGER NOT NULL,
    total INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'در حال پردازش',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    emoji TEXT NOT NULL,
    price INTEGER NOT NULL,
    qty INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_slug);
  CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
`;

/**
 * اسکیمای Postgres را می‌سازد و در صورت خالی بودن، کاتالوگ نمونه را درج می‌کند.
 * با { reset: true } همه چیز پاک و از نو ساخته می‌شود.
 */
export async function seedCatalog(
  q: QueryFn,
  options: { reset?: boolean } = {},
): Promise<{ inserted: number; skipped: boolean }> {
  // هر دستور را جداگانه اجرا می‌کنیم تا با هر دو درایور (pg و PGlite) سازگار باشد.
  for (const statement of SCHEMA_SQL.split(";").map((part) => part.trim()).filter(Boolean)) {
    await q(statement);
  }

  if (options.reset) {
    await q("TRUNCATE TABLE order_items, orders, products, categories RESTART IDENTITY CASCADE");
  } else {
    const rows = await q<{ count: number }>("SELECT count(*)::int AS count FROM products");
    const count = Number(rows[0]?.count ?? 0);
    if (count > 0) return { inserted: 0, skipped: true };
  }

  for (const category of categories) {
    await q(
      `INSERT INTO categories (slug, name, emoji, color, sort_order)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name, emoji = EXCLUDED.emoji,
         color = EXCLUDED.color, sort_order = EXCLUDED.sort_order`,
      [category.slug, category.name, category.emoji, category.color, category.sort],
    );
  }

  for (const product of products) {
    const createdAt = new Date(Date.now() - product.daysAgo * 24 * 60 * 60 * 1000).toISOString();
    await q(
      `INSERT INTO products
        (slug, name, brand, category_slug, emoji, image, gradient_from, gradient_to, price, old_price,
         rating, review_count, stock, badge, tagline, description, specs, featured, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17::jsonb, $18, $19::timestamptz)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name, brand = EXCLUDED.brand, category_slug = EXCLUDED.category_slug,
         emoji = EXCLUDED.emoji, image = EXCLUDED.image, price = EXCLUDED.price,
         old_price = EXCLUDED.old_price, stock = EXCLUDED.stock, badge = EXCLUDED.badge,
         tagline = EXCLUDED.tagline, description = EXCLUDED.description,
         specs = EXCLUDED.specs, featured = EXCLUDED.featured`,
      [
        product.slug,
        product.name,
        product.brand,
        product.category,
        product.emoji,
        product.image,
        product.from,
        product.to,
        product.price,
        product.oldPrice,
        product.rating,
        product.reviews,
        product.stock,
        product.badge,
        product.tagline,
        product.description,
        JSON.stringify(product.specs),
        product.featured,
        createdAt,
      ],
    );
  }

  return { inserted: products.length, skipped: false };
}
