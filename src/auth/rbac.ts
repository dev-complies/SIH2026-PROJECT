import { UserRole } from "@/types";

/**
 * Role-Based Access Control Rule Helpers
 * Derived from docs/permissions.md
 */

export function canCreateChallenge(role: UserRole): boolean {
  return role === "GOVERNMENT_OFFICER" || role === "PLATFORM_ADMIN";
}

export function canPublishChallenge(role: UserRole): boolean {
  return role === "PROCUREMENT_OFFICER" || role === "PLATFORM_ADMIN";
}

export function canApplyToChallenge(role: UserRole): boolean {
  return role === "STARTUP";
}

export function canScreenEligibility(role: UserRole): boolean {
  return role === "GOVERNMENT_OFFICER" || role === "PLATFORM_ADMIN";
}

export function canEvaluateProposals(role: UserRole): boolean {
  return role === "EXPERT_EVALUATOR";
}

export function canApproveMilestone(role: UserRole): boolean {
  return role === "GOVERNMENT_OFFICER" || role === "PLATFORM_ADMIN";
}

export function canAuthorizePayment(role: UserRole): boolean {
  return role === "PROCUREMENT_OFFICER" || role === "PLATFORM_ADMIN";
}

export function canSubmitValidationReport(role: UserRole): boolean {
  return role === "INDEPENDENT_VALIDATOR";
}

export function canDecideScaleUp(role: UserRole): boolean {
  return role === "GOVERNMENT_OFFICER" || role === "PROCUREMENT_OFFICER" || role === "PLATFORM_ADMIN";
}

export function canViewAuditLogs(role: UserRole): boolean {
  return role === "PLATFORM_ADMIN";
}
