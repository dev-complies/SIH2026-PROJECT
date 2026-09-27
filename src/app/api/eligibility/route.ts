import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { normalizeRole } from "@/auth/permissions";
import { auditDb } from "@/database/auditDatabase";
import { notificationDb } from "@/database/notificationDatabase";
import { sanitizeString } from "@/lib/security";
import { DEMO_ELIGIBILITY_REVIEW } from "@/database/demoDataset";

let eligibilityStore = [{ ...DEMO_ELIGIBILITY_REVIEW }];

export async function GET(request: NextRequest) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return unauthorizedResponse("Authentication required to view eligibility reviews.");
  }

  const { searchParams } = new URL(request.url);
  const applicationId = searchParams.get("applicationId");

  if (applicationId) {
    const record = eligibilityStore.find((e) => e.applicationId === applicationId);
    return NextResponse.json({ success: true, eligibilityReview: record || null });
  }

  return NextResponse.json({ success: true, eligibilityReviews: eligibilityStore });
}

export async function POST(request: NextRequest) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return unauthorizedResponse("Authentication required to review eligibility.");
  }

  const role = normalizeRole(user.role);
  if (role !== "GOVERNMENT_OFFICER" && role !== "ADMIN") {
    return forbiddenResponse(
      `Access Denied: Role ${user.role} is not authorized to approve or reject startup eligibility. Only Government Officers possess this authority under GFR Rule 149.`
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const {
      applicationId = "app-airsense-001",
      decision = "ELIGIBLE", // "ELIGIBLE" | "CONDITIONALLY_ELIGIBLE" | "INELIGIBLE"
      reason = "Satisfies all 7 statutory criteria under GFR 2017 Rule 149. DPIIT verified.",
      checklistResults = {},
      conditionsPrecedent,
      startupName = "AirSense Technologies Pvt Ltd",
    } = body;

    if ((decision === "INELIGIBLE" || decision === "CONDITIONALLY_ELIGIBLE") && (!reason || reason.trim().length < 10)) {
      return NextResponse.json(
        { success: false, error: "Validation Error: A documented statutory reason is required for rejection or conditional approval." },
        { status: 400 }
      );
    }

    const reviewerName = `${user.firstName} ${user.lastName}`.trim();
    const reviewerDept = user.departmentId || "Directorate of Urban Development, Govt of UP";

    // 1. Record cryptographic audit action
    const auditEntry = auditDb.recordAction({
      user: {
        id: user.id,
        name: reviewerName,
        email: user.email,
        department: reviewerDept,
      },
      role: "GOVERNMENT_OFFICER",
      action: "Eligibility Approved",
      entity: "Application",
      entityId: applicationId,
      entityName: `${startupName} — Proposal Eligibility Review`,
      previousState: { status: "SUBMITTED", eligibilityStatus: "UNDER_REVIEW", gfrExemptionChecked: false },
      newState: {
        status: "ELIGIBILITY_APPROVED",
        eligibilityStatus: decision === "ELIGIBLE" ? "VERIFIED_ELIGIBLE" : decision,
        gfrExemptionChecked: true,
        dpiitVerified: true,
        decisionReason: reason,
        approvedAt: new Date().toISOString(),
      },
      statutoryRuleRef: "GFR Rule 149(v) (Startup Turnover Exemption & Innovation Screening)",
    });

    // 2. Dispatch contextual notification to Expert Evaluators
    notificationDb.dispatchNotification({
      type: "Evaluation Assignment",
      title: "New Proposal Ready for Expert Scoring",
      message: `Proposal ${applicationId} (${startupName}) has passed statutory eligibility and is queued for independent double-blind scoring.`,
      category: "EVALUATION",
      severity: "HIGH",
      recipientRoles: ["EXPERT", "ADMIN"],
      entityType: "Application",
      entityId: applicationId,
      actionUrl: `/expert/evaluations?appId=${applicationId}`,
      actionLabel: "Commence Evaluation",
    });

    // 3. Dispatch notification to Startup
    notificationDb.dispatchNotification({
      type: "Application Deadline",
      title: "Eligibility Approved — Proceeding to Evaluation",
      message: `Your application ${applicationId} has been verified compliant under GFR Rule 149 and forwarded to the independent technical review committee.`,
      category: "CHALLENGE",
      severity: "INFO",
      recipientRoles: ["STARTUP"],
      entityType: "Application",
      entityId: applicationId,
      actionUrl: `/startup/dashboard?tab=applications`,
      actionLabel: "View Application Status",
    });

    const newReview = {
      id: `elig-${Date.now()}`,
      applicationId,
      reviewedBy: user.id,
      decision,
      reason: sanitizeString(reason, 1000),
      conditionsPrecedent: conditionsPrecedent ? sanitizeString(conditionsPrecedent, 500) : undefined,
      checklistResults: {
        dpiitRecognition: true,
        priorDeploymentExperience: true,
        positiveNetWorth: true,
        environmentalCertifications: true,
        sovereignDataHosting: true,
        noBoardConflictOfInterest: true,
        ...checklistResults,
      },
      reviewedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    eligibilityStore.push(newReview as any);

    return NextResponse.json({
      success: true,
      message: `Eligibility review completed with decision: '${decision}'`,
      data: {
        review: newReview,
        auditLogSequence: auditEntry.sequenceNumber,
        auditHash: auditEntry.currentHash,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to process eligibility review." },
      { status: 500 }
    );
  }
}
