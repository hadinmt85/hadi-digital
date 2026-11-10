import type { ReactNode } from "react";

const icons: Record<string, ReactNode> = {
  audio: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="2.5" y="13" width="4" height="7" rx="2" />
      <rect x="17.5" y="13" width="4" height="7" rx="2" />
    </>
  ),
  wearables: (
    <>
      <rect x="7" y="6" width="10" height="12" rx="3" />
      <path d="M9 6V3h6v3M9 18v3h6v-3M12 10v2.5l1.5 1" />
    </>
  ),
  mobile: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 5h2M11 18.5h2" />
    </>
  ),
  tablets: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M12 17.5h.01" />
    </>
  ),
  computer: (
    <>
      <rect x="4" y="5" width="16" height="10" rx="1.5" />
      <path d="M2 18h20l-2-3H4z" />
    </>
  ),
  gaming: (
    <>
      <path d="M7 8h10a4 4 0 0 1 4 4v3a2 2 0 0 1-3.5 1.4L15 14H9l-2.5 2.4A2 2 0 0 1 3 15v-3a4 4 0 0 1 4-4z" />
      <path d="M8 11v3M6.5 12.5h3M16 11.5h.01M18 12.5h.01" />
    </>
  ),
  camera: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <circle cx="12" cy="13.5" r="3.5" />
      <path d="M8 7l1.5-3h5L16 7" />
    </>
  ),
  power: (
    <>
      <rect x="4" y="6" width="12" height="12" rx="2" />
      <path d="M16 10h3v4h-3" />
      <path d="m10 9-2 4h2l-1 3 3-4h-2z" />
    </>
  ),
  "smart-home": (
    <>
      <path d="M3 11 12 3l9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  fitness: (
    <>
      <path d="M20 8c0 5-8 12-8 12S4 13 4 8a4 4 0 0 1 8 0 4 4 0 0 1 8 0z" />
      <path d="M7 11h3l1-2 2 4 1-2h3" />
    </>
  ),
  network: (
    <>
      <path d="M2.5 8.5a14 14 0 0 1 19 0" />
      <path d="M5.5 12a9.5 9.5 0 0 1 13 0" />
      <path d="M8.5 15.5a5 5 0 0 1 7 0" />
      <path d="M12 19h.01" />
    </>
  ),
  accessories: (
    <>
      <path d="M9 7V4M15 7V4" />
      <rect x="6" y="7" width="12" height="9" rx="2.5" />
      <path d="M12 16v4M9 20h6" />
    </>
  ),
};

export function CategoryIcon({
  slug,
  className = "size-6",
}: {
  slug: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icons[slug] ?? icons.tablets}
    </svg>
  );
}
