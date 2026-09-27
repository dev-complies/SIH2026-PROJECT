"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/components/ui/toast";
import { getChallengeById, CHALLENGES_DATA, ChallengeItem } from "@/data/challengesData";
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Save,
  Send,
  Lock,
  ShieldCheck,
  FileText,
  AlertTriangle,
  UploadCloud,
  FileCheck2,
  HelpCircle,
  X,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  Calendar,
  MessageSquare,
  ChevronRight,
  Download,
} from "lucide-react";

export interface ApplicationFormData {
  // Step 1: Company
  companyName: string;
  tradeName: string;
  dpiitNumber: string;
  cinNumber: string;
  registeredAddress: string;
  state: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
  sovereignTenancy: boolean;

  // Step 2: Solution
  solutionTitle: string;
  executiveSummary: string;
  category: string;
  trlLevel: string;
  coreInnovation: string;

  // Step 3: Technical Approach
  sensorArchitecture: string;
  edgeProcessing: string;
  telemetryProtocol: string;
  powerSystem: string;

  // Step 4: Implementation
  deploymentMethodology: string;
  sitePreparation: string;
  icccIntegrationSchema: string;
  maintenanceInterval: string;

  // Step 5: Team
  teamLeadName: string;
  teamLeadRole: string;
  teamLeadExperience: string;
  teamSize: string;
  subcontractingDeclaration: string;

  // Step 6: Experience
  pastProjectClient: string;
  pastProjectTitle: string;
  pastProjectOutcome: string;
  relevantYearsExperience: string;

  // Step 7: Cost
  proposedBudgetInr: string;
  hardwareAllocation: string;
  fieldDeploymentAllocation: string;
  telemetryAllocation: string;
  validationAuditAllocation: string;

  // Step 8: Pilot Plan
  pilotDurationDays: string;
  milestone1: string;
  milestone2: string;
  milestone3: string;

  // Step 9: KPIs
  kpi1Target: string;
  kpi2Target: string;
  kpi3Target: string;
  kpiMeasurementMethod: string;

  // Step 10: Risks
  technicalRisk: string;
  environmentalRisk: string;
  mitigationStrategy: string;

  // Step 11: Compliance
  gfrComplianceAck: boolean;
  ipRetentionAck: boolean;
  dataSovereigntyAck: boolean;
  coiDeclarationAck: boolean;

  // Step 12: Documents
  documents: {
    id: string;
    title: string;
    category: string;
    size: string;
    sha256: string;
    date: string;
  }[];
}

const INITIAL_APPLICATION_FORM: ApplicationFormData = {
  // 1. Company
  companyName: "AirSense Technologies Private Limited",
  tradeName: "AirSense AI",
  dpiitNumber: "DIPP-94812",
  cinNumber: "U72900UP2022PTC159821",
  registeredAddress: "402 Tech Park, Gomti Nagar, Lucknow, Uttar Pradesh 226010",
  state: "Uttar Pradesh",
  contactPerson: "Dr. Vikramaditya Sen",
  contactEmail: "founder@airsense.example.com",
  contactPhone: "+91 98765 43210",
  websiteUrl: "https://airsense.example.com",
  sovereignTenancy: true,

  // 2. Solution
  solutionTitle: "AirSense Hyperlocal Optical Particle Mesh & Automated Misting Telemetry",
  executiveSummary:
    "Deployment of 40 calibrated optical particulate counter nodes with on-device machine learning calibration curves and real-time GIS telemetry to guide municipal dust-suppression misting trucks.",
  category: "CleanTech & Environmental IoT",
  trlLevel: "TRL 8 - Operational System Qualified",
  coreInnovation:
    "Orthogonal dual-beam laser particle counter with cyclonic anti-fouling positive-pressure optical purge mechanism, ensuring zero sensor blinding during winter smog episodes.",

  // 3. Technical Approach
  sensorArchitecture:
    "Simultaneous optical scattering resolving PM1, PM2.5, PM10 (0.3 to 40 µm). Integrated NDIR CO2 and electrochemical multi-gas slots.",
  edgeProcessing:
    "On-device ARM Cortex-M4 microcontroller running non-linear hygroscopic growth correction curves calibrated against BAM-1020 reference data.",
  telemetryProtocol: "Dual-carrier LoRaWAN and 4G NB-IoT fallback with cryptographic TLS 1.3 push.",
  powerSystem: "20W Monocrystalline solar panel with 48-hour LiFePO4 internal battery reserve.",

  // 4. Implementation
  deploymentMethodology:
    "Rapid utility pole mounting fixtures installed across 4 Lucknow wards in three 5-day deployment waves.",
  sitePreparation: "Standard 230V auxiliary street lighting drop and municipal pole attachment permit.",
  icccIntegrationSchema:
    "Direct TLS 1.3 REST API and Webhook pushing JSON shapefile telemetry into Lucknow ICCC every 15 minutes.",
  maintenanceInterval: "Bi-weekly remote optical diagnostic health audit and 45-day physical lens inspection.",

  // 5. Team
  teamLeadName: "Dr. Vikramaditya Sen, PhD",
  teamLeadRole: "Lead System Architect & CEO",
  teamLeadExperience: "14 Years in Environmental Sensor Arrays (Ex-IIT Kanpur)",
  teamSize: "18 Full-Time Engineers",
  subcontractingDeclaration: "Zero third-party technical subcontracting. All firmware and assembly in-house.",

  // 6: Experience
  pastProjectClient: "UP State Industrial Development Authority (UPSIDA)",
  pastProjectTitle: "Kanpur Industrial Cluster Micro-Monitoring Grid (25 Nodes)",
  pastProjectOutcome: "96.4% continuous uptime over 18 months; zero sensor blinding incidents.",
  relevantYearsExperience: "3.5 Years Operational Track Record",

  // 7: Cost
  proposedBudgetInr: "2450000",
  hardwareAllocation: "₹13,50,000 (55%)",
  fieldDeploymentAllocation: "₹3,50,000 (14%)",
  telemetryAllocation: "₹2,50,000 (10%)",
  validationAuditAllocation: "₹3,00,000 (12%)",

  // 8: Pilot Plan
  pilotDurationDays: "90 Days",
  milestone1: "Day 15: Ward Site Survey & Initial 10-Node Mesh Deployment (20% disbursement)",
  milestone2: "Day 45: Full 40-Node Deployment & CPCB Collocated Calibration Audit (40% disbursement)",
  milestone3: "Day 90: Final Statistical Validation Dataset & Open API Handover (40% disbursement)",

  // 9: KPIs
  kpi1Target: "Collocated Correlation with CPCB BAM-1020: R² ≥ 0.94",
  kpi2Target: "Spatial Geographic Telemetry Coverage: ≥ 85.0% of Municipal Wards",
  kpi3Target: "Hourly Telemetry Uptime: ≥ 96.0% Availability",
  kpiMeasurementMethod: "Continuous 90-day time-series comparison against collocated regulatory monitors.",

  // 10: Risks
  technicalRisk: "Sensor optical fouling during severe atmospheric dust storms.",
  environmentalRisk: "Extreme ambient temperatures exceeding 45°C in summer.",
  mitigationStrategy:
    "Automated cyclonic anti-fouling positive pressure purge cycles activated every 30 minutes; IP65 aluminium weatherproof casing.",

  // 11: Compliance
  gfrComplianceAck: true,
  ipRetentionAck: true,
  dataSovereigntyAck: true,
  coiDeclarationAck: true,

  // 12: Documents
  documents: [
    {
      id: "doc-1",
      title: "AirSense_Technical_Architecture_Whitepaper.pdf",
      category: "Technical Architecture",
      size: "3.8 MB",
      sha256: "9a8f10b2...4c21",
      date: "2026-03-01",
    },
    {
      id: "doc-2",
      title: "DPIIT_Startup_Recognition_Certificate.pdf",
      category: "Statutory Certificate",
      size: "1.2 MB",
      sha256: "4e12c890...b819",
      date: "2026-03-01",
    },
    {
      id: "doc-3",
      title: "NABL_IP65_RoHS_Test_Report.pdf",
      category: "Laboratory Test Report",
      size: "2.4 MB",
      sha256: "b1093ef4...52aa",
      date: "2026-03-01",
    },
  ],
};

export type ApplicationWorkflowStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "ELIGIBILITY_REVIEW"
  | "UNDER_EVALUATION"
  | "SHORTLISTED"
  | "PILOT_PREPARATION"
  | "WITHDRAWN";

interface StartupApplicationWizardProps {
  challengeId?: string;
  initialStatus?: ApplicationWorkflowStatus;
  applicationId?: string;
  onStatusChange?: (status: ApplicationWorkflowStatus) => void;
}

export function StartupApplicationWizard({
  challengeId = "chal-air-001",
  initialStatus = "DRAFT",
  applicationId = "APP-2026-UP-UAQ-041",
  onStatusChange,
}: StartupApplicationWizardProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const challenge = getChallengeById(challengeId) || CHALLENGES_DATA[0];

  const [activeStep, setActiveStep] = useState(0);
  const [status, setStatus] = useState<ApplicationWorkflowStatus>(initialStatus);
  const [formData, setFormData] = useState<ApplicationFormData>(INITIAL_APPLICATION_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastSaved, setLastSaved] = useState<string>("Just now");
  
  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState("Commercial or Resource Constraint");
  const [isClarificationModalOpen, setIsClarificationModalOpen] = useState(false);
  const [clarificationResponse, setClarificationResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status timeline stages
  const statusStages = [
    { key: "SUBMITTED", label: "Submitted", desc: "Cryptographic SHA-256 sealed proposal registered." },
    { key: "ELIGIBILITY_REVIEW", label: "Eligibility Review", desc: "DPIIT & GFR Rule 149 statutory verification." },
    { key: "UNDER_EVALUATION", label: "Under Evaluation", desc: "Double-blind expert technical committee review." },
    { key: "SHORTLISTED", label: "Shortlisted", desc: "Recommended for formal municipal pilot allocation." },
    { key: "PILOT_PREPARATION", label: "Pilot Preparation", desc: "Tripartite covenant signing & site mobilization." },
  ];

  const currentStageIndex =
    status === "SUBMITTED"
      ? 0
      : status === "ELIGIBILITY_REVIEW"
      ? 1
      : status === "UNDER_EVALUATION"
      ? 2
      : status === "SHORTLISTED"
      ? 3
      : status === "PILOT_PREPARATION"
      ? 4
      : -1;

  // The 14 Required Steps
  const steps = [
    { id: 0, title: "Company", phase: "Entity & Solution" },
    { id: 1, title: "Solution", phase: "Entity & Solution" },
    { id: 2, title: "Technical Approach", phase: "Entity & Solution" },
    { id: 3, title: "Implementation", phase: "Entity & Solution" },
    { id: 4, title: "Team", phase: "Team & Capability" },
    { id: 5, title: "Experience", phase: "Team & Capability" },
    { id: 6, title: "Cost", phase: "Execution & Economics" },
    { id: 7, title: "Pilot Plan", phase: "Execution & Economics" },
    { id: 8, title: "KPIs", phase: "Execution & Economics" },
    { id: 9, title: "Risks", phase: "Execution & Economics" },
    { id: 10, title: "Compliance", phase: "Statutory & Submission" },
    { id: 11, title: "Documents", phase: "Statutory & Submission" },
    { id: 12, title: "Review", phase: "Statutory & Submission" },
    { id: 13, title: "Submit", phase: "Statutory & Submission" },
  ];

  // Autosave simulation
  useEffect(() => {
    if (status !== "DRAFT") return;
    const interval = setInterval(() => {
      setLastSaved(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 30000);
    return () => clearInterval(interval);
  }, [status]);

  const handleChange = (field: keyof ApplicationFormData, value: any) => {
    if (status !== "DRAFT") return; // Locked critical fields after submission
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Step Validation
  const validateStep = (stepIdx: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepIdx === 0) {
      if (!formData.companyName.trim()) newErrors.companyName = "Company legal name is required.";
      if (!formData.dpiitNumber.trim()) newErrors.dpiitNumber = "DPIIT recognition number is required.";
      if (!formData.contactEmail.trim() || !formData.contactEmail.includes("@")) {
        newErrors.contactEmail = "A valid contact email is required.";
      }
    } else if (stepIdx === 1) {
      if (!formData.solutionTitle.trim()) newErrors.solutionTitle = "Solution title is required.";
      if (formData.executiveSummary.length < 20) {
        newErrors.executiveSummary = "Executive summary must be at least 20 characters.";
      }
    } else if (stepIdx === 2) {
      if (!formData.sensorArchitecture.trim()) newErrors.sensorArchitecture = "Sensor architecture is required.";
      if (!formData.telemetryProtocol.trim()) newErrors.telemetryProtocol = "Telemetry protocol is required.";
    } else if (stepIdx === 3) {
      if (!formData.deploymentMethodology.trim()) newErrors.deploymentMethodology = "Deployment methodology is required.";
      if (!formData.icccIntegrationSchema.trim()) newErrors.icccIntegrationSchema = "ICCC integration schema is required.";
    } else if (stepIdx === 4) {
      if (!formData.teamLeadName.trim()) newErrors.teamLeadName = "Team lead name is required.";
      if (!formData.teamLeadExperience.trim()) newErrors.teamLeadExperience = "Team lead experience is required.";
    } else if (stepIdx === 5) {
      if (!formData.pastProjectTitle.trim()) newErrors.pastProjectTitle = "Past project reference is required.";
    } else if (stepIdx === 6) {
      if (!formData.proposedBudgetInr.trim() || isNaN(Number(formData.proposedBudgetInr))) {
        newErrors.proposedBudgetInr = "A valid numerical budget in INR is required.";
      }
    } else if (stepIdx === 7) {
      if (!formData.milestone1.trim()) newErrors.milestone1 = "Milestone 1 details are required.";
      if (!formData.milestone2.trim()) newErrors.milestone2 = "Milestone 2 details are required.";
    } else if (stepIdx === 8) {
      if (!formData.kpi1Target.trim()) newErrors.kpi1Target = "Primary KPI target commitment is required.";
    } else if (stepIdx === 9) {
      if (!formData.mitigationStrategy.trim()) newErrors.mitigationStrategy = "Mitigation strategy is required.";
    } else if (stepIdx === 10) {
      if (!formData.gfrComplianceAck || !formData.dataSovereigntyAck) {
        newErrors.compliance = "You must acknowledge GFR 2017 and Sovereign Data residency requirements.";
      }
    } else if (stepIdx === 11) {
      if (formData.documents.length === 0) {
        newErrors.documents = "At least one technical or statutory document must be uploaded.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => Math.min(steps.length - 1, prev + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      showToast({
        type: "error",
        title: "Validation Error",
        description: "Please complete all mandatory fields with valid information.",
      });
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveDraft = () => {
    setLastSaved(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    showToast({
      type: "success",
      title: "Draft Saved",
      description: "Application progress stored to secure local workspace state.",
    });
  };

  const handleSubmitApplication = () => {
    // Validate all steps
    for (let i = 0; i <= 11; i++) {
      if (!validateStep(i)) {
        setActiveStep(i);
        showToast({
          type: "error",
          title: "Incomplete Proposal",
          description: `Missing mandatory inputs in Step ${i + 1}: ${steps[i].title}.`,
        });
        return;
      }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStatus("UNDER_EVALUATION");
      if (onStatusChange) onStatusChange("UNDER_EVALUATION");
      setIsSubmitModalOpen(false);
      showToast({
        type: "success",
        title: "Application Submitted Successfully!",
        description: `Registered under ID ${applicationId}. Fields are now locked for expert evaluation.`,
      });
    }, 1200);
  };

  const handleWithdrawApplication = () => {
    setIsWithdrawModalOpen(false);
    setStatus("WITHDRAWN");
    if (onStatusChange) onStatusChange("WITHDRAWN");
    showToast({
      type: "warning",
      title: "Application Withdrawn",
      description: "Your proposal has been officially marked as withdrawn from the procurement round.",
    });
  };

  const handleClarificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clarificationResponse.trim()) return;
    setIsClarificationModalOpen(false);
    setClarificationResponse("");
    showToast({
      type: "success",
      title: "Clarification Dispatched",
      description: "Response anchored to official evaluation committee docket.",
    });
  };

  const isLocked = status !== "DRAFT";
  const progressPercent = Math.round(((activeStep + 1) / steps.length) * 100);

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Top Application Header */}
      <div className="border-b border-gov-border pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Link
              href="/startup/dashboard?tab=applications"
              className="text-xs text-gov-muted hover:text-gov-primary flex items-center"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Applications Dashboard
            </Link>
            <span className="text-slate-300">•</span>
            <Badge variant="outline" className="font-mono text-xs text-gov-accent">
              CHALLENGE: {challenge.code}
            </Badge>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-gov-muted font-medium">{challenge.department}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-gov-primary tracking-tight">
              Startup Proposal Formulation
            </h1>
            {isLocked ? (
              <Badge variant="warning" className="font-mono text-xs flex items-center gap-1">
                <Lock className="w-3 h-3" />
                FIELDS LOCKED: EVALUATION IN PROGRESS
              </Badge>
            ) : (
              <Badge variant="outline" className="font-mono text-xs text-blue-700 bg-blue-50 border-blue-200">
                14-STEP SUBMISSION WIZARD
              </Badge>
            )}
          </div>
        </div>

        {/* Action Header Controls */}
        <div className="flex items-center space-x-2.5 shrink-0 text-xs">
          {!isLocked && (
            <>
              <span className="text-xs text-gov-muted font-mono hidden sm:inline">
                Autosaved at {lastSaved}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleSaveDraft}
                className="text-xs h-8 border-slate-300"
              >
                <Save className="w-3.5 h-3.5 mr-1" /> Save Draft
              </Button>
            </>
          )}

          {isLocked && status !== "WITHDRAWN" && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsClarificationModalOpen(true)}
                className="text-xs h-8 border-purple-300 text-purple-900 bg-purple-50 hover:bg-purple-100 font-semibold"
              >
                <MessageSquare className="w-3.5 h-3.5 mr-1 text-purple-700" /> Respond to Clarification
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsWithdrawModalOpen(true)}
                className="text-xs h-8 border-red-300 text-red-900 bg-red-50 hover:bg-red-100"
              >
                Withdraw Application
              </Button>
            </>
          )}
        </div>
      </div>

      {/* POST-SUBMISSION STATUS TIMELINE (If submitted) */}
      {isLocked && (
        <div className="bg-white border border-gov-border rounded-card p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-mono text-gov-accent font-bold uppercase tracking-wider block">
                APPLICATION DOSSIER: {applicationId}
              </span>
              <h2 className="text-sm font-bold text-gov-primary">
                Official Evaluation Status Timeline
              </h2>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-gov-muted">Current Stage:</span>
              <Badge variant="default" className="bg-gov-primary font-mono text-xs">
                {status.replace(/_/g, " ")}
              </Badge>
            </div>
          </div>

          {/* Timeline Step Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
            {statusStages.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const isFuture = idx > currentStageIndex;

              return (
                <div
                  key={stage.key}
                  className={`p-3 rounded-control border transition-all ${
                    isCurrent
                      ? "bg-blue-50/70 border-blue-300 text-gov-primary ring-2 ring-blue-100"
                      : isPast
                      ? "bg-emerald-50/50 border-emerald-200 text-emerald-950"
                      : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold">
                      STAGE {idx + 1}
                    </span>
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {isCurrent && <Clock className="w-3.5 h-3.5 text-blue-600 animate-pulse" />}
                  </div>
                  <p className="font-bold text-xs leading-tight mb-1">{stage.label}</p>
                  <p className="text-xs leading-tight text-slate-600">{stage.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress & Stepper Bar */}
      <div className="bg-white border border-gov-border rounded-card p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-gov-primary font-mono text-xs uppercase">
              STEP {activeStep + 1} OF 14: {steps[activeStep].title.toUpperCase()}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-gov-muted text-xs font-medium">
              Phase: {steps[activeStep].phase}
            </span>
          </div>

          <span className="font-mono text-xs font-bold text-slate-900">
            {progressPercent}% Complete
          </span>
        </div>

        <Progress value={progressPercent} className="h-2 bg-slate-100" />

        {/* Horizontal Step Tabs Navigator */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs scrollbar-thin">
          {steps.map((st, i) => {
            const isCompleted = i < activeStep;
            const isCurrent = i === activeStep;

            return (
              <button
                key={st.id}
                onClick={() => {
                  if (i <= activeStep || validateStep(activeStep)) {
                    setActiveStep(i);
                  }
                }}
                className={`px-2.5 py-1 rounded text-nowrap font-medium transition-all flex items-center gap-1 border ${
                  isCurrent
                    ? "bg-gov-primary text-white border-gov-primary shadow-2xs font-bold"
                    : isCompleted
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {isCompleted ? <Check className="w-3 h-3 text-emerald-600" /> : `${i + 1}.`}
                <span>{st.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Multi-Step Form Card */}
      <div className="bg-white border border-gov-border rounded-card p-6 shadow-sm space-y-6">
        {/* STEP 1: COMPANY */}
        {activeStep === 0 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-base font-bold text-gov-primary">
                1. Organization & Statutory Entity Profile
              </h2>
              <p className="text-xs text-gov-muted">
                Official corporate details registered with DPIIT and Ministry of Corporate Affairs (MCA).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Legal Entity Name <span className="text-red-500">*</span>
                </label>
                <Input
                  disabled={isLocked}
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  className={errors.companyName ? "border-red-500" : ""}
                />
                {errors.companyName && <p className="text-xs text-red-600">{errors.companyName}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Trade / Brand Name</label>
                <Input
                  disabled={isLocked}
                  value={formData.tradeName}
                  onChange={(e) => handleChange("tradeName", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  DPIIT Recognition Number <span className="text-red-500">*</span>
                </label>
                <Input
                  disabled={isLocked}
                  value={formData.dpiitNumber}
                  onChange={(e) => handleChange("dpiitNumber", e.target.value)}
                  className={errors.dpiitNumber ? "border-red-500" : ""}
                />
                {errors.dpiitNumber && <p className="text-xs text-red-600">{errors.dpiitNumber}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Corporate CIN / LLPIN</label>
                <Input
                  disabled={isLocked}
                  value={formData.cinNumber}
                  onChange={(e) => handleChange("cinNumber", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Registered State</label>
                <Input
                  disabled={isLocked}
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">Registered Corporate Address</label>
              <Input
                disabled={isLocked}
                value={formData.registeredAddress}
                onChange={(e) => handleChange("registeredAddress", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Authorized Contact Officer</label>
                <Input
                  disabled={isLocked}
                  value={formData.contactPerson}
                  onChange={(e) => handleChange("contactPerson", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Official Contact Email <span className="text-red-500">*</span>
                </label>
                <Input
                  disabled={isLocked}
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  className={errors.contactEmail ? "border-red-500" : ""}
                />
                {errors.contactEmail && <p className="text-xs text-red-600">{errors.contactEmail}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Contact Phone Number</label>
                <Input
                  disabled={isLocked}
                  value={formData.contactPhone}
                  onChange={(e) => handleChange("contactPhone", e.target.value)}
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-control flex items-center space-x-2.5">
              <input
                disabled={isLocked}
                type="checkbox"
                id="sovereignTenancy"
                checked={formData.sovereignTenancy}
                onChange={(e) => handleChange("sovereignTenancy", e.target.checked)}
                className="w-4 h-4 rounded text-gov-primary focus:ring-gov-accent"
              />
              <label htmlFor="sovereignTenancy" className="text-slate-800 font-medium cursor-pointer">
                Certification of Sovereign Indian Cloud Tenancy (MeitY Empaneled Data Centre within Indian borders).
              </label>
            </div>
          </div>
        )}

        {/* STEP 2: SOLUTION */}
        {activeStep === 1 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-base font-bold text-gov-primary">
                2. Solution Statement & Core Value Proposition
              </h2>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">
                Proposed Solution Title <span className="text-red-500">*</span>
              </label>
              <Input
                disabled={isLocked}
                value={formData.solutionTitle}
                onChange={(e) => handleChange("solutionTitle", e.target.value)}
                className={errors.solutionTitle ? "border-red-500" : ""}
              />
              {errors.solutionTitle && <p className="text-xs text-red-600">{errors.solutionTitle}</p>}
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">
                Executive Summary <span className="text-red-500">*</span>
              </label>
              <Textarea
                disabled={isLocked}
                rows={3}
                value={formData.executiveSummary}
                onChange={(e) => handleChange("executiveSummary", e.target.value)}
                className={errors.executiveSummary ? "border-red-500" : ""}
              />
              {errors.executiveSummary && <p className="text-xs text-red-600">{errors.executiveSummary}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Technology Readiness Level (TRL)</label>
                <select
                  disabled={isLocked}
                  value={formData.trlLevel}
                  onChange={(e) => handleChange("trlLevel", e.target.value)}
                  className="w-full text-xs border border-gov-border rounded-control p-2.5 bg-white text-slate-800"
                >
                  <option value="TRL 6 - Prototype Demonstrated in Relevant Environment">TRL 6 - Prototype in Environment</option>
                  <option value="TRL 7 - System Prototype Demonstrated in Operational Field">TRL 7 - Field Demonstrated</option>
                  <option value="TRL 8 - Operational System Qualified">TRL 8 - Operational System Qualified</option>
                  <option value="TRL 9 - Full Commercial Deployment Proven">TRL 9 - Proven in Production</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Core Intellectual Property & Innovation</label>
                <Input
                  disabled={isLocked}
                  value={formData.coreInnovation}
                  onChange={(e) => handleChange("coreInnovation", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: TECHNICAL APPROACH */}
        {activeStep === 2 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-base font-bold text-gov-primary">
                3. Technical Architecture & Telemetry Engineering
              </h2>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">
                Sensor & Hardware Architecture <span className="text-red-500">*</span>
              </label>
              <Textarea
                disabled={isLocked}
                rows={2}
                value={formData.sensorArchitecture}
                onChange={(e) => handleChange("sensorArchitecture", e.target.value)}
                className={errors.sensorArchitecture ? "border-red-500" : ""}
              />
              {errors.sensorArchitecture && <p className="text-xs text-red-600">{errors.sensorArchitecture}</p>}
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">Edge Processing & Auto-Calibration</label>
              <Textarea
                disabled={isLocked}
                rows={2}
                value={formData.edgeProcessing}
                onChange={(e) => handleChange("edgeProcessing", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Telemetry & Cryptographic Backhaul <span className="text-red-500">*</span>
                </label>
                <Input
                  disabled={isLocked}
                  value={formData.telemetryProtocol}
                  onChange={(e) => handleChange("telemetryProtocol", e.target.value)}
                  className={errors.telemetryProtocol ? "border-red-500" : ""}
                />
                {errors.telemetryProtocol && <p className="text-xs text-red-600">{errors.telemetryProtocol}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Power System & Battery Autonomy</label>
                <Input
                  disabled={isLocked}
                  value={formData.powerSystem}
                  onChange={(e) => handleChange("powerSystem", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: IMPLEMENTATION */}
        {activeStep === 3 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-base font-bold text-gov-primary">
                4. Field Implementation & Municipal Integration
              </h2>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">
                Deployment Methodology & Schedule <span className="text-red-500">*</span>
              </label>
              <Textarea
                disabled={isLocked}
                rows={2}
                value={formData.deploymentMethodology}
                onChange={(e) => handleChange("deploymentMethodology", e.target.value)}
                className={errors.deploymentMethodology ? "border-red-500" : ""}
              />
              {errors.deploymentMethodology && <p className="text-xs text-red-600">{errors.deploymentMethodology}</p>}
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">Site Preparation & Mounting Requirements</label>
              <Input
                disabled={isLocked}
                value={formData.sitePreparation}
                onChange={(e) => handleChange("sitePreparation", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">
                Command Center (ICCC) Integration Endpoints <span className="text-red-500">*</span>
              </label>
              <Input
                disabled={isLocked}
                value={formData.icccIntegrationSchema}
                onChange={(e) => handleChange("icccIntegrationSchema", e.target.value)}
                className={errors.icccIntegrationSchema ? "border-red-500" : ""}
              />
              {errors.icccIntegrationSchema && <p className="text-xs text-red-600">{errors.icccIntegrationSchema}</p>}
            </div>
          </div>
        )}

        {/* STEP 5: TEAM */}
        {activeStep === 4 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-base font-bold text-gov-primary">
                5. Key Technical Personnel & Execution Leadership
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Principal Investigator / Team Lead <span className="text-red-500">*</span>
                </label>
                <Input
                  disabled={isLocked}
                  value={formData.teamLeadName}
                  onChange={(e) => handleChange("teamLeadName", e.target.value)}
                  className={errors.teamLeadName ? "border-red-500" : ""}
                />
                {errors.teamLeadName && <p className="text-xs text-red-600">{errors.teamLeadName}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Role in Pilot Execution</label>
                <Input
                  disabled={isLocked}
                  value={formData.teamLeadRole}
                  onChange={(e) => handleChange("teamLeadRole", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Qualifications & Years of Relevant Experience <span className="text-red-500">*</span>
                </label>
                <Input
                  disabled={isLocked}
                  value={formData.teamLeadExperience}
                  onChange={(e) => handleChange("teamLeadExperience", e.target.value)}
                  className={errors.teamLeadExperience ? "border-red-500" : ""}
                />
                {errors.teamLeadExperience && <p className="text-xs text-red-600">{errors.teamLeadExperience}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Total Engineering Team Size</label>
                <Input
                  disabled={isLocked}
                  value={formData.teamSize}
                  onChange={(e) => handleChange("teamSize", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">Subcontracting Declaration</label>
              <Input
                disabled={isLocked}
                value={formData.subcontractingDeclaration}
                onChange={(e) => handleChange("subcontractingDeclaration", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 6: EXPERIENCE */}
        {activeStep === 5 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-base font-bold text-gov-primary">
                6. Relevant Track Record & Government Deployments
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Previous Client / Authority</label>
                <Input
                  disabled={isLocked}
                  value={formData.pastProjectClient}
                  onChange={(e) => handleChange("pastProjectClient", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Past Project / Deployment Title <span className="text-red-500">*</span>
                </label>
                <Input
                  disabled={isLocked}
                  value={formData.pastProjectTitle}
                  onChange={(e) => handleChange("pastProjectTitle", e.target.value)}
                  className={errors.pastProjectTitle ? "border-red-500" : ""}
                />
                {errors.pastProjectTitle && <p className="text-xs text-red-600">{errors.pastProjectTitle}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">Audited Outcome & Verification Result</label>
              <Textarea
                disabled={isLocked}
                rows={2}
                value={formData.pastProjectOutcome}
                onChange={(e) => handleChange("pastProjectOutcome", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 7: COST */}
        {activeStep === 6 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <h2 className="text-base font-bold text-gov-primary">
                7. Proposed Pilot Budget & Cost Justification
              </h2>
              <span className="text-xs font-mono text-gov-muted">
                Challenge Ceiling: {challenge.budget}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Total Proposed Pilot Budget (INR) <span className="text-red-500">*</span>
                </label>
                <Input
                  disabled={isLocked}
                  value={formData.proposedBudgetInr}
                  onChange={(e) => handleChange("proposedBudgetInr", e.target.value)}
                  className={errors.proposedBudgetInr ? "border-red-500" : ""}
                />
                {errors.proposedBudgetInr && <p className="text-xs text-red-600">{errors.proposedBudgetInr}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Hardware & Sensor Fabrication Share</label>
                <Input
                  disabled={isLocked}
                  value={formData.hardwareAllocation}
                  onChange={(e) => handleChange("hardwareAllocation", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Field Installation & Wiring</label>
                <Input
                  disabled={isLocked}
                  value={formData.fieldDeploymentAllocation}
                  onChange={(e) => handleChange("fieldDeploymentAllocation", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Cellular & Cloud Telemetry</label>
                <Input
                  disabled={isLocked}
                  value={formData.telemetryAllocation}
                  onChange={(e) => handleChange("telemetryAllocation", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Independent Validation Escrow</label>
                <Input
                  disabled={isLocked}
                  value={formData.validationAuditAllocation}
                  onChange={(e) => handleChange("validationAuditAllocation", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: PILOT PLAN */}
        {activeStep === 7 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-base font-bold text-gov-primary">
                8. Controlled Pilot Plan & Milestone Deliverables
              </h2>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">
                Milestone 1 Deliverable (Initial Deployment) <span className="text-red-500">*</span>
              </label>
              <Input
                disabled={isLocked}
                value={formData.milestone1}
                onChange={(e) => handleChange("milestone1", e.target.value)}
                className={errors.milestone1 ? "border-red-500" : ""}
              />
              {errors.milestone1 && <p className="text-xs text-red-600">{errors.milestone1}</p>}
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">
                Milestone 2 Deliverable (Collocated Calibration) <span className="text-red-500">*</span>
              </label>
              <Input
                disabled={isLocked}
                value={formData.milestone2}
                onChange={(e) => handleChange("milestone2", e.target.value)}
                className={errors.milestone2 ? "border-red-500" : ""}
              />
              {errors.milestone2 && <p className="text-xs text-red-600">{errors.milestone2}</p>}
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">
                Milestone 3 Deliverable (Final Dataset & Validation)
              </label>
              <Input
                disabled={isLocked}
                value={formData.milestone3}
                onChange={(e) => handleChange("milestone3", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 9: KPIS */}
        {activeStep === 8 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-base font-bold text-gov-primary">
                9. Audited KPI Target Commitments
              </h2>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">
                Target KPI 1 (Collocated Correlation Benchmark) <span className="text-red-500">*</span>
              </label>
              <Input
                disabled={isLocked}
                value={formData.kpi1Target}
                onChange={(e) => handleChange("kpi1Target", e.target.value)}
                className={errors.kpi1Target ? "border-red-500" : ""}
              />
              {errors.kpi1Target && <p className="text-xs text-red-600">{errors.kpi1Target}</p>}
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">Target KPI 2 (Spatial Coverage)</label>
              <Input
                disabled={isLocked}
                value={formData.kpi2Target}
                onChange={(e) => handleChange("kpi2Target", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">Target KPI 3 (Hardware Telemetry Uptime)</label>
              <Input
                disabled={isLocked}
                value={formData.kpi3Target}
                onChange={(e) => handleChange("kpi3Target", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">Independent Measurement & Verification Method</label>
              <Input
                disabled={isLocked}
                value={formData.kpiMeasurementMethod}
                onChange={(e) => handleChange("kpiMeasurementMethod", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 10: RISKS */}
        {activeStep === 9 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-base font-bold text-gov-primary">
                10. Risk Identification & Mitigation Strategy
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Identified Technical Risk</label>
                <Input
                  disabled={isLocked}
                  value={formData.technicalRisk}
                  onChange={(e) => handleChange("technicalRisk", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Environmental / Operational Risk</label>
                <Input
                  disabled={isLocked}
                  value={formData.environmentalRisk}
                  onChange={(e) => handleChange("environmentalRisk", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">
                Actionable Mitigation Strategy & Redundancy <span className="text-red-500">*</span>
              </label>
              <Textarea
                disabled={isLocked}
                rows={3}
                value={formData.mitigationStrategy}
                onChange={(e) => handleChange("mitigationStrategy", e.target.value)}
                className={errors.mitigationStrategy ? "border-red-500" : ""}
              />
              {errors.mitigationStrategy && <p className="text-xs text-red-600">{errors.mitigationStrategy}</p>}
            </div>
          </div>
        )}

        {/* STEP 11: COMPLIANCE */}
        {activeStep === 10 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-base font-bold text-gov-primary">
                11. Statutory Compliance & Legal Declarations
              </h2>
            </div>

            {errors.compliance && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 font-medium">
                {errors.compliance}
              </div>
            )}

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-start space-x-2.5">
                <input
                  disabled={isLocked}
                  type="checkbox"
                  id="gfrComplianceAck"
                  checked={formData.gfrComplianceAck}
                  onChange={(e) => handleChange("gfrComplianceAck", e.target.checked)}
                  className="w-4 h-4 rounded text-gov-primary mt-0.5"
                />
                <label htmlFor="gfrComplianceAck" className="text-slate-800 leading-relaxed cursor-pointer">
                  <strong>General Financial Rules (GFR 2017) Rule 149 Compliance:</strong> Acknowledge adherence to public procurement standards and milestone-linked verification covenants.
                </label>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-start space-x-2.5">
                <input
                  disabled={isLocked}
                  type="checkbox"
                  id="ipRetentionAck"
                  checked={formData.ipRetentionAck}
                  onChange={(e) => handleChange("ipRetentionAck", e.target.checked)}
                  className="w-4 h-4 rounded text-gov-primary mt-0.5"
                />
                <label htmlFor="ipRetentionAck" className="text-slate-800 leading-relaxed cursor-pointer">
                  <strong>Intellectual Property Rights:</strong> Confirm that the startup retains all background IP and algorithms, while granting the municipal authority perpetual non-exclusive data usage rights.
                </label>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-start space-x-2.5">
                <input
                  disabled={isLocked}
                  type="checkbox"
                  id="dataSovereigntyAck"
                  checked={formData.dataSovereigntyAck}
                  onChange={(e) => handleChange("dataSovereigntyAck", e.target.checked)}
                  className="w-4 h-4 rounded text-gov-primary mt-0.5"
                />
                <label htmlFor="dataSovereigntyAck" className="text-slate-800 leading-relaxed cursor-pointer">
                  <strong>Sovereign Data Residency & DPDP Act:</strong> Acknowledge that all telemetry resides strictly in Indian data centres with zero foreign routing.
                </label>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-start space-x-2.5">
                <input
                  disabled={isLocked}
                  type="checkbox"
                  id="coiDeclarationAck"
                  checked={formData.coiDeclarationAck}
                  onChange={(e) => handleChange("coiDeclarationAck", e.target.checked)}
                  className="w-4 h-4 rounded text-gov-primary mt-0.5"
                />
                <label htmlFor="coiDeclarationAck" className="text-slate-800 leading-relaxed cursor-pointer">
                  <strong>Zero Conflict of Interest (COI):</strong> Certify that no director or employee has familial or commercial ties to the evaluating municipal officers or committee members.
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 12: DOCUMENTS */}
        {activeStep === 11 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-base font-bold text-gov-primary">
                12. Statutory Dossier & Document Uploads
              </h2>
            </div>

            {errors.documents && (
              <p className="text-xs text-red-600 font-semibold">{errors.documents}</p>
            )}

            {!isLocked && (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-card space-y-2">
                <span className="font-bold text-slate-900 block text-xs">
                  Upload Supporting Proposal File (PDF)
                </span>
                <FileUpload
                  accept=".pdf"
                  onFileSelect={(file, hash) => {
                    const newDoc = {
                      id: `doc-${Date.now()}`,
                      title: file.name,
                      category: "Technical Proposal Supplement",
                      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                      sha256: `${hash.substring(0, 8)}...${hash.substring(hash.length - 4)}`,
                      date: new Date().toISOString().split("T")[0],
                    };
                    handleChange("documents", [newDoc, ...formData.documents]);
                    showToast({
                      type: "success",
                      title: "File Added",
                      description: `Attached ${file.name} with verified SHA-256 digest.`,
                    });
                  }}
                />
              </div>
            )}

            <div className="space-y-2">
              <span className="font-bold text-slate-800 block text-xs">
                Attached Proposal Documents ({formData.documents.length}):
              </span>
              <div className="border border-gov-border rounded-control overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-xs uppercase font-mono text-gov-muted border-b border-gov-border">
                    <tr>
                      <th className="p-2.5">Document Title</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">SHA-256 Digest</th>
                      {!isLocked && <th className="p-2.5 text-right">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {formData.documents.map((doc, idx) => (
                      <tr key={doc.id}>
                        <td className="p-2.5 font-semibold text-slate-900">
                          {doc.title}
                          <span className="block text-xs text-gov-muted font-mono">{doc.size} • {doc.date}</span>
                        </td>
                        <td className="p-2.5 text-slate-600">{doc.category}</td>
                        <td className="p-2.5 font-mono text-gov-muted">{doc.sha256}</td>
                        {!isLocked && (
                          <td className="p-2.5 text-right">
                            <button
                              onClick={() => {
                                const updated = formData.documents.filter((_, i) => i !== idx);
                                handleChange("documents", updated);
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* STEP 13: REVIEW */}
        {activeStep === 12 && (
          <div className="space-y-6 text-xs animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gov-primary">
                  13. Comprehensive Proposal Dossier Review
                </h2>
                <p className="text-xs text-gov-muted">
                  Review all structured parameters before final submission. Click Edit on any section to revise.
                </p>
              </div>
              <Badge variant="outline" className="font-mono text-xs text-emerald-800 bg-emerald-50">
                12 Steps Validated
              </Badge>
            </div>

            <div className="space-y-4">
              {/* Review Group 1 */}
              <div className="border border-slate-200 rounded-control p-3.5 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gov-primary uppercase tracking-wider text-xs font-mono">
                    1. COMPANY & ENTITY IDENTIFICATION
                  </span>
                  {!isLocked && (
                    <button onClick={() => setActiveStep(0)} className="text-gov-accent hover:underline font-semibold">
                      Edit
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-gov-muted block">Legal Name:</span> {formData.companyName}</div>
                  <div><span className="text-gov-muted block">DPIIT Number:</span> {formData.dpiitNumber}</div>
                  <div><span className="text-gov-muted block">Contact Officer:</span> {formData.contactPerson} ({formData.contactEmail})</div>
                  <div><span className="text-gov-muted block">Sovereign Tenancy:</span> Confirmed Indian Cloud</div>
                </div>
              </div>

              {/* Review Group 2 */}
              <div className="border border-slate-200 rounded-control p-3.5 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gov-primary uppercase tracking-wider text-xs font-mono">
                    2. TECHNICAL SOLUTION & ARCHITECTURE
                  </span>
                  {!isLocked && (
                    <button onClick={() => setActiveStep(1)} className="text-gov-accent hover:underline font-semibold">
                      Edit
                    </button>
                  )}
                </div>
                <div className="space-y-1 text-xs">
                  <div><span className="text-gov-muted block">Solution Title:</span> {formData.solutionTitle}</div>
                  <div><span className="text-gov-muted block">Sensor Architecture:</span> {formData.sensorArchitecture}</div>
                  <div><span className="text-gov-muted block">Backhaul & Integration:</span> {formData.telemetryProtocol} • {formData.icccIntegrationSchema}</div>
                </div>
              </div>

              {/* Review Group 3 */}
              <div className="border border-slate-200 rounded-control p-3.5 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gov-primary uppercase tracking-wider text-xs font-mono">
                    3. ECONOMICS, PILOT PLAN & AUDITED KPIS
                  </span>
                  {!isLocked && (
                    <button onClick={() => setActiveStep(6)} className="text-gov-accent hover:underline font-semibold">
                      Edit
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-gov-muted block">Proposed Budget:</span> ₹{Number(formData.proposedBudgetInr).toLocaleString("en-IN")}</div>
                  <div><span className="text-gov-muted block">Duration:</span> {formData.pilotDurationDays}</div>
                  <div className="col-span-2"><span className="text-gov-muted block">Key Target KPI:</span> {formData.kpi1Target}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 14: SUBMIT */}
        {activeStep === 13 && (
          <div className="space-y-6 text-xs animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-base font-bold text-gov-primary">
                14. Official Submission Authorization
              </h2>
              <p className="text-xs text-gov-muted">
                Final commit under General Financial Rules (GFR 2017) Rule 149.
              </p>
            </div>

            {isLocked ? (
              <div className="p-6 bg-emerald-50/60 border border-emerald-300 rounded-card space-y-3 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-extrabold text-emerald-950">
                  Application Successfully Registered
                </h3>
                <p className="text-xs text-emerald-900 max-w-md mx-auto">
                  Your proposal is officially queued under Application ID <strong>{applicationId}</strong>. Double-blind technical scoring by academic experts is underway.
                </p>
                <div className="pt-2">
                  <Link href="/startup/dashboard?tab=applications">
                    <Button size="sm" className="bg-gov-primary text-xs">
                      Return to Applications Tracker
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-control space-y-2">
                  <span className="font-bold text-slate-900 block text-xs">
                    Statutory Submission Sign-Off
                  </span>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    By submitting this proposal, the authorized signatory certifies that all technical specifications, pricing figures, and certifications are true and verifiable under Indian law. Once submitted, all proposal fields will be locked to ensure integrity during the double-blind evaluation period.
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 text-gov-muted">
                    <Lock className="w-4 h-4 text-gov-primary" />
                    <span>Fields will lock immediately upon submission</span>
                  </div>

                  <Button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs h-9 px-4 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" /> Commit & Submit Application
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={handleBack}
            disabled={activeStep === 0}
            className="text-xs h-8.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Previous Step
          </Button>

          {activeStep < steps.length - 1 && (
            <Button
              size="sm"
              onClick={handleNext}
              className="bg-gov-primary hover:bg-gov-primary/95 text-white font-semibold text-xs h-8.5"
            >
              Next: {steps[activeStep + 1].title} <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          )}
        </div>
      </div>

      {/* MODAL 1: SUBMISSION CONFIRMATION MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-card border border-gov-border bg-white shadow-2xl p-6 space-y-4 text-left">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-2">
              <Send className="w-5 h-5 text-gov-primary" />
              <h3 className="font-extrabold text-sm text-gov-primary">
                Confirm Official Submission
              </h3>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Are you sure you want to submit your proposal for <span className="font-semibold text-gov-primary">{challenge.code}</span>? Once committed, your proposal will be locked and forwarded for double-blind academic evaluation.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-gov-muted space-y-1 font-mono">
              <div>APPLICANT: {formData.companyName}</div>
              <div>PROPOSED COST: ₹{Number(formData.proposedBudgetInr).toLocaleString("en-IN")}</div>
              <div>ATTACHED DOCUMENTS: {formData.documents.length} Files</div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-end space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitApplication}
                disabled={isSubmitting}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs"
              >
                {isSubmitting ? "Committing..." : "Confirm & Submit"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: WITHDRAW APPLICATION MODAL */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-card border border-gov-border bg-white shadow-2xl p-6 space-y-4 text-left">
            <div className="flex items-center space-x-2 text-red-600 border-b border-slate-100 pb-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-extrabold text-sm text-red-950">
                Withdraw Proposal
              </h3>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Withdrawing your application will remove it from the active evaluation docket. This action is recorded in the official audit log.
            </p>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-800">Reason for Withdrawal</label>
              <select
                value={withdrawReason}
                onChange={(e) => setWithdrawReason(e.target.value)}
                className="w-full text-xs border border-gov-border rounded-control p-2 bg-white text-slate-800"
              >
                <option value="Commercial or Resource Constraint">Commercial or Resource Constraint</option>
                <option value="Technical Specification Adjustment">Technical Specification Adjustment</option>
                <option value="Competing Pilot Commitment">Competing Pilot Commitment</option>
                <option value="Other Business Reason">Other Business Reason</option>
              </select>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-end space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsWithdrawModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleWithdrawApplication}
                className="bg-red-700 hover:bg-red-800 text-white font-semibold text-xs"
              >
                Confirm Withdrawal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: RESPOND TO CLARIFICATION MODAL */}
      {isClarificationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-card border border-gov-border bg-white shadow-2xl p-6 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-2 text-purple-900">
                <MessageSquare className="w-4 h-4 text-purple-700" />
                <h3 className="font-extrabold text-sm text-gov-primary">
                  Respond to Evaluation Committee Clarification
                </h3>
              </div>
              <button
                onClick={() => setIsClarificationModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-purple-50/70 border border-purple-200 rounded text-xs space-y-1">
              <span className="font-bold text-purple-950 block text-xs">
                Query from Expert Evaluation Panel (Received 26 Mar 2026):
              </span>
              <p className="text-purple-900 text-xs leading-relaxed">
                &ldquo;Please furnish collocated CPCB calibration regression test certificates for the optical particulate counters proposed for Lucknow municipal wards 14 and 18.&rdquo;
              </p>
            </div>

            <form onSubmit={handleClarificationSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Startup Clarification Response <span className="text-red-500">*</span>
                </label>
                <Textarea
                  required
                  rows={4}
                  value={clarificationResponse}
                  onChange={(e) => setClarificationResponse(e.target.value)}
                  placeholder="Enter detailed clarification response and reference attached laboratory test certificates..."
                  className="text-xs"
                />
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-end space-x-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsClarificationModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs"
                >
                  Submit Clarification Response
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
