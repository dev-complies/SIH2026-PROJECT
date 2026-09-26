import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import {
  getEvidenceById,
  updateEvidenceVerification,
  VerificationStatus,
} from "@/database/evidenceDatabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getAuthenticatedUser(request);
  const evidenceId = params.id;

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
  { params }: { params: { id: string } }
) {
  const user = getAuthenticatedUser(request);
  const evidenceId = params.id;

  // Verification actions are restricted to Government Officers, Validators, and Admins
  if (user && user.role !== "GOVERNMENT_OFFICER" && user.role !== "VALIDATOR" && user.role !== "ADMIN") {
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
      name: user ? `${user.firstName} ${user.lastName}` : (body.verifierName || "Government Reviewer"),
      role: user ? user.role : (body.verifierRole || "GOVERNMENT_OFFICER"),
    };

    const updateResult = updateEvidenceVerification(
      evidenceId,
      status,
      verifier,
      rejectionReason
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
