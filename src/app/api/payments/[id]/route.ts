import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { normalizeRole, canAuthorizeProcurementDisbursement } from "@/auth/permissions";
import { sanitizeString } from "@/lib/security";
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
    if (!user) {
      return unauthorizedResponse("Authentication required to update milestone payments.");
    }

    const role = normalizeRole(user.role);
    const body = await request.json();

    const payment = paymentDb.getPaymentById(id);
    if (!payment) {
      return NextResponse.json(
        { success: false, error: `Payment record ${id} not found.` },
        { status: 404 }
      );
    }

    const { action, approver, remarks, utrNumber, reason, revisedDueDate, invoice } = body;
    const userName = `${user.firstName} ${user.lastName}`.trim();

    let updated = null;

    if (action === "SUBMIT_INVOICE") {
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
      updated = paymentDb.submitInvoice(id, sanitizedInvoice, submitter);
    } else if (action === "REVIEW") {
      if (role !== "PROCUREMENT_OFFICER" && role !== "GOVERNMENT_OFFICER" && role !== "ADMIN") {
        return forbiddenResponse("Forbidden: Only procurement officers, government officers, or admins can review milestone payments.");
      }
      const reviewer = userName || "Procurement Officer";
      updated = paymentDb.reviewPayment(id, reviewer, remarks ? sanitizeString(remarks, 500) : undefined);
    } else if (action === "APPROVE") {
      if (role !== "PROCUREMENT_OFFICER" && role !== "GOVERNMENT_OFFICER" && role !== "ADMIN") {
        return forbiddenResponse("Forbidden: Only procurement officers, government officers, or admins can approve milestone payments.");
      }
      const officer = userName || approver || "Rajesh Verma (Gov Officer)";
      updated = paymentDb.approvePayment(id, officer, sanitizeString(remarks || "Approved for disbursement", 1000));
    } else if (action === "DISBURSE") {
      if (!canAuthorizeProcurementDisbursement(user)) {
        return forbiddenResponse("Statutory Access Denied: Only authorized Procurement Officers or Platform Administrators can disburse statutory treasury funds.");
      }
      const officer = userName || "Treasury Nodal Officer";
      updated = paymentDb.disbursePayment(id, officer, utrNumber ? sanitizeString(utrNumber, 50) : undefined);
    } else if (action === "REJECT") {
      if (role !== "PROCUREMENT_OFFICER" && role !== "GOVERNMENT_OFFICER" && role !== "ADMIN") {
        return forbiddenResponse("Forbidden: Only procurement officers, government officers, or admins can reject milestone payments.");
      }
      const officer = userName || "Procurement Officer";
      updated = paymentDb.rejectPayment(id, officer, sanitizeString(reason || "Documentation requirements not satisfied", 1000));
    } else if (action === "DELAY") {
      if (role !== "PROCUREMENT_OFFICER" && role !== "GOVERNMENT_OFFICER" && role !== "ADMIN") {
        return forbiddenResponse("Forbidden: Only procurement officers, government officers, or admins can defer milestone payments.");
      }
      const officer = userName || "Procurement Officer";
      updated = paymentDb.delayPayment(id, officer, sanitizeString(reason || "Milestone deliverable delay reported", 1000), revisedDueDate ? sanitizeString(revisedDueDate, 50) : undefined);
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
