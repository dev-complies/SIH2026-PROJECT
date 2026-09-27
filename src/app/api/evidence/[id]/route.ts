import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { normalizeRole } from "@/auth/permissions";
import { sanitizeString } from "@/lib/security";
import {
  getEvidenceById,
  updateEvidenceVerification,
  VerificationStatus,
} from "@/database/evidenceDatabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getAuthenticatedUser(request);
  const { id: evidenceId } = await params;

  const result = getEvidenceById(
    evidenceId,
    user
      ? {
          role: user.role,
          organization: user.organizationId || "",
          userId: user.id,
        }
      : undefined
  );

  if (result.error) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: result.status || 400 }
    );
  }

  return NextResponse.json({
    success: true,
    evidence: result.evidence,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getAuthenticatedUser(request);
  const { id: evidenceId } = await params;

  if (!user) {
    return unauthorizedResponse("Authentication required to adjudicate evidence verification status.");
  }

  const role = normalizeRole(user.role);

  // Verification actions are restricted to Government Officers, Validators, and Admins
  if (role !== "GOVERNMENT_OFFICER" && role !== "VALIDATOR" && role !== "ADMIN") {
    return forbiddenResponse(
      "Only Government Officers, Independent Validators, and System Administrators can adjudicate evidence verification status."
    );
  }

  try {
    const body = await request.json();
    const { status, rejectionReason, reviewNotes } = body;

    const validStatuses: VerificationStatus[] = [
      "Unverified",
      "Under Review",
      "Verified",
      "Rejected",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    if (status === "Rejected" && !rejectionReason?.trim()) {
      return NextResponse.json(
        { success: false, error: "A specific rejection reason is mandatory when rejecting evidence." },
        { status: 400 }
      );
    }

    const verifier = {
      name: `${user.firstName} ${user.lastName}`.trim(),
      role: user.role,
    };

    const sanitizedReason = rejectionReason ? sanitizeString(rejectionReason, 1000) : undefined;

    const updateResult = updateEvidenceVerification(
      evidenceId,
      status,
      verifier,
      sanitizedReason
    );

    if (!updateResult.success) {
      return NextResponse.json(
        { success: false, error: updateResult.error },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      evidence: updateResult.evidence,
      message: `Evidence status updated to ${status}.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
