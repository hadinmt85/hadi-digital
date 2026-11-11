import Image from "next/image";

type MarkProps = {
  className?: string;
};

const LOGO = "/brand/hadi-store-mark.png";

/** نشانهٔ Hadi Store (نسخهٔ اصلی روی پس‌زمینهٔ روشن) */
export function ArcMark({ className = "" }: MarkProps) {
  return (
    <Image
      src={LOGO}
      alt=""
      width={128}
      height={128}
      priority
      className={`shrink-0 object-contain ${className}`}
    />
  );
}

/** نسخهٔ نشانه برای پس‌زمینهٔ تیره (با حلقهٔ محیطی برای جداشدن از زمینه) */
export function ArcMarkInverse({ className = "" }: MarkProps) {
  return (
    <Image
      src={LOGO}
      alt=""
      width={128}
      height={128}
      priority
      className={`shrink-0 object-contain ring-1 ring-white/25 ${className}`}
    />
  );
}
