import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { normalizeRole } from "@/auth/permissions";
import { auditDb } from "@/database/auditDatabase";
import { notificationDb } from "@/database/notificationDatabase";
import { sanitizeString } from "@/lib/security";
import { DEMO_SHORTLIST } from "@/database/demoDataset";

let shortlistStore = [{ ...DEMO_SHORTLIST }];

export async function GET(request: NextRequest) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return unauthorizedResponse("Authentication required to view shortlists.");
  }

  return NextResponse.json({ success: true, shortlists: shortlistStore });
}

export async function POST(request: NextRequest) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return unauthorizedResponse("Authentication required to make shortlisting determinations.");
  }

  const role = normalizeRole(user.role);
  if (role !== "GOVERNMENT_OFFICER" && role !== "ADMIN") {
    return forbiddenResponse(
      `Access Denied: Role ${user.role} is not permitted to make official procurement shortlisting decisions. Under GFR Rule 149, only designated Government Officers possess this authority.`
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const {
      candidateId = "STR-AIR-94812",
      startupName = "AirSense Technologies Pvt Ltd",
      challengeId = "chal-air-001",
      action = "SHORTLISTED", // "SHORTLISTED" | "MOVED_TO_PILOT_DESIGN" | "REJECTED"
      justification = "Consensus technical score of 91.67/100 from IIT Kanpur, CSIR-NEERI, and IISc. Satisfies all ward deployment criteria.",
      sanctionedBudgetInr = 2200000,
      allocatedWards = ["Ward 14", "Ward 18", "Ward 22", "Ward 29"],
    } = body;

    if (!justification || justification.trim().length < 15) {
      return NextResponse.json(
        { success: false, error: "Validation Error: A detailed statutory justification is required (minimum 15 characters)." },
        { status: 400 }
      );
    }

    const officerName = `${user.firstName} ${user.lastName}`.trim();
    const officerDept = user.departmentId || "Directorate of Urban Development, Govt of UP";

    // 1. Record Cryptographic Audit Action
    const auditEntry = auditDb.recordAction({
      user: {
        id: user.id,
        name: officerName,
        email: user.email,
        department: officerDept,
      },
      role: "GOVERNMENT_OFFICER",
      action: "Startup Shortlisted",
      entity: "Startup",
      entityId: candidateId,
      entityName: startupName,
      previousState: { selectionRank: "CONTENDER", pilotAllocationStatus: "UNALLOCATED" },
      newState: {
        selectionRank: "RANK_1_SELECTED",
        pilotAllocationStatus: "SANCTIONED_TESTBED",
        action,
        allocatedWards,
        sanctionedPilotBudgetInr: sanctionedBudgetInr,
        justification: sanitizeString(justification, 500),
        decidedAt: new Date().toISOString(),
      },
      statutoryRuleRef: "GFR Rule 144 (Transparency & Justification in Procurement)",
    });

    // 2. Dispatch Notification to Startup
    notificationDb.dispatchNotification({
      type: "Application Deadline",
      title: "Proposal Shortlisted for Pilot Sanction!",
      message: `AirSense Technologies has been officially shortlisted for challenge '${challengeId}' following unanimous expert consensus. Sanctioned testbed design is now initiated.`,
      category: "CHALLENGE",
      severity: "HIGH",
      recipientRoles: ["STARTUP"],
      entityType: "Startup",
      entityId: candidateId,
      actionUrl: `/startup/dashboard?tab=pilots`,
      actionLabel: "View Pilot Sanction",
    });

    const newShortlistRecord = {
      id: `sl-${Date.now()}`,
      challengeId,
      candidateId,
      candidateName: startupName,
      action,
      justification: sanitizeString(justification, 1000),
      sanctionedBudgetInr,
      awardedBy: user.id,
      sanctionedDate: new Date().toISOString(),
    };

    shortlistStore.push(newShortlistRecord as any);

    return NextResponse.json({
      success: true,
      message: `Startup ${startupName} shortlisted successfully with action '${action}'.`,
      data: {
        shortlist: newShortlistRecord,
        auditLogSequence: auditEntry.sequenceNumber,
        auditHash: auditEntry.currentHash,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to record shortlisting decision." },
      { status: 500 }
    );
  }
}
