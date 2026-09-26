import { NextRequest, NextResponse } from "next/server";
import { updateRisk, updateIssue } from "@/database/riskIssueDatabase";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const body = await request.json();
    const { itemType, ...updates } = body;

    if (itemType === "risk" || id.startsWith("RSK-")) {
      const result = updateRisk(id, updates);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        risk: result.risk,
        message: `Risk ${id} updated successfully.`,
      });
    } else if (itemType === "issue" || id.startsWith("ISS-")) {
      const result = updateIssue(id, updates);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        issue: result.issue,
        message: `Issue ${id} updated successfully.`,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Unable to determine item type. Please specify itemType ('risk' | 'issue')." },
        { status: 400 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
