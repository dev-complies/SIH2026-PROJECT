"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/auth/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { MOCK_CHALLENGES } from "@/database/mockData";
import { ShellModulePlaceholder } from "@/components/layout/ShellModulePlaceholder";
import { ShieldCheck, EyeOff, FileText, CheckCircle2, Lock, AlertTriangle } from "lucide-react";

function ExpertDashboardContent() {
  const { currentUser } = useAuth();
  const searchParams = useSearchParams();
  const tab = searchParams?.get("tab") || "overview";
  const challenge = MOCK_CHALLENGES[0];
  const [coiSigned, setCoiSigned] = useState(true);

  if (tab !== "overview" && tab !== "assignments") {
    const tabConfigs: Record<string, { title: string; desc: string; count?: string; action?: string }> = {
      evaluations: {
        title: "Proposal Technical Scoring Rubrics",
        desc: "Evaluate technical feasibility, ward problem fit, scalability, lifecycle cost, and cybersecurity.",
        count: "1 Proposal in Progress",
        action: "Resume Scoring",
      },
      history: {
        title: "Historical Evaluation Archive",
        desc: "Review past evaluated challenges, score justifications, and municipal shortlisting outcomes.",
        count: "6 Completed Appraisals",
        action: "Download Appraisal History",
      },
      profile: {
        title: "Expert Evaluator Accreditation & Domain Profile",
        desc: "Institutional affiliation (IIT Kanpur), subject matter expertise, and annual COI declaration registry.",
        count: "Verified Evaluator",
        action: "Update Domain Specializations",
      },
    };

    const cfg = tabConfigs[tab] || {
      title: tab.charAt(0).toUpperCase() + tab.slice(1).replace(/-/g, " "),
      desc: `Expert review module for ${tab}.`,
    };

    return (
      <ShellModulePlaceholder
        moduleName={cfg.title}
        role="EXPERT EVALUATOR"
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
            <Badge variant="default" className="bg-purple-800 font-mono text-[10px]">
              EXPERT EVALUATOR CLEARANCE
            </Badge>
            <Badge variant="outline" className="text-purple-700 border-purple-300 bg-purple-50 text-[10px]">
              BLIND SCORING ACTIVE
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-gov-primary tracking-tight">
            Independent Technical Evaluation Desk
          </h1>
          <p className="text-xs text-gov-muted">
            Unbiased rubric-based assessment of competitive innovation proposals
          </p>
        </div>

        <Badge variant="outline" className="border-blue-300 text-gov-primary bg-blue-50/50">
          Evaluator: {currentUser?.firstName} {currentUser?.lastName}
        </Badge>
      </div>

      {/* Blind Evaluation & Conflict of Interest Banner (Section 13) */}
      <div className="bg-purple-50/70 border border-purple-200/80 rounded-card p-4 space-y-2 text-xs text-purple-950">
        <div className="flex items-center space-x-2 font-semibold">
          <EyeOff className="w-5 h-5 text-purple-700" />
          <span>Blind Evaluation Protocol Enforced (Section 13):</span>
        </div>
        <p className="text-purple-900 leading-relaxed">
          Applicant corporate identities, shareholder names, and commercial client relationships are programmatically masked. You cannot inspect peer evaluator scorecards until your evaluation is locked and submitted.
        </p>
        <div className="flex items-center space-x-2 pt-1 font-mono text-[11px] text-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Conflict of Interest Declaration: Signed on 2026-02-20</span>
        </div>
      </div>

      {/* Assigned Evaluation Proposals */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gov-primary">Assigned Proposals for Evaluation</h2>
            <p className="text-xs text-gov-muted">Challenge: {challenge.title} ({challenge.code})</p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Anonymized Identifier</TableHead>
              <TableHead>Proposed Technical Solution</TableHead>
              <TableHead>Domain Category</TableHead>
              <TableHead>Your Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-mono font-semibold text-xs text-gov-primary">
                APPLICANT #APP-2026-01
              </TableCell>
              <TableCell>
                <div className="font-semibold text-xs text-slate-900">
                  Hyperlocal AI Sensor Mesh & Automated Anomaly Detection
                </div>
                <div className="text-[11px] text-gov-muted">
                  [Company Identity Masked] • Proposed Duration: 12 Weeks
                </div>
              </TableCell>
              <TableCell className="text-xs">IoT CleanTech</TableCell>
              <TableCell className="font-bold text-xs text-emerald-700">92.5 / 100</TableCell>
              <TableCell>
                <Badge variant="success" className="text-[10px]">
                  SUBMITTED & LOCKED
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline" className="text-xs h-8">
                  <FileText className="w-3.5 h-3.5 mr-1" /> View Scorecard
                </Button>
              </TableCell>
            </TableRow>
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
          <Link href="/procurement/dashboard">
            <Button size="sm" variant="outline" className="border-red-200 text-gov-danger hover:bg-red-50 text-xs">
              Attempt /procurement/dashboard (Should 403)
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function ExpertDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-gov-muted">Loading Expert Desk...</div>}>
      <ExpertDashboardContent />
    </Suspense>
  );
}
