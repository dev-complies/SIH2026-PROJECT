import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { normalizeRole } from "@/auth/permissions";
import { auditDb } from "@/database/auditDatabase";
import { notificationDb } from "@/database/notificationDatabase";
import { sanitizeString } from "@/lib/security";
import { DEMO_MILESTONES } from "@/database/demoDataset";

let milestonesStore = [...DEMO_MILESTONES];

export async function GET(request: NextRequest) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return unauthorizedResponse("Authentication required to view milestones.");
  }

  const { searchParams } = new URL(request.url);
  const pilotId = searchParams.get("pilotId");

  let results = [...milestonesStore];
  if (pilotId) {
    results = results.filter((m) => m.pilotId === pilotId);
  }

  return NextResponse.json({ success: true, milestones: results });
}

export async function POST(request: NextRequest) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return unauthorizedResponse("Authentication required to manage milestones.");
  }

  const role = normalizeRole(user.role);

  try {
    const body = await request.json().catch(() => ({}));
    const {
      action = "approve", // "submit_evidence" | "approve" | "reject"
      milestoneId = "m-2",
      pilotId = "pilot-air-001",
      milestoneName = "Milestone 2: 12-Node Deployment & Reference Collocation",
      evidenceTitle = "Collocated_BAM1020_Regression_Dataset.csv",
      paymentAmount = 800000,
      reason,
    } = body;

    const actorName = `${user.firstName} ${user.lastName}`.trim();
    const actorDept = user.departmentId || "Government Agency";

    // ----------------------------------------------------
    // Action 1: Startup Submits Evidence (Step 7)
    // ----------------------------------------------------
    if (action === "submit_evidence") {
      if (role !== "STARTUP" && role !== "ADMIN") {
        return forbiddenResponse("Forbidden: Only startups can submit milestone evidence deliverables.");
      }

      const auditEntry = auditDb.recordAction({
        user: { id: user.id, name: actorName, email: user.email, department: actorDept },
        role: "STARTUP",
        action: "Evidence Uploaded",
        entity: "Evidence",
        entityId: `ev-${Date.now()}`,
        entityName: evidenceTitle,
        previousState: { milestoneStatus: "IN_PROGRESS", evidenceAttached: false },
        newState: {
          milestoneStatus: "UNDER_REVIEW",
          evidenceAttached: true,
          evidenceTitle,
          uploadedAt: new Date().toISOString(),
        },
        statutoryRuleRef: "GFR Rule 149 (Milestone Deliverable Submission)",
      });

      notificationDb.dispatchNotification({
        type: "Milestone Due",
        title: `Milestone Evidence Submitted: ${milestoneName}`,
        message: `${actorName} has submitted empirical evidence '${evidenceTitle}' for milestone '${milestoneName}'. Inspection required.`,
        category: "MILESTONE",
        severity: "HIGH",
        recipientRoles: ["GOVERNMENT_OFFICER", "ADMIN"],
        entityType: "Milestone",
        entityId: milestoneId,
        actionUrl: `/gov/pilots/${pilotId}?tab=milestones`,
        actionLabel: "Review & Sign Off",
      });

      // Update in-memory milestone status
      const item = milestonesStore.find((m) => m.id === milestoneId);
      if (item) item.status = "SUBMITTED";

      return NextResponse.json({
        success: true,
        message: `Milestone evidence '${evidenceTitle}' submitted and queued for government review.`,
        data: {
          milestoneId,
          status: "UNDER_REVIEW",
          auditLogSequence: auditEntry.sequenceNumber,
          auditHash: auditEntry.currentHash,
        },
      });
    }

    // ----------------------------------------------------
    // Action 2: Government Approves Milestone & Releases Payment (Step 8)
    // ----------------------------------------------------
    if (action === "approve") {
      if (role !== "GOVERNMENT_OFFICER" && role !== "ADMIN") {
        return forbiddenResponse(
          `Access Denied: Role ${user.role} cannot approve milestone deliverables. Milestone sign-offs and fund releases are restricted to Government Officers under GFR Rule 149.`
        );
      }

      // 1. Record Milestone Approval Audit Entry
      const auditEntryMilestone = auditDb.recordAction({
        user: { id: user.id, name: actorName, email: user.email, department: actorDept },
        role: "GOVERNMENT_OFFICER",
        action: "Milestone Approved",
        entity: "Milestone",
        entityId: milestoneId,
        entityName: milestoneName,
        previousState: { status: "SUBMITTED", reviewStatus: "UNDER_INSPECTION", deliverableVerified: false },
        newState: {
          status: "APPROVED",
          reviewStatus: "OFFICER_SIGN_OFF",
          deliverableVerified: true,
          collocationR2Achieved: 0.94,
          approvedDisbursementInr: paymentAmount,
          approvedAt: new Date().toISOString(),
        },
        statutoryRuleRef: "GFR Rule 149 (Milestone Completion Sanction)",
      });

      // 2. Record Payment Approved Audit Entry
      const auditEntryPayment = auditDb.recordAction({
        user: { id: user.id, name: actorName, email: user.email, department: actorDept },
        role: "PROCUREMENT_OFFICER",
        action: "Payment Approved",
        entity: "Payment",
        entityId: `PAY-${milestoneId}-${Date.now().toString().slice(-4)}`,
        entityName: `Treasury Disbursement for ${milestoneName}`,
        previousState: { status: "APPROVED_PENDING_DISBURSEMENT", treasuryToken: null, fundsReleased: false },
        newState: {
          status: "PAID",
          treasuryToken: `TRZ-UP-${Date.now().toString().slice(-5)}`,
          fundsReleased: true,
          amountDisbursedInr: paymentAmount,
          clearedViaBank: "State Bank of India (State Treasury Account)",
          utrNumber: `SBIN${Date.now()}`,
        },
        statutoryRuleRef: "State Financial Handbook Vol 5 (Prompt Payment Mandate)",
      });

      // 3. Dispatch Contextual Notification to Startup
      notificationDb.dispatchNotification({
        type: "Payment Pending",
        title: `Milestone Approved & Payment Released: ₹${Number(paymentAmount).toLocaleString("en-IN")}`,
        message: `${milestoneName} has been approved by ${actorName}. Milestone tranche of ₹${Number(paymentAmount).toLocaleString("en-IN")} has been released to escrow.`,
        category: "PAYMENT",
        severity: "INFO",
        recipientRoles: ["STARTUP", "PROCUREMENT_OFFICER", "ADMIN"],
        entityType: "Milestone",
        entityId: milestoneId,
        actionUrl: `/payments`,
        actionLabel: "View Payment Ledger",
      });

      // Update in-memory milestone status
      const item = milestonesStore.find((m) => m.id === milestoneId);
      if (item) {
        item.status = "APPROVED";
        item.approvedAt = new Date().toISOString();
        item.approvedBy = user.id;
      }

      return NextResponse.json({
        success: true,
        message: `Milestone '${milestoneName}' approved. Payment tranche of ₹${Number(paymentAmount).toLocaleString("en-IN")} released.`,
        data: {
          milestoneId,
          status: "APPROVED",
          milestoneAuditSequence: auditEntryMilestone.sequenceNumber,
          paymentAuditSequence: auditEntryPayment.sequenceNumber,
          milestoneAuditHash: auditEntryMilestone.currentHash,
          paymentAuditHash: auditEntryPayment.currentHash,
        },
      });
    }

    // ----------------------------------------------------
    // Action 3: Government Rejects Milestone
    // ----------------------------------------------------
    if (action === "reject") {
      if (role !== "GOVERNMENT_OFFICER" && role !== "ADMIN") {
        return forbiddenResponse("Forbidden: Only government officers can reject milestones.");
      }

      if (!reason || reason.trim().length < 10) {
        return NextResponse.json(
          { success: false, error: "Validation Error: Rejection requires a documented technical reason." },
          { status: 400 }
        );
      }

      const item = milestonesStore.find((m) => m.id === milestoneId);
      if (item) item.status = "REJECTED";

      return NextResponse.json({
        success: true,
        message: `Milestone rejected. Technical comments logged.`,
        data: { milestoneId, status: "REJECTED" },
      });
    }

    return NextResponse.json({ success: false, error: `Invalid action '${action}'.` }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to process milestone action." },
      { status: 500 }
    );
  }
}
