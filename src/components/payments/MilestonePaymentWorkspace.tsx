"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/auth/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import {
  paymentDb,
  PaymentRecord,
  PaymentStatus,
  PilotFinancialSummary,
  PaymentInvoice,
} from "@/database/paymentDatabase";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  AlertTriangle,
  FileText,
  Building2,
  ShieldCheck,
  Send,
  Eye,
  Download,
  ExternalLink,
  ChevronRight,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Landmark,
  FileCheck,
  Info,
  X,
  Copy,
  Check,
  RefreshCw,
  Lock,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";

export function MilestonePaymentWorkspace({
  pilotId = "PILOT-UP-UAQ-01",
  onNavigateToMilestones,
}: {
  pilotId?: string;
  onNavigateToMilestones?: (milestoneCode: string) => void;
}) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [summary, setSummary] = useState<PilotFinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | "ALL">("ALL");
  const [selectedMilestone, setSelectedMilestone] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Drawer / Selection
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);

  // Modals
  const [activeModal, setActiveModal] = useState<
    "SUBMIT_INVOICE" | "APPROVE" | "DISBURSE" | "REJECT" | "DELAY" | null
  >(null);
  const [actionPayment, setActionPayment] = useState<PaymentRecord | null>(null);

  // Form states
  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    amount: 0,
    fileName: "",
    gstin: "09AAACA1234B1Z5",
  });
  const [approvalRemarks, setApprovalRemarks] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [delayReason, setDelayReason] = useState("");
  const [revisedDueDate, setRevisedDueDate] = useState("");
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  const isGovOrProcurement =
    currentUser?.role === "GOVERNMENT_OFFICER" ||
    currentUser?.role === "PROCUREMENT_OFFICER" ||
    currentUser?.role === "ADMIN" ||
    currentUser?.role === "PLATFORM_ADMIN";

  const isStartup = currentUser?.role === "STARTUP";
  const currentUserName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : undefined;

  // Load payments and summary
  const loadData = () => {
    try {
      const records = paymentDb.getAllPayments(pilotId);
      const sum = paymentDb.getPilotFinancialSummary(pilotId);
      setPayments(records);
      setSummary(sum);

      // Keep selected payment synchronized if open
      if (selectedPayment) {
        const updated = records.find((p) => p.id === selectedPayment.id);
        if (updated) setSelectedPayment(updated);
      }
    } catch (err) {
      console.error("Failed to load payment data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pilotId]);

  // Filtered payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (selectedStatus !== "ALL" && p.status !== selectedStatus) {
        return false;
      }
      if (selectedMilestone !== "ALL" && p.milestoneCode !== selectedMilestone) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.milestoneName.toLowerCase().includes(q);
        const matchesCode = p.milestoneCode.toLowerCase().includes(q);
        const matchesInvoice = p.invoice?.invoiceNumber.toLowerCase().includes(q);
        const matchesRef = p.reference?.toLowerCase().includes(q);
        return matchesName || matchesCode || matchesInvoice || matchesRef;
      }
      return true;
    });
  }, [payments, selectedStatus, selectedMilestone, searchQuery]);

  // Format currency in Indian numbering format
  const formatINR = (val: number) => {
    return `₹${val.toLocaleString("en-IN")}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUtr(text);
    showToast({
      type: "info",
      title: "Copied to Clipboard",
      description: `Copied ${text}`,
    });
    setTimeout(() => setCopiedUtr(null), 2500);
  };

  // Status badge styling
  const renderStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
            Paid
          </span>
        );
      case "Approved":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800 border border-purple-300">
            <ShieldCheck className="w-3 h-3 mr-1 text-purple-600" />
            Approved
          </span>
        );
      case "Under Review":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 mr-1 text-amber-600" />
            Under Review
          </span>
        );
      case "Submitted":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            <Send className="w-3 h-3 mr-1 text-blue-600" />
            Submitted
          </span>
        );
      case "Delayed":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-100 text-orange-800 border border-orange-300">
            <AlertTriangle className="w-3 h-3 mr-1 text-orange-600" />
            Delayed
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertCircle className="w-3 h-3 mr-1 text-rose-600" />
            Rejected
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <Clock className="w-3 h-3 mr-1 text-slate-500" />
            Pending
          </span>
        );
    }
  };

  // Action Handlers
  const handleOpenInvoiceModal = (payment: PaymentRecord) => {
    setActionPayment(payment);
    setInvoiceForm({
      invoiceNumber: payment.invoice?.invoiceNumber || `INV-AS-2026-0${payment.milestoneCode.replace("M", "")}`,
      invoiceDate: payment.invoice?.invoiceDate || new Date().toISOString().split("T")[0],
      amount: payment.amount,
      fileName: payment.invoice?.fileName || `Tax_Invoice_${payment.milestoneCode}_AirSense.pdf`,
      gstin: payment.invoice?.gstin || "09AAACA1234B1Z5",
    });
    setActiveModal("SUBMIT_INVOICE");
  };

  const handleSubmitInvoice = () => {
    if (!actionPayment) return;
    if (!invoiceForm.invoiceNumber.trim()) {
      showToast({ type: "error", title: "Missing Invoice Number", description: "Please enter a valid invoice number." });
      return;
    }

    const updated = paymentDb.submitInvoice(
      actionPayment.id,
      {
        invoiceNumber: invoiceForm.invoiceNumber,
        invoiceDate: invoiceForm.invoiceDate,
        amount: invoiceForm.amount,
        fileName: invoiceForm.fileName,
        fileUrl: `/invoices/${invoiceForm.invoiceNumber}.pdf`,
        gstin: invoiceForm.gstin,
      },
      currentUserName || "AirSense Technologies (Finance)"
    );

    if (updated) {
      showToast({
        type: "success",
        title: "Invoice Submitted",
        description: `Tax invoice ${invoiceForm.invoiceNumber} submitted for ${actionPayment.milestoneCode}.`,
      });
      loadData();
      setActiveModal(null);
    }
  };

  const handleOpenApproveModal = (payment: PaymentRecord) => {
    setActionPayment(payment);
    setApprovalRemarks(`Verified all ${payment.relatedDeliverablesCount} milestone deliverables and KPI threshold compliance. Recommended for Treasury Escrow release.`);
    setActiveModal("APPROVE");
  };

  const handleApprove = () => {
    if (!actionPayment) return;
    if (!approvalRemarks.trim()) {
      showToast({ type: "error", title: "Remarks Required", description: "Please provide statutory approval justification." });
      return;
    }

    const approverName = currentUserName || "Rajesh Verma (Gov Officer)";
    const updated = paymentDb.approvePayment(actionPayment.id, approverName, approvalRemarks);

    if (updated) {
      showToast({
        type: "success",
        title: "Disbursement Approved",
        description: `Tranche ${actionPayment.milestoneCode} approved for public treasury escrow release.`,
      });
      loadData();
      setActiveModal(null);
    }
  };

  const handleOpenDisburseModal = (payment: PaymentRecord) => {
    setActionPayment(payment);
    setActiveModal("DISBURSE");
  };

  const handleDisburse = () => {
    if (!actionPayment) return;
    const generatedUtr = `TREAS-UP-2026-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const updated = paymentDb.disbursePayment(
      actionPayment.id,
      currentUserName || "UP State Treasury Nodal Officer",
      generatedUtr
    );

    if (updated) {
      showToast({
        type: "success",
        title: "Escrow Disbursed (Paid)",
        description: `Released ${formatINR(actionPayment.amount)} to AirSense. RBI UTR: ${generatedUtr}`,
      });
      loadData();
      setActiveModal(null);
    }
  };

  const handleOpenRejectModal = (payment: PaymentRecord) => {
    setActionPayment(payment);
    setRejectionReason("");
    setActiveModal("REJECT");
  };

  const handleReject = () => {
    if (!actionPayment) return;
    if (!rejectionReason.trim()) {
      showToast({ type: "error", title: "Reason Required", description: "You must provide a clear rejection explanation." });
      return;
    }

    const updated = paymentDb.rejectPayment(
      actionPayment.id,
      currentUserName || "Sunita Deshmukh (Procurement Officer)",
      rejectionReason
    );

    if (updated) {
      showToast({
        type: "warning",
        title: "Claim Rejected",
        description: `Disbursement claim for ${actionPayment.milestoneCode} has been rejected.`,
      });
      loadData();
      setActiveModal(null);
    }
  };

  const handleOpenDelayModal = (payment: PaymentRecord) => {
    setActionPayment(payment);
    setDelayReason("Deliverable verification delayed awaiting third-party test chamber accreditation.");
    setRevisedDueDate("2026-08-30");
    setActiveModal("DELAY");
  };

  const handleDelay = () => {
    if (!actionPayment) return;
    if (!delayReason.trim()) {
      showToast({ type: "error", title: "Reason Required", description: "Please explain the cause for payment delay." });
      return;
    }

    const updated = paymentDb.delayPayment(
      actionPayment.id,
      currentUserName || "Sunita Deshmukh (Procurement Officer)",
      delayReason,
      revisedDueDate || undefined
    );

    if (updated) {
      showToast({
        type: "warning",
        title: "Payment Marked Delayed",
        description: `Milestone ${actionPayment.milestoneCode} flagged as Delayed.`,
      });
      loadData();
      setActiveModal(null);
    }
  };

  const handleMoveToReview = (payment: PaymentRecord) => {
    const updated = paymentDb.reviewPayment(
      payment.id,
      currentUserName || "Sunita Deshmukh (Procurement Officer)",
      "Officer started verification of invoice documents and milestone logs."
    );
    if (updated) {
      showToast({
        type: "info",
        title: "Status: Under Review",
        description: `${payment.milestoneCode} invoice is now under review.`,
      });
      loadData();
    }
  };

  if (loading || !summary) {
    return (
      <div className="p-8 text-center text-slate-500">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gov-primary" />
        <p className="text-sm">Loading Treasury Disbursement Ledger...</p>
      </div>
    );
  }

  // Calculate percentage shares for financial summary bar
  const paidPct = Math.round((summary.paid / summary.contractValue) * 100);
  const approvedPct = Math.round((summary.approved / summary.contractValue) * 100);
  const pendingPct = Math.round((summary.pending / summary.contractValue) * 100);
  const remainingPct = Math.max(0, 100 - (paidPct + approvedPct + pendingPct));

  return (
    <div className="space-y-6">
      {/* Prototype Context Banner */}
      <div className="rounded-card border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 flex items-start justify-between shadow-2xs">
        <div className="flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold text-amber-950">
              Mock Treasury Escrow & Disbursement Simulation (GFR Rule 149 Compliant):
            </span>{" "}
            This prototype tracks milestone performance disbursements backed by public treasury escrow.
            Real banking API rails are simulated with cryptographic authorization vouchers and RBI-NEFT mock UTR references.
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-1 shrink-0 font-mono text-[11px] text-amber-800 bg-white/80 px-2 py-0.5 rounded border border-amber-200">
          <Landmark className="w-3 h-3 text-amber-600" />
          <span>SBI Escrow #UP-SMART-88219</span>
        </div>
      </div>

      {/* PILOT FINANCIAL SUMMARY CARD */}
      <div className="bg-white border border-slate-200 rounded-card p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gov-light text-gov-primary border border-gov-border">
                {summary.pilotId}
              </span>
              <span className="text-xs text-gov-muted font-medium">Urban Development Directorate</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              {summary.pilotTitle} — Financial Ledger
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              className="text-xs text-slate-600 hover:text-slate-900"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Refresh Ledger
            </Button>
            {onNavigateToMilestones && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateToMilestones("M1")}
                className="text-xs text-gov-primary border-gov-primary/30 hover:bg-gov-light"
              >
                <Layers className="w-3.5 h-3.5 mr-1.5" />
                View Milestones
              </Button>
            )}
          </div>
        </div>

        {/* 5-Card Financial Grid: Contract Value, Paid, Approved, Pending, Remaining */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* 1. Contract Value */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Contract Value
            </span>
            <div className="mt-2">
              <div className="text-xl font-mono font-bold text-slate-900">
                {formatINR(summary.contractValue)}
              </div>
              <div className="text-[10px] text-gov-muted mt-0.5">5 Performance Tranches</div>
            </div>
          </div>

          {/* 2. Paid */}
          <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/40 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                Paid
              </span>
              <span className="text-[10px] font-bold font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                {paidPct}%
              </span>
            </div>
            <div className="mt-2">
              <div className="text-xl font-mono font-bold text-emerald-700">
                {formatINR(summary.paid)}
              </div>
              <div className="text-[10px] text-emerald-800/80 mt-0.5">
                {summary.paidMilestonesCount} Tranches Disbursed
              </div>
            </div>
          </div>

          {/* 3. Approved */}
          <div className="p-3.5 rounded-lg border border-purple-200 bg-purple-50/40 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-purple-800 uppercase tracking-wider">
                Approved
              </span>
              <span className="text-[10px] font-bold font-mono text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded">
                {approvedPct}%
              </span>
            </div>
            <div className="mt-2">
              <div className="text-xl font-mono font-bold text-purple-700">
                {formatINR(summary.approved)}
              </div>
              <div className="text-[10px] text-purple-800/80 mt-0.5">
                {summary.approvedMilestonesCount} Ready for Release
              </div>
            </div>
          </div>

          {/* 4. Pending */}
          <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/40 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                Pending
              </span>
              <span className="text-[10px] font-bold font-mono text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                {pendingPct}%
              </span>
            </div>
            <div className="mt-2">
              <div className="text-xl font-mono font-bold text-amber-700">
                {formatINR(summary.pending)}
              </div>
              <div className="text-[10px] text-amber-800/80 mt-0.5">
                {summary.pendingMilestonesCount} Tranches in Pipeline
              </div>
            </div>
          </div>

          {/* 5. Remaining */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-100/70 flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Remaining
              </span>
              <span className="text-[10px] font-bold font-mono text-slate-600 bg-slate-200 px-1.5 py-0.2 rounded">
                {remainingPct}%
              </span>
            </div>
            <div className="mt-2">
              <div className="text-xl font-mono font-bold text-slate-800">
                {formatINR(summary.remaining)}
              </div>
              <div className="text-[10px] text-gov-muted mt-0.5">Unallocated Escrow Reserve</div>
            </div>
          </div>
        </div>

        {/* Visual Disbursement Progress Bar */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1.5">
            <span>Escrow Allocation Breakdown:</span>
            <span>
              <span className="text-emerald-700 font-bold">{paidPct}% Disbursed</span>
              <span className="text-slate-400 mx-1.5">•</span>
              <span className="text-purple-700 font-bold">{approvedPct}% Approved</span>
              <span className="text-slate-400 mx-1.5">•</span>
              <span className="text-amber-700 font-bold">{pendingPct}% Pending</span>
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${paidPct}%` }}
              title={`Paid: ${formatINR(summary.paid)} (${paidPct}%)`}
              className="bg-emerald-500 h-full transition-all duration-300"
            />
            <div
              style={{ width: `${approvedPct}%` }}
              title={`Approved: ${formatINR(summary.approved)} (${approvedPct}%)`}
              className="bg-purple-500 h-full transition-all duration-300"
            />
            <div
              style={{ width: `${pendingPct}%` }}
              title={`Pending: ${formatINR(summary.pending)} (${pendingPct}%)`}
              className="bg-amber-400 h-full transition-all duration-300"
            />
            <div
              style={{ width: `${remainingPct}%` }}
              title={`Remaining: ${formatINR(summary.remaining)} (${remainingPct}%)`}
              className="bg-slate-200 h-full transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-card shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Status selector */}
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-gov-muted" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="text-xs font-medium bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-gov-primary"
            >
              <option value="ALL">All Statuses ({payments.length})</option>
              <option value="Paid">Paid</option>
              <option value="Approved">Approved</option>
              <option value="Under Review">Under Review</option>
              <option value="Submitted">Submitted</option>
              <option value="Pending">Pending</option>
              <option value="Delayed">Delayed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Milestone selector */}
          <select
            value={selectedMilestone}
            onChange={(e) => setSelectedMilestone(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-gov-primary"
          >
            <option value="ALL">All Milestones (M1–M5)</option>
            <option value="M1">M1: Baseline Calibration</option>
            <option value="M2">M2: Ward Deployment</option>
            <option value="M3">M3: 60-Day Telemetry</option>
            <option value="M4">M4: TERI Validation Audit</option>
            <option value="M5">M5: Blueprint & Handover</option>
          </select>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice, UTR, milestone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-primary"
          />
        </div>
      </div>

      {/* PAYMENTS TABLE */}
      <div className="bg-white border border-slate-200 rounded-card overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-mono text-gov-muted">
              <tr>
                <th className="p-3.5">Milestone</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5">Invoice</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Approval</th>
                <th className="p-3.5">Treasury Reference</th>
                <th className="p-3.5">Last Updated</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((payment) => {
                const isSelected = selectedPayment?.id === payment.id;
                return (
                  <tr
                    key={payment.id}
                    onClick={() => setSelectedPayment(payment)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? "bg-gov-light/40" : "hover:bg-slate-50/70"
                    }`}
                  >
                    {/* Milestone */}
                    <td className="p-3.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                          {payment.milestoneCode}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-900 line-clamp-1 max-w-[200px]" title={payment.milestoneName}>
                            {payment.milestoneName}
                          </div>
                          <div className="text-[10px] text-gov-muted">
                            Weight: {payment.milestoneWeight}% • {payment.completedDeliverablesCount}/{payment.relatedDeliverablesCount} Deliverables
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900 text-sm">
                        {formatINR(payment.amount)}
                      </div>
                      <div className="text-[10px] font-mono text-gov-muted">
                        Tranche {payment.milestoneCode.replace("M", "")}
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-mono text-slate-800 flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{payment.dueDate}</span>
                      </div>
                      {payment.status === "Delayed" && (
                        <span className="text-[10px] text-orange-600 font-semibold block">Extended Deadline</span>
                      )}
                    </td>

                    {/* Invoice */}
                    <td className="p-3.5 whitespace-nowrap">
                      {payment.invoice ? (
                        <div>
                          <div className="font-mono font-semibold text-gov-primary flex items-center space-x-1">
                            <FileText className="w-3 h-3 text-gov-primary" />
                            <span>{payment.invoice.invoiceNumber}</span>
                          </div>
                          <div className="text-[10px] text-gov-muted">
                            Dated {payment.invoice.invoiceDate}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Not Submitted</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-3.5 whitespace-nowrap">
                      {renderStatusBadge(payment.status)}
                    </td>

                    {/* Approval */}
                    <td className="p-3.5">
                      {payment.approval?.approvedBy ? (
                        <div className="max-w-[170px]">
                          <div className="font-medium text-slate-800 line-clamp-1 text-[11px]" title={payment.approval.approvedBy}>
                            {payment.approval.approvedBy.split("(")[0]}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-mono">
                            {payment.approval.approvedAt
                              ? new Date(payment.approval.approvedAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                })
                              : "Signed"}
                          </div>
                        </div>
                      ) : payment.approval?.rejectedBy ? (
                        <div className="max-w-[170px]">
                          <span className="text-[11px] font-semibold text-rose-700">Rejected by Officer</span>
                          <span className="block text-[10px] text-slate-500 line-clamp-1" title={payment.approval.remarks}>
                            {payment.approval.remarks}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Pending Sign-off</span>
                      )}
                    </td>

                    {/* Reference (UTR) */}
                    <td className="p-3.5 whitespace-nowrap font-mono text-[11px]">
                      {payment.reference ? (
                        <div className="flex items-center space-x-1">
                          <span className="text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                            {payment.reference}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(payment.reference!);
                            }}
                            className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700"
                            title="Copy Reference"
                          >
                            {copiedUtr === payment.reference ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>

                    {/* Timestamp */}
                    <td className="p-3.5 whitespace-nowrap font-mono text-slate-600 text-[11px]">
                      {payment.timestamp
                        ? new Date(payment.timestamp).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Action buttons */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5" onClick={(e) => e.stopPropagation()}>
                        {/* Startup can submit invoice for Pending / Delayed */}
                        {isStartup && (payment.status === "Pending" || payment.status === "Delayed") && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenInvoiceModal(payment)}
                            className="h-7 text-[11px] text-gov-primary border-gov-primary/40 hover:bg-gov-light"
                          >
                            <Send className="w-3 h-3 mr-1" />
                            Submit Invoice
                          </Button>
                        )}

                        {/* Gov / Procurement Review & Approval */}
                        {isGovOrProcurement && payment.status === "Submitted" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMoveToReview(payment)}
                            className="h-7 text-[11px] text-amber-700 border-amber-300 hover:bg-amber-50"
                          >
                            <Clock className="w-3 h-3 mr-1" />
                            Review
                          </Button>
                        )}

                        {isGovOrProcurement && (payment.status === "Under Review" || payment.status === "Submitted") && (
                          <Button
                            size="sm"
                            onClick={() => handleOpenApproveModal(payment)}
                            className="h-7 text-[11px] bg-purple-700 hover:bg-purple-800 text-white"
                          >
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                        )}

                        {isGovOrProcurement && payment.status === "Approved" && (
                          <Button
                            size="sm"
                            onClick={() => handleOpenDisburseModal(payment)}
                            className="h-7 text-[11px] bg-emerald-700 hover:bg-emerald-800 text-white"
                          >
                            <CreditCard className="w-3 h-3 mr-1" />
                            Disburse
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedPayment(payment)}
                          className="h-7 text-[11px] text-slate-500 hover:text-slate-800 px-2"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SELECTED PAYMENT DETAIL DRAWER / INSPECTOR */}
      {selectedPayment && (
        <div className="bg-white border-2 border-gov-accent/30 rounded-card p-5 shadow-sm space-y-5 animate-in fade-in duration-200">
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-gov-light text-gov-primary border border-gov-border">
                  {selectedPayment.milestoneCode} Tranche
                </span>
                {renderStatusBadge(selectedPayment.status)}
                <span className="text-xs font-mono text-gov-muted">ID: {selectedPayment.id}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {selectedPayment.milestoneName}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
                {selectedPayment.milestoneDescription}
              </p>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedPayment(null)}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Column 1: Financial & Escrow Specs */}
            <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-lg border border-slate-200 text-xs">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5 border-b border-slate-200 pb-2">
                <Landmark className="w-3.5 h-3.5 text-gov-primary" />
                <span>Treasury Escrow Tranche</span>
              </div>

              <div>
                <span className="text-gov-muted block text-[10px]">Tranche Amount:</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  {formatINR(selectedPayment.amount)}
                </span>
                <span className="text-slate-500 ml-1.5 font-mono text-[11px]">
                  ({selectedPayment.milestoneWeight}% of contract)
                </span>
              </div>

              <div>
                <span className="text-gov-muted block text-[10px]">Statutory Due Date:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {selectedPayment.dueDate}
                </span>
              </div>

              <div>
                <span className="text-gov-muted block text-[10px]">Public Escrow Reserve:</span>
                <span className="font-mono text-slate-700 text-[11px]">
                  {selectedPayment.escrowAccount}
                </span>
              </div>

              <div>
                <span className="text-gov-muted block text-[10px]">Beneficiary Account:</span>
                <span className="font-medium text-slate-800 block">
                  {selectedPayment.beneficiary.startupName}
                </span>
                <span className="font-mono text-[11px] text-slate-600 block">
                  {selectedPayment.beneficiary.bankName} • {selectedPayment.beneficiary.accountNumberMasked}
                </span>
                <span className="font-mono text-[10px] text-gov-muted block">
                  IFSC: {selectedPayment.beneficiary.ifscCode}
                </span>
              </div>
            </div>

            {/* Column 2: Invoice & Approval Credentials */}
            <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-lg border border-slate-200 text-xs">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5 border-b border-slate-200 pb-2">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Invoice & Regulatory Clearance</span>
              </div>

              {selectedPayment.invoice ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gov-muted block text-[10px]">Tax Invoice:</span>
                      <span className="font-mono font-bold text-gov-primary">
                        {selectedPayment.invoice.invoiceNumber}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-[10px] px-2 text-slate-700"
                      onClick={() =>
                        showToast({
                          type: "info",
                          title: "Invoice Download",
                          description: `Downloading ${selectedPayment.invoice?.fileName}...`,
                        })
                      }
                    >
                      <Download className="w-2.5 h-2.5 mr-1" /> PDF
                    </Button>
                  </div>
                  <div>
                    <span className="text-gov-muted block text-[10px]">Startup GSTIN:</span>
                    <span className="font-mono text-slate-700">{selectedPayment.invoice.gstin}</span>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded bg-white border border-dashed border-slate-300 text-center text-slate-500 text-xs">
                  Tax invoice not yet uploaded by startup
                </div>
              )}

              <div className="border-t border-slate-200 pt-2 space-y-1.5">
                <span className="text-gov-muted block text-[10px]">Disbursement Authority:</span>
                {selectedPayment.approval?.approvedBy ? (
                  <div>
                    <span className="font-semibold text-slate-800 block">
                      {selectedPayment.approval.approvedBy}
                    </span>
                    <span className="text-[10px] text-gov-muted block font-mono">
                      Timestamp: {new Date(selectedPayment.approval.approvedAt!).toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-slate-600 italic block mt-1">
                      "{selectedPayment.approval.remarks}"
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-400 italic">Pending officer sign-off</span>
                )}
              </div>

              {selectedPayment.reference && (
                <div className="border-t border-slate-200 pt-2">
                  <span className="text-gov-muted block text-[10px]">Disbursement Ref / RBI UTR:</span>
                  <div className="flex items-center space-x-1 font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    <span>{selectedPayment.reference}</span>
                    <button
                      onClick={() => copyToClipboard(selectedPayment.reference!)}
                      className="ml-auto text-emerald-600 hover:text-emerald-900"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Column 3: Linked Milestone Deliverables & KPI Traceability */}
            <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-lg border border-slate-200 text-xs">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5 border-b border-slate-200 pb-2">
                <Layers className="w-3.5 h-3.5 text-gov-accent" />
                <span>Linked Milestone & KPI Evidence</span>
              </div>

              <div>
                <span className="text-gov-muted block text-[10px]">Deliverable Completion:</span>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="font-mono font-bold text-slate-800">
                    {selectedPayment.completedDeliverablesCount} / {selectedPayment.relatedDeliverablesCount}
                  </span>
                  <span className="text-[10px] text-slate-500">deliverables satisfied</span>
                </div>
              </div>

              <div>
                <span className="text-gov-muted block text-[10px]">CPCB Collocation & Empirical KPI:</span>
                <span className="font-semibold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 block mt-0.5">
                  {selectedPayment.kpiSummary}
                </span>
              </div>

              <div>
                <span className="text-gov-muted block text-[10px]">Evidence Vault Records:</span>
                <span className="font-mono text-slate-700">
                  {selectedPayment.evidenceCount} verified telemetry & calibration artifacts
                </span>
              </div>

              <div className="pt-2">
                <Link
                  href={`/milestones?code=${selectedPayment.milestoneCode}`}
                  className="w-full inline-flex items-center justify-center px-3 py-1.5 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold text-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-gov-primary" />
                  Open Milestone in Milestone Tracker
                </Link>
              </div>
            </div>
          </div>

          {/* Audit Trail Ledger */}
          <div className="border-t border-slate-200 pt-3">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Statutory Disbursement Audit Trail
            </span>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {selectedPayment.history.map((entry) => (
                <div
                  key={entry.id}
                  className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px] flex items-start justify-between"
                >
                  <div>
                    <span className="font-semibold text-slate-800">{entry.action}: </span>
                    <span className="text-slate-600">{entry.note}</span>
                  </div>
                  <div className="text-right shrink-0 ml-3 font-mono text-[10px] text-gov-muted">
                    <div>{entry.actor}</div>
                    <div>{new Date(entry.timestamp).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Officer Action Bar inside Drawer */}
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 pt-3">
            {isGovOrProcurement && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenDelayModal(selectedPayment)}
                  className="text-xs text-orange-700 border-orange-300 hover:bg-orange-50"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Flag Delayed
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenRejectModal(selectedPayment)}
                  className="text-xs text-rose-700 border-rose-300 hover:bg-rose-50"
                >
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Reject Claim
                </Button>
              </>
            )}

            {isStartup && (selectedPayment.status === "Pending" || selectedPayment.status === "Delayed") && (
              <Button
                size="sm"
                onClick={() => handleOpenInvoiceModal(selectedPayment)}
                className="text-xs bg-gov-primary hover:bg-gov-primary/90 text-white"
              >
                <Send className="w-3 h-3 mr-1" />
                Submit Invoice
              </Button>
            )}

            {isGovOrProcurement && selectedPayment.status === "Submitted" && (
              <Button
                size="sm"
                onClick={() => handleOpenApproveModal(selectedPayment)}
                className="text-xs bg-purple-700 hover:bg-purple-800 text-white"
              >
                <ShieldCheck className="w-3 h-3 mr-1" />
                Approve Payment
              </Button>
            )}

            {isGovOrProcurement && selectedPayment.status === "Approved" && (
              <Button
                size="sm"
                onClick={() => handleOpenDisburseModal(selectedPayment)}
                className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                <CreditCard className="w-3 h-3 mr-1" />
                Authorize Escrow Disbursement
              </Button>
            )}
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT INVOICE (STARTUP) */}
      {activeModal === "SUBMIT_INVOICE" && actionPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-card max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Submit Tax Invoice — {actionPayment.milestoneCode}
                </h4>
                <p className="text-xs text-gov-muted">Tranche: {formatINR(actionPayment.amount)}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setActiveModal(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tax Invoice Number <span className="text-rose-600">*</span>
                </label>
                <Input
                  value={invoiceForm.invoiceNumber}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })}
                  placeholder="e.g. INV-AS-2026-04"
                  className="font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Invoice Date</label>
                  <Input
                    type="date"
                    value={invoiceForm.invoiceDate}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, invoiceDate: e.target.value })}
                    className="font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Claim Amount (INR)</label>
                  <Input
                    type="number"
                    value={invoiceForm.amount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: Number(e.target.value) })}
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Startup GSTIN</label>
                <Input
                  value={invoiceForm.gstin}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, gstin: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Invoice Attachment (PDF)</label>
                <div className="border border-dashed border-slate-300 rounded p-3 text-center bg-slate-50">
                  <FileText className="w-6 h-6 mx-auto text-gov-muted mb-1" />
                  <span className="font-mono text-xs text-slate-700 block">{invoiceForm.fileName}</span>
                  <span className="text-[10px] text-gov-muted block">Signed digitally under IT Act 2000</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSubmitInvoice} className="bg-gov-primary hover:bg-gov-primary/90 text-white">
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Submit Invoice Claim
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: APPROVE PAYMENT (GOV / PROCUREMENT) */}
      {activeModal === "APPROVE" && actionPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-card max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Statutory Approval — {actionPayment.milestoneCode}
                </h4>
                <p className="text-xs text-purple-700 font-semibold">
                  Authorize Release of {formatINR(actionPayment.amount)}
                </p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setActiveModal(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-purple-50 p-3 rounded border border-purple-200 text-purple-900">
                <span className="font-semibold block mb-0.5">Disbursement Verification Checklist:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  <li>All {actionPayment.relatedDeliverablesCount} milestone deliverables verified</li>
                  <li>KPI threshold met: {actionPayment.kpiSummary}</li>
                  <li>Valid Tax Invoice on record ({actionPayment.invoice?.invoiceNumber || "Submitted"})</li>
                </ul>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Approval Remarks & Statutory Endorsement <span className="text-rose-600">*</span>
                </label>
                <Textarea
                  rows={3}
                  value={approvalRemarks}
                  onChange={(e) => setApprovalRemarks(e.target.value)}
                  placeholder="State clear reasons for deliverable acceptance..."
                  className="text-xs"
                />
              </div>

              <div className="text-[10px] text-gov-muted flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>An audit log entry with digital cryptographic signature will be recorded.</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleApprove} className="bg-purple-700 hover:bg-purple-800 text-white">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                Confirm Approval
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DISBURSE ESCROW (MARK PAID) */}
      {activeModal === "DISBURSE" && actionPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-card max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Release Escrow Funds — {actionPayment.milestoneCode}
                </h4>
                <p className="text-xs text-emerald-700 font-semibold">
                  Disburse {formatINR(actionPayment.amount)} to AirSense Technologies
                </p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setActiveModal(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1 font-mono text-[11px]">
                <div className="text-slate-600">Escrow Debit: {actionPayment.escrowAccount}</div>
                <div className="text-slate-900 font-bold">Credit Beneficiary: {actionPayment.beneficiary.startupName}</div>
                <div className="text-slate-600">Bank: {actionPayment.beneficiary.bankName} (A/C: {actionPayment.beneficiary.accountNumberMasked})</div>
                <div className="text-slate-600">IFSC: {actionPayment.beneficiary.ifscCode}</div>
              </div>

              <div className="text-[11px] text-slate-600">
                Authorizing release triggers simulated RBI-NEFT settlement and records statutory UTR voucher into the immutable ledger.
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleDisburse} className="bg-emerald-700 hover:bg-emerald-800 text-white">
                <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                Authorize Release (Mark Paid)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REJECT CLAIM */}
      {activeModal === "REJECT" && actionPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-card max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Reject Disbursement Claim — {actionPayment.milestoneCode}
                </h4>
                <p className="text-xs text-rose-600 font-semibold">Mandatory Rejection Explanation</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setActiveModal(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Rejection Reason / Deficiency Details <span className="text-rose-600">*</span>
                </label>
                <Textarea
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why the invoice or deliverables were rejected..."
                  className="text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleReject} className="bg-rose-700 hover:bg-rose-800 text-white">
                <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELAY CLAIM */}
      {activeModal === "DELAY" && actionPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-card max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Flag Payment Delayed — {actionPayment.milestoneCode}
                </h4>
                <p className="text-xs text-orange-600">Tranche: {formatINR(actionPayment.amount)}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setActiveModal(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Cause of Delay <span className="text-rose-600">*</span>
                </label>
                <Textarea
                  rows={3}
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  placeholder="e.g. Awaiting hardware customs clearance / third-party lab certification..."
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Revised Expected Due Date
                </label>
                <Input
                  type="date"
                  value={revisedDueDate}
                  onChange={(e) => setRevisedDueDate(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleDelay} className="bg-orange-600 hover:bg-orange-700 text-white">
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                Flag Delayed
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
