import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse } from "@/auth/serverAuth";
import { normalizeRole } from "@/auth/permissions";
import { validatorDb } from "@/database/validatorDatabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pilotId = searchParams.get("pilotId") || "PILOT-UP-UAQ-01";

  const record = validatorDb.getValidationRecord(pilotId);

  if (!record) {
    return NextResponse.json(
      { success: false, error: `Validation record for pilot ${pilotId} not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    validationRecord: record,
    checklist: record.checklist,
    auditLog: record.auditLog,
    queriedAt: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse("Authentication required to submit validation determinations.");
    }

    const role = normalizeRole(user.role);

    // Rule: The validator must be a separate role. Do not allow the startup to modify validator findings.
    if (role === "STARTUP") {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Startups are strictly prohibited from submitting or modifying independent validator findings.",
        },
        { status: 403 }
      );
    }

    if (role !== "VALIDATOR" && role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Only independent validators or platform admins can submit statutory validation reports.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { pilotId = "PILOT-UP-UAQ-01", outcome, findings, evidenceReferences, limitations, comments, checklistUpdates } = body;

    const actorName = `${user.firstName} ${user.lastName}`.trim() || "Priya Nair";
    const actorOrg = user.organizationId ? "The Energy and Resources Institute (TERI)" : "TERI Independent Testing Lab";

    const result = validatorDb.submitValidationReport(
      pilotId,
      {
        outcome,
        findings,
        evidenceReferences,
        limitations,
        comments,
        checklistUpdates,
      },
      actorName,
      user.role,
      actorOrg
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // 1. Record in Statutory Cryptographic Audit Ledger
    const { auditDb } = await import("@/database/auditDatabase");
    const { notificationDb } = await import("@/database/notificationDatabase");

    const auditEntry = auditDb.recordAction({
      user: { id: user.id, name: actorName, email: user.email, department: actorOrg },
      role: "VALIDATOR",
      action: "Validation Submitted",
      entity: "ValidationReport",
      entityId: result.record?.id || "VAL-TERI-2026-01",
      entityName: `Independent Collocation Audit (${pilotId})`,
      previousState: { status: "AUDIT_IN_PROGRESS", validationVerdict: "PENDING" },
      newState: {
        status: "VALIDATED",
        outcome,
        findings,
        evidenceReferences,
        digitalSignatureDigest: result.record?.digitalSignatureDigest,
        submittedAt: new Date().toISOString(),
      },
      statutoryRuleRef: "CPCB Guidelines for Low-Cost Ambient Air Quality Sensors & Section 14",
    });

    // 2. Dispatch Contextual Notification to Government Officers
    notificationDb.dispatchNotification({
      type: "Validation Required",
      title: "Independent Validation Completed",
      message: `${actorName} (${actorOrg}) has submitted the official validation determination for pilot ${pilotId}. Certified as '${outcome}'. Ready for Scale-Up review.`,
      category: "VALIDATION",
      severity: "HIGH",
      recipientRoles: ["GOVERNMENT_OFFICER", "ADMIN"],
      entityType: "ValidationReport",
      entityId: result.record?.id || "VAL-TERI-2026-01",
      actionUrl: `/gov/pilots/${pilotId}/scale-up`,
      actionLabel: "Review Scale-Up Dossier",
    });

    return NextResponse.json({
      success: true,
      message: `Validation successfully submitted with outcome: '${outcome}'`,
      record: result.record,
      auditLogSequence: auditEntry.sequenceNumber,
      auditHash: auditEntry.currentHash,
      submittedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process validation submission." },
      { status: 500 }
    );
  }
}
