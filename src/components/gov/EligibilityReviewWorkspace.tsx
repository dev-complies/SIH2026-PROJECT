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
  FileCheck2,
  Calendar,
  Users,
} from "lucide-react";

export type EligibilityStatus =
  | "PENDING_REVIEW"
  | "ELIGIBLE"
  | "CONDITIONALLY_ELIGIBLE"
  | "INELIGIBLE"
  | "CLARIFICATION_REQUIRED";

export interface ChecklistItem {
  id: string;
  name: string;
  category: string;
  description: string;
  documentRef: string;
  status: "PASS" | "CONDITIONAL" | "FAIL" | "PENDING";
  notes: string;
}

export interface AuditRecord {
  id: string;
  reviewerName: string;
  reviewerRole: string;
  timestamp: string;
  decision: EligibilityStatus;
  reason: string;
  isPublicToStartup: boolean;
  reviewedDocumentsCount: number;
  cryptographicSeal: string;
}

interface ApplicationReviewData {
  id: string;
  applicationNumber: string;
  challengeCode: string;
  challengeTitle: string;
  department: string;
  startupName: string;
  dpiitNumber: string;
  cinNumber: string;
  incorporationDate: string;
  operatingRunway: string;
  netWorth: string;
  sovereignDataHost: string;
  proposedCost: string;
  budgetCeiling: string;
  proposedDuration: string;
  solutionTitle: string;
  executiveSummary: string;
  sensorSpecs: string;
  telemetryProtocol: string;
  targetKpis: string[];
  documents: {
    id: string;
    name: string;
    category: string;
    size: string;
    sha256: string;
    date: string;
  }[];
}

const SAMPLE_APPLICATIONS: ApplicationReviewData[] = [
  {
    id: "app-airsense-001",
    applicationNumber: "APP-2026-UP-UAQ-041",
    challengeCode: "CHAL-UP-DUD-2026-001",
    challengeTitle: "Urban Air Quality Hyperlocal Monitoring & Intervention Mesh",
    department: "Department of Urban Development",
    startupName: "AirSense Technologies Private Limited",
    dpiitNumber: "DIPP-94812",
    cinNumber: "U72900UP2022PTC159821",
    incorporationDate: "15 April 2022",
    operatingRunway: "14 Months Confirmed",
    netWorth: "Positive (₹1.85 Cr FY25)",
    sovereignDataHost: "AWS GovCloud (Mumbai Region, MeitY Empaneled)",
    proposedCost: "₹24,50,000",
    budgetCeiling: "₹25,00,000",
    proposedDuration: "90 Days (40 Nodes across 4 Wards)",
    solutionTitle: "AirSense Hyperlocal Optical Particle Mesh & Automated Misting Telemetry",
    executiveSummary:
      "Deployment of 40 calibrated optical particulate counter nodes with on-device machine learning calibration curves and real-time GIS telemetry to guide municipal dust-suppression misting trucks.",
    sensorSpecs:
      "Orthogonal dual-beam laser particle counters resolving PM1, PM2.5, PM10 simultaneously with automated cyclonic anti-fouling positive-pressure optical purge mechanism.",
    telemetryProtocol: "Dual-carrier LoRaWAN and 4G NB-IoT fallback with cryptographic TLS 1.3 push to Lucknow ICCC.",
    targetKpis: [
      "Collocated Correlation with CPCB BAM-1020: R² ≥ 0.94",
      "Ward Geographic Sensor Coverage: ≥ 85.0%",
      "Hourly Hardware Telemetry Uptime: ≥ 96.0%",
    ],
    documents: [
      {
        id: "d1",
        name: "DPIIT_Startup_Recognition_Certificate.pdf",
        category: "Statutory Certificate",
        size: "1.2 MB",
        sha256: "4e12c890...b819",
        date: "2026-03-01",
      },
      {
        id: "d2",
        name: "CERT-In_Level2_VAPT_Audit_Clearance.pdf",
        category: "Cybersecurity Audit",
        size: "2.4 MB",
        sha256: "3d22b10a...e71c",
        date: "2026-03-01",
      },
      {
        id: "d3",
        name: "NABL_IP65_RoHS_Test_Report.pdf",
        category: "Laboratory Test Report",
        size: "3.8 MB",
        sha256: "b1093ef4...52aa",
        date: "2026-03-01",
      },
      {
        id: "d4",
        name: "Audited_Balance_Sheet_FY2024_2025.pdf",
        category: "Financial Statement",
        size: "1.6 MB",
        sha256: "721a93b4...119f",
        date: "2026-03-01",
      },
      {
        id: "d5",
        name: "AirSense_Technical_Architecture_Whitepaper.pdf",
        category: "Technical Proposal",
        size: "4.1 MB",
        sha256: "9a8f10b2...4c21",
        date: "2026-03-01",
      },
    ],
  },
  {
    id: "app-ecosort-002",
    applicationNumber: "APP-2026-UP-SWM-018",
    challengeCode: "CHAL-UP-SWM-2026-003",
    challengeTitle: "Deep-Learning Optical Purity Sorter for Dry Municipal Waste",
    department: "Noida Authority / Solid Waste SPV",
    startupName: "EcoSort Robotics Private Limited",
    dpiitNumber: "DIPP-112940",
    cinNumber: "U29220DL2023PTC192083",
    incorporationDate: "10 January 2023",
    operatingRunway: "9 Months Confirmed",
    netWorth: "Positive (₹92 Lakhs FY25)",
    sovereignDataHost: "Azure India Central (Pune, MeitY Empaneled)",
    proposedCost: "₹19,80,000",
    budgetCeiling: "₹20,00,000",
    proposedDuration: "60 Days (Sector 62 MRF)",
    solutionTitle: "Pneumatic High-Speed Optical Ejection Sorter for Mixed Dry Recyclables",
    executiveSummary:
      "Automated near-infrared vision system sorting PET and HDPE polymers at 5.5 Tonnes/Hour with automated pneumatic diversion jets.",
    sensorSpecs: "Near-Infrared (NIR) 900-1700nm hyperspectral line scanner with 64-channel pneumatic air-jet bar.",
    telemetryProtocol: "Industrial Ethernet Modbus TCP and secured VPN telemetry.",
    targetKpis: [
      "Polymer Segregation Purity: ≥ 88.0%",
      "Conveyor Line Throughput: ≥ 5.0 Tonnes/Hour",
      "Automated E-Stop Jam Recovery: ≤ 3.0 min",
    ],
    documents: [
      {
        id: "e1",
        name: "DPIIT_EcoSort_Recognition.pdf",
        category: "Statutory Certificate",
        size: "1.1 MB",
        sha256: "5a19ef4...99b2",
        date: "2026-02-15",
      },
      {
        id: "e2",
        name: "Machinery_Safety_ISO13849_Certificate.pdf",
        category: "Safety Standard",
        size: "2.1 MB",
        sha256: "812bca0...102f",
        date: "2026-02-15",
      },
    ],
  },
  {
    id: "app-hydroscan-003",
    applicationNumber: "APP-2026-UP-SWM-029",
    challengeCode: "CHAL-UP-SWM-2026-004",
    challengeTitle: "Groundwater Aquifer Depletion & Heavy Metal Telemetry Grid",
    department: "State Water & Sanitation Mission",
    startupName: "HydroScan Deep Sensing Systems",
    dpiitNumber: "DIPP-88204",
    cinNumber: "U74999KA2021PTC148201",
    incorporationDate: "05 August 2021",
    operatingRunway: "12 Months Confirmed",
    netWorth: "Positive (₹2.1 Cr FY25)",
    sovereignDataHost: "National Informatics Centre (NIC) MeghRaj Cloud",
    proposedCost: "₹38,50,000",
    budgetCeiling: "₹40,00,000",
    proposedDuration: "180 Days (50 Borewells Prayagraj)",
    solutionTitle: "Subterranean Submersible Hydrostatic & Optical Heavy Metal Sensor Probes",
    executiveSummary:
      "Real-time solar telemetry probes tracking subterranean water table drawdowns and quarterly arsenic spectral indicators.",
    sensorSpecs: "IP68 piezoresistive ceramic pressure sensors and optical downhole spectrometer.",
    telemetryProtocol: "Solar cellular telemetry head with internal 5-year lithium battery reserve.",
    targetKpis: [
      "Hydrostatic Depth Accuracy: ≤ ±0.05 meters error",
      "Hourly Data Completeness: ≥ 96.0%",
      "Heavy Metal Early Warning Latency: ≤ 24 hours",
    ],
    documents: [
      {
        id: "h1",
        name: "DPIIT_HydroScan_Certificate.pdf",
        category: "Statutory Certificate",
        size: "1.4 MB",
        sha256: "1f82ba9...34ca",
        date: "2026-03-05",
      },
    ],
  },
];

export function EligibilityReviewWorkspace() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [selectedAppId, setSelectedAppId] = useState<string>("app-airsense-001");
  const app = SAMPLE_APPLICATIONS.find((a) => a.id === selectedAppId) || SAMPLE_APPLICATIONS[0];

  const [leftTab, setLeftTab] = useState<"summary" | "profile" | "documents">("summary");
  const [currentStatus, setCurrentStatus] = useState<EligibilityStatus>("PENDING_REVIEW");

  // The 7 Required Checks
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: "chk-1",
      name: "Startup Registration",
      category: "Statutory Eligibility",
      description: "Active DPIIT Startup Recognition Certificate & valid incorporation (< 10 years).",
      documentRef: "DPIIT_Startup_Recognition_Certificate.pdf",
      status: "PASS",
      notes: "Verified against Ministry of Commerce DPIIT portal database. Registered 2022.",
    },
    {
      id: "chk-2",
      name: "Required Documents",
      category: "Dossier Completeness",
      description: "Complete proposal submission: Technical architecture, balance sheet, and certificates.",
      documentRef: "All 5 Attached Documents",
      status: "PASS",
      notes: "All 5 mandatory proposal appendices present with valid SHA-256 cryptographic digests.",
    },
    {
      id: "chk-3",
      name: "Certifications",
      category: "Quality & Safety",
      description: "NABL laboratory certification for RoHS compliance, IP65 enclosure, and ISO 9001:2015.",
      documentRef: "NABL_IP65_RoHS_Test_Report.pdf",
      status: "PASS",
      notes: "Accredited NABL test report confirms IP65 weatherproof and lead-free electronics.",
    },
    {
      id: "chk-4",
      name: "Technology Requirement",
      category: "Technical Feasibility",
      description: "Dual-beam laser optical scattering capable of PM1, PM2.5, PM10 simultaneous detection.",
      documentRef: "AirSense_Technical_Architecture_Whitepaper.pdf",
      status: "PASS",
      notes: "Exceeds requirement with automated cyclonic optical purge mechanism.",
    },
    {
      id: "chk-5",
      name: "Experience",
      category: "Track Record",
      description: "Minimum 1-year operational track record or 1 verified public/industrial sensor pilot.",
      documentRef: "Previous Deployments Section",
      status: "PASS",
      notes: "Verified 25-node deployment in Panki industrial estate with 96.4% uptime.",
    },
    {
      id: "chk-6",
      name: "Financial Requirements",
      category: "Commercial Solvency",
      description: "Positive net worth, minimum 6 months verifiable operating runway, zero credit defaults.",
      documentRef: "Audited_Balance_Sheet_FY2024_2025.pdf",
      status: "PASS",
      notes: "14 months confirmed runway; positive balance sheet audited by chartered accountants.",
    },
    {
      id: "chk-7",
      name: "Security Requirements",
      category: "Sovereign Governance",
      description: "Sovereign Indian data residency (MeitY cloud) and Level 2 CERT-In VAPT audit clearance.",
      documentRef: "CERT-In_Level2_VAPT_Audit_Clearance.pdf",
      status: "PASS",
      notes: "Indian AWS GovCloud tenancy confirmed. CERT-In Level 2 VAPT report clean.",
    },
  ]);

  // Reviewer Notes & Privacy
  const [internalNotes, setInternalNotes] = useState(
    "Application satisfies all 7 statutory criteria under GFR 2017 Rule 149. Excellent track record in tropical environmental IoT deployments."
  );
  const [decisionReason, setDecisionReason] = useState("");
  const [isPublicToStartup, setIsPublicToStartup] = useState(false);
  const [showReasonError, setShowReasonError] = useState(false);

  // Audit Ledger
  const [auditLog, setAuditLog] = useState<AuditRecord[]>([
    {
      id: "AUDIT-001",
      reviewerName: "Rajesh Verma",
      reviewerRole: "Director of Urban Development (UP)",
      timestamp: "26 Mar 2026, 17:30 IST",
      decision: "PENDING_REVIEW",
      reason: "Initial submission received and queued for eligibility screening.",
      isPublicToStartup: false,
      reviewedDocumentsCount: 5,
      cryptographicSeal: "sha256:7b91...88c2",
    },
  ]);

  // Document preview modal
  const [previewDoc, setPreviewDoc] = useState<ApplicationReviewData["documents"][0] | null>(null);

  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);

  const handleChecklistStatusChange = (
    checkId: string,
    newStatus: "PASS" | "CONDITIONAL" | "FAIL" | "PENDING"
  ) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === checkId ? { ...item, status: newStatus } : item))
    );
  };

  const handleDecision = async (decision: EligibilityStatus) => {
    // Reason is strictly required for Reject (INELIGIBLE) or Conditional Approval (CONDITIONALLY_ELIGIBLE)
    if ((decision === "INELIGIBLE" || decision === "CONDITIONALLY_ELIGIBLE") && !decisionReason.trim()) {
      setShowReasonError(true);
      showToast({
        type: "error",
        title: "Reason Required",
        description: "Statutory procurement rules require a documented reason for rejection or conditional approval.",
      });
      return;
    }

    setShowReasonError(false);
    setIsSubmittingDecision(true);

    try {
      const res = await fetch("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: app.id,
          decision,
          reason: decisionReason.trim() || internalNotes || "Standard statutory approval.",
          startupName: app.startupName,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        showToast({
          type: "error",
          title: "Decision Failed",
          description: data.error || "Failed to submit eligibility determination.",
        });
        setIsSubmittingDecision(false);
        return;
      }
    } catch (e) {
      console.warn("Eligibility review offline fallback:", e);
    } finally {
      setIsSubmittingDecision(false);
    }

    setCurrentStatus(decision);

    const reviewer = `${currentUser?.firstName || "Rajesh"} ${currentUser?.lastName || "Verma"}`;
    const role = currentUser?.designation || "Director of Urban Development (UP)";
    const now = new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const newAuditRecord: AuditRecord = {
      id: `AUDIT-${Date.now()}`,
      reviewerName: reviewer,
      reviewerRole: role,
      timestamp: `${now} IST`,
      decision,
      reason: decisionReason.trim() || internalNotes || "Standard statutory approval.",
      isPublicToStartup,
      reviewedDocumentsCount: app.documents.length,
      cryptographicSeal: `sha256:${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
    };

    setAuditLog((prev) => [newAuditRecord, ...prev]);

    showToast({
      type: decision === "ELIGIBLE" ? "success" : decision === "INELIGIBLE" ? "error" : "warning",
      title: `Application Marked as ${decision.replace(/_/g, " ")}`,
      description: `Official statutory audit entry recorded by ${reviewer}.`,
    });
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Top Header & Application Queue Bar */}
      <div className="bg-white border border-gov-border rounded-card p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="default" className="bg-gov-primary font-mono text-xs">
                OFFICIAL ELIGIBILITY DESK
              </Badge>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-gov-muted font-medium">
                GFR 2017 Rule 149 Pre-Qualification Screening
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gov-primary tracking-tight">
              Government Eligibility Review Workspace
            </h1>
          </div>

          {/* Application Selector Queue */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs text-gov-muted font-semibold hidden sm:inline">
              Submission Queue:
            </span>
            <select
              value={selectedAppId}
              onChange={(e) => {
                setSelectedAppId(e.target.value);
                setCurrentStatus("PENDING_REVIEW");
                setDecisionReason("");
              }}
              className="text-xs border border-gov-border rounded-control px-3 py-1.5 bg-white font-semibold text-slate-800"
            >
              {SAMPLE_APPLICATIONS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.startupName} ({item.applicationNumber})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Active Dossier Meta Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 border border-slate-200/90 rounded-control p-3">
          <div>
            <span className="text-xs text-gov-muted font-mono uppercase block">APPLICANT STARTUP</span>
            <span className="font-bold text-slate-900 truncate block">{app.startupName}</span>
            <span className="text-xs font-mono text-gov-accent">{app.dpiitNumber}</span>
          </div>

          <div>
            <span className="text-xs text-gov-muted font-mono uppercase block">TARGET CHALLENGE</span>
            <span className="font-semibold text-slate-800 truncate block">{app.challengeTitle}</span>
            <span className="text-xs text-gov-muted font-mono">{app.challengeCode}</span>
          </div>

          <div>
            <span className="text-xs text-gov-muted font-mono uppercase block">PROPOSED BUDGET</span>
            <span className="font-bold text-slate-900 font-mono text-sm">{app.proposedCost}</span>
            <span className="text-xs text-gov-muted block">Max: {app.budgetCeiling}</span>
          </div>

          <div>
            <span className="text-xs text-gov-muted font-mono uppercase block">ELIGIBILITY STATUS</span>
            <Badge
              variant={
                currentStatus === "ELIGIBLE"
                  ? "success"
                  : currentStatus === "INELIGIBLE"
                  ? "destructive"
                  : currentStatus === "CONDITIONALLY_ELIGIBLE"
                  ? "warning"
                  : "secondary"
              }
              className="font-mono text-xs mt-0.5"
            >
              {currentStatus.replace(/_/g, " ")}
            </Badge>
          </div>
        </div>
      </div>

      {/* SPLIT-SCREEN WORKSPACE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL (6 COLS): STARTUP PROFILE, APPLICATION SUMMARY, DOCUMENTS */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-gov-border rounded-card shadow-sm overflow-hidden flex flex-col h-[740px]">
            {/* Left Header Tabs */}
            <div className="grid grid-cols-3 border-b border-gov-border bg-slate-100/70 p-1 text-xs font-semibold">
              <button
                onClick={() => setLeftTab("summary")}
                className={`py-2 px-1 rounded text-center transition-all ${
                  leftTab === "summary"
                    ? "bg-white text-gov-primary font-bold shadow-2xs border border-slate-200"
                    : "text-gov-muted hover:text-slate-900"
                }`}
              >
                Application Summary
              </button>
              <button
                onClick={() => setLeftTab("profile")}
                className={`py-2 px-1 rounded text-center transition-all ${
                  leftTab === "profile"
                    ? "bg-white text-gov-primary font-bold shadow-2xs border border-slate-200"
                    : "text-gov-muted hover:text-slate-900"
                }`}
              >
                Startup Profile
              </button>
              <button
                onClick={() => setLeftTab("documents")}
                className={`py-2 px-1 rounded text-center transition-all ${
                  leftTab === "documents"
                    ? "bg-white text-gov-primary font-bold shadow-2xs border border-slate-200"
                    : "text-gov-muted hover:text-slate-900"
                }`}
              >
                Documents ({app.documents.length})
              </button>
            </div>

            {/* Left Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-left">
              {/* TAB 1: APPLICATION SUMMARY */}
              {leftTab === "summary" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-gov-accent font-bold uppercase tracking-wider block">
                      PROPOSAL SPECIFICATION
                    </span>
                    <h3 className="text-base font-extrabold text-gov-primary leading-tight">
                      {app.solutionTitle}
                    </h3>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-control space-y-1">
                    <span className="text-xs font-mono text-gov-muted uppercase font-bold block">
                      EXECUTIVE SUMMARY
                    </span>
                    <p className="text-slate-700 leading-relaxed text-xs">
                      {app.executiveSummary}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 text-xs block">
                      Sensor & Hardware Specifications:
                    </span>
                    <p className="text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200/80 leading-relaxed text-xs">
                      {app.sensorSpecs}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 text-xs block">
                      Telemetry & Backhaul Integration:
                    </span>
                    <p className="text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200/80 leading-relaxed text-xs">
                      {app.telemetryProtocol}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 text-xs block">
                      Committed Target Validation Benchmarks (KPIs):
                    </span>
                    <ul className="space-y-1.5">
                      {app.targetKpis.map((kpi, idx) => (
                        <li key={idx} className="flex items-center text-slate-800 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0" />
                          <span>{kpi}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 2: STARTUP PROFILE */}
              {leftTab === "profile" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{app.startupName}</h3>
                      <p className="text-xs text-gov-muted">Incorporated on {app.incorporationDate}</p>
                    </div>
                    <Badge variant="outline" className="text-emerald-800 bg-emerald-50 border-emerald-300 font-mono text-xs">
                      DPIIT VERIFIED
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200/80">
                      <span className="text-xs text-gov-muted font-mono uppercase block">DPIIT NUMBER</span>
                      <span className="font-semibold text-slate-900 font-mono">{app.dpiitNumber}</span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200/80">
                      <span className="text-xs text-gov-muted font-mono uppercase block">CORPORATE CIN</span>
                      <span className="font-semibold text-slate-900 font-mono">{app.cinNumber}</span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200/80">
                      <span className="text-xs text-gov-muted font-mono uppercase block">FINANCIAL RUNWAY</span>
                      <span className="font-semibold text-slate-900">{app.operatingRunway}</span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200/80">
                      <span className="text-xs text-gov-muted font-mono uppercase block">NET WORTH AUDIT</span>
                      <span className="font-semibold text-emerald-800">{app.netWorth}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-control space-y-1">
                    <span className="text-xs font-mono text-gov-primary uppercase font-bold block">
                      SOVEREIGN DATA RESIDENCY TENANCY
                    </span>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      {app.sovereignDataHost}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/startup/profile?challengeId=${app.challengeCode}`}
                      target="_blank"
                      className="text-gov-accent hover:underline text-xs font-semibold flex items-center"
                    >
                      Inspect Full B2B Capability Profile <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              )}

              {/* TAB 3: DOCUMENTS */}
              {leftTab === "documents" && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <span className="text-xs font-mono text-gov-muted font-bold uppercase tracking-wider block">
                    CRYPTOGRAPHICALLY SEALED PROPOSAL DOSSIER
                  </span>

                  <div className="space-y-2">
                    {app.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-control flex items-center justify-between hover:bg-slate-100 transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-slate-900 text-xs truncate">
                            {doc.name}
                          </p>
                          <span className="text-xs text-gov-muted font-mono">
                            {doc.category} • {doc.size} • {doc.sha256}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1.5 shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPreviewDoc(doc)}
                            className="text-xs h-6 px-2 border-slate-300"
                          >
                            <Eye className="w-3 h-3 mr-1" /> Inspect
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL (6 COLS): ELIGIBILITY CHECKLIST & REVIEWER DECISION */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-gov-border rounded-card shadow-sm p-5 space-y-5 text-xs text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-xs font-mono text-gov-accent font-bold uppercase tracking-wider block">
                  STATUTORY EVALUATION GATE
                </span>
                <h2 className="text-sm font-bold text-gov-primary">
                  Official Eligibility Checklist (7 Checks)
                </h2>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                {checklist.filter((c) => c.status === "PASS").length} of 7 Passed
              </Badge>
            </div>

            {/* The 7 Checks */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {checklist.map((item, index) => (
                <div
                  key={item.id}
                  className={`border rounded-control p-3 transition-colors ${
                    item.status === "PASS"
                      ? "bg-slate-50/70 border-slate-200"
                      : item.status === "CONDITIONAL"
                      ? "bg-amber-50/50 border-amber-200"
                      : item.status === "FAIL"
                      ? "bg-red-50/50 border-red-200"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono text-slate-400 font-bold text-xs">
                          {index + 1}.
                        </span>
                        <span className="font-bold text-slate-900 text-xs">{item.name}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-tight">
                        {item.description}
                      </p>
                    </div>

                    {/* Status Pill Switcher */}
                    <div className="flex rounded-md border border-slate-200 bg-white p-0.5 shrink-0 text-xs font-mono font-semibold">
                      <button
                        onClick={() => handleChecklistStatusChange(item.id, "PASS")}
                        className={`px-2 py-0.5 rounded transition-all ${
                          item.status === "PASS"
                            ? "bg-emerald-600 text-white font-bold"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Pass
                      </button>
                      <button
                        onClick={() => handleChecklistStatusChange(item.id, "CONDITIONAL")}
                        className={`px-2 py-0.5 rounded transition-all ${
                          item.status === "CONDITIONAL"
                            ? "bg-amber-600 text-white font-bold"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Cond.
                      </button>
                      <button
                        onClick={() => handleChecklistStatusChange(item.id, "FAIL")}
                        className={`px-2 py-0.5 rounded transition-all ${
                          item.status === "FAIL"
                            ? "bg-red-600 text-white font-bold"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Fail
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gov-muted pt-1 border-t border-slate-100">
                    <span className="font-mono">Ref: {item.documentRef}</span>
                    <span className="text-slate-600 italic">{item.notes}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Reviewer Confidential Internal Notes & Public Visibility Switch */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 text-xs flex items-center">
                    <Lock className="w-3 h-3 text-gov-primary mr-1" />
                    Reviewer Evaluation Notes
                  </label>
                  <span className="text-xs text-gov-muted font-mono">Confidential Internal</span>
                </div>
                <Textarea
                  rows={2}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Record confidential review remarks for the evaluation committee..."
                  className="text-xs"
                />
              </div>

              {/* Mandatory Reason Input (Strictly enforced when Rejecting or Conditionally Approving) */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 text-xs">
                  Statutory Decision Reason / Conditions{" "}
                  <span className="text-gov-muted font-normal text-xs">
                    (Mandatory for Rejection or Conditional Approval)
                  </span>
                </label>
                <Input
                  value={decisionReason}
                  onChange={(e) => {
                    setDecisionReason(e.target.value);
                    if (showReasonError) setShowReasonError(false);
                  }}
                  placeholder="e.g. Approved subject to submitting collocated CAAQMS calibration curve within 14 days."
                  className={`text-xs ${showReasonError ? "border-red-500 ring-1 ring-red-300" : ""}`}
                />
                {showReasonError && (
                  <p className="text-xs text-red-600 font-semibold flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Statutory Reason is strictly required for this decision.
                  </p>
                )}
              </div>

              {/* Privacy Control: Do NOT expose internal notes unless explicitly allowed */}
              <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-control flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="shareNotes"
                  checked={isPublicToStartup}
                  onChange={(e) => setIsPublicToStartup(e.target.checked)}
                  className="w-4 h-4 rounded text-gov-primary mt-0.5"
                />
                <label htmlFor="shareNotes" className="text-xs text-amber-950 leading-tight cursor-pointer">
                  <strong>Allow startup to view notes:</strong> Keep unchecked to protect double-blind internal government deliberations. Only check if issuing a formal public clarification request.
                </label>
              </div>

              {/* Four Decision Action Buttons */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-xs font-mono text-gov-muted font-bold uppercase tracking-wider block">
                  COMMIT STATUTORY DETERMINATION
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Button
                    size="sm"
                    disabled={isSubmittingDecision}
                    onClick={() => handleDecision("ELIGIBLE")}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold h-8"
                  >
                    <Check className="w-3 h-3 mr-1" /> Approve
                  </Button>

                  <Button
                    size="sm"
                    disabled={isSubmittingDecision}
                    onClick={() => handleDecision("CONDITIONALLY_ELIGIBLE")}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold h-8"
                  >
                    <Clock className="w-3 h-3 mr-1" /> Conditional
                  </Button>

                  <Button
                    size="sm"
                    disabled={isSubmittingDecision}
                    onClick={() => handleDecision("CLARIFICATION_REQUIRED")}
                    className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold h-8"
                  >
                    <MessageSquare className="w-3 h-3 mr-1" /> Clarification
                  </Button>

                  <Button
                    size="sm"
                    disabled={isSubmittingDecision}
                    onClick={() => handleDecision("INELIGIBLE")}
                    className="bg-red-700 hover:bg-red-800 text-white text-xs font-semibold h-8"
                  >
                    <X className="w-3 h-3 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RECORDED AUDIT EVENTS SECTION */}
      <div className="bg-white border border-gov-border rounded-card p-5 shadow-sm space-y-3 text-left text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-gov-primary" />
            <h3 className="font-bold text-gov-primary font-mono text-xs uppercase tracking-wider">
              Recorded Eligibility Audit Trail (GFR 2017 Audit Ledger)
            </h3>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            {auditLog.length} Recorded Events
          </Badge>
        </div>

        <div className="border border-gov-border rounded-control overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-xs uppercase font-mono text-gov-muted border-b border-gov-border">
              <tr>
                <th className="p-2.5">Reviewer & Designation</th>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">Determination</th>
                <th className="p-2.5">Reason / Stipulations</th>
                <th className="p-2.5">Confidentiality</th>
                <th className="p-2.5 text-right">Cryptographic Seal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLog.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60">
                  <td className="p-2.5">
                    <span className="font-semibold text-slate-900 block">{log.reviewerName}</span>
                    <span className="text-xs text-gov-muted">{log.reviewerRole}</span>
                  </td>
                  <td className="p-2.5 font-mono text-slate-600 text-xs">{log.timestamp}</td>
                  <td className="p-2.5">
                    <Badge
                      variant={
                        log.decision === "ELIGIBLE"
                          ? "success"
                          : log.decision === "INELIGIBLE"
                          ? "destructive"
                          : log.decision === "CONDITIONALLY_ELIGIBLE"
                          ? "warning"
                          : "secondary"
                      }
                      className="font-mono text-xs"
                    >
                      {log.decision.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="p-2.5 text-slate-700 text-xs max-w-xs">{log.reason}</td>
                  <td className="p-2.5">
                    {log.isPublicToStartup ? (
                      <span className="text-xs text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        Public to Startup
                      </span>
                    ) : (
                      <span className="text-xs text-slate-600 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                        Internal Only
                      </span>
                    )}
                  </td>
                  <td className="p-2.5 font-mono text-right text-xs text-gov-muted">
                    {log.cryptographicSeal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-card border border-gov-border bg-white shadow-2xl p-6 space-y-4 text-left max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-2">
                <FileCheck2 className="w-4 h-4 text-gov-primary" />
                <h3 className="font-bold text-sm text-gov-primary">{previewDoc.name}</h3>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-slate-600 text-sm">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200 text-xs font-mono">
              <div><span className="text-gov-muted block">CATEGORY</span>{previewDoc.category}</div>
              <div><span className="text-gov-muted block">FILE SIZE</span>{previewDoc.size}</div>
              <div><span className="text-gov-muted block">SHA-256 SEAL</span>{previewDoc.sha256}</div>
            </div>

            <div className="border border-slate-200 rounded p-6 bg-slate-50/50 text-center space-y-2">
              <FileText className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold text-slate-800">
                Official Government Document Preview
              </p>
              <p className="text-xs text-gov-muted max-w-sm mx-auto">
                Cryptographically anchored verification payload is verified intact against the State Digital Repository.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setPreviewDoc(null)} className="text-xs">
                Close Inspector
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
