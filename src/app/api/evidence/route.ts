import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { normalizeRole } from "@/auth/permissions";
import { validateFileFormat, sanitizeString } from "@/lib/security";
import {
  queryEvidence,
  insertEvidenceRecord,
  getKpiTraceability,
  EvidenceType,
  VerificationStatus,
} from "@/database/evidenceDatabase";
import { queryAllKPIs, queryHistoricalMeasurements } from "@/database/kpiDatabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const user = getAuthenticatedUser(request);

  // Extract filter parameters
  const kpiId = searchParams.get("kpiId") || undefined;
  const measurementId = searchParams.get("measurementId") || undefined;
  const milestoneId = searchParams.get("milestoneId") || undefined;
  const type = (searchParams.get("type") as EvidenceType) || undefined;
  const status = (searchParams.get("status") as VerificationStatus) || undefined;
  const pilotId = searchParams.get("pilotId") || undefined;
  const isTraceability = searchParams.get("traceability") === "true";

  const userContext = user
    ? {
        role: user.role,
        organization: user.organizationId || "",
        userId: user.id,
      }
    : undefined;

  // Handle Traceability graph request (KPI -> Measurement -> Evidence)
  if (isTraceability) {
    const kpis = queryAllKPIs(pilotId);
    const targetKpiId = kpiId || (kpis.length > 0 ? kpis[0].id : "");

    if (!targetKpiId) {
      return NextResponse.json({ success: true, traceability: null });
    }

    const allMeasurements = queryHistoricalMeasurements(targetKpiId);
    const traceabilityNode = getKpiTraceability(
      targetKpiId,
      kpis,
      allMeasurements,
      userContext
    );

    return NextResponse.json({
      success: true,
      traceability: traceabilityNode,
      allKpis: kpis.map((k) => ({ id: k.id, name: k.name, status: k.status, current: k.currentValue, target: k.target, unit: k.unit })),
      queriedAt: new Date().toISOString(),
    });
  }

  // Standard Evidence Query
  const evidenceList = queryEvidence(
    {
      kpiId,
      measurementId,
      milestoneId,
      type,
      status,
      pilotId,
    },
    userContext
  );

  return NextResponse.json({
    success: true,
    totalCount: evidenceList.length,
    evidence: evidenceList,
    queriedAt: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse("Authentication required to submit empirical pilot evidence.");
    }

    const role = normalizeRole(user.role);
    if (role !== "STARTUP" && role !== "GOVERNMENT_OFFICER" && role !== "VALIDATOR" && role !== "ADMIN") {
      return forbiddenResponse("Forbidden: You do not have clearance to upload evidence for this pilot.");
    }

    const body = await request.json();

    const {
      title,
      type,
      relatedKpiId,
      relatedKpiName,
      relatedMeasurementId,
      relatedMeasurementLabel,
      relatedMilestoneId,
      relatedMilestoneName,
      description,
      fileSize,
      fileFormat,
      sha256Hash,
      confidentialityLevel,
      pilotId,
      metadata,
    } = body;

    if (!title || !type || !relatedKpiId || !relatedMilestoneId || !description) {
      return NextResponse.json(
        {
          success: false,
          error: "Required fields missing: title, type, relatedKpiId, relatedMilestoneId, description are required.",
        },
        { status: 400 }
      );
    }

    // Validate File Format against security allowlist
    const formatValidation = validateFileFormat(fileFormat || "PDF");
    if (!formatValidation.isValid) {
      return NextResponse.json(
        { success: false, error: formatValidation.error },
        { status: 400 }
      );
    }

    // Sanitize title and description against XSS and path traversal
    const safeTitle = sanitizeString(title, 200);
    const safeDesc = sanitizeString(description, 2000);

    const uploader = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim(),
      role: user.role as any,
      organization: user.organizationId || "Government Oversight Directorate",
    };

    const newEvidence = insertEvidenceRecord({
      title: safeTitle,
      type,
      uploader,
      relatedKpiId: sanitizeString(relatedKpiId, 64),
      relatedKpiName: sanitizeString(relatedKpiName || "Air Quality Benchmark", 128),
      relatedMeasurementId: sanitizeString(relatedMeasurementId || "meas-latest", 64),
      relatedMeasurementLabel: sanitizeString(relatedMeasurementLabel || "Latest Field Reading", 128),
      relatedMilestoneId: sanitizeString(relatedMilestoneId, 32),
      relatedMilestoneName: sanitizeString(relatedMilestoneName || "Milestone Deliverable", 128),
      description: safeDesc,
      verificationStatus: "Unverified",
      fileSize: fileSize ? sanitizeString(fileSize, 20) : "5.2 MB",
      fileFormat: formatValidation.normalizedFormat,
      sha256Hash: sha256Hash ? sanitizeString(sha256Hash, 64) : `sha256:${Math.random().toString(36).substring(2, 12)}...`,
      confidentialityLevel: confidentialityLevel || "RESTRICTED",
      pilotId: sanitizeString(pilotId || "PILOT-UP-UAQ-01", 64),
      metadata: metadata || {},
    });

    // 1. Record Cryptographic Audit Ledger Entry
    const { auditDb } = await import("@/database/auditDatabase");
    const { notificationDb } = await import("@/database/notificationDatabase");

    const auditEntry = auditDb.recordAction({
      user: { id: user.id, name: `${user.firstName} ${user.lastName}`.trim(), email: user.email, department: user.organizationId || "Startup" },
      role: user.role,
      action: "Evidence Uploaded",
      entity: "Evidence",
      entityId: newEvidence.id,
      entityName: newEvidence.title,
      previousState: { verificationStatus: "Unsubmitted" },
      newState: {
        verificationStatus: "Unverified",
        fileFormat: newEvidence.fileFormat,
        sha256Hash: newEvidence.sha256Hash,
        relatedMilestoneId: newEvidence.relatedMilestoneId,
        uploadedAt: new Date().toISOString(),
      },
      statutoryRuleRef: "GFR Rule 149 (Empirical Deliverable Submissions)",
    });

    // 2. Dispatch Notification to Government & Validator
    notificationDb.dispatchNotification({
      type: "Validation Required",
      title: `New Milestone Evidence Uploaded: ${newEvidence.title}`,
      message: `${user.firstName} ${user.lastName} uploaded empirical deliverable '${newEvidence.title}' for milestone '${newEvidence.relatedMilestoneName}'.`,
      category: "VALIDATION",
      severity: "MEDIUM",
      recipientRoles: ["GOVERNMENT_OFFICER", "VALIDATOR", "ADMIN"],
      entityType: "Evidence",
      entityId: newEvidence.id,
      actionUrl: `/evidence`,
      actionLabel: "Verify Evidence",
    });

    return NextResponse.json({
      success: true,
      evidence: newEvidence,
      auditLogSequence: auditEntry.sequenceNumber,
      auditHash: auditEntry.currentHash,
      message: "Evidence successfully submitted and queued for verification.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to create evidence record" },
      { status: 500 }
    );
  }
}
