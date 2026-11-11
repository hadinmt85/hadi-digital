import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { cache } from "react";
import { query } from "@/lib/db";

export const SESSION_COOKIE = "arc_session";
const AUTH_HINT_COOKIE = "hadi_authed";
const SESSION_DAYS = 30;

export type SessionUser = {
  id: number;
  username: string;
  email: string;
  createdAt: string;
};

type SessionRow = {
  id: number;
  username: string;
  email: string;
  created_at: string | Date;
};

/** کاربر فعلی را از سشن می‌خواند (در هر درخواست یک بار کش می‌شود). */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const rows = await query<SessionRow>(
    `SELECT u.id, u.username, u.email, u.created_at
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token = $1 AND s.expires_at > now()`,
    [token],
  );

  const row = rows[0];
  if (!row) return null;

  return {
    id: Number(row.id),
    username: row.username,
    email: row.email,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : new Date(row.created_at).toISOString(),
  };
});

/** سشن جدید می‌سازد و کوکی امن آن را تنظیم می‌کند. */
export async function createSession(userId: number): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await query("DELETE FROM sessions WHERE expires_at < now()");
  await query("INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3::timestamptz)", [
    token,
    userId,
    expires.toISOString(),
  ]);

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  // کوکی راهنما برای UI (افزودن به سبد)؛ داده حساسی ندارد.
  store.set(AUTH_HINT_COOKIE, "1", {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

/** سشن فعلی را حذف و کوکی را پاک می‌کند. */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (token) {
    await query("DELETE FROM sessions WHERE token = $1", [token]);
  }
  store.delete(SESSION_COOKIE);
  store.delete(AUTH_HINT_COOKIE);
}
