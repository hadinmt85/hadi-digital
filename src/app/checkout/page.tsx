import { CheckoutForm } from "@/components/checkout-form";

export const metadata = {
  title: "تسویه حساب",
  description: "اطلاعات ارسال را وارد کن و سفارش آرک را نهایی کن.",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
