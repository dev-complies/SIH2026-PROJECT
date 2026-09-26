import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { canAccessStartupDocuments } from "@/auth/permissions";

export async function GET(request: NextRequest) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return unauthorizedResponse();
  }

  // Target organization whose proprietary documents are requested
  const targetOrgId = request.nextUrl.searchParams.get("organizationId") || "org-airsense-001";

  // Check data isolation policy
  if (!canAccessStartupDocuments(user, targetOrgId)) {
    return forbiddenResponse(
      `Access Denied: Role ${user.role} is not permitted to access proprietary documents belonging to organization ${targetOrgId}.`
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      documentId: "doc-ip-proprietary-001",
      title: "AirSense Proprietary Optical Calibration Algorithm & Source Code",
      organizationId: targetOrgId,
      classification: "CONFIDENTIAL_PROPRIETARY",
      checksum: "sha256_81923182390128301293810238120381023810238102",
      contentUrl: "/secure-vault/docs/airsense_proprietary_v2.pdf",
    },
    timestamp: new Date().toISOString(),
  });
}
