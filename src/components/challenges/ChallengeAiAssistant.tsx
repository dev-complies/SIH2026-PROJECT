"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Target,
  AlertCircle,
  Copy,
  ChevronRight,
  RotateCcw,
  Check,
  Sliders,
  Send,
  X,
  Layers,
  ArrowRight,
  Info,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

export interface ChallengeFormData {
  title: string;
  department: string;
  category: string;
  problemDescription: string;
  currentSituation: string;
  affectedUsers: string;
  geographicScope: string;
  existingSolution: string;
  whyInsufficient: string;
  targetOutcome: string;
  expectedImprovement: string;
  successDefinition: string;
  baseline: string;
  target: string;
  requiredTechnology: string;
  preferredTechnology: string;
  mandatoryRequirements: string;
  optionalRequirements: string;
  integrationRequirements: string;
  durationDays: string;
  location: string;
  budgetInr: string;
  expectedUsers: string;
  milestones: string;
  deliverables: string;
  reportingFrequency: string;
  startupRegistration: string;
  experience: string;
  certifications: string;
  technicalRequirements: string;
  financialRequirements: string;
  securityRequirements: string;
  dataOwnership: string;
  ipRights: string;
  cybersecurity: string;
  privacy: string;
  legalRequirements: string;
}

interface ChallengeAiAssistantProps {
  activeStep: number;
  formData: ChallengeFormData;
  onApplyField: (field: keyof ChallengeFormData, value: string) => void;
  onApplyBatch: (updates: Partial<ChallengeFormData>) => void;
  onClose?: () => void;
}

export type AssistantTab = "structure" | "missing" | "summary" | "risks";

export function ChallengeAiAssistant({
  activeStep,
  formData,
  onApplyField,
  onApplyBatch,
  onClose,
}: ChallengeAiAssistantProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<AssistantTab>(
    activeStep === 0 ? "structure" : activeStep === 1 ? "structure" : activeStep === 6 ? "summary" : "missing"
  );
  
  // Custom prompt input
  const [customPrompt, setCustomPrompt] = useState("We need better monitoring of pollution across the city.");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Analysis result state
  const [structuredResult, setStructuredResult] = useState<{
    problem: string;
    kpi: string;
    baseline: string;
    target: string;
    risk: string;
    mitigation: string;
    measurableOutcome: string;
    scope: string;
  }>({
    problem: "Limited spatial coverage of existing monitoring infrastructure.",
    kpi: "Monitoring coverage",
    baseline: "35%",
    target: "85%",
    risk: "Sensor reliability",
    mitigation: "Automated anti-fouling optical purge and bi-weekly collocated reference station audits.",
    measurableOutcome: "High-density 15-minute GIS telemetry enabling rapid intervention dispatch.",
    scope: "Urban municipal wards with historical high particulate exposure.",
  });

  // Example inputs
  const presetPrompts = [
    {
      label: "Pollution Monitoring",
      prompt: "We need better monitoring of pollution across the city.",
      problem: "Limited spatial coverage of existing monitoring infrastructure.",
      kpi: "Monitoring coverage",
      baseline: "35%",
      target: "85%",
      risk: "Sensor reliability",
      mitigation: "Automated anti-fouling purge mechanism and bi-weekly collocated BAM-1020 calibration verification.",
      measurableOutcome: "Real-time 15-minute GIS particulate telemetry to direct municipal intervention trucks.",
      scope: "Urban municipal wards with historical air quality hot spots.",
    },
    {
      label: "Pothole Detection",
      prompt: "Potholes on major arterial roads cause vehicle damage and monsoon accidents.",
      problem: "Manual road inspection cycles are delayed and fail to detect subsurface degradation before severe road collapse.",
      kpi: "Pothole detection and repair turnaround time",
      baseline: "14 days average turnaround",
      target: "48 hours automated dispatch",
      risk: "Camera occlusion during torrential rain",
      mitigation: "Dual sensor fusion with smartphone accelerometers and computer vision edge processing.",
      measurableOutcome: "90% automated spatial mapping of road surface defects within 6 hours of occurrence.",
      scope: "Municipal arterial roads and ring road corridors (120 km).",
    },
    {
      label: "Water Leakage",
      prompt: "High non-revenue water loss and pipeline leakage across municipal distribution.",
      problem: "Undetected subterranean pipeline fractures cause unaccounted water loss and low terminal water pressure.",
      kpi: "Non-revenue water (NRW) loss rate",
      baseline: "42% distribution loss",
      target: "18% distribution loss",
      risk: "Acoustic sensor interference from urban traffic vibrations",
      mitigation: "Nighttime acoustic listening correlation with pressure transient transient logging.",
      measurableOutcome: "Acoustic leak pinpointing accuracy within ±2 meters across 40 km feeder mains.",
      scope: "Municipal water distribution zone East & Central sectors.",
    },
  ];

  const handleSelectPreset = (preset: typeof presetPrompts[0]) => {
    setCustomPrompt(preset.prompt);
    setIsAnalyzing(true);
    setTimeout(() => {
      setStructuredResult({
        problem: preset.problem,
        kpi: preset.kpi,
        baseline: preset.baseline,
        target: preset.target,
        risk: preset.risk,
        mitigation: preset.mitigation,
        measurableOutcome: preset.measurableOutcome,
        scope: preset.scope,
      });
      setIsAnalyzing(false);
      showToast({
        type: "info",
        title: "AI Analysis Complete",
        description: "AI-generated suggestion — verify before publishing.",
      });
    }, 400);
  };

  const handleAnalyzeCustom = () => {
    if (!customPrompt.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      // Dynamic generation based on prompt keywords
      const promptLower = customPrompt.toLowerCase();
      let res = {
        problem: `Structural deficiency in public service delivery: "${customPrompt.trim()}".`,
        kpi: "System efficiency and citizen response latency",
        baseline: "30% automated resolution",
        target: "80% automated resolution",
        risk: "Hardware telemetry reliability and environmental interference",
        mitigation: "Fail-safe redundancy with edge caching and scheduled physical validation.",
        measurableOutcome: "Quantified 50% improvement in service reliability over 90 days.",
        scope: "Key high-density municipal pilot wards.",
      };

      if (promptLower.includes("pollution") || promptLower.includes("air") || promptLower.includes("smoke")) {
        res = {
          problem: "Limited spatial coverage of existing monitoring infrastructure.",
          kpi: "Monitoring coverage",
          baseline: "35%",
          target: "85%",
          risk: "Sensor reliability",
          mitigation: "Automated anti-fouling optical purge and bi-weekly collocated BAM-1020 calibration verification.",
          measurableOutcome: "Real-time 15-minute GIS particulate telemetry to direct municipal intervention trucks.",
          scope: "Urban municipal wards with historical air quality hot spots.",
        };
      } else if (promptLower.includes("traffic") || promptLower.includes("congestion") || promptLower.includes("signal")) {
        res = {
          problem: "Static fixed-cycle traffic signal controllers unable to adapt to dynamic junction queuing.",
          kpi: "Peak hour corridor delay reduction",
          baseline: "18.5 minutes average intersection delay",
          target: "11.0 minutes average intersection delay",
          risk: "Edge compute camera occlusion during severe weather",
          mitigation: "Multi-modal fallback to induction loop data and traffic police manual overrides.",
          measurableOutcome: "35% reduction in vehicular idling emissions and travel time along pilot corridor.",
          scope: "6 Key arterial intersections along Civil Lines corridor.",
        };
      }

      setStructuredResult(res);
      setIsAnalyzing(false);
      showToast({
        type: "info",
        title: "AI Formulation Generated",
        description: "AI-generated suggestion — verify before publishing.",
      });
    }, 600);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    showToast({
      type: "success",
      title: "Copied to Clipboard",
      description: "AI-generated suggestion copied.",
    });
  };

  // Missing Information Auditor
  const auditItems = [
    {
      step: 1,
      title: "Problem Statement Depth",
      status: formData.problemDescription.length > 50 ? "pass" : "warning",
      message:
        formData.problemDescription.length > 50
          ? "Civic context is sufficiently described."
          : "Problem description is under 50 characters; elaborate on current limitations.",
      action: "Enhance Description",
      onFix: () =>
        onApplyField(
          "problemDescription",
          `${formData.problemDescription} Municipal operations currently lack real-time telemetry, resulting in reactive rather than preventive civic interventions.`
        ),
    },
    {
      step: 2,
      title: "Measurable Target Outcome",
      status: formData.targetOutcome.length > 20 && formData.target.length > 0 ? "pass" : "warning",
      message:
        formData.target.length > 0
          ? `Target metric clearly defined (${formData.target}).`
          : "Target is missing. Needs explicit percentage or turnaround figure.",
      action: "Add 85% Target",
      onFix: () => onApplyField("target", "85% Ward Coverage & R2 >= 0.92 correlation"),
    },
    {
      step: 2,
      title: "Baseline Metric",
      status: formData.baseline.length > 0 ? "pass" : "warning",
      message:
        formData.baseline.length > 0
          ? `Baseline captured (${formData.baseline}).`
          : "Baseline is empty. Every pilot requires a reference starting point.",
      action: "Set Baseline 35%",
      onFix: () => onApplyField("baseline", "35% Municipal Spatial Coverage"),
    },
    {
      step: 3,
      title: "Mandatory Compliance Spec",
      status: formData.mandatoryRequirements.length > 20 ? "pass" : "warning",
      message:
        formData.mandatoryRequirements.length > 20
          ? "Mandatory specifications documented."
          : "Add explicit hardware durability (e.g. IP65) or software standard.",
      action: "Add IP65 & RoHS",
      onFix: () =>
        onApplyField(
          "mandatoryRequirements",
          `${formData.mandatoryRequirements} IP65 Weatherproof rating and RoHS compliance.`
        ),
    },
    {
      step: 6,
      title: "Sovereign Data Localization",
      status: formData.dataOwnership.toLowerCase().includes("exclusive") || formData.dataOwnership.toLowerCase().includes("state") ? "pass" : "warning",
      message: "Data governance must state that all pilot sensor telemetry remains state property.",
      action: "Enforce State Ownership",
      onFix: () =>
        onApplyField(
          "dataOwnership",
          "All raw sensor readings, GIS logs, and environmental telemetry belong exclusively to the State and Municipal Corporation."
        ),
    },
  ];

  return (
    <div className="bg-white border border-gov-border rounded-card shadow-sm flex flex-col h-full max-h-[850px] overflow-hidden text-left">
      {/* Assistant Header */}
      <div className="p-4 bg-slate-50 border-b border-gov-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-md bg-purple-100 border border-purple-200 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-purple-700" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-extrabold text-gov-primary tracking-tight">
                AI Challenge Assistant
              </h3>
              <Badge variant="outline" className="text-[9px] py-0 px-1 border-purple-300 text-purple-800 bg-purple-50">
                GFR Advisory
              </Badge>
            </div>
            <p className="text-[10px] text-gov-muted">
              Contextual problem formulation & compliance copilot
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200 transition-colors"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Strict Statutory Guardrails Notice (PROJECT.md Section 18 Compliance) */}
      <div className="px-3.5 py-2.5 bg-amber-50/80 border-b border-amber-200/80 text-[10px] text-amber-950 flex items-start space-x-2">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-amber-900 leading-tight">
            Statutory Guardrails Active (Sec. 18):
          </p>
          <p className="text-amber-800 text-[9.5px] leading-relaxed">
            The AI assistant is strictly advisory and will <span className="font-bold underline">never</span> select a startup, score a proposal, approve procurement, or make a scale-up decision.
          </p>
        </div>
      </div>

      {/* Assistant Navigation Tabs */}
      <div className="grid grid-cols-4 border-b border-gov-border bg-slate-100/70 p-1 text-[11px] font-medium">
        <button
          onClick={() => setActiveTab("structure")}
          className={`py-1.5 px-1 rounded text-center transition-all ${
            activeTab === "structure"
              ? "bg-white text-gov-primary font-bold shadow-2xs border border-slate-200"
              : "text-gov-muted hover:text-slate-900"
          }`}
        >
          Structure
        </button>
        <button
          onClick={() => setActiveTab("missing")}
          className={`py-1.5 px-1 rounded text-center transition-all ${
            activeTab === "missing"
              ? "bg-white text-gov-primary font-bold shadow-2xs border border-slate-200"
              : "text-gov-muted hover:text-slate-900"
          }`}
        >
          Missing Info
        </button>
        <button
          onClick={() => setActiveTab("risks")}
          className={`py-1.5 px-1 rounded text-center transition-all ${
            activeTab === "risks"
              ? "bg-white text-gov-primary font-bold shadow-2xs border border-slate-200"
              : "text-gov-muted hover:text-slate-900"
          }`}
        >
          Risks & KPIs
        </button>
        <button
          onClick={() => setActiveTab("summary")}
          className={`py-1.5 px-1 rounded text-center transition-all ${
            activeTab === "summary"
              ? "bg-white text-gov-primary font-bold shadow-2xs border border-slate-200"
              : "text-gov-muted hover:text-slate-900"
          }`}
        >
          Summary
        </button>
      </div>

      {/* Tab Contents (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* TAB 1: STRUCTURE THE PROBLEM & OUTCOMES */}
        {activeTab === "structure" && (
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-800 block mb-1">
                Enter Civic Need or Rough Problem
              </label>
              <div className="relative">
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. We need better monitoring of pollution across the city."
                  className="text-xs min-h-[64px] pb-8 text-slate-800"
                />
                <Button
                  size="sm"
                  onClick={handleAnalyzeCustom}
                  disabled={isAnalyzing || !customPrompt.trim()}
                  className="absolute bottom-2 right-2 text-[10px] h-6 px-2.5 bg-gov-primary hover:bg-gov-primary/90 text-white"
                >
                  <Sparkles className="w-2.5 h-2.5 mr-1" />
                  {isAnalyzing ? "Analyzing..." : "Structure Problem"}
                </Button>
              </div>

              {/* Preset Quick-Pills */}
              <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                <span className="text-[9.5px] text-gov-muted font-medium">Quick examples:</span>
                {presetPrompts.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handleSelectPreset(preset)}
                    className="text-[9.5px] bg-slate-100 hover:bg-slate-200 border border-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-mono transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Statutory Disclaimer Banner on Output */}
            <div className="bg-purple-50/70 border border-purple-200/80 rounded-md p-2 flex items-center justify-between text-[10.5px] text-purple-900 font-medium">
              <span className="flex items-center">
                <Sparkles className="w-3 h-3 text-purple-600 mr-1.5 shrink-0" />
                AI-generated suggestion — verify before publishing.
              </span>
              <Badge variant="outline" className="text-[8.5px] bg-white border-purple-200 text-purple-700 py-0">
                Verified
              </Badge>
            </div>

            {/* Structured Output Cards */}
            <div className="space-y-3">
              {/* Problem */}
              <div className="bg-slate-50 border border-gov-border rounded-md p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gov-accent font-bold uppercase tracking-wider">
                    STRUCTURED PROBLEM
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleCopy(structuredResult.problem, "problem")}
                      className="text-slate-400 hover:text-slate-600 p-1"
                      title="Copy"
                    >
                      {copiedKey === "problem" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        onApplyField("problemDescription", structuredResult.problem);
                        showToast({
                          type: "success",
                          title: "Applied to Problem Description",
                          description: "AI-generated suggestion — verify before publishing.",
                        });
                      }}
                      className="text-[10px] h-5 px-1.5 border-slate-300"
                    >
                      Apply to Step 1
                    </Button>
                  </div>
                </div>
                <p className="text-xs font-semibold text-slate-900">
                  {structuredResult.problem}
                </p>
              </div>

              {/* Potential KPI */}
              <div className="bg-slate-50 border border-gov-border rounded-md p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-blue-700 font-bold uppercase tracking-wider">
                    POTENTIAL KPI
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleCopy(structuredResult.kpi, "kpi")}
                      className="text-slate-400 hover:text-slate-600 p-1"
                      title="Copy"
                    >
                      {copiedKey === "kpi" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        onApplyField("targetOutcome", `Measure and scale ${structuredResult.kpi} across designated municipal wards.`);
                        showToast({
                          type: "success",
                          title: "Applied to Target Outcome",
                          description: "AI-generated suggestion — verify before publishing.",
                        });
                      }}
                      className="text-[10px] h-5 px-1.5 border-slate-300"
                    >
                      Apply to Step 2
                    </Button>
                  </div>
                </div>
                <p className="text-xs font-semibold text-slate-900">
                  {structuredResult.kpi}
                </p>
              </div>

              {/* Baseline & Potential Target */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 border border-gov-border rounded-md p-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-mono text-slate-500 font-bold uppercase">
                      BASELINE
                    </span>
                    <button
                      onClick={() => {
                        onApplyField("baseline", structuredResult.baseline);
                        showToast({
                          type: "success",
                          title: "Baseline Applied",
                          description: "AI-generated suggestion — verify before publishing.",
                        });
                      }}
                      className="text-[9px] text-gov-accent hover:underline font-semibold"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-xs font-bold text-slate-900">
                    {structuredResult.baseline}
                  </p>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-200 rounded-md p-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-mono text-emerald-700 font-bold uppercase">
                      POTENTIAL TARGET
                    </span>
                    <button
                      onClick={() => {
                        onApplyField("target", structuredResult.target);
                        showToast({
                          type: "success",
                          title: "Target Applied",
                          description: "AI-generated suggestion — verify before publishing.",
                        });
                      }}
                      className="text-[9px] text-emerald-700 hover:underline font-semibold"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-xs font-bold text-emerald-950">
                    {structuredResult.target}
                  </p>
                </div>
              </div>

              {/* Potential Risk & Suggested Mitigation */}
              <div className="bg-amber-50/40 border border-amber-200 rounded-md p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-800 font-bold uppercase tracking-wider flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
                    POTENTIAL RISK
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onApplyField(
                        "mandatoryRequirements",
                        `${formData.mandatoryRequirements} Mitigate risk of ${structuredResult.risk}: ${structuredResult.mitigation}`
                      );
                      showToast({
                        type: "success",
                        title: "Risk Safeguard Added to Requirements",
                        description: "AI-generated suggestion — verify before publishing.",
                      });
                    }}
                    className="text-[10px] h-5 px-1.5 border-amber-300 text-amber-900 bg-white"
                  >
                    Add Safeguard
                  </Button>
                </div>
                <p className="text-xs font-bold text-amber-950">
                  {structuredResult.risk}
                </p>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  <span className="font-semibold text-slate-700">Mitigation:</span> {structuredResult.mitigation}
                </p>
              </div>

              {/* Apply All Button */}
              <Button
                onClick={() => {
                  onApplyBatch({
                    problemDescription: structuredResult.problem,
                    targetOutcome: `Establish operational pilot to achieve target ${structuredResult.kpi} improvements.`,
                    baseline: structuredResult.baseline,
                    target: structuredResult.target,
                    mandatoryRequirements: `${formData.mandatoryRequirements} Risk mitigation for ${structuredResult.risk}: ${structuredResult.mitigation}`,
                  });
                  showToast({
                    type: "success",
                    title: "Applied All Suggestions to Form",
                    description: "AI-generated suggestion — verify before publishing.",
                  });
                }}
                className="w-full text-xs h-8 bg-purple-700 hover:bg-purple-800 text-white font-semibold flex items-center justify-center"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Apply All Structured Suggestions
              </Button>
            </div>
          </div>
        )}

        {/* TAB 2: MISSING INFORMATION AUDITOR */}
        {activeTab === "missing" && (
          <div className="space-y-3">
            <div className="bg-slate-50 border border-slate-200 rounded p-2.5 text-[11px] text-slate-700">
              <p className="font-semibold text-slate-900 mb-0.5">Form Completeness & Policy Audit</p>
              <p className="text-[10px] text-gov-muted">
                The assistant analyzes your 7-step formulation against General Financial Rules (GFR 2017) and pilot validation standards.
              </p>
            </div>

            {/* Statutory Label */}
            <div className="bg-purple-50/70 border border-purple-200/80 rounded-md p-1.5 text-[10px] text-purple-900 font-medium flex items-center">
              <Sparkles className="w-3 h-3 text-purple-600 mr-1.5 shrink-0" />
              AI-generated suggestion — verify before publishing.
            </div>

            <div className="space-y-2">
              {auditItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`border rounded-md p-2.5 text-xs transition-colors ${
                    item.status === "pass"
                      ? "bg-slate-50/50 border-slate-200"
                      : "bg-amber-50/50 border-amber-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900 flex items-center">
                      {item.status === "pass" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 mr-1.5 shrink-0" />
                      )}
                      {item.title}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[9px] py-0 px-1 ${
                        item.status === "pass"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                          : "bg-amber-50 text-amber-800 border-amber-300"
                      }`}
                    >
                      Step {item.step}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-600 mb-2 leading-tight">
                    {item.message}
                  </p>
                  {item.status === "warning" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        item.onFix();
                        showToast({
                          type: "success",
                          title: "Field Enriched",
                          description: "AI-generated suggestion — verify before publishing.",
                        });
                      }}
                      className="text-[10px] h-6 px-2 border-amber-300 text-amber-900 bg-white hover:bg-amber-50"
                    >
                      <Sparkles className="w-2.5 h-2.5 mr-1 text-amber-600" />
                      {item.action}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RISKS & KPIS */}
        {activeTab === "risks" && (
          <div className="space-y-3">
            <div className="bg-purple-50/70 border border-purple-200/80 rounded-md p-1.5 text-[10px] text-purple-900 font-medium flex items-center">
              <Sparkles className="w-3 h-3 text-purple-600 mr-1.5 shrink-0" />
              AI-generated suggestion — verify before publishing.
            </div>

            <div className="space-y-3">
              <div className="border border-gov-border rounded-md p-3 bg-white space-y-2">
                <span className="text-[10px] font-mono text-gov-primary font-bold uppercase tracking-wider block">
                  RECOMMENDED CIVIC KPIS
                </span>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">Spatial Telemetry Density</p>
                      <p className="text-[11px] text-gov-muted">
                        Target: Minimum 1 active sensor per 2.5 sq km with &gt;95% hourly uptime.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        onApplyField(
                          "successDefinition",
                          `${formData.successDefinition} Spatial density: minimum 1 active sensor per 2.5 sq km.`
                        );
                        showToast({
                          type: "success",
                          title: "KPI Inserted",
                          description: "AI-generated suggestion — verify before publishing.",
                        });
                      }}
                      className="text-[9.5px] h-5 px-1.5"
                    >
                      Insert
                    </Button>
                  </div>

                  <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">Reference Analyzer Correlation (R²)</p>
                      <p className="text-[11px] text-gov-muted">
                        Target: R² &gt;= 0.90 against collocated statutory CAAQMS instruments over 60 days.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        onApplyField("target", "R² >= 0.90 correlation vs CPCB reference CAAQMS");
                        showToast({
                          type: "success",
                          title: "KPI Target Updated",
                          description: "AI-generated suggestion — verify before publishing.",
                        });
                      }}
                      className="text-[9.5px] h-5 px-1.5"
                    >
                      Insert
                    </Button>
                  </div>
                </div>
              </div>

              {/* Technical & Operational Risks */}
              <div className="border border-amber-200 rounded-md p-3 bg-amber-50/30 space-y-2">
                <span className="text-[10px] font-mono text-amber-800 font-bold uppercase tracking-wider block">
                  IDENTIFIED PILOT RISKS & SAFEGUARDS
                </span>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-white rounded border border-amber-200">
                    <p className="font-bold text-amber-950 text-xs">Risk: Optical Drift & Sensor Fouling</p>
                    <p className="text-[11px] text-slate-700 mt-0.5">
                      High particulate deposition can blind laser scattering optics within 30 days in winter inversion episodes.
                    </p>
                    <p className="text-[10.5px] text-gov-accent font-medium mt-1">
                      Safeguard: Mandate cyclonic pre-filter and daily self-cleaning purge cycles in Step 3 specs.
                    </p>
                  </div>

                  <div className="p-2 bg-white rounded border border-amber-200">
                    <p className="font-bold text-amber-950 text-xs">Risk: Vendor Cloud Lock-in</p>
                    <p className="text-[11px] text-slate-700 mt-0.5">
                      Proprietary binary protocols preventing integration with municipal command centers (ICCC).
                    </p>
                    <p className="text-[10.5px] text-gov-accent font-medium mt-1">
                      Safeguard: Enforce open OpenAPI 3.0 REST & MQTT schema under GFR Rule 149 in Step 6 terms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CHALLENGE SUMMARY */}
        {activeTab === "summary" && (
          <div className="space-y-3">
            <div className="bg-purple-50/70 border border-purple-200/80 rounded-md p-1.5 text-[10px] text-purple-900 font-medium flex items-center">
              <Sparkles className="w-3 h-3 text-purple-600 mr-1.5 shrink-0" />
              AI-generated suggestion — verify before publishing.
            </div>

            <div className="bg-slate-50 border border-gov-border rounded-md p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-gov-primary font-bold uppercase tracking-wider">
                  PROCUREMENT EXECUTIVE SUMMARY
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      `${formData.department} seeks innovative Indian deep-tech startups to deploy a controlled ${formData.durationDays}-day pilot addressing: "${formData.title}". The deployment targets moving baseline measurement from ${formData.baseline} to ${formData.target}, under a pilot budget of ₹${(Number(formData.budgetInr) / 100000).toFixed(1)} Lakhs.`,
                      "summary"
                    )
                  }
                  className="text-slate-400 hover:text-slate-600 p-1"
                  title="Copy Summary"
                >
                  {copiedKey === "summary" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                {formData.department} seeks innovative Indian deep-tech startups to deploy a controlled {formData.durationDays}-day pilot addressing: &ldquo;{formData.title}&rdquo;. The deployment targets moving baseline civic performance from <span className="font-semibold">{formData.baseline}</span> to <span className="font-semibold text-gov-primary">{formData.target}</span>, backed by structured milestone-linked disbursements totaling ₹{(Number(formData.budgetInr) / 100000).toFixed(1)} Lakhs.
              </p>

              <div className="pt-1 flex items-center justify-between">
                <span className="text-[10px] text-gov-muted font-mono">
                  Characters: 342 • Gazette Ready
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    handleCopy(
                      `${formData.department} seeks innovative Indian deep-tech startups to deploy a controlled ${formData.durationDays}-day pilot addressing: "${formData.title}". Baseline: ${formData.baseline} -> Target: ${formData.target}.`,
                      "summary"
                    );
                  }}
                  className="text-[10px] h-6 px-2 border-slate-300"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy for Public Notice
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Assistant Footer */}
      <div className="p-3 bg-slate-50 border-t border-gov-border flex items-center justify-between text-[10px] text-gov-muted">
        <span className="flex items-center">
          <ShieldCheck className="w-3 h-3 text-emerald-600 mr-1" />
          GovInnovate Safe-AI Protocol
        </span>
        <span>Version 2.4</span>
      </div>
    </div>
  );
}
