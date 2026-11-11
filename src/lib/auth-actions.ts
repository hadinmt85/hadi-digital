"use server";

import { redirect } from "next/navigation";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { createSession, destroySession } from "@/lib/session";
import { createUser, findUserByEmail, findUserByUsername } from "@/lib/users";

export type RegisterState = {
  error?: string;
  fieldErrors?: Partial<Record<"username" | "email" | "password" | "confirm", string>>;
  values?: { username?: string; email?: string };
};

export type LoginState = {
  error?: string;
  username?: string;
};

const usernamePattern = /^[A-Za-z0-9_\u0600-\u06FF]{3,20}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function registerAction(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const rawUsername = String(formData.get("username") ?? "").trim();
  const rawEmail = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const username = rawUsername.toLowerCase();
  const email = rawEmail.toLowerCase();
  const values = { username: rawUsername, email: rawEmail };
  const fieldErrors: RegisterState["fieldErrors"] = {};

  if (!username) {
    fieldErrors.username = "نام کاربری را وارد کنید.";
  } else if (!usernamePattern.test(username)) {
    fieldErrors.username = "نام کاربری باید ۳ تا ۲۰ کاراکتر و فقط شامل حروف، عدد و _ باشد.";
  }

  if (!email) {
    fieldErrors.email = "ایمیل را وارد کنید.";
  } else if (!emailPattern.test(email)) {
    fieldErrors.email = "ایمیل معتبر نیست.";
  }

  if (password.length < 8) {
    fieldErrors.password = "رمز عبور باید حداقل ۸ کاراکتر باشد.";
  } else if (password.length > 72) {
    fieldErrors.password = "رمز عبور بیش از حد بلند است.";
  }

  if (confirm !== password) {
    fieldErrors.confirm = "تکرار رمز عبور با رمز واردشده یکسان نیست.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values };
  }

  if (await findUserByUsername(username)) {
    return { fieldErrors: { username: "این نام کاربری قبلاً ثبت شده است." }, values };
  }

  if (await findUserByEmail(email)) {
    return { fieldErrors: { email: "این ایمیل قبلاً ثبت شده است." }, values };
  }

  let userId: number;
  try {
    const passwordHash = await hashPassword(password);
    userId = await createUser({ username, email, passwordHash });
  } catch {
    return { error: "ثبت‌نام انجام نشد. ممکن است نام کاربری یا ایمیل تکراری باشد.", values };
  }

  await createSession(userId);
  redirect("/account");
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const rawUsername = String(formData.get("username") ?? "").trim();
  const username = rawUsername.toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "نام کاربری و رمز عبور را وارد کنید.", username: rawUsername };
  }

  const user = await findUserByUsername(username);

  if (!user) {
    return { error: "نام کاربری یا رمز عبور اشتباه است.", username: rawUsername };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "نام کاربری یا رمز عبور اشتباه است.", username: rawUsername };
  }

  await createSession(user.id);
  redirect("/account");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}
