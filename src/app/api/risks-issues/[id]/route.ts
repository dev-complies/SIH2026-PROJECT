import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { normalizeRole } from "@/auth/permissions";
import { sanitizeString } from "@/lib/security";
import { updateRisk, updateIssue } from "@/database/riskIssueDatabase";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse("Authentication required to update risks or issues.");
    }

    const role = normalizeRole(user.role);
    if (
      role !== "ADMIN" &&
      role !== "GOVERNMENT_OFFICER" &&
      role !== "STARTUP" &&
      role !== "VALIDATOR" &&
      role !== "PROCUREMENT_OFFICER"
    ) {
      return forbiddenResponse("Forbidden: You do not possess clearance to update risk or issue records.");
    }

    const body = await request.json();
    const { itemType, ...updates } = body;

    // Sanitize string updates
    const sanitizedUpdates: Record<string, any> = { ...updates };
    if (sanitizedUpdates.title) sanitizedUpdates.title = sanitizeString(sanitizedUpdates.title, 200);
    if (sanitizedUpdates.description) sanitizedUpdates.description = sanitizeString(sanitizedUpdates.description, 2000);
    if (sanitizedUpdates.mitigation) sanitizedUpdates.mitigation = sanitizeString(sanitizedUpdates.mitigation, 2000);
    if (sanitizedUpdates.resolution) sanitizedUpdates.resolution = sanitizeString(sanitizedUpdates.resolution, 2000);
    if (sanitizedUpdates.owner) sanitizedUpdates.owner = sanitizeString(sanitizedUpdates.owner, 100);

    if (itemType === "risk" || id.startsWith("RSK-")) {
      const result = updateRisk(id, sanitizedUpdates);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        risk: result.risk,
        message: `Risk ${id} updated successfully.`,
      });
    } else if (itemType === "issue" || id.startsWith("ISS-")) {
      const result = updateIssue(id, sanitizedUpdates);
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
