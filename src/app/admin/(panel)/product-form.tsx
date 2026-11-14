"use client";

import { useActionState } from "react";
import { createProductAction, type ProductFormState } from "@/app/admin/(panel)/actions";
import type { Category } from "@/lib/types";

const initialState: ProductFormState = {};

const gradients = [
  { label: "بنفش", value: 0 },
  { label: "مرجانی", value: 1 },
  { label: "آبی روشن", value: 2 },
  { label: "لیمویی", value: 3 },
  { label: "صورتی", value: 4 },
  { label: "آبی", value: 5 },
];

export function ProductForm({ categories }: { categories: Category[] }) {
  const [state, action, pending] = useActionState(createProductAction, initialState);

  return (
    <form action={action} className="mt-5 grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-xs font-bold text-ink-soft">
          نام محصول
        </label>
        <input id="name" name="name" className="field" placeholder="هدفون بی‌سیم سونی WH-1000XM5" required />
      </div>

      <div>
        <label htmlFor="brand" className="mb-1.5 block text-xs font-bold text-ink-soft">
          برند
        </label>
        <input id="brand" name="brand" className="field" placeholder="Sony" required />
      </div>

      <div>
        <label htmlFor="categorySlug" className="mb-1.5 block text-xs font-bold text-ink-soft">
          دسته‌بندی
        </label>
        <select id="categorySlug" name="categorySlug" className="field" required defaultValue="">
          <option value="" disabled>
            انتخاب دسته
          </option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="emoji" className="mb-1.5 block text-xs font-bold text-ink-soft">
          ایموجی محصول
        </label>
        <input id="emoji" name="emoji" className="field" placeholder="🎧" defaultValue="📦" />
      </div>

      <div>
        <label htmlFor="image" className="mb-1.5 block text-xs font-bold text-ink-soft">
          آدرس تصویر (اختیاری)
        </label>
        <input
          id="image"
          name="image"
          className="field"
          placeholder="/products/my-product.jpg"
          dir="ltr"
        />
        <p className="mt-1 text-[0.6rem] text-mute">
          اگر خالی بماند، کارت گرادیانی با ایموجی نمایش داده می‌شود.
        </p>
      </div>

      <div>
        <label htmlFor="price" className="mb-1.5 block text-xs font-bold text-ink-soft">
          قیمت (تومان)
        </label>
        <input
          id="price"
          name="price"
          inputMode="numeric"
          className="field"
          placeholder="2,490,000"
          required
        />
      </div>

      <div>
        <label htmlFor="oldPrice" className="mb-1.5 block text-xs font-bold text-ink-soft">
          قیمت قبل از تخفیف (اختیاری)
        </label>
        <input id="oldPrice" name="oldPrice" inputMode="numeric" className="field" placeholder="2,990,000" />
      </div>

      <div>
        <label htmlFor="stock" className="mb-1.5 block text-xs font-bold text-ink-soft">
          موجودی
        </label>
        <input id="stock" name="stock" inputMode="numeric" className="field" placeholder="10" required />
      </div>

      <div>
        <label htmlFor="gradient" className="mb-1.5 block text-xs font-bold text-ink-soft">
          رنگ کارت محصول
        </label>
        <select id="gradient" name="gradient" className="field" defaultValue="0">
          {gradients.map((gradient) => (
            <option key={gradient.value} value={gradient.value}>
              {gradient.label}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="tagline" className="mb-1.5 block text-xs font-bold text-ink-soft">
          شعار کوتاه
        </label>
        <input
          id="tagline"
          name="tagline"
          className="field"
          placeholder="حذف نویز هوشمند، صدای استودیویی"
          required
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="description" className="mb-1.5 block text-xs font-bold text-ink-soft">
          توضیحات
        </label>
        <textarea id="description" name="description" rows={3} className="field resize-none" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="specs" className="mb-1.5 block text-xs font-bold text-ink-soft">
          مشخصات (با کاما یا خط جدید جدا کن)
        </label>
        <input
          id="specs"
          name="specs"
          className="field"
          placeholder="باتری ۳۸ ساعت، بلوتوث ۵.۳، حذف نویز ANC"
        />
      </div>

      {state.error ? (
        <p role="alert" className="sm:col-span-2 rounded-xl bg-coral/10 px-4 py-2.5 text-xs font-bold text-coral">
          {state.error}
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary w-full disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          {pending ? "در حال ثبت..." : "افزودن محصول"}
        </button>
      </div>
    </form>
  );
}
