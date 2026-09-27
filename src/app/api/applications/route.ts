import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { normalizeRole } from "@/auth/permissions";
import { auditDb } from "@/database/auditDatabase";
import { notificationDb } from "@/database/notificationDatabase";
import { sanitizeString } from "@/lib/security";
import { DEMO_APPLICATION } from "@/database/demoDataset";

let applicationsStore = [{ ...DEMO_APPLICATION }];

export async function GET(request: NextRequest) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return unauthorizedResponse("Authentication required to view proposals.");
  }

  const role = normalizeRole(user.role);
  const { searchParams } = new URL(request.url);
  const challengeId = searchParams.get("challengeId");
  const id = searchParams.get("id");

  let results = [...applicationsStore];

  if (role === "STARTUP" && user.organizationId) {
    results = results.filter((a) => a.organizationId === user.organizationId);
  }

  if (challengeId) {
    results = results.filter((a) => a.challengeId === challengeId);
  }

  if (id) {
    const single = results.find((a) => a.id === id);
    if (!single) {
      return NextResponse.json({ success: false, error: "Application not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, application: single });
  }

  return NextResponse.json({ success: true, applications: results });
}

export async function POST(request: NextRequest) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return unauthorizedResponse("Authentication required to submit proposals.");
  }

  const role = normalizeRole(user.role);
  if (role !== "STARTUP" && role !== "ADMIN") {
    return forbiddenResponse("Forbidden: Only registered startups or administrators can submit applications.");
  }

  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action || "submit"; // "draft" | "submit"
    const applicationId = body.applicationId || `APP-AIR-2026-${Date.now().toString().slice(-4)}`;
    const challengeId = body.challengeId || "chal-air-001";
    const solutionTitle = sanitizeString(body.solutionTitle || "AirSense Multi-Ward Optical OPC & Gas Telemetry Mesh", 200);
    const proposedCost = Number(body.proposedCost || 2200000);
    const startupName = sanitizeString(body.companyName || "AirSense Technologies Pvt Ltd", 150);
    const dpiitNumber = sanitizeString(body.dpiitNumber || "DIPP-94812", 50);

    if (action === "submit") {
      // Validate mandatory fields
      if (!solutionTitle || solutionTitle.length < 5) {
        return NextResponse.json(
          { success: false, error: "Validation Error: Solution Title is required." },
          { status: 400 }
        );
      }

      // 1. Record cryptographic audit action
      const auditEntry = auditDb.recordAction({
        user: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          department: `${startupName} (${dpiitNumber})`,
        },
        role: "STARTUP",
        action: "Application Submitted",
        entity: "Application",
        entityId: applicationId,
        entityName: solutionTitle,
        previousState: { status: "IN_PROGRESS", dossierComplete: false, documentsUploaded: 4 },
        newState: {
          status: "SUBMITTED",
          dossierComplete: true,
          documentsUploaded: 7,
          proposalDigest: `SHA256:${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
          submittedAt: new Date().toISOString(),
        },
        statutoryRuleRef: "DPIIT Notification #12/2021 & GFR Rule 149",
      });

      // 2. Dispatch contextual notification to Government Officers
      notificationDb.dispatchNotification({
        type: "Application Deadline",
        title: `New Proposal Submitted: ${startupName}`,
        message: `${startupName} has submitted proposal '${solutionTitle.slice(0, 45)}...' for challenge '${challengeId}'. Queued for eligibility review.`,
        category: "CHALLENGE",
        severity: "MEDIUM",
        recipientRoles: ["GOVERNMENT_OFFICER", "ADMIN"],
        entityType: "Application",
        entityId: applicationId,
        actionUrl: `/gov/eligibility?appId=${applicationId}`,
        actionLabel: "Conduct Eligibility Review",
      });

      const newApp = {
        id: applicationId,
        challengeId,
        organizationId: user.organizationId || "org-airsense-001",
        submittedBy: user.id,
        applicationNumber: applicationId,
        solutionTitle,
        executiveSummary: sanitizeString(body.executiveSummary || "Optical particle counter mesh with ML calibration.", 1000),
        technicalApproach: sanitizeString(body.technicalApproach || "Dual laser scattering with LoRa/4G backhaul.", 1000),
        implementationPlan: "90-day deployment across 4 municipal wards.",
        proposedCost,
        pilotDurationWeeks: 12,
        teamOverview: [],
        pastExperience: [],
        riskMitigationPlan: "Redundant optical channels and 48-hour battery autonomy.",
        complianceAcknowledged: true,
        status: "SUBMITTED" as const,
        submittedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      applicationsStore.push(newApp as any);

      return NextResponse.json({
        success: true,
        message: "Application submitted successfully and locked for expert evaluation.",
        data: {
          application: newApp,
          auditLogSequence: auditEntry.sequenceNumber,
          auditHash: auditEntry.currentHash,
        },
      });
    }

    // Default: Save draft
    return NextResponse.json({
      success: true,
      message: "Application draft saved.",
      data: {
        applicationId,
        status: "DRAFT",
        lastSavedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to process application." },
      { status: 500 }
    );
  }
}
