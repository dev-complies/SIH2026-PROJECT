import { User, UserRole } from "@/types";

export interface DemoUserAccount {
  id: string;
  email: string;
  password: string; // Demo password
  firstName: string;
  lastName: string;
  role: UserRole;
  departmentId?: string;
  organizationId?: string;
  designation: string;
}

export const DEMO_USERS: DemoUserAccount[] = [
  {
    id: "user-admin-001",
    email: "admin@govinnovate.gov.in",
    password: "Password123!",
    firstName: "Sanjay",
    lastName: "Mehta",
    role: "ADMIN",
    designation: "Director of Digital Governance Architecture",
  },
  {
    id: "user-gov-001",
    email: "officer@urban.gov.in",
    password: "Password123!",
    firstName: "Rajesh",
    lastName: "Verma",
    role: "GOVERNMENT_OFFICER",
    departmentId: "dept-urban-001",
    designation: "Joint Director, Urban Smart Infrastructure",
  },
  {
    id: "user-proc-001",
    email: "procurement@urban.gov.in",
    password: "Password123!",
    firstName: "Sunita",
    lastName: "Deshmukh",
    role: "PROCUREMENT_OFFICER",
    departmentId: "dept-urban-001",
    designation: "Chief Procurement & Contracts Officer",
  },
  {
    id: "user-startup-001",
    email: "founder@airsense.example.com",
    password: "Password123!",
    firstName: "Aarav",
    lastName: "Sharma",
    role: "STARTUP",
    organizationId: "org-airsense-001",
    designation: "Chief Executive Officer & Founder",
  },
  {
    id: "user-expert-001",
    email: "dr.gupta@iitk.ac.in",
    password: "Password123!",
    firstName: "Dr. Alok",
    lastName: "Gupta",
    role: "EXPERT",
    designation: "Professor of Atmospheric Sciences, IIT Kanpur",
  },
  {
    id: "user-validator-001",
    email: "validator@teriin.org",
    password: "Password123!",
    firstName: "Priya",
    lastName: "Nair",
    role: "VALIDATOR",
    designation: "Lead Auditor, Environmental Systems Validation",
  },
];

export const SESSION_COOKIE_NAME = "govinnovate_session";

/**
 * Converts a demo user to a User entity
 */
export function toUserEntity(demoUser: DemoUserAccount): User {
  return {
    id: demoUser.id,
    email: demoUser.email,
    firstName: demoUser.firstName,
    lastName: demoUser.lastName,
    role: demoUser.role,
    departmentId: demoUser.departmentId,
    organizationId: demoUser.organizationId,
    designation: demoUser.designation,
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
}

/**
 * Validates credentials and returns user if matched
 */
export function authenticateDemoUser(email: string, password: string): User | null {
  const matched = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  return matched ? toUserEntity(matched) : null;
}

/**
 * Client-side cookie setter for session persistence across page loads and middleware
 */
export function setClientSession(user: User): void {
  if (typeof window === "undefined") return;
  const sessionData = encodeURIComponent(JSON.stringify(user));
  // Set cookie for 7 days
  document.cookie = `${SESSION_COOKIE_NAME}=${sessionData}; path=/; max-age=604800; SameSite=Lax`;
  localStorage.setItem(SESSION_COOKIE_NAME, JSON.stringify(user));
}

/**
 * Client-side cookie clearer for logout
 */
export function clearClientSession(): void {
  if (typeof window === "undefined") return;
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  localStorage.removeItem(SESSION_COOKIE_NAME);
}

/**
 * Gets active session from client storage
 */
export function getClientSession(): User | null {
  if (typeof window === "undefined") return null;

  // First try localStorage
  const localData = localStorage.getItem(SESSION_COOKIE_NAME);
  if (localData) {
    try {
      return JSON.parse(localData) as User;
    } catch {
      // Ignore
    }
  }

  // Fallback to cookie
  const cookies = document.cookie.split(";");
  for (const c of cookies) {
    const [name, val] = c.trim().split("=");
    if (name === SESSION_COOKIE_NAME && val) {
      try {
        return JSON.parse(decodeURIComponent(val)) as User;
      } catch {
        // Ignore
      }
    }
  }

  return null;
}
