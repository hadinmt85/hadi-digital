"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * با هر تغییر مسیر، هدر را از وضعیت سشن هم‌گام می‌کند.
 * در Suspense قرار گرفته تا خواندن pathname مانع prerender نشود.
 */
export function AuthSync() {
  const pathname = usePathname();

  useEffect(() => {
    window.dispatchEvent(new Event("hadi-auth-sync"));
  }, [pathname]);

  return null;
}
