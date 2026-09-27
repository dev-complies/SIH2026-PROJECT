import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { normalizeRole } from "@/auth/permissions";
import { sanitizeString } from "@/lib/security";
import {
  queryRisks,
  queryIssues,
  insertRisk,
  insertIssue,
  RiskCategory,
  RiskStatus,
  IssueSeverity,
  IssueStatus,
} from "@/database/riskIssueDatabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get("type") || "both"; // "risk" | "issue" | "both"
  const pilotId = searchParams.get("pilotId") || undefined;
  const search = searchParams.get("search") || undefined;
  const owner = searchParams.get("owner") || undefined;
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || undefined;

  let risks: any[] = [];
  let issues: any[] = [];

  if (type === "risk" || type === "both") {
    const category = (searchParams.get("category") as RiskCategory | "ALL") || undefined;
    const status = (searchParams.get("status") as RiskStatus | "ALL") || undefined;
    const minScore = searchParams.get("minScore") ? Number(searchParams.get("minScore")) : undefined;
    const maxScore = searchParams.get("maxScore") ? Number(searchParams.get("maxScore")) : undefined;
    const sortBy = (searchParams.get("sortBy") as any) || "riskScore";

    risks = queryRisks({
      category,
      status,
      minScore,
      maxScore,
      owner,
      search,
      sortBy,
      sortOrder,
      pilotId,
    });
  }

  if (type === "issue" || type === "both") {
    const status = (searchParams.get("status") as IssueStatus | "ALL") || undefined;
    const severity = (searchParams.get("severity") as IssueSeverity | "ALL") || undefined;
    const sortBy = (searchParams.get("sortBy") as any) || "deadline";

    issues = queryIssues({
      status,
      severity,
      owner,
      search,
      sortBy,
      sortOrder,
      pilotId,
    });
  }

  return NextResponse.json({
    success: true,
    risks,
    issues,
    riskCount: risks.length,
    issueCount: issues.length,
    queriedAt: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse("Authentication required to register risks or issues.");
    }

    const role = normalizeRole(user.role);
    if (
      role !== "ADMIN" &&
      role !== "GOVERNMENT_OFFICER" &&
      role !== "STARTUP" &&
      role !== "VALIDATOR" &&
      role !== "PROCUREMENT_OFFICER"
    ) {
      return forbiddenResponse("Forbidden: You do not possess clearance to record risks or field issues.");
    }

    const body = await request.json();
    const { itemType } = body;
    const authorName = `${user.firstName} ${user.lastName}`.trim();

    if (itemType === "risk") {
      const {
        title,
        description,
        category,
        probability,
        impact,
        owner,
        mitigation,
        status,
        dueDate,
        pilotId,
      } = body;

      if (!title || !description || !category || !mitigation) {
        return NextResponse.json(
          { success: false, error: "Title, description, category, and mitigation strategy are required for risk registration." },
          { status: 400 }
        );
      }

      const probNum = Math.max(1, Math.min(5, Number(probability) || 3));
      const impactNum = Math.max(1, Math.min(5, Number(impact) || 3));

      const newRisk = insertRisk({
        title: sanitizeString(title, 200),
        description: sanitizeString(description, 2000),
        category: category as RiskCategory,
        probability: probNum,
        impact: impactNum,
        owner: owner ? sanitizeString(owner, 100) : authorName,
        mitigation: sanitizeString(mitigation, 2000),
        status: (status as RiskStatus) || "Identified",
        dueDate: dueDate ? sanitizeString(dueDate, 50) : "2026-09-30",
        pilotId: pilotId ? sanitizeString(pilotId, 50) : "PILOT-UP-UAQ-01",
      });

      return NextResponse.json({ success: true, risk: newRisk, message: "Risk registered successfully." });
    } else if (itemType === "issue") {
      const {
        title,
        description,
        severity,
        owner,
        deadline,
        status,
        resolution,
        relatedRiskId,
        pilotId,
      } = body;

      if (!title || !description || !severity) {
        return NextResponse.json(
          { success: false, error: "Title, description, and severity are required for field issue reporting." },
          { status: 400 }
        );
      }

      const newIssue = insertIssue({
        title: sanitizeString(title, 200),
        description: sanitizeString(description, 2000),
        severity: severity as IssueSeverity,
        owner: owner ? sanitizeString(owner, 100) : authorName,
        deadline: deadline ? sanitizeString(deadline, 50) : "2026-08-15",
        status: (status as IssueStatus) || "Open",
        resolution: resolution ? sanitizeString(resolution, 2000) : "",
        relatedRiskId: relatedRiskId ? sanitizeString(relatedRiskId, 50) : undefined,
        pilotId: pilotId ? sanitizeString(pilotId, 50) : "PILOT-UP-UAQ-01",
      });

      return NextResponse.json({ success: true, issue: newIssue, message: "Issue logged successfully." });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid itemType. Must be 'risk' or 'issue'." },
        { status: 400 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
