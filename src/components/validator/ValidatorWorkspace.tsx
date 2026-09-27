"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/auth/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import {
  validatorDb,
  ValidationRecord,
  ValidationOutcome,
  ChecklistItemStatus,
  ValidationChecklistItem,
  ValidationDimension,
} from "@/database/validatorDatabase";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  FileText,
  FileCheck,
  Building2,
  Lock,
  Layers,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu,
  BarChart3,
  Award,
  Download,
  Eye,
  RefreshCw,
  Landmark,
  Sparkles,
  Info,
  Calendar,
  Send,
} from "lucide-react";

export function ValidatorWorkspace({
  pilotId = "PILOT-UP-UAQ-01",
}: {
  pilotId?: string;
}) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [record, setRecord] = useState<ValidationRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    "dimensions" | "checklist" | "submission" | "audit"
  >("dimensions");

  // Dimension sub-selector for review tab
  const [selectedDimension, setSelectedDimension] =
    useState<ValidationDimension>("Pilot Objectives");

  // Checklist filters
  const [checklistFilter, setChecklistFilter] = useState<
    ValidationDimension | "ALL"
  >("ALL");
  const [statusFilter, setStatusFilter] = useState<
    ChecklistItemStatus | "ALL"
  >("ALL");

  // Submission Form State
  const [selectedOutcome, setSelectedOutcome] = useState<ValidationOutcome>(
    "Validated"
  );
  const [findingsInput, setFindingsInput] = useState("");
  const [limitationsInput, setLimitationsInput] = useState("");
  const [commentsInput, setCommentsInput] = useState("");
  const [selectedEvidenceRefs, setSelectedEvidenceRefs] = useState<string[]>(
    []
  );
  const [submitting, setSubmitting] = useState(false);

  // Checklist editing modal
  const [editingItem, setEditingItem] =
    useState<ValidationChecklistItem | null>(null);
  const [editStatus, setEditStatus] = useState<ChecklistItemStatus>("Verified");
  const [editNotes, setEditNotes] = useState("");

  const isValidatorOrAdmin =
    currentUser?.role === "VALIDATOR" ||
    currentUser?.role === "INDEPENDENT_VALIDATOR" ||
    currentUser?.role === "ADMIN" ||
    currentUser?.role === "PLATFORM_ADMIN";

  const isStartup = currentUser?.role === "STARTUP";

  const loadData = () => {
    try {
      const rec = validatorDb.getValidationRecord(pilotId);
      if (rec) {
        setRecord(rec);
        setSelectedOutcome(rec.outcome || "Validated");
        setFindingsInput(rec.findings || "");
        setLimitationsInput(rec.limitations || "");
        setCommentsInput(rec.comments || "");
        setSelectedEvidenceRefs(rec.evidenceReferences || []);
      }
    } catch (err) {
      console.error("Failed to load validation record:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pilotId]);

  // Filtered checklist
  const filteredChecklist = useMemo(() => {
    if (!record) return [];
    return record.checklist.filter((item) => {
      if (checklistFilter !== "ALL" && item.dimension !== checklistFilter) {
        return false;
      }
      if (statusFilter !== "ALL" && item.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [record, checklistFilter, statusFilter]);

  // Available evidence list for citations
  const availableEvidence = [
    { id: "ev-001", title: "Lucknow_Pole_Mounting_GIS_Shapefile.zip (GIS Map)" },
    { id: "ev-002", title: "Lalbagh_CAAQMS_14Day_Collocation_Raw.csv (Telemetry)" },
    { id: "ev-003", title: "60_Day_Sensor_Telemetry_Dataset.parquet (Raw Telemetry)" },
    { id: "ev-004", title: "Automated_Misting_Dispatch_Audit_Logs.csv (Municipal Logs)" },
    { id: "ev-005", title: "TERI_Accredited_Collocation_Audit_TR1.pdf (Lab Certificate)" },
    { id: "ev-006", title: "Anti-Fouling_Optical_Purge_Diagnostic.log (Hardware Logs)" },
  ];

  const handleToggleEvidenceRef = (id: string) => {
    if (selectedEvidenceRefs.includes(id)) {
      setSelectedEvidenceRefs(selectedEvidenceRefs.filter((e) => e !== id));
    } else {
      setSelectedEvidenceRefs([...selectedEvidenceRefs, id]);
    }
  };

  // Submit formal determination
  const handleSubmitDetermination = () => {
    if (isStartup) {
      showToast({
        type: "error",
        title: "Permission Denied",
        description:
          "Startups are strictly prohibited from modifying independent validator determinations.",
      });
      return;
    }

    if (!findingsInput.trim() || findingsInput.length < 20) {
      showToast({
        type: "error",
        title: "Findings Required",
        description:
          "Please provide detailed empirical findings (minimum 20 characters).",
      });
      return;
    }

    if (selectedEvidenceRefs.length === 0) {
      showToast({
        type: "error",
        title: "Evidence References Required",
        description: "You must cite at least one supporting evidence artifact.",
      });
      return;
    }

    if (!limitationsInput.trim() || limitationsInput.length < 10) {
      showToast({
        type: "error",
        title: "Limitations Required",
        description:
          "Please document technical limitations and environmental constraints.",
      });
      return;
    }

    if (!commentsInput.trim() || commentsInput.length < 10) {
      showToast({
        type: "error",
        title: "Comments Required",
        description:
          "Please provide validator scale-up recommendations or comments.",
      });
      return;
    }

    setSubmitting(true);
    const actorName = currentUser
      ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
      : "Priya Nair";

    const result = validatorDb.submitValidationReport(
      pilotId,
      {
        outcome: selectedOutcome,
        findings: findingsInput,
        evidenceReferences: selectedEvidenceRefs,
        limitations: limitationsInput,
        comments: commentsInput,
      },
      actorName,
      currentUser?.role || "INDEPENDENT_VALIDATOR",
      "The Energy and Resources Institute (TERI)"
    );

    setSubmitting(false);

    if (result.success) {
      showToast({
        type: "success",
        title: "Validation Determination Submitted",
        description: `Pilot certified as '${selectedOutcome}' and logged to immutable audit trail.`,
      });
      loadData();
    } else {
      showToast({
        type: "error",
        title: "Submission Failed",
        description: result.error || "Failed to submit validation report.",
      });
    }
  };

  // Update single checklist item
  const handleSaveChecklistItem = () => {
    if (!editingItem) return;
    if (isStartup) {
      showToast({
        type: "error",
        title: "Permission Denied",
        description: "Startups cannot modify validation checklist items.",
      });
      return;
    }

    const actorName = currentUser
      ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
      : "Priya Nair (TERI)";

    const res = validatorDb.updateChecklistItem(
      pilotId,
      editingItem.id,
      editStatus,
      editNotes,
      actorName,
      currentUser?.role || "INDEPENDENT_VALIDATOR"
    );

    if (res.success) {
      showToast({
        type: "success",
        title: "Checklist Item Updated",
        description: `Marked '${editingItem.title}' as '${editStatus}'.`,
      });
      loadData();
      setEditingItem(null);
    } else {
      showToast({
        type: "error",
        title: "Update Failed",
        description: res.error || "Failed to update item.",
      });
    }
  };

  const openEditModal = (item: ValidationChecklistItem) => {
    if (isStartup) {
      showToast({
        type: "warning",
        title: "Read-Only Inspection",
        description: "Startups cannot alter validator checklist evaluations.",
      });
      return;
    }
    setEditingItem(item);
    setEditStatus(item.status);
    setEditNotes(item.notes || "");
  };

  if (loading || !record) {
    return (
      <div className="p-8 text-center text-slate-500">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gov-primary" />
        <p className="text-sm">Loading Independent Validation Studio...</p>
      </div>
    );
  }

  // Outcome badge helper
  const renderOutcomeBadge = (outcome: ValidationOutcome | null) => {
    switch (outcome) {
      case "Validated":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
            VALIDATED
          </span>
        );
      case "Partially Validated":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
            PARTIALLY VALIDATED
          </span>
        );
      case "Not Validated":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-rose-700" />
            NOT VALIDATED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            IN AUDIT REVIEW
          </span>
        );
    }
  };

  // Checklist status badge helper
  const renderChecklistStatusBadge = (status: ChecklistItemStatus) => {
    switch (status) {
      case "Verified":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Check className="w-3 h-3 mr-1 text-emerald-600" /> Verified
          </span>
        );
      case "Minor Concern":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" /> Minor Concern
          </span>
        );
      case "Failed":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <X className="w-3 h-3 mr-1 text-rose-600" /> Failed
          </span>
        );
      case "Not Audited":
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <Clock className="w-3 h-3 mr-1 text-slate-400" /> Not Audited
          </span>
        );
    }
  };

  const dimensionsList: ValidationDimension[] = [
    "Pilot Objectives",
    "Methodology",
    "Baseline",
    "Targets",
    "KPI Measurements",
    "Evidence",
    "Results",
    "Limitations",
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header & Mandate Banner */}
      <div className="bg-white border border-slate-200 rounded-card p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                INDEPENDENT VALIDATION WORKSPACE
              </span>
              <span className="text-xs text-gov-muted font-medium">
                Accredited Testing Agency (TERI / CPCB)
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              {record.pilotTitle}
            </h1>
            <p className="text-xs text-gov-muted mt-0.5">
              Pilot Code:{" "}
              <strong className="text-slate-800 font-mono">
                {record.pilotCode}
              </strong>{" "}
              • Startup:{" "}
              <strong className="text-slate-800">{record.startupName}</strong> (
              {record.startupDpiit}) • Location: {record.location}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-gov-muted block">
                Statutory Outcome:
              </span>
              {renderOutcomeBadge(record.outcome)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              className="text-xs text-slate-600 hover:text-slate-900"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Sync
            </Button>
          </div>
        </div>

        {/* Third-Party Mandate & Role Separation Banner */}
        <div className="p-3.5 rounded-lg border border-teal-200 bg-teal-50/70 text-xs text-teal-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-teal-950">
                Statutory Role Separation (Section 14 & 33 Mandate):
              </span>{" "}
              The Independent Validator acts as an external empirical auditor.
              Neither the startup nor line department officers can tamper with or
              overwrite validator findings.
            </div>
          </div>
          <div className="shrink-0 flex items-center space-x-2 font-mono text-[11px] bg-white/80 px-2.5 py-1 rounded border border-teal-200">
            <Award className="w-3.5 h-3.5 text-teal-700" />
            <span>Auditor: {record.validatorName} ({record.validatorOrg})</span>
          </div>
        </div>

        {/* Read-Only Disclaimer for Startups */}
        {isStartup && (
          <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/70 text-xs text-blue-900 flex items-center space-x-2">
            <Lock className="w-4 h-4 text-blue-700 shrink-0" />
            <div>
              <strong className="text-blue-950">Read-Only Mode:</strong> As a
              Startup representative, you are permitted to view audit
              checklists and empirical findings for complete transparency, but you
              cannot modify validator scores or determinations.
            </div>
          </div>
        )}
      </div>

      {/* 2. Primary Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-t-card">
        <button
          onClick={() => setActiveTab("dimensions")}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition-all ${
            activeTab === "dimensions"
              ? "border-gov-primary text-gov-primary"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>8-Dimension Deep Review</span>
        </button>

        <button
          onClick={() => setActiveTab("checklist")}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition-all ${
            activeTab === "checklist"
              ? "border-gov-primary text-gov-primary"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Validation Checklist ({record.checklist.length} Items)</span>
        </button>

        <button
          onClick={() => setActiveTab("submission")}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition-all ${
            activeTab === "submission"
              ? "border-gov-primary text-gov-primary"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Formal Determination & Sign-Off</span>
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition-all ${
            activeTab === "audit"
              ? "border-gov-primary text-gov-primary"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Audit Log ({record.auditLog.length})</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: 8-DIMENSION REVIEW WORKSPACE                       */}
      {/* ========================================================= */}
      {activeTab === "dimensions" && (
        <div className="bg-white border border-slate-200 rounded-b-card p-5 shadow-2xs space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Dimension Selector Sidebar */}
            <div className="w-full md:w-64 space-y-1.5 shrink-0 border-r border-slate-100 pr-4">
              <span className="text-[10px] font-mono uppercase font-bold text-gov-muted block mb-2 px-2">
                Mandatory Review Dimensions
              </span>
              {dimensionsList.map((dim, idx) => {
                const isSelected = selectedDimension === dim;
                return (
                  <button
                    key={dim}
                    onClick={() => setSelectedDimension(dim)}
                    className={`w-full text-left px-3 py-2 rounded-control text-xs font-semibold flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-gov-light text-gov-primary font-bold shadow-2xs border border-gov-border"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>
                      {idx + 1}. {dim}
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 ${
                        isSelected ? "text-gov-primary" : "text-slate-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Right Dimension Detailed Content */}
            <div className="flex-1 space-y-4">
              {/* 1. PILOT OBJECTIVES */}
              {selectedDimension === "Pilot Objectives" && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      1. Pilot Objectives & Scope Verification
                    </h3>
                    <p className="text-xs text-gov-muted">
                      Audit of civic problem formulation, municipal boundaries,
                      and targeted intervention scale.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                      <span className="font-semibold text-slate-700 block">
                        Target Jurisdiction & Wards:
                      </span>
                      <p className="text-slate-900 font-medium">
                        {record.objectivesReview.targetJurisdiction}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {record.objectivesReview.beneficiaryWards.map((w) => (
                          <span
                            key={w}
                            className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-700"
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                      <span className="font-semibold text-slate-700 block">
                        Statutory Observation Period:
                      </span>
                      <p className="text-slate-900 font-mono font-bold">
                        {record.objectivesReview.observationPeriod}
                      </p>
                      <span className="text-[10px] text-gov-muted block">
                        Mandated under GFR 149 performance period
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <strong className="text-slate-800 block">
                      Core Civic Problem Formulation:
                    </strong>
                    <p className="text-slate-700 leading-relaxed">
                      {record.objectivesReview.primaryObjective}
                    </p>
                    <div className="pt-2 border-t border-slate-200 text-teal-900">
                      <strong>Auditor Alignment Score: </strong>
                      <span>{record.objectivesReview.alignmentAssessment}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. METHODOLOGY */}
              {selectedDimension === "Methodology" && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      2. Methodology & Scientific Sampling Protocol
                    </h3>
                    <p className="text-xs text-gov-muted">
                      Conformity with Central Pollution Control Board (CPCB) and
                      ISO/IEC 17025 low-cost sensor guidelines.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                      <span className="font-semibold text-slate-700 block">
                        Sampling Framework:
                      </span>
                      <p className="text-slate-800 mt-1 font-mono text-[11px]">
                        {record.methodologyReview.samplingFramework}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                      <span className="font-semibold text-slate-700 block">
                        Hardware Collocation Protocol:
                      </span>
                      <p className="text-slate-800 mt-1 font-mono text-[11px]">
                        {record.methodologyReview.hardwareCollocation}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                      <span className="font-semibold text-slate-700 block">
                        Reference Instrumentation:
                      </span>
                      <p className="text-slate-800 mt-1 font-mono text-[11px]">
                        {record.methodologyReview.referenceInstrumentation}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                      <span className="font-semibold text-slate-700 block">
                        Encrypted Telemetry Protocol:
                      </span>
                      <p className="text-slate-800 mt-1 font-mono text-[11px]">
                        {record.methodologyReview.telemetryProtocol}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-1">
                    <strong className="block">Auditor Assessment:</strong>
                    <p>{record.methodologyReview.auditorEvaluation}</p>
                    <span className="text-[10px] font-mono text-teal-800 block">
                      Standards Checked: {record.methodologyReview.complianceCertification}
                    </span>
                  </div>
                </div>
              )}

              {/* 3. BASELINE */}
              {selectedDimension === "Baseline" && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      3. Baseline Verification (Pre-Intervention State)
                    </h3>
                    <p className="text-xs text-gov-muted">
                      Audit of pre-deployment empirical metrics to prevent
                      exaggerated delta reporting.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                      <span className="text-gov-muted block text-[10px] uppercase font-mono">
                        Historic Coverage
                      </span>
                      <span className="text-xl font-bold font-mono text-slate-900 block mt-1">
                        35.0%
                      </span>
                      <span className="text-[10px] text-slate-500">
                        1 CAAQMS Station / District
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                      <span className="text-gov-muted block text-[10px] uppercase font-mono">
                        Historic Accuracy
                      </span>
                      <span className="text-xl font-bold font-mono text-slate-900 block mt-1">
                        82.0%
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Uncalibrated Optical Curve
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                      <span className="text-gov-muted block text-[10px] uppercase font-mono">
                        Historic Uptime
                      </span>
                      <span className="text-xl font-bold font-mono text-slate-900 block mt-1">
                        76.0%
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Frequent Solar Inverter Trips
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <strong className="text-slate-800 block">
                      Prior Operational Condition:
                    </strong>
                    <p className="text-slate-700 leading-relaxed">
                      {record.baselineReview.priorInterventionConditions}
                    </p>
                    <span className="text-[10px] text-gov-muted font-mono block">
                      Observation Window: {record.baselineReview.observationDateRange}
                    </span>
                  </div>
                </div>
              )}

              {/* 4. TARGETS */}
              {selectedDimension === "Targets" && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      4. Statutory Performance Targets Review
                    </h3>
                    <p className="text-xs text-gov-muted">
                      Review of contractual thresholds set under National Clean Air
                      Programme and UP Urban Innovation Policy.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                      <span className="text-gov-muted block text-[10px] uppercase font-mono">
                        Target Coverage
                      </span>
                      <span className="text-xl font-bold font-mono text-gov-primary block mt-1">
                        ≥ 85.0%
                      </span>
                      <span className="text-[10px] text-slate-500">
                        500m Voronoi buffer
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                      <span className="text-gov-muted block text-[10px] uppercase font-mono">
                        Target Accuracy
                      </span>
                      <span className="text-xl font-bold font-mono text-gov-primary block mt-1">
                        R² ≥ 0.90
                      </span>
                      <span className="text-[10px] text-slate-500">
                        vs BAM-1020 Analyzer
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                      <span className="text-gov-muted block text-[10px] uppercase font-mono">
                        Target Uptime
                      </span>
                      <span className="text-xl font-bold font-mono text-gov-primary block mt-1">
                        ≥ 90.0%
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Continuous hourly transmission
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <strong className="text-slate-800 block">
                      Target Rationale & Statutory Basis:
                    </strong>
                    <p className="text-slate-700 leading-relaxed">
                      {record.targetsReview.performanceThresholdRationale}
                    </p>
                    <span className="text-[10px] text-gov-muted font-mono block">
                      Statutory Mandate: {record.targetsReview.statutoryMandate}
                    </span>
                  </div>
                </div>
              )}

              {/* 5. KPI MEASUREMENTS */}
              {selectedDimension === "KPI Measurements" && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      5. Audited KPI Measurements & Time-Series Telemetry
                    </h3>
                    <p className="text-xs text-gov-muted">
                      Audit of {record.kpiMeasurementsReview.totalMeasurementsAudited.toLocaleString()}{" "}
                      data points recorded over 90 days.
                    </p>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 text-[10px] uppercase font-mono text-gov-muted border-b border-slate-200">
                        <tr>
                          <th className="p-3">Audited Metric</th>
                          <th className="p-3">Baseline</th>
                          <th className="p-3">Statutory Target</th>
                          <th className="p-3">Verified Outcome</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Confidence</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {record.kpiMeasurementsReview.auditedKpis.map((k) => (
                          <tr key={k.kpiId} className="hover:bg-slate-50/70">
                            <td className="p-3 font-semibold text-slate-900">
                              {k.metricName}
                            </td>
                            <td className="p-3 font-mono text-slate-600">
                              {k.baseline}
                            </td>
                            <td className="p-3 font-mono font-medium text-slate-800">
                              {k.target}
                            </td>
                            <td className="p-3 font-mono font-bold text-emerald-700 text-sm">
                              {k.measured}
                            </td>
                            <td className="p-3">
                              <Badge
                                variant={
                                  k.outcomeStatus === "EXCEEDED"
                                    ? "success"
                                    : "outline"
                                }
                                className="text-[10px]"
                              >
                                {k.outcomeStatus}
                              </Badge>
                            </td>
                            <td className="p-3 font-mono text-slate-700">
                              {k.validatorConfidence}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs">
                    <strong>Telemetry Ingress Integrity: </strong>
                    <span className="text-slate-700">
                      {record.kpiMeasurementsReview.dataIngressIntegrity}
                    </span>
                  </div>
                </div>
              )}

              {/* 6. EVIDENCE */}
              {selectedDimension === "Evidence" && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      6. Evidence Artifacts & Cryptographic Hash Audit
                    </h3>
                    <p className="text-xs text-gov-muted">
                      Verification of raw CSV telemetry, GIS shapefiles, and
                      laboratory test certificates against SHA-256 seals.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {record.evidenceReview.primaryEvidenceArtifacts.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-3 rounded bg-slate-50 border border-slate-200 flex items-center justify-between text-xs hover:bg-slate-100/70 transition-colors"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-[10px] font-bold text-gov-primary bg-white px-1.5 py-0.5 rounded border border-slate-200">
                              {ev.id}
                            </span>
                            <span className="font-semibold text-slate-900">
                              {ev.title}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-gov-muted block mt-0.5">
                            Type: {ev.type} • SHA-256: {ev.sha256}
                          </span>
                        </div>
                        <Badge variant="success" className="text-[10px]">
                          {ev.status}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>
                        All 14 uploaded empirical artifacts passed SHA-256 hash
                        verification. Zero discrepancies found.
                      </span>
                    </div>
                    <Link
                      href="/evidence"
                      className="text-[11px] font-bold text-emerald-900 hover:underline shrink-0"
                    >
                      Open Evidence Vault →
                    </Link>
                  </div>
                </div>
              )}

              {/* 7. RESULTS */}
              {selectedDimension === "Results" && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      7. Computed Empirical Results & Statistical Significance
                    </h3>
                    <p className="text-xs text-gov-muted">
                      Independent regression, residual error distribution, and
                      hypothesis testing.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                      <span className="text-gov-muted block text-[10px] uppercase font-mono">
                        Linearity (R²)
                      </span>
                      <span className="text-2xl font-bold font-mono text-emerald-700 block mt-1">
                        {record.resultsReview.regressionLinearityR2}
                      </span>
                      <span className="text-[10px] text-emerald-800">
                        Target ≥ 0.90 exceeded
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                      <span className="text-gov-muted block text-[10px] uppercase font-mono">
                        Mean Error (MAPE)
                      </span>
                      <span className="text-2xl font-bold font-mono text-slate-900 block mt-1">
                        {record.resultsReview.meanAbsolutePercentageError}%
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Target ≤ 5.0%
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                      <span className="text-gov-muted block text-[10px] uppercase font-mono">
                        Operational Uptime
                      </span>
                      <span className="text-2xl font-bold font-mono text-slate-900 block mt-1">
                        {record.resultsReview.uptimePercentage}%
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Target ≥ 90.0%
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                      <span className="text-gov-muted block text-[10px] uppercase font-mono">
                        Significance (p)
                      </span>
                      <span className="text-2xl font-bold font-mono text-purple-700 block mt-1">
                        p &lt; 0.001
                      </span>
                      <span className="text-[10px] text-purple-800">
                        Statistically Robust
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                    <strong className="text-slate-800 block">
                      Auditor Evaluation Summary:
                    </strong>
                    <p className="text-slate-700 leading-relaxed">
                      {record.resultsReview.auditorSummary}
                    </p>
                  </div>
                </div>
              )}

              {/* 8. LIMITATIONS */}
              {selectedDimension === "Limitations" && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      8. Field Limitations & Scale-Up Risk Warnings
                    </h3>
                    <p className="text-xs text-gov-muted">
                      Mandatory documentation of edge cases, sensor drift, and
                      environmental vulnerabilities.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 space-y-2 text-xs text-amber-950">
                    <div className="flex items-center space-x-2 font-bold text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Documented Field Constraints (Must be noted in Tender):</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-amber-900">
                      {record.limitationsReview.identifiedConstraints.map(
                        (con, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {con}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <strong className="text-slate-800 block">
                      Scale-up Procurement Recommendation:
                    </strong>
                    <p className="text-slate-700 leading-relaxed">
                      {record.limitationsReview.scaleUpRecommendations}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: INTERACTIVE VALIDATION CHECKLIST                    */}
      {/* ========================================================= */}
      {activeTab === "checklist" && (
        <div className="bg-white border border-slate-200 rounded-b-card p-5 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Statutory Validation Checklist
              </h3>
              <p className="text-xs text-gov-muted">
                Section 14 Verification Checklist • All items must be audited
                prior to certification.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={checklistFilter}
                onChange={(e) => setChecklistFilter(e.target.value as any)}
                className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-slate-50 font-medium"
              >
                <option value="ALL">All Dimensions</option>
                {dimensionsList.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-slate-50 font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="Verified">Verified</option>
                <option value="Minor Concern">Minor Concern</option>
                <option value="Failed">Failed</option>
                <option value="Not Audited">Not Audited</option>
              </select>
            </div>
          </div>

          {/* Checklist Items Table */}
          <div className="space-y-3">
            {filteredChecklist.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-card border border-slate-200 bg-white hover:border-gov-primary/40 transition-colors space-y-2.5 text-xs shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                      {item.dimension}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {item.title}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    {renderChecklistStatusBadge(item.status)}
                    {isValidatorOrAdmin && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditModal(item)}
                        className="h-6 text-[10px] px-2 text-gov-primary border-gov-primary/30 hover:bg-gov-light"
                      >
                        Audit / Edit
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed">
                  <strong className="text-slate-800">Audit Criteria: </strong>
                  {item.criteria}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-gov-muted">
                  <div>
                    <span className="font-mono">
                      Standard: {item.standardReference}
                    </span>
                    {item.notes && (
                      <div className="text-slate-800 font-medium mt-0.5">
                        <strong className="text-teal-800">Auditor Notes: </strong>
                        {item.notes}
                      </div>
                    )}
                  </div>

                  {item.verifiedBy && (
                    <span className="font-mono text-[10px] text-slate-500 shrink-0">
                      Audited by {item.verifiedBy}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: FORMAL DETERMINATION & SIGN-OFF                    */}
      {/* ========================================================= */}
      {activeTab === "submission" && (
        <div className="bg-white border border-slate-200 rounded-b-card p-6 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">
              Statutory Validation Determination & Certification
            </h3>
            <p className="text-xs text-gov-muted">
              Submit formal endorsement required by Government Procurement
              Committee under GFR Rule 149.
            </p>
          </div>

          {/* If Startup View, Block Submission Form */}
          {isStartup ? (
            <div className="p-6 rounded-card border-2 border-dashed border-slate-300 bg-slate-50 text-center space-y-2">
              <Lock className="w-8 h-8 mx-auto text-slate-400" />
              <h4 className="font-bold text-slate-900 text-sm">
                Independent Validator Exclusive Authority
              </h4>
              <p className="text-xs text-slate-600 max-w-lg mx-auto">
                In compliance with Section 14 and Section 33 of the Innovation
                Procurement OS, startups cannot submit, edit, or alter
                validation determinations. Only accredited third-party
                validators can certify pilot performance.
              </p>
            </div>
          ) : (
            <div className="space-y-5 text-xs">
              {/* Outcome Picker: Validated / Partially Validated / Not Validated */}
              <div>
                <label className="block font-bold text-slate-800 mb-2">
                  Select Statutory Determination <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedOutcome("Validated")}
                    className={`p-3.5 rounded-card border text-left flex items-start space-x-3 transition-all ${
                      selectedOutcome === "Validated"
                        ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        selectedOutcome === "Validated"
                          ? "text-emerald-700"
                          : "text-slate-400"
                      }`}
                    />
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        Validated
                      </span>
                      <span className="text-[11px] text-slate-600">
                        All primary objectives and critical KPI thresholds
                        exceeded. Ready for direct public procurement scale-up.
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedOutcome("Partially Validated")}
                    className={`p-3.5 rounded-card border text-left flex items-start space-x-3 transition-all ${
                      selectedOutcome === "Partially Validated"
                        ? "bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-xs"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <AlertTriangle
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        selectedOutcome === "Partially Validated"
                          ? "text-amber-700"
                          : "text-slate-400"
                      }`}
                    />
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        Partially Validated
                      </span>
                      <span className="text-[11px] text-slate-600">
                        Substantial milestones achieved, but specific secondary
                        criteria or reliability limits require remediation.
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedOutcome("Not Validated")}
                    className={`p-3.5 rounded-card border text-left flex items-start space-x-3 transition-all ${
                      selectedOutcome === "Not Validated"
                        ? "bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-xs"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <AlertCircle
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        selectedOutcome === "Not Validated"
                          ? "text-rose-700"
                          : "text-slate-400"
                      }`}
                    />
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        Not Validated
                      </span>
                      <span className="text-[11px] text-slate-600">
                        Core performance targets were not satisfied or
                        insurmountable technical failure occurred.
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* 1. Findings (Required) */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  1. Statutory Findings <span className="text-rose-600">*</span>
                </label>
                <Textarea
                  rows={4}
                  value={findingsInput}
                  onChange={(e) => setFindingsInput(e.target.value)}
                  placeholder="Detail empirical findings, R² correlation figures, uptime statistics, and municipal impact..."
                  className="text-xs"
                />
                <span className="text-[10px] text-gov-muted mt-0.5 block">
                  Provide detailed empirical justification based on audited data.
                </span>
              </div>

              {/* 2. Evidence References (Required) */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  2. Cited Evidence References <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 rounded border border-slate-200">
                  {availableEvidence.map((ev) => {
                    const isChecked = selectedEvidenceRefs.includes(ev.id);
                    return (
                      <label
                        key={ev.id}
                        className="flex items-center space-x-2 text-[11px] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleEvidenceRef(ev.id)}
                          className="rounded text-gov-primary focus:ring-gov-primary"
                        />
                        <span className={isChecked ? "font-bold text-slate-900" : "text-slate-600"}>
                          {ev.title}
                        </span>
                      </label>
                    );
                  })}
                </div>
                <span className="text-[10px] text-gov-muted mt-0.5 block">
                  Select at least one evidence artifact supporting the validation findings.
                </span>
              </div>

              {/* 3. Limitations (Required) */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  3. Technical & Environmental Limitations <span className="text-rose-600">*</span>
                </label>
                <Textarea
                  rows={3}
                  value={limitationsInput}
                  onChange={(e) => setLimitationsInput(e.target.value)}
                  placeholder="State any sensor drift, humidity scattering, cellular coverage blindspots, or maintenance requirements..."
                  className="text-xs"
                />
                <span className="text-[10px] text-gov-muted mt-0.5 block">
                  Every field pilot encounters constraints. Documenting them protects public procurement.
                </span>
              </div>

              {/* 4. Comments (Required) */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  4. Evaluator Comments & Scaling Recommendations <span className="text-rose-600">*</span>
                </label>
                <Textarea
                  rows={3}
                  value={commentsInput}
                  onChange={(e) => setCommentsInput(e.target.value)}
                  placeholder="Provide recommendation for statewide adoption under GFR 149..."
                  className="text-xs"
                />
              </div>

              {/* Digital Seal Info & Submit Action */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2 text-xs text-gov-muted">
                  <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>
                    Submitting signs this report with a SHA-256 cryptographic
                    digest and registers it into the immutable state audit log.
                  </span>
                </div>

                <Button
                  onClick={handleSubmitDetermination}
                  disabled={submitting}
                  className="bg-teal-800 hover:bg-teal-900 text-white shrink-0"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  {submitting ? "Signing & Submitting..." : "Submit Formal Determination"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: IMMUTABLE AUDIT LOG TIMELINE                       */}
      {/* ========================================================= */}
      {activeTab === "audit" && (
        <div className="bg-white border border-slate-200 rounded-b-card p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Statutory Validation Audit Trail
              </h3>
              <p className="text-xs text-gov-muted">
                Section 33 Immutable Log • Records every inspection, hash
                check, and determination.
              </p>
            </div>
            <span className="font-mono text-xs text-gov-muted">
              {record.auditLog.length} Registered Events
            </span>
          </div>

          <div className="space-y-3">
            {record.auditLog.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-100/70 transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-[10px] text-gov-primary bg-white px-2 py-0.5 rounded border border-slate-200">
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {log.summary}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 block mt-1">
                    Seal Digest: {log.hash}
                  </span>
                </div>

                <div className="text-right shrink-0 font-mono text-[10px] text-gov-muted">
                  <div className="font-semibold text-slate-700">{log.actor}</div>
                  <div>
                    {new Date(log.timestamp).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: EDIT CHECKLIST ITEM (VALIDATORS ONLY) */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-card max-w-lg w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Audit Checklist Item
                </h4>
                <p className="text-xs text-gov-muted">{editingItem.title}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingItem(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 block">
                  Evaluation Criteria:
                </span>
                <p className="text-slate-700">{editingItem.criteria}</p>
                <span className="font-mono text-[10px] text-gov-muted block">
                  Standard: {editingItem.standardReference}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Verification Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full text-xs border border-slate-300 rounded p-2 bg-slate-50 font-semibold"
                >
                  <option value="Verified">Verified</option>
                  <option value="Minor Concern">Minor Concern</option>
                  <option value="Failed">Failed</option>
                  <option value="Not Audited">Not Audited</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Auditor Field Notes & Findings
                </label>
                <Textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Record empirical observations, sample counts, or discrepancies..."
                  className="text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingItem(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveChecklistItem}
                className="bg-gov-primary hover:bg-gov-primary/90 text-white"
              >
                Save Audit Finding
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
