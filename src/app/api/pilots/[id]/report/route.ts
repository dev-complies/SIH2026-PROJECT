import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse } from "@/auth/serverAuth";
import { normalizeRole } from "@/auth/permissions";
import { pilotReportDb, RecommendationOption } from "@/database/pilotReportDatabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const report = pilotReportDb.getReport(id);

  return NextResponse.json({
    success: true,
    report,
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
      return unauthorizedResponse("Authentication required to enter statutory pilot recommendations.");
    }

    const canonicalRole = normalizeRole(user.role);

    // Rule: The recommendation must be explicitly entered by an authorized decision-maker.
    // Startups, experts, and independent validators CANNOT make government procurement recommendations.
    if (canonicalRole !== "GOVERNMENT_OFFICER" && canonicalRole !== "PROCUREMENT_OFFICER" && canonicalRole !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Only authorized Government Officers, Procurement Officers, or Platform Admins can record statutory pilot procurement recommendations.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { option, justification, targetScaleScope, authorizedBudgetInr, isHumanConfirmed } = body;

    // Rule: Do not automatically make procurement decisions with AI.
    if (!isHumanConfirmed) {
      return NextResponse.json(
        {
          success: false,
          error: "Statutory Violation: Procurement decisions cannot be automated by AI algorithms. Explicit human confirmation is required under GFR Rule 149.",
        },
        { status: 400 }
      );
    }

    const userName = `${user.firstName} ${user.lastName}`.trim();
    const userDesignation = user.designation || (canonicalRole === "PROCUREMENT_OFFICER" ? "Chief Procurement Officer" : "Joint Director, Urban Development");
    const userDept = "Directorate of Urban Development, Govt of UP";

    const result = pilotReportDb.recordRecommendation(
      id,
      {
        option: option as RecommendationOption,
        justification,
        targetScaleScope,
        authorizedBudgetInr,
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
      message: `Statutory recommendation '${option}' recorded successfully.`,
      report: result.report,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to record pilot recommendation." },
      { status: 500 }
    );
  }
}
