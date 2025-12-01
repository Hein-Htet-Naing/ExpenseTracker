import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;
  // console.log("Proxy Refresh Token:", refreshToken);
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (!refreshToken && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    refreshToken &&
    isPublicRoute &&
    (pathname === "/login" || pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
