/**
 * GovInnovate Security & Role-Based Authorization Verification Suite
 * Tests every role against every major route, permission, and data isolation policy.
 */

// Normalized role definitions
const ROLES = [
  "ADMIN",
  "GOVERNMENT_OFFICER",
  "PROCUREMENT_OFFICER",
  "STARTUP",
  "EXPERT",
  "VALIDATOR",
];

const ROUTE_ACCESS_MAP = [
  { prefix: "/admin", allowedRoles: ["ADMIN"] },
  { prefix: "/gov", allowedRoles: ["GOVERNMENT_OFFICER", "ADMIN"] },
  { prefix: "/procurement", allowedRoles: ["PROCUREMENT_OFFICER", "ADMIN"] },
  { prefix: "/startup", allowedRoles: ["STARTUP", "ADMIN"] },
  { prefix: "/expert", allowedRoles: ["EXPERT", "ADMIN"] },
  { prefix: "/validator", allowedRoles: ["VALIDATOR", "ADMIN"] },
];

function normalizeRole(role) {
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

function isRouteAuthorized(pathname, userRole) {
  const matchedRule = ROUTE_ACCESS_MAP.find((rule) => pathname.startsWith(rule.prefix));
  if (!matchedRule) return true; // public route: accessible to all
  if (!userRole) return false;
  const canonicalRole = normalizeRole(userRole);
  return matchedRule.allowedRoles.includes(canonicalRole);
}

// Data isolation policies
function canAccessStartupDocuments(user, targetOrgId) {
  const role = normalizeRole(user.role);
  if (role === "ADMIN" || role === "GOVERNMENT_OFFICER" || role === "PROCUREMENT_OFFICER") return true;
  if (role === "STARTUP") return user.organizationId === targetOrgId;
  return false;
}

function canAccessEvaluation(user, assignment) {
  const role = normalizeRole(user.role);
  if (role === "ADMIN" || role === "GOVERNMENT_OFFICER") return true;
  if (role === "EXPERT") {
    if (user.id !== assignment.expertId) return false;
    if (assignment.hasConflictOfInterest) return false;
    return true;
  }
  return false;
}

function canAuthorizeProcurementDisbursement(user) {
  const role = normalizeRole(user.role);
  return role === "PROCUREMENT_OFFICER" || role === "ADMIN";
}

function canAccessValidationStudio(user, assignedValidatorId) {
  const role = normalizeRole(user.role);
  if (role === "ADMIN" || role === "GOVERNMENT_OFFICER") return true;
  if (role === "VALIDATOR") {
    return !assignedValidatorId || user.id === assignedValidatorId;
  }
  return false;
}

// Test accounts
const DEMO_USERS = [
  { id: "user-admin-001", email: "admin@govinnovate.gov.in", role: "ADMIN" },
  { id: "user-gov-001", email: "officer@urban.gov.in", role: "GOVERNMENT_OFFICER", departmentId: "dept-urban-001" },
  { id: "user-proc-001", email: "procurement@urban.gov.in", role: "PROCUREMENT_OFFICER", departmentId: "dept-urban-001" },
  { id: "user-startup-001", email: "founder@airsense.example.com", role: "STARTUP", organizationId: "org-airsense-001" },
  { id: "user-expert-001", email: "dr.gupta@iitk.ac.in", role: "EXPERT" },
  { id: "user-validator-001", email: "validator@teriin.org", role: "VALIDATOR" },
];

let totalTests = 0;
let passedTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    process.exitCode = 1;
  }
}

console.log("======================================================================");
console.log("GovInnovate Role-Based Access Control (RBAC) Verification Suite");
console.log("======================================================================\n");

// 1. Matrix: Every Role vs Every Major Route
console.log("--- 1. Testing Route Matrix Across All 6 Roles ---");
const routes = [
  { path: "/admin/dashboard", allowed: ["ADMIN"] },
  { path: "/gov/dashboard", allowed: ["GOVERNMENT_OFFICER", "ADMIN"] },
  { path: "/procurement/dashboard", allowed: ["PROCUREMENT_OFFICER", "ADMIN"] },
  { path: "/startup/dashboard", allowed: ["STARTUP", "ADMIN"] },
  { path: "/expert/dashboard", allowed: ["EXPERT", "ADMIN"] },
  { path: "/validator/dashboard", allowed: ["VALIDATOR", "ADMIN"] },
  { path: "/", allowed: ROLES }, // Public route
  { path: "/challenges", allowed: ROLES }, // Public route
];

for (const user of DEMO_USERS) {
  console.log(`\nEvaluating role: ${user.role} (${user.email})`);
  for (const route of routes) {
    const shouldBeAllowed = route.allowed.includes(user.role);
    const actualResult = isRouteAuthorized(route.path, user.role);
    assert(
      actualResult === shouldBeAllowed,
      `${user.role} -> ${route.path} (Expected: ${shouldBeAllowed ? "ALLOW" : "BLOCK"}, Got: ${actualResult ? "ALLOW" : "BLOCK"})`
    );
  }
}

// 2. Unauthenticated User Route Access
console.log("\n--- 2. Testing Unauthenticated Access ---");
assert(isRouteAuthorized("/admin/dashboard", null) === false, "Unauthenticated user blocked from /admin");
assert(isRouteAuthorized("/gov/dashboard", null) === false, "Unauthenticated user blocked from /gov");
assert(isRouteAuthorized("/procurement/dashboard", null) === false, "Unauthenticated user blocked from /procurement");
assert(isRouteAuthorized("/startup/dashboard", null) === false, "Unauthenticated user blocked from /startup");
assert(isRouteAuthorized("/expert/dashboard", null) === false, "Unauthenticated user blocked from /expert");
assert(isRouteAuthorized("/validator/dashboard", null) === false, "Unauthenticated user blocked from /validator");
assert(isRouteAuthorized("/", null) === true, "Unauthenticated user allowed on / (Public Home)");
assert(isRouteAuthorized("/challenges", null) === true, "Unauthenticated user allowed on /challenges (Public Catalog)");

// 3. Data Isolation Policy Tests
console.log("\n--- 3. Testing Resource & Data Isolation Policies ---");

// Test Startup Document Isolation
const airSenseUser = DEMO_USERS.find((u) => u.role === "STARTUP");
const competitorStartupUser = { id: "user-startup-002", role: "STARTUP", organizationId: "org-competitor-999" };
const govUser = DEMO_USERS.find((u) => u.role === "GOVERNMENT_OFFICER");
const adminUser = DEMO_USERS.find((u) => u.role === "ADMIN");

assert(canAccessStartupDocuments(airSenseUser, "org-airsense-001") === true, "Owning startup CAN access its own proprietary documents");
assert(canAccessStartupDocuments(competitorStartupUser, "org-airsense-001") === false, "Competitor startup CANNOT access AirSense documents");
assert(canAccessStartupDocuments(govUser, "org-airsense-001") === true, "Government officer CAN inspect submitted startup documents");
assert(canAccessStartupDocuments(adminUser, "org-airsense-001") === true, "Admin CAN inspect documents");

// Test Expert Evaluation Protection
const assignedExpert = DEMO_USERS.find((u) => u.role === "EXPERT");
const unassignedExpert = { id: "user-expert-999", role: "EXPERT" };
const assignment = { expertId: "user-expert-001", hasConflictOfInterest: false, isCompleted: true, challengeId: "chal-air-001" };
const coiAssignment = { expertId: "user-expert-001", hasConflictOfInterest: true, isCompleted: false, challengeId: "chal-air-001" };

assert(canAccessEvaluation(assignedExpert, assignment) === true, "Assigned expert with cleared COI CAN access scorecard");
assert(canAccessEvaluation(unassignedExpert, assignment) === false, "Unassigned expert CANNOT view other expert's assignment");
assert(canAccessEvaluation(assignedExpert, coiAssignment) === false, "Expert with Conflict of Interest CANNOT access proposal");
assert(canAccessEvaluation(airSenseUser, assignment) === false, "Startup CANNOT access confidential expert evaluation scores");
assert(canAccessEvaluation(govUser, assignment) === true, "Government Officer CAN view consensus evaluation scores");

// Test Segregation of Duties for Financial Disbursements
const procurementUser = DEMO_USERS.find((u) => u.role === "PROCUREMENT_OFFICER");
assert(canAuthorizeProcurementDisbursement(procurementUser) === true, "Procurement Officer CAN authorize fund disbursements");
assert(canAuthorizeProcurementDisbursement(adminUser) === true, "Admin CAN authorize fund disbursements");
assert(canAuthorizeProcurementDisbursement(govUser) === false, "Government Officer CANNOT disburse funds (Segregation of Duties)");
assert(canAuthorizeProcurementDisbursement(airSenseUser) === false, "Startup CANNOT disburse funds");

// Test Independent Validation Studio Access
const validatorUser = DEMO_USERS.find((u) => u.role === "VALIDATOR");
assert(canAccessValidationStudio(validatorUser) === true, "Validator CAN access audit studio");
assert(canAccessValidationStudio(govUser) === true, "Government Officer CAN review validator reports");
assert(canAccessValidationStudio(airSenseUser) === false, "Startup CANNOT access validator workspace to tamper with reports");

// 4. Secure Evidence Access Control Tests
console.log("\n--- 4. Testing Secure Evidence Access Control & Confidentiality ---");

function canAccessEvidence(user, evidence) {
  if (evidence.confidentialityLevel === "PUBLIC") return true;
  if (!user) return false;
  const role = normalizeRole(user.role);
  if (role === "ADMIN" || role === "GOVERNMENT_OFFICER" || role === "PROCUREMENT_OFFICER") return true;
  if (role === "VALIDATOR") {
    return evidence.confidentialityLevel !== "CONFIDENTIAL_GOV_ONLY";
  }
  if (role === "EXPERT") {
    return evidence.confidentialityLevel !== "CONFIDENTIAL_GOV_ONLY";
  }
  if (role === "STARTUP") {
    if (evidence.confidentialityLevel === "CONFIDENTIAL_GOV_ONLY") return false;
    if (evidence.confidentialityLevel === "PROPRIETARY_STARTUP") {
      return user.organizationId === evidence.uploaderOrgId;
    }
    return true;
  }
  return false;
}

const publicEvidence = { id: "evi-1", confidentialityLevel: "PUBLIC", uploaderOrgId: "org-airsense-001" };
const proprietaryEvidence = { id: "evi-2", confidentialityLevel: "PROPRIETARY_STARTUP", uploaderOrgId: "org-airsense-001" };
const govOnlyEvidence = { id: "evi-3", confidentialityLevel: "CONFIDENTIAL_GOV_ONLY", uploaderOrgId: "dept-urban-001" };

assert(canAccessEvidence(null, publicEvidence) === true, "Unauthenticated user CAN view PUBLIC evidence");
assert(canAccessEvidence(null, proprietaryEvidence) === false, "Unauthenticated user CANNOT view PROPRIETARY evidence");
assert(canAccessEvidence(null, govOnlyEvidence) === false, "Unauthenticated user CANNOT view CONFIDENTIAL_GOV_ONLY evidence");

assert(canAccessEvidence(airSenseUser, proprietaryEvidence) === true, "Owning startup CAN access own PROPRIETARY evidence");
assert(canAccessEvidence(competitorStartupUser, proprietaryEvidence) === false, "Competitor startup CANNOT access AirSense PROPRIETARY evidence");
assert(canAccessEvidence(govUser, proprietaryEvidence) === true, "Government Officer CAN access startup PROPRIETARY evidence for audit");
assert(canAccessEvidence(adminUser, proprietaryEvidence) === true, "Admin CAN access startup PROPRIETARY evidence");

assert(canAccessEvidence(govUser, govOnlyEvidence) === true, "Government Officer CAN access CONFIDENTIAL_GOV_ONLY evidence");
assert(canAccessEvidence(airSenseUser, govOnlyEvidence) === false, "Startup CANNOT access CONFIDENTIAL_GOV_ONLY evidence");
assert(canAccessEvidence(validatorUser, govOnlyEvidence) === false, "Validator CANNOT access CONFIDENTIAL_GOV_ONLY internal evidence");

// 5. Document & Contract Management RBAC Tests
console.log("\n--- 5. Testing Document & Contract Access Control ---");

function canAccessDocumentTest(user, doc) {
  if (doc.access === "Public" || doc.confidentialityLevel === "PUBLIC" || doc.isTemplate) return true;
  if (!user) return false;
  const role = normalizeRole(user.role);
  if (role === "ADMIN" || role === "GOVERNMENT_OFFICER") return true;
  if (role === "PROCUREMENT_OFFICER") return true;
  if (role === "VALIDATOR" || role === "EXPERT") {
    return doc.confidentialityLevel !== "CONFIDENTIAL_GOV_ONLY";
  }
  if (role === "STARTUP") {
    return doc.confidentialityLevel !== "CONFIDENTIAL_GOV_ONLY";
  }
  return false;
}

const templateDoc = { id: "TMPL-1", access: "Public", confidentialityLevel: "PUBLIC", isTemplate: true };
const executedPilotAgreement = { id: "DOC-AGR-01", access: "Restricted (Government & Startup)", confidentialityLevel: "RESTRICTED", isTemplate: false };
const confidentialProcurementDoc = { id: "DOC-PRO-01", access: "Procurement Clearance Required", confidentialityLevel: "CONFIDENTIAL_GOV_ONLY", isTemplate: false };

assert(canAccessDocumentTest(null, templateDoc) === true, "Unauthenticated user CAN view standard legal templates");
assert(canAccessDocumentTest(null, executedPilotAgreement) === false, "Unauthenticated user CANNOT view restricted executed pilot agreements");
assert(canAccessDocumentTest(airSenseUser, executedPilotAgreement) === true, "Participating startup CAN view executed pilot agreement");
assert(canAccessDocumentTest(govUser, executedPilotAgreement) === true, "Government Officer CAN view executed pilot agreement");
assert(canAccessDocumentTest(adminUser, executedPilotAgreement) === true, "Admin CAN view executed pilot agreement");
assert(canAccessDocumentTest(procurementUser, confidentialProcurementDoc) === true, "Procurement Officer CAN access procurement clearance documents");
assert(canAccessDocumentTest(govUser, confidentialProcurementDoc) === true, "Government Officer CAN access procurement clearance documents");
assert(canAccessDocumentTest(airSenseUser, confidentialProcurementDoc) === false, "Startup CANNOT access internal government procurement clearance documents");

console.log("\n======================================================================");
console.log(`Verification Complete: ${passedTests} / ${totalTests} assertions passed.`);
console.log("======================================================================");

if (passedTests === totalTests) {
  console.log("\nResult: All RBAC and security authorization checks PASSED with 100% compliance.\n");
} else {
  console.error("\nResult: FAILURES DETECTED.\n");
  process.exit(1);
}
