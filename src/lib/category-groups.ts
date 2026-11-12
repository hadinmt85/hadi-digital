/** گروه‌بندی دسته‌بندی‌ها برای منوی دو سطحی */
export type CategoryGroup = {
  title: string;
  slugs: string[];
};

export const categoryGroups: CategoryGroup[] = [
  { title: "صدا و تصویر", slugs: ["audio", "camera"] },
  { title: "موبایل و تبلت", slugs: ["mobile", "tablets", "wearables"] },
  { title: "کامپیوتر و گیمینگ", slugs: ["computer", "gaming"] },
  { title: "انرژی و شارژ", slugs: ["power"] },
  { title: "خانه هوشمند", slugs: ["smart-home", "network"] },
  { title: "سلامت و تناسب", slugs: ["fitness"] },
  { title: "لوازم جانبی", slugs: ["accessories"] },
];
