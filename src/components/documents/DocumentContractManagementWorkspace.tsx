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
  DocumentType,
  DocumentStatus,
  DocumentAccessLevel,
  DocumentRecord,
  LEGAL_TEMPLATE_DISCLAIMER,
} from "@/database/documentDatabase";
import {
  FileText,
  FileCheck2,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Eye,
  Filter,
  Search,
  Plus,
  ArrowRight,
  GitBranch,
  History,
  Calendar,
  Building2,
  User,
  Check,
  X,
  RefreshCw,
  Lock,
  Unlock,
  Scale,
  Copy,
  ExternalLink,
  BookOpen,
} from "lucide-react";

interface DocumentContractManagementWorkspaceProps {
  pilotId?: string;
  initialTypeFilter?: string;
}

export function DocumentContractManagementWorkspace({
  pilotId = "PILOT-UP-UAQ-01",
  initialTypeFilter = "ALL",
}: DocumentContractManagementWorkspaceProps) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"contracts" | "templates">("contracts");

  // Document list from API
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [typeFilter, setTypeFilter] = useState<string>(initialTypeFilter);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"updatedDate" | "createdDate" | "name" | "type" | "status">("updatedDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Inspector Drawer State
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // New Version Commit Modal State
  const [showVersionModal, setShowVersionModal] = useState<boolean>(false);
  const [newVersionNum, setNewVersionNum] = useState<string>("");
  const [newVersionSummary, setNewVersionSummary] = useState<string>("");
  const [isCommittingVersion, setIsCommittingVersion] = useState<boolean>(false);

  // Upload / Create Document Modal State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newDocName, setNewDocName] = useState<string>("");
  const [newDocType, setNewDocType] = useState<DocumentType>("Pilot Agreement");
  const [newDocOwner, setNewDocOwner] = useState<string>("");
  const [newDocExpiry, setNewDocExpiry] = useState<string>("2027-12-31");
  const [newDocStatus, setNewDocStatus] = useState<DocumentStatus>("Draft");
  const [newDocAccess, setNewDocAccess] = useState<DocumentAccessLevel>("Restricted (Government & Startup)");
  const [newDocDesc, setNewDocDesc] = useState<string>("");
  const [isTemplateDraft, setIsTemplateDraft] = useState<boolean>(false);

  // Fetch Documents
  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/documents?pilotId=${pilotId}`);
      const json = await res.json();
      if (json.success && json.documents) {
        setDocuments(json.documents);
      }
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [pilotId]);

  // Statistics
  const stats = useMemo(() => {
    const executedContracts = documents.filter((d) => !d.isTemplate);
    const templates = documents.filter((d) => d.isTemplate);

    const signed = executedContracts.filter((d) => d.status === "Signed").length;
    const approved = executedContracts.filter((d) => d.status === "Approved").length;
    const underReview = executedContracts.filter((d) => d.status === "Under Review").length;
    const draft = executedContracts.filter((d) => d.status === "Draft").length;
    const expired = executedContracts.filter((d) => d.status === "Expired").length;

    return {
      totalContracts: executedContracts.length,
      totalTemplates: templates.length,
      signed,
      approved,
      underReview,
      draft,
      expired,
    };
  }, [documents]);

  // Filtered & Sorted Documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Tab filter: Active contracts vs Legal Templates
      if (activeTab === "contracts" && doc.isTemplate) return false;
      if (activeTab === "templates" && !doc.isTemplate) return false;

      if (typeFilter !== "ALL" && doc.type !== typeFilter) return false;
      if (statusFilter !== "ALL" && doc.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = doc.name.toLowerCase().includes(q);
        const matchDesc = doc.description.toLowerCase().includes(q);
        const matchOwner = doc.owner.toLowerCase().includes(q);
        const matchType = doc.type.toLowerCase().includes(q);
        const matchHash = doc.sha256Hash.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchOwner && !matchType && !matchHash) return false;
      }

      return true;
    }).sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "updatedDate") return (new Date(a.updatedDate).getTime() - new Date(b.updatedDate).getTime()) * order;
      if (sortBy === "createdDate") return (new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()) * order;
      if (sortBy === "name") return a.name.localeCompare(b.name) * order;
      if (sortBy === "type") return a.type.localeCompare(b.type) * order;
      if (sortBy === "status") return a.status.localeCompare(b.status) * order;
      return 0;
    });
  }, [documents, activeTab, typeFilter, statusFilter, searchQuery, sortBy, sortOrder]);

  // Open Inspector Drawer
  const openInspector = (doc: DocumentRecord) => {
    setSelectedDoc(doc);
    setDrawerOpen(true);
  };

  // Commit a New Version
  const handleCommitNewVersion = async () => {
    if (!selectedDoc || !newVersionNum.trim() || !newVersionSummary.trim()) {
      showToast({
        type: "error",
        title: "Missing Version Information",
        description: "Please specify version identifier (e.g. v2.1) and summary of changes.",
      });
      return;
    }

    setIsCommittingVersion(true);
    try {
      const res = await fetch(`/api/documents/${selectedDoc.id}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          versionNumber: newVersionNum.trim(),
          summaryOfChanges: newVersionSummary.trim(),
          fileSize: selectedDoc.fileSize,
          updatedBy: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Legal Counsel",
        }),
      });

      const json = await res.json();
      if (json.success && json.document) {
        setSelectedDoc(json.document);
        setDocuments((prev) => prev.map((d) => (d.id === json.document.id ? json.document : d)));
        setShowVersionModal(false);
        setNewVersionNum("");
        setNewVersionSummary("");
        showToast({
          type: "success",
          title: "New Version Committed",
          description: `Version ${json.document.version} committed with changelog entry.`,
        });
      } else {
        showToast({ type: "error", title: "Version Commit Failed", description: json.error });
      }
    } catch (err: any) {
      showToast({ type: "error", title: "Network Error", description: err.message });
    } finally {
      setIsCommittingVersion(false);
    }
  };

  // Create Document / Instantiate from Template
  const handleCreateDocument = async () => {
    if (!newDocName.trim()) {
      showToast({ type: "error", title: "Missing Name", description: "Please enter a document title." });
      return;
    }

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newDocName.trim(),
          type: newDocType,
          version: "v1.0",
          owner: newDocOwner.trim() || (currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Directorate of Urban Dev"),
          expiryDate: newDocExpiry,
          status: newDocStatus,
          access: newDocAccess,
          isTemplate: isTemplateDraft,
          description: newDocDesc.trim() || "Statutory agreement executed under municipal innovation framework.",
          pilotId,
          confidentialityLevel:
            newDocAccess === "Public"
              ? "PUBLIC"
              : newDocAccess === "Confidential (Government Only)"
              ? "CONFIDENTIAL_GOV_ONLY"
              : "RESTRICTED",
          signatories: [],
        }),
      });

      const json = await res.json();
      if (json.success && json.document) {
        setDocuments((prev) => [json.document, ...prev]);
        setShowCreateModal(false);
        setNewDocName("");
        setNewDocDesc("");
        showToast({
          type: "success",
          title: "Document Registered",
          description: `Created ${json.document.name} (${json.document.version}).`,
        });
      } else {
        showToast({ type: "error", title: "Creation Failed", description: json.error });
      }
    } catch (err: any) {
      showToast({ type: "error", title: "Network Error", description: err.message });
    }
  };

  // Helper: Status Badges
  const renderStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case "Signed":
        return (
          <Badge variant="success" className="font-mono text-xs flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 mr-0.5" />
            <span>SIGNED & EXECUTED</span>
          </Badge>
        );
      case "Approved":
        return (
          <Badge variant="default" className="font-mono text-xs bg-slate-900 text-white flex items-center space-x-1">
            <Check className="w-3 h-3 mr-0.5" />
            <span>APPROVED</span>
          </Badge>
        );
      case "Under Review":
        return (
          <Badge variant="warning" className="font-mono text-xs bg-amber-50 text-amber-800 border-amber-300 flex items-center space-x-1">
            <Clock className="w-3 h-3 mr-0.5" />
            <span>UNDER REVIEW</span>
          </Badge>
        );
      case "Draft":
        return (
          <Badge variant="outline" className="font-mono text-xs text-slate-600 border-slate-300 flex items-center space-x-1">
            <Clock className="w-3 h-3 mr-0.5" />
            <span>DRAFT</span>
          </Badge>
        );
      case "Expired":
        return (
          <Badge variant="destructive" className="font-mono text-xs bg-rose-50 text-rose-800 border-rose-300 flex items-center space-x-1">
            <XCircle className="w-3 h-3 mr-0.5" />
            <span>EXPIRED</span>
          </Badge>
        );
    }
  };

  // Helper: Type Badges
  const renderTypeChip = (type: DocumentType) => {
    return (
      <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
        {type}
      </span>
    );
  };

  // Helper: Access Badges
  const renderAccessBadge = (access: DocumentAccessLevel) => {
    if (access === "Public") {
      return (
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center">
          <Unlock className="w-2.5 h-2.5 mr-1" />
          Public
        </span>
      );
    } else if (access === "Confidential (Government Only)") {
      return (
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 inline-flex items-center">
          <ShieldAlert className="w-2.5 h-2.5 mr-1" />
          Gov Only
        </span>
      );
    } else if (access === "Procurement Clearance Required") {
      return (
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 inline-flex items-center">
          <Scale className="w-2.5 h-2.5 mr-1" />
          Procurement
        </span>
      );
    } else {
      return (
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center">
          <Lock className="w-2.5 h-2.5 mr-1" />
          Restricted
        </span>
      );
    }
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
              <Badge variant="default" className="bg-gov-primary font-mono text-xs">
                LEGAL & CONTRACT GOVERNANCE
              </Badge>
              <span className="text-xs font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 flex items-center">
                <Scale className="w-3.5 h-3.5 mr-1 text-gov-primary" />
                GFR Rule 149 / DPDP Compliant
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Document, Covenant & Contract Management
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              Lifecycle governance of tripartite agreements, mutual NDAs, intellectual property deeds, and independent validation covenants with cryptographic version history.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDocuments}
              className="text-xs flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              <span>Refresh Vault</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setIsTemplateDraft(activeTab === "templates");
                setShowCreateModal(true);
              }}
              className="bg-gov-primary hover:bg-gov-primary-hover text-white text-xs flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>{activeTab === "templates" ? "Add Legal Template" : "Upload Document"}</span>
            </Button>
          </div>
        </div>

        {/* Tab Navigation: Executed Contracts vs Standard Legal Templates */}
        <div className="flex border-b border-slate-200 pt-2">
          <button
            onClick={() => setActiveTab("contracts")}
            className={`flex items-center space-x-2 py-2.5 px-4 font-semibold text-xs border-b-2 transition-all ${
              activeTab === "contracts"
                ? "border-gov-primary text-gov-primary font-bold bg-slate-50/80"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4 text-gov-primary" />
            <span>Pilot Documents & Contracts ({stats.totalContracts})</span>
          </button>

          <button
            onClick={() => setActiveTab("templates")}
            className={`flex items-center space-x-2 py-2.5 px-4 font-semibold text-xs border-b-2 transition-all ${
              activeTab === "templates"
                ? "border-gov-primary text-gov-primary font-bold bg-slate-50/80"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span>Legal Templates Library ({stats.totalTemplates})</span>
            <span className="text-xs font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold ml-1">
              Advisory
            </span>
          </button>
        </div>

        {/* Operational Statistics Cards */}
        {activeTab === "contracts" ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-xs text-gov-muted uppercase font-mono block">TOTAL DOCUMENTS</span>
              <span className="text-lg font-bold text-slate-900 font-mono">{stats.totalContracts}</span>
            </div>
            <div className="p-2.5 rounded bg-emerald-50/70 border border-emerald-200">
              <span className="text-xs text-emerald-700 uppercase font-mono block">SIGNED & EXECUTED</span>
              <span className="text-lg font-bold text-emerald-800 font-mono">{stats.signed}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 text-white border border-slate-800">
              <span className="text-xs text-slate-300 uppercase font-mono block">APPROVED</span>
              <span className="text-lg font-bold text-white font-mono">{stats.approved}</span>
            </div>
            <div className="p-2.5 rounded bg-amber-50/70 border border-amber-200">
              <span className="text-xs text-amber-700 uppercase font-mono block">UNDER REVIEW</span>
              <span className="text-lg font-bold text-amber-800 font-mono">{stats.underReview}</span>
            </div>
            <div className="p-2.5 rounded bg-blue-50/70 border border-blue-200">
              <span className="text-xs text-blue-700 uppercase font-mono block">DRAFTS</span>
              <span className="text-lg font-bold text-blue-800 font-mono">{stats.draft}</span>
            </div>
          </div>
        ) : (
          /* Legal Template Notice Banner */
          <div className="bg-amber-50/90 border border-amber-300 rounded-card p-3.5 space-y-1.5 text-xs text-amber-950">
            <div className="flex items-center space-x-2 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>LEGAL TEMPLATE ADVISORY NOTICE</span>
            </div>
            <p className="text-xs leading-relaxed text-amber-900/90">
              {LEGAL_TEMPLATE_DISCLAIMER} Standard legal clauses must be approved by departmental legal officers before executing binding pilot deeds.
            </p>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. FILTERS & SEARCH STRIP                                */}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-200 rounded-card p-3.5 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          {/* Search */}
          <div className="sm:col-span-1 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search document name, SHA-256..."
              className="pl-8 text-xs h-8"
            />
          </div>

          {/* Document Type Filter (8 types) */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full text-xs h-8 px-2.5 border border-slate-200 rounded bg-white text-slate-800"
            >
              <option value="ALL">All Types (8 Document Categories)</option>
              <option value="Pilot Agreement">Pilot Agreement</option>
              <option value="NDA">NDA</option>
              <option value="Data Agreement">Data Agreement</option>
              <option value="IP Agreement">IP Agreement</option>
              <option value="Security Checklist">Security Checklist</option>
              <option value="Evaluation Report">Evaluation Report</option>
              <option value="Validation Report">Validation Report</option>
              <option value="Procurement Documents">Procurement Documents</option>
            </select>
          </div>

          {/* Status Filter (5 statuses) */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs h-8 px-2.5 border border-slate-200 rounded bg-white text-slate-800"
            >
              <option value="ALL">All Statuses (5 States)</option>
              <option value="Draft">Draft</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Signed">Signed</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs h-8 px-2.5 border border-slate-200 rounded bg-white text-slate-800"
            >
              <option value="updatedDate">Sort by Updated Date (Newest)</option>
              <option value="createdDate">Sort by Created Date</option>
              <option value="name">Sort by Title (A-Z)</option>
              <option value="type">Sort by Document Type</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. DOCUMENT REPOSITORY TABLE / LIST                      */}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-200 rounded-card shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-gov-muted uppercase font-mono text-xs">
                <th className="py-2.5 px-3 font-semibold">Document Name & Type</th>
                <th className="py-2.5 px-3 font-semibold">Version</th>
                <th className="py-2.5 px-3 font-semibold">Owner & Department</th>
                <th className="py-2.5 px-3 font-semibold">Dates (Created / Expiry)</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold">Access Level</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Name & Type */}
                  <td className="py-3 px-3 max-w-sm">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5 flex-wrap">
                        <span className="font-mono text-xs text-gov-muted font-bold">{doc.id}</span>
                        {renderTypeChip(doc.type)}
                        {doc.isTemplate && (
                          <span className="text-xs font-mono font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                            LEGAL TEMPLATE
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => openInspector(doc)}
                        className="font-bold text-slate-900 hover:text-gov-primary text-left text-xs block line-clamp-1"
                      >
                        {doc.name}
                      </button>

                      <p className="text-xs text-slate-500 line-clamp-1">
                        {doc.description}
                      </p>
                    </div>
                  </td>

                  {/* Version */}
                  <td className="py-3 px-3">
                    <span className="font-mono text-xs font-bold text-gov-primary bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-flex items-center">
                      <GitBranch className="w-3 h-3 mr-1 text-slate-500" />
                      {doc.version}
                    </span>
                    <span className="block text-xs text-gov-muted font-mono mt-0.5">
                      {doc.versionHistory.length} {doc.versionHistory.length === 1 ? "rev" : "revs"}
                    </span>
                  </td>

                  {/* Owner */}
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800 text-xs truncate max-w-[160px]">
                      {doc.owner}
                    </div>
                    <div className="text-xs font-mono text-slate-500">
                      {doc.fileSize} • {doc.fileFormat}
                    </div>
                  </td>

                  {/* Created / Expiry Dates */}
                  <td className="py-3 px-3 font-mono text-xs">
                    <div>
                      <span className="text-xs text-gov-muted uppercase block">CREATED</span>
                      <span className="text-slate-700">{doc.createdDate}</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-xs text-gov-muted uppercase block">EXPIRES</span>
                      <span className="text-slate-500">{doc.expiryDate}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    {renderStatusBadge(doc.status)}
                  </td>

                  {/* Access Level */}
                  <td className="py-3 px-3">
                    {renderAccessBadge(doc.access)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openInspector(doc)}
                        className="h-8 text-xs px-2.5"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> Inspect
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          showToast({
                            type: "success",
                            title: "Document Vault Access",
                            description: `Downloading ${doc.name} (${doc.version}). SHA-256 confirmed.`,
                          });
                        }}
                        className="h-8 text-xs px-2"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDocuments.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-gov-muted">
                    No documents matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. DOCUMENT INSPECTOR DRAWER WITH VERSION HISTORY        */}
      {/* ======================================================== */}
      {drawerOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto p-6 space-y-5 text-left border-l border-slate-200">
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-gov-accent">{selectedDoc.id}</span>
                  {renderTypeChip(selectedDoc.type)}
                  {renderStatusBadge(selectedDoc.status)}
                  {renderAccessBadge(selectedDoc.access)}
                </div>
                <h2 className="text-base font-bold text-slate-900 leading-snug">
                  {selectedDoc.name}
                </h2>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Legal Template Warning Banner (if template) */}
            {selectedDoc.isTemplate && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-card space-y-1 text-xs text-amber-950">
                <div className="flex items-center space-x-1.5 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>LEGAL TEMPLATE — COUNSEL REVIEW REQUIRED</span>
                </div>
                <p className="text-xs leading-relaxed text-amber-900/90">
                  {selectedDoc.templateDisclaimer || LEGAL_TEMPLATE_DISCLAIMER}
                </p>
              </div>
            )}

            {/* Document Description */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono">
                Scope & Purpose
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/60 p-3 rounded border border-slate-200">
                {selectedDoc.description}
              </p>
            </div>

            {/* Document Metadata Strip */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-white border border-slate-200 rounded-card p-3">
              <div>
                <span className="text-xs text-gov-muted block uppercase">OWNER / AUTHORITY</span>
                <span className="font-bold text-slate-800">{selectedDoc.owner}</span>
              </div>
              <div>
                <span className="text-xs text-gov-muted block uppercase">CURRENT VERSION</span>
                <span className="font-mono font-bold text-gov-primary">{selectedDoc.version}</span>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs text-gov-muted block uppercase">CREATED DATE</span>
                <span className="font-mono text-slate-700">{selectedDoc.createdDate}</span>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs text-gov-muted block uppercase">EXPIRY DATE</span>
                <span className="font-mono text-slate-700">{selectedDoc.expiryDate}</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-100">
                <span className="text-xs text-gov-muted block uppercase">SHA-256 CHECKSUM</span>
                <span className="font-mono text-xs text-slate-700 break-all bg-slate-50 p-1.5 rounded block mt-0.5 border border-slate-200">
                  {selectedDoc.sha256Hash}
                </span>
              </div>
            </div>

            {/* Signatories & Execution Status */}
            {selectedDoc.signatories && selectedDoc.signatories.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono">
                  Signatories & Execution Ledger
                </h3>
                <div className="space-y-1.5">
                  {selectedDoc.signatories.map((sig, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{sig.name}</span>
                        <span className="text-xs text-gov-muted block">
                          {sig.role} • {sig.organization}
                        </span>
                      </div>
                      <div className="text-right font-mono">
                        <Badge
                          variant={sig.status === "Signed" ? "success" : "outline"}
                          className="text-xs"
                        >
                          {sig.status}
                        </Badge>
                        {sig.signedAt && (
                          <span className="text-xs text-slate-400 block mt-0.5">
                            {new Date(sig.signedAt).toLocaleDateString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VERSION HISTORY TIMELINE */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <History className="w-4 h-4 text-gov-primary" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase font-mono">
                    Version History & Audit Log
                  </h3>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowVersionModal(true)}
                  className="text-xs h-6 px-2 text-gov-primary"
                >
                  <Plus className="w-3 h-3 mr-1" /> Commit New Version
                </Button>
              </div>

              <div className="space-y-2.5 relative pl-4 border-l-2 border-slate-200">
                {selectedDoc.versionHistory.map((ver, idx) => (
                  <div key={idx} className="relative space-y-1">
                    {/* Timeline dot */}
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-400 border-2 border-white ring-1 ring-slate-300"></span>

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-slate-900 flex items-center">
                        {ver.version}
                        {idx === 0 && (
                          <span className="ml-1.5 font-sans text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                            Current Active
                          </span>
                        )}
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        {ver.updatedDate}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-200/80">
                      {ver.summaryOfChanges}
                    </p>

                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-0.5">
                      <span>Updated by: {ver.updatedBy}</span>
                      <button
                        onClick={() => {
                          showToast({
                            type: "success",
                            title: "Version Download Initiated",
                            description: `Downloading version ${ver.version} (${ver.fileSize}).`,
                          });
                        }}
                        className="text-gov-primary hover:underline flex items-center"
                      >
                        <Download className="w-3 h-3 mr-1" /> {ver.fileSize}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-3 border-t border-slate-200 flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  showToast({
                    type: "success",
                    title: "Audit Hash Verified",
                    description: `Integrity certified: ${selectedDoc.sha256Hash.substring(0, 16)}...`,
                  });
                }}
                className="w-1/2 text-xs h-8"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Verify SHA-256
              </Button>

              <Button
                onClick={() => {
                  showToast({
                    type: "success",
                    title: "Download Initiated",
                    description: `Transferred ${selectedDoc.name} (${selectedDoc.fileSize}).`,
                  });
                }}
                className="w-1/2 bg-gov-primary hover:bg-gov-primary-hover text-white text-xs h-8 font-semibold"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Download Document
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. COMMIT NEW VERSION MODAL                               */}
      {/* ======================================================== */}
      {showVersionModal && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-card border border-slate-200 max-w-md w-full p-5 space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Commit New Document Version
                </h3>
                <p className="text-xs text-gov-muted">
                  Log revisions, amendments, and changelog notes for {selectedDoc.id}
                </p>
              </div>
              <button
                onClick={() => setShowVersionModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  New Version Number *
                </label>
                <Input
                  value={newVersionNum}
                  onChange={(e) => setNewVersionNum(e.target.value)}
                  placeholder="e.g. v1.3 or v2.0"
                  className="text-xs h-8 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Summary of Changes / Legal Markup *
                </label>
                <Textarea
                  value={newVersionSummary}
                  onChange={(e) => setNewVersionSummary(e.target.value)}
                  placeholder="Specify amended clauses, milestone date extensions, or added covenants..."
                  rows={4}
                  className="text-xs"
                />
              </div>

              <div className="border border-dashed border-slate-300 rounded p-3 text-center bg-slate-50/80">
                <FileText className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                <span className="text-xs text-slate-600 font-semibold block">
                  Attach revised PDF / DOCX instrument
                </span>
                <span className="text-xs text-slate-400 font-mono block">
                  Cryptographic checksum will be calculated on commit
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVersionModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCommitNewVersion}
                disabled={isCommittingVersion}
                className="bg-gov-primary hover:bg-gov-primary-hover text-white text-xs font-semibold"
              >
                {isCommittingVersion ? "Committing..." : "Commit Version"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. UPLOAD / CREATE NEW DOCUMENT MODAL                     */}
      {/* ======================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-card border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {isTemplateDraft ? "Register Standard Legal Template" : "Upload Document / Contract"}
                </h3>
                <p className="text-xs text-gov-muted">
                  {isTemplateDraft
                    ? "Store advisory boilerplate template subject to legal counsel review"
                    : "Register executed deed or covenant under the pilot framework"}
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Document Title *
                </label>
                <Input
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. Model Data Sharing Protocol Deed"
                  className="text-xs h-8"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Document Type (8 Categories) *
                  </label>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value as DocumentType)}
                    className="w-full text-xs h-8 px-2 border border-slate-200 rounded bg-white text-slate-800"
                  >
                    <option value="Pilot Agreement">Pilot Agreement</option>
                    <option value="NDA">NDA</option>
                    <option value="Data Agreement">Data Agreement</option>
                    <option value="IP Agreement">IP Agreement</option>
                    <option value="Security Checklist">Security Checklist</option>
                    <option value="Evaluation Report">Evaluation Report</option>
                    <option value="Validation Report">Validation Report</option>
                    <option value="Procurement Documents">Procurement Documents</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Status *
                  </label>
                  <select
                    value={newDocStatus}
                    onChange={(e) => setNewDocStatus(e.target.value as DocumentStatus)}
                    className="w-full text-xs h-8 px-2 border border-slate-200 rounded bg-white text-slate-800"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Signed">Signed</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Role-Based Access Level *
                  </label>
                  <select
                    value={newDocAccess}
                    onChange={(e) => setNewDocAccess(e.target.value as DocumentAccessLevel)}
                    className="w-full text-xs h-8 px-2 border border-slate-200 rounded bg-white text-slate-800"
                  >
                    <option value="Restricted (Government & Startup)">Restricted (Gov & Startup)</option>
                    <option value="Public">Public Access</option>
                    <option value="Confidential (Government Only)">Confidential (Gov Only)</option>
                    <option value="Procurement Clearance Required">Procurement Clearance</option>
                    <option value="Proprietary Startup IP">Proprietary Startup IP</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Expiry Date
                  </label>
                  <Input
                    type="date"
                    value={newDocExpiry}
                    onChange={(e) => setNewDocExpiry(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Owner / Contracting Authority
                </label>
                <Input
                  value={newDocOwner}
                  onChange={(e) => setNewDocOwner(e.target.value)}
                  placeholder="e.g. Directorate of Urban Development & AirSense Technologies"
                  className="text-xs h-8"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Description & Governance Scope
                </label>
                <Textarea
                  value={newDocDesc}
                  onChange={(e) => setNewDocDesc(e.target.value)}
                  placeholder="Summarize contractual covenants, binding obligations, and statutory terms..."
                  rows={3}
                  className="text-xs"
                />
              </div>

              {isTemplateDraft && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-amber-900 text-xs leading-relaxed">
                  ⚠️ <strong>Notice:</strong> This document will be cataloged in the Legal Templates Library and flagged with mandatory counsel review notices.
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreateDocument}
                className="bg-gov-primary hover:bg-gov-primary-hover text-white text-xs font-semibold"
              >
                Register Document
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
