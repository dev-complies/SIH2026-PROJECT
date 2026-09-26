import { NextRequest, NextResponse } from "next/server";
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
    const body = await request.json();
    const { kpiId, value, notes, sourceNode, verifiedBy } = body;

    if (!kpiId || value === undefined || isNaN(Number(value))) {
      return NextResponse.json(
        { success: false, error: "Valid kpiId and numeric value are required" },
        { status: 400 }
      );
    }

    const result = insertKPIMeasurement(
      kpiId,
      Number(value),
      notes || "",
      sourceNode,
      verifiedBy
    );

    if (!result.success) {
      return NextResponse.json({ success: false, error: "Failed to insert measurement" }, { status: 400 });
    }

    const updatedMeasurements = queryHistoricalMeasurements(kpiId);

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
