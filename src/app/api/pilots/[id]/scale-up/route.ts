import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse } from "@/auth/serverAuth";
import { normalizeRole } from "@/auth/permissions";
import { scaleUpDb, ScaleUpDecisionAction } from "@/database/scaleUpDatabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dossier = scaleUpDb.getDossier(id);

  return NextResponse.json({
    success: true,
    dossier,
    queriedAt: new Date().toISOString(),
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = getAuthenticatedUser(request);

    if (!user) {
      return unauthorizedResponse("Authentication required to execute statutory scale-up decisions.");
    }

    const canonicalRole = normalizeRole(user.role);

    // Rule: Only authorized government decision-makers can trigger scale-up actions
    if (
      canonicalRole !== "GOVERNMENT_OFFICER" &&
      canonicalRole !== "PROCUREMENT_OFFICER" &&
      canonicalRole !== "ADMIN"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Only authorized Government Officers, Procurement Officers, or Platform Admins can record statutory scale-up actions.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      action,
      justification,
      sanctionedBudgetInr,
      targetGeographyScope,
      secondaryPilotConditions,
      modificationRequirements,
      isHumanConfirmed,
    } = body;

    // Rule: AI Automated decisions prohibited under GFR 149
    if (!isHumanConfirmed) {
      return NextResponse.json(
        {
          success: false,
          error: "Statutory Violation: Scale-up decisions cannot be automated by AI algorithms. Explicit human confirmation is required under GFR Rule 149.",
        },
        { status: 400 }
      );
    }

    const userName = `${user.firstName} ${user.lastName}`.trim();
    const userDesignation =
      user.designation ||
      (canonicalRole === "PROCUREMENT_OFFICER"
        ? "Chief Procurement Officer"
        : "Joint Director, Urban Development");
    const userDept = "Directorate of Urban Development, Govt of UP";

    const result = scaleUpDb.recordDecision(
      id,
      action as ScaleUpDecisionAction,
      {
        justification,
        sanctionedBudgetInr,
        targetGeographyScope,
        secondaryPilotConditions,
        modificationRequirements,
        isHumanConfirmed,
      },
      {
        name: userName,
        role: user.role,
        designation: userDesignation,
        department: userDept,
      }
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Scale-up action '${action}' recorded successfully. Lifecycle updated.`,
      dossier: result.dossier,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process scale-up decision." },
      { status: 500 }
    );
  }
}
