"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { toCartLine } from "@/components/product-card";
import { useCompare } from "@/components/compare-provider";
import { ArrowLeftIcon, CloseIcon, CompareIcon, StarIcon } from "@/components/icons";
import { faNumber, shippingFor, toman } from "@/lib/format";
import type { Product } from "@/lib/types";

export function CompareView({ products }: { products: Product[] }) {
  const { items, ready, remove, clear } = useCompare();

  if (!ready) {
    return (
      <div className="mt-6 grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-72 animate-pulse rounded-xl border border-line bg-paper" />
        ))}
      </div>
    );
  }

  const selected = items
    .map((item) => products.find((product) => product.id === item.id))
    .filter((product): product is Product => Boolean(product));

  if (selected.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-line bg-paper px-6 py-16 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#fff0f3] text-coral">
          <CompareIcon className="size-8" />
        </span>
        <h2 className="mt-4 text-base font-black">لیست مقایسه خالی است</h2>
        <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-mute">
          از روی کارت هر محصول، دکمهٔ مقایسه را بزن تا حداکثر ۳ کالا را کنار هم ببینی و راحت‌تر
          انتخاب کنی.
        </p>
        <Link href="/products" className="btn btn-primary mt-5 h-10 px-5 text-xs">
          رفتن به فروشگاه
          <ArrowLeftIcon className="size-4" />
        </Link>
      </div>
    );
  }

  const rows: { label: string; render: (product: Product) => ReactNode }[] = [
    {
      label: "قیمت",
      render: (product) => (
        <span className="text-sm font-black">
          {toman(product.price)}
          {product.oldPrice ? (
            <span className="mt-0.5 block text-[9px] font-normal text-mute line-through">
              {toman(product.oldPrice)}
            </span>
          ) : null}
        </span>
      ),
    },
    {
      label: "امتیاز",
      render: (product) => (
        <span className="inline-flex items-center gap-1 text-xs font-bold">
          <StarIcon className="size-3.5 text-gold" />
          {faNumber(Number(product.rating.toFixed(1)))}
          <span className="text-[9px] font-normal text-mute">({faNumber(product.reviewCount)})</span>
        </span>
      ),
    },
    { label: "برند", render: (product) => <span className="text-xs font-bold">{product.brand}</span> },
    {
      label: "دسته‌بندی",
      render: (product) => <span className="text-xs text-ink-soft">{product.categoryName}</span>,
    },
    {
      label: "موجودی",
      render: (product) =>
        product.stock > 0 ? (
          <span className="text-xs font-bold text-emerald-700">موجود</span>
        ) : (
          <span className="text-xs font-bold text-coral">ناموجود</span>
        ),
    },
    {
      label: "ارسال",
      render: (product) => (
        <span className="text-xs text-ink-soft">
          {product.price >= 2_000_000 ? "رایگان" : toman(shippingFor(product.price))}
        </span>
      ),
    },
    {
      label: "مشخصات",
      render: (product) => (
        <div className="flex flex-wrap gap-1">
          {product.specs.map((spec) => (
            <span key={spec} className="rounded-md bg-[#f7f7f8] px-1.5 py-1 text-[9.5px] font-bold text-ink-soft">
              {spec}
            </span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="mt-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold text-mute">
          {faNumber(selected.length)} کالا در مقایسه (حداکثر ۳)
        </p>
        <button
          type="button"
          onClick={clear}
          className="text-[10.5px] font-bold text-mute transition hover:text-coral"
        >
          پاک کردن همه
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line bg-paper">
        <table className="w-full min-w-[720px] table-fixed text-right">
          <thead>
            <tr className="border-b border-line">
              <th className="w-24 p-3" />
              {selected.map((product) => (
                <th key={product.id} className="p-3 align-top text-center">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => remove(product.id)}
                      aria-label={`حذف ${product.name} از مقایسه`}
                      className="absolute -end-1 -top-1 z-10 grid size-6 place-items-center rounded-full bg-white text-mute shadow ring-1 ring-line transition hover:text-coral"
                    >
                      <CloseIcon className="size-3" />
                    </button>
                    <Link href={`/products/${product.slug}`} className="block">
                      <span className="relative mx-auto grid size-24 place-items-center overflow-hidden rounded-lg bg-[#f7f7f8]">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={96}
                            height={96}
                            className="size-24 object-cover"
                          />
                        ) : (
                          <span className="text-3xl">{product.emoji}</span>
                        )}
                      </span>
                      <span className="mt-2 line-clamp-2 block min-h-[34px] text-center text-[11px] font-bold leading-5 text-ink hover:text-coral">
                        {product.name}
                      </span>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-line last:border-0">
                <th className="w-24 bg-[#f7f7f8] p-3 text-[10px] font-bold text-mute">{row.label}</th>
                {selected.map((product) => (
                  <td key={product.id} className="p-3 align-middle">
                    {row.render(product)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th className="bg-[#f7f7f8] p-3" />
              {selected.map((product) => (
                <td key={product.id} className="p-3">
                  <AddToCartButton
                    line={toCartLine(product)}
                    variant="full"
                    disabled={product.stock === 0}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
