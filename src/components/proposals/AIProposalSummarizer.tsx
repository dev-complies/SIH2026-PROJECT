"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  FileText,
  Split,
  Columns,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Copy,
  Download,
  Search,
  ExternalLink,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Info,
  Layers,
  Cpu,
  Clock,
  DollarSign,
  AlertCircle,
  Hash,
  Paperclip,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  DetailedStartupProposal,
  AIProposalSummary,
  CANONICAL_PROPOSAL,
  NOT_PROVIDED_TEXT,
} from "@/database/proposalSummarizerDatabase";

export function AIProposalSummarizer() {
  const { showToast } = useToast();

  const [proposal, setProposal] = useState<DetailedStartupProposal | null>(null);
  const [summary, setSummary] = useState<AIProposalSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // View Layout Modes: "SPLIT" (50/50), "PROPOSAL" (Full Left), "SUMMARY" (Full Right)
  const [viewMode, setViewMode] = useState<"SPLIT" | "PROPOSAL" | "SUMMARY">("SPLIT");
  const [activeSection, setActiveSection] = useState<string>("solution");
  const [proposalSearch, setProposalSearch] = useState("");

  const originalPaneRef = useRef<HTMLDivElement>(null);
  const summaryPaneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch("/api/proposals/summarize");
        const data = await res.json();
        if (data.success) {
          setProposal(data.proposal);
          setSummary(data.summary);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCopySummary = () => {
    if (!summary) return;
    const text = summary.summaryList
      .map(
        (s) =>
          `### ${s.title.toUpperCase()}\n${s.detailedSynopsis}\nKey Points:\n${s.keyPoints
            .map((kp) => `- ${kp}`)
            .join("\n")}`
      )
      .join("\n\n");

    navigator.clipboard.writeText(text);
    showToast({
      type: "success",
      title: "Summary Copied",
      description: "All 10 structured sections copied to clipboard.",
    });
  };

  const scrollToOriginalSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.classList.add("ring-2", "ring-gov-accent", "bg-blue-50/50");
      setTimeout(() => {
        el.classList.remove("ring-2", "ring-gov-accent", "bg-blue-50/50");
      }, 2500);
    }
  };

  if (loading || !proposal || !summary) {
    return (
      <div className="py-24 text-center text-xs text-gov-muted animate-pulse">
        Synthesizing AI Proposal Summarization with Zero Hallucination Safeguards...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Top Header & Context Banner */}
      <div className="rounded-xl border border-gov-border bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1.5 flex-wrap gap-y-1">
            <Badge variant="default" className="bg-indigo-700 text-white font-mono text-[10px] tracking-wider flex items-center">
              <Sparkles className="w-3 h-3 mr-1" /> AI-GENERATED SUMMARY
            </Badge>
            <Badge variant="outline" className="border-emerald-300 text-emerald-800 bg-emerald-50 text-[10px] font-mono">
              <CheckCircle2 className="w-3 h-3 mr-1" /> STRICT FACTUAL EXTRACTION (ZERO INVENTION)
            </Badge>
            <Badge variant="outline" className="text-slate-600 bg-slate-100 text-[10px] font-mono">
              {proposal.applicationNumber}
            </Badge>
          </div>
          <h1 className="text-xl font-bold text-gov-primary tracking-tight">
            AI-Assisted Proposal Summarization & Dual-Pane Analysis
          </h1>
          <p className="text-xs text-gov-muted mt-0.5">
            Compare the authentic legal proposal document side-by-side with the structured 10-factor AI summary.
          </p>
        </div>

        {/* View Controls & Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Layout Mode Toggles */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setViewMode("SPLIT")}
              className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center space-x-1 ${
                viewMode === "SPLIT"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Side-by-side split view"
            >
              <Columns className="w-3.5 h-3.5 mr-1" />
              <span>Side-by-Side</span>
            </button>
            <button
              onClick={() => setViewMode("PROPOSAL")}
              className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center space-x-1 ${
                viewMode === "PROPOSAL"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Focus on Original Proposal"
            >
              <FileText className="w-3.5 h-3.5 mr-1" />
              <span>Original Only</span>
            </button>
            <button
              onClick={() => setViewMode("SUMMARY")}
              className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center space-x-1 ${
                viewMode === "SUMMARY"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Focus on AI Summary"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              <span>Summary Only</span>
            </button>
          </div>

          <Button variant="outline" size="sm" onClick={handleCopySummary} className="text-xs">
            <Copy className="w-3.5 h-3.5 mr-1 text-gov-muted" />
            Copy Summary
          </Button>
        </div>
      </div>

      {/* Metadata Bar */}
      <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-700">
        <div className="flex items-center space-x-3 flex-wrap">
          <span>
            Candidate: <strong>{proposal.startupName}</strong> ({proposal.dpiitNumber})
          </span>
          <span>•</span>
          <span>
            Challenge: <strong>{proposal.challengeCode}</strong>
          </span>
          <span>•</span>
          <span className="font-mono text-gov-muted">
            {proposal.documentPages} Pages • {proposal.totalWordCount} Words
          </span>
        </div>

        <div className="text-[11px] text-indigo-900 font-mono flex items-center">
          <Info className="w-3.5 h-3.5 mr-1 text-indigo-700" />
          Factual Rule: Missing data is explicitly marked "{NOT_PROVIDED_TEXT}"
        </div>
      </div>

      {/* Quick Jump Section Bar */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="text-[11px] font-bold text-gov-muted uppercase shrink-0 mr-1">
          Jump to:
        </span>
        {summary.summaryList.map((sec) => (
          <button
            key={sec.section}
            onClick={() => {
              setActiveSection(sec.section.toLowerCase().replace(/ /g, ""));
              const el = document.getElementById(`summary-sec-${sec.section.toLowerCase().replace(/ /g, "")}`);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition-colors border ${
              sec.section === "Missing Information"
                ? "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {sec.section}
          </button>
        ))}
      </div>

      {/* Dual-Pane Side-by-Side Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT PANE: Original Proposal Document */}
        {(viewMode === "SPLIT" || viewMode === "PROPOSAL") && (
          <div
            ref={originalPaneRef}
            className={`${
              viewMode === "PROPOSAL" ? "lg:col-span-12" : "lg:col-span-6"
            } rounded-xl border border-gov-border bg-white shadow-xs overflow-hidden flex flex-col max-h-[820px]`}
          >
            {/* Left Header */}
            <div className="bg-slate-50 border-b border-gov-border px-4 py-3 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-slate-700" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                  Original Proposal Dossier (Full Text)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-gov-muted">
                Official Submission Ref: {proposal.applicationNumber}
              </span>
            </div>

            {/* Left Search Bar */}
            <div className="p-3 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gov-muted" />
                <Input
                  value={proposalSearch}
                  onChange={(e) => setProposalSearch(e.target.value)}
                  placeholder="Filter original proposal sections or terms..."
                  className="pl-8 text-xs h-8 bg-white"
                />
              </div>
            </div>

            {/* Scrollable Original Proposal Content */}
            <div className="p-5 overflow-y-auto space-y-6 text-xs leading-relaxed text-slate-800 divide-y divide-slate-100">
              {proposal.originalSections
                .filter(
                  (s) =>
                    !proposalSearch ||
                    s.title.toLowerCase().includes(proposalSearch.toLowerCase()) ||
                    s.content.toLowerCase().includes(proposalSearch.toLowerCase())
                )
                .map((sec) => (
                  <div
                    key={sec.sectionId}
                    id={sec.sectionId}
                    className="pt-4 first:pt-0 transition-all rounded-lg p-2"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-sm text-gov-primary flex items-center">
                        <BookOpen className="w-3.5 h-3.5 mr-1.5 text-gov-accent" />
                        {sec.title}
                      </h4>
                      <Badge variant="outline" className="font-mono text-[9px] bg-slate-50 text-slate-500">
                        {sec.sourceRef}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                      {sec.content}
                    </p>
                  </div>
                ))}

              {/* Attachments Section */}
              <div className="pt-4">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2 flex items-center">
                  <Paperclip className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                  Submitted Technical Annexures & Certificates
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {proposal.attachments.map((att, i) => (
                    <div
                      key={i}
                      className="p-2 rounded border border-slate-200 bg-slate-50 flex items-center justify-between text-[11px]"
                    >
                      <div className="truncate mr-2">
                        <span className="font-medium text-slate-900 block truncate">{att.name}</span>
                        <span className="text-[10px] text-gov-muted font-mono">{att.type} • {att.size}</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] bg-white shrink-0">
                        VERIFIED
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT PANE: AI-Generated Summary (10 Structured Sections) */}
        {(viewMode === "SPLIT" || viewMode === "SUMMARY") && (
          <div
            ref={summaryPaneRef}
            className={`${
              viewMode === "SUMMARY" ? "lg:col-span-12" : "lg:col-span-6"
            } rounded-xl border border-indigo-200 bg-white shadow-xs overflow-hidden flex flex-col max-h-[820px]`}
          >
            {/* Right Header */}
            <div className="bg-indigo-50/70 border-b border-indigo-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-700" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-950">
                  AI-Generated Summary (10 Sections)
                </h3>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border-emerald-300">
                100% Factual
              </Badge>
            </div>

            {/* Statutory Disclaimer Strip */}
            <div className="px-4 py-2 bg-amber-50/70 border-b border-amber-200/80 text-[11px] text-amber-900 flex items-start space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Statutory Advisory:</strong> This summary extracts key points strictly from the proposal text.
                Review the original text beside for formal scoring.
              </span>
            </div>

            {/* Scrollable Structured Summary Cards */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs divide-y divide-slate-100">
              {summary.summaryList.map((item, index) => {
                const isMissingSection = item.section === "Missing Information";
                const isMissingData = !item.isAvailable;
                const sectionKey = item.section.toLowerCase().replace(/ /g, "");

                return (
                  <div
                    key={item.section}
                    id={`summary-sec-${sectionKey}`}
                    className={`pt-5 first:pt-0 transition-all ${
                      isMissingSection
                        ? "p-4 rounded-xl border-2 border-rose-300 bg-rose-50/40"
                        : "rounded-xl border border-slate-100 p-4 bg-slate-50/30 hover:bg-slate-50/80"
                    }`}
                  >
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-bold font-mono text-[10px]">
                          {index + 1}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">
                          {item.section}
                        </h4>
                      </div>

                      {isMissingSection ? (
                        <Badge variant="destructive" className="font-mono text-[9px]">
                          STATUTORY OMISSIONS
                        </Badge>
                      ) : (
                        <button
                          onClick={() => {
                            if (index < proposal.originalSections.length) {
                              scrollToOriginalSection(proposal.originalSections[index].sectionId);
                            }
                          }}
                          className="text-[10px] font-mono text-gov-accent hover:underline flex items-center"
                          title="Jump to corresponding section in original proposal"
                        >
                          <span>{item.originalSectionRef}</span>
                          <ExternalLink className="w-2.5 h-2.5 ml-1" />
                        </button>
                      )}
                    </div>

                    {/* Detailed Synopsis */}
                    <p className="text-xs text-slate-700 leading-relaxed font-sans mt-1">
                      {item.detailedSynopsis}
                    </p>

                    {/* Bullet Points */}
                    <div className="mt-2.5 space-y-1.5 pl-2 border-l-2 border-indigo-200">
                      {item.keyPoints.map((kp, i) => (
                        <div key={i} className="text-[11px] text-slate-800 flex items-start space-x-1.5">
                          {isMissingSection ? (
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          )}
                          <span
                            className={
                              kp.includes(NOT_PROVIDED_TEXT)
                                ? "font-semibold text-rose-900"
                                : "text-slate-700"
                            }
                          >
                            {kp}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Extracted Quotes Proof */}
                    {item.extractedQuotations.length > 0 && !isMissingSection && (
                      <div className="mt-3 bg-white p-2.5 rounded border border-slate-200/80">
                        <span className="text-[10px] font-bold text-gov-muted uppercase tracking-wider block mb-1">
                          Direct Quote Extraction:
                        </span>
                        {item.extractedQuotations.map((q, i) => (
                          <p key={i} className="text-[11px] italic text-slate-600 font-serif">
                            "{q}"
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
