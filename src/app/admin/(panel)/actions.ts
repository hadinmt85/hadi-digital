"use server";

import { cookies } from "next/headers";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isAdmin } from "@/lib/admin-auth";
import { createProduct, updateOrderStatus } from "@/lib/data";
import { toEnDigits } from "@/lib/format";

export type ProductFormState = { error?: string; ok?: boolean };

const orderStatuses = ["در حال پردازش", "ارسال شده", "تحویل شده", "لغو شده"];

async function requireAdmin(): Promise<void> {
  const store = await cookies();
  if (!isAdmin(store.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin/login");
  }
}

const gradientPresets: [string, string][] = [
  ["#7A5AF8", "#2E1065"],
  ["#FF6B4A", "#B91C1C"],
  ["#22D3EE", "#0E7490"],
  ["#D8FF3E", "#65A30D"],
  ["#F472B6", "#BE185D"],
  ["#38BDF8", "#1D4ED8"],
];

export async function createProductAction(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const categorySlug = String(formData.get("categorySlug") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "").trim() || "📦";
  const imageRaw = String(formData.get("image") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const specsRaw = String(formData.get("specs") ?? "").trim();
  const presetIndex = Number(formData.get("gradient") ?? "0");
  const price = Number(toEnDigits(String(formData.get("price") ?? "")).replace(/\D/g, ""));
  const oldPriceRaw = toEnDigits(String(formData.get("oldPrice") ?? "")).replace(/\D/g, "");
  const stock = Number(toEnDigits(String(formData.get("stock") ?? "")).replace(/\D/g, ""));

  if (name.length < 3) return { error: "نام محصول را کامل وارد کنید." };
  if (!brand) return { error: "نام برند را وارد کنید." };
  if (!categorySlug) return { error: "دسته‌بندی را انتخاب کنید." };
  if (!Number.isFinite(price) || price <= 0) return { error: "قیمت معتبر وارد کنید." };
  if (!Number.isFinite(stock) || stock < 0) return { error: "موجودی معتبر وارد کنید." };
  if (!tagline) return { error: "یک شعار کوتاه برای محصول بنویسید." };
  if (description.length < 20) return { error: "توضیحات محصول حداقل ۲۰ کاراکتر باشد." };

  let image: string | null = null;
  if (imageRaw) {
    if (!/^(\/|https?:\/\/)/.test(imageRaw)) {
      return { error: "آدرس تصویر باید با / یا http شروع شود." };
    }
    image = imageRaw;
  }

  const preset = gradientPresets[presetIndex] ?? gradientPresets[0];
  const specs = specsRaw
    .split(/[\n،,]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);

  await createProduct({
    name,
    brand,
    categorySlug,
    emoji,
    image,
    gradientFrom: preset[0],
    gradientTo: preset[1],
    price,
    oldPrice: oldPriceRaw ? Number(oldPriceRaw) : null,
    stock,
    tagline,
    description,
    specs,
  });

  updateTag("products");

  redirect("/admin");
}

export async function updateStatusAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");

  if (Number.isInteger(id) && orderStatuses.includes(status)) {
    await updateOrderStatus(id, status);
    revalidatePath("/admin");
  }
}
