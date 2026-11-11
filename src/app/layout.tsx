import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { Suspense, type ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteHeaderFallback } from "@/components/site-header-fallback";
import { getCurrentUser } from "@/lib/session";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

const siteDescription =
  "خرید آنلاین هدفون، ساعت هوشمند، موبایل، لپ‌تاپ و گجت‌های گیمینگ با گارانتی اصالت، ارسال سریع و ۷ روز ضمانت بازگشت کالا.";

export const metadata: Metadata = {
  applicationName: "آرک",
  title: {
    default: "آرک | فروشگاه گجت و کالای دیجیتال",
    template: "%s | آرک",
  },
  description: siteDescription,
  keywords: ["آرک", "ARC", "گجت", "کالای دیجیتال", "فروشگاه اینترنتی", "هدفون", "ساعت هوشمند"],
  openGraph: {
    title: "آرک | فروشگاه گجت و کالای دیجیتال",
    description: siteDescription,
    siteName: "آرک",
    locale: "fa_IR",
    type: "website",
  },
};

async function SiteHeaderWithSession() {
  const user = await getCurrentUser();
  return <SiteHeader user={user ? { username: user.username } : null} />;
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" data-scroll-behavior="smooth" className={`${vazirmatn.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <Suspense fallback={<SiteHeaderFallback />}>
            <SiteHeaderWithSession />
          </Suspense>
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
