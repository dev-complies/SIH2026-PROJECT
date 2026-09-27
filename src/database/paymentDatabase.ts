/**
 * Milestone-Based Payment Tracking Database
 * Prototype mock ledger linking public treasury escrow disbursements directly to pilot milestones.
 */

export type PaymentStatus =
  | "Pending"
  | "Submitted"
  | "Under Review"
  | "Approved"
  | "Paid"
  | "Rejected"
  | "Delayed";

export interface PaymentInvoice {
  invoiceNumber: string;
  invoiceDate: string;
  fileUrl?: string;
  fileName?: string;
  amount: number;
  gstin: string;
  hsnSacCode?: string;
}

export interface PaymentApproval {
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  remarks?: string;
  digitalSignature?: string;
}

export interface PaymentBeneficiary {
  startupName: string;
  dpiitReg: string;
  bankName: string;
  accountNumberMasked: string;
  ifscCode: string;
  branch: string;
}

export interface PaymentAuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  note: string;
  reference?: string;
}

export interface PaymentRecord {
  id: string;
  pilotId: string;
  pilotTitle: string;
  milestoneId: string;
  milestoneCode: "M1" | "M2" | "M3" | "M4" | "M5";
  milestoneName: string;
  milestoneDescription: string;
  milestoneWeight: number; // percentage
  amount: number;
  currency: string;
  dueDate: string;
  invoice: PaymentInvoice | null;
  status: PaymentStatus;
  approval: PaymentApproval | null;
  reference: string | null; // e.g. Treasury Escrow UTR / Clearance Voucher
  timestamp: string; // ISO or formatted timestamp of last status change
  escrowAccount: string;
  beneficiary: PaymentBeneficiary;
  relatedDeliverablesCount: number;
  completedDeliverablesCount: number;
  kpiSummary: string;
  evidenceCount: number;
  history: PaymentAuditEntry[];
}

export interface PilotFinancialSummary {
  pilotId: string;
  pilotTitle: string;
  contractValue: number;
  paid: number;
  approved: number;
  pending: number;
  remaining: number;
  currency: string;
  totalMilestones: number;
  paidMilestonesCount: number;
  approvedMilestonesCount: number;
  pendingMilestonesCount: number;
  delayedCount: number;
  escrowAgency: string;
  nodalTreasury: string;
}

const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: "PAY-UP-UAQ-01",
    pilotId: "PILOT-UP-UAQ-01",
    pilotTitle: "Urban Air Quality Hyperlocal Monitoring — Lucknow Pilot",
    milestoneId: "m1",
    milestoneCode: "M1",
    milestoneName: "Testbed Collocation & Baseline Calibration",
    milestoneDescription: "Deploy 4 calibrated optical particulate counters alongside CPCB BAM-1020 reference analyzer at Lalbagh station to establish baseline linear regression coefficients.",
    milestoneWeight: 20,
    amount: 500000,
    currency: "INR",
    dueDate: "2026-06-10",
    invoice: {
      invoiceNumber: "INV-AS-2026-01",
      invoiceDate: "2026-06-06",
      fileName: "Tax_Invoice_INV-AS-2026-01_Mobilization.pdf",
      fileUrl: "/invoices/INV-AS-2026-01.pdf",
      amount: 500000,
      gstin: "09AAACA1234B1Z5",
      hsnSacCode: "998313",
    },
    status: "Paid",
    approval: {
      approvedBy: "Rajesh Verma (Director of Urban Development)",
      approvedAt: "2026-06-08T15:40:00Z",
      remarks: "CPCB collocated calibration telemetry verified with R² = 0.94. Deliverables verified and approved for treasury escrow disbursement.",
      digitalSignature: "SHA256:d8b2e1f44c771239aa889100234bcefa01928374",
    },
    reference: "TREAS-UP-2026-9812489", // Treasury Escrow / NEFT UTR
    timestamp: "2026-06-12T10:15:00Z",
    escrowAccount: "SBI Treasury Escrow Pool #UP-SMART-88219",
    beneficiary: {
      startupName: "AirSense Technologies Pvt Ltd",
      dpiitReg: "DIPP98214",
      bankName: "State Bank of India",
      accountNumberMasked: "••••••••4819",
      ifscCode: "SBIN0001256",
      branch: "Hazratganj Main Branch, Lucknow",
    },
    relatedDeliverablesCount: 3,
    completedDeliverablesCount: 3,
    kpiSummary: "BAM-1020 Correlation R² = 0.94 (Target ≥ 0.90)",
    evidenceCount: 2,
    history: [
      {
        id: "hist-1-1",
        timestamp: "2026-05-15T09:00:00Z",
        actor: "Directorate of Urban Development",
        action: "TRANCHE_CREATED",
        note: "Tranche 1 (₹5,00,000) locked in Treasury Escrow upon Pilot Agreement signing.",
      },
      {
        id: "hist-1-2",
        timestamp: "2026-06-06T11:20:00Z",
        actor: "AirSense Technologies (Finance)",
        action: "INVOICE_SUBMITTED",
        note: "Submitted Tax Invoice INV-AS-2026-01 with CPCB Collocation Report.",
      },
      {
        id: "hist-1-3",
        timestamp: "2026-06-08T15:40:00Z",
        actor: "Rajesh Verma (Gov Officer)",
        action: "DISBURSEMENT_APPROVED",
        note: "Performance milestone confirmed. Passed to Directorate Treasury for escrow release.",
      },
      {
        id: "hist-1-4",
        timestamp: "2026-06-12T10:15:00Z",
        actor: "UP State Treasury Nodal Officer",
        action: "ESCROW_DISBURSED",
        note: "Funds disbursed via RBI-NEFT. UTR: TREAS-UP-2026-9812489.",
        reference: "TREAS-UP-2026-9812489",
      },
    ],
  },
  {
    id: "PAY-UP-UAQ-02",
    pilotId: "PILOT-UP-UAQ-01",
    pilotTitle: "Urban Air Quality Hyperlocal Monitoring — Lucknow Pilot",
    milestoneId: "m2",
    milestoneCode: "M2",
    milestoneName: "Municipal Ward Deployment & LoRaWAN Gateway Network",
    milestoneDescription: "Physical pole-mounting of 40 optical particulate nodes across Wards 14, 18, 22, and 29. Integration of encrypted LoRaWAN telemetry pushing into Lucknow ICCC.",
    milestoneWeight: 25,
    amount: 650000,
    currency: "INR",
    dueDate: "2026-06-30",
    invoice: {
      invoiceNumber: "INV-AS-2026-02",
      invoiceDate: "2026-06-26",
      fileName: "Tax_Invoice_INV-AS-2026-02_WardDeployment.pdf",
      fileUrl: "/invoices/INV-AS-2026-02.pdf",
      amount: 650000,
      gstin: "09AAACA1234B1Z5",
      hsnSacCode: "998313",
    },
    status: "Paid",
    approval: {
      approvedBy: "Sunita Deshmukh (Procurement Officer)",
      approvedAt: "2026-06-28T11:20:00Z",
      remarks: "All 40 streetlight sensor mounts physically inspected. ICCC MQTT live data feed verified by Smart City command room.",
      digitalSignature: "SHA256:88bc2a319f001928475812903491028456102934",
    },
    reference: "TREAS-UP-2026-9841203",
    timestamp: "2026-07-02T14:30:00Z",
    escrowAccount: "SBI Treasury Escrow Pool #UP-SMART-88219",
    beneficiary: {
      startupName: "AirSense Technologies Pvt Ltd",
      dpiitReg: "DIPP98214",
      bankName: "State Bank of India",
      accountNumberMasked: "••••••••4819",
      ifscCode: "SBIN0001256",
      branch: "Hazratganj Main Branch, Lucknow",
    },
    relatedDeliverablesCount: 3,
    completedDeliverablesCount: 3,
    kpiSummary: "Network Coverage 88.5% (Target ≥ 85%)",
    evidenceCount: 2,
    history: [
      {
        id: "hist-2-1",
        timestamp: "2026-05-15T09:00:00Z",
        actor: "Directorate of Urban Development",
        action: "TRANCHE_CREATED",
        note: "Tranche 2 (₹6,50,000) committed in Treasury Escrow.",
      },
      {
        id: "hist-2-2",
        timestamp: "2026-06-26T14:10:00Z",
        actor: "AirSense Technologies (Finance)",
        action: "INVOICE_SUBMITTED",
        note: "Submitted Tax Invoice INV-AS-2026-02 with GIS Shapefiles.",
      },
      {
        id: "hist-2-3",
        timestamp: "2026-06-28T11:20:00Z",
        actor: "Sunita Deshmukh (Procurement Officer)",
        action: "DISBURSEMENT_APPROVED",
        note: "Municipal field inspection completed. Authorized payment tranche 2.",
      },
      {
        id: "hist-2-4",
        timestamp: "2026-07-02T14:30:00Z",
        actor: "UP State Treasury Nodal Officer",
        action: "ESCROW_DISBURSED",
        note: "NEFT credit released to beneficiary account. UTR: TREAS-UP-2026-9841203.",
        reference: "TREAS-UP-2026-9841203",
      },
    ],
  },
  {
    id: "PAY-UP-UAQ-03",
    pilotId: "PILOT-UP-UAQ-01",
    pilotTitle: "Urban Air Quality Hyperlocal Monitoring — Lucknow Pilot",
    milestoneId: "m3",
    milestoneCode: "M3",
    milestoneName: "Continuous 60-Day Telemetry & Automated Misting Triggers",
    milestoneDescription: "Maintain ≥ 95% node uptime, transmit continuous 60-day time-series telemetry, and validate autonomous misting truck dispatch triggers upon localized PM threshold exceedances.",
    milestoneWeight: 25,
    amount: 650000,
    currency: "INR",
    dueDate: "2026-07-31",
    invoice: {
      invoiceNumber: "INV-AS-2026-03",
      invoiceDate: "2026-07-28",
      fileName: "Tax_Invoice_INV-AS-2026-03_TelemetryMisting.pdf",
      fileUrl: "/invoices/INV-AS-2026-03.pdf",
      amount: 650000,
      gstin: "09AAACA1234B1Z5",
      hsnSacCode: "998313",
    },
    status: "Approved",
    approval: {
      approvedBy: "Rajesh Verma (Director of Urban Development)",
      approvedAt: "2026-08-02T16:00:00Z",
      remarks: "Field telemetry demonstrates 97.2% uptime. 18 automated misting truck dispatches successfully geofenced. Escrow release authorization granted, awaiting final treasury batch execution.",
      digitalSignature: "SHA256:7721ab93c4e51230098471182390145293847561",
    },
    reference: "TREAS-AUTH-UP-2026-3391",
    timestamp: "2026-08-02T16:00:00Z",
    escrowAccount: "SBI Treasury Escrow Pool #UP-SMART-88219",
    beneficiary: {
      startupName: "AirSense Technologies Pvt Ltd",
      dpiitReg: "DIPP98214",
      bankName: "State Bank of India",
      accountNumberMasked: "••••••••4819",
      ifscCode: "SBIN0001256",
      branch: "Hazratganj Main Branch, Lucknow",
    },
    relatedDeliverablesCount: 3,
    completedDeliverablesCount: 3,
    kpiSummary: "Telemetry Uptime 97.2% (Target ≥ 95%)",
    evidenceCount: 2,
    history: [
      {
        id: "hist-3-1",
        timestamp: "2026-05-15T09:00:00Z",
        actor: "Directorate of Urban Development",
        action: "TRANCHE_CREATED",
        note: "Tranche 3 (₹6,50,000) committed in Treasury Escrow.",
      },
      {
        id: "hist-3-2",
        timestamp: "2026-07-28T16:45:00Z",
        actor: "AirSense Technologies (Finance)",
        action: "INVOICE_SUBMITTED",
        note: "Submitted Tax Invoice INV-AS-2026-03 alongside 60-day parquet dataset.",
      },
      {
        id: "hist-3-3",
        timestamp: "2026-08-02T16:00:00Z",
        actor: "Rajesh Verma (Gov Officer)",
        action: "DISBURSEMENT_APPROVED",
        note: "Approved by Department. Warrant TREAS-AUTH-UP-2026-3391 queued for batch escrow clearing.",
        reference: "TREAS-AUTH-UP-2026-3391",
      },
    ],
  },
  {
    id: "PAY-UP-UAQ-04",
    pilotId: "PILOT-UP-UAQ-01",
    pilotTitle: "Urban Air Quality Hyperlocal Monitoring — Lucknow Pilot",
    milestoneId: "m4",
    milestoneCode: "M4",
    milestoneName: "Third-Party Empirical Audit & Environmental Validation",
    milestoneDescription: "Accredited testing agency (TERI) conducts unannounced parallel collocated audits to certify regression linearity and mean absolute percentage error.",
    milestoneWeight: 15,
    amount: 400000,
    currency: "INR",
    dueDate: "2026-08-10",
    invoice: {
      invoiceNumber: "INV-AS-2026-04-DRAFT",
      invoiceDate: "2026-08-08",
      fileName: "Proforma_Invoice_INV-AS-2026-04.pdf",
      fileUrl: "/invoices/INV-AS-2026-04.pdf",
      amount: 400000,
      gstin: "09AAACA1234B1Z5",
      hsnSacCode: "998313",
    },
    status: "Pending",
    approval: null,
    reference: null,
    timestamp: "2026-08-08T10:00:00Z",
    escrowAccount: "SBI Treasury Escrow Pool #UP-SMART-88219",
    beneficiary: {
      startupName: "AirSense Technologies Pvt Ltd",
      dpiitReg: "DIPP98214",
      bankName: "State Bank of India",
      accountNumberMasked: "••••••••4819",
      ifscCode: "SBIN0001256",
      branch: "Hazratganj Main Branch, Lucknow",
    },
    relatedDeliverablesCount: 2,
    completedDeliverablesCount: 1,
    kpiSummary: "MAPE vs Reference 3.4% (Target ≤ 5%)",
    evidenceCount: 1,
    history: [
      {
        id: "hist-4-1",
        timestamp: "2026-05-15T09:00:00Z",
        actor: "Directorate of Urban Development",
        action: "TRANCHE_CREATED",
        note: "Tranche 4 (₹4,00,000) held in Escrow Reserve pending TERI validation audit.",
      },
    ],
  },
  {
    id: "PAY-UP-UAQ-05",
    pilotId: "PILOT-UP-UAQ-01",
    pilotTitle: "Urban Air Quality Hyperlocal Monitoring — Lucknow Pilot",
    milestoneId: "m5",
    milestoneCode: "M5",
    milestoneName: "Replication Blueprint & Scale Transition Handover",
    milestoneDescription: "Formulate municipal operations and maintenance handbook, open-source API adapters, and scale transition blueprint for replication across 17 Uttar Pradesh Smart Cities.",
    milestoneWeight: 15,
    amount: 250000,
    currency: "INR",
    dueDate: "2026-08-25",
    invoice: null,
    status: "Pending",
    approval: null,
    reference: null,
    timestamp: "2026-05-15T09:00:00Z",
    escrowAccount: "SBI Treasury Escrow Pool #UP-SMART-88219",
    beneficiary: {
      startupName: "AirSense Technologies Pvt Ltd",
      dpiitReg: "DIPP98214",
      bankName: "State Bank of India",
      accountNumberMasked: "••••••••4819",
      ifscCode: "SBIN0001256",
      branch: "Hazratganj Main Branch, Lucknow",
    },
    relatedDeliverablesCount: 3,
    completedDeliverablesCount: 0,
    kpiSummary: "Final Municipal Acceptance (Scheduled)",
    evidenceCount: 0,
    history: [
      {
        id: "hist-5-1",
        timestamp: "2026-05-15T09:00:00Z",
        actor: "Directorate of Urban Development",
        action: "TRANCHE_CREATED",
        note: "Final Tranche 5 (₹2,50,000) committed upon final handover sign-off.",
      },
    ],
  },
];

class PaymentDatabase {
  private payments: PaymentRecord[] = [...INITIAL_PAYMENTS];

  public getAllPayments(pilotId?: string): PaymentRecord[] {
    if (!pilotId) return [...this.payments];
    return this.payments.filter((p) => p.pilotId === pilotId);
  }

  public getPaymentById(id: string): PaymentRecord | undefined {
    return this.payments.find((p) => p.id === id);
  }

  public getPaymentByMilestone(milestoneIdOrCode: string): PaymentRecord | undefined {
    return this.payments.find(
      (p) =>
        p.milestoneId.toLowerCase() === milestoneIdOrCode.toLowerCase() ||
        p.milestoneCode.toLowerCase() === milestoneIdOrCode.toLowerCase()
    );
  }

  public getPilotFinancialSummary(pilotId: string = "PILOT-UP-UAQ-01"): PilotFinancialSummary {
    const pilotPayments = this.getAllPayments(pilotId);
    
    // Contract Value is the fixed total of all tranches
    const contractValue = pilotPayments.reduce((acc, p) => acc + p.amount, 0);

    // Paid: status === "Paid"
    const paid = pilotPayments
      .filter((p) => p.status === "Paid")
      .reduce((acc, p) => acc + p.amount, 0);

    // Approved: status === "Approved"
    const approved = pilotPayments
      .filter((p) => p.status === "Approved")
      .reduce((acc, p) => acc + p.amount, 0);

    // Pending: status === "Pending" | "Submitted" | "Under Review"
    const pending = pilotPayments
      .filter((p) => ["Pending", "Submitted", "Under Review"].includes(p.status))
      .reduce((acc, p) => acc + p.amount, 0);

    // Remaining: Total contract value minus (Paid + Approved)
    const remaining = Math.max(0, contractValue - (paid + approved));

    const paidMilestonesCount = pilotPayments.filter((p) => p.status === "Paid").length;
    const approvedMilestonesCount = pilotPayments.filter((p) => p.status === "Approved").length;
    const pendingMilestonesCount = pilotPayments.filter((p) =>
      ["Pending", "Submitted", "Under Review"].includes(p.status)
    ).length;
    const delayedCount = pilotPayments.filter((p) => p.status === "Delayed").length;

    return {
      pilotId,
      pilotTitle: pilotPayments[0]?.pilotTitle || "Pilot Deployment",
      contractValue,
      paid,
      approved,
      pending,
      remaining,
      currency: "INR",
      totalMilestones: pilotPayments.length,
      paidMilestonesCount,
      approvedMilestonesCount,
      pendingMilestonesCount,
      delayedCount,
      escrowAgency: "State Bank of India Treasury Branch",
      nodalTreasury: "Directorate of Urban Development, Govt of UP",
    };
  }

  public submitInvoice(
    paymentId: string,
    invoice: PaymentInvoice,
    submitter: string = "AirSense Technologies (Finance)"
  ): PaymentRecord | null {
    const payment = this.getPaymentById(paymentId);
    if (!payment) return null;

    payment.invoice = invoice;
    payment.status = "Submitted";
    payment.timestamp = new Date().toISOString();
    payment.history.unshift({
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: submitter,
      action: "INVOICE_SUBMITTED",
      note: `Tax invoice ${invoice.invoiceNumber} (₹${invoice.amount.toLocaleString("en-IN")}) submitted for verification.`,
    });

    return { ...payment };
  }

  public reviewPayment(
    paymentId: string,
    reviewer: string = "Sunita Deshmukh (Procurement Officer)",
    remarks?: string
  ): PaymentRecord | null {
    const payment = this.getPaymentById(paymentId);
    if (!payment) return null;

    payment.status = "Under Review";
    payment.timestamp = new Date().toISOString();
    payment.history.unshift({
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: reviewer,
      action: "UNDER_REVIEW",
      note: remarks || "Invoice and milestone evidence under official statutory review.",
    });

    return { ...payment };
  }

  public approvePayment(
    paymentId: string,
    approver: string,
    remarks: string
  ): PaymentRecord | null {
    const payment = this.getPaymentById(paymentId);
    if (!payment) return null;

    const voucherRef = `TREAS-AUTH-UP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    payment.status = "Approved";
    payment.approval = {
      approvedBy: approver,
      approvedAt: new Date().toISOString(),
      remarks,
      digitalSignature: `SHA256:${Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("")}`,
    };
    payment.reference = voucherRef;
    payment.timestamp = new Date().toISOString();
    payment.history.unshift({
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: approver,
      action: "DISBURSEMENT_APPROVED",
      note: `Escrow release approved. Warrant voucher: ${voucherRef}. Remarks: ${remarks}`,
      reference: voucherRef,
    });

    return { ...payment };
  }

  public disbursePayment(
    paymentId: string,
    nodalOfficer: string = "UP State Treasury Nodal Officer",
    utrNumber?: string
  ): PaymentRecord | null {
    const payment = this.getPaymentById(paymentId);
    if (!payment) return null;

    const generatedUtr = utrNumber || `TREAS-UP-2026-${Math.floor(1000000 + Math.random() * 9000000)}`;
    payment.status = "Paid";
    payment.reference = generatedUtr;
    payment.timestamp = new Date().toISOString();
    payment.history.unshift({
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: nodalOfficer,
      action: "ESCROW_DISBURSED",
      note: `Funds released from Public Treasury Escrow to beneficiary account. RBI UTR: ${generatedUtr}.`,
      reference: generatedUtr,
    });

    return { ...payment };
  }

  public rejectPayment(
    paymentId: string,
    rejecter: string,
    rejectionReason: string
  ): PaymentRecord | null {
    const payment = this.getPaymentById(paymentId);
    if (!payment) return null;

    payment.status = "Rejected";
    payment.approval = {
      rejectedBy: rejecter,
      rejectedAt: new Date().toISOString(),
      remarks: rejectionReason,
    };
    payment.timestamp = new Date().toISOString();
    payment.history.unshift({
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: rejecter,
      action: "DISBURSEMENT_REJECTED",
      note: `Payment claim rejected. Reason: ${rejectionReason}`,
    });

    return { ...payment };
  }

  public delayPayment(
    paymentId: string,
    officer: string,
    reason: string,
    revisedDueDate?: string
  ): PaymentRecord | null {
    const payment = this.getPaymentById(paymentId);
    if (!payment) return null;

    payment.status = "Delayed";
    if (revisedDueDate) {
      payment.dueDate = revisedDueDate;
    }
    payment.timestamp = new Date().toISOString();
    payment.history.unshift({
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: officer,
      action: "PAYMENT_DELAYED",
      note: `Milestone disbursement flagged as Delayed. Reason: ${reason}${revisedDueDate ? `. Revised due date: ${revisedDueDate}` : ""}`,
    });

    return { ...payment };
  }

  public resetToDefaults(): void {
    this.payments = [...INITIAL_PAYMENTS];
  }
}

export const paymentDb = new PaymentDatabase();
