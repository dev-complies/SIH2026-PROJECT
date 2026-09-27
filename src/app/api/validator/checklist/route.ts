import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse } from "@/auth/serverAuth";
import { normalizeRole } from "@/auth/permissions";
import { validatorDb } from "@/database/validatorDatabase";

export async function PATCH(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse("Authentication required to modify validation checklist.");
    }

    const role = normalizeRole(user.role);

    // Rule: Do not allow startup to modify validator findings/checklist
    if (role === "STARTUP") {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Startups cannot alter independent validator checklist findings.",
        },
        { status: 403 }
      );
    }

    if (role !== "VALIDATOR" && role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Only independent validators can update validation checklist items.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { pilotId = "PILOT-UP-UAQ-01", itemId, status, notes } = body;

    if (!itemId || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required itemId or status." },
        { status: 400 }
      );
    }

    const actorName = `${user.firstName} ${user.lastName}`.trim() || "Priya Nair";

    const result = validatorDb.updateChecklistItem(
      pilotId,
      itemId,
      status,
      notes,
      actorName,
      user.role
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      item: result.item,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update checklist item." },
      { status: 500 }
    );
  }
}
