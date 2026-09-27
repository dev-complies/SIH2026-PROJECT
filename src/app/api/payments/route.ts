import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/auth/serverAuth";
import {
  paymentDb,
  PaymentStatus,
} from "@/database/paymentDatabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pilotId = searchParams.get("pilotId") || "PILOT-UP-UAQ-01";
  const status = (searchParams.get("status") as PaymentStatus | "ALL") || "ALL";
  const milestone = searchParams.get("milestone") || undefined;
  const search = searchParams.get("search")?.toLowerCase() || undefined;

  let payments = paymentDb.getAllPayments(pilotId);

  if (status && status !== "ALL") {
    payments = payments.filter((p) => p.status === status);
  }

  if (milestone && milestone !== "ALL") {
    payments = payments.filter(
      (p) =>
        p.milestoneId.toLowerCase() === milestone.toLowerCase() ||
        p.milestoneCode.toLowerCase() === milestone.toLowerCase()
    );
  }

  if (search) {
    payments = payments.filter(
      (p) =>
        p.milestoneName.toLowerCase().includes(search) ||
        p.milestoneCode.toLowerCase().includes(search) ||
        (p.invoice?.invoiceNumber && p.invoice.invoiceNumber.toLowerCase().includes(search)) ||
        (p.reference && p.reference.toLowerCase().includes(search)) ||
        (p.approval?.approvedBy && p.approval.approvedBy.toLowerCase().includes(search))
    );
  }

  const summary = paymentDb.getPilotFinancialSummary(pilotId);

  return NextResponse.json({
    success: true,
    summary,
    payments,
    totalCount: payments.length,
    queriedAt: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    const userName = user ? `${user.firstName} ${user.lastName}`.trim() : undefined;
    const body = await request.json();
    const { action, paymentId, invoice, approver, remarks, utrNumber, reason, revisedDueDate } = body;

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: "Missing required paymentId parameter" },
        { status: 400 }
      );
    }

    let updatedPayment = null;

    switch (action) {
      case "SUBMIT_INVOICE": {
        if (!invoice || !invoice.invoiceNumber || !invoice.amount) {
          return NextResponse.json(
            { success: false, error: "Invoice number and amount are required." },
            { status: 400 }
          );
        }
        const submitter = userName || "AirSense Technologies (Finance)";
        updatedPayment = paymentDb.submitInvoice(paymentId, invoice, submitter);
        break;
      }

      case "REVIEW": {
        const reviewer = userName || "Sunita Deshmukh (Procurement Officer)";
        updatedPayment = paymentDb.reviewPayment(paymentId, reviewer, remarks);
        break;
      }

      case "APPROVE": {
        const officer = approver || userName || "Rajesh Verma (Director of Urban Development)";
        if (!remarks) {
          return NextResponse.json(
            { success: false, error: "Approval justification or review remarks are required." },
            { status: 400 }
          );
        }
        updatedPayment = paymentDb.approvePayment(paymentId, officer, remarks);
        break;
      }

      case "DISBURSE": {
        const nodalOfficer = userName || "UP State Treasury Nodal Officer";
        updatedPayment = paymentDb.disbursePayment(paymentId, nodalOfficer, utrNumber);
        break;
      }

      case "REJECT": {
        if (!reason) {
          return NextResponse.json(
            { success: false, error: "Rejection reason is required." },
            { status: 400 }
          );
        }
        const officer = userName || "Procurement Officer";
        updatedPayment = paymentDb.rejectPayment(paymentId, officer, reason);
        break;
      }

      case "DELAY": {
        if (!reason) {
          return NextResponse.json(
            { success: false, error: "Delay reason is required." },
            { status: 400 }
          );
        }
        const officer = userName || "Procurement Officer";
        updatedPayment = paymentDb.delayPayment(paymentId, officer, reason, revisedDueDate);
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unsupported payment action: ${action}` },
          { status: 400 }
        );
    }

    if (!updatedPayment) {
      return NextResponse.json(
        { success: false, error: `Payment record ${paymentId} not found` },
        { status: 404 }
      );
    }

    const summary = paymentDb.getPilotFinancialSummary(updatedPayment.pilotId);

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
      summary,
      message: `Payment action '${action}' completed successfully.`,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process payment action",
      },
      { status: 500 }
    );
  }
}
