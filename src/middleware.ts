import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isRouteAuthorized } from "@/auth/permissions";
import { SESSION_COOKIE_NAME } from "@/auth/session";
import { verifyAndSanitizeUser, isCsrfSafe } from "@/lib/security";

// Prefixes requiring role authorization
const PROTECTED_PREFIXES = [
  "/admin",
  "/gov",
  "/procurement",
  "/startup",
  "/expert",
  "/validator",
];

// Helper to attach defense-in-depth security response headers
function attachSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 1. CSRF Defense on mutating API requests
  if (
    pathname.startsWith("/api/") &&
    ["POST", "PUT", "PATCH", "DELETE"].includes(method)
  ) {
    if (!isCsrfSafe(request.headers, request.nextUrl.origin)) {
      return attachSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: {
              code: "CSRF_FORBIDDEN",
              message: "Cross-Site Request Forgery (CSRF) origin verification failed.",
            },
            timestamp: new Date().toISOString(),
          },
          { status: 403 }
        )
      );
    }
  }

  // Check if target is a protected web page
  const isProtectedPage = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // Check if target is a protected API route
  const isProtectedApi = pathname.startsWith("/api/protected");

  if (!isProtectedPage && !isProtectedApi) {
    return attachSecurityHeaders(NextResponse.next());
  }

  // Retrieve session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    if (isProtectedApi) {
      return attachSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: {
              code: "UNAUTHENTICATED",
              message: "Authentication required to access this resource.",
            },
            timestamp: new Date().toISOString(),
          },
          { status: 401 }
        )
      );
    }

    // Redirect unauthenticated web page requests to login
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return attachSecurityHeaders(NextResponse.redirect(loginUrl));
  }

  // Parse and verify session user
  try {
    const rawUser = JSON.parse(decodeURIComponent(sessionCookie.value));
    const user = verifyAndSanitizeUser(rawUser);

    if (!user) {
      throw new Error("Invalid or tampered user session");
    }

    // Verify role authorization
    const authorized = isRouteAuthorized(pathname, user.role);

    if (!authorized) {
      if (isProtectedApi) {
        return attachSecurityHeaders(
          NextResponse.json(
            {
              success: false,
              error: {
                code: "FORBIDDEN",
                message: `Role ${user.role} is not authorized to access this resource.`,
              },
              timestamp: new Date().toISOString(),
            },
            { status: 403 }
          )
        );
      }

      // Redirect unauthorized web page requests to /unauthorized
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      unauthorizedUrl.searchParams.set("attempted", pathname);
      unauthorizedUrl.searchParams.set("role", user.role);
      return attachSecurityHeaders(NextResponse.redirect(unauthorizedUrl));
    }
  } catch {
    // Malformed session cookie
    if (isProtectedApi) {
      return attachSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: { code: "INVALID_SESSION", message: "Invalid session cookie." },
            timestamp: new Date().toISOString(),
          },
          { status: 401 }
        )
      );
    }
    const loginUrl = new URL("/auth/login", request.url);
    return attachSecurityHeaders(NextResponse.redirect(loginUrl));
  }

  return attachSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
