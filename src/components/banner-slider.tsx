"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@/components/icons";

const slides = [
  { src: "/banners/fast-delivery.webp", alt: "ارسال زیر ۳ ساعت", href: "/products" },
  { src: "/banners/bange.webp", alt: "بنج", href: "/brands/bange" },
  { src: "/banners/watches.webp", alt: "ساعت مچی", href: "/products?category=wearables" },
  {
    src: "/banners/home-kitchen.webp",
    alt: "خانه و آشپزخانه",
    href: "/products?category=smart-home",
  },
  { src: "/banners/skincare.webp", alt: "مراقبت پوست", href: "/products?category=accessories" },
  {
    src: "/banners/personal-appliances.webp",
    alt: "لوازم شخصی برقی",
    href: "/products?category=accessories",
  },
  {
    src: "/banners/car-accessories.webp",
    alt: "لوازم جانبی خودرو",
    href: "/products?category=accessories",
  },
  { src: "/banners/speakers.webp", alt: "اسپیکر", href: "/products?category=audio" },
  { src: "/banners/gaming.webp", alt: "گیمینگ", href: "/products?category=gaming" },
  { src: "/banners/massagers.webp", alt: "ماساژور", href: "/products?category=fitness" },
];

export function BannerSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [paused, active]);

  const go = (index: number) => setActive((index + slides.length) % slides.length);

  return (
    <section
      className="relative overflow-hidden rounded-xl border border-line bg-paper"
      role="region"
      aria-roledescription="carousel"
      aria-label="پیشنهادهای Hadi Digital"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative aspect-[2/1] md:aspect-[1645/403]">
        {slides.map((slide, index) => (
          <Link
            key={slide.src}
            href={slide.href}
            aria-label={slide.alt}
            aria-hidden={index !== active}
            tabIndex={index === active ? 0 : -1}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === active ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="(min-width: 1280px) 1248px, 100vw"
              className="object-cover object-right md:object-center"
            />
          </Link>
        ))}

        <button
          type="button"
          onClick={() => go(active - 1)}
          aria-label="بنر قبلی"
          className="absolute start-3 top-1/2 z-20 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-md ring-1 ring-black/5 transition hover:bg-white sm:grid"
        >
          <ArrowLeftIcon className="size-4 rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => go(active + 1)}
          aria-label="بنر بعدی"
          className="absolute end-3 top-1/2 z-20 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-md ring-1 ring-black/5 transition hover:bg-white sm:grid"
        >
          <ArrowLeftIcon className="size-4" />
        </button>

        <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center">
          <div className="flex items-center gap-1.5 rounded-full bg-black/25 px-2 py-1 backdrop-blur-sm">
            {slides.map((slide, index) => (
              <button
                key={`dot-${slide.src}`}
                type="button"
                onClick={() => go(index)}
                aria-label={`نمایش بنر ${index + 1}`}
                aria-current={index === active}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === active ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
