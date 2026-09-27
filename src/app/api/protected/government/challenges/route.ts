import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { canAccessGovernmentInternalData } from "@/auth/permissions";
import { auditDb } from "@/database/auditDatabase";
import { notificationDb } from "@/database/notificationDatabase";
import { sanitizeString } from "@/lib/security";

export async function POST(request: NextRequest) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return unauthorizedResponse("Authentication required to manage challenge specifications.");
  }

  // Only GOVERNMENT_OFFICER and ADMIN can create internal challenge drafts or publish
  if (!canAccessGovernmentInternalData(user)) {
    return forbiddenResponse(
      `Access Denied: Role ${user.role} is not permitted to create or modify internal government challenge specifications.`
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action || "draft"; // "draft" | "publish"
    const challengeId = body.challengeId || `CHAL-UP-UAQ-${Date.now()}`;
    const title = sanitizeString(body.title || "Urban Air Quality Hyperlocal Monitoring & Intervention Mesh", 200);
    const department = sanitizeString(body.department || "Department of Urban Development", 100);
    const category = sanitizeString(body.category || "CleanTech & Environmental IoT", 100);
    const budget = Number(body.budgetInr || 2500000);

    const officerName = `${user.firstName} ${user.lastName}`.trim();
    const officerDept = user.departmentId || "Directorate of Urban Development, Govt of UP";

    if (action === "publish") {
      // Validate mandatory fields for publication
      if (!title || title.length < 10) {
        return NextResponse.json(
          { success: false, error: "Validation Error: Challenge Title must be at least 10 characters." },
          { status: 400 }
        );
      }

      // 1. Record cryptographic audit action
      const auditEntry = auditDb.recordAction({
        user: {
          id: user.id,
          name: officerName,
          email: user.email,
          department: officerDept,
        },
        role: user.role,
        action: "Challenge Published",
        entity: "Challenge",
        entityId: challengeId,
        entityName: title,
        previousState: { status: "DRAFT", isPublished: false, allocatedBudgetInr: budget },
        newState: {
          status: "PUBLISHED",
          isPublished: true,
          publishedAt: new Date().toISOString(),
          allocatedBudgetInr: budget,
          applicationsWindowDays: 30,
        },
        statutoryRuleRef: "GFR Rule 144 (Public Notice Mandate)",
      });

      // 2. Dispatch contextual notification to Startups
      notificationDb.dispatchNotification({
        type: "Application Deadline",
        title: `New Challenge Published: ${title.slice(0, 50)}...`,
        message: `Department of Urban Development published challenge '${title}'. Window closes in 30 days under GFR 144.`,
        category: "CHALLENGE",
        severity: "HIGH",
        recipientRoles: ["STARTUP", "GOVERNMENT_OFFICER", "ADMIN"],
        entityType: "Challenge",
        entityId: challengeId,
        actionUrl: `/challenges/${challengeId}`,
        actionLabel: "View Challenge Statement",
      });

      return NextResponse.json({
        success: true,
        message: "Challenge published officially in compliance with GFR Rule 144.",
        data: {
          challengeId,
          title,
          department,
          category,
          status: "PUBLISHED",
          officer: user.email,
          publishedAt: new Date().toISOString(),
          auditLogSequence: auditEntry.sequenceNumber,
          auditHash: auditEntry.currentHash,
        },
      });
    }

    // Default: Save Draft
    return NextResponse.json({
      success: true,
      message: "Challenge draft saved successfully.",
      data: {
        challengeId,
        title,
        department,
        category,
        status: "DRAFT",
        officer: user.email,
        departmentId: officerDept,
        lastSavedAt: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to process challenge action." },
      { status: 500 }
    );
  }
}
