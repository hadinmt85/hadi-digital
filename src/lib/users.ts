import { query } from "@/lib/db";

export type UserRecord = {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

type UserRow = {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: string | Date;
};

function mapUser(row: UserRow): UserRecord {
  return {
    id: Number(row.id),
    username: row.username,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : new Date(row.created_at).toISOString(),
  };
}

export async function findUserByUsername(username: string): Promise<UserRecord | null> {
  const rows = await query<UserRow>(
    "SELECT id, username, email, password_hash, created_at FROM users WHERE username = $1",
    [username],
  );
  return rows[0] ? mapUser(rows[0]) : null;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const rows = await query<UserRow>(
    "SELECT id, username, email, password_hash, created_at FROM users WHERE email = $1",
    [email],
  );
  return rows[0] ? mapUser(rows[0]) : null;
}

export async function createUser(input: {
  username: string;
  email: string;
  passwordHash: string;
}): Promise<number> {
  const rows = await query<{ id: number }>(
    "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
    [input.username, input.email, input.passwordHash],
  );
  return Number(rows[0].id);
}
