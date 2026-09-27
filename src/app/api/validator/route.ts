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

    return NextResponse.json({
      success: true,
      message: `Validation successfully submitted with outcome: '${outcome}'`,
      record: result.record,
      submittedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process validation submission." },
      { status: 500 }
    );
  }
}
