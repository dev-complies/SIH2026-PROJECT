import { NextRequest, NextResponse } from "next/server";
import { provenSolutionsDb } from "@/database/provenSolutionsDatabase";
import { getAuthenticatedUser, unauthorizedResponse } from "@/auth/serverAuth";
import { sanitizeString } from "@/lib/security";

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
    if (!user) {
      return unauthorizedResponse("Authentication required to submit government replication inquiries.");
    }

    const body = await request.json();
    const { targetDepartment, targetCity, plannedWards, replicationScopeNote } = body;

    const officerName = `${user.firstName} ${user.lastName}`.trim();
    const officerEmail = user.email;

    const inquiryRef = `REP-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      inquiryReference: inquiryRef,
      message: `Replication intent for '${solution.title}' registered successfully under reference ${inquiryRef}.`,
      details: {
        solutionId: solution.id,
        solutionTitle: solution.title,
        startupName: solution.startup.name,
        targetDepartment: targetDepartment ? sanitizeString(targetDepartment, 100) : solution.applicableDepartments[0],
        targetCity: targetCity ? sanitizeString(targetCity, 100) : "State Municipal Corridor",
        plannedWards: Math.max(1, Math.min(500, Number(plannedWards) || 10)),
        replicationScopeNote: replicationScopeNote ? sanitizeString(replicationScopeNote, 1000) : undefined,
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
