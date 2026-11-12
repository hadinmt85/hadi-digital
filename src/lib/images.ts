import type { Product } from "@/lib/types";

/**
 * گالری محصول از روی تصویر اصلی و دو نمای برش‌خورده ساخته می‌شود.
 * فایل‌های نمای دوم و سوم در public/products/gallery تولید شده‌اند.
 */
export function galleryFor(product: Pick<Product, "slug" | "image">): string[] {
  if (!product.image) return [];
  const base = product.image.replace(/\.[a-zA-Z0-9]+$/, "");
  return [
    product.image,
    `${base}-detail.jpg`.replace("/products/", "/products/gallery/"),
    `${base}-angle.jpg`.replace("/products/", "/products/gallery/"),
  ];
}
