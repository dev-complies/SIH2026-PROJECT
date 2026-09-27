import { NextRequest, NextResponse } from "next/server";
import { analyticsDb } from "@/database/analyticsDatabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const department = searchParams.get("department") || undefined;
  const state = searchParams.get("state") || undefined;
  const district = searchParams.get("district") || undefined;
  const category = searchParams.get("category") || undefined;
  const timePeriod = searchParams.get("timePeriod") || undefined;

  const data = analyticsDb.queryAnalytics({
    department,
    state,
    district,
    category,
    timePeriod,
  });

  const filterOptions = analyticsDb.getAvailableFilterOptions();

  return NextResponse.json({
    success: true,
    data,
    filterOptions,
    queriedAt: new Date().toISOString(),
  });
}
