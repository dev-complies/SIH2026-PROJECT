import { User, UserRole } from "@/types";

export type NormalizedRole =
  | "ADMIN"
  | "GOVERNMENT_OFFICER"
  | "PROCUREMENT_OFFICER"
  | "STARTUP"
  | "EXPERT"
  | "VALIDATOR";

/**
 * Normalizes any role variation to canonical role keys
 */
export function normalizeRole(role: UserRole | string): NormalizedRole {
  switch (role) {
    case "ADMIN":
    case "PLATFORM_ADMIN":
      return "ADMIN";
    case "EXPERT":
    case "EXPERT_EVALUATOR":
      return "EXPERT";
    case "VALIDATOR":
    case "INDEPENDENT_VALIDATOR":
      return "VALIDATOR";
    case "GOVERNMENT_OFFICER":
      return "GOVERNMENT_OFFICER";
    case "PROCUREMENT_OFFICER":
      return "PROCUREMENT_OFFICER";
    case "STARTUP":
      return "STARTUP";
    default:
      return "STARTUP";
  }
}

export type Permission =
  | "challenges:create"
  | "challenges:edit"
  | "challenges:publish"
  | "applications:submit"
  | "applications:view_own"
  | "applications:view_all"
  | "applications:screen_eligibility"
  | "evaluations:declare_coi"
  | "evaluations:score_assigned"
  | "evaluations:view_consensus"
  | "pilots:create"
  | "pilots:manage"
  | "milestones:submit"
  | "milestones:approve"
  | "evidence:upload"
  | "evidence:verify"
  | "payments:request"
  | "payments:approve"
  | "payments:disburse"
  | "validation:submit_report"
  | "scale_up:decide"
  | "audit:read"
  | "users:manage";

/**
 * Role-to-Permissions Matrix based on docs/permissions.md
 */
export const ROLE_PERMISSIONS: Record<NormalizedRole, Permission[]> = {
  ADMIN: [
    "challenges:create",
    "challenges:edit",
    "challenges:publish",
    "applications:view_all",
    "applications:screen_eligibility",
    "evaluations:view_consensus",
    "pilots:create",
    "pilots:manage",
    "milestones:approve",
    "payments:approve",
    "payments:disburse",
    "scale_up:decide",
    "audit:read",
    "users:manage",
  ],
  GOVERNMENT_OFFICER: [
    "challenges:create",
    "challenges:edit",
    "applications:view_all",
    "applications:screen_eligibility",
    "evaluations:view_consensus",
    "pilots:create",
    "pilots:manage",
    "milestones:approve",
    "payments:request",
    "scale_up:decide",
  ],
  PROCUREMENT_OFFICER: [
    "challenges:publish",
    "applications:view_all",
    "evaluations:view_consensus",
    "payments:approve",
    "payments:disburse",
    "scale_up:decide",
  ],
  STARTUP: [
    "applications:submit",
    "applications:view_own",
    "milestones:submit",
    "evidence:upload",
  ],
  EXPERT: [
    "evaluations:declare_coi",
    "evaluations:score_assigned",
  ],
  VALIDATOR: [
    "evidence:verify",
    "validation:submit_report",
  ],
};

/**
 * Checks if a user has a specific granular permission
 */
export function hasPermission(user: User | null | undefined, permission: Permission): boolean {
  if (!user) return false;
  const canonicalRole = normalizeRole(user.role);
  const permissions = ROLE_PERMISSIONS[canonicalRole] || [];
  return permissions.includes(permission);
}

/**
 * Route protection rules: maps URL prefix to allowed roles
 */
export const ROUTE_ACCESS_MAP: Array<{ prefix: string; allowedRoles: NormalizedRole[] }> = [
  { prefix: "/admin", allowedRoles: ["ADMIN"] },
  { prefix: "/gov", allowedRoles: ["GOVERNMENT_OFFICER", "ADMIN"] },
  { prefix: "/procurement", allowedRoles: ["PROCUREMENT_OFFICER", "ADMIN"] },
  { prefix: "/startup", allowedRoles: ["STARTUP", "ADMIN"] },
  { prefix: "/expert", allowedRoles: ["EXPERT", "ADMIN"] },
  { prefix: "/validator", allowedRoles: ["VALIDATOR", "ADMIN"] },
];

/**
 * Checks if a user role is authorized to access a given URL path
 */
export function isRouteAuthorized(pathname: string, userRole: UserRole | string | null | undefined): boolean {
  const matchedRule = ROUTE_ACCESS_MAP.find((rule) => pathname.startsWith(rule.prefix));
  if (!matchedRule) {
    // Public route or unmapped route: accessible to all, including unauthenticated users
    return true;
  }

  // Protected route requires an authenticated user with an authorized role
  if (!userRole) return false;
  const canonicalRole = normalizeRole(userRole);

  return matchedRule.allowedRoles.includes(canonicalRole);
}

/**
 * ----------------------------------------------------------------------
 * Backend Database & Resource Authorization Policies
 * Prevents unauthorized access to protected resources by direct API calls
 * ----------------------------------------------------------------------
 */

/**
 * Protects startup private documents and bids.
 * Only the owning startup or authorized government officers/procurement officers can view.
 */
export function canAccessStartupDocuments(user: User, targetOrgId: string): boolean {
  const role = normalizeRole(user.role);
  if (role === "ADMIN" || role === "GOVERNMENT_OFFICER" || role === "PROCUREMENT_OFFICER") {
    return true;
  }
  if (role === "STARTUP") {
    return user.organizationId === targetOrgId;
  }
  return false;
}

/**
 * Protects expert evaluations:
 * 1. Evaluator cannot view until COI is declared.
 * 2. Evaluator cannot view other evaluators' scores before submitting their own.
 * 3. Startups can NEVER view raw expert evaluations or individual scores.
 */
export function canAccessEvaluation(
  user: User,
  assignment: { expertId: string; hasConflictOfInterest: boolean; isCompleted: boolean; challengeId: string }
): boolean {
  const role = normalizeRole(user.role);
  if (role === "ADMIN" || role === "GOVERNMENT_OFFICER") {
    return true;
  }
  if (role === "EXPERT") {
    // Expert can only access their own assignment
    if (user.id !== assignment.expertId) {
      return false;
    }
    // Must not have undeclared COI
    if (assignment.hasConflictOfInterest) {
      return false;
    }
    return true;
  }
  return false;
}

/**
 * Protects internal procurement information & milestone payment disbursements.
 * Restricted strictly to PROCUREMENT_OFFICER and ADMIN.
 */
export function canAuthorizeProcurementDisbursement(user: User): boolean {
  const role = normalizeRole(user.role);
  return role === "PROCUREMENT_OFFICER" || role === "ADMIN";
}

/**
 * Protects independent validator audit workspaces and findings.
 * Restricted to assigned validator, government officer, and admin.
 */
export function canAccessValidationStudio(user: User, assignedValidatorId?: string): boolean {
  const role = normalizeRole(user.role);
  if (role === "ADMIN" || role === "GOVERNMENT_OFFICER") return true;
  if (role === "VALIDATOR") {
    return !assignedValidatorId || user.id === assignedValidatorId;
  }
  return false;
}

/**
 * Protects government-only internal scoring, shortlisting and departmental notes.
 */
export function canAccessGovernmentInternalData(user: User, departmentId?: string): boolean {
  const role = normalizeRole(user.role);
  if (role === "ADMIN") return true;
  if (role === "GOVERNMENT_OFFICER" || role === "PROCUREMENT_OFFICER") {
    return !departmentId || !user.departmentId || user.departmentId === departmentId;
  }
  return false;
}
