import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { normalizeRole, canAuthorizeProcurementDisbursement } from "@/auth/permissions";
import { sanitizeString } from "@/lib/security";
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
    if (!user) {
      return unauthorizedResponse("Authentication required to execute payment lifecycle actions.");
    }

    const role = normalizeRole(user.role);
    const userName = `${user.firstName} ${user.lastName}`.trim();
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
        if (role !== "STARTUP" && role !== "PROCUREMENT_OFFICER" && role !== "ADMIN") {
          return forbiddenResponse("Forbidden: Only startups and procurement officers can submit milestone invoices.");
        }
        if (!invoice || !invoice.invoiceNumber || !invoice.amount) {
          return NextResponse.json(
            { success: false, error: "Invoice number and amount are required." },
            { status: 400 }
          );
        }
        const sanitizedInvoice = {
          ...invoice,
          invoiceNumber: sanitizeString(invoice.invoiceNumber, 100),
          notes: invoice.notes ? sanitizeString(invoice.notes, 500) : undefined,
          amount: Number(invoice.amount),
        };
        const submitter = userName || "AirSense Technologies (Finance)";
        updatedPayment = paymentDb.submitInvoice(paymentId, sanitizedInvoice, submitter);
        break;
      }

      case "REVIEW": {
        if (role !== "PROCUREMENT_OFFICER" && role !== "GOVERNMENT_OFFICER" && role !== "ADMIN") {
          return forbiddenResponse("Forbidden: Only procurement officers, government officers, or admins can review milestone payments.");
        }
        const reviewer = userName || "Procurement Officer";
        updatedPayment = paymentDb.reviewPayment(paymentId, reviewer, remarks ? sanitizeString(remarks, 500) : undefined);
        break;
      }

      case "APPROVE": {
        if (role !== "PROCUREMENT_OFFICER" && role !== "GOVERNMENT_OFFICER" && role !== "ADMIN") {
          return forbiddenResponse("Forbidden: Only procurement officers, government officers, or admins can approve milestone payments.");
        }
        if (!remarks) {
          return NextResponse.json(
            { success: false, error: "Approval justification or review remarks are required." },
            { status: 400 }
          );
        }
        const officer = userName || approver || "Director of Urban Development";
        updatedPayment = paymentDb.approvePayment(paymentId, officer, sanitizeString(remarks, 1000));
        break;
      }

      case "DISBURSE": {
        // Segregation of Duties: Under GFR rules, disbursement is strictly restricted to procurement/treasury officers and admins
        if (!canAuthorizeProcurementDisbursement(user)) {
          return forbiddenResponse("Statutory Access Denied: Only authorized Procurement Officers or Platform Administrators can disburse statutory treasury funds.");
        }
        const nodalOfficer = userName || "UP State Treasury Nodal Officer";
        const sanitizedUtr = utrNumber ? sanitizeString(utrNumber, 50) : undefined;
        updatedPayment = paymentDb.disbursePayment(paymentId, nodalOfficer, sanitizedUtr);
        break;
      }

      case "REJECT": {
        if (role !== "PROCUREMENT_OFFICER" && role !== "GOVERNMENT_OFFICER" && role !== "ADMIN") {
          return forbiddenResponse("Forbidden: Only procurement officers, government officers, or admins can reject milestone payments.");
        }
        if (!reason) {
          return NextResponse.json(
            { success: false, error: "Rejection reason is required." },
            { status: 400 }
          );
        }
        const officer = userName || "Procurement Officer";
        updatedPayment = paymentDb.rejectPayment(paymentId, officer, sanitizeString(reason, 1000));
        break;
      }

      case "DELAY": {
        if (role !== "PROCUREMENT_OFFICER" && role !== "GOVERNMENT_OFFICER" && role !== "ADMIN") {
          return forbiddenResponse("Forbidden: Only procurement officers, government officers, or admins can defer milestone payments.");
        }
        if (!reason) {
          return NextResponse.json(
            { success: false, error: "Delay reason is required." },
            { status: 400 }
          );
        }
        const officer = userName || "Procurement Officer";
        updatedPayment = paymentDb.delayPayment(paymentId, officer, sanitizeString(reason, 1000), revisedDueDate ? sanitizeString(revisedDueDate, 50) : undefined);
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
