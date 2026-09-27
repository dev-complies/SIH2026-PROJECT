import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { normalizeRole } from "@/auth/permissions";
import { getDocumentById, updateDocument } from "@/database/documentDatabase";
import { sanitizeString } from "@/lib/security";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getAuthenticatedUser(request);
  const { id } = params;

  const result = getDocumentById(
    id,
    user
      ? {
          role: user.role,
          organizationId: user.organizationId,
          id: user.id,
        }
      : undefined
  );

  if (result.error) {
    return NextResponse.json({ success: false, error: result.error }, { status: result.status || 400 });
  }

  return NextResponse.json({
    success: true,
    document: result.document,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return unauthorizedResponse("Authentication required to modify legal documents.");
  }

  const role = normalizeRole(user.role);
  if (role !== "ADMIN" && role !== "GOVERNMENT_OFFICER" && role !== "PROCUREMENT_OFFICER" && role !== "STARTUP") {
    return forbiddenResponse("Forbidden: You do not possess clearance to modify contract documents.");
  }

  const { id } = params;
  try {
    const body = await request.json();

    // Sanitize any textual updates
    const sanitizedUpdates: Record<string, any> = {};
    for (const [k, v] of Object.entries(body)) {
      if (typeof v === "string") {
        sanitizedUpdates[k] = sanitizeString(v, 2000);
      } else {
        sanitizedUpdates[k] = v;
      }
    }

    const result = updateDocument(id, sanitizedUpdates);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      document: result.document,
      message: `Document ${id} updated successfully.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
