/** نگاشت نام برندها به اسلاگ پایدار برای مسیر /brands/[slug] */
export const BRAND_SLUGS: Record<string, string> = {
  "آیریس": "iris",
  "نیوا": "niva",
  "کوب": "kub",
  "هایپر": "hyper",
  "ولوسیتی": "velocity",
  "پیکسا": "pixa",
  "پرایم": "prime",
  "زنیت": "zenith",
  "رودی": "rudy",
  "ایرو": "aero",
  "لومن": "lumen",
  "اولترا": "ultra",
  "نانو": "nano",
  "گان": "gun",
  "سینما": "cinema",
  "پروکنترل": "procontrol",
  "نوا": "nova",
  "پیپر": "paper",
  "استایلوس": "stylus",
  "مگ‌سیف": "magsafe",
  "بادی": "body",
  "فیت": "fit",
  "نتل": "netl",
  "دیتا": "data",
  "وان": "one",
  "ویژن": "vision",
  "کوئست": "quest",
  "گجت‌شیپ": "gadgetship",
};

const SLUG_TO_BRAND = new Map(Object.entries(BRAND_SLUGS).map(([name, slug]) => [slug, name]));

export function brandToSlug(name: string): string {
  return BRAND_SLUGS[name] ?? encodeURIComponent(name.trim().toLowerCase());
}

export function brandFromSlug(slug: string): string | null {
  return SLUG_TO_BRAND.get(decodeURIComponent(slug)) ?? null;
}
