"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/auth/AuthContext";
import {
  ContextualCityPilot3D,
  LUCKNOW_PILOT_NODES,
  PilotDataNode,
} from "./ContextualCityPilot3D";
import { MilestoneManagementWorkspace } from "@/components/milestones/MilestoneManagementWorkspace";
import { KpiTrackingWorkspace } from "@/components/kpi/KpiTrackingWorkspace";
import { EvidenceManagementWorkspace } from "@/components/evidence/EvidenceManagementWorkspace";
import { RiskIssueManagementWorkspace } from "@/components/risks/RiskIssueManagementWorkspace";
import { DocumentContractManagementWorkspace } from "@/components/documents/DocumentContractManagementWorkspace";
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Download,
  Eye,
  Lock,
  MessageSquare,
  Send,
  ArrowRight,
  ArrowLeft,
  X,
  History,
  Check,
  Info,
  Scale,
  Cpu,
  Layers,
  Sparkles,
  BarChart3,
  Calendar,
  CreditCard,
  Activity,
  FileCheck2,
  Radio,
  Truck,
  MapPin,
  ExternalLink,
  Plus,
} from "lucide-react";

export type PilotTab =
  | "overview"
  | "milestones"
  | "kpis"
  | "evidence"
  | "issues"
  | "risks"
  | "documents"
  | "payments"
  | "validation"
  | "activity";

export interface PilotIssue {
  id: string;
  title: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  status: "RESOLVED" | "IN_PROGRESS" | "OPEN";
  reportedBy: string;
  date: string;
  resolution: string;
}

export function PilotManagementWorkspace() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<PilotTab>("overview");
  const [selected3DNode, setSelected3DNode] = useState<PilotDataNode>(LUCKNOW_PILOT_NODES[0]);

  // Evidence Preview Modal State
  const [previewEvidence, setPreviewEvidence] = useState<{
    title: string;
    category: string;
    size: string;
    sha256: string;
    summary: string;
  } | null>(null);

  // New Issue Modal
  const [showNewIssueModal, setShowNewIssueModal] = useState(false);
  const [newIssueTitle, setNewIssueTitle] = useState("");
  const [newIssueSeverity, setNewIssueSeverity] = useState<"HIGH" | "MEDIUM" | "LOW">("MEDIUM");
  const [newIssueDescription, setNewIssueDescription] = useState("");

  // Milestone Approval Action
  const [milestones, setMilestones] = useState([
    {
      id: "M1",
      title: "Testbed Collocation & Baseline Calibration",
      description: "Laboratory sensor cross-calibration against CPCB BAM-1020 reference analyzer with baseline R2 >= 0.90.",
      targetDate: "10 Jun 2026",
      completedDate: "08 Jun 2026",
      status: "COMPLETED",
      tranche: "₹7,50,000 (30%)",
      deliverable: "CPCB_Collocation_Baseline_Report.pdf",
      sha256: "9a8f...10b2",
    },
    {
      id: "M2",
      title: "Municipal Ward Deployment & ICCC Link",
      description: "Pole-mounting of 40 optical particulate nodes across Wards 14, 18, 22, 29 with encrypted LoRaWAN telemetry pushing into Lucknow ICCC.",
      targetDate: "30 Jun 2026",
      completedDate: "28 Jun 2026",
      status: "COMPLETED",
      tranche: "₹8,00,000 (35%)",
      deliverable: "Ward_Pole_Mounting_GIS_Registry.pdf",
      sha256: "b109...3ef4",
    },
    {
      id: "M3",
      title: "Continuous 60-Day Telemetry & Automated Misting",
      description: "Maintain >= 95% node uptime, stream uninterrupted 60-day time-series telemetry, and validate automated misting truck dispatch triggers.",
      targetDate: "31 Jul 2026",
      completedDate: undefined,
      status: "UNDER_REVIEW",
      tranche: "₹5,00,000 (20%)",
      deliverable: "60Day_TimeSeries_Telemetry_Data.parquet",
      sha256: "e3b0...4298",
    },
    {
      id: "M4",
      title: "TERI Third-Party Validation & Scale Handover",
      description: "Final empirical regression audit from accredited testing agency (TERI) and municipal replication roadmap for statewide scaling.",
      targetDate: "15 Aug 2026",
      completedDate: undefined,
      status: "UPCOMING",
      tranche: "₹4,00,000 (15%)",
      deliverable: "TERI_Final_Empirical_Validation_Certificate.pdf",
      sha256: "Pending Final Audit",
    },
  ]);

  // Operational Issues List
  const [issues, setIssues] = useState<PilotIssue[]>([
    {
      id: "ISSUE-104",
      title: "Ward 22 Sensor Node #14 optical chamber dust accumulation",
      severity: "HIGH" as const,
      status: "RESOLVED" as const,
      reportedBy: "Automated Telemetry Diagnostic",
      date: "24 Sep 2026",
      resolution: "Triggered cyclonic positive-pressure optical purge remotely. Signal attenuation returned to nominal within 120 seconds.",
    },
    {
      id: "ISSUE-105",
      title: "Municipal pole electrical supply interruption on Hazratganj MG Road",
      severity: "MEDIUM" as const,
      status: "RESOLVED" as const,
      reportedBy: "Smart City Electrical Junior Engineer",
      date: "25 Sep 2026",
      resolution: "Node switched automatically to onboard 48-hour solar lithium reserve; zero packet loss recorded during 6-hour power cut.",
    },
    {
      id: "ISSUE-106",
      title: "Cellular 4G fallback latency spike during peak festive hours",
      severity: "LOW" as const,
      status: "IN_PROGRESS" as const,
      reportedBy: "AirSense Systems Engineer",
      date: "26 Sep 2026",
      resolution: "LoRaWAN primary packets arrived unaffected. Telecom APN QoS profile raised with BSNL / Airtel municipal accounts.",
    },
  ]);

  const handleApproveMilestone3 = () => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === "M3"
          ? {
              ...m,
              status: "COMPLETED",
              completedDate: "Today, 12:30 IST",
            }
          : m
      )
    );
    showToast({
      type: "success",
      title: "Milestone 3 Officially Approved",
      description: "60-Day Telemetry signed off. Milestone funding tranche (₹5,00,000) queued for treasury release.",
    });
  };

  const handleCreateIssue = () => {
    if (!newIssueTitle.trim()) {
      showToast({ type: "error", title: "Issue Title Required", description: "Please enter an issue description." });
      return;
    }

    const newIssue = {
      id: `ISSUE-${Date.now().toString().slice(-4)}`,
      title: newIssueTitle.trim(),
      severity: newIssueSeverity,
      status: "IN_PROGRESS" as const,
      reportedBy: `${currentUser?.firstName || "Government"} ${currentUser?.lastName || "Officer"}`,
      date: "Today",
      resolution: newIssueDescription.trim() || "Investigating with startup engineering field team.",
    };

    setIssues((prev) => [newIssue, ...prev]);
    setNewIssueTitle("");
    setNewIssueDescription("");
    setShowNewIssueModal(false);

    showToast({
      type: "info",
      title: "Field Issue Logged",
      description: `Logged issue ${newIssue.id} for municipal investigation.`,
    });
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* ======================================================== */}
      {/* 1. HEADER SECTION (EXACT PROMPT FIELDS)                  */}
      {/* Example: "Urban Air Quality Monitoring — Lucknow Pilot"  */}
      {/* Fields: Status, Progress, Budget, Duration, Risk         */}
      {/* ======================================================== */}
      <div className="bg-white border border-gov-border rounded-card p-4 sm:p-5 shadow-2xs space-y-4">
        {/* Pilot Title & Institutional Clearance Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="default" className="bg-gov-primary font-mono text-[9px]">
                STATE INNOVATION TESTBED #PILOT-UP-UAQ-01
              </Badge>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-gov-muted font-medium">
                Department of Urban Development • Lucknow Municipal Corporation
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gov-primary tracking-tight">
              Urban Air Quality Monitoring — Lucknow Pilot
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Startup Partner: <strong className="text-slate-900">AirSense Technologies Pvt Ltd</strong> (DPIIT: DIPP-94812)
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="inline-flex items-center text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-control font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              Live Field Telemetry Active
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => showToast({ type: "info", title: "Audit Dossier Exported", description: "All 10 pilot compliance modules packaged into statutory PDF." })}
              className="text-xs h-7 border-slate-300"
            >
              <Download className="w-3.5 h-3.5 mr-1" /> Export Dossier
            </Button>
          </div>
        </div>

        {/* 5 Core Header Operational Metric Strips */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs bg-slate-50 border border-slate-200 rounded-control p-3.5">
          {/* 1. Status */}
          <div className="space-y-1">
            <span className="text-[10px] text-gov-muted font-mono uppercase block font-semibold">
              PILOT STATUS
            </span>
            <Badge variant="success" className="font-mono text-[10.5px]">
              ACTIVE • DAY 68 / 90
            </Badge>
            <span className="text-[10px] text-slate-500 block">On Track • GFR 149</span>
          </div>

          {/* 2. Progress */}
          <div className="space-y-1">
            <span className="text-[10px] text-gov-muted font-mono uppercase block font-semibold">
              OVERALL PROGRESS
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-extrabold text-gov-primary font-mono">75%</span>
              <span className="text-[11px] text-gov-muted">Completed</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gov-accent h-1.5 rounded-full" style={{ width: "75%" }} />
            </div>
          </div>

          {/* 3. Budget */}
          <div className="space-y-1">
            <span className="text-[10px] text-gov-muted font-mono uppercase block font-semibold">
              TREASURY BUDGET
            </span>
            <div className="text-sm font-extrabold text-slate-900 font-mono">₹24,50,000</div>
            <span className="text-[10px] text-emerald-700 font-semibold block">
              ₹15.5L Disbursed (63%)
            </span>
          </div>

          {/* 4. Duration */}
          <div className="space-y-1">
            <span className="text-[10px] text-gov-muted font-mono uppercase block font-semibold">
              PILOT DURATION
            </span>
            <div className="text-xs font-bold text-slate-900 font-mono">90 Days Total</div>
            <span className="text-[10px] text-amber-800 font-semibold block">
              22 Days Remaining
            </span>
          </div>

          {/* 5. Risk */}
          <div className="space-y-1">
            <span className="text-[10px] text-gov-muted font-mono uppercase block font-semibold">
              RISK RATING
            </span>
            <Badge variant="success" className="font-mono text-[10.5px]">
              LOW RISK
            </Badge>
            <span className="text-[10px] text-slate-500 block">All Covenants Active</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. NAVIGATION TABS (ALL 10 EXACT TABS FROM USER PROMPT)  */}
        {/* Overview, Milestones, KPIs, Evidence, Issues, Risks,     */}
        {/* Documents, Payments, Validation, Activity                */}
        {/* ======================================================== */}
        <div className="flex items-center overflow-x-auto space-x-1 border-b border-slate-200 pt-1 text-xs font-semibold scrollbar-none">
          {[
            { id: "overview", label: "Overview" },
            { id: "milestones", label: "Milestones", count: "3/4" },
            { id: "kpis", label: "KPIs", count: "5 Tracked" },
            { id: "evidence", label: "Evidence", count: "4 Logs" },
            { id: "issues", label: "Issues", count: `${issues.filter((i) => i.status !== "RESOLVED").length} Open` },
            { id: "risks", label: "Risks", count: "3 Rated" },
            { id: "documents", label: "Documents", count: "5 Executed" },
            { id: "payments", label: "Payments", count: "₹15.5L" },
            { id: "validation", label: "Validation", count: "TERI Certified" },
            { id: "activity", label: "Activity", count: "142 Events" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as PilotTab)}
              className={`px-3 py-2 rounded-t-md border-b-2 transition-all shrink-0 flex items-center space-x-1.5 ${
                activeTab === t.id
                  ? "border-gov-primary text-gov-primary font-bold bg-slate-50"
                  : "border-transparent text-gov-muted hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <span>{t.label}</span>
              {t.count && (
                <span
                  className={`text-[9.5px] px-1.5 py-0.2 rounded font-mono ${
                    activeTab === t.id
                      ? "bg-gov-primary text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. TAB 1: OVERVIEW (INCLUDES CONTEXTUAL 3D CITY PILOT)    */}
      {/* ======================================================== */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* A. CONTEXTUAL 3D VISUALIZATION (Compact & Subordinate to Operational UI) */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-gov-primary flex items-center">
                  <span className="w-1.5 h-3.5 bg-gov-accent rounded-xs mr-2" />
                  Spatial Infrastructure & Field Telemetry Visualization
                </h2>
                <p className="text-[11px] text-gov-muted">
                  Interactive city environment visualizing pilot locations, sensor devices, municipal infrastructure, and data nodes
                </p>
              </div>
              <Badge variant="outline" className="text-[9px] font-mono border-blue-300 bg-blue-50 text-blue-900">
                CONTEXTUAL 3D DIGITAL TWIN
              </Badge>
            </div>

            <ContextualCityPilot3D
              selectedNode={selected3DNode}
              onSelectNode={setSelected3DNode}
            />
          </section>

          {/* B. OPERATIONAL METRICS & TESTBED SUMMARY GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Box 1: Pilot Governance Summary */}
            <div className="bg-white border border-gov-border rounded-card p-4 space-y-2.5 shadow-2xs">
              <span className="text-[10px] font-mono text-gov-primary font-bold uppercase tracking-wider block">
                TESTBED GOVERNANCE COVENANT
              </span>
              <h3 className="font-bold text-slate-900 text-sm">
                Lucknow Urban Particulate Intervention Testbed
              </h3>
              <p className="text-slate-600 text-[11.5px] leading-relaxed">
                Deployed across 40 strategic municipal streetlight poles in Lucknow. Continuously streams particulate density to guide automated dispatch of municipal dust-suppression misting trucks.
              </p>
              <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gov-muted">Municipal Authority:</span>
                  <span className="font-semibold text-slate-800">Lucknow Municipal Corp</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-muted">Sponsoring Mission:</span>
                  <span className="font-semibold text-slate-800">UP Urban Dev Mission</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-muted">ICCC Integration:</span>
                  <span className="font-mono font-semibold text-emerald-700">Online (MQTT/REST)</span>
                </div>
              </div>
            </div>

            {/* Box 2: Telemetry Hardware Health */}
            <div className="bg-white border border-gov-border rounded-card p-4 space-y-2.5 shadow-2xs">
              <span className="text-[10px] font-mono text-gov-accent font-bold uppercase tracking-wider block">
                HARDWARE & SENSOR HEALTH
              </span>
              <div className="space-y-2 text-[11.5px]">
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="font-medium text-slate-800">Active Sensor Nodes:</span>
                  <span className="font-mono font-bold text-slate-900">40 / 40 Online</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="font-medium text-slate-800">LoRaWAN Gateway Uptime:</span>
                  <span className="font-mono font-bold text-emerald-700">99.4% (Zero Packet Loss)</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="font-medium text-slate-800">Average Battery Reserve:</span>
                  <span className="font-mono font-bold text-slate-900">94% (Solar Recharge)</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="font-medium text-slate-800">Anti-Fouling Purge Cycles:</span>
                  <span className="font-mono font-bold text-slate-900">12 Daily Automated</span>
                </div>
              </div>
            </div>

            {/* Box 3: Empirical Validation Benchmark */}
            <div className="bg-white border border-gov-border rounded-card p-4 space-y-2.5 shadow-2xs">
              <span className="text-[10px] font-mono text-purple-800 font-bold uppercase tracking-wider block">
                VALIDATION BENCHMARK (CPCB)
              </span>
              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-control space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-purple-950 text-xs">CPCB BAM-1020 Correlation:</span>
                  <span className="text-base font-mono font-extrabold text-purple-900">R² = 0.95</span>
                </div>
                <p className="text-[10.5px] text-purple-900 leading-tight">
                  Collocated reference station at Lalbagh confirms sensor laser optical curve resolves within 2.8% of federal grade reference analyzer.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-gov-muted">Testing Agency:</span>
                <span className="font-bold text-slate-800">TERI Environmental Lab</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gov-muted">Audit Lead:</span>
                <span className="text-slate-700">Priya Nair (Accredited Auditor)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. TAB 2: MILESTONES                                     */}
      {/* ======================================================== */}
      {activeTab === "milestones" && (
        <div className="animate-in fade-in duration-150">
          <MilestoneManagementWorkspace />
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. TAB 3: KPIS                                           */}
      {/* ======================================================== */}
      {activeTab === "kpis" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <KpiTrackingWorkspace />
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. TAB 4: EVIDENCE                                       */}
      {/* ======================================================== */}
      {activeTab === "evidence" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <EvidenceManagementWorkspace />
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. TAB 5: ISSUES                                         */}
      {/* ======================================================== */}
      {activeTab === "issues" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <RiskIssueManagementWorkspace initialTab="issues" pilotId="PILOT-UP-UAQ-01" />
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. TAB 6: RISKS                                          */}
      {/* ======================================================== */}
      {activeTab === "risks" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <RiskIssueManagementWorkspace initialTab="risks" pilotId="PILOT-UP-UAQ-01" />
        </div>
      )}

      {/* ======================================================== */}
      {/* 9. TAB 7: DOCUMENTS                                      */}
      {/* ======================================================== */}
      {activeTab === "documents" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <DocumentContractManagementWorkspace pilotId="PILOT-UP-UAQ-01" />
        </div>
      )}

      {/* ======================================================== */}
      {/* 10. TAB 8: PAYMENTS                                      */}
      {/* ======================================================== */}
      {activeTab === "payments" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gov-primary">
                Treasury Escrow & Milestone Funding Releases
              </h2>
              <p className="text-[11px] text-gov-muted">
                Public procurement performance disbursement ledger
              </p>
            </div>
            <div className="font-mono text-xs text-right">
              <span className="font-bold text-emerald-700">₹15,50,000 Disbursed</span>
              <span className="text-gov-muted ml-2">/ ₹24,50,000 Total</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-card overflow-hidden text-xs shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-[10px] uppercase font-mono text-gov-muted border-b border-slate-200">
                <tr>
                  <th className="p-3">Tranche & Milestone</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Invoice & NEFT Ref</th>
                  <th className="p-3">Disbursement Date</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {[
                  {
                    tranche: "Tranche 1: Mobilization & Equipment",
                    amount: "₹7,50,000",
                    invoice: "INV-AS-2026-01",
                    neft: "SBI-TREAS-UP-91823",
                    date: "12 Jun 2026",
                    status: "DISBURSED",
                  },
                  {
                    tranche: "Tranche 2: Ward Network Deployment",
                    amount: "₹8,00,000",
                    invoice: "INV-AS-2026-02",
                    neft: "SBI-TREAS-UP-98412",
                    date: "02 Jul 2026",
                    status: "DISBURSED",
                  },
                  {
                    tranche: "Tranche 3: 60-Day Telemetry Submission",
                    amount: "₹5,00,000",
                    invoice: "INV-AS-2026-03",
                    neft: "Treasury Approval Pending",
                    date: "Pending Clearance",
                    status: "PENDING_RELEASE",
                  },
                  {
                    tranche: "Tranche 4: Final TERI Validation & Scale",
                    amount: "₹4,00,000",
                    invoice: "Awaiting Milestone 4",
                    neft: "In Escrow Reserve",
                    date: "Scheduled Aug 2026",
                    status: "IN_ESCROW",
                  },
                ].map((pay, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 font-semibold text-slate-900">{pay.tranche}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{pay.amount}</td>
                    <td className="p-3 font-mono text-gov-muted">
                      {pay.invoice} • {pay.neft}
                    </td>
                    <td className="p-3 font-mono text-slate-700">{pay.date}</td>
                    <td className="p-3 text-right">
                      <Badge
                        variant={
                          pay.status === "DISBURSED"
                            ? "success"
                            : pay.status === "PENDING_RELEASE"
                            ? "warning"
                            : "outline"
                        }
                        className="font-mono text-[9px]"
                      >
                        {pay.status.replace(/_/g, " ")}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 11. TAB 9: VALIDATION                                    */}
      {/* ======================================================== */}
      {activeTab === "validation" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gov-primary">
                Independent Third-Party Empirical Validation
              </h2>
              <p className="text-[11px] text-gov-muted">
                Statutory audits conducted by accredited testing laboratory (TERI Environmental Systems)
              </p>
            </div>
            <Badge variant="success" className="font-mono text-xs">
              Preliminary Audit Certified
            </Badge>
          </div>

          <div className="bg-white border border-gov-border rounded-card p-5 space-y-4 shadow-2xs text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-purple-800 font-bold uppercase tracking-wider block">
                  ACCREDITED VALIDATION AGENCY
                </span>
                <h3 className="font-bold text-slate-900 text-sm">
                  The Energy and Resources Institute (TERI Environmental Laboratory)
                </h3>
                <span className="text-[11px] text-gov-muted">
                  NABL Accreditation #NABL-TC-8891 • CPCB Approved Auditing Agency
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-gov-muted font-mono block">Auditor In Charge:</span>
                <span className="font-bold text-slate-800">Priya Nair (Senior Scientist)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[9.5px] font-mono text-gov-muted uppercase block">
                  REGRESSION AUDIT COEFFICIENT
                </span>
                <div className="text-lg font-mono font-extrabold text-emerald-700">R² = 0.952</div>
                <span className="text-[10px] text-slate-500">vs CPCB BAM-1020 BAM Analyzer</span>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[9.5px] font-mono text-gov-muted uppercase block">
                  MEAN ABSOLUTE PERCENTAGE ERROR
                </span>
                <div className="text-lg font-mono font-extrabold text-emerald-700">3.4% Error</div>
                <span className="text-[10px] text-slate-500">Allowable Ceiling: ≤ 10.0%</span>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[9.5px] font-mono text-gov-muted uppercase block">
                  FINAL 90-DAY CERTIFICATE
                </span>
                <div className="text-lg font-mono font-extrabold text-amber-700">In 22 Days</div>
                <span className="text-[10px] text-slate-500">Final Sign-Off for Scaling</span>
              </div>
            </div>

            <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-control space-y-1">
              <span className="text-[10px] font-mono text-purple-900 font-bold uppercase block">
                AUDITOR CERTIFICATION OPINION
              </span>
              <p className="text-purple-950 text-[11.5px] leading-relaxed">
                "We confirm that AirSense Technologies sensor nodes collocated at the Lalbagh CAAQMS station exhibit statistical collinearity with reference BAM-1020 equipment over 60 test days. Relative humidity correction polynomials effectively eliminate fog artifacts. Recommending conditional scale approval."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 12. TAB 10: ACTIVITY                                     */}
      {/* ======================================================== */}
      {activeTab === "activity" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gov-primary">
                Statutory Pilot Event Ledger & Audit Trail
              </h2>
              <p className="text-[11px] text-gov-muted">
                Append-only ledger capturing every telemetry anomaly, deliverable upload, and officer sign-off
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-bold">
              100% SHA-256 Chained
            </span>
          </div>

          <div className="bg-white border border-gov-border rounded-card p-4 divide-y divide-slate-100 text-xs shadow-2xs">
            {[
              {
                time: "Today, 10:45 AM",
                actor: "Dr. Alok Gupta (IIT Kanpur)",
                role: "EXPERT EVALUATOR",
                summary: "Reviewed 60-day telemetry parquet dataset; issued preliminary milestone 3 clearance note.",
                hash: "4f53cda18c2baa0c...7f8g",
              },
              {
                time: "Today, 09:30 AM",
                actor: "AirSense Technologies",
                role: "STARTUP",
                summary: "Uploaded 60-day time-series sensor telemetry and GIS logs for Milestone 3.",
                hash: "e3b0c44298fc1c14...b855",
              },
              {
                time: "Yesterday, 16:15 IST",
                actor: "Priya Nair (Senior Scientist)",
                role: "INDEPENDENT VALIDATOR",
                summary: "Collocated sensor regression audit certified: R2 = 0.95 vs CPCB BAM-1020 reference.",
                hash: "9a81e263fa7b1209...029a",
              },
              {
                time: "24 Sep 2026, 14:20 IST",
                actor: "Sunita Deshmukh",
                role: "PROCUREMENT OFFICER",
                summary: "NEFT disbursement cleared via Treasury for Milestone 2 (₹8,00,000).",
                hash: "c819a08912e73645...938b",
              },
              {
                time: "20 Jun 2026, 11:00 IST",
                actor: "Rajesh Verma",
                role: "GOVERNMENT OFFICER",
                summary: "Approved Milestone 1 baseline calibration report after Lalbagh testbed check.",
                hash: "b38a110293847561...756c",
              },
            ].map((ev, idx) => (
              <div key={idx} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] text-gov-muted">{ev.time}</span>
                    <span className="text-slate-300">•</span>
                    <Badge variant="outline" className="text-[9px] font-mono border-slate-300 bg-slate-50 text-slate-800">
                      {ev.role}
                    </Badge>
                    <span className="font-bold text-slate-900">{ev.actor}</span>
                  </div>
                  <p className="text-slate-700 text-[11.5px] leading-tight">{ev.summary}</p>
                  <span className="font-mono text-[9.5px] text-slate-400 block">
                    SHA-256: {ev.hash}
                  </span>
                </div>

                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[9.5px] self-start sm:self-center shrink-0">
                  VERIFIED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EVIDENCE / DOCUMENT PREVIEW                       */}
      {/* ======================================================== */}
      {previewEvidence && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-card shadow-2xl border border-gov-border max-w-xl w-full p-5 space-y-4 text-left text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-gov-primary" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm truncate max-w-xs sm:max-w-md">
                    {previewEvidence.title}
                  </h3>
                  <span className="text-[10px] text-gov-muted font-mono">
                    {previewEvidence.category} • {previewEvidence.size}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPreviewEvidence(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-control space-y-1.5">
              <span className="text-[10px] font-mono text-gov-muted uppercase font-bold block">
                DELIVERABLE SUMMARY
              </span>
              <p className="text-slate-700 leading-relaxed text-[11.5px]">{previewEvidence.summary}</p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded font-mono text-[10.5px] space-y-1">
              <span className="text-slate-500 block">Cryptographic Digest:</span>
              <span className="font-bold text-gov-primary block truncate">{previewEvidence.sha256}</span>
              <span className="text-emerald-700 font-semibold block pt-0.5">
                ✓ Cryptographically chained to Uttar Pradesh Treasury & Smart City Audit Trail
              </span>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPreviewEvidence(null)}
                className="text-xs"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: REPORT NEW FIELD ISSUE                            */}
      {/* ======================================================== */}
      {showNewIssueModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-card shadow-2xl border border-gov-border max-w-md w-full p-5 space-y-4 text-left text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">Report Field Operational Issue</h3>
              </div>
              <button
                onClick={() => setShowNewIssueModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-800 text-[11px] block mb-1">
                  Issue Summary:
                </label>
                <Input
                  value={newIssueTitle}
                  onChange={(e) => setNewIssueTitle(e.target.value)}
                  placeholder="e.g. Node #24 optical lens dirty after dust storm..."
                  className="text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 text-[11px] block mb-1">
                  Severity Level:
                </label>
                <select
                  value={newIssueSeverity}
                  onChange={(e) => setNewIssueSeverity(e.target.value as any)}
                  className="w-full border border-gov-border rounded-control p-2 text-xs bg-white font-semibold"
                >
                  <option value="LOW">Low (Cosmetic / Minor Telemetry Delay)</option>
                  <option value="MEDIUM">Medium (Single Node Offline)</option>
                  <option value="HIGH">High (Multi-Node Failure / Power Outage)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 text-[11px] block mb-1">
                  Initial Notes / Location Details:
                </label>
                <Textarea
                  rows={2}
                  value={newIssueDescription}
                  onChange={(e) => setNewIssueDescription(e.target.value)}
                  placeholder="Provide pole number, ward, and observed sensor behavior..."
                  className="text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowNewIssueModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreateIssue}
                className="bg-gov-primary hover:bg-gov-primary/90 text-white text-xs font-semibold"
              >
                Log Issue Ticket
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
