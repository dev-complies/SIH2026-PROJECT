import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { canAccessGovernmentInternalData } from "@/auth/permissions";

export async function POST(request: NextRequest) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return unauthorizedResponse();
  }

  // Only GOVERNMENT_OFFICER and ADMIN can create internal challenge drafts
  if (!canAccessGovernmentInternalData(user)) {
    return forbiddenResponse(
      `Access Denied: Role ${user.role} is not permitted to create or modify internal government challenge specifications.`
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      challengeId: `CHAL_${Date.now()}`,
      status: "DRAFT",
      officer: user.email,
      departmentId: user.departmentId || "dept-urban-001",
    },
    timestamp: new Date().toISOString(),
  });
}
