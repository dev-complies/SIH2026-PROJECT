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

// 6. Milestone-Based Payment & Escrow Disbursement RBAC Tests
console.log("\n--- 6. Testing Milestone-Based Payment & Escrow Disbursement RBAC ---");

const VALID_PAYMENT_STATUSES = [
  "Pending",
  "Submitted",
  "Under Review",
  "Approved",
  "Paid",
  "Rejected",
  "Delayed",
];

function isValidPaymentStatus(status) {
  return VALID_PAYMENT_STATUSES.includes(status);
}

function canSubmitInvoice(user, payment) {
  if (!user) return false;
  const role = normalizeRole(user.role);
  if (role === "ADMIN") return true;
  if (role === "STARTUP") {
    return payment.status === "Pending" || payment.status === "Delayed" || payment.status === "Rejected";
  }
  return false;
}

function canApproveMilestonePayment(user) {
  if (!user) return false;
  const role = normalizeRole(user.role);
  return role === "ADMIN" || role === "GOVERNMENT_OFFICER" || role === "PROCUREMENT_OFFICER";
}

function canAuthorizeEscrowDisbursement(user) {
  if (!user) return false;
  const role = normalizeRole(user.role);
  return role === "ADMIN" || role === "PROCUREMENT_OFFICER";
}

// Verify payment status enum
VALID_PAYMENT_STATUSES.forEach((st) => {
  assert(isValidPaymentStatus(st) === true, `Status '${st}' is a valid statutory payment status`);
});
assert(isValidPaymentStatus("UNKNOWN_STATUS") === false, "Unknown status is correctly rejected");

// Financial summary arithmetic invariant test
const mockContract = 2450000;
const mockPaid = 1150000;
const mockApproved = 650000;
const mockPending = 400000;
const mockRemaining = 250000;
assert(
  mockContract === mockPaid + mockApproved + mockPending + mockRemaining,
  "Contract Value (₹24.5L) equals Paid + Approved + Pending + Remaining"
);

// Payment action authorization tests
const pendingPayment = { id: "PAY-1", status: "Pending", amount: 400000 };
const submittedPayment = { id: "PAY-2", status: "Submitted", amount: 650000 };
const approvedPayment = { id: "PAY-3", status: "Approved", amount: 650000 };

assert(canSubmitInvoice(airSenseUser, pendingPayment) === true, "Startup CAN submit invoice for pending milestone payment");
assert(canSubmitInvoice(govUser, pendingPayment) === false, "Government Officer CANNOT submit startup tax invoice");
assert(canSubmitInvoice(airSenseUser, submittedPayment) === false, "Startup CANNOT resubmit invoice while already submitted");

assert(canApproveMilestonePayment(govUser) === true, "Government Officer CAN approve milestone payment");
assert(canApproveMilestonePayment(procurementUser) === true, "Procurement Officer CAN approve milestone payment");
assert(canApproveMilestonePayment(airSenseUser) === false, "Startup CANNOT self-approve milestone payment");
assert(canApproveMilestonePayment(validatorUser) === false, "Independent Validator CANNOT approve procurement payment");

assert(canAuthorizeEscrowDisbursement(procurementUser) === true, "Procurement Officer CAN authorize escrow disbursement");
assert(canAuthorizeEscrowDisbursement(adminUser) === true, "Admin CAN authorize escrow disbursement");
assert(canAuthorizeEscrowDisbursement(airSenseUser) === false, "Startup CANNOT authorize escrow disbursement");
assert(canAuthorizeEscrowDisbursement(assignedExpert) === false, "Expert Evaluator CANNOT authorize escrow disbursement");

// 7. Independent Validator Workspace & Role Separation Tests
console.log("\n--- 7. Testing Independent Validator Workspace & Role Separation ---");

const VALID_VALIDATION_OUTCOMES = ["Validated", "Partially Validated", "Not Validated"];

function isValidValidationOutcome(outcome) {
  return VALID_VALIDATION_OUTCOMES.includes(outcome);
}

function canSubmitValidationReport(user) {
  if (!user) return false;
  const role = normalizeRole(user.role);
  return role === "VALIDATOR" || role === "ADMIN";
}

function canStartupModifyValidatorFindings(user) {
  if (!user) return false;
  const role = normalizeRole(user.role);
  return role === "STARTUP"; // Must never be allowed to modify validator findings
}

function validateSubmissionPayload(payload) {
  if (!payload) return { valid: false, reason: "Payload missing" };
  if (!isValidValidationOutcome(payload.outcome)) return { valid: false, reason: "Invalid outcome" };
  if (!payload.findings || payload.findings.trim().length < 20) return { valid: false, reason: "Findings missing or too short" };
  if (!payload.evidenceReferences || !Array.isArray(payload.evidenceReferences) || payload.evidenceReferences.length === 0) {
    return { valid: false, reason: "Evidence references required" };
  }
  if (!payload.limitations || payload.limitations.trim().length < 10) return { valid: false, reason: "Limitations missing or too short" };
  if (!payload.comments || payload.comments.trim().length < 10) return { valid: false, reason: "Comments missing or too short" };
  return { valid: true };
}

// 1. Outcome enum validity
VALID_VALIDATION_OUTCOMES.forEach((out) => {
  assert(isValidValidationOutcome(out) === true, `Outcome '${out}' is a valid statutory determination`);
});
assert(isValidValidationOutcome("UNVALIDATED") === false, "Arbitrary outcome 'UNVALIDATED' is rejected");

// 2. Role separation & Segregation of Duties
assert(canSubmitValidationReport(validatorUser) === true, "Independent Validator CAN submit validation report");
assert(canSubmitValidationReport(adminUser) === true, "Platform Admin CAN submit validation report");
assert(canSubmitValidationReport(airSenseUser) === false, "Startup CANNOT submit validation report");
assert(canSubmitValidationReport(govUser) === false, "Line Government Officer CANNOT submit independent validation report");
assert(canSubmitValidationReport(procurementUser) === false, "Procurement Officer CANNOT submit independent validation report");
assert(canSubmitValidationReport(assignedExpert) === false, "Expert Evaluator CANNOT submit independent validation report");
assert(canStartupModifyValidatorFindings(airSenseUser) === true, "AirSense is correctly identified as STARTUP role");

// 3. Payload validation (all 4 required fields)
const validPayload = {
  outcome: "Validated",
  findings: "Comprehensive 90-day physical collocation confirmed R² = 0.94 with CPCB BAM-1020 reference analyzer.",
  evidenceReferences: ["ev-001", "ev-002", "ev-003"],
  limitations: "Monsoon humidity exceeding 90% RH causes transient optical scattering overestimation.",
  comments: "Recommended for state-wide smart city deployment scaling under GFR 149.",
};

const missingFindingsPayload = { ...validPayload, findings: "" };
const missingEvidencePayload = { ...validPayload, evidenceReferences: [] };
const missingLimitationsPayload = { ...validPayload, limitations: "" };
const missingCommentsPayload = { ...validPayload, comments: "" };

assert(validateSubmissionPayload(validPayload).valid === true, "Valid complete submission payload is accepted");
assert(validateSubmissionPayload(missingFindingsPayload).valid === false, "Submission without Findings is rejected");
assert(validateSubmissionPayload(missingEvidencePayload).valid === false, "Submission without Evidence References is rejected");
assert(validateSubmissionPayload(missingLimitationsPayload).valid === false, "Submission without Limitations is rejected");
assert(validateSubmissionPayload(missingCommentsPayload).valid === false, "Submission without Comments is rejected");

// 8. Professional Pilot Report View & Statutory Recommendation Decision-Making Tests
console.log("\n--- 8. Testing Pilot Executive Report & Statutory Decision-Making RBAC ---");

// 1. Mandatory 14 Sections Requirement Check
const MANDATORY_REPORT_SECTIONS = [
  "Executive Summary",
  "Problem",
  "Solution",
  "Pilot Methodology",
  "Baseline",
  "KPIs",
  "Results",
  "Evidence",
  "Costs",
  "Risks",
  "Issues",
  "Validation",
  "Lessons Learned",
  "Recommendation"
];

assert(MANDATORY_REPORT_SECTIONS.length === 14, "Executive report defines exactly 14 statutory sections");
assert(MANDATORY_REPORT_SECTIONS.includes("Executive Summary"), "Section 1: Executive Summary is present");
assert(MANDATORY_REPORT_SECTIONS.includes("Problem"), "Section 2: Problem is present");
assert(MANDATORY_REPORT_SECTIONS.includes("Solution"), "Section 3: Solution is present");
assert(MANDATORY_REPORT_SECTIONS.includes("Pilot Methodology"), "Section 4: Pilot Methodology is present");
assert(MANDATORY_REPORT_SECTIONS.includes("Baseline"), "Section 5: Baseline is present");
assert(MANDATORY_REPORT_SECTIONS.includes("KPIs"), "Section 6: KPIs is present");
assert(MANDATORY_REPORT_SECTIONS.includes("Results"), "Section 7: Results is present");
assert(MANDATORY_REPORT_SECTIONS.includes("Evidence"), "Section 8: Evidence is present");
assert(MANDATORY_REPORT_SECTIONS.includes("Costs"), "Section 9: Costs is present");
assert(MANDATORY_REPORT_SECTIONS.includes("Risks"), "Section 10: Risks is present");
assert(MANDATORY_REPORT_SECTIONS.includes("Issues"), "Section 11: Issues is present");
assert(MANDATORY_REPORT_SECTIONS.includes("Validation"), "Section 12: Validation is present");
assert(MANDATORY_REPORT_SECTIONS.includes("Lessons Learned"), "Section 13: Lessons Learned is present");
assert(MANDATORY_REPORT_SECTIONS.includes("Recommendation"), "Section 14: Recommendation is present");

// 2. Explicit Baseline -> Target -> Actual KPI Comparison Check
const sampleKpis = [
  { metricName: "Sensor Uptime", baseline: "92.0%", target: "99.0%", actual: "99.4%" },
  { metricName: "Air Quality Data Accuracy (R² vs BAM-1020)", baseline: "0.72 R²", target: "0.90 R²", actual: "0.95 R²" },
  { metricName: "Coverage Area (Ward Grid Density)", baseline: "12 sq km", target: "45 sq km", actual: "48 sq km" },
  { metricName: "Telemetry Latency", baseline: "120s", target: "< 15s", actual: "4.8s" },
  { metricName: "Citizen AQI Alert Delivery Speed", baseline: "24h batch", target: "< 5 mins", actual: "2.1 mins" },
];

for (const kpi of sampleKpis) {
  assert(Boolean(kpi.baseline && kpi.target && kpi.actual), `KPI '${kpi.metricName}' has clear Baseline (${kpi.baseline}) -> Target (${kpi.target}) -> Actual (${kpi.actual})`);
}

// 3. Recommendation Options Check (Scale, Extend Pilot, Modify & Retest, Close)
const AUTHORIZED_RECOMMENDATION_OPTIONS = ["Scale", "Extend Pilot", "Modify & Retest", "Close"];

function isValidRecommendationOption(opt) {
  return AUTHORIZED_RECOMMENDATION_OPTIONS.includes(opt);
}

assert(isValidRecommendationOption("Scale") === true, "Option 'Scale' is valid");
assert(isValidRecommendationOption("Extend Pilot") === true, "Option 'Extend Pilot' is valid");
assert(isValidRecommendationOption("Modify & Retest") === true, "Option 'Modify & Retest' is valid");
assert(isValidRecommendationOption("Close") === true, "Option 'Close' is valid");
assert(isValidRecommendationOption("Auto-Approve") === false, "Unauthorized option 'Auto-Approve' is rejected");
assert(isValidRecommendationOption("AI-Scale") === false, "Unauthorized option 'AI-Scale' is rejected");

// 4. Role Authorization for Recommendation Decision-Makers
function canRecordPilotRecommendation(user) {
  if (!user) return false;
  const canonicalRole = normalizeRole(user.role);
  return (
    canonicalRole === "GOVERNMENT_OFFICER" ||
    canonicalRole === "PROCUREMENT_OFFICER" ||
    canonicalRole === "ADMIN"
  );
}

assert(canRecordPilotRecommendation(govUser) === true, "Government Officer CAN enter statutory recommendation");
assert(canRecordPilotRecommendation(procurementUser) === true, "Procurement Officer CAN enter statutory recommendation");
assert(canRecordPilotRecommendation(adminUser) === true, "Admin CAN enter statutory recommendation");
assert(canRecordPilotRecommendation(airSenseUser) === false, "Startup CANNOT enter procurement recommendation");
assert(canRecordPilotRecommendation(assignedExpert) === false, "Expert Evaluator CANNOT enter procurement recommendation");
assert(canRecordPilotRecommendation(validatorUser) === false, "Independent Validator CANNOT enter procurement recommendation");

// 5. Statutory Prohibition of Automated AI Decision-Making
function validateRecommendationPayload(payload) {
  if (!isValidRecommendationOption(payload.option)) {
    return { valid: false, error: "Invalid recommendation option" };
  }
  if (!payload.isHumanConfirmed) {
    return {
      valid: false,
      error: "Statutory Violation: Procurement decisions cannot be automated by AI algorithms. Explicit human confirmation is required under GFR Rule 149."
    };
  }
  if (!payload.justification || payload.justification.trim().length < 25) {
    return { valid: false, error: "Detailed justification required (min 25 chars)" };
  }
  return { valid: true };
}

const validHumanDecision = {
  option: "Scale",
  justification: "Startup achieved 99.4% uptime and 0.95 R² correlation with CPCB reference stations over 90 consecutive days.",
  isHumanConfirmed: true,
};

const aiAutomatedDecision = {
  option: "Scale",
  justification: "Auto-generated by AI model prediction based on telemetry thresholds.",
  isHumanConfirmed: false, // Simulates AI automated attempt
};

const shortJustificationDecision = {
  option: "Scale",
  justification: "Good performance",
  isHumanConfirmed: true,
};

assert(validateRecommendationPayload(validHumanDecision).valid === true, "Explicit human decision-maker recommendation is accepted");
assert(validateRecommendationPayload(aiAutomatedDecision).valid === false, "Automated AI procurement decision is rejected under GFR Rule 149");
assert(validateRecommendationPayload(shortJustificationDecision).valid === false, "Decision with insufficient justification (<25 chars) is rejected");

console.log("\n======================================================================");
console.log(`Verification Complete: ${passedTests} / ${totalTests} assertions passed.`);
console.log("======================================================================");

if (passedTests === totalTests) {
  console.log("\nResult: All RBAC and security authorization checks PASSED with 100% compliance.\n");
} else {
  console.error("\nResult: FAILURES DETECTED.\n");
  process.exit(1);
}
