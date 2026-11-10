import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-20">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-[6rem] font-black leading-none text-violet">۴۰۴</p>
        <h1 className="mt-2 text-2xl font-black">این صفحه پیدا نشد</h1>
        <p className="mt-3 text-sm leading-7 text-mute">
          شاید نشانی را اشتباه وارد کردی یا محصول موردنظر از فروشگاه حذف شده است. بیا از فروشگاه
          شروع کنیم.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            صفحه اصلی
          </Link>
          <Link href="/products" className="btn btn-ghost">
            فروشگاه
          </Link>
        </div>
      </div>
    </div>
  );
}
