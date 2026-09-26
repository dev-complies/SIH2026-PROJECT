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

console.log("\n======================================================================");
console.log(`Verification Complete: ${passedTests} / ${totalTests} assertions passed.`);
console.log("======================================================================");

if (passedTests === totalTests) {
  console.log("\nResult: All RBAC and security authorization checks PASSED with 100% compliance.\n");
} else {
  console.error("\nResult: FAILURES DETECTED.\n");
  process.exit(1);
}
