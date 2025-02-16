import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";
export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const pathname = request.nextUrl.pathname;
    const token = request.nextauth.token;
    const isAuthPage = pathname.startsWith("/auth");

    // Xử lý khi đã đăng nhập và cố truy cập trang auth
    if (token && isAuthPage) {
      return NextResponse.redirect(
        new URL(
          token.user.role === "admin" ? "/admin" : "/study",
          request.url
        )
      );
    }

    // Ngăn user thường truy cập trang admin
    if (token && pathname.startsWith("/admin") && token.user.role !== "admin") {
      return NextResponse.redirect(new URL("/study", request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        // Cho phép truy cập /auth mà không cần token
        if (pathname.startsWith("/auth")) {
          return true;
        }
        
        // Các route khác yêu cầu phải có token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|favicon.ico|public).*)' 

   ],
};