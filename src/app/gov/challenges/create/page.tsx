"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth/AuthContext";
import { Stepper } from "@/components/ui/stepper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/ui/modal";
import { ChallengeAiAssistant } from "@/components/challenges/ChallengeAiAssistant";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Save,
  Eye,
  Send,
  Calendar,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Compass,
  Layers,
  Activity,
  FileCheck2,
  Lock,
  Clock,
  ExternalLink,
} from "lucide-react";

interface ChallengeFormData {
  // Step 1: Problem Definition
  title: string;
  department: string;
  category: string;
  problemDescription: string;
  currentSituation: string;
  affectedUsers: string;
  geographicScope: string;
  existingSolution: string;
  whyInsufficient: string;

  // Step 2: Desired Outcome
  targetOutcome: string;
  expectedImprovement: string;
  successDefinition: string;
  baseline: string;
  target: string;

  // Step 3: Requirements
  requiredTechnology: string;
  preferredTechnology: string;
  mandatoryRequirements: string;
  optionalRequirements: string;
  integrationRequirements: string;

  // Step 4: Pilot Design
  durationDays: string;
  location: string;
  budgetInr: string;
  expectedUsers: string;
  milestones: string;
  deliverables: string;
  reportingFrequency: string;

  // Step 5: Eligibility
  startupRegistration: string;
  experience: string;
  certifications: string;
  technicalRequirements: string;
  financialRequirements: string;
  securityRequirements: string;

  // Step 6: Compliance
  dataOwnership: string;
  ipRights: string;
  cybersecurity: string;
  privacy: string;
  legalRequirements: string;
}

const INITIAL_FORM: ChallengeFormData = {
  // Step 1
  title: "Urban Air Quality Hyperlocal Monitoring & Intervention Mesh",
  department: "Department of Urban Development",
  category: "CleanTech & Environmental IoT",
  problemDescription:
    "Extreme localized particulate pollution (PM2.5 and PM10) creates health emergencies in high-density urban wards. Current municipal monitoring relies on only 2 stationary CPCB stations across 110 square kilometers, failing to identify neighborhood hot spots.",
  currentSituation:
    "Municipal dust-suppression misting trucks are dispatched uniformly based on city-wide averages rather than real-time hyper-local air quality hot spots.",
  affectedUsers: "1.2 Million municipal residents, school children, daily commuters, and municipal sanitation staff.",
  geographicScope: "Lucknow Municipal Corporation (Focus on Wards 14, 18, 22, and 29)",
  existingSolution: "Manual water sprinklers and two stationary continuous air monitoring stations (CAAQMS).",
  whyInsufficient:
    "Stationary stations cost >₹1.2 Crore each and cannot capture street-level canyon dispersion or construction plume dynamics.",

  // Step 2
  targetOutcome:
    "Establish a dense network of 40 calibrated optical particle counting nodes providing 15-minute resolution GIS telemetry to direct municipal intervention trucks.",
  expectedImprovement:
    "35% faster municipal response time to localized hazardous AQI spikes and 20% reduction in peak resident exposure.",
  successDefinition:
    "Continuous sensor accuracy maintaining R2 >= 0.92 correlation with collocated CPCB reference BAM-1020 analyzers over 90 days.",
  baseline: "35.0% Geographic Ward Coverage (1 Station per 55 sq km)",
  target: "92.0% Collocated Measurement Correlation & 85% Ward Coverage",

  // Step 3
  requiredTechnology: "Laser scattering particulate counters (PM1, PM2.5, PM10), LoRaWAN or 4G NB-IoT backhaul.",
  preferredTechnology: "Solar/battery dual power backup, on-device machine learning calibration curves.",
  mandatoryRequirements: "RoHS compliance, IP65 weatherproof casing, automated anti-fouling optical purge mechanism.",
  optionalRequirements: "Electrochemical NO2/SO2 multi-gas sensor expansion slot.",
  integrationRequirements: "REST API and Webhook pushing JSON telemetry into Lucknow Integrated Command and Control Center (ICCC).",

  // Step 4
  durationDays: "90",
  location: "Lucknow Wards 14, 18, 22, and 29 (Uttar Pradesh)",
  budgetInr: "2500000", // 25 Lakhs
  expectedUsers: "40 Municipal Engineers, 4 Zonal Sanitary Inspectors, and 1 Public ICCC Dashboard",
  milestones:
    "Milestone 1 (Day 15): Site survey & 10 node installation (20% disbursement);\nMilestone 2 (Day 45): Collocated calibration audit with CPCB (40% disbursement);\nMilestone 3 (Day 90): Final validation report & dataset handover (40% disbursement).",
  deliverables:
    "40 Deployed nodes, real-time GIS shapefile telemetry stream, collocated calibration report, raw CSV datasets, and replication manual.",
  reportingFrequency: "Bi-weekly Telemetry Health Logs & Monthly In-Person Review",

  // Step 5
  startupRegistration: "Registered Indian Private Limited Company with active DPIIT Startup Recognition Certificate.",
  experience: "Minimum 1 year operational experience or at least 1 previous field deployment of hardware IoT or environmental sensors.",
  certifications: "RoHS compliance certificate and CE/ISO 9001 manufacturing quality standards.",
  technicalRequirements: "Founding/core team must include at least 1 lead embedded hardware engineer and 1 atmospheric data scientist.",
  financialRequirements: "Positive net worth or minimum 6 months verifiable operating runway; no bank credit defaults.",
  securityRequirements: "Data localization strictly on Indian servers; CERT-In empaneled security audit certification.",

  // Step 6
  dataOwnership:
    "All raw sensor readings, GIS logs, and environmental telemetry belong exclusively to the Lucknow Municipal Corporation and State of Uttar Pradesh.",
  ipRights:
    "Startup retains all background IP, proprietary firmware, and sensor calibration algorithms. Municipal Corporation receives perpetual non-exclusive license for pilot data use.",
  cybersecurity:
    "TLS 1.3 encryption in transit, AES-256 for data at rest, and cryptographic SHA-256 checksums anchored for every daily evidence batch.",
  privacy:
    "Zero personal identifiable information (PII) or facial data collected. Environmental sensing only.",
  legalRequirements:
    "Execution of standard GovInnovate Tripartite Pilot Covenant, Non-Disclosure Agreement (NDA), and GFR 2017 Rule 149 alignment.",
};

export default function CreateChallengeWizardPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<ChallengeFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastSaved, setLastSaved] = useState<string>("Just now");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("2026-04-01T09:00");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);

  const steps = [
    { id: 0, title: "Problem Definition", description: "Civic context & scope" },
    { id: 1, title: "Desired Outcome", description: "Target KPIs & baselines" },
    { id: 2, title: "Requirements", description: "Technical specifications" },
    { id: 3, title: "Pilot Design", description: "Budget, duration & milestones" },
    { id: 4, title: "Eligibility", description: "DPIIT & technical criteria" },
    { id: 5, title: "Compliance", description: "Data, IP & legal terms" },
    { id: 6, title: "Review & Publish", description: "Summary & publication" },
  ];

  // Autosave simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setLastSaved(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (field: keyof ChallengeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Form Validation per step
  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepIndex === 0) {
      if (!formData.title.trim()) newErrors.title = "Challenge Title is required.";
      if (!formData.department.trim()) newErrors.department = "Department is required.";
      if (!formData.category.trim()) newErrors.category = "Category is required.";
      if (!formData.problemDescription.trim() || formData.problemDescription.length < 30) {
        newErrors.problemDescription = "Problem description must be at least 30 characters.";
      }
      if (!formData.geographicScope.trim()) newErrors.geographicScope = "Geographic scope is required.";
    } else if (stepIndex === 1) {
      if (!formData.targetOutcome.trim()) newErrors.targetOutcome = "Target outcome is required.";
      if (!formData.baseline.trim()) newErrors.baseline = "Baseline measurement is required.";
      if (!formData.target.trim()) newErrors.target = "Target goal is required.";
    } else if (stepIndex === 2) {
      if (!formData.requiredTechnology.trim()) newErrors.requiredTechnology = "Required technology is required.";
      if (!formData.mandatoryRequirements.trim()) newErrors.mandatoryRequirements = "Mandatory requirements are required.";
    } else if (stepIndex === 3) {
      if (!formData.durationDays.trim() || isNaN(Number(formData.durationDays))) {
        newErrors.durationDays = "Valid duration in days is required.";
      }
      if (!formData.budgetInr.trim() || isNaN(Number(formData.budgetInr))) {
        newErrors.budgetInr = "Valid budget in INR is required.";
      }
      if (!formData.location.trim()) newErrors.location = "Location is required.";
      if (!formData.milestones.trim()) newErrors.milestones = "Milestone breakdown is required.";
    } else if (stepIndex === 4) {
      if (!formData.startupRegistration.trim()) newErrors.startupRegistration = "Registration requirement is required.";
      if (!formData.technicalRequirements.trim()) newErrors.technicalRequirements = "Technical requirements are required.";
    } else if (stepIndex === 5) {
      if (!formData.dataOwnership.trim()) newErrors.dataOwnership = "Data ownership terms are required.";
      if (!formData.ipRights.trim()) newErrors.ipRights = "IP rights terms are required.";
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
        description: "Please complete all mandatory fields in this section before proceeding.",
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
      title: "Draft Saved Successfully",
      description: "All challenge formulation fields have been saved to secure government state.",
    });
  };

  const handlePublish = () => {
    // Validate entire form across all steps
    let allValid = true;
    for (let i = 0; i < 6; i++) {
      if (!validateStep(i)) {
        allValid = false;
        setActiveStep(i);
        showToast({
          type: "error",
          title: "Incomplete Challenge",
          description: `Incomplete fields found in Step ${i + 1}: ${steps[i].title}.`,
        });
        return;
      }
    }

    showToast({
      type: "success",
      title: "Challenge Published Officially!",
      description: "Challenge statement is now live in the Public Procurement Catalog for startup discovery.",
    });

    setTimeout(() => {
      router.push("/gov/dashboard?tab=challenges");
    }, 1200);
  };

  const handleScheduleConfirm = () => {
    setIsScheduleOpen(false);
    showToast({
      type: "info",
      title: "Publication Scheduled",
      description: `Challenge scheduled to go live on ${new Date(scheduleDate).toLocaleString()}.`,
    });
    router.push("/gov/dashboard?tab=challenges");
  };

  // AI Assistant Suggestion generator (Section 18 of PROJECT.md)
  const handleAiAssist = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      handleChange(
        "expectedImprovement",
        "Empirical reduction of 40% in micro-dust exposure spikes within 15 minutes of automated localized misting dispatch, collocated R2 >= 0.95 vs CAAQMS."
      );
      handleChange(
        "successDefinition",
        "Continuous 90-day time-series telemetry uptime >= 94% with zero uncalibrated optical drift across 4 Lucknow municipal wards."
      );
      showToast({
        type: "info",
        title: "AI Suggestion Applied",
        description: "AI-generated suggestion applied — verify before publishing.",
      });
    }, 800);
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Wizard Page Header */}
      <div className="border-b border-gov-border pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <Link
              href="/gov/dashboard"
              className="text-xs text-gov-muted hover:text-gov-primary flex items-center"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Return to Government Desk
            </Link>
            <span className="text-slate-300">•</span>
            <Badge variant="default" className="bg-gov-primary font-mono text-xs px-2 py-0.5">
              7-STEP PROCUREMENT WIZARD
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-gov-primary tracking-tight">
            Formulate Government Challenge Statement
          </h1>
          <p className="text-xs text-gov-muted mt-0.5">
            Structured public challenge formulation under General Financial Rules (GFR 2017) Rule 149
          </p>
        </div>

        {/* Action Header Controls */}
        <div className="flex items-center space-x-2.5 shrink-0 text-xs">
          <span className="text-xs text-gov-muted font-mono hidden sm:inline">
            Autosaved at {lastSaved}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleSaveDraft}
            className="text-xs h-8 px-3 border-slate-300 hover:bg-slate-50 font-medium"
          >
            <Save className="w-3.5 h-3.5 mr-1" /> Save Draft
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsPreviewOpen(true)}
            className="text-xs h-8 px-3 border-slate-300 hover:bg-slate-50 font-medium"
          >
            <Eye className="w-3.5 h-3.5 mr-1" /> Preview
          </Button>
          <Button
            size="sm"
            variant={isAssistantOpen ? "default" : "outline"}
            onClick={() => setIsAssistantOpen(!isAssistantOpen)}
            className={`text-xs h-8 px-3 font-medium ${
              isAssistantOpen
                ? "bg-purple-700 hover:bg-purple-800 text-white"
                : "border-purple-300 text-purple-900 bg-purple-50 hover:bg-purple-100"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            {isAssistantOpen ? "Hide AI Assistant" : "AI Assistant"}
          </Button>
        </div>
      </div>

      {/* 7-Step Progress Stepper */}
      <div className="bg-white border border-gov-border rounded-card px-6 py-2 shadow-2xs">
        <Stepper
          steps={steps}
          activeStep={activeStep}
          onStepClick={(idx) => {
            // Allow navigating backwards or forwards if valid
            if (idx <= activeStep || validateStep(activeStep)) {
              setActiveStep(idx);
            }
          }}
        />
      </div>

      {/* Two-Column Grid: Form + Contextual AI Assistant */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className={isAssistantOpen ? "xl:col-span-8 space-y-6" : "xl:col-span-12 space-y-6"}>
          {/* Main Wizard Form Card */}
          <div className="bg-white border border-gov-border rounded-card p-6 shadow-sm space-y-6">
            {/* Step Indicator Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono text-gov-accent font-bold uppercase tracking-wider block">
                  STEP {activeStep + 1} OF 7: {steps[activeStep].title.toUpperCase()}
                </span>
                <h2 className="text-lg font-bold text-gov-primary mt-0.5">
                  {steps[activeStep].title}
                </h2>
              </div>

              {/* AI Assistance Trigger */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAssistantOpen(true)}
                className="text-xs h-8 px-3 border-purple-200 text-purple-900 bg-purple-50 hover:bg-purple-100 font-medium"
                title="Suggest measurable outcomes, KPIs, and missing criteria"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
                AI Assistant
              </Button>
            </div>

            {/* STEP 1: PROBLEM DEFINITION */}
            {activeStep === 0 && (
              <div className="space-y-4 text-xs animate-in fade-in duration-150">
                {/* Contextual Inline AI Assistant Banner */}
                <div className="bg-purple-50/70 border border-purple-200 rounded-md p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs font-bold text-purple-950">AI Problem Structuring Assistant</p>
                        <span className="text-xs font-mono text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded font-medium">
                          Sec. 18 Advisory
                        </span>
                      </div>
                      <p className="text-xs text-purple-900 mt-0.5 leading-relaxed">
                        Have an unstructured need like <span className="font-semibold">&ldquo;We need better monitoring of pollution across the city&rdquo;</span>? The AI assistant structures scope, root cause, and affected civic stakeholders.
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAssistantOpen(true)}
                    className="text-xs h-8 shrink-0 border-purple-300 text-purple-900 bg-white hover:bg-purple-100 font-semibold"
                  >
                    <Sparkles className="w-3 h-3 mr-1 text-purple-600" /> Structure in Panel
                  </Button>
                </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="font-semibold text-slate-800">
                  Challenge Title <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="e.g. Urban Air Quality Hyperlocal Monitoring & Intervention Mesh"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="text-xs text-red-600 font-medium">{errors.title}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  className="w-full text-xs border border-gov-border rounded-control p-2.5 bg-white text-slate-800"
                >
                  <option value="Department of Urban Development">Department of Urban Development</option>
                  <option value="Directorate of Urban Transport">Directorate of Urban Transport</option>
                  <option value="Noida Solid Waste SPV">Noida Solid Waste SPV</option>
                  <option value="State Water & Sanitation Mission">State Water & Sanitation Mission</option>
                  <option value="Public Health Directorate">Public Health Directorate</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Innovation Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full text-xs border border-gov-border rounded-control p-2.5 bg-white text-slate-800"
                >
                  <option value="CleanTech & Environmental IoT">CleanTech & Environmental IoT</option>
                  <option value="Smart Mobility & Transit">Smart Mobility & Transit</option>
                  <option value="Circular Economy & Waste Tech">Circular Economy & Waste Tech</option>
                  <option value="Water Resources & Deep Sensing">Water Resources & Deep Sensing</option>
                  <option value="Public Safety & Disaster Resilience">Public Safety & Disaster Resilience</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Geographic Scope & District <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.geographicScope}
                  onChange={(e) => handleChange("geographicScope", e.target.value)}
                  placeholder="e.g. Lucknow Municipal Corporation (Wards 14, 18, 22, 29)"
                  className={errors.geographicScope ? "border-red-500" : ""}
                />
                {errors.geographicScope && <p className="text-xs text-red-600">{errors.geographicScope}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">
                Problem Description (The Core Civic Need) <span className="text-red-500">*</span>
              </label>
              <Textarea
                rows={3}
                value={formData.problemDescription}
                onChange={(e) => handleChange("problemDescription", e.target.value)}
                placeholder="Explain the technical and administrative bottleneck in detail..."
                className={errors.problemDescription ? "border-red-500" : ""}
              />
              {errors.problemDescription && <p className="text-xs text-red-600">{errors.problemDescription}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Current Situation on the Ground</label>
                <Textarea
                  rows={2}
                  value={formData.currentSituation}
                  onChange={(e) => handleChange("currentSituation", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Affected Public Stakeholders / Citizens</label>
                <Textarea
                  rows={2}
                  value={formData.affectedUsers}
                  onChange={(e) => handleChange("affectedUsers", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Existing Solution / Traditional Method</label>
                <Input
                  value={formData.existingSolution}
                  onChange={(e) => handleChange("existingSolution", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Why Existing Solution Is Insufficient</label>
                <Input
                  value={formData.whyInsufficient}
                  onChange={(e) => handleChange("whyInsufficient", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: DESIRED OUTCOME */}
        {activeStep === 1 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            {/* Contextual Inline AI Assistant Banner for Step 2 */}
            <div className="bg-purple-50/70 border border-purple-200 rounded-md p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs font-bold text-purple-950">AI Measurable Outcomes & KPIs</p>
                    <span className="text-xs font-mono text-purple-700 bg-purple-100 px-1 rounded">
                      Sec. 18 Advisory
                    </span>
                  </div>
                  <p className="text-xs text-purple-900 mt-0.5">
                    Suggests quantifiable baselines (<span className="font-semibold">e.g. 35% spatial coverage</span>) and targets (<span className="font-semibold">85% municipal mesh</span>) with statutory CAAQMS correlation gates.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAssistantOpen(true)}
                className="text-xs h-8 shrink-0 border-purple-300 text-purple-900 bg-white hover:bg-purple-100 font-semibold"
              >
                <Sparkles className="w-3 h-3 mr-1 text-purple-600" /> Suggest KPIs
              </Button>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">
                Target Civic Outcome <span className="text-red-500">*</span>
              </label>
              <Textarea
                rows={2}
                value={formData.targetOutcome}
                onChange={(e) => handleChange("targetOutcome", e.target.value)}
                placeholder="State the measurable transformation expected from this pilot..."
              />
              {errors.targetOutcome && <p className="text-xs text-red-600">{errors.targetOutcome}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-800">Expected Improvement & Efficiency Gain</label>
                <span className="text-xs font-mono text-purple-700 bg-purple-50 px-1 rounded">
                  AI-assisted suggestion available
                </span>
              </div>
              <Input
                value={formData.expectedImprovement}
                onChange={(e) => handleChange("expectedImprovement", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">Success Definition (Audited Acceptance Gate)</label>
              <Textarea
                rows={2}
                value={formData.successDefinition}
                onChange={(e) => handleChange("successDefinition", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Baseline (Current State Metric) <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.baseline}
                  onChange={(e) => handleChange("baseline", e.target.value)}
                  placeholder="e.g. 35.0% Geographic Coverage"
                  className={errors.baseline ? "border-red-500" : ""}
                />
                {errors.baseline && <p className="text-xs text-red-600">{errors.baseline}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Target (Expected Pilot Result) <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.target}
                  onChange={(e) => handleChange("target", e.target.value)}
                  placeholder="e.g. 92.0% Collocated Correlation"
                  className={errors.target ? "border-red-500" : ""}
                />
                {errors.target && <p className="text-xs text-red-600">{errors.target}</p>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: REQUIREMENTS */}
        {activeStep === 2 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Required Technology Stack <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.requiredTechnology}
                  onChange={(e) => handleChange("requiredTechnology", e.target.value)}
                  placeholder="e.g. Laser scattering particle sensors, LoRaWAN / 4G"
                />
                {errors.requiredTechnology && <p className="text-xs text-red-600">{errors.requiredTechnology}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Preferred Technology / Innovation Edge</label>
                <Input
                  value={formData.preferredTechnology}
                  onChange={(e) => handleChange("preferredTechnology", e.target.value)}
                  placeholder="e.g. Solar dual power backup, edge machine learning"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">
                Mandatory Operational Requirements <span className="text-red-500">*</span>
              </label>
              <Textarea
                rows={2}
                value={formData.mandatoryRequirements}
                onChange={(e) => handleChange("mandatoryRequirements", e.target.value)}
                placeholder="Hardware certifications, IP65 enclosure, uptime standards..."
              />
              {errors.mandatoryRequirements && <p className="text-xs text-red-600">{errors.mandatoryRequirements}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Optional / Desirable Enhancements</label>
                <Input
                  value={formData.optionalRequirements}
                  onChange={(e) => handleChange("optionalRequirements", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Municipal API / System Integration Requirements</label>
                <Input
                  value={formData.integrationRequirements}
                  onChange={(e) => handleChange("integrationRequirements", e.target.value)}
                  placeholder="e.g. REST API / Webhook to Smart City ICCC"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PILOT DESIGN */}
        {activeStep === 3 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Pilot Duration (Days) <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.durationDays}
                  onChange={(e) => handleChange("durationDays", e.target.value)}
                  placeholder="60, 90, or 120"
                />
                {errors.durationDays && <p className="text-xs text-red-600">{errors.durationDays}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Total Grant / Escrow Budget (INR) <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.budgetInr}
                  onChange={(e) => handleChange("budgetInr", e.target.value)}
                  placeholder="e.g. 2500000"
                />
                {errors.budgetInr && <p className="text-xs text-red-600">{errors.budgetInr}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Reporting Frequency
                </label>
                <select
                  value={formData.reportingFrequency}
                  onChange={(e) => handleChange("reportingFrequency", e.target.value)}
                  className="w-full text-xs border border-gov-border rounded-control p-2.5 bg-white text-slate-800"
                >
                  <option value="Weekly Telemetry Logs">Weekly Telemetry Logs</option>
                  <option value="Bi-weekly Telemetry Health Logs & Monthly Review">Bi-weekly Logs & Monthly Review</option>
                  <option value="Monthly Deliverable Review">Monthly Deliverable Review</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Testbed Deployment Location <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="e.g. Lucknow Wards 14, 18, 22, 29"
                />
                {errors.location && <p className="text-xs text-red-600">{errors.location}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Expected Municipal Users & Operators</label>
                <Input
                  value={formData.expectedUsers}
                  onChange={(e) => handleChange("expectedUsers", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">
                Milestones & Financial Disbursement Tranches <span className="text-red-500">*</span>
              </label>
              <Textarea
                rows={3}
                value={formData.milestones}
                onChange={(e) => handleChange("milestones", e.target.value)}
                placeholder="Break down each milestone deliverable and funding release percentage..."
              />
              {errors.milestones && <p className="text-xs text-red-600">{errors.milestones}</p>}
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">Verifiable Deliverables Required</label>
              <Textarea
                rows={2}
                value={formData.deliverables}
                onChange={(e) => handleChange("deliverables", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 5: ELIGIBILITY */}
        {activeStep === 4 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Startup Registration Status <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.startupRegistration}
                  onChange={(e) => handleChange("startupRegistration", e.target.value)}
                  placeholder="DPIIT certificate required..."
                />
                {errors.startupRegistration && <p className="text-xs text-red-600">{errors.startupRegistration}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Prior Deployment Experience</label>
                <Input
                  value={formData.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Required Hardware / Quality Certifications</label>
                <Input
                  value={formData.certifications}
                  onChange={(e) => handleChange("certifications", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Technical Team Qualifications <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.technicalRequirements}
                  onChange={(e) => handleChange("technicalRequirements", e.target.value)}
                />
                {errors.technicalRequirements && <p className="text-xs text-red-600">{errors.technicalRequirements}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Financial Prudence & Solvency Terms</label>
                <Input
                  value={formData.financialRequirements}
                  onChange={(e) => handleChange("financialRequirements", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Security Clearance & Data Residency</label>
                <Input
                  value={formData.securityRequirements}
                  onChange={(e) => handleChange("securityRequirements", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: COMPLIANCE */}
        {activeStep === 5 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Data Ownership & Open Data Protocol <span className="text-red-500">*</span>
                </label>
                <Textarea
                  rows={2}
                  value={formData.dataOwnership}
                  onChange={(e) => handleChange("dataOwnership", e.target.value)}
                />
                {errors.dataOwnership && <p className="text-xs text-red-600">{errors.dataOwnership}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Intellectual Property (IP) Rights Protection <span className="text-red-500">*</span>
                </label>
                <Textarea
                  rows={2}
                  value={formData.ipRights}
                  onChange={(e) => handleChange("ipRights", e.target.value)}
                />
                {errors.ipRights && <p className="text-xs text-red-600">{errors.ipRights}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">Cybersecurity Architecture & Encryption</label>
              <Input
                value={formData.cybersecurity}
                onChange={(e) => handleChange("cybersecurity", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Privacy & Citizen Protection</label>
                <Input
                  value={formData.privacy}
                  onChange={(e) => handleChange("privacy", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Statutory Legal Governance & GFR 149</label>
                <Input
                  value={formData.legalRequirements}
                  onChange={(e) => handleChange("legalRequirements", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: REVIEW & PUBLISH */}
        {activeStep === 6 && (
          <div className="space-y-6 text-xs animate-in fade-in duration-150">
            {/* Review Status Banner */}
            <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-card p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm">
                    Challenge Specification Verified & Ready for Publication
                  </h4>
                  <p className="text-xs text-emerald-800">
                    All 6 statutory sections have passed automated schema validation and GFR 2017 checks.
                  </p>
                </div>
              </div>
              <Badge variant="success" className="font-mono text-xs">
                VALIDATION 100%
              </Badge>
            </div>

            {/* Structured Summary Blocks */}
            <div className="space-y-4">
              {/* Section 1 & 2 Summary */}
              <div className="border border-slate-200 rounded-control p-4 bg-slate-50/60 space-y-2">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <h4 className="font-bold text-gov-primary uppercase text-xs tracking-wide">
                    1. Problem & Desired Outcome
                  </h4>
                  <button onClick={() => setActiveStep(0)} className="text-gov-accent hover:underline text-xs">
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-gov-muted block font-mono">CHALLENGE TITLE</span>
                    <span className="font-bold text-slate-900">{formData.title}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gov-muted block font-mono">DEPARTMENT & SCOPE</span>
                    <span className="font-medium text-slate-800">{formData.department} • {formData.geographicScope}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gov-muted block font-mono">BASELINE CONDITION</span>
                    <span className="text-slate-700">{formData.baseline}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gov-muted block font-mono">TARGET OUTCOME</span>
                    <span className="text-emerald-800 font-bold">{formData.target}</span>
                  </div>
                </div>
              </div>

              {/* Section 3 & 4 Summary */}
              <div className="border border-slate-200 rounded-control p-4 bg-slate-50/60 space-y-2">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <h4 className="font-bold text-gov-primary uppercase text-xs tracking-wide">
                    2. Pilot Implementation & Milestones
                  </h4>
                  <button onClick={() => setActiveStep(3)} className="text-gov-accent hover:underline text-xs">
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-xs text-gov-muted block font-mono">PILOT DURATION</span>
                    <span className="font-bold text-slate-900">{formData.durationDays} Days</span>
                  </div>
                  <div>
                    <span className="text-xs text-gov-muted block font-mono">ESCROW BUDGET</span>
                    <span className="font-bold text-emerald-700 font-mono">₹{Number(formData.budgetInr).toLocaleString("en-IN")}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gov-muted block font-mono">LOCATION</span>
                    <span className="text-slate-800">{formData.location}</span>
                  </div>
                </div>
                <div className="pt-1">
                  <span className="text-xs text-gov-muted block font-mono">DISBURSEMENT MILESTONES</span>
                  <p className="text-slate-700 whitespace-pre-line text-xs bg-white p-2 rounded border border-slate-200 mt-1">
                    {formData.milestones}
                  </p>
                </div>
              </div>

              {/* Section 5 & 6 Summary */}
              <div className="border border-slate-200 rounded-control p-4 bg-slate-50/60 space-y-2">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <h4 className="font-bold text-gov-primary uppercase text-xs tracking-wide">
                    3. Eligibility & Statutory Governance
                  </h4>
                  <button onClick={() => setActiveStep(4)} className="text-gov-accent hover:underline text-xs">
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-xs text-gov-muted block font-mono">DPIIT ELIGIBILITY</span>
                    <span className="text-slate-800">{formData.startupRegistration}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gov-muted block font-mono">DATA & IP FRAMEWORK</span>
                    <span className="text-slate-800">Raw Data: Municipal Corp • IP: Startup Retained</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Publishing Action Matrix */}
            <div className="border-t border-slate-200 pt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-slate-600">
                <Lock className="w-4 h-4 text-gov-primary shrink-0" />
                <span className="text-xs">
                  Official Officer Clearance: <strong>{currentUser?.firstName} {currentUser?.lastName}</strong> ({currentUser?.designation})
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  variant="outline"
                  onClick={() => setIsScheduleOpen(true)}
                  className="text-xs h-9 px-3.5 border-slate-300 font-medium hover:bg-slate-50"
                >
                  <Calendar className="w-3.5 h-3.5 mr-1.5" /> Schedule Publication
                </Button>

                <Button
                  variant="default"
                  onClick={handlePublish}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs h-9 px-4 font-semibold shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" /> Publish Challenge Immediately
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer Buttons */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={handleBack}
            disabled={activeStep === 0}
            className="text-xs h-9 px-4 border-slate-300 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Previous Step
          </Button>

          <div className="flex items-center space-x-2">
            {activeStep < steps.length - 1 ? (
              <Button
                size="sm"
                variant="default"
                onClick={handleNext}
                className="bg-gov-primary hover:bg-gov-primary-hover text-white text-xs h-9 px-4 font-semibold"
              >
                Next: {steps[activeStep + 1].title} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>

    {/* Contextual Side Panel: Challenge AI Assistant */}
    {isAssistantOpen && (
      <div className="xl:col-span-4 xl:sticky xl:top-6">
        <ChallengeAiAssistant
          activeStep={activeStep}
          formData={formData}
          onApplyField={handleChange}
          onApplyBatch={(updates) => {
            setFormData((prev) => ({ ...prev, ...updates }));
          }}
          onClose={() => setIsAssistantOpen(false)}
        />
      </div>
    )}
  </div>

      {/* MODAL 1: Public Startup Challenge Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-3xl rounded-card border border-gov-border bg-white shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="font-mono text-xs text-gov-accent px-2 py-0.5">
                  PUBLIC PREVIEW
                </Badge>
                <span className="text-xs text-gov-muted font-medium">How startups will view this challenge</span>
              </div>
              <button onClick={() => setIsPreviewOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">{formData.department}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-gov-muted">{formData.geographicScope}</span>
              </div>

              <h2 className="text-xl font-bold text-gov-primary leading-tight">
                {formData.title}
              </h2>

              <p className="text-xs text-gov-muted leading-relaxed">
                {formData.problemDescription}
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-control p-3.5 text-xs space-y-1">
                <span className="text-xs font-mono text-gov-muted uppercase font-bold block">
                  PRIMARY TARGET BENCHMARK
                </span>
                <span className="font-semibold text-emerald-800">{formData.target}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-3 text-xs">
                <div>
                  <span className="text-gov-muted block text-xs font-medium">PILOT BUDGET</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">₹{Number(formData.budgetInr).toLocaleString("en-IN")}</span>
                </div>
                <div>
                  <span className="text-gov-muted block text-xs font-medium">TESTING PERIOD</span>
                  <span className="font-medium text-slate-800 text-sm">{formData.durationDays} Days</span>
                </div>
                <div>
                  <span className="text-gov-muted block text-xs font-medium">ELIGIBILITY</span>
                  <span className="font-medium text-slate-800 text-sm truncate block">DPIIT Recognized</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-end">
              <Button size="sm" variant="default" onClick={() => setIsPreviewOpen(false)} className="text-xs h-8 px-4">
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}


      {/* MODAL 2: Schedule Publication Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-card border border-gov-border bg-white shadow-2xl p-6 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gov-primary" />
                <h3 className="font-bold text-sm text-gov-primary">Schedule Official Publication</h3>
              </div>
              <button onClick={() => setIsScheduleOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <p className="text-xs text-gov-muted leading-relaxed">
              Select the date and time when this challenge will be automatically released to the Public Procurement Catalog and notified to DPIIT startups.
            </p>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-800">Publication Go-Live Timestamp</label>
              <Input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-end space-x-2">
              <Button size="sm" variant="outline" onClick={() => setIsScheduleOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button size="sm" variant="default" onClick={handleScheduleConfirm} className="bg-gov-primary text-xs">
                Confirm Schedule
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
