import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/auth/serverAuth";
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
      mockOfficer,
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

    const humanOfficerUser = user || mockOfficer;
    if (!humanOfficerUser) {
      return NextResponse.json(
        { success: false, error: "Authentication required for statutory risk adoption." },
        { status: 401 }
      );
    }

    if (action === "adopt") {
      const result = aiRiskEngine.adoptSuggestionIntoOfficialRegister({
        suggestionId,
        humanOfficerUser,
        mitigationAction,
        assignedOwner,
        customDueDate,
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
      const result = aiRiskEngine.dismissSuggestion({
        suggestionId,
        humanOfficerUser,
        dismissalReason: dismissalReason || "Dismissed by human officer review.",
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
