import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    // Lấy pathname từ URL
    const pathname = request.nextUrl.pathname;

    // Nếu người dùng chưa đăng nhập và không phải là route auth/*
    if (!request.nextauth.token && !pathname.startsWith("/auth")) {
      // Chuyển hướng đến trang signin
      const signInUrl = new URL("/auth/login", request.url);
      // Thêm callbackUrl để sau khi đăng nhập xong chuyển về trang ban đầu
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Nếu đã đăng nhập và cố truy cập các route auth/*
    if (request.nextauth.token && pathname.startsWith("/auth")) {
      // Chuyển hướng về trang chủ
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Function này chạy trước middleware
      authorized: ({ token }) => {
        // Luôn return true để logic xử lý ở trong middleware
        return true;
      },
    },
  }
);

// Định nghĩa các route áp dụng middleware
export const config = {
  matcher: [
    // Match all routes except api, _next/static, _next/image, favicon.ico
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};