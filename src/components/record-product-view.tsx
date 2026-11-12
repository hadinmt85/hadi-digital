"use client";

import { useEffect } from "react";
import { pushRecent } from "@/lib/recent-storage";

export function RecordProductView({ productId }: { productId: number }) {
  useEffect(() => {
    pushRecent(productId);
  }, [productId]);

  return null;
}
