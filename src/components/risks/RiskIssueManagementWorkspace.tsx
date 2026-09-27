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
  RiskCategory,
  RiskStatus,
  RiskRecord,
  IssueSeverity,
  IssueStatus,
  IssueRecord,
} from "@/database/riskIssueDatabase";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  Search,
  Plus,
  ArrowUpDown,
  ChevronRight,
  Eye,
  X,
  RefreshCw,
  Layers,
  Calendar,
  User,
  Building2,
  Check,
  AlertCircle,
  FileText,
  SlidersHorizontal,
  Grid3X3,
  List,
  Flame,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { AIRiskAnalysisWorkspace } from "./AIRiskAnalysisWorkspace";

interface RiskIssueManagementWorkspaceProps {
  initialTab?: "risks" | "issues" | "ai-risks";
  pilotId?: string;
}

export function RiskIssueManagementWorkspace({
  initialTab = "risks",
  pilotId = "PILOT-UP-UAQ-01",
}: RiskIssueManagementWorkspaceProps) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"risks" | "issues" | "ai-risks">(initialTab);

  // Data lists
  const [risks, setRisks] = useState<RiskRecord[]>([]);
  const [issues, setIssues] = useState<IssueRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Risk Filters & Sorting
  const [riskCategoryFilter, setRiskCategoryFilter] = useState<string>("ALL");
  const [riskStatusFilter, setRiskStatusFilter] = useState<string>("ALL");
  const [riskLevelFilter, setRiskLevelFilter] = useState<string>("ALL");
  const [riskSortBy, setRiskSortBy] = useState<"riskScore" | "dueDate" | "probability" | "impact" | "title">("riskScore");
  const [riskSortOrder, setRiskSortOrder] = useState<"asc" | "desc">("desc");
  const [riskSearchQuery, setRiskSearchQuery] = useState<string>("");

  // Issue Filters & Sorting
  const [issueStatusFilter, setIssueStatusFilter] = useState<string>("ALL");
  const [issueSeverityFilter, setIssueSeverityFilter] = useState<string>("ALL");
  const [issueSortBy, setIssueSortBy] = useState<"deadline" | "severity" | "status" | "title">("deadline");
  const [issueSortOrder, setIssueSortOrder] = useState<"asc" | "desc">("asc");
  const [issueSearchQuery, setIssueSearchQuery] = useState<string>("");

  // Matrix Filter (Cell selected in 5x5 heatmap)
  const [selectedMatrixCell, setSelectedMatrixCell] = useState<{ prob: number; imp: number } | null>(null);

  // Inspector Drawers
  const [selectedRisk, setSelectedRisk] = useState<RiskRecord | null>(null);
  const [riskDrawerOpen, setRiskDrawerOpen] = useState<boolean>(false);
  const [selectedIssue, setSelectedIssue] = useState<IssueRecord | null>(null);
  const [issueDrawerOpen, setIssueDrawerOpen] = useState<boolean>(false);

  // Modals for Creating
  const [showAddRiskModal, setShowAddRiskModal] = useState<boolean>(false);
  const [showAddIssueModal, setShowAddIssueModal] = useState<boolean>(false);

  // New Risk Form State
  const [newRiskTitle, setNewRiskTitle] = useState<string>("");
  const [newRiskCategory, setNewRiskCategory] = useState<RiskCategory>("Technical");
  const [newRiskDesc, setNewRiskDesc] = useState<string>("");
  const [newRiskProb, setNewRiskProb] = useState<number>(3);
  const [newRiskImp, setNewRiskImp] = useState<number>(3);
  const [newRiskMitigation, setNewRiskMitigation] = useState<string>("");
  const [newRiskOwner, setNewRiskOwner] = useState<string>("");
  const [newRiskDueDate, setNewRiskDueDate] = useState<string>("2026-08-31");
  const [newRiskStatus, setNewRiskStatus] = useState<RiskStatus>("Identified");

  // New Issue Form State
  const [newIssueTitle, setNewIssueTitle] = useState<string>("");
  const [newIssueDesc, setNewIssueDesc] = useState<string>("");
  const [newIssueSeverity, setNewIssueSeverity] = useState<IssueSeverity>("Medium");
  const [newIssueOwner, setNewIssueOwner] = useState<string>("");
  const [newIssueDeadline, setNewIssueDeadline] = useState<string>("2026-08-15");
  const [newIssueStatus, setNewIssueStatus] = useState<IssueStatus>("Open");
  const [newIssueResolution, setNewIssueResolution] = useState<string>("");

  // Edit / Status Update State
  const [editRiskStatus, setEditRiskStatus] = useState<RiskStatus>("Mitigating");
  const [editRiskMitigation, setEditRiskMitigation] = useState<string>("");
  const [editIssueStatus, setEditIssueStatus] = useState<IssueStatus>("In Progress");
  const [editIssueResolution, setEditIssueResolution] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Fetch all risks and issues
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/risks-issues?pilotId=${pilotId}`);
      const json = await res.json();
      if (json.success) {
        setRisks(json.risks || []);
        setIssues(json.issues || []);
      }
    } catch (err) {
      console.error("Failed to fetch risk/issue data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pilotId]);

  // Sync initial tab when changed by parent
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // -------------------------------------------------------------
  // Filtered & Sorted Risks
  // -------------------------------------------------------------
  const filteredRisks = useMemo(() => {
    return risks.filter((r) => {
      if (riskCategoryFilter !== "ALL" && r.category !== riskCategoryFilter) return false;
      if (riskStatusFilter !== "ALL" && r.status !== riskStatusFilter) return false;

      if (riskLevelFilter === "HIGH" && r.riskScore < 15) return false;
      if (riskLevelFilter === "MEDIUM" && (r.riskScore < 7 || r.riskScore >= 15)) return false;
      if (riskLevelFilter === "LOW" && r.riskScore >= 7) return false;

      if (selectedMatrixCell) {
        if (r.probability !== selectedMatrixCell.prob || r.impact !== selectedMatrixCell.imp) {
          return false;
        }
      }

      if (riskSearchQuery.trim()) {
        const q = riskSearchQuery.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchDesc = r.description.toLowerCase().includes(q);
        const matchOwner = r.owner.toLowerCase().includes(q);
        const matchMitigation = r.mitigation.toLowerCase().includes(q);
        const matchCat = r.category.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchOwner && !matchMitigation && !matchCat) return false;
      }

      return true;
    }).sort((a, b) => {
      const order = riskSortOrder === "asc" ? 1 : -1;
      if (riskSortBy === "riskScore") return (a.riskScore - b.riskScore) * order;
      if (riskSortBy === "probability") return (a.probability - b.probability) * order;
      if (riskSortBy === "impact") return (a.impact - b.impact) * order;
      if (riskSortBy === "dueDate") return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * order;
      if (riskSortBy === "title") return a.title.localeCompare(b.title) * order;
      return 0;
    });
  }, [risks, riskCategoryFilter, riskStatusFilter, riskLevelFilter, selectedMatrixCell, riskSearchQuery, riskSortBy, riskSortOrder]);

  // -------------------------------------------------------------
  // Filtered & Sorted Issues
  // -------------------------------------------------------------
  const filteredIssues = useMemo(() => {
    const severityRank: Record<IssueSeverity, number> = {
      Critical: 4,
      High: 3,
      Medium: 2,
      Low: 1,
    };

    return issues.filter((i) => {
      if (issueStatusFilter !== "ALL" && i.status !== issueStatusFilter) return false;
      if (issueSeverityFilter !== "ALL" && i.severity !== issueSeverityFilter) return false;

      if (issueSearchQuery.trim()) {
        const q = issueSearchQuery.toLowerCase();
        const matchTitle = i.title.toLowerCase().includes(q);
        const matchDesc = i.description.toLowerCase().includes(q);
        const matchOwner = i.owner.toLowerCase().includes(q);
        const matchRes = i.resolution.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchOwner && !matchRes) return false;
      }

      return true;
    }).sort((a, b) => {
      const order = issueSortOrder === "asc" ? 1 : -1;
      if (issueSortBy === "severity") return (severityRank[a.severity] - severityRank[b.severity]) * order;
      if (issueSortBy === "deadline") return (new Date(a.deadline).getTime() - new Date(b.deadline).getTime()) * order;
      if (issueSortBy === "status") return a.status.localeCompare(b.status) * order;
      if (issueSortBy === "title") return a.title.localeCompare(b.title) * order;
      return 0;
    });
  }, [issues, issueStatusFilter, issueSeverityFilter, issueSearchQuery, issueSortBy, issueSortOrder]);

  // -------------------------------------------------------------
  // Summary Stats
  // -------------------------------------------------------------
  const riskStats = useMemo(() => {
    const total = risks.length;
    const high = risks.filter((r) => r.riskScore >= 15).length;
    const medium = risks.filter((r) => r.riskScore >= 7 && r.riskScore < 15).length;
    const low = risks.filter((r) => r.riskScore < 7).length;
    const mitigating = risks.filter((r) => r.status === "Mitigating").length;
    return { total, high, medium, low, mitigating };
  }, [risks]);

  const issueStats = useMemo(() => {
    const total = issues.length;
    const open = issues.filter((i) => i.status === "Open").length;
    const inProgress = issues.filter((i) => i.status === "In Progress").length;
    const blocked = issues.filter((i) => i.status === "Blocked").length;
    const resolved = issues.filter((i) => i.status === "Resolved").length;
    const closed = issues.filter((i) => i.status === "Closed").length;
    return { total, open, inProgress, blocked, resolved, closed };
  }, [issues]);

  // Open Risk Inspector Drawer
  const openRiskDrawer = (risk: RiskRecord) => {
    setSelectedRisk(risk);
    setEditRiskStatus(risk.status);
    setEditRiskMitigation(risk.mitigation);
    setRiskDrawerOpen(true);
  };

  // Open Issue Inspector Drawer
  const openIssueDrawer = (issue: IssueRecord) => {
    setSelectedIssue(issue);
    setEditIssueStatus(issue.status);
    setEditIssueResolution(issue.resolution);
    setIssueDrawerOpen(true);
  };

  // Update Risk Status / Mitigation
  const handleSaveRiskChanges = async () => {
    if (!selectedRisk) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/risks-issues/${selectedRisk.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: "risk",
          status: editRiskStatus,
          mitigation: editRiskMitigation,
        }),
      });
      const json = await res.json();
      if (json.success && json.risk) {
        setSelectedRisk(json.risk);
        setRisks((prev) => prev.map((r) => (r.id === json.risk.id ? json.risk : r)));
        showToast({
          type: "success",
          title: "Risk Profile Updated",
          description: `Status updated to ${editRiskStatus} with revised mitigation strategy.`,
        });
      } else {
        showToast({ type: "error", title: "Update Failed", description: json.error || "Failed to update risk." });
      }
    } catch (err: any) {
      showToast({ type: "error", title: "Network Error", description: err.message });
    } finally {
      setIsUpdating(false);
    }
  };

  // Update Issue Status / Resolution
  const handleSaveIssueChanges = async () => {
    if (!selectedIssue) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/risks-issues/${selectedIssue.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: "issue",
          status: editIssueStatus,
          resolution: editIssueResolution,
        }),
      });
      const json = await res.json();
      if (json.success && json.issue) {
        setSelectedIssue(json.issue);
        setIssues((prev) => prev.map((i) => (i.id === json.issue.id ? json.issue : i)));
        showToast({
          type: "success",
          title: "Issue Status Updated",
          description: `Issue marked as ${editIssueStatus}.`,
        });
      } else {
        showToast({ type: "error", title: "Update Failed", description: json.error || "Failed to update issue." });
      }
    } catch (err: any) {
      showToast({ type: "error", title: "Network Error", description: err.message });
    } finally {
      setIsUpdating(false);
    }
  };

  // Create New Risk
  const handleCreateRisk = async () => {
    if (!newRiskTitle.trim() || !newRiskMitigation.trim()) {
      showToast({ type: "error", title: "Missing Information", description: "Title and mitigation plan are required." });
      return;
    }
    try {
      const res = await fetch("/api/risks-issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: "risk",
          title: newRiskTitle.trim(),
          category: newRiskCategory,
          description: newRiskDesc.trim() || "Identified during municipal pilot oversight.",
          probability: newRiskProb,
          impact: newRiskImp,
          owner: newRiskOwner.trim() || (currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Pilot Coordinator"),
          mitigation: newRiskMitigation.trim(),
          status: newRiskStatus,
          dueDate: newRiskDueDate,
          pilotId,
        }),
      });
      const json = await res.json();
      if (json.success && json.risk) {
        setRisks((prev) => [json.risk, ...prev]);
        setShowAddRiskModal(false);
        setNewRiskTitle("");
        setNewRiskDesc("");
        setNewRiskMitigation("");
        showToast({
          type: "success",
          title: "Risk Registered",
          description: `Logged ${json.risk.id}: ${json.risk.title} (Score: ${json.risk.riskScore}).`,
        });
      } else {
        showToast({ type: "error", title: "Registration Failed", description: json.error });
      }
    } catch (err: any) {
      showToast({ type: "error", title: "Network Error", description: err.message });
    }
  };

  // Create New Issue
  const handleCreateIssue = async () => {
    if (!newIssueTitle.trim()) {
      showToast({ type: "error", title: "Missing Title", description: "Please enter an issue title." });
      return;
    }
    try {
      const res = await fetch("/api/risks-issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: "issue",
          title: newIssueTitle.trim(),
          description: newIssueDesc.trim() || "Operational ticket flagged on municipal testbed.",
          severity: newIssueSeverity,
          owner: newIssueOwner.trim() || (currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Field Engineer"),
          deadline: newIssueDeadline,
          status: newIssueStatus,
          resolution: newIssueResolution.trim(),
          pilotId,
        }),
      });
      const json = await res.json();
      if (json.success && json.issue) {
        setIssues((prev) => [json.issue, ...prev]);
        setShowAddIssueModal(false);
        setNewIssueTitle("");
        setNewIssueDesc("");
        setNewIssueResolution("");
        showToast({
          type: "success",
          title: "Issue Reported",
          description: `Logged ${json.issue.id}: ${json.issue.title}.`,
        });
      } else {
        showToast({ type: "error", title: "Report Failed", description: json.error });
      }
    } catch (err: any) {
      showToast({ type: "error", title: "Network Error", description: err.message });
    }
  };

  // -------------------------------------------------------------
  // Visual Helpers (Restrained, Professional Civic Palette)
  // Avoids garish neon red/yellow overload!
  // -------------------------------------------------------------
  const renderRiskScorePill = (score: number) => {
    if (score >= 15) {
      // High Risk: Deep charcoal with crisp subtle crimson accent
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-900 text-rose-300 border border-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1.5 animate-pulse" />
          Score {score} • High
        </span>
      );
    } else if (score >= 7) {
      // Medium Risk: Calm stone with warm amber accent
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-1.5" />
          Score {score} • Medium
        </span>
      );
    } else {
      // Low Risk: Subtle sage / slate
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5" />
          Score {score} • Low
        </span>
      );
    }
  };

  const renderRiskStatusBadge = (status: RiskStatus) => {
    switch (status) {
      case "Mitigating":
        return (
          <Badge variant="outline" className="font-mono text-[9.5px] bg-slate-50 text-slate-800 border-slate-300">
            MITIGATING
          </Badge>
        );
      case "Identified":
        return (
          <Badge variant="outline" className="font-mono text-[9.5px] bg-amber-50/60 text-amber-900 border-amber-200">
            IDENTIFIED
          </Badge>
        );
      case "Accepted":
        return (
          <Badge variant="outline" className="font-mono text-[9.5px] bg-blue-50 text-blue-800 border-blue-200">
            ACCEPTED
          </Badge>
        );
      case "Closed":
        return (
          <Badge variant="outline" className="font-mono text-[9.5px] bg-emerald-50 text-emerald-800 border-emerald-200">
            CLOSED
          </Badge>
        );
      case "Escalated":
        return (
          <Badge variant="outline" className="font-mono text-[9.5px] bg-rose-50 text-rose-800 border-rose-300">
            ESCALATED
          </Badge>
        );
    }
  };

  const renderIssueSeverityBadge = (severity: IssueSeverity) => {
    switch (severity) {
      case "Critical":
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-rose-300 border border-slate-700 inline-flex items-center">
            CRITICAL
          </span>
        );
      case "High":
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 inline-flex items-center">
            HIGH
          </span>
        );
      case "Medium":
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 inline-flex items-center">
            MEDIUM
          </span>
        );
      case "Low":
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200 inline-flex items-center">
            LOW
          </span>
        );
    }
  };

  const renderIssueStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case "Open":
        return (
          <Badge variant="outline" className="font-mono text-[9.5px] bg-blue-50 text-blue-800 border-blue-200">
            OPEN
          </Badge>
        );
      case "In Progress":
        return (
          <Badge variant="outline" className="font-mono text-[9.5px] bg-amber-50/80 text-amber-800 border-amber-200">
            IN PROGRESS
          </Badge>
        );
      case "Blocked":
        return (
          <Badge variant="destructive" className="font-mono text-[9.5px] bg-rose-50 text-rose-800 border-rose-200">
            BLOCKED
          </Badge>
        );
      case "Resolved":
        return (
          <Badge variant="success" className="font-mono text-[9.5px]">
            RESOLVED
          </Badge>
        );
      case "Closed":
        return (
          <Badge variant="outline" className="font-mono text-[9.5px] bg-slate-100 text-slate-600 border-slate-300">
            CLOSED
          </Badge>
        );
    }
  };

  const renderCategoryChip = (category: RiskCategory) => {
    return (
      <span className="font-mono text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
        {category}
      </span>
    );
  };

  return (
    <div className="space-y-6 text-left">
      {/* ======================================================== */}
      {/* 1. HEADER & EXECUTIVE METRICS BAR                         */}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-200 rounded-card p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="default" className="bg-gov-primary font-mono text-[10px]">
                RISK & ISSUE OVERSIGHT
              </Badge>
              <span className="text-xs font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-gov-primary" />
                Statutory Civic Governance
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Risk Register & Operational Field Issue Management
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              Proactive mitigation of technical, financial, and regulatory risks coupled with real-time field issue remediation across municipal testbeds.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              className="text-xs flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              <span>Refresh</span>
            </Button>

            {activeTab === "risks" ? (
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowAddRiskModal(true)}
                className="bg-gov-primary hover:bg-gov-primary-hover text-white text-xs flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Register Risk</span>
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowAddIssueModal(true)}
                className="bg-gov-primary hover:bg-gov-primary-hover text-white text-xs flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Report Field Issue</span>
              </Button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 pt-2">
          <button
            onClick={() => setActiveTab("risks")}
            className={`flex items-center space-x-2 py-2.5 px-4 font-semibold text-xs border-b-2 transition-all ${
              activeTab === "risks"
                ? "border-gov-primary text-gov-primary font-bold bg-slate-50/80"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-gov-primary" />
            <span>Risk Register ({risks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("issues")}
            className={`flex items-center space-x-2 py-2.5 px-4 font-semibold text-xs border-b-2 transition-all ${
              activeTab === "issues"
                ? "border-gov-primary text-gov-primary font-bold bg-slate-50/80"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Issue Tracker ({issues.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("ai-risks")}
            className={`flex items-center space-x-2 py-2.5 px-4 font-semibold text-xs border-b-2 transition-all ${
              activeTab === "ai-risks"
                ? "border-purple-600 text-purple-900 font-bold bg-purple-50/60"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>AI Risk Suggestions</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-medium">Advisory</span>
          </button>
        </div>

        {/* Operational Statistics Ribbon */}
        {activeTab === "risks" ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-gov-muted uppercase font-mono block">TOTAL RISKS</span>
              <span className="text-lg font-bold text-slate-900 font-mono">{riskStats.total}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 text-white border border-slate-800">
              <span className="text-[10px] text-rose-300 uppercase font-mono block">HIGH EXPOSURE (≥15)</span>
              <span className="text-lg font-bold text-rose-200 font-mono">{riskStats.high}</span>
            </div>
            <div className="p-2.5 rounded bg-amber-50/70 border border-amber-200">
              <span className="text-[10px] text-amber-800 uppercase font-mono block">MEDIUM (7-14)</span>
              <span className="text-lg font-bold text-amber-900 font-mono">{riskStats.medium}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-600 uppercase font-mono block">LOW IMPACT (&lt;7)</span>
              <span className="text-lg font-bold text-slate-800 font-mono">{riskStats.low}</span>
            </div>
            <div className="p-2.5 rounded bg-blue-50/70 border border-blue-200">
              <span className="text-[10px] text-blue-800 uppercase font-mono block">ACTIVELY MITIGATING</span>
              <span className="text-lg font-bold text-blue-900 font-mono">{riskStats.mitigating}</span>
            </div>
          </div>
        ) : activeTab === "issues" ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-gov-muted uppercase font-mono block">TOTAL ISSUES</span>
              <span className="text-lg font-bold text-slate-900 font-mono">{issueStats.total}</span>
            </div>
            <div className="p-2.5 rounded bg-blue-50/80 border border-blue-200">
              <span className="text-[10px] text-blue-800 uppercase font-mono block">OPEN TICKETS</span>
              <span className="text-lg font-bold text-blue-900 font-mono">{issueStats.open}</span>
            </div>
            <div className="p-2.5 rounded bg-amber-50/80 border border-amber-200">
              <span className="text-[10px] text-amber-800 uppercase font-mono block">IN PROGRESS</span>
              <span className="text-lg font-bold text-amber-900 font-mono">{issueStats.inProgress}</span>
            </div>
            <div className="p-2.5 rounded bg-rose-50/80 border border-rose-200">
              <span className="text-[10px] text-rose-800 uppercase font-mono block">BLOCKED</span>
              <span className="text-lg font-bold text-rose-900 font-mono">{issueStats.blocked}</span>
            </div>
            <div className="p-2.5 rounded bg-emerald-50/80 border border-emerald-200">
              <span className="text-[10px] text-emerald-800 uppercase font-mono block">RESOLVED & CLOSED</span>
              <span className="text-lg font-bold text-emerald-900 font-mono">
                {issueStats.resolved + issueStats.closed}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-purple-50/60 border border-purple-200/80 rounded flex items-center justify-between text-xs text-purple-900">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span>
                <strong>AI-Assisted Risk Analysis Active:</strong> Identifies potential Technical, Operational, Data, Cybersecurity, Financial, and Timeline risks grounded in pilot evidence. Non-decisional advisory only.
              </span>
            </div>
            <Link
              href="/risks-issues/ai-analysis"
              className="text-[11px] font-semibold text-purple-700 hover:underline flex items-center space-x-1"
            >
              <span>Full Screen View</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. TAB A: RISK REGISTER VIEW                             */}
      {/* ======================================================== */}
      {activeTab === "risks" && (
        <div className="space-y-5">
          {/* Restrained 5x5 Heatmap Matrix & Category Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* 5x5 Probability x Impact Matrix */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-card p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase font-mono">
                    Probability vs Impact Risk Matrix
                  </h3>
                  <p className="text-[11px] text-gov-muted">
                    Click any cell to filter risks by coordinate density
                  </p>
                </div>
                {selectedMatrixCell && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMatrixCell(null)}
                    className="h-6 text-[10px] px-2 text-slate-600"
                  >
                    Clear Filter
                  </Button>
                )}
              </div>

              {/* 5x5 Grid Table */}
              <div className="overflow-x-auto">
                <div className="min-w-[280px] space-y-1 text-xs">
                  {/* Y-Axis Label & Grid rows (5 down to 1) */}
                  {[5, 4, 3, 2, 1].map((prob) => (
                    <div key={prob} className="flex items-center space-x-1.5">
                      <span className="w-12 text-[10px] font-mono text-slate-500 text-right pr-1">
                        P{prob}
                      </span>
                      <div className="grid grid-cols-5 gap-1.5 flex-1">
                        {[1, 2, 3, 4, 5].map((imp) => {
                          const cellScore = prob * imp;
                          const count = risks.filter((r) => r.probability === prob && r.impact === imp).length;
                          const isSelected = selectedMatrixCell?.prob === prob && selectedMatrixCell?.imp === imp;

                          // Restrained, non-excessive shading:
                          let bgClass = "bg-slate-50 text-slate-600 border-slate-200";
                          if (cellScore >= 15) {
                            bgClass = count > 0 ? "bg-slate-800 text-rose-200 border-slate-700" : "bg-slate-100 text-slate-400 border-slate-200";
                          } else if (cellScore >= 7) {
                            bgClass = count > 0 ? "bg-amber-100 text-amber-900 border-amber-300" : "bg-slate-50 text-slate-400 border-slate-200";
                          } else {
                            bgClass = count > 0 ? "bg-slate-200 text-slate-800 border-slate-300" : "bg-slate-50 text-slate-400 border-slate-200";
                          }

                          return (
                            <button
                              key={imp}
                              type="button"
                              onClick={() => {
                                if (isSelected) setSelectedMatrixCell(null);
                                else setSelectedMatrixCell({ prob, imp });
                              }}
                              className={`h-8 rounded border text-xs font-mono font-bold flex items-center justify-center transition-all ${bgClass} ${
                                isSelected ? "ring-2 ring-gov-primary scale-105" : "hover:opacity-80"
                              }`}
                              title={`P${prob} × I${imp} (Score ${cellScore}) - ${count} risk(s)`}
                            >
                              {count > 0 ? count : ""}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* X-Axis Labels */}
                  <div className="flex items-center space-x-1.5 pt-1">
                    <span className="w-12"></span>
                    <div className="grid grid-cols-5 gap-1.5 flex-1 text-center font-mono text-[10px] text-slate-500">
                      <span>I1 (Negl)</span>
                      <span>I2 (Min)</span>
                      <span>I3 (Mod)</span>
                      <span>I4 (Maj)</span>
                      <span>I5 (Cat)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 8 Risk Categories Distribution Breakdown */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-card p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono">
                  Statutory Categories (8 Areas)
                </h3>
                <span className="text-[10px] text-gov-muted font-mono">
                  {riskCategoryFilter === "ALL" ? "All Categories Active" : `Filtered: ${riskCategoryFilter}`}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  "Technical",
                  "Financial",
                  "Operational",
                  "Legal",
                  "Cybersecurity",
                  "Data",
                  "Procurement",
                  "Timeline",
                ].map((cat) => {
                  const count = risks.filter((r) => r.category === cat).length;
                  const isSelected = riskCategoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setRiskCategoryFilter(isSelected ? "ALL" : cat)}
                      className={`p-2 rounded text-left border transition-all text-xs ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                          : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span className="font-semibold block truncate text-[11px]">{cat}</span>
                      <span className={`text-[10px] font-mono block mt-0.5 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                        {count} {count === 1 ? "Risk" : "Risks"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Risk Filters & Sorting Controls */}
          <div className="bg-white border border-slate-200 rounded-card p-3.5 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {/* Search */}
              <div className="sm:col-span-2 relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <Input
                  value={riskSearchQuery}
                  onChange={(e) => setRiskSearchQuery(e.target.value)}
                  placeholder="Search risk title, mitigation, owner..."
                  className="pl-8 text-xs h-8"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={riskStatusFilter}
                  onChange={(e) => setRiskStatusFilter(e.target.value)}
                  className="w-full text-xs h-8 px-2 border border-slate-200 rounded bg-white text-slate-800"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Identified">Identified</option>
                  <option value="Mitigating">Mitigating</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Closed">Closed</option>
                  <option value="Escalated">Escalated</option>
                </select>
              </div>

              {/* Level Filter */}
              <div>
                <select
                  value={riskLevelFilter}
                  onChange={(e) => setRiskLevelFilter(e.target.value)}
                  className="w-full text-xs h-8 px-2 border border-slate-200 rounded bg-white text-slate-800"
                >
                  <option value="ALL">All Score Levels</option>
                  <option value="HIGH">High (15 - 25)</option>
                  <option value="MEDIUM">Medium (7 - 14)</option>
                  <option value="LOW">Low (1 - 6)</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <select
                  value={riskSortBy}
                  onChange={(e) => setRiskSortBy(e.target.value as any)}
                  className="w-full text-xs h-8 px-2 border border-slate-200 rounded bg-white text-slate-800"
                >
                  <option value="riskScore">Sort by Risk Score</option>
                  <option value="dueDate">Sort by Due Date</option>
                  <option value="probability">Sort by Probability</option>
                  <option value="impact">Sort by Impact</option>
                  <option value="title">Sort by Title (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Risk Register Table */}
          <div className="bg-white border border-slate-200 rounded-card shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-gov-muted uppercase font-mono text-[10px]">
                    <th className="py-2.5 px-3 font-semibold">Risk & Category</th>
                    <th className="py-2.5 px-3 font-semibold text-center">P × I</th>
                    <th className="py-2.5 px-3 font-semibold">Risk Score</th>
                    <th className="py-2.5 px-3 font-semibold">Mitigation Covenant</th>
                    <th className="py-2.5 px-3 font-semibold">Owner & Due Date</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRisks.map((risk) => (
                    <tr key={risk.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Title & Category */}
                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-mono text-[10px] text-gov-muted font-bold">{risk.id}</span>
                            {renderCategoryChip(risk.category)}
                          </div>
                          <button
                            onClick={() => openRiskDrawer(risk)}
                            className="font-bold text-slate-900 hover:text-gov-primary text-left text-xs line-clamp-1 block"
                          >
                            {risk.title}
                          </button>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {risk.description}
                          </p>
                        </div>
                      </td>

                      {/* Prob x Impact */}
                      <td className="py-3 px-3 text-center font-mono text-xs text-slate-700">
                        P{risk.probability} × I{risk.impact}
                      </td>

                      {/* Score */}
                      <td className="py-3 px-3">
                        {renderRiskScorePill(risk.riskScore)}
                      </td>

                      {/* Mitigation */}
                      <td className="py-3 px-3 max-w-xs">
                        <p className="text-[11px] text-slate-700 leading-snug line-clamp-2">
                          {risk.mitigation}
                        </p>
                      </td>

                      {/* Owner & Due Date */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800 text-xs truncate max-w-[130px]">
                          {risk.owner}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 flex items-center mt-0.5">
                          <Calendar className="w-3 h-3 mr-1" />
                          {risk.dueDate}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        {renderRiskStatusBadge(risk.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRiskDrawer(risk)}
                          className="h-7 text-xs px-2.5"
                        >
                          <Eye className="w-3 h-3 mr-1" /> Details
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {filteredRisks.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-gov-muted">
                        No risks matching the selected filters.
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
      {/* 3. TAB B: ISSUE TRACKER VIEW                             */}
      {/* ======================================================== */}
      {activeTab === "issues" && (
        <div className="space-y-5">
          {/* Issue Filters & Sorting Controls */}
          <div className="bg-white border border-slate-200 rounded-card p-3.5 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              {/* Search */}
              <div className="sm:col-span-1 relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <Input
                  value={issueSearchQuery}
                  onChange={(e) => setIssueSearchQuery(e.target.value)}
                  placeholder="Search issues, resolutions..."
                  className="pl-8 text-xs h-8"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={issueStatusFilter}
                  onChange={(e) => setIssueStatusFilter(e.target.value)}
                  className="w-full text-xs h-8 px-2 border border-slate-200 rounded bg-white text-slate-800"
                >
                  <option value="ALL">All Statuses (Open, In Progress, Blocked, Resolved, Closed)</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Severity Filter */}
              <div>
                <select
                  value={issueSeverityFilter}
                  onChange={(e) => setIssueSeverityFilter(e.target.value)}
                  className="w-full text-xs h-8 px-2 border border-slate-200 rounded bg-white text-slate-800"
                >
                  <option value="ALL">All Severities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <select
                  value={issueSortBy}
                  onChange={(e) => setIssueSortBy(e.target.value as any)}
                  className="w-full text-xs h-8 px-2 border border-slate-200 rounded bg-white text-slate-800"
                >
                  <option value="deadline">Sort by Deadline (Nearest)</option>
                  <option value="severity">Sort by Severity</option>
                  <option value="status">Sort by Status</option>
                  <option value="title">Sort by Title (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Issue Cards Grid */}
          <div className="space-y-3">
            {filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="bg-white border border-slate-200 rounded-card p-4 shadow-2xs hover:border-slate-300 transition-all space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-gov-accent">{issue.id}</span>
                    <button
                      onClick={() => openIssueDrawer(issue)}
                      className="font-bold text-slate-900 text-xs hover:text-gov-primary text-left"
                    >
                      {issue.title}
                    </button>
                    {issue.relatedRiskId && (
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        Linked: {issue.relatedRiskId}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {renderIssueSeverityBadge(issue.severity)}
                    {renderIssueStatusBadge(issue.status)}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {issue.description}
                </p>

                {issue.resolution && (
                  <div className="bg-slate-50/80 p-2.5 rounded border border-slate-200/80 text-xs">
                    <span className="text-[10px] font-mono text-gov-muted uppercase font-bold block">
                      RESOLUTION AUDIT / REMEDIATION PLAN
                    </span>
                    <p className="text-slate-800 text-[11.5px] leading-relaxed mt-0.5">
                      {issue.resolution}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <div className="flex items-center space-x-4">
                    <span>
                      Owner: <strong className="text-slate-700">{issue.owner}</strong>
                    </span>
                    <span className="font-mono">
                      Deadline: <strong className="text-slate-700">{issue.deadline}</strong>
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openIssueDrawer(issue)}
                    className="h-6 text-[10px] px-2.5"
                  >
                    <Eye className="w-3 h-3 mr-1" /> Inspect / Update
                  </Button>
                </div>
              </div>
            ))}

            {filteredIssues.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-card p-8 text-center text-xs text-gov-muted">
                No issues matching the selected filters.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. TAB C: AI RISK ANALYSIS ADVISORY WORKSPACE            */}
      {/* ======================================================== */}
      {activeTab === "ai-risks" && (
        <AIRiskAnalysisWorkspace pilotId={pilotId} />
      )}

      {/* ======================================================== */}
      {/* 4. RISK INSPECTOR DRAWER                                 */}
      {/* ======================================================== */}
      {riskDrawerOpen && selectedRisk && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto p-6 space-y-5 text-left border-l border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-mono text-xs font-bold text-gov-accent">{selectedRisk.id}</span>
                  {renderCategoryChip(selectedRisk.category)}
                  {renderRiskStatusBadge(selectedRisk.status)}
                </div>
                <h2 className="text-base font-bold text-slate-900 leading-snug">
                  {selectedRisk.title}
                </h2>
              </div>
              <button
                onClick={() => setRiskDrawerOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score & Coordinates */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-card space-y-2">
              <span className="text-[10px] text-gov-muted uppercase font-mono font-bold block">
                QUANTITATIVE RISK CALCULATION
              </span>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-gov-muted block">PROBABILITY</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">Level {selectedRisk.probability} / 5</span>
                </div>
                <div>
                  <span className="text-[10px] text-gov-muted block">IMPACT</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">Level {selectedRisk.impact} / 5</span>
                </div>
                <div>
                  <span className="text-[10px] text-gov-muted block">AGGREGATE SCORE</span>
                  {renderRiskScorePill(selectedRisk.riskScore)}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono">Description</h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded border border-slate-200">
                {selectedRisk.description}
              </p>
            </div>

            {/* Owner & Due Date */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-white border border-slate-200 rounded-card p-3">
              <div>
                <span className="text-[10px] text-gov-muted block uppercase">ASSIGNED OWNER</span>
                <span className="font-bold text-slate-800">{selectedRisk.owner}</span>
              </div>
              <div>
                <span className="text-[10px] text-gov-muted block uppercase">MITIGATION DUE DATE</span>
                <span className="font-mono font-bold text-slate-800">{selectedRisk.dueDate}</span>
              </div>
            </div>

            {/* Mitigation Strategy & Editing */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono">
                Statutory Mitigation Covenant
              </h3>
              <Textarea
                value={editRiskMitigation}
                onChange={(e) => setEditRiskMitigation(e.target.value)}
                rows={4}
                className="text-xs"
              />

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-800 block">
                  Update Risk Lifecycle Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Mitigating", "Identified", "Accepted", "Closed", "Escalated"] as RiskStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditRiskStatus(st)}
                      className={`py-1.5 px-2 rounded text-xs font-semibold border transition-all ${
                        editRiskStatus === st
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSaveRiskChanges}
                disabled={isUpdating}
                className="w-full bg-gov-primary hover:bg-gov-primary-hover text-white text-xs h-8"
              >
                {isUpdating ? "Saving..." : "Save Risk Covenant Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. ISSUE INSPECTOR DRAWER                                */}
      {/* ======================================================== */}
      {issueDrawerOpen && selectedIssue && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto p-6 space-y-5 text-left border-l border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-mono text-xs font-bold text-gov-accent">{selectedIssue.id}</span>
                  {renderIssueSeverityBadge(selectedIssue.severity)}
                  {renderIssueStatusBadge(selectedIssue.status)}
                </div>
                <h2 className="text-base font-bold text-slate-900 leading-snug">
                  {selectedIssue.title}
                </h2>
              </div>
              <button
                onClick={() => setIssueDrawerOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono">Description</h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded border border-slate-200">
                {selectedIssue.description}
              </p>
            </div>

            {/* Owner & Deadline */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-white border border-slate-200 rounded-card p-3">
              <div>
                <span className="text-[10px] text-gov-muted block uppercase">ASSIGNED OWNER</span>
                <span className="font-bold text-slate-800">{selectedIssue.owner}</span>
              </div>
              <div>
                <span className="text-[10px] text-gov-muted block uppercase">RESOLUTION DEADLINE</span>
                <span className="font-mono font-bold text-slate-800">{selectedIssue.deadline}</span>
              </div>
            </div>

            {/* Resolution & Status Update */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono">
                Remediation / Resolution Audit Notes
              </h3>
              <Textarea
                value={editIssueResolution}
                onChange={(e) => setEditIssueResolution(e.target.value)}
                placeholder="Log field diagnostics, spare parts replaced, and firmware patch IDs..."
                rows={4}
                className="text-xs"
              />

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-800 block">
                  Update Issue Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Open", "In Progress", "Blocked", "Resolved", "Closed"] as IssueStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditIssueStatus(st)}
                      className={`py-1.5 px-2 rounded text-xs font-semibold border transition-all ${
                        editIssueStatus === st
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSaveIssueChanges}
                disabled={isUpdating}
                className="w-full bg-gov-primary hover:bg-gov-primary-hover text-white text-xs h-8"
              >
                {isUpdating ? "Saving..." : "Update Issue Status"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. ADD RISK MODAL                                        */}
      {/* ======================================================== */}
      {showAddRiskModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-card border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Register Statutory Pilot Risk
                </h3>
                <p className="text-[11px] text-gov-muted">
                  Log threat across 8 risk areas with binding mitigation plan
                </p>
              </div>
              <button
                onClick={() => setShowAddRiskModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Risk Title *
                </label>
                <Input
                  value={newRiskTitle}
                  onChange={(e) => setNewRiskTitle(e.target.value)}
                  placeholder="e.g. Optical Sensor Ingress During Monsoon"
                  className="text-xs h-8"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Risk Category *
                  </label>
                  <select
                    value={newRiskCategory}
                    onChange={(e) => setNewRiskCategory(e.target.value as RiskCategory)}
                    className="w-full text-xs h-8 px-2 border border-slate-200 rounded bg-white text-slate-800"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Financial">Financial</option>
                    <option value="Operational">Operational</option>
                    <option value="Legal">Legal</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Data">Data</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Timeline">Timeline</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Mitigation Due Date
                  </label>
                  <Input
                    type="date"
                    value={newRiskDueDate}
                    onChange={(e) => setNewRiskDueDate(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Probability (1: Low to 5: Very High): {newRiskProb}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={newRiskProb}
                    onChange={(e) => setNewRiskProb(Number(e.target.value))}
                    className="w-full accent-gov-primary"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Impact (1: Negligible to 5: Catastrophic): {newRiskImp}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={newRiskImp}
                    onChange={(e) => setNewRiskImp(Number(e.target.value))}
                    className="w-full accent-gov-primary"
                  />
                </div>
              </div>

              <div className="p-2 bg-slate-50 border border-slate-200 rounded text-center">
                <span className="text-[10px] text-gov-muted uppercase font-mono mr-2">CALCULATED RISK SCORE:</span>
                {renderRiskScorePill(newRiskProb * newRiskImp)}
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Responsible Owner
                </label>
                <Input
                  value={newRiskOwner}
                  onChange={(e) => setNewRiskOwner(e.target.value)}
                  placeholder="e.g. Dr. Rohan Varma (CTO, AirSense)"
                  className="text-xs h-8"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Description & Context
                </label>
                <Textarea
                  value={newRiskDesc}
                  onChange={(e) => setNewRiskDesc(e.target.value)}
                  placeholder="Detail the operational failure mode or exposure..."
                  rows={2}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Mitigation Plan / Contingency Covenant *
                </label>
                <Textarea
                  value={newRiskMitigation}
                  onChange={(e) => setNewRiskMitigation(e.target.value)}
                  placeholder="Binding engineering or procedural safeguard..."
                  rows={2}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddRiskModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreateRisk}
                className="bg-gov-primary hover:bg-gov-primary-hover text-white text-xs font-semibold"
              >
                Commit to Risk Register
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. ADD ISSUE MODAL                                       */}
      {/* ======================================================== */}
      {showAddIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-card border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Report Operational Field Issue
                </h3>
                <p className="text-[11px] text-gov-muted">
                  Log an active failure, maintenance blockage, or telemetry disruption
                </p>
              </div>
              <button
                onClick={() => setShowAddIssueModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Issue Title *
                </label>
                <Input
                  value={newIssueTitle}
                  onChange={(e) => setNewIssueTitle(e.target.value)}
                  placeholder="e.g. Node AS-LKO-018 Gateway Dropout"
                  className="text-xs h-8"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Severity *
                  </label>
                  <select
                    value={newIssueSeverity}
                    onChange={(e) => setNewIssueSeverity(e.target.value as IssueSeverity)}
                    className="w-full text-xs h-8 px-2 border border-slate-200 rounded bg-white text-slate-800"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Resolution Deadline
                  </label>
                  <Input
                    type="date"
                    value={newIssueDeadline}
                    onChange={(e) => setNewIssueDeadline(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Assigned Owner / Response Team
                </label>
                <Input
                  value={newIssueOwner}
                  onChange={(e) => setNewIssueOwner(e.target.value)}
                  placeholder="e.g. Ananya Dixit (Network Operations)"
                  className="text-xs h-8"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Issue Description & Observed Symptoms *
                </label>
                <Textarea
                  value={newIssueDesc}
                  onChange={(e) => setNewIssueDesc(e.target.value)}
                  placeholder="Detail the error logs, affected ward nodes, or hardware state..."
                  rows={3}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Initial Resolution Action (Optional)
                </label>
                <Textarea
                  value={newIssueResolution}
                  onChange={(e) => setNewIssueResolution(e.target.value)}
                  placeholder="Action underway or scheduled field visit..."
                  rows={2}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddIssueModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreateIssue}
                className="bg-gov-primary hover:bg-gov-primary-hover text-white text-xs font-semibold"
              >
                Submit Issue Ticket
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
