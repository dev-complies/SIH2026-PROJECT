import { NextRequest, NextResponse } from "next/server";
import { User } from "@/types";
import { SESSION_COOKIE_NAME } from "./session";
import { normalizeRole, NormalizedRole } from "./permissions";

import { verifyAndSanitizeUser } from "@/lib/security";

/**
 * Extracts and validates the authenticated user from cookies or Authorization header
 */
export function getAuthenticatedUser(request: NextRequest): User | null {
  let candidate: any = null;

  // 1. Try session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  if (sessionCookie?.value) {
    try {
      candidate = JSON.parse(decodeURIComponent(sessionCookie.value));
    } catch {
      // Ignore
    }
  }

  // 2. Try Authorization header (Bearer JSON string or token)
  if (!candidate) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const raw = authHeader.slice(7);
      try {
        candidate = JSON.parse(raw);
      } catch {
        // Ignore
      }
    }
  }

  // 3. Fallback header for simulated API tests
  if (!candidate) {
    const simulatedUserHeader = request.headers.get("x-simulated-user");
    if (simulatedUserHeader) {
      try {
        candidate = JSON.parse(simulatedUserHeader);
      } catch {
        // Ignore
      }
    }
  }

  if (!candidate) return null;

  // Defensively verify user authenticity and prevent unauthorized role elevation
  return verifyAndSanitizeUser(candidate);
}

/**
 * Returns a standardized 401 Unauthorized JSON response
 */
export function unauthorizedResponse(message = "Authentication required to access this resource.") {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message,
      },
      timestamp: new Date().toISOString(),
    },
    { status: 401 }
  );
}

/**
 * Returns a standardized 403 Forbidden JSON response
 */
export function forbiddenResponse(message = "You do not possess the required clearance to access this resource.") {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "FORBIDDEN",
        message,
      },
      timestamp: new Date().toISOString(),
    },
    { status: 403 }
  );
}
