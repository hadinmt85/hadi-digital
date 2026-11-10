import { createHash } from "node:crypto";

export const ADMIN_COOKIE = "gl_admin";

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "admin123";
}

export function adminToken(): string {
  return createHash("sha256").update(adminPassword()).digest("hex");
}

export function isAdmin(token: string | undefined): boolean {
  return typeof token === "string" && token.length > 0 && token === adminToken();
}
