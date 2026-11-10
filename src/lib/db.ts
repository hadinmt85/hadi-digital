import { Pool } from "pg";
import type { QueryFn } from "@/lib/db-types";
import { seedCatalog } from "@/lib/seed";

type Driver = {
  query: QueryFn;
  transaction: <T>(fn: (q: QueryFn) => Promise<T>) => Promise<T>;
};

const globalForDb = globalThis as unknown as { __gadgetlandDb?: Promise<Driver> };

function databaseUrl(): string | undefined {
  return process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? undefined;
}

function isLocalHost(url: string): boolean {
  return /localhost|127\.0\.0\.1|::1/.test(url);
}

async function createPgDriver(connectionString: string): Promise<Driver> {
  const pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    ssl: isLocalHost(connectionString) ? undefined : { rejectUnauthorized: false },
  });

  const query: QueryFn = async <T>(sql: string, params: unknown[] = []) => {
    const result = await pool.query(sql, params as unknown[]);
    return result.rows as T[];
  };

  const transaction = async <T>(fn: (q: QueryFn) => Promise<T>): Promise<T> => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const scoped: QueryFn = async <R>(sql: string, params: unknown[] = []) => {
        const result = await client.query(sql, params as unknown[]);
        return result.rows as R[];
      };
      const value = await fn(scoped);
      await client.query("COMMIT");
      return value;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  };

  return { query, transaction };
}

/**
 * برای توسعهٔ محلی و بیلد بدون نیاز به نصب Postgres، از PGlite (Postgres در WASM)
 * استفاده می‌شود و کاتالوگ نمونه در اولین کوئری ساخته می‌شود.
 * در تولید (Vercel/Neon) متغیر DATABASE_URL تنظیم می‌شود و درایور pg فعال است.
 */
async function createPgliteDriver(): Promise<Driver> {
  const { PGlite } = await import("@electric-sql/pglite");
  const database = new PGlite(process.env.PGLITE_DATA_DIR ?? "memory://");

  const query: QueryFn = async <T>(sql: string, params: unknown[] = []) => {
    const result = await database.query(sql, params as never[]);
    return result.rows as T[];
  };

  await seedCatalog(query);

  const transaction = async <T>(fn: (q: QueryFn) => Promise<T>): Promise<T> =>
    database.transaction(async (tx) => {
      const scoped: QueryFn = async <R>(sql: string, params: unknown[] = []) => {
        const result = await tx.query(sql, params as never[]);
        return result.rows as R[];
      };
      return fn(scoped);
    });

  return { query, transaction };
}

export function getDriver(): Promise<Driver> {
  if (!globalForDb.__gadgetlandDb) {
    globalForDb.__gadgetlandDb = (async () => {
      const url = databaseUrl();
      return url ? createPgDriver(url) : createPgliteDriver();
    })();
  }
  return globalForDb.__gadgetlandDb;
}

export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[],
): Promise<T[]> {
  const driver = await getDriver();
  return driver.query<T>(sql, params);
}

export async function withTransaction<T>(fn: (q: QueryFn) => Promise<T>): Promise<T> {
  const driver = await getDriver();
  return driver.transaction(fn);
}

export function usingPostgres(): boolean {
  return Boolean(databaseUrl());
}
