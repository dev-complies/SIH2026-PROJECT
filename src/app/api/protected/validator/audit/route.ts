import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { canAccessValidationStudio } from "@/auth/permissions";

export async function POST(request: NextRequest) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return unauthorizedResponse();
  }

  // Only VALIDATOR and ADMIN can submit validation audit findings
  if (!canAccessValidationStudio(user)) {
    return forbiddenResponse(
      `Access Denied: Role ${user.role} cannot submit third-party validation reports. Only independent auditors can certify empirical findings.`
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      reportId: `VAL_REPORT_${Date.now()}`,
      auditor: user.email,
      outcome: "VALIDATED",
      timestamp: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  });
}
