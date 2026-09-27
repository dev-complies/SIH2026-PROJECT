import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse } from "@/auth/serverAuth";
import { paymentDb } from "@/database/paymentDatabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payment = paymentDb.getPaymentById(id);

  if (!payment) {
    return NextResponse.json(
      { success: false, error: `Payment record ${id} not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    payment,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = getAuthenticatedUser(request);
    const body = await request.json();

    const payment = paymentDb.getPaymentById(id);
    if (!payment) {
      return NextResponse.json(
        { success: false, error: `Payment record ${id} not found.` },
        { status: 404 }
      );
    }

    const { action, approver, remarks, utrNumber, reason, revisedDueDate, invoice } = body;
    const userName = user ? `${user.firstName} ${user.lastName}`.trim() : undefined;

    let updated = null;

    if (action === "SUBMIT_INVOICE") {
      const submitter = userName || "AirSense Technologies (Finance)";
      updated = paymentDb.submitInvoice(id, invoice, submitter);
    } else if (action === "REVIEW") {
      const reviewer = userName || "Procurement Officer";
      updated = paymentDb.reviewPayment(id, reviewer, remarks);
    } else if (action === "APPROVE") {
      const officer = approver || userName || "Rajesh Verma (Gov Officer)";
      updated = paymentDb.approvePayment(id, officer, remarks || "Approved for disbursement");
    } else if (action === "DISBURSE") {
      const officer = userName || "Treasury Nodal Officer";
      updated = paymentDb.disbursePayment(id, officer, utrNumber);
    } else if (action === "REJECT") {
      const officer = userName || "Procurement Officer";
      updated = paymentDb.rejectPayment(id, officer, reason || "Documentation requirements not satisfied");
    } else if (action === "DELAY") {
      const officer = userName || "Procurement Officer";
      updated = paymentDb.delayPayment(id, officer, reason || "Milestone deliverable delay reported", revisedDueDate);
    } else {
      return NextResponse.json(
        { success: false, error: `Unknown action: ${action}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      payment: updated,
      summary: paymentDb.getPilotFinancialSummary(payment.pilotId),
      message: `Payment ${id} successfully updated with action ${action}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update payment" },
      { status: 500 }
    );
  }
}
