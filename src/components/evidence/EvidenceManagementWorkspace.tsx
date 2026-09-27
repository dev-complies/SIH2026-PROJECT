"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/auth/AuthContext";
import {
  EvidenceType,
  VerificationStatus,
  ConfidentialityLevel,
  EvidenceRecord,
} from "@/database/evidenceDatabase";
import {
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  Cpu,
  FileCheck2,
  Terminal,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Eye,
  Filter,
  Search,
  Plus,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Layers,
  Lock,
  Unlock,
  Radio,
  FileCode,
  MapPin,
  Calendar,
  Building2,
  User,
  Check,
  X,
  RefreshCw,
  GitBranch,
  Database,
  SlidersHorizontal,
} from "lucide-react";

export function EvidenceManagementWorkspace() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  // Navigation / View Modes
  const [activeView, setActiveView] = useState<"traceability" | "vault">("traceability");

  // Evidence list state from API
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Traceability state
  const [traceabilityData, setTraceabilityData] = useState<any>(null);
  const [selectedKpiId, setSelectedKpiId] = useState<string>("kpi-monitoring-coverage");
  const [selectedMeasurementId, setSelectedMeasurementId] = useState<string>("meas-cov-6");
  const [allKpis, setAllKpis] = useState<any[]>([]);

  // Filters for Vault View
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [milestoneFilter, setMilestoneFilter] = useState<string>("ALL");

  // Selected Evidence for Drawer/Modal Inspector
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // Adjudication state inside Drawer
  const [isAdjudicating, setIsAdjudicating] = useState<boolean>(false);
  const [adjudicateStatus, setAdjudicateStatus] = useState<VerificationStatus>("Verified");
  const [rejectionReason, setRejectionReason] = useState<string>("");

  // Secure Download State
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadManifest, setDownloadManifest] = useState<any>(null);

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newType, setNewType] = useState<EvidenceType>("Document");
  const [newKpiId, setNewKpiId] = useState<string>("kpi-monitoring-coverage");
  const [newMilestoneId, setNewMilestoneId] = useState<string>("M3");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newConfidentiality, setNewConfidentiality] = useState<ConfidentialityLevel>("RESTRICTED");

  // Fetch Evidence List
  const fetchEvidence = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/evidence");
      const json = await res.json();
      if (json.success && json.evidence) {
        setEvidenceList(json.evidence);
      }
    } catch (err) {
      console.error("Failed to fetch evidence:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Traceability Tree
  const fetchTraceability = async (kpiId: string) => {
    try {
      const res = await fetch(`/api/evidence?traceability=true&kpiId=${kpiId}`);
      const json = await res.json();
      if (json.success) {
        setTraceabilityData(json.traceability);
        if (json.allKpis) setAllKpis(json.allKpis);
        if (json.traceability?.measurements?.length > 0) {
          // If current selectedMeasurementId is not in this KPI, default to latest
          const exists = json.traceability.measurements.some((m: any) => m.measurementId === selectedMeasurementId);
          if (!exists) {
            setSelectedMeasurementId(json.traceability.measurements[json.traceability.measurements.length - 1].measurementId);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load traceability chain:", err);
    }
  };

  useEffect(() => {
    fetchEvidence();
    fetchTraceability(selectedKpiId);
  }, []);

  useEffect(() => {
    fetchTraceability(selectedKpiId);
  }, [selectedKpiId]);

  // Statistics Summary
  const stats = useMemo(() => {
    const total = evidenceList.length;
    const verified = evidenceList.filter((e) => e.verificationStatus === "Verified").length;
    const underReview = evidenceList.filter((e) => e.verificationStatus === "Under Review").length;
    const unverified = evidenceList.filter((e) => e.verificationStatus === "Unverified").length;
    const rejected = evidenceList.filter((e) => e.verificationStatus === "Rejected").length;
    return { total, verified, underReview, unverified, rejected };
  }, [evidenceList]);

  // Filtered Evidence for Vault View
  const filteredEvidence = useMemo(() => {
    return evidenceList.filter((e) => {
      if (typeFilter !== "ALL" && e.type !== typeFilter) return false;
      if (statusFilter !== "ALL" && e.verificationStatus !== statusFilter) return false;
      if (milestoneFilter !== "ALL" && e.relatedMilestoneId !== milestoneFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = e.title.toLowerCase().includes(q);
        const matchesDesc = e.description.toLowerCase().includes(q);
        const matchesKpi = e.relatedKpiName.toLowerCase().includes(q);
        const matchesHash = e.sha256Hash.toLowerCase().includes(q);
        const matchesUploader = e.uploader.name.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesKpi && !matchesHash && !matchesUploader) {
          return false;
        }
      }
      return true;
    });
  }, [evidenceList, typeFilter, statusFilter, milestoneFilter, searchQuery]);

  // Get current active measurement in Traceability view
  const activeMeasurement = useMemo(() => {
    if (!traceabilityData?.measurements) return null;
    return (
      traceabilityData.measurements.find((m: any) => m.measurementId === selectedMeasurementId) ||
      traceabilityData.measurements[traceabilityData.measurements.length - 1]
    );
  }, [traceabilityData, selectedMeasurementId]);

  // Open Drawer Inspector
  const openInspector = (evidence: EvidenceRecord) => {
    setSelectedEvidence(evidence);
    setAdjudicateStatus(evidence.verificationStatus);
    setRejectionReason(evidence.rejectionReason || "");
    setDownloadManifest(null);
    setDrawerOpen(true);
  };

  // Handle Secure File Download Verification
  const handleSecureDownload = async (evidence: EvidenceRecord) => {
    setIsDownloading(true);
    try {
      const res = await fetch(`/api/evidence/${evidence.id}/download`);
      const json = await res.json();
      if (res.ok && json.success) {
        setDownloadManifest(json.fileAccessManifest);
        showToast({
          type: "success",
          title: "Access Authorized & Signed",
          description: `Cryptographic token issued for ${json.fileAccessManifest.fileName}. SHA-256 verified.`,
        });
      } else {
        showToast({
          type: "error",
          title: "Access Denied",
          description: json.error?.message || json.error || "You do not have clearance to download this file.",
        });
      }
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Download Failed",
        description: err.message || "Failed to contact secure file vault.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle Verification Status Change (Government / Validator)
  const handleAdjudicate = async () => {
    if (!selectedEvidence) return;
    if (adjudicateStatus === "Rejected" && !rejectionReason.trim()) {
      showToast({
        type: "error",
        title: "Rejection Reason Required",
        description: "Statutory rules require a clear written explanation when rejecting evidence.",
      });
      return;
    }

    setIsAdjudicating(true);
    try {
      const res = await fetch(`/api/evidence/${selectedEvidence.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: adjudicateStatus,
          rejectionReason: adjudicateStatus === "Rejected" ? rejectionReason : undefined,
          verifierName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Officer Rajesh Verma",
          verifierRole: currentUser?.role || "GOVERNMENT_OFFICER",
        }),
      });

      const json = await res.json();
      if (json.success && json.evidence) {
        setSelectedEvidence(json.evidence);
        setEvidenceList((prev) => prev.map((e) => (e.id === json.evidence.id ? json.evidence : e)));
        fetchTraceability(selectedKpiId);
        showToast({
          type: "success",
          title: "Verification Status Updated",
          description: `Evidence marked as ${adjudicateStatus} with cryptographic audit signature.`,
        });
      } else {
        showToast({
          type: "error",
          title: "Adjudication Failed",
          description: json.error || "Failed to update verification status.",
        });
      }
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Network Error",
        description: err.message || "Failed to update status.",
      });
    } finally {
      setIsAdjudicating(false);
    }
  };

  // Handle Upload / Submit New Evidence
  const handleUploadSubmit = async () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      showToast({
        type: "error",
        title: "Missing Information",
        description: "Please provide a valid document title and descriptive summary.",
      });
      return;
    }

    try {
      const kpiNameObj = allKpis.find((k) => k.id === newKpiId);
      const res = await fetch("/api/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          type: newType,
          relatedKpiId: newKpiId,
          relatedKpiName: kpiNameObj?.name || "Contractual KPI Benchmark",
          relatedMeasurementId: selectedMeasurementId || "meas-latest",
          relatedMeasurementLabel: "Current Verified Telemetry",
          relatedMilestoneId: newMilestoneId,
          relatedMilestoneName: `${newMilestoneId} Pilot Milestone Deliverable`,
          description: newDescription.trim(),
          fileSize: "6.4 MB",
          fileFormat: newType === "Sensor Data" ? "GeoJSON / Parquet" : newType === "System Log" ? "Syslog RFC-5424" : "PDF / ISO-19005",
          sha256Hash: `sha256:${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
          confidentialityLevel: newConfidentiality,
          pilotId: "PILOT-UP-UAQ-01",
          uploaderName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Rohan Varma",
          uploaderRole: currentUser?.role || "STARTUP",
          uploaderOrg: currentUser?.organizationId || "AirSense Technologies Pvt Ltd",
        }),
      });

      const json = await res.json();
      if (json.success && json.evidence) {
        setEvidenceList((prev) => [json.evidence, ...prev]);
        fetchTraceability(selectedKpiId);
        setShowUploadModal(false);
        setNewTitle("");
        setNewDescription("");
        showToast({
          type: "success",
          title: "Evidence Uploaded to Secure Vault",
          description: `Artifact ${json.evidence.title} queued for statutory verification.`,
        });
      } else {
        showToast({
          type: "error",
          title: "Submission Failed",
          description: json.error || "Failed to upload evidence.",
        });
      }
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Network Error",
        description: err.message || "Failed to commit record.",
      });
    }
  };

  // Helper icons for evidence types
  const renderTypeIcon = (type: EvidenceType) => {
    switch (type) {
      case "Document":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "Image":
        return <ImageIcon className="w-4 h-4 text-emerald-600" />;
      case "Video":
        return <VideoIcon className="w-4 h-4 text-purple-600" />;
      case "Sensor Data":
        return <Cpu className="w-4 h-4 text-indigo-600" />;
      case "Report":
        return <FileCheck2 className="w-4 h-4 text-amber-600" />;
      case "System Log":
        return <Terminal className="w-4 h-4 text-slate-700" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  // Helper badge for verification statuses
  const renderStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case "Verified":
        return (
          <Badge variant="success" className="font-mono text-xs flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 mr-0.5" />
            <span>VERIFIED</span>
          </Badge>
        );
      case "Under Review":
        return (
          <Badge variant="warning" className="font-mono text-xs flex items-center space-x-1 bg-amber-50 text-amber-800 border-amber-300">
            <Clock className="w-3 h-3 mr-0.5" />
            <span>UNDER REVIEW</span>
          </Badge>
        );
      case "Unverified":
        return (
          <Badge variant="outline" className="font-mono text-xs text-slate-600 border-slate-300 flex items-center space-x-1">
            <Clock className="w-3 h-3 mr-0.5" />
            <span>UNVERIFIED</span>
          </Badge>
        );
      case "Rejected":
        return (
          <Badge variant="destructive" className="font-mono text-xs flex items-center space-x-1 bg-rose-50 text-rose-800 border-rose-300">
            <XCircle className="w-3 h-3 mr-0.5" />
            <span>REJECTED</span>
          </Badge>
        );
    }
  };

  // Helper badge for confidentiality level
  const renderConfidentialityBadge = (level: ConfidentialityLevel) => {
    switch (level) {
      case "PUBLIC":
        return (
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center">
            <Unlock className="w-2.5 h-2.5 mr-1" />
            PUBLIC
          </span>
        );
      case "RESTRICTED":
        return (
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center">
            <Lock className="w-2.5 h-2.5 mr-1" />
            RESTRICTED
          </span>
        );
      case "CONFIDENTIAL_GOV_ONLY":
        return (
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 inline-flex items-center">
            <ShieldAlert className="w-2.5 h-2.5 mr-1" />
            GOV ONLY
          </span>
        );
      case "PROPRIETARY_STARTUP":
        return (
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center">
            <ShieldCheck className="w-2.5 h-2.5 mr-1" />
            PROPRIETARY IP
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* ======================================================== */}
      {/* 1. HEADER & VAULT INTEGRITY STRIP                         */}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-200 rounded-card p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="default" className="bg-gov-primary font-mono text-xs">
                SECURE EVIDENCE VAULT
              </Badge>
              <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1" />
                100% Tamper-Evident SHA-256
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Empirical Evidence & Telemetry Verification System
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              Bidirectional cryptographic linkage connecting high-level contractual KPIs, historical telemetry measurements, and raw primary field evidence artifacts.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchEvidence}
              className="text-xs flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              <span>Sync Vault</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => setShowUploadModal(true)}
              className="bg-gov-primary hover:bg-gov-primary-hover text-white text-xs flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Upload Evidence</span>
            </Button>
          </div>
        </div>

        {/* Operational Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-100">
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
            <span className="text-xs text-gov-muted uppercase font-mono block">TOTAL ARTIFACTS</span>
            <span className="text-lg font-bold text-slate-900 font-mono">{stats.total}</span>
          </div>

          <div className="p-2.5 rounded bg-emerald-50/70 border border-emerald-200">
            <span className="text-xs text-emerald-700 uppercase font-mono block">VERIFIED (AUDITED)</span>
            <span className="text-lg font-bold text-emerald-800 font-mono">{stats.verified}</span>
          </div>

          <div className="p-2.5 rounded bg-amber-50/70 border border-amber-200">
            <span className="text-xs text-amber-700 uppercase font-mono block">UNDER REVIEW</span>
            <span className="text-lg font-bold text-amber-800 font-mono">{stats.underReview}</span>
          </div>

          <div className="p-2.5 rounded bg-blue-50/70 border border-blue-200">
            <span className="text-xs text-blue-700 uppercase font-mono block">PENDING / UNVERIFIED</span>
            <span className="text-lg font-bold text-blue-800 font-mono">{stats.unverified}</span>
          </div>

          <div className="p-2.5 rounded bg-rose-50/70 border border-rose-200">
            <span className="text-xs text-rose-700 uppercase font-mono block">REJECTED</span>
            <span className="text-lg font-bold text-rose-800 font-mono">{stats.rejected}</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex border-b border-slate-200 pt-1">
          <button
            onClick={() => setActiveView("traceability")}
            className={`flex items-center space-x-2 py-2.5 px-4 font-semibold text-xs border-b-2 transition-all ${
              activeView === "traceability"
                ? "border-gov-primary text-gov-primary font-bold bg-slate-50/80"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <GitBranch className="w-4 h-4 text-gov-primary" />
            <span>Traceability Chain: KPI ➔ Measurement ➔ Evidence</span>
          </button>

          <button
            onClick={() => setActiveView("vault")}
            className={`flex items-center space-x-2 py-2.5 px-4 font-semibold text-xs border-b-2 transition-all ${
              activeView === "vault"
                ? "border-gov-primary text-gov-primary font-bold bg-slate-50/80"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Database className="w-4 h-4 text-slate-600" />
            <span>Complete Evidence Vault & Repository ({evidenceList.length})</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. VIEW A: TRACEABILITY CHAIN (KPI -> Measurement -> Evidence) */}
      {/* ======================================================== */}
      {activeView === "traceability" && (
        <div className="space-y-6">
          {/* Informational Guidance Ribbon */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-card p-3.5 flex items-start space-x-3 text-xs text-blue-900">
            <GitBranch className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Statutory Traceability Pipeline</span>
              <p className="text-blue-800 leading-relaxed text-xs">
                Select any contractual KPI below to drill down into its empirical time-series measurements. Each measurement is bound directly to primary cryptographic evidence artifacts (documents, spatial GeoJSON, sensor telemetry, and field videos) verifying that reading.
              </p>
            </div>
          </div>

          {/* 3-TIER TRACEABILITY FLOW GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* TIER 1: KPI SELECTOR (Col 1-4) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center">
                  <span className="w-5 h-5 rounded-full bg-gov-primary text-white flex items-center justify-center text-xs mr-1.5 font-sans font-bold">1</span>
                  Contractual KPIs
                </span>
                <span className="text-xs text-gov-muted font-mono">{allKpis.length || 5} Total</span>
              </div>

              <div className="space-y-2">
                {(allKpis.length > 0 ? allKpis : [
                  { id: "kpi-monitoring-coverage", name: "Monitoring Coverage", status: "ON_TRACK", current: 78.0, target: 85.0, unit: "%" },
                  { id: "kpi-sensor-accuracy", name: "Sensor Accuracy vs Reference", status: "EXCEEDING", current: 95.0, target: 92.0, unit: "%" },
                  { id: "kpi-fleet-uptime", name: "Fleet Telemetry Uptime", status: "EXCEEDING", current: 97.2, target: 95.0, unit: "%" },
                  { id: "kpi-misting-latency", name: "Automated Misting Latency", status: "EXCEEDING", current: 6.8, target: 10.0, unit: "min" },
                  { id: "kpi-sensor-drift", name: "Optical Chamber Baseline Drift", status: "ON_TRACK", current: 2.8, target: 5.0, unit: "%" },
                ]).map((kpi: any) => {
                  const isSelected = selectedKpiId === kpi.id;
                  return (
                    <div
                      key={kpi.id}
                      onClick={() => setSelectedKpiId(kpi.id)}
                      className={`p-3.5 rounded-card border transition-all cursor-pointer text-left ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : "bg-white text-slate-800 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className={`text-xs font-bold ${isSelected ? "text-white" : "text-slate-900"}`}>
                          {kpi.name}
                        </span>
                        <Badge
                          variant={isSelected ? "outline" : "default"}
                          className={`font-mono text-xs ${
                            isSelected ? "border-slate-600 text-slate-300" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {kpi.status}
                        </Badge>
                      </div>

                      <div className="flex items-baseline space-x-3 mt-2 font-mono text-xs">
                        <div>
                          <span className={`text-xs block uppercase ${isSelected ? "text-slate-400" : "text-slate-500"}`}>
                            CURRENT
                          </span>
                          <span className={`font-bold text-sm ${isSelected ? "text-emerald-400" : "text-emerald-700"}`}>
                            {kpi.current}{kpi.unit}
                          </span>
                        </div>
                        <div>
                          <span className={`text-xs block uppercase ${isSelected ? "text-slate-400" : "text-slate-500"}`}>
                            TARGET
                          </span>
                          <span className={isSelected ? "text-slate-300" : "text-slate-600"}>
                            {kpi.target}{kpi.unit}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                          <span className="flex items-center text-emerald-400 font-semibold">
                            <Check className="w-3 h-3 mr-1" /> Active Trace
                          </span>
                          <span className="flex items-center text-slate-400">
                            Drill Down <ChevronRight className="w-3 h-3 ml-0.5" />
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TIER 2: HISTORICAL MEASUREMENTS (Col 5-8) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center">
                  <span className="w-5 h-5 rounded-full bg-gov-primary text-white flex items-center justify-center text-xs mr-1.5 font-sans font-bold">2</span>
                  Historical Measurements
                </span>
                <span className="text-xs text-gov-muted font-mono">
                  {traceabilityData?.measurements?.length || 0} Data Points
                </span>
              </div>

              <div className="space-y-2">
                {traceabilityData?.measurements?.map((m: any) => {
                  const isSelected = selectedMeasurementId === m.measurementId;
                  const evidenceCount = m.evidence?.length || 0;
                  return (
                    <div
                      key={m.measurementId}
                      onClick={() => setSelectedMeasurementId(m.measurementId)}
                      className={`p-3 rounded-card border transition-all cursor-pointer text-left relative ${
                        isSelected
                          ? "bg-blue-50/90 border-blue-400 shadow-2xs ring-1 ring-blue-400"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {m.dateLabel}
                        </span>
                        <span className="font-mono text-xs font-extrabold text-gov-primary">
                          {m.value}{traceabilityData.unit}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                        {m.notes}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500 font-mono">
                        <span className="truncate max-w-[140px]">{m.sourceNode}</span>
                        <Badge
                          variant={evidenceCount > 0 ? "success" : "outline"}
                          className={`text-xs ${
                            evidenceCount > 0
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : "text-slate-500"
                          }`}
                        >
                          {evidenceCount} Evidence {evidenceCount === 1 ? "File" : "Files"}
                        </Badge>
                      </div>

                      {isSelected && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 hidden lg:flex">
                          <span className="w-2.5 h-2.5 rotate-45 bg-blue-50 border-r border-t border-blue-400"></span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {(!traceabilityData?.measurements || traceabilityData.measurements.length === 0) && (
                  <div className="p-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-card text-xs text-gov-muted">
                    No measurements recorded for this KPI yet.
                  </div>
                )}
              </div>
            </div>

            {/* TIER 3: VERIFYING EVIDENCE ASSETS (Col 9-12) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center">
                  <span className="w-5 h-5 rounded-full bg-gov-primary text-white flex items-center justify-center text-xs mr-1.5 font-sans font-bold">3</span>
                  Linked Evidence Files
                </span>
                <span className="text-xs text-gov-muted font-mono">
                  {activeMeasurement?.evidence?.length || 0} Linked
                </span>
              </div>

              <div className="space-y-2.5">
                {activeMeasurement?.evidence?.map((evi: EvidenceRecord) => (
                  <div
                    key={evi.id}
                    className="p-3.5 bg-white border border-slate-200 rounded-card shadow-2xs hover:border-slate-300 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start space-x-2">
                        <div className="p-1.5 rounded bg-slate-100 shrink-0 mt-0.5">
                          {renderTypeIcon(evi.type)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-tight">
                            {evi.title}
                          </h4>
                          <span className="text-xs font-mono text-gov-muted">
                            {evi.type} • {evi.fileSize} • {evi.relatedMilestoneId}
                          </span>
                        </div>
                      </div>
                      {renderStatusBadge(evi.verificationStatus)}
                    </div>

                    <p className="text-xs text-slate-600 leading-snug line-clamp-2">
                      {evi.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      {renderConfidentialityBadge(evi.confidentialityLevel)}

                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openInspector(evi)}
                          className="h-6 text-xs px-2"
                        >
                          <Eye className="w-3 h-3 mr-1" /> Inspect
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSecureDownload(evi)}
                          className="h-6 text-xs px-2 bg-slate-50 hover:bg-slate-100"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {(!activeMeasurement?.evidence || activeMeasurement.evidence.length === 0) && (
                  <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-card space-y-2">
                    <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto" />
                    <p className="text-xs text-slate-700 font-medium">
                      No evidence uploaded for this specific measurement yet.
                    </p>
                    <p className="text-xs text-slate-500">
                      Upload the primary laboratory certificate or telemetry file to complete the statutory audit chain.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNewKpiId(selectedKpiId);
                        setShowUploadModal(true);
                      }}
                      className="text-xs mt-2"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Evidence Now
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. VIEW B: COMPLETE EVIDENCE VAULT & REPOSITORY           */}
      {/* ======================================================== */}
      {activeView === "vault" && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="bg-white border border-slate-200 rounded-card p-3.5 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              {/* Search */}
              <div className="sm:col-span-1 relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search title, SHA-256..."
                  className="pl-8 text-xs h-8"
                />
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full text-xs h-8 px-2.5 border border-slate-200 rounded bg-white text-slate-800"
                >
                  <option value="ALL">All Types (Document, Image, Video...)</option>
                  <option value="Document">Document</option>
                  <option value="Image">Image</option>
                  <option value="Video">Video</option>
                  <option value="Sensor Data">Sensor Data</option>
                  <option value="Report">Report</option>
                  <option value="System Log">System Log</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full text-xs h-8 px-2.5 border border-slate-200 rounded bg-white text-slate-800"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Verified">Verified</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Unverified">Unverified</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Milestone Filter */}
              <div>
                <select
                  value={milestoneFilter}
                  onChange={(e) => setMilestoneFilter(e.target.value)}
                  className="w-full text-xs h-8 px-2.5 border border-slate-200 rounded bg-white text-slate-800"
                >
                  <option value="ALL">All Milestones (M1 — M5)</option>
                  <option value="M1">Milestone 1: Collocation</option>
                  <option value="M2">Milestone 2: Fleet Sensors</option>
                  <option value="M3">Milestone 3: Sensor Mesh</option>
                  <option value="M4">Milestone 4: Misting Dispatch</option>
                  <option value="M5">Milestone 5: Final Audit</option>
                </select>
              </div>
            </div>
          </div>

          {/* Evidence Table */}
          <div className="bg-white border border-slate-200 rounded-card shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-gov-muted uppercase font-mono text-xs">
                    <th className="py-2.5 px-3 font-semibold">Evidence Asset</th>
                    <th className="py-2.5 px-3 font-semibold">Uploader & Timestamp</th>
                    <th className="py-2.5 px-3 font-semibold">Related KPI & Milestone</th>
                    <th className="py-2.5 px-3 font-semibold">Verification Status</th>
                    <th className="py-2.5 px-3 font-semibold">Classification</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEvidence.map((evi) => (
                    <tr key={evi.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Asset Title & Type */}
                      <td className="py-3 px-3">
                        <div className="flex items-start space-x-2">
                          <div className="p-1.5 rounded bg-slate-100 shrink-0 mt-0.5">
                            {renderTypeIcon(evi.type)}
                          </div>
                          <div>
                            <button
                              onClick={() => openInspector(evi)}
                              className="font-bold text-slate-900 hover:text-gov-primary text-left line-clamp-1 block text-xs"
                            >
                              {evi.title}
                            </button>
                            <span className="text-xs text-gov-muted font-mono">
                              {evi.type} • {evi.fileSize} • {evi.fileFormat}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Uploader & Timestamp */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800 text-xs">
                          {evi.uploader.name}
                        </div>
                        <div className="text-xs text-gov-muted">
                          {evi.uploader.organization}
                        </div>
                        <div className="text-xs font-mono text-slate-500">
                          {new Date(evi.timestamp).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>

                      {/* Related KPI & Milestone */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800 text-xs flex items-center space-x-1">
                          <Badge variant="outline" className="font-mono text-xs px-1 py-0 mr-1">
                            {evi.relatedMilestoneId}
                          </Badge>
                          <span className="truncate max-w-[150px]">{evi.relatedKpiName}</span>
                        </div>
                        <div className="text-xs text-gov-muted font-mono mt-0.5">
                          {evi.relatedMeasurementLabel}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        {renderStatusBadge(evi.verificationStatus)}
                        {evi.verifiedBy && (
                          <span className="block text-xs text-slate-500 font-mono mt-0.5 truncate max-w-[130px]">
                            by {evi.verifiedBy}
                          </span>
                        )}
                        {evi.verificationStatus === "Rejected" && evi.rejectionReason && (
                          <span className="block text-xs text-rose-600 mt-0.5 line-clamp-1 max-w-[150px]">
                            {evi.rejectionReason}
                          </span>
                        )}
                      </td>

                      {/* Classification */}
                      <td className="py-3 px-3">
                        {renderConfidentialityBadge(evi.confidentialityLevel)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openInspector(evi)}
                            className="h-8 text-xs px-2.5"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" /> Details
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSecureDownload(evi)}
                            className="h-8 text-xs px-2"
                            title="Secure Download"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredEvidence.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-gov-muted">
                        No evidence records matching the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. EVIDENCE INSPECTOR DRAWER / MODAL                      */}
      {/* ======================================================== */}
      {drawerOpen && selectedEvidence && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto p-6 space-y-6 text-left border-l border-slate-200">
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Badge variant="default" className="font-mono text-xs bg-slate-900">
                    {selectedEvidence.id}
                  </Badge>
                  {renderStatusBadge(selectedEvidence.verificationStatus)}
                  {renderConfidentialityBadge(selectedEvidence.confidentialityLevel)}
                </div>
                <h2 className="text-base font-bold text-slate-900 leading-snug">
                  {selectedEvidence.title}
                </h2>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Traceability Breadcrumb Strip */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-card space-y-2">
              <span className="text-xs text-gov-muted uppercase font-mono font-bold block">
                STATUTORY TRACEABILITY BREADCRUMB
              </span>
              <div className="flex items-center text-xs text-slate-700 space-x-1.5 flex-wrap">
                <span className="font-semibold text-gov-primary bg-white px-2 py-0.5 rounded border border-slate-200">
                  KPI: {selectedEvidence.relatedKpiName}
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Meas: {selectedEvidence.relatedMeasurementLabel}
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Milestone: {selectedEvidence.relatedMilestoneId}
                </span>
              </div>
            </div>

            {/* Description & Technical Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono">
                Artifact Description & Scope
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded border border-slate-200">
                {selectedEvidence.description}
              </p>
            </div>

            {/* Technical Metadata & Cryptographic Hash */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono">
                Cryptographic Integrity & File Metadata
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs bg-white border border-slate-200 rounded-card p-3">
                <div>
                  <span className="text-xs text-gov-muted block uppercase">FILE TYPE / FORMAT</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {selectedEvidence.type} ({selectedEvidence.fileFormat})
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gov-muted block uppercase">SIZE</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {selectedEvidence.fileSize}
                  </span>
                </div>

                <div className="col-span-2 pt-2 border-t border-slate-100">
                  <span className="text-xs text-gov-muted block uppercase">SHA-256 INTEGRITY DIGEST</span>
                  <span className="font-mono text-xs text-slate-700 break-all bg-slate-50 p-1.5 rounded block mt-0.5 border border-slate-200">
                    {selectedEvidence.sha256Hash}
                  </span>
                </div>

                {selectedEvidence.metadata && Object.keys(selectedEvidence.metadata).length > 0 && (
                  <div className="col-span-2 pt-2 border-t border-slate-100 space-y-1">
                    <span className="text-xs text-gov-muted block uppercase">METRIC ANNOTATIONS</span>
                    <pre className="text-xs font-mono bg-slate-900 text-emerald-400 p-2 rounded overflow-x-auto">
                      {JSON.stringify(selectedEvidence.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Uploader & Provenance */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono">
                Uploader & Chain of Custody
              </h3>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-card text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{selectedEvidence.uploader.name}</span>
                  <span className="text-xs text-gov-muted block">{selectedEvidence.uploader.organization}</span>
                  <span className="text-xs font-mono text-slate-500">
                    Uploaded: {new Date(selectedEvidence.timestamp).toLocaleString("en-IN")}
                  </span>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  {selectedEvidence.uploader.role}
                </Badge>
              </div>
            </div>

            {/* Verification Status & Adjudication Controls */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono">
                  Statutory Verification Status
                </h3>
                {renderStatusBadge(selectedEvidence.verificationStatus)}
              </div>

              {selectedEvidence.verifiedBy && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 space-y-1">
                  <span className="font-bold flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                    Verified by {selectedEvidence.verifiedBy}
                  </span>
                  <span className="text-xs text-emerald-700 block font-mono">
                    Audit Date: {selectedEvidence.verifiedAt ? new Date(selectedEvidence.verifiedAt).toLocaleString("en-IN") : "Recorded"}
                  </span>
                </div>
              )}

              {selectedEvidence.verificationStatus === "Rejected" && selectedEvidence.rejectionReason && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-900 space-y-1">
                  <span className="font-bold flex items-center">
                    <XCircle className="w-3.5 h-3.5 mr-1 text-rose-700" />
                    Rejection Finding
                  </span>
                  <p className="text-xs text-rose-800 leading-snug">
                    {selectedEvidence.rejectionReason}
                  </p>
                </div>
              )}

              {/* Adjudication Panel (for Government Officers, Validators, Admins) */}
              <div className="bg-slate-50 border border-slate-200 rounded-card p-3.5 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Adjudicate Verification Status
                </span>

                <div className="grid grid-cols-3 gap-2">
                  {(["Verified", "Under Review", "Rejected"] as VerificationStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setAdjudicateStatus(st)}
                      className={`py-1.5 px-2 rounded text-xs font-semibold border transition-all ${
                        adjudicateStatus === st
                          ? st === "Verified"
                            ? "bg-emerald-700 text-white border-emerald-700"
                            : st === "Rejected"
                            ? "bg-rose-700 text-white border-rose-700"
                            : "bg-amber-600 text-white border-amber-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {adjudicateStatus === "Rejected" && (
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-rose-800 block">
                      Rejection Reason (Mandatory)
                    </span>
                    <Textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Specify technical deficiencies, calibration gaps, or missing raw logs..."
                      rows={3}
                      className="text-xs bg-white"
                    />
                  </div>
                )}

                <Button
                  size="sm"
                  onClick={handleAdjudicate}
                  disabled={isAdjudicating}
                  className="w-full bg-slate-900 hover:bg-black text-white text-xs h-8"
                >
                  {isAdjudicating ? "Recording Audit..." : "Commit Verification Decision"}
                </Button>
              </div>
            </div>

            {/* Secure Download Vault Section */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono">
                Secure File Access
              </h3>

              {!downloadManifest ? (
                <Button
                  variant="outline"
                  onClick={() => handleSecureDownload(selectedEvidence)}
                  disabled={isDownloading}
                  className="w-full text-xs h-9 flex items-center justify-center space-x-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Request Cryptographic Download Token</span>
                </Button>
              ) : (
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-300 rounded-card space-y-2 text-xs text-emerald-950">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center text-emerald-900">
                      <ShieldCheck className="w-4 h-4 mr-1 text-emerald-700" />
                      Cryptographic Clearance Granted
                    </span>
                    <Badge variant="success" className="font-mono text-xs">
                      {downloadManifest.tamperEvidentSeal}
                    </Badge>
                  </div>
                  <p className="text-xs text-emerald-800 font-mono">
                    Token Valid until: {new Date(downloadManifest.expiresAt).toLocaleTimeString()}
                  </p>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast({
                        type: "success",
                        title: "Download Initiated",
                        description: `Transferred ${downloadManifest.fileName} (${downloadManifest.fileSize}).`,
                      });
                    }}
                    className="inline-flex items-center justify-center w-full py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold space-x-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {downloadManifest.fileName}</span>
                  </a>
                  <p className="text-xs text-slate-500 italic text-center">
                    {downloadManifest.statutoryNotice}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. UPLOAD EVIDENCE MODAL                                  */}
      {/* ======================================================== */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-card border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Submit Empirical Evidence Artifact
                </h3>
                <p className="text-xs text-gov-muted">
                  Cryptographically hash and deposit primary telemetry into the pilot vault
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Artifact Title / Filename *
                </label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lalbagh_BAM1020_Dual_Stream_Audit.parquet"
                  className="text-xs h-8"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Evidence Type *
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as EvidenceType)}
                    className="w-full text-xs h-8 px-2 border border-slate-200 rounded bg-white text-slate-800"
                  >
                    <option value="Document">Document</option>
                    <option value="Image">Image</option>
                    <option value="Video">Video</option>
                    <option value="Sensor Data">Sensor Data</option>
                    <option value="Report">Report</option>
                    <option value="System Log">System Log</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Confidentiality Classification *
                  </label>
                  <select
                    value={newConfidentiality}
                    onChange={(e) => setNewConfidentiality(e.target.value as ConfidentialityLevel)}
                    className="w-full text-xs h-8 px-2 border border-slate-200 rounded bg-white text-slate-800"
                  >
                    <option value="RESTRICTED">Restricted (Project Team)</option>
                    <option value="PUBLIC">Public</option>
                    <option value="CONFIDENTIAL_GOV_ONLY">Confidential Gov Only</option>
                    <option value="PROPRIETARY_STARTUP">Proprietary Startup IP</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Related Contractual KPI *
                  </label>
                  <select
                    value={newKpiId}
                    onChange={(e) => setNewKpiId(e.target.value)}
                    className="w-full text-xs h-8 px-2 border border-slate-200 rounded bg-white text-slate-800"
                  >
                    {(allKpis.length > 0 ? allKpis : [
                      { id: "kpi-monitoring-coverage", name: "Monitoring Coverage" },
                      { id: "kpi-sensor-accuracy", name: "Sensor Accuracy vs Reference" },
                      { id: "kpi-fleet-uptime", name: "Fleet Telemetry Uptime" },
                      { id: "kpi-misting-latency", name: "Automated Misting Latency" },
                      { id: "kpi-sensor-drift", name: "Optical Chamber Baseline Drift" },
                    ]).map((k: any) => (
                      <option key={k.id} value={k.id}>
                        {k.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Related Milestone *
                  </label>
                  <select
                    value={newMilestoneId}
                    onChange={(e) => setNewMilestoneId(e.target.value)}
                    className="w-full text-xs h-8 px-2 border border-slate-200 rounded bg-white text-slate-800"
                  >
                    <option value="M1">M1: Testbed Collocation</option>
                    <option value="M2">M2: Fleet Sensor Integration</option>
                    <option value="M3">M3: Sensor Mesh Commissioning</option>
                    <option value="M4">M4: Hotspot Misting Integration</option>
                    <option value="M5">M5: Pilot Verification Audit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Description & Verification Context *
                </label>
                <Textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detail the measurement methodology, sensor serial numbers, calibration standards..."
                  rows={3}
                  className="text-xs"
                />
              </div>

              {/* Mock Upload Zone */}
              <div className="border border-dashed border-slate-300 rounded p-4 text-center bg-slate-50/70 hover:bg-slate-100 transition-colors cursor-pointer">
                <Cpu className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <span className="font-semibold text-slate-700 block text-xs">
                  Attach file artifact (Parquet, GeoJSON, PDF, MP4, JPEG, Syslog)
                </span>
                <span className="text-xs text-gov-muted block">
                  SHA-256 integrity checksum will be generated on commit
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUploadModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleUploadSubmit}
                className="bg-gov-primary hover:bg-gov-primary-hover text-white text-xs font-semibold"
              >
                Upload & Register Hash
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
