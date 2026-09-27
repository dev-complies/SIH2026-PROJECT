"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Shield,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Cpu,
  Layers,
  Award,
  History,
  FileText,
  UserCheck,
  Check,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Lock,
  ChevronRight,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/auth/AuthContext";
import { useToast } from "@/components/ui/toast";
import {
  MatchingResult,
  MatchRating,
  CANONICAL_CHALLENGE,
} from "@/database/matchingDatabase";

export function AIMatchingWorkspace() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [matches, setMatches] = useState<MatchingResult[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchingResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Human Decision Form State
  const [decision, setDecision] = useState<
    "SHORTLISTED" | "CLARIFICATION_REQUESTED" | "REJECTED"
  >("SHORTLISTED");
  const [justification, setJustification] = useState("");
  const [gfrConfirmed, setGfrConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadMatches() {
      setLoading(true);
      try {
        const res = await fetch("/api/matching");
        const data = await res.json();
        if (data.success && data.matches?.length > 0) {
          setMatches(data.matches);
          setSelectedMatch(data.matches[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, []);

  const getRatingBadge = (rating: MatchRating) => {
    switch (rating) {
      case "Strong":
        return (
          <Badge variant="success" className="font-mono text-[10px] tracking-wide px-2 py-0.5">
            Strong
          </Badge>
        );
      case "Moderate":
        return (
          <Badge variant="warning" className="font-mono text-[10px] tracking-wide px-2 py-0.5">
            Moderate
          </Badge>
        );
      case "Developing":
        return (
          <Badge variant="outline" className="text-slate-600 bg-slate-100 font-mono text-[10px] px-2 py-0.5">
            Developing
          </Badge>
        );
    }
  };

  const handleDecisionSubmit = async () => {
    if (!selectedMatch) return;

    if (!gfrConfirmed) {
      showToast({
        type: "warning",
        title: "Compliance Declaration Required",
        description:
          "You must confirm statutory human responsibility under GFR Rule 149.",
      });
      return;
    }

    if (!justification || justification.trim().length < 20) {
      showToast({
        type: "warning",
        title: "Detailed Rationale Required",
        description: "Please provide at least 20 characters of official justification.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: selectedMatch.id,
          decision,
          justification,
          gfrRule149Confirmed: gfrConfirmed,
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
      if (data.success && data.result) {
        showToast({
          type: "success",
          title: "Official Decision Recorded",
          description: `Candidate status updated to ${decision}. Statutory audit entry logged.`,
        });
        setSelectedMatch(data.result);
        setMatches((prev) =>
          prev.map((m) => (m.id === data.result.id ? data.result : m))
        );
        setJustification("");
        setGfrConfirmed(false);
      } else {
        showToast({
          type: "error",
          title: "Decision Failed",
          description: data.error || "Could not record decision.",
        });
      }
    } catch (err) {
      showToast({
        type: "error",
        title: "System Error",
        description: "Failed to record decision.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Test Automated AI Selection to verify that AI CANNOT autonomously make decisions
  const handleTestAutoAISelection = async () => {
    if (!selectedMatch) return;
    try {
      const res = await fetch("/api/matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: selectedMatch.id,
          decision: "SHORTLISTED",
          justification: "Autonomous AI heuristic selection based on Strong technical match",
          gfrRule149Confirmed: false,
          isAutomatedAISystemAttempt: true, // Trigger AI autonomous attempt
        }),
      });
      const data = await res.json();
      if (!data.success) {
        showToast({
          type: "info",
          title: "Statutory Safeguard Active: Autonomous Selection Blocked",
          description: data.error,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Prominent Statutory AI-Assisted Notice Header */}
      <div className="rounded-xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-blue-50/80 to-purple-50/70 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-indigo-700 text-white font-mono text-[10px] tracking-wider flex items-center">
                <Sparkles className="w-3 h-3 mr-1" /> AI-ASSISTED MATCHING ADVISORY
              </Badge>
              <Badge variant="outline" className="border-indigo-300 text-indigo-800 bg-white font-mono text-[10px]">
                NON-DECISIONAL RECOMMENDATIONS
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gov-primary tracking-tight">
              AI-Assisted Startup-to-Challenge Matching
            </h1>
            <p className="text-xs text-slate-700 max-w-3xl leading-relaxed">
              Multi-factor qualitative alignment analysis across <strong>8 statutory dimensions</strong>.
              Designed specifically without arbitrary single percentage scores. Provides contextual explanations
              for every factor to inform government decision-makers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestAutoAISelection}
              className="text-xs border-indigo-200 text-indigo-900 bg-white hover:bg-indigo-50"
              title="Demonstrates that AI cannot autonomously make decisions"
            >
              <Lock className="w-3.5 h-3.5 mr-1 text-indigo-700" />
              Verify AI Decision Block
            </Button>
            <Link href="/gov/shortlisting">
              <Button size="sm" variant="outline" className="text-xs">
                View Shortlisting Register
              </Button>
            </Link>
          </div>
        </div>

        {/* Legal Safeguard Warning Box */}
        <div className="mt-4 pt-3 border-t border-indigo-200/80 flex items-start space-x-2 text-[11px] text-indigo-950">
          <ShieldAlert className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
          <span>
            <strong>Statutory Mandate (GFR Rule 149 & Public Procurement Guidelines):</strong> AI recommendations must not
            automatically select a startup. Government users remain solely responsible for evaluating proposals,
            approving shortlists, and executing procurement decisions.
          </span>
        </div>
      </div>

      {/* Challenge Under Review Summary Card */}
      <div className="p-4 rounded-xl bg-white border border-gov-border shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-gov-muted uppercase font-semibold">Active RFP Challenge:</span>
              <Badge variant="outline" className="font-mono text-[10px] bg-slate-50">
                {CANONICAL_CHALLENGE.code}
              </Badge>
            </div>
            <h2 className="text-sm font-bold text-slate-900 mt-1">
              {CANONICAL_CHALLENGE.title}
            </h2>
            <div className="text-[11px] text-gov-muted mt-0.5">
              {CANONICAL_CHALLENGE.department} • Budget Ceiling: ₹{(CANONICAL_CHALLENGE.budgetCeiling / 100000).toFixed(1)} Lakhs • Min Experience: {CANONICAL_CHALLENGE.minimumExperienceYears} yrs
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-gov-muted text-[11px]">Required Tech:</span>
            <div className="flex flex-wrap gap-1">
              {CANONICAL_CHALLENGE.requiredTechnologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-mono text-slate-700 border border-slate-200"
                >
                  {tech}
                </span>
              ))}
              {CANONICAL_CHALLENGE.requiredTechnologies.length > 4 && (
                <span className="px-1.5 py-0.5 bg-slate-50 rounded text-[10px] font-mono text-slate-500">
                  +{CANONICAL_CHALLENGE.requiredTechnologies.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Startups Grid & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Candidate Selector Column (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Candidate Startups ({matches.length})
            </h3>
            <span className="text-[11px] text-gov-muted font-mono">DPIIT Vetted</span>
          </div>

          <div className="space-y-2.5">
            {matches.map((item) => {
              const isSelected = selectedMatch?.id === item.id;
              const isShortlisted = item.humanDecision?.decision === "SHORTLISTED";
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedMatch(item)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-50/60 border-gov-accent shadow-xs ring-1 ring-gov-accent"
                      : "bg-white border-gov-border hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-snug">
                        {item.startup.name}
                      </h4>
                      <div className="flex items-center space-x-1.5 mt-1 font-mono text-[10px] text-gov-muted">
                        <span>{item.startup.dpiitNumber}</span>
                        <span>•</span>
                        <span>{item.startup.headquarters.city}, {item.startup.headquarters.state}</span>
                      </div>
                    </div>

                    {isShortlisted ? (
                      <Badge variant="success" className="text-[9px] py-0 px-1 font-mono">
                        SHORTLISTED
                      </Badge>
                    ) : item.humanDecision?.decision === "CLARIFICATION_REQUESTED" ? (
                      <Badge variant="warning" className="text-[9px] py-0 px-1 font-mono">
                        CLARIFICATION
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono text-slate-500">
                        AI EVALUATED
                      </Badge>
                    )}
                  </div>

                  {/* Factor Snapshot Badges */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                      Tech: {item.factors.technology.rating}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                      Loc: {item.factors.location.rating}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-medium">
                      Req: {item.factors.requirements.rating}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Candidate Detailed Evaluation (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedMatch && (
            <>
              {/* "Why this startup matches" Explanation Card (Core Prompt Mandate) */}
              <div className="rounded-xl border border-gov-border bg-white shadow-xs overflow-hidden">
                <div className="bg-slate-50 border-b border-gov-border px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-gov-primary">
                        Why this startup matches:
                      </h3>
                      <Badge variant="outline" className="text-[10px] font-mono text-indigo-700 border-indigo-300 bg-indigo-50">
                        AI Factor Breakdown
                      </Badge>
                    </div>
                    <p className="text-xs text-gov-muted mt-0.5">
                      Qualitative justification across all 8 statutory factors for <strong>{selectedMatch.startup.name}</strong>
                    </p>
                  </div>

                  <span className="text-xs font-mono text-gov-muted">
                    Ref: {selectedMatch.id}
                  </span>
                </div>

                {/* The 8 Factors Breakdown List */}
                <div className="divide-y divide-slate-100">
                  {/* Factor 1: Technology */}
                  <div className="p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Cpu className="w-4 h-4 text-gov-accent" />
                        <span className="font-bold text-xs text-slate-900">Technology</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getRatingBadge(selectedMatch.factors.technology.rating)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 mt-1.5 pl-6 leading-relaxed">
                      {selectedMatch.factors.technology.detailedRationale}
                    </p>
                    <div className="mt-2 pl-6 flex flex-wrap gap-1.5">
                      {selectedMatch.factors.technology.evidencePoints.map((ev, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-mono"
                        >
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Factor 2: Industry */}
                  <div className="p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Layers className="w-4 h-4 text-indigo-600" />
                        <span className="font-bold text-xs text-slate-900">Industry</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getRatingBadge(selectedMatch.factors.industry.rating)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 mt-1.5 pl-6 leading-relaxed">
                      {selectedMatch.factors.industry.detailedRationale}
                    </p>
                    <div className="mt-2 pl-6 flex flex-wrap gap-1.5">
                      {selectedMatch.factors.industry.evidencePoints.map((ind, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium"
                        >
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Factor 3: Experience */}
                  <div className="p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-xs text-slate-900">Experience</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getRatingBadge(selectedMatch.factors.experience.rating)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 mt-1.5 pl-6 leading-relaxed">
                      {selectedMatch.factors.experience.detailedRationale}
                    </p>
                    <div className="mt-2 pl-6 flex flex-wrap gap-1.5 text-[10px] text-gov-muted font-mono">
                      {selectedMatch.factors.experience.evidencePoints.map((ev, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-100">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Factor 4: Location */}
                  <div className="p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-xs text-slate-900">Location</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getRatingBadge(selectedMatch.factors.location.rating)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 mt-1.5 pl-6 leading-relaxed">
                      {selectedMatch.factors.location.detailedRationale}
                    </p>
                    <div className="mt-2 pl-6 flex flex-wrap gap-1.5 text-[10px] text-gov-muted font-mono">
                      {selectedMatch.factors.location.evidencePoints.map((ev, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-100">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Factor 5: Budget */}
                  <div className="p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-teal-600" />
                        <span className="font-bold text-xs text-slate-900">Budget</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getRatingBadge(selectedMatch.factors.budget.rating)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 mt-1.5 pl-6 leading-relaxed">
                      {selectedMatch.factors.budget.detailedRationale}
                    </p>
                    <div className="mt-2 pl-6 flex flex-wrap gap-1.5 text-[10px] text-gov-muted font-mono">
                      {selectedMatch.factors.budget.evidencePoints.map((ev, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Factor 6: Requirements */}
                  <div className="p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileCheck2 className="w-4 h-4 text-purple-600" />
                        <span className="font-bold text-xs text-slate-900">Requirements</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getRatingBadge(selectedMatch.factors.requirements.rating)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 mt-1.5 pl-6 leading-relaxed">
                      {selectedMatch.factors.requirements.detailedRationale}
                    </p>
                    <div className="mt-2 pl-6 space-y-1">
                      {selectedMatch.factors.requirements.evidencePoints.map((req, i) => (
                        <div key={i} className="text-[11px] text-slate-600 flex items-center space-x-1.5">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Factor 7: Certifications */}
                  <div className="p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-amber-600" />
                        <span className="font-bold text-xs text-slate-900">Certifications</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getRatingBadge(selectedMatch.factors.certifications.rating)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 mt-1.5 pl-6 leading-relaxed">
                      {selectedMatch.factors.certifications.detailedRationale}
                    </p>
                    <div className="mt-2 pl-6 flex flex-wrap gap-1.5">
                      {selectedMatch.factors.certifications.evidencePoints.map((cert, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] bg-amber-50 text-amber-900 border border-amber-200 font-medium"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Factor 8: Previous Projects */}
                  <div className="p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <History className="w-4 h-4 text-slate-700" />
                        <span className="font-bold text-xs text-slate-900">Previous Projects</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getRatingBadge(selectedMatch.factors.previousProjects.rating)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 mt-1.5 pl-6 leading-relaxed">
                      {selectedMatch.factors.previousProjects.detailedRationale}
                    </p>
                    <div className="mt-2 pl-6 space-y-1.5">
                      {selectedMatch.startup.previousProjects.map((p, i) => (
                        <div
                          key={i}
                          className="p-2 rounded bg-slate-50 border border-slate-100 text-[11px] text-slate-700"
                        >
                          <div className="font-semibold text-slate-900">{p.title}</div>
                          <div className="text-[10px] text-gov-muted font-mono mt-0.5">
                            Client: {p.client} ({p.clientType}) • Value: {p.contractValue} • Year: {p.year}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Strengths & Potential Risks Callouts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 text-xs text-emerald-950 space-y-2">
                  <div className="font-bold flex items-center text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-700" /> Key Strengths for Deployment
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-700">
                    {selectedMatch.keyStrengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 text-xs text-amber-950 space-y-2">
                  <div className="font-bold flex items-center text-amber-900">
                    <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-700" /> Points for Committee Due Diligence
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-700">
                    {selectedMatch.potentialRisksToInspect.map((risk, i) => (
                      <li key={i}>{risk}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Existing Human Decision Badge (if already decided) */}
              {selectedMatch.humanDecision && (
                <div className="p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50/80 text-xs text-emerald-950 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold flex items-center text-sm text-emerald-900">
                      <UserCheck className="w-4 h-4 mr-1.5 text-emerald-700" /> Official Human Decision Recorded
                    </div>
                    <Badge variant="success" className="font-mono">
                      {selectedMatch.humanDecision.decision}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-700">
                    <strong>Decided by:</strong> {selectedMatch.humanDecision.decidedBy.name} (
                    {selectedMatch.humanDecision.decidedBy.designation}) on{" "}
                    {new Date(selectedMatch.humanDecision.decidedAt).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-slate-800 bg-white p-2.5 rounded border border-emerald-200 italic">
                    "{selectedMatch.humanDecision.statutoryJustification}"
                  </p>
                  <div className="text-[10px] text-emerald-800 font-mono">
                    ✓ GFR Rule 149 Human Accountability Certified & Logged to Immutable Audit Trail
                  </div>
                </div>
              )}

              {/* Statutory Human Decision Panel (Government Users Remain Responsible) */}
              <div className="rounded-xl border border-gov-border bg-white p-5 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-gov-primary" />
                    <h3 className="text-sm font-bold text-gov-primary uppercase tracking-wide">
                      Government Decision Panel (GFR Rule 149 Compliance)
                    </h3>
                  </div>
                  <p className="text-xs text-gov-muted mt-0.5">
                    AI recommendations are purely advisory. Government users must record their independent determination.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Official Determination Action:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setDecision("SHORTLISTED")}
                        className={`p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                          decision === "SHORTLISTED"
                            ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        Shortlist for Pilot Design
                      </button>
                      <button
                        type="button"
                        onClick={() => setDecision("CLARIFICATION_REQUESTED")}
                        className={`p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                          decision === "CLARIFICATION_REQUESTED"
                            ? "bg-amber-600 text-white border-amber-700 shadow-xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        Request Technical Clarification
                      </button>
                      <button
                        type="button"
                        onClick={() => setDecision("REJECTED")}
                        className={`p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                          decision === "REJECTED"
                            ? "bg-red-600 text-white border-red-700 shadow-xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        Reject Candidate
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Statutory Human Justification (Required for Audit Trail, min 20 chars):
                    </label>
                    <Textarea
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      placeholder="Explain why this startup candidate is being shortlisted or rejected based on technical factors, field capacity, and public value-for-money..."
                      className="text-xs min-h-[80px]"
                    />
                  </div>

                  <div className="flex items-start space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="gfr-check"
                      checked={gfrConfirmed}
                      onChange={(e) => setGfrConfirmed(e.target.checked)}
                      className="mt-0.5 rounded text-gov-primary focus:ring-gov-accent cursor-pointer"
                    />
                    <label
                      htmlFor="gfr-check"
                      className="text-xs text-slate-700 cursor-pointer leading-snug"
                    >
                      <strong>Government User Accountability Affirmation:</strong> I confirm that I have
                      independently evaluated the candidate startup against the RFP criteria, and this
                      determination is made under my statutory authority in accordance with GFR Rule 149.
                    </label>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleDecisionSubmit}
                      disabled={submitting || !gfrConfirmed || justification.trim().length < 20}
                      className="bg-gov-primary hover:bg-gov-primary/90 text-white text-xs px-5"
                    >
                      <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                      {submitting ? "Recording Official Decision..." : "Record Official Decision"}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
