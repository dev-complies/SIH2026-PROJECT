import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { normalizeRole } from "@/auth/permissions";
import { sanitizeString } from "@/lib/security";
import {
  queryAllKPIs,
  queryKPIById,
  queryHistoricalMeasurements,
  insertKPIMeasurement,
} from "@/database/kpiDatabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const kpiId = searchParams.get("kpiId");
  const pilotId = searchParams.get("pilotId") || undefined;

  if (kpiId) {
    const kpi = queryKPIById(kpiId);
    if (!kpi) {
      return NextResponse.json({ success: false, error: "KPI not found" }, { status: 404 });
    }
    const measurements = queryHistoricalMeasurements(kpiId);
    return NextResponse.json({
      success: true,
      kpi,
      measurements,
      queriedAt: new Date().toISOString(),
      dataSource: "PostgreSQL Database / Timescale Telemetry Partition",
    });
  }

  const kpis = queryAllKPIs(pilotId);
  return NextResponse.json({
    success: true,
    kpis,
    queriedAt: new Date().toISOString(),
    dataSource: "PostgreSQL Database / Timescale Telemetry Partition",
  });
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse("Authentication required to submit KPI telemetry.");
    }

    const role = normalizeRole(user.role);
    if (role !== "ADMIN" && role !== "GOVERNMENT_OFFICER" && role !== "STARTUP" && role !== "VALIDATOR") {
      return forbiddenResponse("Forbidden: You do not possess clearance to record KPI telemetry.");
    }

    const body = await request.json();
    const { kpiId, value, notes, sourceNode, verifiedBy } = body;

    const numValue = Number(value);
    if (!kpiId || value === undefined || isNaN(numValue) || !isFinite(numValue)) {
      return NextResponse.json(
        { success: false, error: "Valid kpiId and finite numeric value are required" },
        { status: 400 }
      );
    }

    const sanitizedKpiId = sanitizeString(kpiId, 50);
    const sanitizedNotes = notes ? sanitizeString(notes, 1000) : "";
    const sanitizedSourceNode = sourceNode ? sanitizeString(sourceNode, 100) : undefined;
    const verifier = verifiedBy
      ? sanitizeString(verifiedBy, 100)
      : `${user.firstName} ${user.lastName} (${user.role})`;

    const result = insertKPIMeasurement(
      sanitizedKpiId,
      numValue,
      sanitizedNotes,
      sanitizedSourceNode,
      verifier
    );

    if (!result.success) {
      return NextResponse.json({ success: false, error: "Failed to insert measurement" }, { status: 400 });
    }

    const updatedMeasurements = queryHistoricalMeasurements(sanitizedKpiId);

    return NextResponse.json({
      success: true,
      measurement: result.measurement,
      kpi: result.kpi,
      allMeasurements: updatedMeasurements,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
