import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { canAuthorizeProcurementDisbursement } from "@/auth/permissions";

export async function POST(request: NextRequest) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return unauthorizedResponse();
  }

  // Segregation of Duties: Only PROCUREMENT_OFFICER and ADMIN can disburse funds
  if (!canAuthorizeProcurementDisbursement(user)) {
    return forbiddenResponse(
      `Access Denied: Role ${user.role} is not authorized to disburse public funds. Segregation of Duties mandates that only verified Procurement Officers or Admins can authorize treasury disbursements.`
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      transactionId: `TXN_MOCK_DISBURSE_${Date.now()}`,
      status: "PAID",
      authorizedBy: user.email,
      disbursedAt: new Date().toISOString(),
      amount: 800000,
    },
    timestamp: new Date().toISOString(),
  });
}
