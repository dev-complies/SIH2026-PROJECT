import { NextRequest, NextResponse } from "next/server";
import { provenSolutionsDb } from "@/database/provenSolutionsDatabase";
import { getAuthenticatedUser } from "@/auth/serverAuth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const solution = provenSolutionsDb.getSolutionById(id);

  if (!solution) {
    return NextResponse.json(
      { success: false, error: `Proven solution '${id}' not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    solution,
    queriedAt: new Date().toISOString(),
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const solution = provenSolutionsDb.getSolutionById(id);

    if (!solution) {
      return NextResponse.json(
        { success: false, error: `Proven solution '${id}' not found.` },
        { status: 404 }
      );
    }

    const user = getAuthenticatedUser(request);
    const body = await request.json();
    const { targetDepartment, targetCity, plannedWards, replicationScopeNote } = body;

    const officerName = user ? `${user.firstName} ${user.lastName}`.trim() : body.officerName || "Visiting Officer";
    const officerEmail = user?.email || body.officerEmail || "officer@gov.in";

    const inquiryRef = `REP-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      inquiryReference: inquiryRef,
      message: `Replication intent for '${solution.title}' registered successfully under reference ${inquiryRef}.`,
      details: {
        solutionId: solution.id,
        solutionTitle: solution.title,
        startupName: solution.startup.name,
        targetDepartment: targetDepartment || solution.applicableDepartments[0],
        targetCity: targetCity || "State Municipal Corridor",
        plannedWards: plannedWards || 10,
        registeredBy: `${officerName} (${officerEmail})`,
        registeredAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit replication intent." },
      { status: 500 }
    );
  }
}
