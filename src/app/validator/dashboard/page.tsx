"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/auth/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { MOCK_VALIDATION_REPORT, MOCK_PILOTS } from "@/database/mockData";
import { ShellModulePlaceholder } from "@/components/layout/ShellModulePlaceholder";
import { ShieldCheck, FileCheck, CheckCircle2, Award, Lock, ExternalLink } from "lucide-react";

function ValidatorDashboardContent() {
  const { currentUser } = useAuth();
  const searchParams = useSearchParams();
  const tab = searchParams?.get("tab") || "overview";
  const report = MOCK_VALIDATION_REPORT;
  const pilot = MOCK_PILOTS[0];

  if (tab !== "overview" && tab !== "assigned-pilots") {
    const tabConfigs: Record<string, { title: string; desc: string; count?: string; action?: string }> = {
      evidence: {
        title: "Cryptographic Evidence Review & SHA-256 Audit",
        desc: "Inspect raw time-series CSVs, GIS installation coordinates, and collocated calibration curves with hash validation.",
        count: "14 Evidence Records",
        action: "Verify Checksums",
      },
      validation: {
        title: "Objective KPI Benchmark Audit Workbench",
        desc: "Collocated sensor regression audit comparing optical counters against reference CPCB BAM-1020 monitors.",
        count: "3 KPIs Audited (All Exceeded)",
        action: "Record Audit Findings",
      },
      reports: {
        title: "Official Validation Reports & Scaling Endorsements",
        desc: "Published verification findings (Validated, Partially Validated, or Not Validated) submitted to the Procurement Committee.",
        count: "1 Certified Report",
        action: "Download Signed PDF",
      },
    };

    const cfg = tabConfigs[tab] || {
      title: tab.charAt(0).toUpperCase() + tab.slice(1).replace(/-/g, " "),
      desc: `Validator module for ${tab}.`,
    };

    return (
      <ShellModulePlaceholder
        moduleName={cfg.title}
        role="INDEPENDENT VALIDATOR"
        description={cfg.desc}
        itemCount={cfg.count}
        actionLabel={cfg.action}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gov-border pb-5">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Badge variant="default" className="bg-teal-800 font-mono text-[10px]">
              INDEPENDENT VALIDATOR CLEARANCE
            </Badge>
            <Badge variant="outline" className="text-teal-700 border-teal-300 bg-teal-50 text-[10px]">
              THIRD-PARTY ACCREDITATION
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-gov-primary tracking-tight">
            Independent Verification & Audit Studio
          </h1>
          <p className="text-xs text-gov-muted">
            Empirical KPI validation, physical site inspections, sensor regression, and formal audit reports
          </p>
        </div>

        <Badge variant="outline" className="border-blue-300 text-gov-primary bg-blue-50/50">
          Auditor: {currentUser?.firstName} {currentUser?.lastName}
        </Badge>
      </div>

      {/* Validation Authority Banner (Section 14 & 33) */}
      <div className="bg-teal-50/70 border border-teal-200/80 rounded-card p-4 space-y-1.5 text-xs text-teal-950">
        <div className="flex items-center space-x-2 font-semibold">
          <ShieldCheck className="w-5 h-5 text-teal-700" />
          <span>Independent Third-Party Mandate (Section 14):</span>
        </div>
        <p className="text-teal-900 leading-relaxed">
          Validators operate outside the line department to independently audit data sources, baseline methodologies, and sensor calibration. A pilot cannot proceed to final milestone payment or city-wide scale-up without an objective Validation Report.
        </p>
      </div>

      {/* Assigned Pilot Verification Audit */}
      <section className="bg-white border border-gov-border rounded-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
          <div>
            <span className="text-[10px] font-mono text-gov-muted uppercase">ASSIGNED AUDIT #{pilot.pilotCode}</span>
            <h2 className="text-lg font-bold text-gov-primary mt-0.5">{pilot.title}</h2>
            <p className="text-xs text-gov-muted">Location: {pilot.locationName} • Duration: 90 Days</p>
          </div>
          <Badge variant="success" className="self-start sm:self-auto text-xs px-3 py-1">
            OUTCOME: {report.outcome}
          </Badge>
        </div>

        <div className="space-y-2 text-xs">
          <span className="font-semibold text-slate-800 block">Audited KPI Measurements Summary:</span>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Verified Baseline</TableHead>
                <TableHead>Verified Outcome</TableHead>
                <TableHead>Target Met?</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.kpiAuditSummary.map((k) => (
                <TableRow key={k.kpiId}>
                  <TableCell className="font-semibold text-xs">{k.metricName}</TableCell>
                  <TableCell className="font-mono text-xs">{k.verifiedBaseline}%</TableCell>
                  <TableCell className="font-mono font-bold text-xs text-emerald-700">
                    {k.verifiedOutcome}%
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center text-emerald-700 font-semibold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified Target Exceeded
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-control p-3.5 space-y-2 text-xs">
          <div>
            <strong className="text-slate-800">Verified Technical Strengths: </strong>
            <span className="text-slate-600">{report.verifiedStrengths}</span>
          </div>
          <div>
            <strong className="text-slate-800">Documented Limitations: </strong>
            <span className="text-slate-600">{report.limitationsRecorded}</span>
          </div>
          <div>
            <strong className="text-slate-800">Scale-up Recommendation: </strong>
            <span className="text-slate-600">{report.recommendations}</span>
          </div>
        </div>
      </section>

      {/* Security Test Links */}
      <section className="bg-slate-50 border border-slate-200 rounded-card p-5">
        <div className="flex items-center space-x-2 mb-2 text-slate-800 font-semibold text-xs">
          <Lock className="w-4 h-4 text-gov-primary" />
          <span>RBAC Enforcement Verification:</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link href="/procurement/dashboard">
            <Button size="sm" variant="outline" className="border-red-200 text-gov-danger hover:bg-red-50 text-xs">
              Attempt /procurement/dashboard (Should 403)
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

export default function ValidatorDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-gov-muted">Loading Validator Studio...</div>}>
      <ValidatorDashboardContent />
    </Suspense>
  );
}
