import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { normalizeRole } from "@/auth/permissions";
import { auditDb } from "@/database/auditDatabase";
import { notificationDb } from "@/database/notificationDatabase";
import { sanitizeString } from "@/lib/security";
import { DEMO_PILOT } from "@/database/demoDataset";

let pilotsStore = [{ ...DEMO_PILOT }];

export async function GET(request: NextRequest) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return unauthorizedResponse("Authentication required to view pilots.");
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const challengeId = searchParams.get("challengeId");

  let results = [...pilotsStore];
  if (status) {
    results = results.filter((p) => p.status === status);
  }
  if (challengeId) {
    results = results.filter((p) => p.challengeId === challengeId);
  }

  return NextResponse.json({ success: true, pilots: results });
}

export async function POST(request: NextRequest) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return unauthorizedResponse("Authentication required to create and start pilots.");
  }

  const role = normalizeRole(user.role);
  if (role !== "GOVERNMENT_OFFICER" && role !== "ADMIN") {
    return forbiddenResponse(
      `Access Denied: Role ${user.role} is not permitted to create official government pilots. Only Government Officers or Admins can issue pilot testbed orders under GFR Rule 149.`
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const {
      pilotId = "PILOT-UP-UAQ-01",
      pilotCode = "PILOT-UP-UAQ-2026-01",
      title = "Lucknow Urban Air Quality Pilot",
      challengeId = "chal-air-001",
      startupId = "org-airsense-001",
      totalBudget = 2200000,
      durationDays = 90,
      locationName = "Lucknow, Uttar Pradesh",
      scopeDescription = "Controlled municipal pilot deployment of 40 real-time ambient particulate and gas sensors across Lucknow Wards 14, 18, 22, and 29 for 90 days with continuous CPCB BAM-1020 collocation.",
    } = body;

    const officerName = `${user.firstName} ${user.lastName}`.trim();
    const officerDept = user.departmentId || "Directorate of Urban Development, Govt of UP";

    // 1. Record Cryptographic Audit Entry
    const auditEntry = auditDb.recordAction({
      user: {
        id: user.id,
        name: officerName,
        email: user.email,
        department: officerDept,
      },
      role: "GOVERNMENT_OFFICER",
      action: "Pilot Started",
      entity: "Pilot",
      entityId: pilotId,
      entityName: title,
      previousState: { status: "SCHEDULED", activeNodes: 0, fieldTelemetryActive: false },
      newState: {
        status: "ACTIVE",
        activeNodes: 12,
        fieldTelemetryActive: true,
        pilotPeriodDays: durationDays,
        contractValueInr: totalBudget,
        startDate: new Date().toISOString().split("T")[0],
      },
      statutoryRuleRef: "Uttar Pradesh State Testbed Regulatory Sandbox Order #UP-SBX-01",
    });

    // 2. Dispatch Notifications to Stakeholders
    notificationDb.dispatchNotification({
      type: "Milestone Due",
      title: "Pilot Officially Started: Lucknow Testbed",
      message: `Pilot '${title}' has officially started for a duration of ${durationDays} days. Milestone 1 baseline deployment is now active.`,
      category: "MILESTONE",
      severity: "INFO",
      recipientRoles: ["STARTUP", "GOVERNMENT_OFFICER", "PROCUREMENT_OFFICER", "ADMIN"],
      entityType: "Pilot",
      entityId: pilotId,
      actionUrl: `/gov/pilots/${pilotId}`,
      actionLabel: "Open Pilot Workspace",
    });

    const newPilot = {
      id: pilotId,
      challengeId,
      applicationId: "app-airsense-001",
      organizationId: startupId,
      departmentId: user.departmentId || "dept-urban-001",
      pilotCode,
      title: sanitizeString(title, 200),
      scopeDescription: sanitizeString(scopeDescription, 1000),
      locationName: sanitizeString(locationName, 100),
      latitude: 26.8467,
      longitude: 80.9462,
      totalBudget: Number(totalBudget),
      disbursedAmount: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + durationDays * 86400000).toISOString().split("T")[0],
      overallProgress: 0,
      riskLevel: "LOW" as const,
      status: "ACTIVE" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    pilotsStore.push(newPilot as any);

    return NextResponse.json({
      success: true,
      message: `Pilot '${title}' initialized and started in active state.`,
      data: {
        pilot: newPilot,
        auditLogSequence: auditEntry.sequenceNumber,
        auditHash: auditEntry.currentHash,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to create pilot." },
      { status: 500 }
    );
  }
}
