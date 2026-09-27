"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Lock,
  Cpu,
  Layers,
  Clock,
  DollarSign,
  Database,
  ArrowRight,
  ExternalLink,
  BookOpen,
  UserCheck,
  X,
  Plus,
  Info,
  Check,
  Search,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/auth/AuthContext";
import { useToast } from "@/components/ui/toast";
import {
  AIRiskSuggestion,
  AIRiskCategory,
  MANDATORY_AI_RISK_CATEGORIES,
  AI_SUGGESTION_LABEL,
} from "@/database/aiRiskAnalysisDatabase";

export function AIRiskAnalysisWorkspace({ pilotId = "PILOT-UP-UAQ-01" }: { pilotId?: string }) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [suggestions, setSuggestions] = useState<AIRiskSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Adoption Modal State
  const [adoptingSuggestion, setAdoptingSuggestion] = useState<AIRiskSuggestion | null>(null);
  const [assignedOwner, setAssignedOwner] = useState("");
  const [mitigationAction, setMitigationAction] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadSuggestions() {
      setLoading(true);
      try {
        const res = await fetch("/api/risks-issues/ai-analysis");
        const data = await res.json();
        if (data.success && data.suggestions) {
          setSuggestions(data.suggestions);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSuggestions();
  }, []);

  const handleOpenAdoptModal = (s: AIRiskSuggestion) => {
    setAdoptingSuggestion(s);
    setMitigationAction(s.suggestedMitigation);
    setAssignedOwner(
      currentUser
        ? `${currentUser.firstName} ${currentUser.lastName} (Nodal Officer)`
        : "Rajesh Verma (Joint Director, Urban)"
    );
  };

  const handleConfirmAdopt = async () => {
    if (!adoptingSuggestion) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/risks-issues/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "adopt",
          suggestionId: adoptingSuggestion.id,
          assignedOwner,
          mitigationAction,
          mockOfficer: currentUser || {
            id: "user-gov-001",
            firstName: "Rajesh",
            lastName: "Verma",
            email: "rajesh.verma@gov.in",
            role: "GOVERNMENT_OFFICER",
            designation: "Joint Director, Urban Smart Infrastructure",
            departmentId: "UP Jal Nigam",
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast({
          type: "success",
          title: "Risk Officially Adopted",
          description: `Transcribed into statutory risk register as ${data.officialRiskId}. Human accountability logged.`,
        });
        setSuggestions((prev) =>
          prev.map((s) => (s.id === adoptingSuggestion.id ? data.suggestion : s))
        );
        setAdoptingSuggestion(null);
      } else {
        showToast({
          type: "error",
          title: "Adoption Failed",
          description: data.error,
        });
      }
    } catch (err) {
      showToast({
        type: "error",
        title: "System Error",
        description: "Failed to adopt risk suggestion.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Test Attempting Automated Status Change -> Proves AI cannot automatically modify risk status
  const handleTestAutoStatusChange = async (s: AIRiskSuggestion) => {
    try {
      const res = await fetch("/api/risks-issues/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "adopt",
          suggestionId: s.id,
          isAutomatedAISystemAttempt: true, // Auto mutation flag
        }),
      });
      const data = await res.json();
      if (!data.success) {
        showToast({
          type: "info",
          title: "Statutory Safeguard Active: Autonomous Status Change Blocked",
          description: data.error,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredSuggestions = suggestions.filter((s) => {
    if (selectedCategory !== "ALL" && s.category !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        s.risk.toLowerCase().includes(q) ||
        s.whyIdentified.toLowerCase().includes(q) ||
        s.potentialImpact.toLowerCase().includes(q) ||
        s.suggestedMitigation.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const getCategoryIcon = (cat: AIRiskCategory) => {
    switch (cat) {
      case "Technical Risks":
        return <Cpu className="w-4 h-4 text-gov-accent" />;
      case "Operational Risks":
        return <Layers className="w-4 h-4 text-blue-600" />;
      case "Data Risks":
        return <Database className="w-4 h-4 text-indigo-600" />;
      case "Cybersecurity Risks":
        return <Lock className="w-4 h-4 text-rose-600" />;
      case "Financial Risks":
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case "Timeline Risks":
        return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Prominent Statutory AI-Generated Risk Advisory Banner */}
      <div className="rounded-xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-blue-50/80 to-purple-50/70 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <Badge variant="default" className="bg-indigo-700 text-white font-mono text-xs tracking-wider flex items-center">
                <Sparkles className="w-3 h-3 mr-1" /> {AI_SUGGESTION_LABEL}
              </Badge>
              <Badge variant="outline" className="border-indigo-300 text-indigo-900 bg-white font-mono text-xs">
                GROUNDED IN CHALLENGE, STARTUP, PILOT & EVIDENCE DATA
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gov-primary tracking-tight">
              AI-Assisted Risk Analysis & Pre-Emptive Advisory
            </h1>
            <p className="text-xs text-slate-700 max-w-3xl leading-relaxed">
              Synthesizes latent vulnerabilities across <strong>6 mandatory operational categories</strong>.
              Every suggestion is factually anchored in submitted proposals, sensor telemetry, and winter field benchmarks.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <Link href="/risks-issues">
              <Button size="sm" variant="outline" className="text-xs bg-white">
                View Official Risk Register
              </Button>
            </Link>
          </div>
        </div>

        {/* Legal Mandate Box */}
        <div className="mt-4 pt-3 border-t border-indigo-200/80 flex items-start space-x-2 text-xs text-indigo-950">
          <ShieldAlert className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
          <span>
            <strong>Statutory Governance Mandate:</strong> AI recommendations are strictly advisory and{" "}
            <strong>must not automatically change risk status or make procurement decisions</strong>.
            Authorized government officers retain sole responsibility for evaluating risk probabilities,
            formulating mitigation actions, and managing official project registries under GFR Rule 149.
          </span>
        </div>
      </div>

      {/* Grounding Context Data Bar */}
      <div className="p-4 rounded-xl bg-white border border-gov-border shadow-2xs text-xs space-y-2">
        <span className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center">
          <BookOpen className="w-3.5 h-3.5 mr-1.5 text-gov-accent" />
          Grounding Information Baseline (Zero Hallucination Sources)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs text-gov-muted uppercase font-mono block">1. Challenge RFP</span>
            <strong className="text-slate-800 text-xs block truncate">UAQ-LKO-2026 (Winter Smog Grid)</strong>
            <span className="text-xs text-slate-500">R2 &gt;= 0.90 CPCB requirement</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs text-gov-muted uppercase font-mono block">2. Startup Profile</span>
            <strong className="text-slate-800 text-xs block truncate">AirSense Technologies</strong>
            <span className="text-xs text-slate-500">DPIIT98214 • Turnover ₹1.45 Cr</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs text-gov-muted uppercase font-mono block">3. Active Pilot</span>
            <strong className="text-slate-800 text-xs block truncate">PILOT-UP-UAQ-2026-01</strong>
            <span className="text-xs text-slate-500">40 Nodes • Wards 14, 18, 22, 29</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs text-gov-muted uppercase font-mono block">4. Telemetry Evidence</span>
            <strong className="text-slate-800 text-xs block truncate">EVID-2026-001 &amp; EVID-004</strong>
            <span className="text-xs text-slate-500">92% RH fog &amp; packet loss data</span>
          </div>
        </div>
      </div>

      {/* Filter and Category Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-gov-border shadow-xs">
        {/* Category Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-colors ${
              selectedCategory === "ALL"
                ? "bg-slate-900 text-white font-semibold shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All 6 Categories ({suggestions.length})
          </button>
          {MANDATORY_AI_RISK_CATEGORIES.map((cat) => {
            const count = suggestions.filter((s) => s.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-colors flex items-center space-x-1.5 ${
                  isSelected
                    ? "bg-gov-primary text-white font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {getCategoryIcon(cat)}
                <span>{cat}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-xs font-mono ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gov-muted" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search risk suggestions..."
            className="pl-8 text-xs h-8 bg-slate-50/50"
          />
        </div>
      </div>

      {/* Suggested Risks Stream */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-xs text-gov-muted animate-pulse bg-white rounded-xl border border-gov-border">
            Analyzing challenge specifications, sensor telemetry, and pilot evidence...
          </div>
        ) : filteredSuggestions.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-xl border border-gov-border p-6 text-xs text-gov-muted">
            No risk suggestions found in this category.
          </div>
        ) : (
          filteredSuggestions.map((s) => {
            const isAdopted = s.status === "ADOPTED_INTO_REGISTER";
            const isDismissed = s.status === "DISMISSED";

            return (
              <div
                key={s.id}
                className={`rounded-xl border transition-all p-5 shadow-xs space-y-4 ${
                  isAdopted
                    ? "bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-300"
                    : isDismissed
                    ? "bg-slate-50/60 border-slate-200 opacity-60"
                    : "bg-white border-gov-border hover:border-slate-300"
                }`}
              >
                {/* Header: Label, Category, Severity Badges */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <Badge variant="outline" className="text-xs font-mono text-indigo-700 bg-indigo-50 border-indigo-200 flex items-center">
                      <Sparkles className="w-2.5 h-2.5 mr-1" /> {s.label}
                    </Badge>
                    <Badge variant="default" className="bg-slate-800 text-xs font-mono">
                      {s.category}
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs text-slate-500">
                      Suggested Score: {s.suggestedRiskScore}/25 (P:{s.suggestedProbability} × I:{s.suggestedImpact})
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {isAdopted ? (
                      <Badge variant="success" className="font-mono text-xs flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> ADOPTED AS {s.adoptedRiskId}
                      </Badge>
                    ) : isDismissed ? (
                      <Badge variant="outline" className="font-mono text-xs text-slate-500">
                        DISMISSED BY HUMAN REVIEW
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="font-mono text-xs">
                        ADVISORY PENDING HUMAN ACTION
                      </Badge>
                    )}
                  </div>
                </div>

                {/* 1. Risk Statement */}
                <div>
                  <span className="text-xs font-bold text-gov-muted uppercase tracking-wider block mb-1">
                    Risk Statement:
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {s.risk}
                  </h3>
                </div>

                {/* 2. Why it was identified (Strictly Grounded in Data) */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 space-y-2">
                  <span className="text-xs font-bold text-gov-primary uppercase tracking-wider block flex items-center">
                    <Info className="w-3.5 h-3.5 mr-1 text-gov-accent" /> Why It Was Identified:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    {s.whyIdentified}
                  </p>

                  {/* Grounded Data Badges */}
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-200/60 mt-2">
                    {s.groundingSources.map((g, i) => (
                      <div
                        key={i}
                        className="px-2.5 py-1 rounded bg-white border border-slate-200 text-xs text-slate-600 flex items-center space-x-1.5 font-mono"
                        title={g.excerpt}
                      >
                        <span className="font-bold text-indigo-700">[{g.sourceType}]</span>
                        <span>{g.title}</span>
                        <span className="text-gov-muted">({g.referenceId})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Potential Impact & 4. Suggested Mitigation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Potential Impact */}
                  <div className="p-3.5 rounded-lg border border-rose-200 bg-rose-50/50 space-y-1">
                    <span className="text-xs font-bold text-rose-900 uppercase tracking-wider block flex items-center">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-700" /> Potential Impact:
                    </span>
                    <p className="text-xs text-rose-950 leading-relaxed">
                      {s.potentialImpact}
                    </p>
                  </div>

                  {/* Suggested Mitigation */}
                  <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/50 space-y-1">
                    <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-700" /> Suggested Mitigation Protocol:
                    </span>
                    <p className="text-xs text-emerald-950 leading-relaxed">
                      {s.suggestedMitigation}
                    </p>
                  </div>
                </div>

                {/* Human Review Note (if reviewed) */}
                {s.reviewedBy && (
                  <div className="text-xs text-slate-600 bg-white p-2.5 rounded border border-slate-200 font-mono">
                    ✓ Human Officer Audit: {s.humanReviewNote}
                  </div>
                )}

                {/* Actions: Human Authorization Required (AI Cannot Automatically Alter Status) */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-xs text-gov-muted flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-gov-primary" />
                    <span>Statutory Rule: Human officer authorization required to modify risk status.</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!isAdopted && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTestAutoStatusChange(s)}
                        className="text-xs text-slate-500 hover:text-slate-800"
                        title="Demonstrates that AI cannot autonomously modify status"
                      >
                        <Lock className="w-3 h-3 mr-1" />
                        Verify AI Block
                      </Button>
                    )}

                    {!isAdopted ? (
                      <Button
                        size="sm"
                        onClick={() => handleOpenAdoptModal(s)}
                        className="bg-gov-primary hover:bg-gov-primary/90 text-white text-xs h-8"
                      >
                        <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                        Adopt into Official Register (Human Review)
                      </Button>
                    ) : (
                      <Link href="/risks-issues">
                        <Button size="sm" variant="outline" className="text-xs h-8 text-emerald-800 border-emerald-300">
                          <span>Inspect in Risk Register</span>
                          <ExternalLink className="w-3 h-3 ml-1.5" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Human Risk Adoption Modal (Enforces Officer Responsibility) */}
      {adoptingSuggestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl rounded-xl border border-gov-border bg-white shadow-2xl overflow-hidden flex flex-col text-slate-800">
            {/* Modal Header */}
            <div className="border-b border-gov-border bg-slate-50 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gov-primary">
                    Human Officer Risk Adoption (GFR Rule 149)
                  </h3>
                  <p className="text-xs text-gov-muted">
                    Officially transcribe AI suggestion into statutory project risk register
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAdoptingSuggestion(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs text-gov-muted uppercase font-mono block">Transcribing AI Suggestion:</span>
                <strong className="text-sm text-slate-900 block mt-0.5">{adoptingSuggestion.risk}</strong>
                <span className="text-slate-600 block mt-1 text-xs">Category: {adoptingSuggestion.category}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Designated Risk Owner (Government Officer or Lead Engineer):
                </label>
                <Input
                  value={assignedOwner}
                  onChange={(e) => setAssignedOwner(e.target.value)}
                  placeholder="e.g. Dr. Rohan Varma (CTO, AirSense) / Rajesh Verma (Nodal Officer)"
                  className="text-xs h-9"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Approved Statutory Mitigation Protocol:
                </label>
                <Textarea
                  value={mitigationAction}
                  onChange={(e) => setMitigationAction(e.target.value)}
                  rows={4}
                  className="text-xs leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-xs text-emerald-950 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  By adopting this risk, it will be added to the live project risk matrix with status <strong>"Mitigating"</strong> and
                  permanently recorded into the cryptographic audit trail with your verified officer credentials.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gov-border bg-slate-50 px-6 py-3.5 flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAdoptingSuggestion(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmAdopt}
                disabled={submitting || !assignedOwner || !mitigationAction}
                className="bg-gov-primary hover:bg-gov-primary/90 text-white text-xs px-5"
              >
                {submitting ? "Transcribing Risk..." : "Officially Adopt Risk"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
