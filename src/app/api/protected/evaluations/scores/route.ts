import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { canAccessEvaluation } from "@/auth/permissions";

export async function GET(request: NextRequest) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return unauthorizedResponse();
  }

  // Simulated assignment record
  const assignment = {
    expertId: "user-expert-001",
    hasConflictOfInterest: false,
    isCompleted: true,
    challengeId: "chal-air-001",
  };

  if (!canAccessEvaluation(user, assignment)) {
    return forbiddenResponse(
      `Access Denied: Startups and unassigned evaluators are strictly barred from viewing confidential expert evaluation scorecards under blind evaluation rules.`
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      assignmentId: "assign-001",
      evaluator: user.role === "EXPERT" ? "You (Assigned Evaluator)" : "Dr. Alok Gupta (IIT Kanpur)",
      anonymizedCandidate: "Applicant #APP-2026-01",
      scores: [
        { criterion: "Technical Feasibility", weight: 25, score: 95 },
        { criterion: "Problem Fit", weight: 20, score: 92 },
        { criterion: "Innovation", weight: 15, score: 90 },
      ],
      totalWeightedScore: 92.5,
      coiStatus: "DECLARED_AND_CLEAR",
    },
    timestamp: new Date().toISOString(),
  });
}
