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
  EyeOff,
  Lock,
  Unlock,
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
  Sliders,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  RotateCcw,
} from "lucide-react";

export interface CriterionItem {
  id: string;
  name: string;
  weight: number;
  description: string;
  score: number;
  comments: string;
}

export type RecommendationType =
  | "STRONGLY_RECOMMEND"
  | "RECOMMEND"
  | "CONDITIONALLY_RECOMMEND"
  | "DO_NOT_RECOMMEND";

export interface EvaluationRecord {
  id: string;
  revision: string;
  evaluatorName: string;
  evaluatorDesignation: string;
  evaluatorInstitution: string;
  timestamp: string;
  totalScore: number;
  recommendation: RecommendationType;
  coiDeclared: boolean;
  criteriaSnapshot: { name: string; weight: number; score: number; comments: string }[];
  risksSnapshot: {
    technical: string;
    deployment: string;
    mitigation: string;
  };
  overallRemarks: string;
  cryptographicSeal: string;
  amendmentReason?: string;
}

export interface CandidateProposal {
  id: string;
  applicationNumber: string;
  candidateCode: string;
  anonymizedTitle: string;
  domain: string;
  challengeCode: string;
  challengeTitle: string;
  department: string;
  challengeInfo: {
    problemStatement: string;
    civicContext: string;
    desiredKPIs: string[];
    budgetCeiling: string;
    pilotDuration: string;
    geographicScope: string;
    constraints: string[];
  };
  startupProfile: {
    anonymizedEntity: string;
    incorporationYear: string;
    headcount: string;
    coreCompetencies: string[];
    patentsFiled: number;
    fieldDeployments: number;
    trackRecordSummary: string;
    cloudResidency: string;
    certifications: string[];
  };
  proposal: {
    solutionTitle: string;
    executiveSummary: string;
    technicalArchitecture: string;
    telemetryAndBackhaul: string;
    workBreakdownTimeline: string;
    committedDeliverables: string[];
    proposedBudget: string;
    budgetBreakdown: { item: string; cost: string; justification: string }[];
  };
  technicalDocs: {
    id: string;
    title: string;
    category: string;
    size: string;
    sha256: string;
    date: string;
    summary: string;
  }[];
}

const DEFAULT_CRITERIA_TEMPLATE: CriterionItem[] = [
  {
    id: "crit-1",
    name: "Technical Feasibility",
    weight: 25,
    description: "Soundness of technical architecture, sensor physics, algorithm robustness, and hardware reliability.",
    score: 92,
    comments: "Orthogonal dual-beam laser particle counters have sound laboratory physics and cyclonic positive-pressure optical anti-fouling purge.",
  },
  {
    id: "crit-2",
    name: "Problem Fit",
    weight: 20,
    description: "Alignment with municipal ward dust mitigation challenges, local terrain, and ICCC interoperability.",
    score: 95,
    comments: "Directly solves municipal misting vehicle dispatch blindspots with real-time ward particulate density telemetry.",
  },
  {
    id: "crit-3",
    name: "Innovation",
    weight: 15,
    description: "Novelty of calibration algorithms, on-edge inferencing, and mechanical design improvements over status quo.",
    score: 90,
    comments: "Self-calibrating ambient humidity compensation neural network deployed directly on low-power microcontrollers.",
  },
  {
    id: "crit-4",
    name: "Scalability",
    weight: 15,
    description: "Ease of ward-scale expansion, cellular/LoRaWAN bandwidth efficiency, and multi-city replication potential.",
    score: 88,
    comments: "Dual LoRaWAN + 4G NB-IoT fallback allows low-cost municipal scale-up across 500+ wards without custom network infrastructure.",
  },
  {
    id: "crit-5",
    name: "Cost Effectiveness",
    weight: 15,
    description: "Budget justification against 90-day pilot ceiling, sensor replacement cost, and operational maintenance.",
    score: 86,
    comments: "Cost is within ₹25,00,000 ceiling. Replacement optical filters and consumable budget are reasonably proportioned.",
  },
  {
    id: "crit-6",
    name: "Security & Compliance",
    weight: 10,
    description: "Data privacy, Indian sovereign cloud hosting (MeitY), TLS 1.3 encryption, and CERT-In VAPT audit clearance.",
    score: 94,
    comments: "CERT-In Level 2 VAPT report provided with zero critical findings. Telemetry hosted in MeitY-empaneled Mumbai AWS GovCloud.",
  },
];

const CANDIDATE_PROPOSALS: CandidateProposal[] = [
  {
    id: "app-airsense-001",
    applicationNumber: "APP-2026-UP-UAQ-041",
    candidateCode: "APPLICANT #APP-2026-01",
    anonymizedTitle: "Hyperlocal Optical Sensor Mesh & Automated Misting Telemetry",
    domain: "IoT CleanTech & Urban Air Quality",
    challengeCode: "CHAL-UP-DUD-2026-001",
    challengeTitle: "Urban Air Quality Hyperlocal Monitoring & Intervention Mesh",
    department: "Department of Urban Development, Govt of Uttar Pradesh",
    challengeInfo: {
      problemStatement:
        "Severe urban particulate pollution (PM2.5/PM10) in Lucknow requires high-density ward-level sensor coverage to pinpoint episodic hotspots and automate municipal misting truck dispatches.",
      civicContext: "Lucknow Municipal Corporation, 4 High-Density Wards (Wards 14, 18, 22, 29).",
      desiredKPIs: [
        "Continuous correlation with CPCB BAM-1020 reference analyzer: R² ≥ 0.92",
        "Sensor mesh geographic ward coverage: ≥ 85.0%",
        "Automated misting dispatch trigger latency: ≤ 10 minutes",
        "Hardware uptime across 90-day pilot: ≥ 95.0%",
      ],
      budgetCeiling: "₹25,00,000 (INR Twenty-Five Lakhs)",
      pilotDuration: "90 Days (Field Deployment & Validation)",
      geographicScope: "Lucknow Municipal Wards (40 Pole-Mounted Nodes)",
      constraints: [
        "Zero proprietary single-vendor lock-in",
        "Real-time REST / MQTT stream to Lucknow Integrated Command & Control Centre (ICCC)",
        "Must operate reliably in northern Indian summer dust and pre-monsoon humidity swings",
      ],
    },
    startupProfile: {
      anonymizedEntity: "AirSense Technologies [Identity Masked Under Section 13 Blind Review]",
      incorporationYear: "2022 (DPIIT Recognized Private Limited)",
      headcount: "18 Full-Time Engineers & Domain Researchers",
      coreCompetencies: [
        "Laser Optical Particulate Scattering",
        "Edge Machine Learning Humidity Calibration",
        "Low-Power LoRaWAN & NB-IoT Telemetry Head Design",
      ],
      patentsFiled: 2,
      fieldDeployments: 3,
      trackRecordSummary:
        "Completed 25-node industrial perimeter air monitoring pilot in Panki Industrial Estate with 96.4% uptime across 120 days.",
      cloudResidency: "AWS Mumbai (MeitY Empaneled Data Center, Indian Sovereign Residency)",
      certifications: ["NABL Accredited IP65 Enclosure", "RoHS Compliance", "ISO 9001:2015"],
    },
    proposal: {
      solutionTitle: "AirSense Hyperlocal Optical Particle Mesh & Automated Misting Telemetry",
      executiveSummary:
        "Turnkey deployment of 40 ruggedized optical particulate monitoring nodes paired with an on-device humidity-correction regression engine and ICCC telemetry integration.",
      technicalArchitecture:
        "Orthogonal dual-beam laser particle counters resolving PM1, PM2.5, and PM10 simultaneously. Features cyclonic positive-pressure purge to prevent soot accumulation on optical elements during dust storms.",
      telemetryAndBackhaul:
        "Dual-carrier LoRaWAN primary transmission with automated 4G NB-IoT fallback. Cryptographic TLS 1.3 end-to-end encryption pushing JSON payloads every 60 seconds.",
      workBreakdownTimeline:
        "Weeks 1-2: Testbed bench calibration & sensor collocation at CPCB station. Weeks 3-4: Municipal pole mounting across 40 ward points. Weeks 5-11: Live continuous telemetry & automated misting triggers. Week 12: Independent TERI validation report & final decommissioning/handover.",
      committedDeliverables: [
        "40 Calibrated Sensor Nodes with Solar Backups",
        "Real-time ICCC Municipal Dashboard Integration",
        "Collocation Regression Report vs CPCB BAM-1020",
        "Autonomous Misting Vehicle Geofenced Dispatch API",
      ],
      proposedBudget: "₹24,50,000",
      budgetBreakdown: [
        { item: "Hardware Nodes (40 units @ ₹32,000)", cost: "₹12,80,000", justification: "Laser counters, IP65 enclosures, solar panels" },
        { item: "Cellular & LoRaWAN Backhaul Telemetry", cost: "₹2,40,000", justification: "SIM data bundles, LoRaWAN gateways, cloud hosting" },
        { item: "Field Installation & Electrical Pole Integration", cost: "₹3,80,000", justification: "Licensed municipal electrical contractors" },
        { item: "Third-Party NABL & TERI Collocation Audit", cost: "₹3,50,000", justification: "Official testing agency calibration certificates" },
        { item: "Contingency & Spare Part Reserves", cost: "₹2,00,000", justification: "4 complete replacement nodes on standby" },
      ],
    },
    technicalDocs: [
      {
        id: "doc-1",
        title: "AirSense_System_Architecture_Whitepaper_v2.4.pdf",
        category: "System Engineering Whitepaper",
        size: "4.2 MB",
        sha256: "9a8f10b2a3c4d5e6...7f8g",
        date: "2026-03-01",
        summary: "Detailed optical scattering ray-trace diagram, dual-beam laser diode calibration curves, and humidity regression polynomial proof.",
      },
      {
        id: "doc-2",
        title: "NABL_IP65_RoHS_Test_Report_TR-2025-912.pdf",
        category: "Accredited Laboratory Certificate",
        size: "3.8 MB",
        sha256: "b1093ef4c8d1a2b3...4e5f",
        date: "2026-02-18",
        summary: "NABL certified test report confirming IP65 ingress protection against high-pressure water jets and lead-free RoHS PCB compliance.",
      },
      {
        id: "doc-3",
        title: "CERT-In_Level2_VAPT_Security_Clearance.pdf",
        category: "Cybersecurity Audit",
        size: "2.1 MB",
        sha256: "3d22b10ae4c5b6a7...8d9e",
        date: "2026-02-25",
        summary: "Comprehensive penetration test report covering firmware cryptographic keys, TLS handshake, and cloud API endpoints with zero critical vulnerabilities.",
      },
    ],
  },
  {
    id: "app-ecosort-002",
    applicationNumber: "APP-2026-UP-SWM-018",
    candidateCode: "APPLICANT #APP-2026-02",
    anonymizedTitle: "Deep-Learning Optical Purity Sorter for Mixed Dry Recyclables",
    domain: "Robotics & Solid Waste Management",
    challengeCode: "CHAL-UP-SWM-2026-003",
    challengeTitle: "Deep-Learning Optical Purity Sorter for Dry Municipal Waste",
    department: "Noida Authority / Solid Waste SPV",
    challengeInfo: {
      problemStatement: "Automate dry waste recovery at Material Recovery Facilities (MRFs) to extract recyclable polymers with > 85% purity at 5 Tonnes/Hour.",
      civicContext: "Noida Sector 62 MRF Facility.",
      desiredKPIs: [
        "Polymer segregation purity: ≥ 88.0%",
        "Throughput: ≥ 5.0 Tonnes/Hour",
        "Air-jet pneumatic diversion accuracy: ≥ 92.0%",
      ],
      budgetCeiling: "₹20,00,000",
      pilotDuration: "60 Days",
      geographicScope: "Sector 62 MRF Conveyor Line 2",
      constraints: ["Zero interruption to existing conveyor operation", "Emergency physical stop compliance"],
    },
    startupProfile: {
      anonymizedEntity: "EcoSort Robotics [Identity Masked Under Section 13 Blind Review]",
      incorporationYear: "2023",
      headcount: "12 Engineers",
      coreCompetencies: ["Hyperspectral Near-Infrared Vision", "Pneumatic High-Speed Ejection", "PLC Automation"],
      patentsFiled: 1,
      fieldDeployments: 2,
      trackRecordSummary: "Deployed pilot optical sorter at Okhla waste transfer station for 45 days.",
      cloudResidency: "Azure India Central (Pune)",
      certifications: ["ISO 13849 Machinery Safety", "CE Marked"],
    },
    proposal: {
      solutionTitle: "Pneumatic High-Speed Optical Ejection Sorter for Mixed Recyclables",
      executiveSummary: "Near-infrared hyperspectral line scan camera coupled with 64-channel pneumatic air-jet ejection bar.",
      technicalArchitecture: "Spectral range 900-1700nm resolving PET, HDPE, PP, and cardboard at 2.5 m/s belt velocity.",
      telemetryAndBackhaul: "Industrial Modbus TCP with 4G VPN gateway for municipal oversight telemetry.",
      workBreakdownTimeline: "Week 1: Mechanical gantry retrofit. Weeks 2-7: Production sorting and purity audits. Week 8: Final validation.",
      committedDeliverables: ["Complete Gantry & Optical Scan Unit", "Pneumatic Ejection Manifold", "Automated Daily Purity Logs"],
      proposedBudget: "₹19,80,000",
      budgetBreakdown: [
        { item: "NIR Line Scan Optical Sensor", cost: "₹9,50,000", justification: "High-speed InGaAs detector" },
        { item: "64-Valve Pneumatic Jet Ejection Bar", cost: "₹4,20,000", justification: "High-frequency solenoid valves" },
        { item: "Industrial Edge AI Compute Unit", cost: "₹3,60,000", justification: "NVIDIA Jetson AGX Orin Industrial" },
        { item: "Integration & Commissioning", cost: "₹2,50,000", justification: "Conveyor integration & safety interlocks" },
      ],
    },
    technicalDocs: [
      {
        id: "doc-4",
        title: "EcoSort_Spectral_Optical_Validation.pdf",
        category: "Laboratory Test Report",
        size: "3.1 MB",
        sha256: "5a19ef4...99b2",
        date: "2026-02-15",
        summary: "Spectral reflectance library for PET, HDPE, and LDPE under varying surface contamination conditions.",
      },
    ],
  },
];

export function ExpertEvaluationWorkspace() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("app-airsense-001");
  const candidate =
    CANDIDATE_PROPOSALS.find((c) => c.id === selectedCandidateId) || CANDIDATE_PROPOSALS[0];

  // Left panel tabs
  const [leftTab, setLeftTab] = useState<"challenge" | "startup" | "proposal" | "docs">("challenge");

  // Document preview modal
  const [previewDoc, setPreviewDoc] = useState<CandidateProposal["technicalDocs"][0] | null>(null);

  // COI State
  const [coiDeclared, setCoiDeclared] = useState(true);

  // Criteria Configuration State
  const [criteria, setCriteria] = useState<CriterionItem[]>(DEFAULT_CRITERIA_TEMPLATE);
  const [isConfiguringCriteria, setIsConfiguringCriteria] = useState(false);
  const [newCriterionName, setNewCriterionName] = useState("");
  const [newCriterionWeight, setNewCriterionWeight] = useState<number>(10);
  const [newCriterionDesc, setNewCriterionDesc] = useState("");

  // Risks State
  const [technicalRisks, setTechnicalRisks] = useState(
    "High summer particulate loading and humidity fog may cause optical sensor drift without active automated baseline reset."
  );
  const [deploymentRisks, setDeploymentRisks] = useState(
    "Municipal pole power availability can be intermittent during scheduled feeder maintenance; solar reserve is essential."
  );
  const [mitigationMeasures, setMitigationMeasures] = useState(
    "Mandate collocated reference calibration check at Days 30, 60, and 90. Require 48-hour onboard solar-battery autonomy."
  );

  // Final Recommendation State
  const [recommendation, setRecommendation] = useState<RecommendationType>("STRONGLY_RECOMMEND");
  const [overallRemarks, setOverallRemarks] = useState(
    "The applicant exhibits exceptional technical rigor. The dual-beam optical scattering architecture and cyclonic anti-fouling chamber provide high confidence for municipal field reliability. Strongly recommended for field pilot allocation."
  );

  // Submission & Locking State
  const [isSubmitted, setIsSubmitted] = useState(true);
  const [showAmendmentModal, setShowAmendmentModal] = useState(false);
  const [amendmentReason, setAmendmentReason] = useState("");

  // Evaluation History Ledger
  const [evaluationHistory, setEvaluationHistory] = useState<EvaluationRecord[]>([
    {
      id: "EVAL-REV-1",
      revision: "Rev 1.0 (Official Blind Submission)",
      evaluatorName: "Dr. Alok Gupta",
      evaluatorDesignation: "Professor of CleanTech & Sensor Systems",
      evaluatorInstitution: "Indian Institute of Technology Kanpur (IITK)",
      timestamp: "26 Mar 2026, 11:45 IST",
      totalScore: 91.2,
      recommendation: "STRONGLY_RECOMMEND",
      coiDeclared: true,
      criteriaSnapshot: DEFAULT_CRITERIA_TEMPLATE.map((c) => ({
        name: c.name,
        weight: c.weight,
        score: c.score,
        comments: c.comments,
      })),
      risksSnapshot: {
        technical: "High summer particulate loading may cause optical drift.",
        deployment: "Municipal pole power intermittency.",
        mitigation: "Collocation checks at Days 30, 60, 90 + 48h battery reserve.",
      },
      overallRemarks:
        "The applicant exhibits exceptional technical rigor. Strongly recommended for municipal field allocation.",
      cryptographicSeal: "sha256:4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945",
    },
  ]);

  // Total weight validation
  const totalWeight = criteria.reduce((sum, item) => sum + item.weight, 0);

  // Weighted score calculation
  const totalWeightedScore =
    totalWeight === 0
      ? 0
      : Number(
          (
            criteria.reduce((sum, item) => sum + item.score * item.weight, 0) / totalWeight
          ).toFixed(1)
        );

  const handleScoreChange = (id: string, newScore: number) => {
    if (isSubmitted) return;
    const clamped = Math.max(0, Math.min(100, isNaN(newScore) ? 0 : newScore));
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, score: clamped } : c)));
  };

  const handleCommentsChange = (id: string, comments: string) => {
    if (isSubmitted) return;
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, comments } : c)));
  };

  const handleWeightChange = (id: string, weight: number) => {
    const clamped = Math.max(1, Math.min(100, isNaN(weight) ? 1 : weight));
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, weight: clamped } : c)));
  };

  const handleAddCriterion = () => {
    if (!newCriterionName.trim()) {
      showToast({ type: "error", title: "Criterion Name Required", description: "Please enter a name for the custom criterion." });
      return;
    }
    const newCrit: CriterionItem = {
      id: `crit-custom-${Date.now()}`,
      name: newCriterionName.trim(),
      weight: newCriterionWeight,
      description: newCriterionDesc.trim() || "Custom evaluation criterion defined by specialist committee.",
      score: 85,
      comments: "",
    };
    setCriteria((prev) => [...prev, newCrit]);
    setNewCriterionName("");
    setNewCriterionDesc("");
    setNewCriterionWeight(10);
    showToast({ type: "success", title: "Custom Criterion Added", description: `Added "${newCrit.name}" (${newCrit.weight}% weight).` });
  };

  const handleRemoveCriterion = (id: string) => {
    if (criteria.length <= 1) {
      showToast({ type: "error", title: "Minimum Criteria Required", description: "You must retain at least one evaluation criterion." });
      return;
    }
    setCriteria((prev) => prev.filter((c) => c.id !== id));
  };

  const handleResetCriteria = () => {
    setCriteria(DEFAULT_CRITERIA_TEMPLATE);
    setIsConfiguringCriteria(false);
    showToast({ type: "info", title: "Rubric Reset", description: "Default 6 statutory criteria restored." });
  };

  const handleSubmitEvaluation = () => {
    if (!coiDeclared) {
      showToast({
        type: "error",
        title: "Conflict of Interest Declaration Required",
        description: "Statutory rules require confirming the Conflict of Interest statement before submission.",
      });
      return;
    }

    if (totalWeight !== 100) {
      showToast({
        type: "error",
        title: "Criteria Weights Invalid",
        description: `Total criteria weight must equal exactly 100% (currently ${totalWeight}%).`,
      });
      return;
    }

    if (!overallRemarks.trim()) {
      showToast({
        type: "error",
        title: "Evaluation Summary Remarks Required",
        description: "Please provide your technical justification and qualitative summary.",
      });
      return;
    }

    const evaluatorName = `${currentUser?.firstName || "Dr. Alok"} ${currentUser?.lastName || "Gupta"}`;
    const designation = currentUser?.designation || "Professor of CleanTech & Sensor Systems";
    const institution = "Indian Institute of Technology Kanpur (IITK)";
    const now = new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const newRevNumber = `Rev ${evaluationHistory.length + 1}.0`;
    const randomHash = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");

    const newRecord: EvaluationRecord = {
      id: `EVAL-${Date.now()}`,
      revision: `${newRevNumber} (Official Blind Submission)`,
      evaluatorName,
      evaluatorDesignation: designation,
      evaluatorInstitution: institution,
      timestamp: `${now} IST`,
      totalScore: totalWeightedScore,
      recommendation,
      coiDeclared: true,
      criteriaSnapshot: criteria.map((c) => ({
        name: c.name,
        weight: c.weight,
        score: c.score,
        comments: c.comments,
      })),
      risksSnapshot: {
        technical: technicalRisks,
        deployment: deploymentRisks,
        mitigation: mitigationMeasures,
      },
      overallRemarks,
      cryptographicSeal: `sha256:${randomHash}`,
    };

    setEvaluationHistory((prev) => [newRecord, ...prev]);
    setIsSubmitted(true);

    showToast({
      type: "success",
      title: "Evaluation Submitted & Cryptographically Sealed",
      description: `Evaluation score of ${totalWeightedScore}/100 locked under blind protocol.`,
    });
  };

  const handleCommitAmendment = () => {
    if (!amendmentReason.trim()) {
      showToast({
        type: "error",
        title: "Statutory Reason Required",
        description: "You must provide a documented rationale for unlocking this submitted evaluation.",
      });
      return;
    }

    setIsSubmitted(false);
    setShowAmendmentModal(false);

    showToast({
      type: "warning",
      title: "Evaluation Unlocked for Amendment",
      description: "Remember to re-submit your evaluation when changes are completed to re-lock the cryptographic seal.",
    });
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Top Header & Blind Protocol Status Strip */}
      <div className="bg-white border border-gov-border rounded-card p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="default" className="bg-purple-800 font-mono text-xs">
                INDEPENDENT EXPERT DESK
              </Badge>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-gov-muted font-medium">
                Double-Blind Technical Evaluation Terminal
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gov-primary tracking-tight">
              Expert Evaluation Workspace
            </h1>
          </div>

          {/* Candidate Proposal Queue Selector */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs text-gov-muted font-semibold hidden sm:inline">
              Candidate Queue:
            </span>
            <select
              value={selectedCandidateId}
              onChange={(e) => {
                setSelectedCandidateId(e.target.value);
                // Reset state if switching
              }}
              className="text-xs border border-gov-border rounded-control px-3 py-1.5 bg-white font-semibold text-slate-800"
            >
              {CANDIDATE_PROPOSALS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.candidateCode} — {item.anonymizedTitle.slice(0, 35)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Active Candidate Meta Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-purple-50/50 border border-purple-200/80 rounded-control p-3">
          <div>
            <span className="text-xs text-purple-900 font-mono uppercase block">
              ANONYMIZED CANDIDATE
            </span>
            <span className="font-bold text-slate-900 truncate block">
              {candidate.candidateCode}
            </span>
            <span className="text-xs font-mono text-purple-700">{candidate.applicationNumber}</span>
          </div>

          <div>
            <span className="text-xs text-purple-900 font-mono uppercase block">
              TARGET CHALLENGE
            </span>
            <span className="font-semibold text-slate-800 truncate block">
              {candidate.challengeTitle}
            </span>
            <span className="text-xs text-gov-muted font-mono">{candidate.challengeCode}</span>
          </div>

          <div>
            <span className="text-xs text-purple-900 font-mono uppercase block">
              WEIGHTED SCORE
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-extrabold text-slate-900 font-mono text-base">
                {totalWeightedScore}
              </span>
              <span className="text-xs text-gov-muted">/ 100</span>
            </div>
            <span className="text-xs text-emerald-700 font-semibold block">
              {totalWeightedScore >= 90
                ? "Exceptional Alignment"
                : totalWeightedScore >= 75
                ? "Strong Potential"
                : "Conditional Range"}
            </span>
          </div>

          <div>
            <span className="text-xs text-purple-900 font-mono uppercase block">
              EVALUATION STATE
            </span>
            {isSubmitted ? (
              <Badge variant="success" className="font-mono text-xs mt-0.5">
                <Lock className="w-3 h-3 mr-1" /> EVALUATION SUBMITTED
              </Badge>
            ) : (
              <Badge variant="warning" className="font-mono text-xs mt-0.5">
                <Unlock className="w-3 h-3 mr-1" /> DRAFT IN PROGRESS
              </Badge>
            )}
          </div>
        </div>

        {/* Independent Double-Blind Isolation Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-control p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-700">
            <EyeOff className="w-4 h-4 text-purple-700 shrink-0" />
            <p className="text-xs leading-relaxed">
              <strong>Independent Scoring Protocol Enforced:</strong> Peer evaluator scores are
              strictly cryptographically masked and sealed until all assigned specialists have submitted
              their independent determinations.
            </p>
          </div>
          <div className="shrink-0 flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-500">
              Evaluator: Dr. Alok Gupta (IIT Kanpur)
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>

      {/* SPLIT-SCREEN WORKSPACE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================== */}
        {/* LEFT PANEL (6 COLS): CHALLENGE, STARTUP, PROPOSAL, DOCS */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-gov-border rounded-card shadow-sm overflow-hidden flex flex-col h-[840px]">
            {/* Left Header Navigation Tabs */}
            <div className="grid grid-cols-4 border-b border-gov-border bg-slate-100/70 p-1 text-xs font-semibold">
              <button
                onClick={() => setLeftTab("challenge")}
                className={`py-2 px-1 rounded text-center transition-all truncate ${
                  leftTab === "challenge"
                    ? "bg-white text-gov-primary font-bold shadow-2xs border border-slate-200"
                    : "text-gov-muted hover:text-slate-900"
                }`}
              >
                Challenge Info
              </button>
              <button
                onClick={() => setLeftTab("startup")}
                className={`py-2 px-1 rounded text-center transition-all truncate ${
                  leftTab === "startup"
                    ? "bg-white text-gov-primary font-bold shadow-2xs border border-slate-200"
                    : "text-gov-muted hover:text-slate-900"
                }`}
              >
                Startup Profile
              </button>
              <button
                onClick={() => setLeftTab("proposal")}
                className={`py-2 px-1 rounded text-center transition-all truncate ${
                  leftTab === "proposal"
                    ? "bg-white text-gov-primary font-bold shadow-2xs border border-slate-200"
                    : "text-gov-muted hover:text-slate-900"
                }`}
              >
                Proposal
              </button>
              <button
                onClick={() => setLeftTab("docs")}
                className={`py-2 px-1 rounded text-center transition-all truncate ${
                  leftTab === "docs"
                    ? "bg-white text-gov-primary font-bold shadow-2xs border border-slate-200"
                    : "text-gov-muted hover:text-slate-900"
                }`}
              >
                Technical Docs ({candidate.technicalDocs.length})
              </button>
            </div>

            {/* Left Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-left">
              {/* TAB 1: CHALLENGE INFORMATION */}
              {leftTab === "challenge" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-purple-700 font-bold uppercase tracking-wider block">
                      CIVIC PROBLEM STATEMENT
                    </span>
                    <h3 className="text-base font-extrabold text-gov-primary leading-tight">
                      {candidate.challengeTitle}
                    </h3>
                    <p className="text-xs text-gov-muted font-medium">
                      Sponsoring Authority: {candidate.department}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-control space-y-1.5">
                    <span className="text-xs font-mono text-gov-muted uppercase font-bold block">
                      MUNICIPAL PROBLEM CONTEXT
                    </span>
                    <p className="text-slate-700 leading-relaxed text-xs">
                      {candidate.challengeInfo.problemStatement}
                    </p>
                    <div className="pt-1 text-xs text-slate-600 font-medium">
                      Location Context: {candidate.challengeInfo.civicContext}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200/80">
                      <span className="text-xs text-gov-muted font-mono uppercase block">
                        PILOT DURATION
                      </span>
                      <span className="font-semibold text-slate-900">
                        {candidate.challengeInfo.pilotDuration}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200/80">
                      <span className="text-xs text-gov-muted font-mono uppercase block">
                        BUDGET CEILING
                      </span>
                      <span className="font-semibold text-slate-900 font-mono">
                        {candidate.challengeInfo.budgetCeiling}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 text-xs block">
                      Target KPIs & Evaluation Benchmarks:
                    </span>
                    <ul className="space-y-1.5">
                      {candidate.challengeInfo.desiredKPIs.map((kpi, idx) => (
                        <li key={idx} className="flex items-start text-slate-800 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                          <span>{kpi}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 text-xs block">
                      Mandatory Procurement Constraints:
                    </span>
                    <ul className="space-y-1.5">
                      {candidate.challengeInfo.constraints.map((c, idx) => (
                        <li key={idx} className="flex items-start text-slate-700 text-xs">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 mr-2 shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 2: STARTUP PROFILE */}
              {leftTab === "startup" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {candidate.startupProfile.anonymizedEntity}
                      </h3>
                      <p className="text-xs text-gov-muted">
                        Track Record Verified under GFR Rule 149
                      </p>
                    </div>
                    <Badge variant="outline" className="text-purple-800 bg-purple-50 border-purple-300 font-mono text-xs">
                      IDENTITY MASKED
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200/80">
                      <span className="text-xs text-gov-muted font-mono uppercase block">
                        INCORPORATION STATUS
                      </span>
                      <span className="font-semibold text-slate-900">
                        {candidate.startupProfile.incorporationYear}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200/80">
                      <span className="text-xs text-gov-muted font-mono uppercase block">
                        ENGINEERING TEAM SIZE
                      </span>
                      <span className="font-semibold text-slate-900">
                        {candidate.startupProfile.headcount}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200/80">
                      <span className="text-xs text-gov-muted font-mono uppercase block">
                        PATENTS FILED / GRANTED
                      </span>
                      <span className="font-semibold text-slate-900 font-mono">
                        {candidate.startupProfile.patentsFiled} Registered IP
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200/80">
                      <span className="text-xs text-gov-muted font-mono uppercase block">
                        PAST FIELD DEPLOYMENTS
                      </span>
                      <span className="font-semibold text-emerald-800 font-mono">
                        {candidate.startupProfile.fieldDeployments} Completed Pilots
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-control space-y-1">
                    <span className="text-xs font-mono text-gov-primary uppercase font-bold block">
                      TRACK RECORD EVIDENCE
                    </span>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      {candidate.startupProfile.trackRecordSummary}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 text-xs block">
                      Core Technical Competencies:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.startupProfile.coreCompetencies.map((comp, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-control space-y-1">
                    <span className="text-xs font-mono text-gov-muted uppercase font-bold block">
                      SOVEREIGN CLOUD TENANCY
                    </span>
                    <p className="text-slate-700 text-xs">
                      {candidate.startupProfile.cloudResidency}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: PROPOSAL */}
              {leftTab === "proposal" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-gov-accent font-bold uppercase tracking-wider block">
                      APPLICANT TECHNICAL SUBMISSION
                    </span>
                    <h3 className="text-base font-extrabold text-gov-primary leading-tight">
                      {candidate.proposal.solutionTitle}
                    </h3>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-control space-y-1">
                    <span className="text-xs font-mono text-gov-muted uppercase font-bold block">
                      EXECUTIVE SUMMARY
                    </span>
                    <p className="text-slate-700 leading-relaxed text-xs">
                      {candidate.proposal.executiveSummary}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 text-xs block">
                      Technical Architecture & Sensor Mechanics:
                    </span>
                    <p className="text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200/80 leading-relaxed text-xs">
                      {candidate.proposal.technicalArchitecture}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 text-xs block">
                      Telemetry & Network Backhaul:
                    </span>
                    <p className="text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200/80 leading-relaxed text-xs">
                      {candidate.proposal.telemetryAndBackhaul}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 text-xs block">
                      12-Week Pilot Execution Roadmap:
                    </span>
                    <p className="text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200/80 leading-relaxed text-xs">
                      {candidate.proposal.workBreakdownTimeline}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">
                        Itemized Financial Cost Breakdown:
                      </span>
                      <span className="font-mono font-bold text-gov-primary text-xs">
                        Total: {candidate.proposal.proposedBudget}
                      </span>
                    </div>

                    <div className="border border-slate-200 rounded overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-xs uppercase text-gov-muted font-mono">
                          <tr>
                            <th className="p-2">Item</th>
                            <th className="p-2">Justification</th>
                            <th className="p-2 text-right">Cost</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {candidate.proposal.budgetBreakdown.map((row, idx) => (
                            <tr key={idx}>
                              <td className="p-2 font-medium text-slate-900">{row.item}</td>
                              <td className="p-2 text-slate-500">{row.justification}</td>
                              <td className="p-2 text-right font-mono font-bold text-slate-800">
                                {row.cost}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TECHNICAL DOCUMENTATION */}
              {leftTab === "docs" && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <span className="text-xs font-mono text-gov-muted font-bold uppercase tracking-wider block">
                    SEALED TECHNICAL DOSSIER & TEST LAB EVIDENCE
                  </span>

                  <div className="space-y-3">
                    {candidate.technicalDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-control space-y-2 hover:bg-slate-100/80 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 text-xs truncate">
                              {doc.title}
                            </p>
                            <span className="text-xs text-gov-muted font-mono">
                              {doc.category} • {doc.size} • {doc.date}
                            </span>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPreviewDoc(doc)}
                            className="text-xs h-6 px-2 border-slate-300 shrink-0"
                          >
                            <Eye className="w-3 h-3 mr-1" /> Inspect
                          </Button>
                        </div>

                        <p className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-200/60 leading-tight">
                          {doc.summary}
                        </p>

                        <div className="text-xs font-mono text-slate-400 truncate">
                          SHA-256: {doc.sha256}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANEL (6 COLS): EVALUATION FORM & CRITERIA ENGINE */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-gov-border rounded-card shadow-sm p-5 space-y-5 text-xs text-left">
            {/* 1. Conflict of Interest Declaration */}
            <div className="bg-purple-50/70 border border-purple-200 rounded-control p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-purple-900 font-bold uppercase tracking-wider flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-purple-700" />
                  CONFLICT OF INTEREST DECLARATION
                </span>
                <span className="text-xs font-mono text-slate-500">Section 13 Compliance</span>
              </div>

              <div className="flex items-start space-x-2.5">
                <input
                  type="checkbox"
                  id="coiCheck"
                  checked={coiDeclared}
                  disabled={isSubmitted}
                  onChange={(e) => setCoiDeclared(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-700 mt-0.5 shrink-0"
                />
                <label
                  htmlFor="coiCheck"
                  className="text-xs text-purple-950 leading-relaxed cursor-pointer"
                >
                  I solemnly declare that I have no direct or indirect personal, commercial, academic, or
                  consulting conflicts of interest with this applicant or its principals. I will evaluate this
                  submission with complete independence and technical impartiality.
                </label>
              </div>
            </div>

            {/* 2. Configurable Evaluation Criteria Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <span className="text-xs font-mono text-gov-accent font-bold uppercase tracking-wider block">
                    SCORING RUBRIC (CONFIGURABLE)
                  </span>
                  <h2 className="text-sm font-bold text-gov-primary">
                    Evaluation Criteria ({criteria.length} Criteria)
                  </h2>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge
                    variant={totalWeight === 100 ? "success" : "destructive"}
                    className="text-xs font-mono"
                  >
                    Weight Sum: {totalWeight}%
                  </Badge>

                  {!isSubmitted && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsConfiguringCriteria(!isConfiguringCriteria)}
                      className="text-xs h-8 px-2 border-slate-300"
                    >
                      <Sliders className="w-3 h-3 mr-1" />
                      {isConfiguringCriteria ? "Done Configuring" : "Configure Weights"}
                    </Button>
                  )}
                </div>
              </div>

              {/* Criteria Configuration Panel (Expanded when user toggles Configure) */}
              {isConfiguringCriteria && !isSubmitted && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-control space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">
                      Customize Rubric & Criteria Weights
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleResetCriteria}
                      className="text-xs h-6 px-2 text-gov-muted"
                    >
                      <RotateCcw className="w-2.5 h-2.5 mr-1" /> Reset Defaults
                    </Button>
                  </div>

                  <p className="text-xs text-gov-muted">
                    Adjust criterion percentage weights so their sum equals exactly 100%. You can also add
                    specialized deep-tech criteria.
                  </p>

                  {/* Add New Custom Criterion */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1 border-t border-slate-200">
                    <div className="sm:col-span-6">
                      <Input
                        placeholder="New criterion name..."
                        value={newCriterionName}
                        onChange={(e) => setNewCriterionName(e.target.value)}
                        className="text-xs h-8"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Input
                        type="number"
                        placeholder="Weight %"
                        value={newCriterionWeight}
                        onChange={(e) => setNewCriterionWeight(parseInt(e.target.value) || 0)}
                        className="text-xs h-8 font-mono"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Button
                        size="sm"
                        onClick={handleAddCriterion}
                        className="bg-gov-primary text-xs h-8 w-full font-semibold"
                      >
                        <Plus className="w-3 h-3 mr-1" /> Add
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Criteria Scoring Cards */}
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {criteria.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50/80 border border-slate-200 rounded-control space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-slate-400 font-bold text-xs">
                            {index + 1}.
                          </span>
                          <span className="font-bold text-slate-900 text-xs">{item.name}</span>
                          <Badge variant="outline" className="font-mono text-xs bg-white">
                            Weight: {item.weight}%
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600 leading-tight">
                          {item.description}
                        </p>
                      </div>

                      {/* Weight Editing if in configuration mode */}
                      {isConfiguringCriteria && !isSubmitted && (
                        <div className="flex items-center space-x-1 shrink-0">
                          <input
                            type="number"
                            value={item.weight}
                            onChange={(e) => handleWeightChange(item.id, parseInt(e.target.value) || 0)}
                            className="w-12 text-center text-xs font-mono font-bold border border-slate-300 rounded p-0.5"
                          />
                          <span className="text-xs text-slate-500">%</span>
                          <button
                            onClick={() => handleRemoveCriterion(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Score Slider & Numeric Input */}
                    <div className="space-y-1 bg-white p-2.5 rounded border border-slate-200/70">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-gov-muted uppercase font-bold">
                          NUMERIC SCORE (0 - 100)
                        </span>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs font-mono font-bold ${
                              item.score >= 90
                                ? "text-emerald-700"
                                : item.score >= 75
                                ? "text-blue-700"
                                : item.score >= 60
                                ? "text-amber-700"
                                : "text-red-600"
                            }`}
                          >
                            {item.score} / 100
                          </span>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={item.score}
                            disabled={isSubmitted}
                            onChange={(e) => handleScoreChange(item.id, parseInt(e.target.value) || 0)}
                            className="w-12 text-center text-xs font-mono font-bold border border-slate-300 rounded p-1"
                          />
                        </div>
                      </div>

                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={item.score}
                        disabled={isSubmitted}
                        onChange={(e) => handleScoreChange(item.id, parseInt(e.target.value) || 0)}
                        className="w-full accent-gov-primary h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Qualitative Comments for this Criterion */}
                    <div className="space-y-1">
                      <Textarea
                        rows={1}
                        value={item.comments}
                        disabled={isSubmitted}
                        onChange={(e) => handleCommentsChange(item.id, e.target.value)}
                        placeholder={`Evaluator notes & evidence for ${item.name}...`}
                        className="text-xs bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Risks Assessment Section */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-mono text-gov-accent font-bold uppercase tracking-wider block">
                SPECIALIST RISK ANALYSIS
              </span>

              <div className="space-y-2">
                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1">
                    Technical & Hardware Failure Risks:
                  </label>
                  <Textarea
                    rows={1}
                    value={technicalRisks}
                    disabled={isSubmitted}
                    onChange={(e) => setTechnicalRisks(e.target.value)}
                    placeholder="Identify sensor degradation, calibration drift, or algorithmic weaknesses..."
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1">
                    Field Deployment & Municipal Operational Risks:
                  </label>
                  <Textarea
                    rows={1}
                    value={deploymentRisks}
                    disabled={isSubmitted}
                    onChange={(e) => setDeploymentRisks(e.target.value)}
                    placeholder="Identify grid power stability, utility coordination, or physical vandalism risks..."
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1">
                    Mandatory Pilot Covenants & Mitigation Recommendations:
                  </label>
                  <Textarea
                    rows={1}
                    value={mitigationMeasures}
                    disabled={isSubmitted}
                    onChange={(e) => setMitigationMeasures(e.target.value)}
                    placeholder="Stipulations before procurement sign-off..."
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            {/* 4. Final Recommendation */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-mono text-gov-muted font-bold uppercase tracking-wider block">
                EXPERT RECOMMENDATION DETERMINATION
              </span>

              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    type: "STRONGLY_RECOMMEND" as RecommendationType,
                    label: "Strongly Recommend",
                    desc: "High priority for municipal field pilot allocation",
                    color: "border-emerald-600 bg-emerald-50/70 text-emerald-950",
                  },
                  {
                    type: "RECOMMEND" as RecommendationType,
                    label: "Recommend",
                    desc: "Meets technical thresholds under standard supervision",
                    color: "border-blue-600 bg-blue-50/70 text-blue-950",
                  },
                  {
                    type: "CONDITIONALLY_RECOMMEND" as RecommendationType,
                    label: "Conditionally Recommend",
                    desc: "Subject to revised testbed scope or hardware changes",
                    color: "border-amber-600 bg-amber-50/70 text-amber-950",
                  },
                  {
                    type: "DO_NOT_RECOMMEND" as RecommendationType,
                    label: "Do Not Recommend",
                    desc: "Significant technical feasibility or architecture gaps",
                    color: "border-red-600 bg-red-50/70 text-red-950",
                  },
                ].map((rec) => (
                  <button
                    key={rec.type}
                    type="button"
                    disabled={isSubmitted}
                    onClick={() => setRecommendation(rec.type)}
                    className={`p-2.5 rounded-control text-left border transition-all ${
                      recommendation === rec.type
                        ? `${rec.color} ring-1 ring-offset-1 ring-gov-primary font-bold shadow-2xs`
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="font-bold text-xs">{rec.label}</div>
                    <div className="text-xs text-gov-muted leading-tight mt-0.5">{rec.desc}</div>
                  </button>
                ))}
              </div>

              <div>
                <label className="font-bold text-slate-800 text-xs block mb-1">
                  Overall Technical Appraisal Summary:
                </label>
                <Textarea
                  rows={2}
                  value={overallRemarks}
                  disabled={isSubmitted}
                  onChange={(e) => setOverallRemarks(e.target.value)}
                  placeholder="Summarize your expert determination for the steering committee..."
                  className="text-xs"
                />
              </div>
            </div>

            {/* 5. Submission & Locking Terminal ("Do not allow silent modification") */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              {isSubmitted ? (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-control space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Evaluation Submitted & Cryptographically Sealed</span>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono border-emerald-300 bg-white text-emerald-800">
                      LOCKED (SHA-256)
                    </Badge>
                  </div>
                  <p className="text-xs text-emerald-800 leading-normal">
                    This evaluation is officially logged under blind evaluation protocols. Inputs are
                    locked to prevent silent modification.
                  </p>

                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-900">
                      Score: {totalWeightedScore}/100 • Status: {recommendation.replace(/_/g, " ")}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAmendmentModal(true)}
                      className="text-xs h-8 border-emerald-300 bg-white hover:bg-emerald-100 text-emerald-950 font-semibold"
                    >
                      <Lock className="w-3 h-3 mr-1" /> Request Statutory Amendment
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800">Composite Weighted Score:</span>
                    <span className="text-base font-extrabold text-gov-primary font-mono">
                      {totalWeightedScore} / 100
                    </span>
                  </div>

                  <Button
                    onClick={handleSubmitEvaluation}
                    className="w-full bg-purple-800 hover:bg-purple-900 text-white font-bold h-9 text-xs shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" /> Submit Independent Evaluation
                  </Button>
                  <p className="text-xs text-center text-gov-muted">
                    Upon submission, your scorecard will be locked and an append-only audit hash will be
                    generated.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* EVALUATION HISTORY & AUDIT LEDGER */}
      {/* ======================================================== */}
      <div className="bg-white border border-gov-border rounded-card p-5 shadow-sm space-y-4 text-left text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-gov-primary" />
            <h3 className="font-bold text-gov-primary font-mono text-xs uppercase tracking-wider">
              Evaluation History & Revision Ledger (Append-Only)
            </h3>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            {evaluationHistory.length} Recorded Appraisal(s)
          </Badge>
        </div>

        <div className="border border-gov-border rounded-control overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-xs uppercase font-mono text-gov-muted border-b border-gov-border">
              <tr>
                <th className="p-2.5">Revision & Evaluator</th>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">Weighted Score</th>
                <th className="p-2.5">Recommendation</th>
                <th className="p-2.5">Criteria Breakdown</th>
                <th className="p-2.5 text-right">Cryptographic Seal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {evaluationHistory.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-2.5">
                    <span className="font-bold text-slate-900 block">{rec.revision}</span>
                    <span className="text-xs text-slate-600">
                      {rec.evaluatorName} ({rec.evaluatorInstitution})
                    </span>
                  </td>
                  <td className="p-2.5 font-mono text-slate-600 text-xs">{rec.timestamp}</td>
                  <td className="p-2.5">
                    <span className="font-bold font-mono text-sm text-emerald-800">
                      {rec.totalScore} / 100
                    </span>
                  </td>
                  <td className="p-2.5">
                    <Badge
                      variant={
                        rec.recommendation === "STRONGLY_RECOMMEND"
                          ? "success"
                          : rec.recommendation === "DO_NOT_RECOMMEND"
                          ? "destructive"
                          : "default"
                      }
                      className="font-mono text-xs"
                    >
                      {rec.recommendation.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="p-2.5 text-xs text-slate-600">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {rec.criteriaSnapshot.map((c, i) => (
                        <span key={i} className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs">
                          {c.name.split(" ")[0]}: {c.score}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-2.5 text-right font-mono text-xs text-slate-500">
                    {rec.cryptographicSeal.slice(0, 16)}...{rec.cryptographicSeal.slice(-6)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: DOCUMENT INSPECTION PREVIEW */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-card shadow-2xl border border-gov-border max-w-2xl w-full p-5 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-gov-primary" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{previewDoc.title}</h3>
                  <span className="text-xs text-gov-muted font-mono">
                    {previewDoc.category} • {previewDoc.size}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-control border border-slate-200">
              <div className="space-y-1">
                <span className="text-xs font-mono text-gov-muted uppercase font-bold block">
                  DOCUMENT SUMMARY & PROBATIVE VALUE
                </span>
                <p className="text-slate-700 leading-relaxed">{previewDoc.summary}</p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded font-mono text-xs text-slate-600 space-y-1">
                <div>Cryptographic SHA-256 Digest:</div>
                <div className="text-gov-primary font-bold">{previewDoc.sha256}</div>
                <div className="text-emerald-700 font-semibold pt-1">
                  ✓ Verified against Ministry Repository Audit Chain
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPreviewDoc(null)}
                className="text-xs"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: STATUTORY AMENDMENT REQUEST */}
      {showAmendmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-card shadow-2xl border border-gov-border max-w-lg w-full p-5 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Statutory Score Amendment Request
                </h3>
              </div>
              <button
                onClick={() => setShowAmendmentModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-700 leading-normal">
                Under public procurement double-blind regulations, unlocking a submitted evaluation
                requires documenting an official amendment reason. This will be permanently recorded
                in the revision audit ledger.
              </p>

              <div>
                <label className="font-bold text-slate-800 text-xs block mb-1">
                  Documented Amendment Justification:
                </label>
                <Textarea
                  rows={3}
                  value={amendmentReason}
                  onChange={(e) => setAmendmentReason(e.target.value)}
                  placeholder="e.g., Reviewed newly submitted supplementary lab report regarding NABL IP65 anti-fouling test..."
                  className="text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAmendmentModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCommitAmendment}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
              >
                Confirm & Unlock
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
