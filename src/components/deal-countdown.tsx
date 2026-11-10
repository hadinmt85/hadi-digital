"use client";

import { useEffect, useState } from "react";
import { toFaDigits } from "@/lib/format";

/** شمارش معکوس تا پایان روز؛ رندر اولیه ثابت است تا هیدریشن ناسازگار نشود. */
export function DealCountdown() {
  const [parts, setParts] = useState(["۰۲", "۱۴", "۳۶"]);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const diff = Math.max(0, end.getTime() - now.getTime());
      const hours = Math.floor(diff / 3_600_000);
      const minutes = Math.floor(diff / 60_000) % 60;
      const seconds = Math.floor(diff / 1_000) % 60;
      setParts(
        [hours, minutes, seconds].map((value) =>
          toFaDigits(String(value).padStart(2, "0")),
        ),
      );
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-1" dir="ltr" aria-label="زمان باقی‌مانده">
      {parts.map((part, index) => (
        <span
          key={`${part}-${index}`}
          className="min-w-[26px] rounded-[5px] bg-white/20 px-1.5 py-1 text-center text-[12px] font-extrabold tabular-nums text-white"
        >
          {part}
        </span>
      ))}
    </div>
  );
}
