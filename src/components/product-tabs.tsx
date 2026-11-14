"use client";

import { useEffect, useState, type ReactNode } from "react";

const TABS = [
  { key: "intro", label: "معرفی" },
  { key: "specs", label: "مشخصات" },
  { key: "reviews", label: "دیدگاه‌ها" },
  { key: "questions", label: "پرسش‌ها" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function ProductTabs({
  intro,
  specs,
  reviews,
  questions,
}: Record<TabKey, ReactNode>) {
  const [active, setActive] = useState<TabKey>("intro");
  const content = { intro, specs, reviews, questions };

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "");
      const match = TABS.find((tab) => tab.key === hash);
      if (!match) return;
      setActive(match.key);
      requestAnimationFrame(() => {
        document.getElementById("product-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  return (
    <section
      id="product-content"
      className="mt-3.5 scroll-mt-28 overflow-hidden rounded-[10px] border border-line bg-paper"
    >
      <div
        className="flex h-[50px] items-center gap-5 overflow-x-auto border-b border-line/70 px-4 sm:h-[52px] sm:gap-7 sm:px-5"
        role="tablist"
        aria-label="محتوای محصول"
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active === tab.key}
            aria-controls="product-tab-panel"
            onClick={() => {
              setActive(tab.key);
              window.history.replaceState(null, "", `#${tab.key}`);
            }}
            className={`relative flex h-full shrink-0 items-center text-[10.5px] font-bold transition-colors sm:text-[11px] ${
              active === tab.key ? "text-coral" : "text-mute hover:text-ink"
            }`}
          >
            {tab.label}
            {active === tab.key ? (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-coral" aria-hidden />
            ) : null}
          </button>
        ))}
      </div>
      <div id="product-tab-panel" role="tabpanel" className="p-4 sm:p-5">
        {content[active]}
      </div>
    </section>
  );
}
