"use client";

import Image from "next/image";
import Link from "next/link";
import { useCompare } from "@/components/compare-provider";
import { CloseIcon, CompareIcon } from "@/components/icons";
import { faNumber } from "@/lib/format";

export function CompareBar() {
  const { items, count, remove, clear, ready } = useCompare();

  if (!ready || count === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper/95 shadow-[0_-10px_30px_-20px_rgba(0,0,0,0.4)] backdrop-blur">
      <div className="container-x flex flex-wrap items-center gap-3 py-2.5">
        <span className="hidden items-center gap-1.5 text-[11px] font-black text-ink sm:flex">
          <CompareIcon className="size-4 text-coral" />
          مقایسه ({faNumber(count)}/{faNumber(3)})
        </span>

        <div className="flex flex-1 items-center gap-2 overflow-x-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex shrink-0 items-center gap-2 rounded-lg border border-line bg-paper p-1.5 pe-2"
            >
              <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-md bg-[#f7f7f8] text-lg">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt=""
                    width={36}
                    height={36}
                    className="size-9 object-cover"
                  />
                ) : (
                  item.emoji
                )}
              </span>
              <Link
                href={`/products/${item.slug}`}
                className="max-w-[110px] truncate text-[10.5px] font-bold text-ink-soft hover:text-coral"
              >
                {item.name}
              </Link>
              <button
                type="button"
                onClick={() => remove(item.id)}
                aria-label={`حذف ${item.name} از مقایسه`}
                className="grid size-5 place-items-center rounded-full text-mute transition hover:bg-coral/10 hover:text-coral"
              >
                <CloseIcon className="size-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clear}
            className="text-[10px] font-bold text-mute transition hover:text-coral"
          >
            پاک کردن
          </button>
          <Link
            href="/compare"
            className="btn btn-primary h-9 px-4 text-[11px]"
          >
            <CompareIcon className="size-4" />
            مقایسه محصولات
          </Link>
        </div>
      </div>
    </div>
  );
}
