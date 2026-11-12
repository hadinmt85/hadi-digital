"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeftIcon, CloseIcon, ZoomInIcon } from "@/components/icons";
import { faNumber } from "@/lib/format";

export function ProductGallery({
  images,
  name,
  discount = 0,
  badge,
}: {
  images: string[];
  name: string;
  discount?: number;
  badge?: string | null;
}) {
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [lightbox, setLightbox] = useState(false);

  const current = images[active] ?? images[0];

  useEffect(() => {
    if (!lightbox) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowLeft") setActive((value) => (value + 1) % images.length);
      if (event.key === "ArrowRight") setActive((value) => (value - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, images.length]);

  if (!current) return null;

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border border-line bg-white">
        <button
          type="button"
          onClick={() => setLightbox(true)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            setOrigin({
              x: ((event.clientX - rect.left) / rect.width) * 100,
              y: ((event.clientY - rect.top) / rect.height) * 100,
            });
          }}
          aria-label={`بزرگ‌نمایی تصویر ${name}`}
          className="relative block aspect-square w-full cursor-zoom-in overflow-hidden"
        >
          <Image
            src={current}
            alt={name}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover transition-transform duration-200 ease-out"
            style={{
              transform: hover ? "scale(1.85)" : "scale(1)",
              transformOrigin: `${origin.x}% ${origin.y}%`,
            }}
          />
        </button>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <span className="flex flex-col gap-1">
            {discount > 0 ? (
              <span className="rounded-full bg-coral px-2 py-0.5 text-[10px] font-black text-white">
                {faNumber(discount)}٪ تخفیف
              </span>
            ) : null}
            {badge ? (
              <span className="rounded-full bg-ink/80 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur">
                {badge}
              </span>
            ) : null}
          </span>
        </div>

        <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1.5 text-[10px] font-bold text-ink-soft shadow-sm backdrop-blur">
          <ZoomInIcon className="size-3.5" />
          زوم با حرکت ماوس
        </span>

        {images.length > 1 ? (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActive((value) => (value + 1) % images.length)}
              aria-label="تصویر بعدی"
              className="grid size-9 place-items-center rounded-full bg-white/90 text-ink shadow-md ring-1 ring-black/5 transition hover:bg-white"
            >
              <ArrowLeftIcon className="size-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => setActive((value) => (value - 1 + images.length) % images.length)}
              aria-label="تصویر قبلی"
              className="grid size-9 place-items-center rounded-full bg-white/90 text-ink shadow-md ring-1 ring-black/5 transition hover:bg-white"
            >
              <ArrowLeftIcon className="size-4" />
            </button>
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`تصویر ${faNumber(index + 1)}`}
              aria-pressed={index === active}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 bg-white transition ${
                index === active ? "border-coral" : "border-line hover:border-coral/40"
              }`}
            >
              <Image src={image} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      {lightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`تصویر بزرگ ${name}`}
          className="fixed inset-0 z-[80] flex flex-col bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(false)}
        >
          <div className="flex items-center justify-between text-white">
            <span className="text-xs font-bold">
              {faNumber(active + 1)} / {faNumber(images.length)}
            </span>
            <button
              type="button"
              onClick={() => setLightbox(false)}
              aria-label="بستن تصویر"
              className="grid size-10 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <CloseIcon className="size-5" />
            </button>
          </div>

          <div
            className="relative mx-auto mt-4 flex w-full max-w-4xl flex-1 items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-square w-full max-h-[78vh] max-w-[78vh]">
              <Image src={current} alt={name} fill sizes="90vw" className="object-contain" />
            </div>
            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => setActive((value) => (value + 1) % images.length)}
                  aria-label="تصویر بعدی"
                  className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-3"
                >
                  <ArrowLeftIcon className="size-5 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => setActive((value) => (value - 1 + images.length) % images.length)}
                  aria-label="تصویر قبلی"
                  className="absolute left-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-3"
                >
                  <ArrowLeftIcon className="size-5" />
                </button>
              </>
            ) : null}
          </div>

          <div className="mx-auto mt-4 flex max-w-4xl gap-2 overflow-x-auto" onClick={(event) => event.stopPropagation()}>
            {images.map((image, index) => (
              <button
                key={`lightbox-${image}`}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`تصویر ${faNumber(index + 1)}`}
                className={`relative size-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                  index === active ? "border-coral" : "border-white/20"
                }`}
              >
                <Image src={image} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
