"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/auth/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { MOCK_PAYMENTS } from "@/database/mockData";
import { formatCurrency, formatDate } from "@/utils";
import { ShellModulePlaceholder } from "@/components/layout/ShellModulePlaceholder";
import { ShieldCheck, IndianRupee, CheckCircle2, Lock, FileCheck2, AlertCircle } from "lucide-react";

function ProcurementDashboardContent() {
  const { currentUser } = useAuth();
  const searchParams = useSearchParams();
  const tab = searchParams?.get("tab") || "overview";
  const [payments, setPayments] = useState(MOCK_PAYMENTS);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  if (tab !== "overview" && tab !== "payments") {
    const tabConfigs: Record<string, { title: string; desc: string; count?: string; action?: string }> = {
      pilots: {
        title: "Active Pilots Financial Contracts",
        desc: "Review total sanctioned escrow budgets, disbursed amounts, and remaining contract caps under GFR 149.",
        count: "1 Active Contract",
        action: "Review Contract Caps",
      },
      milestones: {
        title: "Deliverable Milestones Sign-off Gate",
        desc: "Segregation of duties: Authorize payments only after line officer and independent validator approvals.",
        count: "Milestone 3 Ready",
        action: "Inspect Deliverables",
      },
      contracts: {
        title: "Public Procurement & GeM Scale-Up Tenders",
        desc: "Convert validated 90-day pilot technologies into direct city-wide public procurement tenders under Rule 149.",
        count: "1 Scale Tender in Drafting",
        action: "Draft Scale Tender",
      },
      "audit-log": {
        title: "Treasury & Disbursement Audit Trail",
        desc: "Bank transaction references, NEFT clearing records, and authorized officer digital signatures.",
        count: "100% Reconciled",
        action: "Download Bank Advice",
      },
    };

    const cfg = tabConfigs[tab] || {
      title: tab.charAt(0).toUpperCase() + tab.slice(1).replace(/-/g, " "),
      desc: `Procurement module for ${tab}.`,
    };

    return (
      <ShellModulePlaceholder
        moduleName={cfg.title}
        role="PROCUREMENT OFFICER"
        description={cfg.desc}
        itemCount={cfg.count}
        actionLabel={cfg.action}
      />
    );
  }

  const handleApproveDisbursement = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: "PAID",
              approvedBy: currentUser?.id,
              approvedAt: new Date().toISOString(),
              disbursedAt: new Date().toISOString(),
              mockTransactionId: `TXN_MOCK_${Date.now()}`,
            }
          : p
      )
    );
    setActionNotice("Disbursement authorized! Public treasury funds released against verified milestone deliverables.");
  };

  const totalContract = 2200000;
  const totalPaid = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter((p) => p.status === "PENDING_APPROVAL")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gov-border pb-5">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Badge variant="default" className="bg-slate-800 font-mono text-[10px]">
              PROCUREMENT OFFICER CLEARANCE
            </Badge>
            <span className="text-xs text-gov-muted">Public Procurement & Treasury Disbursements</span>
          </div>
          <h1 className="text-2xl font-bold text-gov-primary tracking-tight">
            Procurement & Milestone Payment Queue
          </h1>
          <p className="text-xs text-gov-muted">
            Legal compliance review, milestone financial authorization, and scale-up contracting
          </p>
        </div>

        <Badge variant="outline" className="border-blue-300 text-gov-primary bg-blue-50/50">
          User: {currentUser?.firstName} {currentUser?.lastName}
        </Badge>
      </div>

      {actionNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-control flex items-center space-x-2 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Segregation of Duties Notice */}
      <div className="bg-blue-50/60 border border-blue-200/80 rounded-card p-4 flex items-start space-x-3 text-xs text-blue-900">
        <ShieldCheck className="w-5 h-5 text-gov-accent shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block mb-0.5">Segregation of Duties Enforced:</strong>
          <span>
            Only verified Procurement Officers can authorize fund releases from public accounts. Technical officers may certify deliverable completion, but legal and fiscal disbursement authority remains strictly with the Procurement Officer.
          </span>
        </div>
      </div>

      {/* Financial Summary Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gov-border rounded-control p-4 shadow-2xs">
          <span className="text-xs text-gov-muted font-medium block">Total Pilot Contract Value</span>
          <span className="text-2xl font-bold text-gov-primary">{formatCurrency(totalContract)}</span>
        </div>
        <div className="bg-white border border-gov-border rounded-control p-4 shadow-2xs">
          <span className="text-xs text-gov-muted font-medium block">Total Disbursed (Paid)</span>
          <span className="text-2xl font-bold text-emerald-700">{formatCurrency(totalPaid)}</span>
        </div>
        <div className="bg-white border border-gov-border rounded-control p-4 shadow-2xs">
          <span className="text-xs text-gov-muted font-medium block">Pending Milestone Approval</span>
          <span className="text-2xl font-bold text-amber-700">{formatCurrency(pendingAmount)}</span>
        </div>
      </div>

      {/* Milestone Payments Table */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gov-primary">Milestone Payment Requests</h2>
          <span className="text-xs text-gov-muted">Lucknow Air Quality Pilot (AirSense Technologies)</span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Milestone</TableHead>
              <TableHead>Invoice No.</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Reference</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-semibold text-xs text-slate-800">
                  {p.milestoneId === "m-1"
                    ? "Milestone 1: 10 Nodes & Calibration"
                    : p.milestoneId === "m-2"
                    ? "Milestone 2: 40 Nodes & GIS Telemetry"
                    : "Milestone 3: 90-Day Evaluation & Anomaly Audit"}
                </TableCell>
                <TableCell className="font-mono text-xs">{p.invoiceNumber || "—"}</TableCell>
                <TableCell className="font-semibold text-xs text-gov-primary">
                  {formatCurrency(p.amount)}
                </TableCell>
                <TableCell className="font-mono text-[11px] text-gov-muted">
                  {p.paymentReference || p.mockTransactionId || "Pending Authorization"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={p.status === "PAID" ? "success" : "warning"}
                    className="text-[10px]"
                  >
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {p.status === "PENDING_APPROVAL" ? (
                    <Button
                      size="sm"
                      onClick={() => handleApproveDisbursement(p.id)}
                      className="bg-gov-accent hover:bg-gov-accent-hover text-xs h-8"
                    >
                      Authorize Disbursement
                    </Button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-semibold inline-flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Released
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {/* Security Test Links */}
      <section className="bg-slate-50 border border-slate-200 rounded-card p-5">
        <div className="flex items-center space-x-2 mb-2 text-slate-800 font-semibold text-xs">
          <Lock className="w-4 h-4 text-gov-primary" />
          <span>RBAC Enforcement Verification:</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link href="/gov/dashboard">
            <Button size="sm" variant="outline" className="border-red-200 text-gov-danger hover:bg-red-50 text-xs">
              Attempt /gov/dashboard (Should 403)
            </Button>
          </Link>
          <Link href="/startup/dashboard">
            <Button size="sm" variant="outline" className="border-red-200 text-gov-danger hover:bg-red-50 text-xs">
              Attempt /startup/dashboard (Should 403)
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function ProcurementDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-gov-muted">Loading Procurement Desk...</div>}>
      <ProcurementDashboardContent />
    </Suspense>
  );
}
