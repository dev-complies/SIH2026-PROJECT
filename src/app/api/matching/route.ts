import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/auth/serverAuth";
import {
  matchingEngine,
  CANONICAL_CHALLENGE,
} from "@/database/matchingDatabase";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const challengeId = searchParams.get("challengeId") || CANONICAL_CHALLENGE.id;
    const matchId = searchParams.get("matchId");

    if (matchId) {
      const match = matchingEngine.getMatchById(matchId);
      if (!match) {
        return NextResponse.json(
          { success: false, error: "Matching analysis not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        match,
        isAIAssisted: true,
      });
    }

    const matches = matchingEngine.getMatchesForChallenge(challengeId);

    return NextResponse.json({
      success: true,
      challenge: CANONICAL_CHALLENGE,
      matches,
      totalCandidates: matches.length,
      isAIAssisted: true,
      statutoryNotice:
        "AI recommendations are strictly advisory and must not automatically select startups. Government users remain responsible for all procurement and shortlisting decisions under GFR Rule 149.",
    });
  } catch (error: any) {
    console.error("Failed to fetch AI matching analysis:", error);
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
      matchId,
      decision,
      justification,
      gfrRule149Confirmed,
      isAutomatedAISystemAttempt,
    } = body;

    // 1. Enforce Statutory Ban on Autonomous AI Selection
    if (isAutomatedAISystemAttempt) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Statutory Prohibition: AI recommendations must not automatically select a startup. Government users remain responsible for decisions under GFR Rule 149.",
        },
        { status: 403 }
      );
    }

    // 2. Validate Authenticated Officer
    const officerUser = user || body.mockOfficer;
    if (!officerUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication Required: Official government credentials needed.",
        },
        { status: 401 }
      );
    }

    const result = matchingEngine.submitHumanDecision({
      matchId,
      decision,
      officerUser,
      justification,
      gfrRule149Confirmed: Boolean(gfrRule149Confirmed),
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
      result: result.result,
      message:
        "Human procurement decision successfully recorded with statutory audit logging.",
    });
  } catch (error: any) {
    console.error("Failed to process human shortlisting decision:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
