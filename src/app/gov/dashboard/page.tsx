"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/auth/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { InnovationPipeline, PilotMap } from "@/components/3d";
import { ShellModulePlaceholder } from "@/components/layout/ShellModulePlaceholder";
import {
  Building2,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileCheck,
  TrendingUp,
  ShieldCheck,
  Lock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  MapPin,
  Calendar,
  AlertTriangle,
  History,
  FileText,
  Activity,
  CreditCard,
  Layers,
  Sparkles,
  Search,
  Filter,
} from "lucide-react";

interface PilotRecord {
  id: string;
  pilotCode: string;
  title: string;
  location: string;
  startup: string;
  dpiit: string;
  department: string;
  progress: number;
  kpiLabel: string;
  kpiCurrent: string;
  kpiTarget: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  deadline: string;
  status: "ACTIVE" | "VALIDATED" | "ON_TRACK" | "DELAYED";
}

const ACTIVE_PILOTS_DATA: PilotRecord[] = [
  {
    id: "p1",
    pilotCode: "PILOT-UP-UAQ-01",
    title: "Urban Air Quality Hyperlocal Monitoring",
    location: "Lucknow (Wards 14, 18, 22, 29)",
    startup: "AirSense Technologies",
    dpiit: "DIPP98214",
    department: "Dept of Urban Development",
    progress: 75,
    kpiLabel: "CPCB Collocation Acc",
    kpiCurrent: "95.0%",
    kpiTarget: "92.0%",
    riskLevel: "LOW",
    deadline: "30 Jul 2026",
    status: "ACTIVE",
  },
  {
    id: "p2",
    pilotCode: "PILOT-UP-TRAFFIC-02",
    title: "Adaptive Corridor Signal Control",
    location: "GT Road Commercial Corridor, Kanpur",
    startup: "OptiFlow AI Systems",
    dpiit: "DIPP104822",
    department: "Directorate of Urban Transport",
    progress: 90,
    kpiLabel: "Transit Delay",
    kpiCurrent: "-28.4%",
    kpiTarget: "-20.0%",
    riskLevel: "LOW",
    deadline: "15 Aug 2026",
    status: "VALIDATED",
  },
  {
    id: "p3",
    pilotCode: "PILOT-UP-WASTE-03",
    title: "Deep-Learning Optical Dry Waste Sorter",
    location: "MRF Sector 62, Noida",
    startup: "EcoSort Robotics",
    dpiit: "DIPP112940",
    department: "Noida Solid Waste SPV",
    progress: 40,
    kpiLabel: "Segregation Purity",
    kpiCurrent: "88.2%",
    kpiTarget: "85.0%",
    riskLevel: "MEDIUM",
    deadline: "30 Jun 2026",
    status: "ACTIVE",
  },
];

const RECENT_AUDIT_ACTIVITY = [
  {
    id: "act-1",
    timestamp: "Today, 10:45 AM",
    actor: "Dr. Alok Gupta",
    role: "EXPERT_EVALUATOR",
    action: "EVALUATION_SCORE_SUBMITTED",
    summary: "Submitted blind technical evaluation (Score: 92.5/100) for APP-2026-UAQ-001",
    entity: "CHAL-UP-DUD-001",
    hash: "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945",
  },
  {
    id: "act-2",
    timestamp: "Today, 09:30 AM",
    actor: "AirSense Technologies",
    role: "STARTUP",
    action: "MILESTONE_DELIVERABLE_UPLOADED",
    summary: "Uploaded 90-day time-series sensor telemetry and GIS logs for Milestone 3",
    entity: "PILOT-UP-UAQ-01",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
  {
    id: "act-3",
    timestamp: "Yesterday, 16:15",
    actor: "Priya Nair",
    role: "INDEPENDENT_VALIDATOR",
    action: "VALIDATION_REPORT_CERTIFIED",
    summary: "Collocated sensor regression audit certified: R2 = 0.95 vs CPCB BAM-1020 reference",
    entity: "VAL-REP-001",
    hash: "9a81e263fa7b1209bca74e2843054f102837bcde20541178491028471bade029",
  },
  {
    id: "act-4",
    timestamp: "Yesterday, 11:20",
    actor: "Sunita Deshmukh",
    role: "PROCUREMENT_OFFICER",
    action: "ESCROW_DISBURSEMENT_APPROVED",
    summary: "Authorized Milestone 2 performance payment (₹8,00,000 NEFT cleared via Treasury)",
    entity: "PAY-002",
    hash: "c819a08912e73645019284758129034910284561029348571029384756102938",
  },
  {
    id: "act-5",
    timestamp: "24 Sep 2026",
    actor: "Rajesh Verma",
    role: "GOVERNMENT_OFFICER",
    action: "CHALLENGE_PUBLISHED",
    summary: "Published public challenge statement for Adaptive Traffic Signal Optimization (Kanpur)",
    entity: "CHAL-UP-DUT-002",
    hash: "b38a110293847561029384756102938475610293847561029384756102938475",
  },
];

function GovernmentDashboardContent() {
  const { currentUser } = useAuth();
  const searchParams = useSearchParams();
  const tab = searchParams?.get("tab") || "overview";

  // Sub-tab module placeholders when non-overview tabs are clicked from sidebar
  if (tab !== "overview") {
    const tabConfigs: Record<string, { title: string; desc: string; count?: string; action?: string }> = {
      challenges: {
        title: "State & Municipal Problem Challenges",
        desc: "Formulate, edit, and publish civic problem statements with measurable KPIs, budgets, and evaluation rubrics.",
        count: "4 Active Challenges",
        action: "Create Challenge Statement",
      },
      applications: {
        title: "Startup Proposals & Prequalification",
        desc: "Screen submitted startup applications for DPIIT certification, past field deployments, and technical eligibility.",
        count: "12 Submitted Applications",
        action: "Screen New Submissions",
      },
      evaluations: {
        title: "Blind Expert Scoring & Consensus Matrix",
        desc: "Inspect anonymized evaluation rubrics, inter-rater consensus scores, and COI clearance logs from academic specialists.",
        count: "2 Evaluations Pending Review",
        action: "Open Consensus Review",
      },
      pilots: {
        title: "Controlled Pilot Deployments",
        desc: "Oversight of active 60-90 day field pilots, municipal testbed coordination, and continuous sensor telemetry.",
        count: "3 Active Pilots",
        action: "Inspect IoT Telemetry",
      },
      payments: {
        title: "Milestone Disbursements & Treasury",
        desc: "Verify deliverable completion and track milestone funding releases through public treasury escrow.",
        count: "₹14.0L Disbursed / ₹22.0L Total",
        action: "Review Milestone 3 Invoice",
      },
      validation: {
        title: "Third-Party Empirical Validation",
        desc: "Independent audits and regression reports from accredited testing agencies (TERI / CPCB / NABL).",
        count: "1 Certified Report Ready",
        action: "Download TERI Audit Log",
      },
      solutions: {
        title: "Proven Solutions Replication Library",
        desc: "Catalog of tested and validated technologies ready for direct public procurement adoption across other Smart Cities.",
        count: "2 Certified Solutions",
        action: "Browse Proven Catalog",
      },
      analytics: {
        title: "Innovation Procurement Analytics",
        desc: "Platform throughput metrics, stage conversion rates, average time-to-evidence, and target KPI achievement trends.",
        count: "89.2% Target Attainment",
        action: "Export Executive Brief",
      },
      documents: {
        title: "Pilot Covenants, NDAs & Legal Frameworks",
        desc: "Executed pilot agreements, data access protocols, background IP retention terms, and security certifications.",
        count: "8 Executed Documents",
        action: "Upload Document",
      },
      "audit-log": {
        title: "Statutory Append-Only Audit Ledger",
        desc: "Cryptographic event log tracking every challenge publication, reviewer score submission, and procurement vote.",
        count: "142 Traceable Events",
        action: "Verify SHA-256 Hashes",
      },
    };

    const cfg = tabConfigs[tab] || {
      title: tab.charAt(0).toUpperCase() + tab.slice(1).replace(/-/g, " "),
      desc: `Module configuration and data isolation for ${tab}.`,
    };

    return (
      <ShellModulePlaceholder
        moduleName={cfg.title}
        role="GOVERNMENT OFFICER"
        description={cfg.desc}
        itemCount={cfg.count}
        actionLabel={cfg.action}
      />
    );
  }

  return (
    <div className="space-y-8 text-left pb-12">
      {/* 1. TOP SECTION: Page Title & Compact Operational Metric Strip */}
      <div className="space-y-4">
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gov-border pb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="default" className="bg-gov-primary font-mono text-[10px]">
                GOVERNMENT OFFICER CLEARANCE
              </Badge>
              <span className="text-xs text-gov-muted font-medium">
                Department of Urban Development • State Innovation Mission
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-gov-primary tracking-tight">
              Government Innovation Overview
            </h1>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="inline-flex items-center text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-control font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              Oversight Desk Operational
            </span>
            <Badge variant="outline" className="border-blue-300 text-gov-primary bg-blue-50/50">
              {currentUser?.firstName} {currentUser?.lastName} ({currentUser?.designation})
            </Badge>
          </div>
        </div>

        {/* Compact Metrics Bar (Enterprise horizontal strip, fine borders — NOT a floating card grid) */}
        <div className="bg-white border border-gov-border rounded-card divide-y sm:divide-y-0 sm:divide-x divide-slate-200 grid grid-cols-2 sm:grid-cols-5 shadow-2xs">
          <div className="p-3.5 text-left">
            <span className="text-[10px] uppercase font-mono tracking-wider text-gov-muted block">
              Active Challenges
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-gov-primary font-mono">4</span>
              <span className="text-[11px] text-emerald-700 font-medium">Open for Startups</span>
            </div>
          </div>

          <div className="p-3.5 text-left">
            <span className="text-[10px] uppercase font-mono tracking-wider text-gov-muted block">
              Applications
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-gov-primary font-mono">48</span>
              <span className="text-[11px] text-slate-500 font-medium">Screened Proposals</span>
            </div>
          </div>

          <div className="p-3.5 text-left">
            <span className="text-[10px] uppercase font-mono tracking-wider text-gov-muted block">
              Active Pilots
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-gov-primary font-mono">3</span>
              <span className="text-[11px] text-gov-accent font-medium">Municipal Testbeds</span>
            </div>
          </div>

          <div className="p-3.5 text-left">
            <span className="text-[10px] uppercase font-mono tracking-wider text-gov-muted block">
              Validated Solutions
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-emerald-700 font-mono">2</span>
              <span className="text-[11px] text-emerald-600 font-medium">GFR 149 Scaling</span>
            </div>
          </div>

          <div className="p-3.5 text-left col-span-2 sm:col-span-1 bg-amber-50/50">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-900 block font-semibold">
              Pending Actions
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-amber-950 font-mono">8</span>
              <span className="text-[11px] text-amber-800 font-bold">Action Required</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN VISUAL: InnovationPipeline (Subtle 3D Volumetric Depth) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gov-primary flex items-center">
              <span className="w-1.5 h-4 bg-gov-accent rounded-xs mr-2" />
              Innovation Pipeline Throughput
            </h2>
            <p className="text-xs text-gov-muted">
              Challenges → Applications → Evaluation → Pilots → Validation → Scale
            </p>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono border-blue-300 bg-blue-50 text-blue-900">
            VOLUMETRIC 3D FUNNEL
          </Badge>
        </div>

        <InnovationPipeline height="h-72" />
      </section>

      {/* 3. ACTION REQUIRED: Real Government Operations Queue */}
      <section className="bg-amber-50/60 border border-amber-200/90 rounded-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <h2 className="text-sm font-bold text-amber-950">
                Action Required: Pending Operational Approvals
              </h2>
              <p className="text-[11px] text-amber-800">
                Mandatory statutory gates requiring Officer sign-off before downstream execution.
              </p>
            </div>
          </div>
          <Badge variant="warning" className="font-mono text-[10px] uppercase">
            8 Items Pending
          </Badge>
        </div>

        {/* 4 Concrete Operational Action Items matching user prompt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Action 1: 3 applications awaiting eligibility review */}
          <div className="bg-white border border-amber-200 p-3.5 rounded-control flex flex-col justify-between shadow-2xs hover:border-amber-400 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[9px] font-mono border-amber-300 text-amber-900 bg-amber-50">
                  ELIGIBILITY SCREENING
                </Badge>
                <span className="text-[10px] font-mono text-amber-800 font-semibold">3 Submissions</span>
              </div>
              <h3 className="font-bold text-slate-900 text-xs mt-1">
                3 Applications Awaiting Eligibility Review
              </h3>
              <p className="text-[11px] text-gov-muted leading-normal">
                AirSense Technologies, EcoSort Robotics, and HydroScan submitted DPIIT credentials and past deployment shapefiles for Challenge #CHAL-UP-DUD-001.
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-gov-muted">Statutory SLA: 48h remaining</span>
              <Link href="?tab=applications">
                <Button size="sm" className="bg-gov-primary h-7 text-[11px] font-semibold">
                  Screen Applications <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Action 2: 2 milestone approvals pending */}
          <div className="bg-white border border-amber-200 p-3.5 rounded-control flex flex-col justify-between shadow-2xs hover:border-amber-400 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[9px] font-mono border-blue-300 text-blue-900 bg-blue-50">
                  DELIVERABLE SIGN-OFF
                </Badge>
                <span className="text-[10px] font-mono text-blue-800 font-semibold">2 Milestones</span>
              </div>
              <h3 className="font-bold text-slate-900 text-xs mt-1">
                2 Milestone Approvals Pending
              </h3>
              <p className="text-[11px] text-gov-muted leading-normal">
                Milestone 3 (90-day time-series data for Pilot UAQ-LKO) and Milestone 1 (Corridor controller loop calibration) submitted for review.
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-gov-muted">AirSense Tech & OptiFlow AI</span>
              <Link href="?tab=pilots">
                <Button size="sm" variant="default" className="bg-gov-primary h-7 text-[11px] font-semibold">
                  Review Deliverables <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Action 3: 1 validation due */}
          <div className="bg-white border border-amber-200 p-3.5 rounded-control flex flex-col justify-between shadow-2xs hover:border-amber-400 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[9px] font-mono border-purple-300 text-purple-900 bg-purple-50">
                  INDEPENDENT AUDIT
                </Badge>
                <span className="text-[10px] font-mono text-purple-800 font-semibold">1 Audit Due</span>
              </div>
              <h3 className="font-bold text-slate-900 text-xs mt-1">
                1 Third-Party Validation Due
              </h3>
              <p className="text-[11px] text-gov-muted leading-normal">
                Final 90-day CPCB BAM-1020 collocation regression audit from TERI Environmental Systems is pending official officer sign-off before scale review.
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-gov-muted">TERI Auditor: Priya Nair</span>
              <Link href="?tab=validation">
                <Button size="sm" variant="outline" className="h-7 text-[11px] font-semibold">
                  Inspect Audit Report <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Action 4: 2 payments awaiting approval */}
          <div className="bg-white border border-amber-200 p-3.5 rounded-control flex flex-col justify-between shadow-2xs hover:border-amber-400 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[9px] font-mono border-emerald-300 text-emerald-900 bg-emerald-50">
                  TREASURY ESCROW
                </Badge>
                <span className="text-[10px] font-mono text-emerald-800 font-semibold">₹14.0L Pending</span>
              </div>
              <h3 className="font-bold text-slate-900 text-xs mt-1">
                2 Payments Awaiting Approval
              </h3>
              <p className="text-[11px] text-gov-muted leading-normal">
                Milestone 3 completion invoice (#INV-AS-03, ₹8,00,000) and optical sorter mobilization tranche (#INV-ES-01, ₹6,00,000) cleared for officer sign-off.
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-gov-muted">Escrow Account: SBI-Treasury-UP</span>
              <Link href="?tab=payments">
                <Button size="sm" variant="default" className="bg-gov-primary h-7 text-[11px] font-semibold">
                  Authorize Release <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ACTIVE PILOTS TABLE: Professional Operations Grid */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-gov-primary flex items-center">
              <span className="w-1.5 h-4 bg-gov-accent rounded-xs mr-2" />
              Active Innovation Pilots
            </h2>
            <p className="text-xs text-gov-muted">
              Live field deployments monitored across municipal wards and smart corridors
            </p>
          </div>
          <span className="text-xs text-gov-muted font-mono">
            Showing 3 Active Deployments in Uttar Pradesh
          </span>
        </div>

        <div className="border border-gov-border rounded-card bg-white shadow-2xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="font-mono text-xs font-bold">Pilot</TableHead>
                <TableHead className="text-xs font-bold">Startup</TableHead>
                <TableHead className="text-xs font-bold">Department</TableHead>
                <TableHead className="text-xs font-bold">Progress</TableHead>
                <TableHead className="text-xs font-bold">Key Validated KPI</TableHead>
                <TableHead className="text-xs font-bold">Risk</TableHead>
                <TableHead className="text-xs font-bold">Deadline</TableHead>
                <TableHead className="text-xs font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ACTIVE_PILOTS_DATA.map((p) => (
                <TableRow key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Pilot Code & Location */}
                  <TableCell>
                    <div className="font-mono font-bold text-xs text-gov-primary">
                      {p.pilotCode}
                    </div>
                    <div className="font-semibold text-xs text-slate-900 mt-0.5">
                      {p.title}
                    </div>
                    <div className="text-[11px] text-gov-muted flex items-center mt-0.5">
                      <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                      {p.location}
                    </div>
                  </TableCell>

                  {/* Startup Partner */}
                  <TableCell>
                    <div className="font-semibold text-xs text-slate-900">{p.startup}</div>
                    <div className="text-[10px] font-mono text-gov-muted mt-0.5">
                      DPIIT: {p.dpiit}
                    </div>
                  </TableCell>

                  {/* Sponsoring Department */}
                  <TableCell className="text-xs text-slate-700">
                    {p.department}
                  </TableCell>

                  {/* Overall Progress */}
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gov-accent h-2 rounded-full transition-all"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-800">
                          {p.progress}%
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Validated KPI */}
                  <TableCell>
                    <div className="text-xs font-bold text-emerald-800">
                      {p.kpiLabel}: {p.kpiCurrent}
                    </div>
                    <div className="text-[10px] text-gov-muted font-mono">
                      Target: {p.kpiTarget}
                    </div>
                  </TableCell>

                  {/* Risk Rating */}
                  <TableCell>
                    <Badge
                      variant={p.riskLevel === "LOW" ? "success" : "warning"}
                      className="text-[10px] font-mono"
                    >
                      {p.riskLevel}
                    </Badge>
                  </TableCell>

                  {/* Deadline */}
                  <TableCell className="text-xs font-mono text-slate-700">
                    {p.deadline}
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    <Badge
                      variant={p.status === "VALIDATED" ? "success" : "default"}
                      className={`text-[10px] font-mono ${
                        p.status === "VALIDATED" ? "bg-emerald-700" : "bg-gov-primary"
                      }`}
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* 5. INNOVATION MAP: Restrained 3D / Geospatial Visualization */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gov-primary flex items-center">
              <span className="w-1.5 h-4 bg-gov-accent rounded-xs mr-2" />
              Innovation Map: Regional Pilot Locations
            </h2>
            <p className="text-xs text-gov-muted">
              Interactive state-level terrain visualizing pilot deployment clusters across Lucknow, Kanpur, and Noida
            </p>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono border-blue-300 text-blue-900 bg-blue-50">
            GEOSPATIAL TERRAIN 3D
          </Badge>
        </div>

        <PilotMap height="h-80" />
      </section>

      {/* 6. RECENT ACTIVITY: Audit-Style Timeline */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gov-primary flex items-center">
              <span className="w-1.5 h-4 bg-gov-accent rounded-xs mr-2" />
              Recent Activity & Cryptographic Audit Trail
            </h2>
            <p className="text-xs text-gov-muted">
              Append-only statutory ledger capturing every state change, score submission, and payment authorization
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            100% SHA-256 Chained
          </span>
        </div>

        <div className="bg-white border border-gov-border rounded-card p-5 shadow-2xs divide-y divide-slate-100">
          {RECENT_AUDIT_ACTIVITY.map((ev) => (
            <div key={ev.id} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[10px] text-gov-muted">
                    {ev.timestamp}
                  </span>
                  <span className="text-slate-300">•</span>
                  <Badge variant="outline" className="text-[9px] font-mono border-slate-300 bg-slate-50 text-slate-800">
                    {ev.role}
                  </Badge>
                  <span className="font-semibold text-slate-900 text-xs">
                    {ev.actor}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-snug">
                  {ev.summary}
                </p>

                <div className="flex items-center space-x-2 pt-0.5 text-[10px] font-mono text-gov-muted">
                  <span>Entity: <strong className="text-slate-800">{ev.entity}</strong></span>
                  <span>•</span>
                  <span className="truncate max-w-xs text-slate-500">
                    SHA-256: {ev.hash.slice(0, 16)}...{ev.hash.slice(-8)}
                  </span>
                </div>
              </div>

              <div className="shrink-0 self-start sm:self-center">
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[10px]">
                  VERIFIED
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. RBAC ROUTE PROTECTION TEST BENCH */}
      <section className="bg-slate-50 border border-slate-200 rounded-card p-4 text-xs space-y-2">
        <div className="flex items-center space-x-2 text-slate-800 font-semibold text-xs">
          <Lock className="w-4 h-4 text-gov-primary" />
          <span>RBAC Enforcement Verification (Test Unauthorized Route Traversal):</span>
        </div>
        <p className="text-[11px] text-gov-muted leading-relaxed">
          Click any of the protected route buttons below. The Next.js middleware and access rules will inspect your role (GOVERNMENT_OFFICER) and automatically redirect unauthorized attempts to the 403 Forbidden page:
        </p>

        <div className="flex flex-wrap gap-2 pt-1 text-xs">
          <Link href="/procurement/dashboard">
            <Button size="sm" variant="outline" className="border-red-200 text-gov-danger hover:bg-red-50 text-xs h-7">
              Attempt /procurement/dashboard (Should 403)
            </Button>
          </Link>
          <Link href="/startup/dashboard">
            <Button size="sm" variant="outline" className="border-red-200 text-gov-danger hover:bg-red-50 text-xs h-7">
              Attempt /startup/dashboard (Should 403)
            </Button>
          </Link>
          <Link href="/admin/dashboard">
            <Button size="sm" variant="outline" className="border-red-200 text-gov-danger hover:bg-red-50 text-xs h-7">
              Attempt /admin/dashboard (Should 403)
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function GovernmentDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-gov-muted">Loading Government Overview...</div>}>
      <GovernmentDashboardContent />
    </Suspense>
  );
}
