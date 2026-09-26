"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/auth/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { MOCK_PILOT_MILESTONES, MOCK_ORGANIZATIONS } from "@/database/mockData";
import { formatCurrency } from "@/utils";
import { ShellModulePlaceholder } from "@/components/layout/ShellModulePlaceholder";
import { StartupCapabilityProfile } from "@/components/startup/StartupCapabilityProfile";
import { StartupApplicationWizard } from "@/components/startup/StartupApplicationWizard";
import { Building, UploadCloud, Shield, CheckCircle2, Clock, Lock, Plus } from "lucide-react";

function StartupDashboardContent() {
  const { currentUser } = useAuth();
  const searchParams = useSearchParams();
  const tab = searchParams?.get("tab") || "overview";
  const org = MOCK_ORGANIZATIONS[0];

  if (tab === "profile") {
    return <StartupCapabilityProfile isEditable={true} />;
  }

  if (tab === "applications") {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-gov-border rounded-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div>
            <span className="text-[10px] font-mono text-gov-accent font-bold uppercase tracking-wider block">
              STARTUP PROCUREMENT WORKSPACE
            </span>
            <h2 className="text-lg font-bold text-gov-primary">
              Application Dossier & Evaluation Status
            </h2>
          </div>
          <Link href="/startup/applications/apply">
            <Button size="sm" className="bg-gov-primary text-xs font-semibold">
              <Plus className="w-3.5 h-3.5 mr-1" /> Formulate New Proposal
            </Button>
          </Link>
        </div>

        <StartupApplicationWizard
          challengeId="chal-air-001"
          initialStatus="UNDER_EVALUATION"
          applicationId="APP-2026-UP-UAQ-041"
        />
      </div>
    );
  }

  if (tab !== "overview") {
    const tabConfigs: Record<string, { title: string; desc: string; count?: string; action?: string }> = {
      "discover-challenges": {
        title: "Discover Municipal & State Challenges",
        desc: "Browse public challenges published by government departments seeking DPIIT-recognized tech startups.",
        count: "4 Active Challenges",
        action: "Browse All Challenges",
      },
      applications: {
        title: "Proposal Submissions & Status Tracker",
        desc: "Track status of submitted proposals, blind evaluation progress, and respond to municipal clarification queries.",
        count: "1 Awarded Application",
        action: "Submit New Proposal",
      },
      pilots: {
        title: "Controlled Pilot Deployments",
        desc: "Manage physical testbeds, collocated sensor arrays, GIS shapefiles, and ward deployment logs.",
        count: "1 Active in Lucknow",
        action: "Upload Field Geologs",
      },
      milestones: {
        title: "Milestone Deliverables Workbench",
        desc: "Submit milestone deliverables, telemetry time-series records, and cryptographic SHA-256 evidence packages.",
        count: "Milestone 3 Pending Review",
        action: "Upload Deliverable Batch",
      },
      payments: {
        title: "Invoices & Treasury Disbursements",
        desc: "Track performance-linked escrow releases and electronic NEFT remittances from municipal treasury.",
        count: "₹14.0L Disbursed / ₹8.0L Pending",
        action: "Generate Milestone Invoice",
      },
      documents: {
        title: "Proprietary IP & Legal Repository",
        desc: "Protected contracts, NDAs, patent certifications, and municipal data-sharing covenants.",
        count: "5 Secure Files",
        action: "Upload Agreement",
      },
      profile: {
        title: "Startup & DPIIT Organization Profile",
        desc: "Company registration, DPIIT recognition credentials, technical patents, and leadership team overview.",
        count: "95% Profile Completeness",
        action: "Update Company Profile",
      },
    };

    const cfg = tabConfigs[tab] || {
      title: tab.charAt(0).toUpperCase() + tab.slice(1).replace(/-/g, " "),
      desc: `Module configuration for ${tab}.`,
    };

    return (
      <ShellModulePlaceholder
        moduleName={cfg.title}
        role="STARTUP INNOVATOR"
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
            <Badge variant="default" className="bg-blue-600 font-mono text-[10px]">
              STARTUP INNOVATOR WORKSPACE
            </Badge>
            <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50 text-[10px]">
              DPIIT RECOGNIZED: {org.dpiitRecognitionNumber}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-gov-primary tracking-tight">
            {org.legalName}
          </h1>
          <p className="text-xs text-gov-muted">
            Challenge applications, pilot milestone deliverables, sensor evidence, and invoice tracking
          </p>
        </div>

        <Badge variant="outline" className="border-blue-300 text-gov-primary bg-blue-50/50">
          User: {currentUser?.firstName} {currentUser?.lastName} ({currentUser?.designation})
        </Badge>
      </div>

      {/* Proprietary Isolation Notice */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-card p-4 flex items-start space-x-3 text-xs text-emerald-950">
        <Shield className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block mb-0.5">Proprietary IP & Submission Isolation Active:</strong>
          <span>
            Your technical approach, sensor blueprints, and financial breakdown are strictly partitioned. Competing innovators and unauthorized reviewers cannot inspect your intellectual property.
          </span>
        </div>
      </div>

      {/* Active Pilot Milestones Workbench */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gov-primary">Pilot Execution Deliverables</h2>
            <p className="text-xs text-gov-muted">Pilot: Lucknow Urban Air Quality Hyperlocal Pilot (90 Days)</p>
          </div>
          <Button size="sm" className="bg-gov-accent hover:bg-gov-accent-hover text-xs">
            <UploadCloud className="w-4 h-4 mr-1.5" /> Upload Milestone Evidence
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Milestone & Deliverable</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Payment Allocation</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_PILOT_MILESTONES.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-mono font-semibold text-xs">#{m.milestoneNumber}</TableCell>
                <TableCell>
                  <div className="font-semibold text-xs text-slate-900">{m.name}</div>
                  <div className="text-[11px] text-gov-muted">{m.description}</div>
                </TableCell>
                <TableCell className="text-xs font-mono">{m.deadline}</TableCell>
                <TableCell className="font-semibold text-xs text-gov-primary">
                  {formatCurrency(m.allocatedPayment)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={m.status === "APPROVED" ? "success" : "warning"}
                    className="text-[10px]"
                  >
                    {m.status}
                  </Badge>
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
          <Link href="/expert/dashboard">
            <Button size="sm" variant="outline" className="border-red-200 text-gov-danger hover:bg-red-50 text-xs">
              Attempt /expert/dashboard (Should 403)
            </Button>
          </Link>
          <Link href="/admin/dashboard">
            <Button size="sm" variant="outline" className="border-red-200 text-gov-danger hover:bg-red-50 text-xs">
              Attempt /admin/dashboard (Should 403)
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function StartupDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-gov-muted">Loading Startup Console...</div>}>
      <StartupDashboardContent />
    </Suspense>
  );
}
