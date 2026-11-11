export type NavCategory = {
  slug: string;
  name: string;
};

/** فهرست سبک دسته‌بندی‌ها برای ناوبری (بدون وابستگی به دیتابیس). */
export const navCategories: NavCategory[] = [
  { slug: "audio", name: "هدفون و صدا" },
  { slug: "wearables", name: "ساعت هوشمند" },
  { slug: "mobile", name: "گوشی موبایل" },
  { slug: "tablets", name: "تبلت و کتاب‌خوان" },
  { slug: "computer", name: "لپ‌تاپ و مانیتور" },
  { slug: "gaming", name: "گیمینگ" },
  { slug: "camera", name: "دوربین و پهپاد" },
  { slug: "power", name: "شارژ و پاوربانک" },
  { slug: "smart-home", name: "خانه هوشمند" },
  { slug: "fitness", name: "سلامت و تناسب" },
  { slug: "network", name: "شبکه و ذخیره‌سازی" },
  { slug: "accessories", name: "لوازم جانبی" },
];
