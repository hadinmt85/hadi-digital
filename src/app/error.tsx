"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-x py-20">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-6xl" aria-hidden>
          🛠️
        </p>
        <h1 className="mt-4 text-2xl font-black">یک خطای غیرمنتظره رخ داد</h1>
        <p className="mt-3 text-sm leading-7 text-mute">
          نگران نباش، سبد خریدت سالم است. یک بار دیگر تلاش کن؛ اگر مشکل ادامه داشت با پشتیبانی تماس
          بگیر.
        </p>
        <button type="button" onClick={reset} className="btn btn-primary mt-7">
          تلاش دوباره
        </button>
      </div>
    </div>
  );
}
