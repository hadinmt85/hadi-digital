const numberFormatter = new Intl.NumberFormat("fa-IR");

/** عدد را با ارقام فارسی و جداکننده هزارگان برمی‌گرداند. */
export function faNumber(value: number): string {
  return numberFormatter.format(value);
}

/** قیمت را به تومان خوانا تبدیل می‌کند. */
export function toman(value: number): string {
  return `${faNumber(value)} تومان`;
}

/** درصد تخفیف را محاسبه می‌کند. */
export function discountPercent(price: number, oldPrice: number | null): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/** تاریخ ISO را به تاریخ شمسی خوانا تبدیل می‌کند. */
export function faDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

/** ارقام فارسی/عربی را به انگلیسی تبدیل می‌کند (برای ورودی فرم). */
export function toEnDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

/** ارقام انگلیسی یک رشته را به فارسی تبدیل می‌کند (بدون جداکننده هزارگان). */
export function toFaDigits(value: string): string {
  return value.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

export const shippingRules = {
  freeThreshold: 2_000_000,
  fee: 49_000,
};

export function shippingFor(subtotal: number): number {
  return subtotal >= shippingRules.freeThreshold ? 0 : shippingRules.fee;
}
