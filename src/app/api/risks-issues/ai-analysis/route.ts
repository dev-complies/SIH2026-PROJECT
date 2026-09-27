import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { normalizeRole } from "@/auth/permissions";
import { sanitizeString } from "@/lib/security";
import {
  aiRiskEngine,
  MANDATORY_AI_RISK_CATEGORIES,
  AI_SUGGESTION_LABEL,
} from "@/database/aiRiskAnalysisDatabase";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") || "ALL";

    const suggestions = aiRiskEngine.getAllSuggestions(category);

    return NextResponse.json({
      success: true,
      label: AI_SUGGESTION_LABEL,
      categories: MANDATORY_AI_RISK_CATEGORIES,
      totalSuggestions: suggestions.length,
      suggestions,
      statutoryAdvisory:
        "AI recommendations are strictly advisory and must not automatically change risk status or make procurement decisions under GFR Rule 149. Government officers retain exclusive responsibility.",
    });
  } catch (error: any) {
    console.error("Failed to fetch AI risk suggestions:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    const body = await request.json();
    const {
      action, // "adopt" | "dismiss"
      suggestionId,
      mitigationAction,
      assignedOwner,
      customDueDate,
      dismissalReason,
      isAutomatedAISystemAttempt,
    } = body;

    // 1. Strictly Block Automated AI Status Mutation
    if (isAutomatedAISystemAttempt) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Statutory Prohibition: AI recommendations must not automatically change risk status or make procurement decisions under GFR Rule 149.",
        },
        { status: 403 }
      );
    }

    if (!user) {
      return unauthorizedResponse("Authentication required for statutory risk adoption.");
    }

    const role = normalizeRole(user.role);
    if (role !== "GOVERNMENT_OFFICER" && role !== "ADMIN") {
      return forbiddenResponse("Forbidden: Only authorized Government Officers or Platform Administrators can adopt AI risk suggestions.");
    }

    if (action === "adopt") {
      const sanitizedMitigation = mitigationAction ? sanitizeString(mitigationAction, 2000) : "";
      const sanitizedOwner = assignedOwner ? sanitizeString(assignedOwner, 100) : `${user.firstName} ${user.lastName}`;
      const sanitizedDueDate = customDueDate ? sanitizeString(customDueDate, 50) : undefined;

      const result = aiRiskEngine.adoptSuggestionIntoOfficialRegister({
        suggestionId: sanitizeString(suggestionId, 50),
        humanOfficerUser: user,
        mitigationAction: sanitizedMitigation,
        assignedOwner: sanitizedOwner,
        customDueDate: sanitizedDueDate,
        isAutomatedAISystemAttempt: Boolean(isAutomatedAISystemAttempt),
      });

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Risk officially adopted into statutory register by human officer.",
        suggestion: result.suggestion,
        officialRiskId: result.officialRiskId,
      });
    }

    if (action === "dismiss") {
      const sanitizedReason = dismissalReason ? sanitizeString(dismissalReason, 1000) : "Dismissed by human officer review.";

      const result = aiRiskEngine.dismissSuggestion({
        suggestionId: sanitizeString(suggestionId, 50),
        humanOfficerUser: user,
        dismissalReason: sanitizedReason,
        isAutomatedAISystemAttempt: Boolean(isAutomatedAISystemAttempt),
      });

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "AI suggestion dismissed with human review note.",
        suggestion: result.suggestion,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action specified." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Failed to process AI risk action:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
