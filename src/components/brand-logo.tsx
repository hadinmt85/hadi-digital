type MarkProps = {
  className?: string;
};

/** نشانهٔ Hadi Store روی پس‌زمینهٔ تیره (نسخهٔ اصلی) */
export function ArcMark({ className = "" }: MarkProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <rect width="120" height="120" rx="32" fill="#0f0e13" />
      <g transform="rotate(-58 60 60)">
        <circle
          cx="60"
          cy="60"
          r="30"
          fill="none"
          stroke="#d9ff3f"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray="137 51.5"
        />
      </g>
      <circle cx="83" cy="33" r="6" fill="#ff6b4a" />
    </svg>
  );
}

/** نسخهٔ معکوس برای پس‌زمینهٔ تیره: کاشی لیمویی با حلقهٔ تیره */
export function ArcMarkInverse({ className = "" }: MarkProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <rect width="120" height="120" rx="32" fill="#d9ff3f" />
      <g transform="rotate(-58 60 60)">
        <circle
          cx="60"
          cy="60"
          r="30"
          fill="none"
          stroke="#0f0e13"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray="137 51.5"
        />
      </g>
      <circle cx="83" cy="33" r="6" fill="#ff6b4a" />
    </svg>
  );
}
