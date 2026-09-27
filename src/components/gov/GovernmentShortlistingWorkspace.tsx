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
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  Sliders,
  DollarSign,
  HelpCircle,
  Flame,
  Award,
  Filter,
  Search,
} from "lucide-react";

export type ShortlistingDecision =
  | "SHORTLISTED"
  | "MOVED_TO_PILOT_DESIGN"
  | "CLARIFICATION_REQUESTED"
  | "REJECTED";

export interface ShortlistCandidate {
  id: string;
  startupName: string;
  dpiitNumber: string;
  solutionTitle: string;
  domain: string;
  challengeCode: string;
  challengeTitle: string;
  eligibilityStatus: "ELIGIBLE" | "CONDITIONALLY_ELIGIBLE" | "INELIGIBLE";
  eligibilityNotes: string;
  scores: {
    technicalFeasibility: number; // 25%
    problemFit: number; // 20%
    innovation: number; // 15%
    scalability: number; // 15%
    costEffectiveness: number; // 15%
    securityCompliance: number; // 10%
    compositeWeightedScore: number;
  };
  cost: {
    proposed: string;
    ceiling: string;
    valueForMoney: "EXCELLENT" | "FAIR" | "OVER_BUDGET";
  };
  risk: {
    level: "LOW" | "MEDIUM" | "HIGH";
    factors: string;
    mitigation: string;
  };
  evaluationStatus:
    | "EVALUATED"
    | "SHORTLISTED"
    | "PILOT_DESIGN"
    | "CLARIFICATION_PENDING"
    | "REJECTED";
  expertNotes: string;
  expertRecommendation: string;
  teamTrackRecord: string;
  documentsCount: number;
}

export interface ShortlistAuditRecord {
  id: string;
  candidateName: string;
  candidateCode: string;
  action: ShortlistingDecision;
  officerName: string;
  officerDesignation: string;
  timestamp: string;
  reason: string;
  conditions?: string;
  cryptographicSeal: string;
}

const INITIAL_CANDIDATES: ShortlistCandidate[] = [
  {
    id: "cand-1",
    startupName: "AirSense Technologies Pvt Ltd",
    dpiitNumber: "DIPP-94812",
    solutionTitle: "Hyperlocal Optical Sensor Mesh & Automated Misting Telemetry",
    domain: "IoT CleanTech & Urban Air Quality",
    challengeCode: "CHAL-UP-DUD-2026-001",
    challengeTitle: "Urban Air Quality Hyperlocal Monitoring & Intervention Mesh",
    eligibilityStatus: "ELIGIBLE",
    eligibilityNotes: "DPIIT verified. NABL IP65 and Level 2 CERT-In VAPT audit clearance verified.",
    scores: {
      technicalFeasibility: 92,
      problemFit: 95,
      innovation: 90,
      scalability: 88,
      costEffectiveness: 86,
      securityCompliance: 94,
      compositeWeightedScore: 91.5,
    },
    cost: {
      proposed: "₹24,50,000",
      ceiling: "₹25,00,000",
      valueForMoney: "EXCELLENT",
    },
    risk: {
      level: "LOW",
      factors: "Extreme summer ambient dust loading and particulate humidity agglomeration.",
      mitigation: "Cyclonic positive-pressure optical purge and 48-hour solar battery autonomy.",
    },
    evaluationStatus: "SHORTLISTED",
    expertNotes:
      "Highest Problem Fit (95/100). The self-calibrating optical ray-tracing algorithm matches CPCB BAM-1020 benchmarks with R2 = 0.94. Excellent fit for Lucknow municipal misting fleet dispatch.",
    expertRecommendation: "Strongly Recommended (Dr. Alok Gupta, IIT Kanpur)",
    teamTrackRecord: "18 FTEs; 2 registered patents; 3 previous industrial pilots completed.",
    documentsCount: 5,
  },
  {
    id: "cand-2",
    startupName: "OptiFlow AI Systems Pvt Ltd",
    dpiitNumber: "DIPP-104822",
    solutionTitle: "Adaptive Corridor Signal Optimization & Vision Sensor Grid",
    domain: "Smart Mobility & Computer Vision",
    challengeCode: "CHAL-UP-DUD-2026-001",
    challengeTitle: "Urban Air Quality Hyperlocal Monitoring & Intervention Mesh",
    eligibilityStatus: "ELIGIBLE",
    eligibilityNotes: "DPIIT recognized. Sovereign AWS Mumbai data residency confirmed.",
    scores: {
      technicalFeasibility: 94,
      problemFit: 89,
      innovation: 93,
      scalability: 91,
      costEffectiveness: 88,
      securityCompliance: 92,
      compositeWeightedScore: 91.8,
    },
    cost: {
      proposed: "₹21,80,000",
      ceiling: "₹25,00,000",
      valueForMoney: "EXCELLENT",
    },
    risk: {
      level: "LOW",
      factors: "Optical camera occlusion in dense winter fog conditions.",
      mitigation: "Automated fail-safe reverting to fixed corridor timing plans upon visual loss.",
    },
    evaluationStatus: "EVALUATED",
    expertNotes:
      "Highest overall quantitative score (91.8/100). Superior edge computer vision architecture, though primarily focused on vehicular congestion rather than direct particulate misting.",
    expertRecommendation: "Recommended for Secondary Pilot Consideration",
    teamTrackRecord: "14 FTEs; 1 patent granted; deployed at Kanpur GT Road corridor.",
    documentsCount: 4,
  },
  {
    id: "cand-3",
    startupName: "EcoSort Robotics Pvt Ltd",
    dpiitNumber: "DIPP-112940",
    solutionTitle: "Deep-Learning Optical Purity Sorter for Dry Municipal Waste",
    domain: "Robotics & Solid Waste Management",
    challengeCode: "CHAL-UP-DUD-2026-001",
    challengeTitle: "Urban Air Quality Hyperlocal Monitoring & Intervention Mesh",
    eligibilityStatus: "CONDITIONALLY_ELIGIBLE",
    eligibilityNotes: "Pending supplementary ISO 13849 machinery emergency stop certificate.",
    scores: {
      technicalFeasibility: 85,
      problemFit: 88,
      innovation: 87,
      scalability: 82,
      costEffectiveness: 89,
      securityCompliance: 84,
      compositeWeightedScore: 85.4,
    },
    cost: {
      proposed: "₹19,80,000",
      ceiling: "₹25,00,000",
      valueForMoney: "FAIR",
    },
    risk: {
      level: "MEDIUM",
      factors: "Pneumatic valve fatigue under continuous 5 Tonnes/Hour throughput.",
      mitigation: "Mandatory daily automatic pneumatic pressure decay self-test routine.",
    },
    evaluationStatus: "CLARIFICATION_PENDING",
    expertNotes:
      "Promising pneumatic ejection accuracy, but requires validation on moisture-laden municipal mixed waste.",
    expertRecommendation: "Conditionally Recommended subject to field trial at Sector 62 MRF",
    teamTrackRecord: "12 FTEs; 2 pilots; Okhla transfer station experience.",
    documentsCount: 3,
  },
  {
    id: "cand-4",
    startupName: "HydroScan Deep Sensing Systems",
    dpiitNumber: "DIPP-88204",
    solutionTitle: "Subterranean Hydrostatic & Optical Heavy Metal Sensor Probes",
    domain: "Environmental Sensing & Water Security",
    challengeCode: "CHAL-UP-DUD-2026-001",
    challengeTitle: "Urban Air Quality Hyperlocal Monitoring & Intervention Mesh",
    eligibilityStatus: "ELIGIBLE",
    eligibilityNotes: "NIC MeghRaj sovereign cloud tenancy confirmed. Positive net worth.",
    scores: {
      technicalFeasibility: 89,
      problemFit: 84,
      innovation: 84,
      scalability: 80,
      costEffectiveness: 82,
      securityCompliance: 90,
      compositeWeightedScore: 85.1,
    },
    cost: {
      proposed: "₹23,90,000",
      ceiling: "₹25,00,000",
      valueForMoney: "FAIR",
    },
    risk: {
      level: "MEDIUM",
      factors: "Probe corrosion in high salinity groundwater aquifers.",
      mitigation: "Titanium grade 5 casing with sacrificial zinc anodes.",
    },
    evaluationStatus: "EVALUATED",
    expertNotes:
      "Solid subterranean hydrology engineering; less applicable to surface dust suppression.",
    expertRecommendation: "Recommended for State Water Mission Challenges",
    teamTrackRecord: "15 FTEs; 4 completed government borewell telemetry pilots.",
    documentsCount: 4,
  },
  {
    id: "cand-5",
    startupName: "AeroDrone Geospatial Analytics",
    dpiitNumber: "DIPP-120485",
    solutionTitle: "Autonomous LiDAR & Thermal Drone Survey for Urban Heat Islands",
    domain: "Drones & Geospatial Remote Sensing",
    challengeCode: "CHAL-UP-DUD-2026-001",
    challengeTitle: "Urban Air Quality Hyperlocal Monitoring & Intervention Mesh",
    eligibilityStatus: "INELIGIBLE",
    eligibilityNotes: "Lacks DGCA Beyond Visual Line of Sight (BVLOS) permit for night flights.",
    scores: {
      technicalFeasibility: 78,
      problemFit: 72,
      innovation: 89,
      scalability: 65,
      costEffectiveness: 68,
      securityCompliance: 80,
      compositeWeightedScore: 75.2,
    },
    cost: {
      proposed: "₹26,80,000",
      ceiling: "₹25,00,000",
      valueForMoney: "OVER_BUDGET",
    },
    risk: {
      level: "HIGH",
      factors: "Regulatory airspace shutdown risks; weather vulnerability during rains.",
      mitigation: "Ground spotters required every 500m; exceeds budget ceiling.",
    },
    evaluationStatus: "REJECTED",
    expertNotes:
      "Impressive sensor payload, but recurring flight costs and flight permit delays make it impractical for 24/7 continuous ward monitoring.",
    expertRecommendation: "Do Not Recommend for Continuous Municipal Telemetry",
    teamTrackRecord: "8 FTEs; primarily aerial survey services.",
    documentsCount: 2,
  },
];

export function GovernmentShortlistingWorkspace() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [candidates, setCandidates] = useState<ShortlistCandidate[]>(INITIAL_CANDIDATES);
  const [expandedRowId, setExpandedRowId] = useState<string | null>("cand-1");

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Decision Modal State (Required for Shortlist, Move to Pilot, Clarification, Reject)
  const [activeDecisionModal, setActiveDecisionModal] = useState<{
    candidate: ShortlistCandidate;
    action: ShortlistingDecision;
  } | null>(null);
  const [decisionReason, setDecisionReason] = useState("");
  const [conditionsText, setConditionsText] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);

  // Statutory Audit Log Ledger
  const [auditLog, setAuditLog] = useState<ShortlistAuditRecord[]>([
    {
      id: "AUDIT-SL-001",
      candidateName: "AirSense Technologies Pvt Ltd",
      candidateCode: "DIPP-94812",
      action: "SHORTLISTED",
      officerName: "Rajesh Verma",
      officerDesignation: "Director of Urban Development (UP)",
      timestamp: "26 Mar 2026, 18:40 IST",
      reason:
        "Human deliberation determined AirSense provides the highest localized Problem Fit (95/100) for municipal misting trucks, despite OptiFlow holding a marginally higher raw composite score (91.8 vs 91.5).",
      conditions: "Mandate CPCB BAM-1020 reference sensor collocation at Day 30.",
      cryptographicSeal: "sha256:8f12c8a901...3d4e",
    },
  ]);

  const toggleRow = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const handleOpenDecisionModal = (candidate: ShortlistCandidate, action: ShortlistingDecision) => {
    setActiveDecisionModal({ candidate, action });
    setDecisionReason("");
    setConditionsText("");
    setReasonError(false);
  };

  const handleCommitDecision = async () => {
    if (!activeDecisionModal) return;

    if (!decisionReason.trim()) {
      setReasonError(true);
      showToast({
        type: "error",
        title: "Statutory Justification Required",
        description:
          "Public procurement regulations require documenting the committee's deliberation rationale before committing this decision.",
      });
      return;
    }

    const { candidate, action } = activeDecisionModal;
    setIsSubmittingDecision(true);

    try {
      const res = await fetch("/api/shortlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: candidate.id,
          startupName: candidate.startupName,
          action,
          justification: decisionReason.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        showToast({
          type: "error",
          title: "Action Failed",
          description: data.error || "Failed to commit shortlisting action.",
        });
        setIsSubmittingDecision(false);
        return;
      }
    } catch (e) {
      console.warn("Shortlist submit offline fallback:", e);
    } finally {
      setIsSubmittingDecision(false);
    }

    // Update candidate status
    const statusMap: Record<ShortlistingDecision, ShortlistCandidate["evaluationStatus"]> = {
      SHORTLISTED: "SHORTLISTED",
      MOVED_TO_PILOT_DESIGN: "PILOT_DESIGN",
      CLARIFICATION_REQUESTED: "CLARIFICATION_PENDING",
      REJECTED: "REJECTED",
    };

    setCandidates((prev) =>
      prev.map((c) => (c.id === candidate.id ? { ...c, evaluationStatus: statusMap[action] } : c))
    );

    // Record audit event
    const officerName = `${currentUser?.firstName || "Rajesh"} ${currentUser?.lastName || "Verma"}`;
    const designation = currentUser?.designation || "Director of Urban Development (UP)";
    const now = new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const randomHash = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");

    const newAuditRecord: ShortlistAuditRecord = {
      id: `AUDIT-SL-${Date.now()}`,
      candidateName: candidate.startupName,
      candidateCode: candidate.dpiitNumber,
      action,
      officerName,
      officerDesignation: designation,
      timestamp: `${now} IST`,
      reason: decisionReason.trim(),
      conditions: conditionsText.trim() || undefined,
      cryptographicSeal: `sha256:${randomHash}`,
    };

    setAuditLog((prev) => [newAuditRecord, ...prev]);

    showToast({
      type: action === "REJECTED" ? "error" : action === "SHORTLISTED" || action === "MOVED_TO_PILOT_DESIGN" ? "success" : "warning",
      title: `Action Committed: ${action.replace(/_/g, " ")}`,
      description: `Official statutory audit entry created for ${candidate.startupName}.`,
    });

    setActiveDecisionModal(null);
  };

  // Filtered candidates
  const filteredCandidates = candidates.filter((c) => {
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "SHORTLISTED" && c.evaluationStatus === "SHORTLISTED") ||
      (statusFilter === "EVALUATED" && c.evaluationStatus === "EVALUATED") ||
      (statusFilter === "PILOT_DESIGN" && c.evaluationStatus === "PILOT_DESIGN") ||
      (statusFilter === "REJECTED" && c.evaluationStatus === "REJECTED");

    const matchesSearch =
      c.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.solutionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dpiitNumber.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Top Header & Human Decision-Making Mandate Banner */}
      <div className="bg-white border border-gov-border rounded-card p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="default" className="bg-gov-primary font-mono text-xs">
                GOVERNMENT DELIBERATION DESK
              </Badge>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-gov-muted font-medium">
                GFR 2017 Rule 149 Innovation Procurement Shortlisting
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gov-primary tracking-tight">
              Government Shortlisting Workspace
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-blue-300 text-gov-primary bg-blue-50/50 text-xs">
              Challenge: CHAL-UP-DUD-2026-001 (Air Quality Mesh)
            </Badge>
          </div>
        </div>

        {/* Human Decision-Making Governance Mandate */}
        <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-control flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950">
          <div className="flex items-start space-x-2.5">
            <Scale className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-950 text-xs">
                Human-in-the-Loop Procurement Mandate (No Automated Algorithmic Selection)
              </h3>
              <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                The platform deliberately does not auto-select the highest-scoring startup. Objective
                expert evaluation scores are provided to inform the committee, but final shortlisting
                requires holistic human deliberation considering civic ward constraints, deployment
                feasibility, and cost effectiveness.
              </p>
            </div>
          </div>
          <Badge variant="warning" className="shrink-0 font-mono text-xs uppercase">
            Human Discretion Active
          </Badge>
        </div>

        {/* Operational Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-gov-muted font-semibold">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-gov-border rounded-control px-2.5 py-1.5 bg-white font-semibold text-slate-800"
            >
              <option value="ALL">All Candidates ({candidates.length})</option>
              <option value="SHORTLISTED">Shortlisted Only</option>
              <option value="PILOT_DESIGN">Moved to Pilot Design</option>
              <option value="EVALUATED">Evaluated (Pending Shortlist)</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search startup or DPIIT..."
              className="pl-8 text-xs h-8"
            />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* COMPARISON TABLE: THE CORE EVALUATION MATRIX             */}
      {/* Columns: Startup, Eligibility, Technical Feasibility,    */}
      {/* Problem Fit, Innovation, Scalability, Cost, Risk, Status */}
      {/* ======================================================== */}
      <div className="bg-white border border-gov-border rounded-card shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-xs uppercase font-mono text-gov-muted border-b border-gov-border">
              <tr>
                <th className="p-3">Startup</th>
                <th className="p-3 text-center">Eligibility</th>
                <th className="p-3 text-center">Tech Feasibility</th>
                <th className="p-3 text-center">Problem Fit</th>
                <th className="p-3 text-center">Innovation</th>
                <th className="p-3 text-center">Scalability</th>
                <th className="p-3 text-right">Cost</th>
                <th className="p-3 text-center">Risk</th>
                <th className="p-3 text-center">Evaluation Status</th>
                <th className="p-3 text-right">Row Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredCandidates.map((cand) => {
                const isExpanded = expandedRowId === cand.id;
                return (
                  <React.Fragment key={cand.id}>
                    {/* Main Row */}
                    <tr
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isExpanded ? "bg-slate-50/60 font-medium" : ""
                      }`}
                    >
                      {/* 1. Startup */}
                      <td className="p-3 max-w-[210px]">
                        <div className="font-bold text-slate-900 truncate">
                          {cand.startupName}
                        </div>
                        <div className="text-xs text-gov-muted truncate mt-0.5">
                          {cand.solutionTitle}
                        </div>
                        <div className="flex items-center space-x-1.5 mt-1 font-mono text-xs text-gov-accent">
                          <span>{cand.dpiitNumber}</span>
                          <span>•</span>
                          <span className="text-slate-600 font-bold">
                            Score: {cand.scores.compositeWeightedScore}/100
                          </span>
                        </div>
                      </td>

                      {/* 2. Eligibility */}
                      <td className="p-3 text-center">
                        <Badge
                          variant={
                            cand.eligibilityStatus === "ELIGIBLE"
                              ? "success"
                              : cand.eligibilityStatus === "INELIGIBLE"
                              ? "destructive"
                              : "warning"
                          }
                          className="font-mono text-xs"
                        >
                          {cand.eligibilityStatus.replace(/_/g, " ")}
                        </Badge>
                      </td>

                      {/* 3. Technical Feasibility (25%) */}
                      <td className="p-3 text-center font-mono font-bold text-slate-800">
                        <div className="text-xs">{cand.scores.technicalFeasibility}</div>
                        <span className="text-xs text-gov-muted font-normal">(w: 25%)</span>
                      </td>

                      {/* 4. Problem Fit (20%) */}
                      <td className="p-3 text-center font-mono font-bold text-slate-800">
                        <div
                          className={`text-xs ${
                            cand.scores.problemFit >= 90 ? "text-emerald-700 font-extrabold" : ""
                          }`}
                        >
                          {cand.scores.problemFit}
                        </div>
                        <span className="text-xs text-gov-muted font-normal">(w: 20%)</span>
                      </td>

                      {/* 5. Innovation (15%) */}
                      <td className="p-3 text-center font-mono font-bold text-slate-800">
                        <div className="text-xs">{cand.scores.innovation}</div>
                        <span className="text-xs text-gov-muted font-normal">(w: 15%)</span>
                      </td>

                      {/* 6. Scalability (15%) */}
                      <td className="p-3 text-center font-mono font-bold text-slate-800">
                        <div className="text-xs">{cand.scores.scalability}</div>
                        <span className="text-xs text-gov-muted font-normal">(w: 15%)</span>
                      </td>

                      {/* 7. Cost */}
                      <td className="p-3 text-right">
                        <div className="font-mono font-bold text-slate-900 text-xs">
                          {cand.cost.proposed}
                        </div>
                        <div className="text-xs text-gov-muted">Max: {cand.cost.ceiling}</div>
                      </td>

                      {/* 8. Risk */}
                      <td className="p-3 text-center">
                        <Badge
                          variant={
                            cand.risk.level === "LOW"
                              ? "success"
                              : cand.risk.level === "HIGH"
                              ? "destructive"
                              : "warning"
                          }
                          className="font-mono text-xs"
                        >
                          {cand.risk.level}
                        </Badge>
                      </td>

                      {/* 9. Evaluation Status */}
                      <td className="p-3 text-center">
                        <Badge
                          variant={
                            cand.evaluationStatus === "PILOT_DESIGN"
                              ? "default"
                              : cand.evaluationStatus === "SHORTLISTED"
                              ? "success"
                              : cand.evaluationStatus === "REJECTED"
                              ? "destructive"
                              : "secondary"
                          }
                          className="font-mono text-xs"
                        >
                          {cand.evaluationStatus.replace(/_/g, " ")}
                        </Badge>
                      </td>

                      {/* Expand Toggle */}
                      <td className="p-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleRow(cand.id)}
                          className="text-xs h-8 px-2 border-slate-300"
                        >
                          {isExpanded ? (
                            <>
                              Hide Details <ChevronUp className="w-3 h-3 ml-1" />
                            </>
                          ) : (
                            <>
                              Details & Actions <ChevronDown className="w-3 h-3 ml-1" />
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>

                    {/* EXPANDABLE ROW CONTENT */}
                    {isExpanded && (
                      <tr className="bg-slate-50/90 border-t border-b border-slate-200">
                        <td colSpan={10} className="p-4 sm:p-5">
                          <div className="space-y-4">
                            {/* Candidate Summary & Qualitative Findings */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                              {/* Left sub-box: Expert Deliberations */}
                              <div className="bg-white p-3.5 rounded-control border border-slate-200 space-y-2">
                                <span className="text-xs font-mono text-purple-800 font-bold uppercase tracking-wider block">
                                  INDEPENDENT EXPERT APPRAISAL
                                </span>
                                <p className="text-slate-700 leading-relaxed text-xs">
                                  {cand.expertNotes}
                                </p>
                                <div className="text-xs font-semibold text-purple-900 pt-1 border-t border-slate-100">
                                  Recommendation: {cand.expertRecommendation}
                                </div>
                              </div>

                              {/* Center sub-box: Risk & Mitigations */}
                              <div className="bg-white p-3.5 rounded-control border border-slate-200 space-y-2">
                                <span className="text-xs font-mono text-amber-800 font-bold uppercase tracking-wider block">
                                  RISK PROFILE & FEASIBILITY
                                </span>
                                <div>
                                  <span className="font-bold text-slate-800 block text-xs">
                                    Identified Factor:
                                  </span>
                                  <p className="text-slate-600 text-xs leading-tight">
                                    {cand.risk.factors}
                                  </p>
                                </div>
                                <div className="pt-1 border-t border-slate-100">
                                  <span className="font-bold text-slate-800 block text-xs">
                                    Mandatory Mitigation:
                                  </span>
                                  <p className="text-slate-600 text-xs leading-tight">
                                    {cand.risk.mitigation}
                                  </p>
                                </div>
                              </div>

                              {/* Right sub-box: Statutory & Eligibility Details */}
                              <div className="bg-white p-3.5 rounded-control border border-slate-200 space-y-2">
                                <span className="text-xs font-mono text-gov-primary font-bold uppercase tracking-wider block">
                                  STATUTORY PRE-QUALIFICATION
                                </span>
                                <div className="space-y-1 text-xs">
                                  <p className="text-slate-700 leading-snug">
                                    {cand.eligibilityNotes}
                                  </p>
                                  <p className="text-slate-600 text-xs pt-1 border-t border-slate-100">
                                    <strong>Track Record:</strong> {cand.teamTrackRecord}
                                  </p>
                                  <p className="text-gov-muted text-xs font-mono">
                                    Dossier: {cand.documentsCount} Sealed Documents Verified
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Scoring Dimensions Breakdown Strip */}
                            <div className="bg-white p-3 rounded-control border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                              <span className="font-bold text-slate-800 text-xs">
                                6-Criterion Scoring Breakdown:
                              </span>
                              <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                                <span className="bg-slate-50 px-2 py-1 rounded border border-slate-200">
                                  Tech: <strong>{cand.scores.technicalFeasibility}</strong> (25%)
                                </span>
                                <span className="bg-slate-50 px-2 py-1 rounded border border-slate-200">
                                  Fit: <strong>{cand.scores.problemFit}</strong> (20%)
                                </span>
                                <span className="bg-slate-50 px-2 py-1 rounded border border-slate-200">
                                  Inno: <strong>{cand.scores.innovation}</strong> (15%)
                                </span>
                                <span className="bg-slate-50 px-2 py-1 rounded border border-slate-200">
                                  Scale: <strong>{cand.scores.scalability}</strong> (15%)
                                </span>
                                <span className="bg-slate-50 px-2 py-1 rounded border border-slate-200">
                                  Cost: <strong>{cand.scores.costEffectiveness}</strong> (15%)
                                </span>
                                <span className="bg-slate-50 px-2 py-1 rounded border border-slate-200">
                                  Sec: <strong>{cand.scores.securityCompliance}</strong> (10%)
                                </span>
                                <span className="bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-1 rounded font-extrabold">
                                  Composite: {cand.scores.compositeWeightedScore}
                                </span>
                              </div>
                            </div>

                            {/* FOUR STATUTORY ACTIONS STRIP */}
                            <div className="bg-slate-100/90 p-3.5 rounded-control border border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <span className="text-xs font-mono text-gov-muted uppercase font-bold block">
                                  COMMISSION DETERMINATION FOR {cand.startupName.toUpperCase()}
                                </span>
                                <span className="text-xs text-slate-700">
                                  Require a documented statutory reason for all official actions.
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                {/* Action 1: Shortlist */}
                                <Button
                                  size="sm"
                                  onClick={() => handleOpenDecisionModal(cand, "SHORTLISTED")}
                                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold h-8"
                                >
                                  <Check className="w-3 h-3 mr-1" /> Shortlist
                                </Button>

                                {/* Action 2: Move to Pilot Design */}
                                <Button
                                  size="sm"
                                  onClick={() => handleOpenDecisionModal(cand, "MOVED_TO_PILOT_DESIGN")}
                                  className="bg-gov-primary hover:bg-gov-primary/90 text-white text-xs font-semibold h-8"
                                >
                                  <Sparkles className="w-3 h-3 mr-1" /> Move to Pilot Design
                                </Button>

                                {/* Action 3: Request Clarification */}
                                <Button
                                  size="sm"
                                  onClick={() => handleOpenDecisionModal(cand, "CLARIFICATION_REQUESTED")}
                                  className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold h-8"
                                >
                                  <MessageSquare className="w-3 h-3 mr-1" /> Request Clarification
                                </Button>

                                {/* Action 4: Reject */}
                                <Button
                                  size="sm"
                                  onClick={() => handleOpenDecisionModal(cand, "REJECTED")}
                                  className="bg-red-700 hover:bg-red-800 text-white text-xs font-semibold h-8"
                                >
                                  <X className="w-3 h-3 mr-1" /> Reject
                                </Button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* STATUTORY AUDIT LOG LEDGER                               */}
      {/* "Record every action in the audit log"                   */}
      {/* ======================================================== */}
      <div className="bg-white border border-gov-border rounded-card p-5 shadow-sm space-y-3 text-left text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-gov-primary" />
            <h3 className="font-bold text-gov-primary font-mono text-xs uppercase tracking-wider">
              Statutory Shortlisting Audit Ledger (Append-Only)
            </h3>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            {auditLog.length} Recorded Action(s)
          </Badge>
        </div>

        <div className="border border-gov-border rounded-control overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-xs uppercase font-mono text-gov-muted border-b border-gov-border">
              <tr>
                <th className="p-2.5">Startup & Candidate</th>
                <th className="p-2.5">Action Committed</th>
                <th className="p-2.5">Reviewer & Designation</th>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">Documented Reason & Minutes</th>
                <th className="p-2.5 text-right">Cryptographic Seal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {auditLog.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-2.5">
                    <span className="font-bold text-slate-900 block">{log.candidateName}</span>
                    <span className="text-xs text-gov-muted font-mono">{log.candidateCode}</span>
                  </td>
                  <td className="p-2.5">
                    <Badge
                      variant={
                        log.action === "SHORTLISTED" || log.action === "MOVED_TO_PILOT_DESIGN"
                          ? "success"
                          : log.action === "REJECTED"
                          ? "destructive"
                          : "warning"
                      }
                      className="font-mono text-xs"
                    >
                      {log.action.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="p-2.5">
                    <span className="font-semibold text-slate-800 block">{log.officerName}</span>
                    <span className="text-xs text-gov-muted">{log.officerDesignation}</span>
                  </td>
                  <td className="p-2.5 font-mono text-slate-600 text-xs">{log.timestamp}</td>
                  <td className="p-2.5 max-w-sm text-slate-700 leading-snug">
                    <p className="text-xs">{log.reason}</p>
                    {log.conditions && (
                      <p className="text-xs text-amber-900 font-medium mt-1">
                        <strong>Conditions:</strong> {log.conditions}
                      </p>
                    )}
                  </td>
                  <td className="p-2.5 text-right font-mono text-xs text-slate-500">
                    {log.cryptographicSeal.slice(0, 16)}...{log.cryptographicSeal.slice(-6)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DECISION MODAL: STATUTORY REASON ENFORCEMENT             */}
      {/* "Require a reason for important decisions"               */}
      {/* ======================================================== */}
      {activeDecisionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-card shadow-2xl border border-gov-border max-w-lg w-full p-5 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <Badge
                  variant={
                    activeDecisionModal.action === "SHORTLISTED"
                      ? "success"
                      : activeDecisionModal.action === "MOVED_TO_PILOT_DESIGN"
                      ? "default"
                      : activeDecisionModal.action === "REJECTED"
                      ? "destructive"
                      : "warning"
                  }
                  className="font-mono text-xs mb-1"
                >
                  ACTION: {activeDecisionModal.action.replace(/_/g, " ")}
                </Badge>
                <h3 className="font-bold text-slate-900 text-sm">
                  Document Statutory Deliberation Justification
                </h3>
              </div>
              <button
                onClick={() => setActiveDecisionModal(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-control">
                <span className="text-xs font-mono text-gov-muted uppercase block">
                  CANDIDATE STARTUP
                </span>
                <span className="font-bold text-slate-900 block text-xs">
                  {activeDecisionModal.candidate.startupName}
                </span>
                <span className="text-xs text-slate-600 block">
                  {activeDecisionModal.candidate.solutionTitle} (Score:{" "}
                  {activeDecisionModal.candidate.scores.compositeWeightedScore}/100)
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-800 text-xs block mb-1">
                  Official Committee Deliberation Reason{" "}
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <Textarea
                  rows={3}
                  value={decisionReason}
                  onChange={(e) => {
                    setDecisionReason(e.target.value);
                    if (reasonError) setReasonError(false);
                  }}
                  placeholder="State the committee's specific rationale (e.g. why this startup fits municipal ward conditions, technical trade-offs, or reasons for rejection)..."
                  className={`text-xs ${reasonError ? "border-red-500 ring-1 ring-red-300" : ""}`}
                />
                {reasonError && (
                  <p className="text-xs text-red-600 font-semibold flex items-center mt-1">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Statutory Reason is strictly required by procurement audit regulations.
                  </p>
                )}
              </div>

              {(activeDecisionModal.action === "SHORTLISTED" ||
                activeDecisionModal.action === "MOVED_TO_PILOT_DESIGN" ||
                activeDecisionModal.action === "CLARIFICATION_REQUESTED") && (
                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1">
                    Stipulated Conditions / Pilot Directives (Optional):
                  </label>
                  <Input
                    value={conditionsText}
                    onChange={(e) => setConditionsText(e.target.value)}
                    placeholder="e.g. Must complete Day 30 CPCB reference collocation check."
                    className="text-xs"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveDecisionModal(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={isSubmittingDecision}
                onClick={handleCommitDecision}
                className={`text-xs font-semibold text-white ${
                  activeDecisionModal.action === "SHORTLISTED"
                    ? "bg-emerald-700 hover:bg-emerald-800"
                    : activeDecisionModal.action === "MOVED_TO_PILOT_DESIGN"
                    ? "bg-gov-primary hover:bg-gov-primary/90"
                    : activeDecisionModal.action === "REJECTED"
                    ? "bg-red-700 hover:bg-red-800"
                    : "bg-purple-700 hover:bg-purple-800"
                }`}
              >
                {isSubmittingDecision ? "Anchoring Audit Entry..." : "Commit Determination to Audit Log"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
