"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/auth/AuthContext";
import {
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
  UploadCloud,
  ChevronRight,
  UserCheck,
  Building2,
} from "lucide-react";

export type MilestoneStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "OVERDUE";

export interface MilestoneEvidence {
  id: string;
  title: string;
  category: string;
  size: string;
  sha256: string;
  uploadDate: string;
  uploadedBy: string;
  verified: boolean;
}

export interface MilestoneDeliverable {
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;
}

export interface MilestoneItem {
  id: string;
  code: string; // M1, M2, M3, M4, M5
  name: string;
  description: string;
  weight: number; // percentage out of 100
  deadline: string;
  isOverdue?: boolean;
  status: MilestoneStatus;
  deliverables: MilestoneDeliverable[];
  kpi: {
    name: string;
    target: string;
    actual: string;
    isSatisfied: boolean;
  };
  evidence: MilestoneEvidence[];
  payment: {
    tranche: string;
    amount: string;
    percentage: number;
    invoiceNumber?: string;
    escrowStatus: "RELEASED" | "PENDING_RELEASE" | "IN_ESCROW";
  };
  approval?: {
    approvedBy?: string;
    approvedAt?: string;
    rejectedBy?: string;
    rejectedAt?: string;
    rejectionReason?: string;
    reviewNotes?: string;
  };
}

const INITIAL_MILESTONES: MilestoneItem[] = [
  {
    id: "m1",
    code: "M1",
    name: "Testbed Collocation & Baseline Calibration",
    description:
      "Deploy 4 calibrated optical particulate counters alongside the CPCB BAM-1020 reference analyzer at Lalbagh station to establish baseline linear regression coefficients.",
    weight: 20,
    deadline: "10 Jun 2026",
    status: "APPROVED",
    deliverables: [
      { id: "d1-1", name: "CPCB Station Collocation Agreement", description: "Clearance with Central Pollution Control Board", isCompleted: true },
      { id: "d1-2", name: "Laboratory Optical Calibration Curve", description: "Ray-trace regression data sheets", isCompleted: true },
      { id: "d1-3", name: "Baseline Collocation Telemetry Log", description: "14-day continuous parallel hourly sampling", isCompleted: true },
    ],
    kpi: {
      name: "BAM-1020 Linear Correlation (R²)",
      target: "≥ 0.90",
      actual: "0.94",
      isSatisfied: true,
    },
    evidence: [
      {
        id: "ev1-1",
        title: "Lalbagh_CAAQMS_14Day_Collocation_Raw.csv",
        category: "Laboratory Telemetry",
        size: "8.4 MB",
        sha256: "9a8f10b2...7f8g",
        uploadDate: "06 Jun 2026",
        uploadedBy: "AirSense Systems Engineer",
        verified: true,
      },
      {
        id: "ev1-2",
        title: "TERI_Accredited_Collocation_Audit_TR1.pdf",
        category: "Third-Party Audit",
        size: "3.2 MB",
        sha256: "b1093ef4...4e5f",
        uploadDate: "07 Jun 2026",
        uploadedBy: "Priya Nair (TERI Auditor)",
        verified: true,
      },
    ],
    payment: {
      tranche: "Tranche 1 (Mobilization & Equipment)",
      amount: "₹5,00,000",
      percentage: 20,
      invoiceNumber: "INV-AS-2026-01",
      escrowStatus: "RELEASED",
    },
    approval: {
      approvedBy: "Rajesh Verma (Director of Urban Development)",
      approvedAt: "08 Jun 2026, 15:40 IST",
      reviewNotes: "All 3 deliverables verified. Correlation coefficient R² = 0.94 exceeds statutory threshold.",
    },
  },
  {
    id: "m2",
    code: "M2",
    name: "Municipal Ward Deployment & LoRaWAN Gateway Network",
    description:
      "Physical pole-mounting of 40 optical particulate nodes across Wards 14, 18, 22, and 29. Integration of encrypted LoRaWAN telemetry pushing into Lucknow ICCC.",
    weight: 25,
    deadline: "30 Jun 2026",
    status: "APPROVED",
    deliverables: [
      { id: "d2-1", name: "40 Streetlight Pole Mounting Deeds", description: "Municipal Right-of-Way Electrical Sign-offs", isCompleted: true },
      { id: "d2-2", name: "LoRaWAN Gateway Cluster Calibration", description: "Coverage audit confirming zero dead zones", isCompleted: true },
      { id: "d2-3", name: "Lucknow ICCC Realtime Ingress Link", description: "MQTT TLS 1.3 telemetry stream active", isCompleted: true },
    ],
    kpi: {
      name: "Sensor Network Ward Geographic Coverage",
      target: "≥ 85.0%",
      actual: "88.5%",
      isSatisfied: true,
    },
    evidence: [
      {
        id: "ev2-1",
        title: "Lucknow_Pole_Mounting_GIS_Shapefile.zip",
        category: "GIS Spatial Layer",
        size: "14.2 MB",
        sha256: "4f53cda1...1202",
        uploadDate: "26 Jun 2026",
        uploadedBy: "AirSense Systems Engineer",
        verified: true,
      },
      {
        id: "ev2-2",
        title: "ICCC_MQTT_Ingress_Handshake_Receipt.pdf",
        category: "Municipal Verification",
        size: "1.8 MB",
        sha256: "c819a089...9384",
        uploadDate: "27 Jun 2026",
        uploadedBy: "Lucknow Smart City Engineer",
        verified: true,
      },
    ],
    payment: {
      tranche: "Tranche 2 (Network Deployment)",
      amount: "₹6,50,000",
      percentage: 25,
      invoiceNumber: "INV-AS-2026-02",
      escrowStatus: "RELEASED",
    },
    approval: {
      approvedBy: "Sunita Deshmukh (Procurement Officer)",
      approvedAt: "28 Jun 2026, 11:20 IST",
      reviewNotes: "All 40 sensor nodes verified broadcasting into ICCC dashboard. NEFT disbursement cleared.",
    },
  },
  {
    id: "m3",
    code: "M3",
    name: "Continuous 60-Day Telemetry & Automated Misting Triggers",
    description:
      "Maintain >= 95% node uptime, transmit continuous 60-day time-series telemetry, and validate autonomous misting truck dispatch triggers upon localized PM threshold exceedances.",
    weight: 25,
    deadline: "31 Jul 2026",
    status: "UNDER_REVIEW",
    deliverables: [
      { id: "d3-1", name: "60-Day Uninterrupted Telemetry Log", description: "Time-series particulate readings at 60s intervals", isCompleted: true },
      { id: "d3-2", name: "Automated Misting Vehicle Dispatch Logs", description: "Verified records of geofenced misting interventions", isCompleted: true },
      { id: "d3-3", name: "Anti-Fouling Optical Purge Diagnostic", description: "Purge cycle telemetry confirming zero sensor drift", isCompleted: true },
    ],
    kpi: {
      name: "Hourly Hardware Telemetry Uptime",
      target: "≥ 95.0%",
      actual: "97.2%",
      isSatisfied: true,
    },
    evidence: [
      {
        id: "ev3-1",
        title: "60_Day_Sensor_Telemetry_Dataset.parquet",
        category: "Time-Series Dataset",
        size: "42.8 MB",
        sha256: "e3b0c442...b855",
        uploadDate: "Today, 09:30 IST",
        uploadedBy: "AirSense Systems Engineer",
        verified: false,
      },
      {
        id: "ev3-2",
        title: "Automated_Misting_Dispatch_Audit_Logs.csv",
        category: "Municipal Dispatch Evidence",
        size: "2.4 MB",
        sha256: "721a93b4...119f",
        uploadDate: "Today, 09:35 IST",
        uploadedBy: "AirSense Systems Engineer",
        verified: false,
      },
    ],
    payment: {
      tranche: "Tranche 3 (Operational Field Telemetry)",
      amount: "₹6,50,000",
      percentage: 25,
      invoiceNumber: "INV-AS-2026-03",
      escrowStatus: "PENDING_RELEASE",
    },
    approval: {
      reviewNotes: "Deliverables submitted for official Government Officer evaluation.",
    },
  },
  {
    id: "m4",
    code: "M4",
    name: "Third-Party Empirical Audit & Environmental Validation",
    description:
      "Accredited testing agency (TERI) conducts unannounced parallel collocated audits to certify regression linearity and mean absolute percentage error.",
    weight: 15,
    deadline: "10 Aug 2026",
    status: "IN_PROGRESS",
    deliverables: [
      { id: "d4-1", name: "Unannounced Parallel BAM-1020 Audit", description: "Independent calibration audit by TERI lab", isCompleted: false },
      { id: "d4-2", name: "Mean Absolute Percentage Error Report", description: "Statistical verification across humidity extremes", isCompleted: false },
    ],
    kpi: {
      name: "Mean Absolute Percentage Error vs Reference",
      target: "≤ 5.0%",
      actual: "3.4% (Preliminary)",
      isSatisfied: true,
    },
    evidence: [
      {
        id: "ev4-1",
        title: "TERI_Preliminary_Parallel_Audit_Memo.pdf",
        category: "Interim Validation",
        size: "2.6 MB",
        sha256: "1f82ba93...34ca",
        uploadDate: "20 Sep 2026",
        uploadedBy: "Priya Nair (TERI Auditor)",
        verified: true,
      },
    ],
    payment: {
      tranche: "Tranche 4 (Independent Validation Audit)",
      amount: "₹3,50,000",
      percentage: 15,
      escrowStatus: "IN_ESCROW",
    },
  },
  {
    id: "m5",
    code: "M5",
    name: "Replication Blueprint & Scale Transition Handover",
    description:
      "Formulate municipal operations and maintenance handbook, open-source API adapters, and scale transition blueprint for replication across 17 Uttar Pradesh Smart Cities.",
    weight: 15,
    deadline: "25 Aug 2026",
    status: "NOT_STARTED",
    deliverables: [
      { id: "d5-1", name: "Municipal Operations & Maintenance Handbook", description: "Routine maintenance and sensor lifecycle manual", isCompleted: false },
      { id: "d5-2", name: "Statewide 17-City Replication Blueprint", description: "Procurement specifications under GFR 149", isCompleted: false },
      { id: "d5-3", name: "Final Pilot Acceptance Certificate", description: "Signed by Municipal Commissioner", isCompleted: false },
    ],
    kpi: {
      name: "Final Municipal Pilot Acceptance",
      target: "100% Sign-Off",
      actual: "Scheduled",
      isSatisfied: false,
    },
    evidence: [],
    payment: {
      tranche: "Tranche 5 (Final Acceptance & Handover)",
      amount: "₹3,00,000",
      percentage: 15,
      escrowStatus: "IN_ESCROW",
    },
  },
];

export function MilestoneManagementWorkspace() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [milestones, setMilestones] = useState<MilestoneItem[]>(INITIAL_MILESTONES);
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneItem | null>(INITIAL_MILESTONES[2]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Persona switcher: Allows testing both Startup submission & Government approval
  const [currentPersona, setCurrentPersona] = useState<"GOVERNMENT" | "STARTUP">("GOVERNMENT");

  // Rejection Modal / Drawer state (Mandatory comments when rejecting)
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionComment, setRejectionComment] = useState("");
  const [rejectionError, setRejectionError] = useState(false);

  // Upload Evidence Drawer State (for Startup)
  const [showUploadEvidence, setShowUploadEvidence] = useState(false);
  const [newEvidenceTitle, setNewEvidenceTitle] = useState("");
  const [newEvidenceCategory, setNewEvidenceCategory] = useState("Telemetry Dataset");
  const [newEvidenceNotes, setNewEvidenceNotes] = useState("");

  // ========================================================
  // AUTOMATICALLY CALCULATE OVERALL PILOT PROGRESS
  // Progress = Sum(Approved Milestones Weight) + (In Progress / Under Review partial credit)
  // ========================================================
  const overallProgress = useMemo(() => {
    let totalScore = 0;
    milestones.forEach((m) => {
      if (m.status === "APPROVED") {
        totalScore += m.weight;
      } else if (m.status === "UNDER_REVIEW" || m.status === "SUBMITTED") {
        totalScore += m.weight * 0.7; // 70% credit for deliverables submitted under review
      } else if (m.status === "IN_PROGRESS") {
        totalScore += m.weight * 0.3; // 30% credit for in-progress execution
      }
    });
    return Math.min(100, Math.round(totalScore));
  }, [milestones]);

  const approvedCount = milestones.filter((m) => m.status === "APPROVED").length;
  const totalBudgetDisbursed = milestones
    .filter((m) => m.payment.escrowStatus === "RELEASED")
    .reduce((sum, m) => sum + parseInt(m.payment.amount.replace(/[^0-9]/g, "")), 0);

  // Drawer handlers
  const handleOpenMilestoneDrawer = (m: MilestoneItem) => {
    setSelectedMilestone(m);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setShowRejectDialog(false);
    setShowUploadEvidence(false);
  };

  // Government Action: Approve Milestone
  const handleApprove = async (milestoneId: string) => {
    const reviewerName = `${currentUser?.firstName || "Rajesh"} ${currentUser?.lastName || "Verma"} (${currentUser?.designation || "Director of Urban Development"})`;
    const now = new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      await fetch("/api/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve",
          milestoneId,
          pilotId: "pilot-air-001",
          milestoneName: selectedMilestone?.name || "Milestone Deliverable",
          paymentAmount: selectedMilestone ? parseInt(selectedMilestone.payment.amount.replace(/[^0-9]/g, "")) || 800000 : 800000,
        }),
      });
    } catch (e) {
      console.warn("Milestone approve offline fallback:", e);
    }

    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              status: "APPROVED",
              payment: {
                ...m.payment,
                escrowStatus: "RELEASED",
              },
              approval: {
                approvedBy: reviewerName,
                approvedAt: `${now} IST`,
                reviewNotes: "All milestone deliverables and empirical evidence verified compliant under GFR Rule 149.",
              },
            }
          : m
      )
    );

    // Update selected milestone in drawer
    setSelectedMilestone((prev) =>
      prev && prev.id === milestoneId
        ? {
            ...prev,
            status: "APPROVED",
            payment: { ...prev.payment, escrowStatus: "RELEASED" },
            approval: {
              approvedBy: reviewerName,
              approvedAt: `${now} IST`,
              reviewNotes: "All milestone deliverables and empirical evidence verified compliant under GFR Rule 149.",
            },
          }
        : prev
    );

    showToast({
      type: "success",
      title: "Milestone Officially Approved",
      description: `Approved by ${reviewerName}. Treasury payment released. Overall progress updated to ${overallProgress}%.`,
    });
  };

  // Government Action: Reject Milestone (Requires Mandatory Reason)
  const handleCommitRejection = () => {
    if (!rejectionComment.trim()) {
      setRejectionError(true);
      showToast({
        type: "error",
        title: "Rejection Reason Required",
        description: "Statutory rules require documenting specific technical deficiencies before rejecting a milestone.",
      });
      return;
    }

    if (!selectedMilestone) return;

    const reviewerName = `${currentUser?.firstName || "Rajesh"} ${currentUser?.lastName || "Verma"} (${currentUser?.designation || "Director of Urban Development"})`;
    const now = new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setMilestones((prev) =>
      prev.map((m) =>
        m.id === selectedMilestone.id
          ? {
              ...m,
              status: "REJECTED",
              approval: {
                rejectedBy: reviewerName,
                rejectedAt: `${now} IST`,
                rejectionReason: rejectionComment.trim(),
              },
            }
          : m
      )
    );

    setSelectedMilestone((prev) =>
      prev
        ? {
            ...prev,
            status: "REJECTED",
            approval: {
              rejectedBy: reviewerName,
              rejectedAt: `${now} IST`,
              rejectionReason: rejectionComment.trim(),
            },
          }
        : prev
    );

    setShowRejectDialog(false);
    setRejectionComment("");
    setRejectionError(false);

    showToast({
      type: "error",
      title: "Milestone Rejected",
      description: "Official rejection audit record logged. Comments forwarded to startup for rectification.",
    });
  };

  // Startup Action: Submit Milestone Evidence
  const handleUploadEvidence = async () => {
    if (!newEvidenceTitle.trim()) {
      showToast({
        type: "error",
        title: "Evidence Title Required",
        description: "Please specify the file name or deliverable title.",
      });
      return;
    }

    if (!selectedMilestone) return;

    try {
      await fetch("/api/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit_evidence",
          milestoneId: selectedMilestone.id,
          pilotId: "pilot-air-001",
          milestoneName: selectedMilestone.name,
          evidenceTitle: newEvidenceTitle.trim(),
        }),
      });
    } catch (e) {
      console.warn("Upload evidence offline fallback:", e);
    }

    const randomHash = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");

    const newEv: MilestoneEvidence = {
      id: `ev-${Date.now()}`,
      title: newEvidenceTitle.trim(),
      category: newEvidenceCategory,
      size: "18.4 MB",
      sha256: `${randomHash.slice(0, 8)}...${randomHash.slice(-4)}`,
      uploadDate: "Just now",
      uploadedBy: `${currentUser?.firstName || "AirSense"} Founder`,
      verified: false,
    };

    setMilestones((prev) =>
      prev.map((m) =>
        m.id === selectedMilestone.id
          ? {
              ...m,
              status: "UNDER_REVIEW",
              evidence: [newEv, ...m.evidence],
            }
          : m
      )
    );

    setSelectedMilestone((prev) =>
      prev
        ? {
            ...prev,
            status: "UNDER_REVIEW",
            evidence: [newEv, ...prev.evidence],
          }
        : prev
    );

    setNewEvidenceTitle("");
    setNewEvidenceNotes("");
    setShowUploadEvidence(false);

    showToast({
      type: "success",
      title: "Milestone Evidence Uploaded",
      description: "Status advanced to 'UNDER REVIEW'. Government evaluation desk notified.",
    });
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* ======================================================== */}
      {/* 1. TOP HEADER & AUTOMATIC PROGRESS STRIP                 */}
      {/* ======================================================== */}
      <div className="bg-white border border-gov-border rounded-card p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="default" className="bg-gov-primary font-mono text-xs">
                PILOT MILESTONE MANAGEMENT SYSTEM
              </Badge>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-gov-muted font-medium">
                GFR 2017 Rule 149 Performance Tranches
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gov-primary tracking-tight">
              Contractual Milestones: Urban Air Quality Pilot
            </h1>
            <p className="text-xs text-gov-muted mt-0.5">
              Pilot Code: <strong className="text-slate-800 font-mono">PILOT-UP-UAQ-01</strong> • 90-Day Municipal Innovation Testbed
            </p>
          </div>

          {/* Persona Switcher Toggle */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-control text-xs font-semibold shrink-0">
            <span className="text-xs uppercase font-mono text-gov-muted px-2">Role View:</span>
            <button
              onClick={() => setCurrentPersona("GOVERNMENT")}
              className={`px-3 py-1 rounded transition-all flex items-center space-x-1 ${
                currentPersona === "GOVERNMENT"
                  ? "bg-gov-primary text-white shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 mr-1" /> Government Officer
            </button>
            <button
              onClick={() => setCurrentPersona("STARTUP")}
              className={`px-3 py-1 rounded transition-all flex items-center space-x-1 ${
                currentPersona === "STARTUP"
                  ? "bg-gov-primary text-white shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 mr-1" /> Startup Founder
            </button>
          </div>
        </div>

        {/* AUTOMATIC OVERALL PROGRESS BANNER */}
        <div className="bg-slate-50 border border-slate-200 rounded-control p-4 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          {/* Progress Bar & Value */}
          <div className="sm:col-span-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono text-gov-muted font-bold">
                AUTOMATIC OVERALL PILOT PROGRESS
              </span>
              <span className="font-mono text-lg font-extrabold text-gov-primary">
                {overallProgress}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gov-accent h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span className="text-xs text-slate-500 block">
              Calculated automatically from {approvedCount} of 5 approved milestone tranches
            </span>
          </div>

          {/* Treasury Escrow Disbursed */}
          <div className="space-y-0.5 border-l border-slate-200 pl-4">
            <span className="text-xs uppercase font-mono text-gov-muted font-bold">
              TREASURY DISBURSED
            </span>
            <div className="font-mono text-base font-extrabold text-emerald-700">
              ₹{totalBudgetDisbursed.toLocaleString("en-IN")}
            </div>
            <span className="text-xs text-slate-500 block">
              Total Budget: ₹24,50,000 (100%)
            </span>
          </div>

          {/* Current Active Milestone */}
          <div className="space-y-0.5 border-l border-slate-200 pl-4">
            <span className="text-xs uppercase font-mono text-gov-muted font-bold">
              ACTIVE STAGE
            </span>
            <div className="font-mono text-xs font-bold text-amber-900">
              Milestone 3 (Under Review)
            </div>
            <span className="text-xs text-gov-muted block">
              SLA: 22 Days Remaining
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. VISUAL TIMELINE: M1 → M2 → M3 → M4 → M5               */}
      {/* Clicking a milestone opens a drawer                      */}
      {/* ======================================================== */}
      <div className="bg-white border border-gov-border rounded-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-sm font-bold text-gov-primary flex items-center">
              <span className="w-1.5 h-3.5 bg-gov-accent rounded-xs mr-2" />
              Contractual Progress Timeline: M1 → M2 → M3 → M4 → M5
            </h2>
            <p className="text-xs text-gov-muted">
              Click any milestone node to open its slide-over inspection drawer
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Interactive Drawer Trigger Active
          </span>
        </div>

        {/* Horizontal Visual Timeline Progression Track */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {milestones.map((m, idx) => {
            const isApproved = m.status === "APPROVED";
            const isUnderReview = m.status === "UNDER_REVIEW";
            const isSubmitted = m.status === "SUBMITTED";
            const isInProgress = m.status === "IN_PROGRESS";
            const isRejected = m.status === "REJECTED";
            const isOverdue = m.status === "OVERDUE";
            const isNotStarted = m.status === "NOT_STARTED";

            return (
              <div
                key={m.id}
                onClick={() => handleOpenMilestoneDrawer(m)}
                className={`p-3.5 rounded-card border text-left cursor-pointer transition-all hover:shadow-md relative flex flex-col justify-between ${
                  isApproved
                    ? "bg-emerald-50/40 border-emerald-300 hover:border-emerald-500"
                    : isUnderReview || isSubmitted
                    ? "bg-amber-50/50 border-amber-300 hover:border-amber-500 ring-1 ring-amber-200"
                    : isRejected
                    ? "bg-red-50/40 border-red-300 hover:border-red-500"
                    : isInProgress
                    ? "bg-blue-50/30 border-blue-300 hover:border-blue-500"
                    : "bg-slate-50/60 border-slate-200 hover:border-slate-300 opacity-80"
                }`}
              >
                {/* Node Code & Arrow Indicator */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-7 h-7 rounded-full font-mono font-extrabold text-xs flex items-center justify-center shrink-0 ${
                      isApproved
                        ? "bg-emerald-600 text-white"
                        : isUnderReview || isSubmitted
                        ? "bg-amber-600 text-white"
                        : isRejected
                        ? "bg-red-600 text-white"
                        : isInProgress
                        ? "bg-blue-600 text-white"
                        : "bg-slate-300 text-slate-700"
                    }`}
                  >
                    {m.code}
                  </span>

                  {idx < 4 && (
                    <span className="text-slate-300 font-bold hidden md:inline">
                      →
                    </span>
                  )}
                </div>

                {/* Milestone Name */}
                <div className="space-y-1 mb-2">
                  <h3 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2">
                    {m.name}
                  </h3>
                  <span className="text-xs text-gov-muted font-mono block">
                    Due: {m.deadline}
                  </span>
                </div>

                {/* Status Badge & Deliverable Count */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <Badge
                    variant={
                      isApproved
                        ? "success"
                        : isUnderReview || isSubmitted
                        ? "warning"
                        : isRejected
                        ? "destructive"
                        : isInProgress
                        ? "default"
                        : "secondary"
                    }
                    className="font-mono text-xs"
                  >
                    {m.status.replace(/_/g, " ")}
                  </Badge>

                  <span className="text-xs font-mono text-slate-500 font-semibold">
                    {m.payment.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. MILESTONE CARDS OVERVIEW LIST                         */}
      {/* ======================================================== */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-gov-primary flex items-center">
          <span className="w-1.5 h-3.5 bg-gov-accent rounded-xs mr-2" />
          Milestone Breakdown & Evidence Registry
        </h2>

        <div className="space-y-3">
          {milestones.map((m) => (
            <div
              key={m.id}
              onClick={() => handleOpenMilestoneDrawer(m)}
              className="bg-white border border-gov-border rounded-card p-4 hover:border-gov-accent transition-all cursor-pointer shadow-2xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-2.5">
                  <span className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 font-mono font-extrabold text-xs text-slate-800 flex items-center justify-center shrink-0">
                    {m.code}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{m.name}</h3>
                    <p className="text-xs text-gov-muted">
                      Target Deadline: <strong className="text-slate-700 font-mono">{m.deadline}</strong> • Weight: {m.weight}% of Total Pilot
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="font-mono font-bold text-slate-900 text-xs">
                    {m.payment.amount}
                  </span>
                  <Badge
                    variant={
                      m.status === "APPROVED"
                        ? "success"
                        : m.status === "UNDER_REVIEW" || m.status === "SUBMITTED"
                        ? "warning"
                        : m.status === "REJECTED"
                        ? "destructive"
                        : m.status === "IN_PROGRESS"
                        ? "default"
                        : "secondary"
                    }
                    className="font-mono text-xs"
                  >
                    {m.status.replace(/_/g, " ")}
                  </Badge>
                  <Button size="sm" variant="outline" className="text-xs h-8 border-slate-300">
                    Open Drawer <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>

              <p className="text-slate-700 text-xs leading-relaxed">{m.description}</p>

              {/* KPI and Evidence Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs bg-slate-50 p-2.5 rounded border border-slate-200/80">
                <div>
                  <span className="text-xs uppercase font-mono text-gov-muted block">
                    KEY PERFORMANCE INDICATOR (KPI)
                  </span>
                  <span className="font-semibold text-slate-800 text-xs">
                    {m.kpi.name}: <strong className="text-emerald-700">{m.kpi.actual}</strong> (Target: {m.kpi.target})
                  </span>
                </div>

                <div>
                  <span className="text-xs uppercase font-mono text-gov-muted block">
                    EVIDENCE ATTACHMENTS
                  </span>
                  <span className="font-semibold text-slate-800 text-xs">
                    {m.evidence.length} Sealed Document(s) Attached
                  </span>
                </div>

                <div>
                  <span className="text-xs uppercase font-mono text-gov-muted block">
                    APPROVAL STATUS
                  </span>
                  <span className="font-semibold text-slate-800 text-xs">
                    {m.approval?.approvedBy || m.approval?.rejectedBy || "Pending Officer Determination"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. SLIDE-OVER DRAWER FOR MILESTONE DETAILS               */}
      {/* Clicking a milestone opens this drawer rather than        */}
      {/* navigating to another page                               */}
      {/* ======================================================== */}
      {isDrawerOpen && selectedMilestone && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-gov-border overflow-hidden text-left text-xs animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Badge variant="default" className="bg-gov-primary font-mono text-xs">
                    {selectedMilestone.code} DOSSIER
                  </Badge>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-gov-muted font-mono">
                    Weight: {selectedMilestone.weight}%
                  </span>
                </div>
                <h2 className="text-base font-extrabold text-gov-primary leading-tight">
                  {selectedMilestone.name}
                </h2>
                <div className="flex items-center space-x-2 font-mono text-xs text-gov-muted">
                  <span>Contractual Deadline: <strong className="text-slate-900">{selectedMilestone.deadline}</strong></span>
                  <span>•</span>
                  <span>Tranche: <strong className="text-emerald-700">{selectedMilestone.payment.amount}</strong></span>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <Badge
                  variant={
                    selectedMilestone.status === "APPROVED"
                      ? "success"
                      : selectedMilestone.status === "UNDER_REVIEW" || selectedMilestone.status === "SUBMITTED"
                      ? "warning"
                      : selectedMilestone.status === "REJECTED"
                      ? "destructive"
                      : selectedMilestone.status === "IN_PROGRESS"
                      ? "default"
                      : "secondary"
                  }
                  className="font-mono text-xs"
                >
                  {selectedMilestone.status.replace(/_/g, " ")}
                </Badge>
                <button
                  onClick={handleCloseDrawer}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-control hover:bg-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Scrollable Body (All 8 Required Fields) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Field 1: Description */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-gov-primary font-bold uppercase tracking-wider block">
                  1. WORK PACKAGE SCOPE & DESCRIPTION
                </span>
                <p className="text-slate-700 leading-relaxed text-xs bg-slate-50 p-3 rounded border border-slate-200">
                  {selectedMilestone.description}
                </p>
              </div>

              {/* Field 2: Deadline & SLA */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-xs font-mono text-gov-muted uppercase block">
                    CONTRACTUAL DEADLINE
                  </span>
                  <span className="font-bold text-slate-900 font-mono text-xs">
                    {selectedMilestone.deadline}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-xs font-mono text-gov-muted uppercase block">
                    PAYMENT DISBURSEMENT TRANCHE
                  </span>
                  <span className="font-bold text-emerald-800 font-mono text-xs">
                    {selectedMilestone.payment.amount} ({selectedMilestone.payment.percentage}%)
                  </span>
                </div>
              </div>

              {/* Field 3: Deliverables Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-gov-primary font-bold uppercase tracking-wider block">
                  2. REQUIRED CONTRACTUAL DELIVERABLES
                </span>
                <div className="space-y-1.5">
                  {selectedMilestone.deliverables.map((del) => (
                    <div
                      key={del.id}
                      className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-start space-x-2"
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          del.isCompleted ? "text-emerald-600" : "text-slate-300"
                        }`}
                      />
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">{del.name}</span>
                        <span className="text-xs text-slate-600">{del.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Field 4: KPI Benchmark Tracking */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-gov-primary font-bold uppercase tracking-wider block">
                  3. MEASURABLE PERFORMANCE BENCHMARK (KPI)
                </span>
                <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-control flex items-center justify-between">
                  <div>
                    <span className="font-bold text-purple-950 text-xs block">
                      {selectedMilestone.kpi.name}
                    </span>
                    <span className="text-xs text-purple-900">
                      Contractual Baseline: <strong className="font-mono">{selectedMilestone.kpi.target}</strong>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono text-purple-800 uppercase block">
                      VERIFIED ACTUAL
                    </span>
                    <span className="font-mono font-extrabold text-sm text-emerald-700">
                      {selectedMilestone.kpi.actual}
                    </span>
                  </div>
                </div>
              </div>

              {/* Field 5: Evidence Documents & Startup Upload Terminal */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gov-primary font-bold uppercase tracking-wider block">
                    4. EMPIRICAL EVIDENCE & SENSOR LOGS ({selectedMilestone.evidence.length})
                  </span>

                  {currentPersona === "STARTUP" && (
                    <Button
                      size="sm"
                      onClick={() => setShowUploadEvidence(true)}
                      className="bg-gov-primary text-xs h-6 px-2 font-semibold"
                    >
                      <UploadCloud className="w-3 h-3 mr-1" /> Upload Evidence
                    </Button>
                  )}
                </div>

                {/* Upload Form (Revealed when Startup clicks Upload) */}
                {showUploadEvidence && (
                  <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-control space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-950 text-xs">
                        Upload Milestone Verification Artifact
                      </span>
                      <button
                        onClick={() => setShowUploadEvidence(false)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="font-bold text-slate-800 text-xs block mb-0.5">
                          Evidence Title / File Name:
                        </label>
                        <Input
                          value={newEvidenceTitle}
                          onChange={(e) => setNewEvidenceTitle(e.target.value)}
                          placeholder="e.g. 60Day_TimeSeries_Particulate_Telemetry.parquet"
                          className="text-xs h-8"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-bold text-slate-800 text-xs block mb-0.5">
                            Category:
                          </label>
                          <select
                            value={newEvidenceCategory}
                            onChange={(e) => setNewEvidenceCategory(e.target.value)}
                            className="w-full text-xs border border-gov-border rounded p-1 bg-white font-semibold"
                          >
                            <option value="Time-Series Dataset">Time-Series Dataset (CSV/Parquet)</option>
                            <option value="Third-Party Lab Report">Third-Party Lab Report (NABL/TERI)</option>
                            <option value="GIS Spatial Layer">GIS Spatial Layer (Shapefile)</option>
                            <option value="Municipal Dispatch Logs">Municipal Dispatch Logs</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-slate-800 text-xs block mb-0.5">
                            Simulated Cryptographic Digest:
                          </label>
                          <span className="text-xs font-mono text-slate-500 block pt-1">
                            SHA-256 Chained Automatically
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowUploadEvidence(false)}
                        className="text-xs h-6 px-2"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleUploadEvidence}
                        className="bg-gov-primary text-xs h-6 px-2.5 font-semibold text-white"
                      >
                        Confirm & Attach File
                      </Button>
                    </div>
                  </div>
                )}

                {/* Evidence List */}
                <div className="space-y-2">
                  {selectedMilestone.evidence.length === 0 ? (
                    <div className="p-3 bg-slate-50 rounded border border-slate-200 text-center text-gov-muted text-xs">
                      No evidence uploaded yet. Startup must attach empirical proof before review.
                    </div>
                  ) : (
                    selectedMilestone.evidence.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between hover:bg-slate-100 transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-slate-900 text-xs truncate">{ev.title}</p>
                          <span className="text-xs text-gov-muted font-mono block">
                            {ev.category} • {ev.size} • Uploaded {ev.uploadDate} by {ev.uploadedBy}
                          </span>
                          <span className="text-xs text-slate-400 font-mono block">
                            SHA-256: {ev.sha256}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1.5 shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              showToast({
                                type: "info",
                                title: "Inspecting Evidence",
                                description: `Verifying SHA-256 seal for ${ev.title}.`,
                              })
                            }
                            className="text-xs h-6 px-2 border-slate-300"
                          >
                            <Eye className="w-3 h-3 mr-1" /> Inspect
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Field 6: Payment Details */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-gov-primary font-bold uppercase tracking-wider block">
                  5. TREASURY ESCROW & DISBURSEMENT
                </span>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {selectedMilestone.payment.tranche}
                    </span>
                    <span className="text-xs text-gov-muted font-mono">
                      Invoice: {selectedMilestone.payment.invoiceNumber || "Pending Generation"}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-slate-900 block">
                      {selectedMilestone.payment.amount}
                    </span>
                    <Badge
                      variant={
                        selectedMilestone.payment.escrowStatus === "RELEASED"
                          ? "success"
                          : selectedMilestone.payment.escrowStatus === "PENDING_RELEASE"
                          ? "warning"
                          : "outline"
                      }
                      className="font-mono text-xs"
                    >
                      {selectedMilestone.payment.escrowStatus.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <Link
                    href={`/payments?milestone=${selectedMilestone.code}`}
                    className="inline-flex items-center text-xs font-semibold text-gov-primary hover:underline mt-1"
                  >
                    <CreditCard className="w-3 h-3 mr-1" />
                    Open Payment in Treasury Ledger →
                  </Link>
                </div>
              </div>

              {/* Field 7: Approval Status & Historical Deliberations */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-gov-primary font-bold uppercase tracking-wider block">
                  6. OFFICIAL STATUTORY DETERMINATION & MINUTES
                </span>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">
                      {selectedMilestone.approval?.approvedBy || selectedMilestone.approval?.rejectedBy || "Deliberation Status:"}
                    </span>
                    <span className="text-xs font-mono text-gov-muted">
                      {selectedMilestone.approval?.approvedAt || selectedMilestone.approval?.rejectedAt || "Pending"}
                    </span>
                  </div>

                  {selectedMilestone.approval?.reviewNotes && (
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {selectedMilestone.approval.reviewNotes}
                    </p>
                  )}

                  {selectedMilestone.approval?.rejectionReason && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded text-red-900 text-xs">
                      <strong>Rejection Rationale:</strong> {selectedMilestone.approval.rejectionReason}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer with Official Action Buttons */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-gov-muted">
                Role Clearance: <strong>{currentPersona === "GOVERNMENT" ? "Government Officer" : "Startup Partner"}</strong>
              </span>

              <div className="flex items-center space-x-2">
                {currentPersona === "GOVERNMENT" ? (
                  <>
                    {/* Government Action 1: Reject Milestone (Requires Comments) */}
                    <Button
                      size="sm"
                      onClick={() => setShowRejectDialog(true)}
                      className="bg-red-700 hover:bg-red-800 text-white text-xs font-semibold h-8"
                    >
                      <X className="w-3.5 h-3.5 mr-1" /> Reject Milestone
                    </Button>

                    {/* Government Action 2: Approve Milestone */}
                    <Button
                      size="sm"
                      onClick={() => handleApprove(selectedMilestone.id)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold h-8"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" /> Approve & Authorize
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Startup Action: Submit Milestone for Review */}
                    <Button
                      size="sm"
                      onClick={() => {
                        setMilestones((prev) =>
                          prev.map((m) =>
                            m.id === selectedMilestone.id ? { ...m, status: "UNDER_REVIEW" } : m
                          )
                        );
                        setSelectedMilestone((prev) => (prev ? { ...prev, status: "UNDER_REVIEW" } : prev));
                        showToast({
                          type: "success",
                          title: "Submitted for Government Review",
                          description: "Notification dispatched to Lucknow Department of Urban Development.",
                        });
                      }}
                      className="bg-purple-800 hover:bg-purple-900 text-white text-xs font-semibold h-8"
                    >
                      <Send className="w-3.5 h-3.5 mr-1" /> Submit for Verification
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: MANDATORY REJECTION COMMENTS                      */}
      {/* "If rejected, require comments."                         */}
      {/* ======================================================== */}
      {showRejectDialog && selectedMilestone && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-card shadow-2xl border border-gov-border max-w-md w-full p-5 space-y-4 text-left text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Document Milestone Rejection Rationale
                </h3>
              </div>
              <button
                onClick={() => setShowRejectDialog(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-slate-700 leading-normal text-xs">
                Under GFR Rule 149 procurement protocols, rejecting a submitted milestone requires
                documenting explicit technical deficiencies or deliverable gaps.
              </p>

              <div>
                <label className="font-bold text-slate-800 text-xs block mb-1">
                  Statutory Rejection Comments <span className="text-red-600 font-bold">*</span>
                </label>
                <Textarea
                  rows={3}
                  value={rejectionComment}
                  onChange={(e) => {
                    setRejectionComment(e.target.value);
                    if (rejectionError) setRejectionError(false);
                  }}
                  placeholder="State specific deficiencies (e.g. 60-day telemetry missing Ward 22 sensor logs between 14-18 July; BAM-1020 collocation regression drift exceeds 5%)..."
                  className={`text-xs ${rejectionError ? "border-red-500 ring-1 ring-red-300" : ""}`}
                />
                {rejectionError && (
                  <p className="text-xs text-red-600 font-semibold flex items-center mt-1">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Rejection comments are mandatory by procurement audit regulations.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowRejectDialog(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCommitRejection}
                className="bg-red-700 hover:bg-red-800 text-white text-xs font-semibold"
              >
                Commit Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
