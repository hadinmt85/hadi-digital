"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { StarIcon } from "@/components/icons";

export function ReviewForm({ productId }: { productId: number }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (name.trim().length < 2) {
      setError("نامت را وارد کن (حداقل ۲ کاراکتر).");
      return;
    }
    if (body.trim().length < 10) {
      setError("نظرت را کمی کامل‌تر بنویس (حداقل ۱۰ کاراکتر).");
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, name: name.trim(), rating, body: body.trim() }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error ?? "ثبت نظر انجام نشد.");
        return;
      }
      setSuccess(true);
      setBody("");
      setRating(5);
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-xl border border-line bg-[#f7f7f8] p-4">
      <h3 className="text-sm font-black">نظر خودت را بنویس</h3>
      <p className="mt-1 text-[10.5px] leading-6 text-mute">
        تجربه‌ات از این محصول می‌تواند به انتخاب دیگران کمک کند.
      </p>

      <form onSubmit={submit} className="mt-4 space-y-3">
        <div>
          <span className="mb-1.5 block text-[11px] font-bold text-ink-soft">امتیاز تو</span>
          <div className="flex items-center gap-1" role="group" aria-label="امتیاز محصول">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                aria-label={`${value} ستاره`}
                aria-pressed={rating === value}
                className="rounded-md p-1 transition hover:bg-white"
              >
                <StarIcon
                  className={`size-6 transition ${
                    value <= rating ? "text-gold" : "text-[#d8d8dc]"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="review-name" className="mb-1.5 block text-[11px] font-bold text-ink-soft">
            نام
          </label>
          <input
            id="review-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="مثلا سارا محمدی"
            maxLength={40}
            className="field h-10 text-xs"
            required
          />
        </div>

        <div>
          <label htmlFor="review-body" className="mb-1.5 block text-[11px] font-bold text-ink-soft">
            نظر
          </label>
          <textarea
            id="review-body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="کیفیت ساخت، عملکرد و تجربهٔ استفاده‌ات را بنویس…"
            rows={4}
            maxLength={600}
            className="field resize-none text-xs leading-6"
            required
          />
        </div>

        {error ? (
          <p role="alert" className="rounded-lg bg-[#fff0f3] px-3 py-2 text-[10.5px] font-bold text-coral">
            {error}
          </p>
        ) : null}
        {success ? (
          <p role="status" className="rounded-lg bg-[#eaf7f0] px-3 py-2 text-[10.5px] font-bold text-green">
            نظرت ثبت شد؛ ممنون از وقتی که گذاشتی.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary h-10 w-full text-[11px] disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "در حال ثبت..." : "ثبت نظر"}
        </button>
      </form>
    </div>
  );
}
