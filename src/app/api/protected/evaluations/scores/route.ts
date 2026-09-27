import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { canAccessEvaluation, normalizeRole } from "@/auth/permissions";
import { auditDb } from "@/database/auditDatabase";
import { notificationDb } from "@/database/notificationDatabase";
import { sanitizeString } from "@/lib/security";

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

export async function POST(request: NextRequest) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return unauthorizedResponse("Authentication required to submit technical evaluations.");
  }

  const role = normalizeRole(user.role);
  if (role !== "EXPERT" && role !== "ADMIN") {
    return forbiddenResponse(
      `Access Denied: Role ${user.role} is not permitted to submit expert evaluations. Blind evaluation rules strictly limit scoring to empaneled independent technical specialists.`
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const {
      assignmentId = "assign-001",
      applicationId = "app-airsense-001",
      candidateCode = "CAND-AIR-01",
      coiDeclared = true,
      hasConflictOfInterest = false,
      criteria = [
        { name: "Technical Feasibility", weight: 25, score: 95 },
        { name: "Problem Fit", weight: 20, score: 92 },
        { name: "Innovation", weight: 15, score: 94 },
        { name: "Scalability", weight: 15, score: 90 },
        { name: "Cost Effectiveness", weight: 15, score: 88 },
        { name: "Security & Compliance", weight: 10, score: 95 },
      ],
      recommendation = "STRONGLY_RECOMMEND",
      overallRemarks = "The applicant exhibits exceptional technical rigor. Dual laser scattering provides high confidence for municipal field reliability.",
    } = body;

    // 1. Conflict of Interest Enforcement
    if (!coiDeclared) {
      return NextResponse.json(
        {
          success: false,
          error: "Statutory Violation: Conflict of interest declaration is mandatory prior to submitting evaluation scores under CVC guidelines.",
        },
        { status: 400 }
      );
    }

    if (hasConflictOfInterest) {
      return NextResponse.json(
        {
          success: false,
          error: "Conflict of Interest Recusal: Evaluators with personal, financial, or consulting conflicts are legally prohibited from evaluating this proposal.",
        },
        { status: 403 }
      );
    }

    // 2. Validate Criteria Weights Sum to 100
    const totalWeight = criteria.reduce((sum: number, c: any) => sum + (Number(c.weight) || 0), 0);
    if (totalWeight !== 100) {
      return NextResponse.json(
        {
          success: false,
          error: `Validation Error: Rubric weights must total exactly 100% (currently ${totalWeight}%).`,
        },
        { status: 400 }
      );
    }

    // 3. Compute Composite Weighted Score
    const totalWeightedScore = Number(
      (
        criteria.reduce((sum: number, c: any) => sum + (Number(c.score) || 0) * (Number(c.weight) || 0), 0) / 100
      ).toFixed(2)
    );

    const evaluatorName = `${user.firstName} ${user.lastName}`.trim();
    const evaluatorInst = user.departmentId || "IIT Kanpur Environmental Engineering";

    // 4. Record Cryptographic Audit Entry
    const auditEntry = auditDb.recordAction({
      user: {
        id: user.id,
        name: evaluatorName,
        email: user.email,
        department: evaluatorInst,
      },
      role: "EXPERT",
      action: "Evaluation Submitted",
      entity: "Application",
      entityId: applicationId,
      entityName: `Independent Technical Peer Evaluation (${candidateCode})`,
      previousState: { status: "ASSIGNED", scoreTotal: 0, conflictOfInterestCleared: true },
      newState: {
        status: "EVALUATION_COMPLETED",
        scoreTotal: totalWeightedScore,
        recommendation,
        evaluator: evaluatorName,
        institution: evaluatorInst,
        submittedAt: new Date().toISOString(),
      },
      statutoryRuleRef: "State Peer Evaluation Guidelines Sec 4(b) & CVC Directives",
    });

    // 5. Dispatch Notification to Government Officer
    notificationDb.dispatchNotification({
      type: "Evaluation Pending",
      title: "Expert Evaluation Completed",
      message: `${evaluatorName} (${evaluatorInst}) has submitted official technical evaluation for candidate ${candidateCode}. Weighted score: ${totalWeightedScore}/100.`,
      category: "EVALUATION",
      severity: "MEDIUM",
      recipientRoles: ["GOVERNMENT_OFFICER", "ADMIN"],
      entityType: "Application",
      entityId: applicationId,
      actionUrl: `/gov/shortlisting?candidate=${candidateCode}`,
      actionLabel: "View Consensus Scores",
    });

    return NextResponse.json({
      success: true,
      message: "Expert evaluation submitted and cryptographically sealed under blind review protocols.",
      data: {
        assignmentId,
        applicationId,
        candidateCode,
        evaluator: evaluatorName,
        totalWeightedScore,
        recommendation,
        coiStatus: "DECLARED_AND_CLEAR",
        auditLogSequence: auditEntry.sequenceNumber,
        auditHash: auditEntry.currentHash,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to submit evaluation." },
      { status: 500 }
    );
  }
}
