import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const route = request.nextUrl.pathname;
  const authRoute = route.startsWith("/auth");

  const token = request.cookies.get("refreshToken")?.value;

  if (!token && !authRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token && authRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
