import { NextResponse, type NextRequest } from "next/server";

const ADMIN_COOKIE = "gl_admin";
const SESSION_COOKIE = "arc_session";

/**
 * محافظت سریع از مسیر پنل مدیریت و حساب کاربری پیش از رندر.
 * اعتبار کامل سشن در لایه‌های بعدی (هش و دیتابیس) بررسی می‌شود.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }
    if (!request.cookies.get(ADMIN_COOKIE)?.value) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/account") && !request.cookies.get(SESSION_COOKIE)?.value) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/account"],
};
