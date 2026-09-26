import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isRouteAuthorized } from "@/auth/permissions";
import { SESSION_COOKIE_NAME } from "@/auth/session";

// Prefixes requiring role authorization
const PROTECTED_PREFIXES = [
  "/admin",
  "/gov",
  "/procurement",
  "/startup",
  "/expert",
  "/validator",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if target is a protected web page
  const isProtectedPage = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // Check if target is a protected API route
  const isProtectedApi = pathname.startsWith("/api/protected");

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  // Retrieve session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    if (isProtectedApi) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHENTICATED",
            message: "Authentication required to access this resource.",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // Redirect unauthenticated web page requests to login
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Parse session user
  try {
    const user = JSON.parse(decodeURIComponent(sessionCookie.value));

    // Verify role authorization
    const authorized = isRouteAuthorized(pathname, user.role);

    if (!authorized) {
      if (isProtectedApi) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "FORBIDDEN",
              message: `Role ${user.role} is not authorized to access this resource.`,
            },
            timestamp: new Date().toISOString(),
          },
          { status: 403 }
        );
      }

      // Redirect unauthorized web page requests to /unauthorized
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      unauthorizedUrl.searchParams.set("attempted", pathname);
      unauthorizedUrl.searchParams.set("role", user.role);
      return NextResponse.redirect(unauthorizedUrl);
    }
  } catch {
    // Malformed session cookie
    if (isProtectedApi) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_SESSION", message: "Invalid session cookie." },
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/gov/:path*",
    "/procurement/:path*",
    "/startup/:path*",
    "/expert/:path*",
    "/validator/:path*",
    "/api/protected/:path*",
  ],
};
