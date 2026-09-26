import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
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

    const uploader = {
      id: user?.id || "u-anon",
      name: user ? `${user.firstName} ${user.lastName}` : (body.uploaderName || "System Submitter"),
      role: (user?.role as any) || (body.uploaderRole || "STARTUP"),
      organization: user?.organizationId || (body.uploaderOrg || "AirSense Technologies Pvt Ltd"),
    };

    const newEvidence = insertEvidenceRecord({
      title,
      type,
      uploader,
      relatedKpiId,
      relatedKpiName: relatedKpiName || "Air Quality Benchmark",
      relatedMeasurementId: relatedMeasurementId || "meas-latest",
      relatedMeasurementLabel: relatedMeasurementLabel || "Latest Field Reading",
      relatedMilestoneId,
      relatedMilestoneName: relatedMilestoneName || "Milestone Deliverable",
      description,
      verificationStatus: "Unverified",
      fileSize: fileSize || "5.2 MB",
      fileFormat: fileFormat || "PDF",
      sha256Hash: sha256Hash || `sha256:${Math.random().toString(36).substring(2, 12)}...`,
      confidentialityLevel: confidentialityLevel || "RESTRICTED",
      pilotId: pilotId || "PILOT-UP-UAQ-01",
      metadata: metadata || {},
    });

    return NextResponse.json({
      success: true,
      evidence: newEvidence,
      message: "Evidence successfully submitted and queued for verification.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to create evidence record" },
      { status: 500 }
    );
  }
}
