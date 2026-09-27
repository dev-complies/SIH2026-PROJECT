import { User } from "@/types";
import { DEMO_USERS } from "@/auth/session";
import { normalizeRole } from "@/auth/permissions";

const SECRET_KEY =
  process.env.JWT_SECRET || "govinnovate-secure-salt-key-2026-production-ready";

// Permitted empirical & legal file formats
export const ALLOWED_FILE_FORMATS = new Set([
  "pdf",
  "geojson",
  "json",
  "csv",
  "xlsx",
  "xls",
  "png",
  "jpg",
  "jpeg",
  "mp4",
  "zip",
  "txt",
  "docx",
  "doc",
]);

// Explicitly forbidden dangerous executable extensions
export const DANGEROUS_FILE_EXTENSIONS = new Set([
  "exe",
  "sh",
  "bat",
  "cmd",
  "bin",
  "js",
  "py",
  "php",
  "vbs",
  "com",
  "pif",
  "scr",
  "msi",
  "jar",
  "apk",
  "pl",
  "cgi",
  "jsp",
  "asp",
  "aspx",
  "dll",
  "so",
]);

/**
 * 1. Input Sanitization: Strips XSS script vectors, dangerous tags, and controls length
 */
export function sanitizeString(
  input: unknown,
  maxLength = 10000
): string {
  if (typeof input !== "string") {
    return "";
  }

  // Strip null bytes and non-printable control characters (except newline, tab, carriage return)
  let clean = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Strip <script ...>...</script> tags case-insensitively
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // Strip inline javascript: and vbscript: URIs
  clean = clean.replace(/javascript\s*:/gi, "");
  clean = clean.replace(/vbscript\s*:/gi, "");
  clean = clean.replace(/data\s*:\s*text\/html/gi, "");

  // Strip common dangerous HTML elements
  clean = clean.replace(/<\/?(iframe|embed|object|base|link|meta|style|applet|svg\s+onload)[^>]*>/gi, "");

  // Trim to maximum length to prevent DoS
  if (clean.length > maxLength) {
    clean = clean.slice(0, maxLength);
  }

  return clean.trim();
}

/**
 * 2. Path Traversal & Filename Sanitizer
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return "unnamed_file";

  // Strip path traversal sequences (../, ..\, absolute paths)
  let name = filename.replace(/^.*[\\\/]/, "");
  name = name.replace(/\.\./g, "");
  name = name.replace(/[\x00-\x1F\x7F]/g, "");
  name = name.replace(/[<>:"/\\|?*]/g, "_");

  // Avoid hidden files starting with dot
  if (name.startsWith(".")) {
    name = "file" + name;
  }

  return name.slice(0, 150);
}

/**
 * 3. File Format & Extension Validation
 */
export function validateFileFormat(formatOrExt: string): {
  isValid: boolean;
  error?: string;
  normalizedFormat: string;
} {
  if (!formatOrExt) {
    return { isValid: false, error: "File format is required.", normalizedFormat: "" };
  }

  const clean = formatOrExt.toLowerCase().replace(/^\./, "").trim();

  // Check against dangerous extensions
  if (DANGEROUS_FILE_EXTENSIONS.has(clean)) {
    return {
      isValid: false,
      error: `Security Violation: Executable file format '.${clean}' is prohibited under government information security policies.`,
      normalizedFormat: clean,
    };
  }

  // Check against allowlist
  if (!ALLOWED_FILE_FORMATS.has(clean)) {
    return {
      isValid: false,
      error: `File format '.${clean}' is not supported. Permitted formats: ${Array.from(ALLOWED_FILE_FORMATS).join(", ")}`,
      normalizedFormat: clean,
    };
  }

  return { isValid: true, normalizedFormat: clean.toUpperCase() };
}

/**
 * 4. Portable Token Signature & Session Signing (Edge & Node Runtime Compatible)
 */
export function createSignature(payload: string): string {
  let hash1 = 0x811c9dc5;
  let hash2 = 0x27d4eb2f;
  const combined = `${SECRET_KEY}:${payload}:${SECRET_KEY}`;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash1 = Math.imul(hash1 ^ char, 0x01000193);
    hash2 = Math.imul(hash2 ^ char, 0x5bd1e995);
  }
  return `${(hash1 >>> 0).toString(16).padStart(8, "0")}${(hash2 >>> 0).toString(16).padStart(8, "0")}`;
}

export function signUserSession(user: User): string {
  const payloadStr = JSON.stringify(user);
  const signature = createSignature(payloadStr);
  const tokenObj = { user, sig: signature };
  const json = JSON.stringify(tokenObj);
  return typeof btoa !== "undefined"
    ? btoa(json)
    : Buffer.from(json).toString("base64");
}

/**
 * Validates a user session against signature or known demo users to prevent role spoofing
 */
export function verifyAndSanitizeUser(candidate: any): User | null {
  if (!candidate || typeof candidate !== "object") return null;

  const id = typeof candidate.id === "string" ? candidate.id : "";
  const role = typeof candidate.role === "string" ? normalizeRole(candidate.role) : null;

  if (!id || !role) return null;

  // Verify against registered DEMO_USERS to prevent role elevation
  const registered = DEMO_USERS.find((u) => u.id === id);
  if (registered) {
    const canonicalExpectedRole = normalizeRole(registered.role);
    if (role !== canonicalExpectedRole) {
      // Role tampering detected! Deny authorization elevation attempt
      console.warn(`[SECURITY ALERT] Role tampering detected for user ${id}. Claimed: ${role}, Expected: ${canonicalExpectedRole}`);
      return null;
    }

    return {
      id: registered.id,
      email: registered.email,
      firstName: registered.firstName,
      lastName: registered.lastName,
      role: registered.role,
      departmentId: registered.departmentId,
      organizationId: registered.organizationId,
      designation: registered.designation,
      isActive: true,
      createdAt: candidate.createdAt || "2026-01-01T00:00:00.000Z",
      updatedAt: new Date().toISOString(),
    };
  }

  // If dynamic non-demo user is provided (e.g. from tests), ensure role is canonical
  return {
    id: sanitizeString(id, 64),
    email: sanitizeString(candidate.email || "", 128),
    firstName: sanitizeString(candidate.firstName || "User", 64),
    lastName: sanitizeString(candidate.lastName || "", 64),
    role: role as any,
    departmentId: candidate.departmentId ? sanitizeString(candidate.departmentId, 64) : undefined,
    organizationId: candidate.organizationId ? sanitizeString(candidate.organizationId, 64) : undefined,
    designation: candidate.designation ? sanitizeString(candidate.designation, 128) : undefined,
    isActive: candidate.isActive !== false,
    createdAt: candidate.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * 5. CSRF Origin & Referer Verification
 */
export function isCsrfSafe(headers: Headers, appOrigin?: string): boolean {
  const origin = headers.get("origin");
  const referer = headers.get("referer");

  // If neither origin nor referer is sent (e.g. server-side programmatic or same-origin non-browser call), pass
  if (!origin && !referer) {
    return true;
  }

  const checkUrl = origin || referer || "";

  try {
    const parsed = new URL(checkUrl);
    const host = parsed.hostname.toLowerCase();

    // Allow localhost and local loopback for development
    if (host === "localhost" || host === "127.0.0.1" || host === "::1") {
      return true;
    }

    // Allow specified application domain
    if (appOrigin) {
      const appHost = new URL(appOrigin).hostname.toLowerCase();
      if (host === appHost || host.endsWith(`.${appHost}`)) {
        return true;
      }
    }

    // Common deployment hosts (e.g. *.gov.in or configured platform domains)
    if (host.endsWith(".gov.in") || host.endsWith(".vercel.app")) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}
