/** نگاشت نام برندها به اسلاگ پایدار برای مسیر /brands/[slug] */
export const BRAND_SLUGS: Record<string, string> = {
  Sony: "sony",
  Xiaomi: "xiaomi",
  JBL: "jbl",
  ProDrive: "prodrive",
  Logitech: "logitech",
  AOC: "aoc",
  Samsung: "samsung",
  DJI: "dji",
  Mifa: "mifa",
  Lenovo: "lenovo",
  Soundcore: "soundcore",
  Anker: "anker",
  Apple: "apple",
  Amazon: "amazon",
  "TP-Link": "tp-link",
  Apacer: "apacer",
  Meta: "meta",
  BANGE: "bange",
  MSI: "msi",
  Onikuma: "onikuma",
  Hikvision: "hikvision",
  eufy: "eufy",
  WD: "wd",
  Redragon: "redragon",
  متفرقه: "generic",
};

const SLUG_TO_BRAND = new Map(Object.entries(BRAND_SLUGS).map(([name, slug]) => [slug, name]));

export function brandToSlug(name: string): string {
  return BRAND_SLUGS[name] ?? encodeURIComponent(name.trim().toLowerCase());
}

export function brandFromSlug(slug: string): string | null {
  return SLUG_TO_BRAND.get(decodeURIComponent(slug)) ?? null;
}
