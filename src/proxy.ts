import { NextResponse, type NextRequest } from "next/server";

const ADMIN_COOKIE = "gl_admin";

/**
 * محافظت سریع از مسیر پنل مدیریت پیش از رندر.
 * اعتبار کامل کوکی در لایهٔ پنل (دارای امضای هش) بررسی می‌شود.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!request.cookies.get(ADMIN_COOKIE)?.value) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
