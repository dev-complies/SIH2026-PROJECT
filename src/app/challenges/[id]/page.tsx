"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { getChallengeById, CHALLENGES_DATA } from "@/data/challengesData";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Bookmark,
  Send,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Layers,
  Sparkles,
  HelpCircle,
  Lock,
  Share2,
} from "lucide-react";

function ChallengeDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const id = typeof params?.id === "string" ? params.id : "";
  const challenge = getChallengeById(id);

  // Saved bookmark state
  const [isSaved, setIsSaved] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Application Form State
  const [dpiitNumber, setDpiitNumber] = useState("DIPP-94812");
  const [proposalTitle, setProposalTitle] = useState("");
  const [technicalApproach, setTechnicalApproach] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("govinnovate_saved_challenges");
      if (stored && id) {
        const list: string[] = JSON.parse(stored);
        setIsSaved(list.includes(id));
      }
    } catch (e) {
      console.error(e);
    }

    if (searchParams?.get("action") === "apply") {
      setIsApplyModalOpen(true);
    }
  }, [id, searchParams]);

  const toggleSave = () => {
    if (!challenge) return;
    try {
      const stored = localStorage.getItem("govinnovate_saved_challenges");
      let list: string[] = stored ? JSON.parse(stored) : [];
      const exists = list.includes(challenge.id);
      if (exists) {
        list = list.filter((item) => item !== challenge.id);
        setIsSaved(false);
        showToast({
          type: "info",
          title: "Removed from Saved",
          description: `Removed "${challenge.title}" from saved bookmarks.`,
        });
      } else {
        list.push(challenge.id);
        setIsSaved(true);
        showToast({
          type: "success",
          title: "Challenge Saved",
          description: `Saved "${challenge.title}" to your bookmarks.`,
        });
      }
      localStorage.setItem("govinnovate_saved_challenges", JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsApplyModalOpen(false);
      showToast({
        type: "success",
        title: "Application Submitted Successfully!",
        description: `Proposal for "${challenge?.code}" is now queued for Expert Double-Blind Evaluation.`,
      });
      router.push("/startup/dashboard?tab=applications");
    }, 1000);
  };

  if (!challenge) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-gov-danger mx-auto" />
        <h2 className="text-xl font-bold text-gov-primary">Challenge Statement Not Found</h2>
        <p className="text-xs text-gov-muted">
          The requested challenge statement does not exist or may have been archived.
        </p>
        <Link href="/challenges">
          <Button size="sm" variant="outline" className="text-xs">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to Challenge Catalog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left pb-20">
      {/* Top Breadcrumb & Return Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gov-border pb-4">
        <Link
          href="/challenges"
          className="text-xs text-gov-muted hover:text-gov-primary flex items-center font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Challenge Discovery Catalog
        </Link>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-gov-muted">
            Official GFR Rule 149 Statement
          </span>
          <span className="text-slate-300">•</span>
          <Badge variant="outline" className="font-mono text-xs text-gov-accent">
            {challenge.code}
          </Badge>
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="bg-white border border-gov-border rounded-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default" className="bg-gov-primary font-mono text-xs">
              {challenge.category.toUpperCase()}
            </Badge>
            <Badge variant={challenge.statusVariant as any} className="font-mono text-xs">
              {challenge.statusLabel}
            </Badge>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-700 font-semibold flex items-center">
              <Building2 className="w-3.5 h-3.5 text-gov-muted mr-1" />
              {challenge.department}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-gov-muted flex items-center">
              <MapPin className="w-3.5 h-3.5 text-gov-muted mr-1" />
              {challenge.location}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-primary tracking-tight leading-tight">
            {challenge.title}
          </h1>

          <p className="text-sm text-slate-700 leading-relaxed max-w-4xl">
            {challenge.description}
          </p>
        </div>

        {/* Key Operational Parameters Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 border border-slate-200/90 rounded-card p-4 text-xs">
          <div>
            <span className="text-xs text-gov-muted font-mono uppercase block">
              TOTAL PILOT BUDGET
            </span>
            <span className="font-black text-slate-900 font-mono text-base">
              {challenge.budget}
            </span>
            <span className="text-[9.5px] text-gov-muted block">100% Grant Escrow Backed</span>
          </div>

          <div>
            <span className="text-xs text-gov-muted font-mono uppercase block">
              PILOT TESTING PERIOD
            </span>
            <span className="font-bold text-slate-800 text-sm">
              {challenge.pilotDuration}
            </span>
            <span className="text-[9.5px] text-gov-muted block">Controlled Municipal Testbed</span>
          </div>

          <div>
            <span className="text-xs text-gov-muted font-mono uppercase block">
              SUBMISSION DEADLINE
            </span>
            <span className="font-bold text-amber-900 text-sm">
              {challenge.deadline}
            </span>
            <span className="text-[9.5px] text-amber-700 block font-mono">
              {challenge.daysRemaining > 0 ? `${challenge.daysRemaining} days remaining` : "Bidding closed"}
            </span>
          </div>

          <div>
            <span className="text-xs text-gov-muted font-mono uppercase block">
              ELIGIBILITY CRITERIA
            </span>
            <span className="font-bold text-slate-800 text-sm">
              DPIIT Recognized
            </span>
            <span className="text-[9.5px] text-emerald-700 block font-medium">
              Hardware/Software Startups
            </span>
          </div>
        </div>

        {/* Primary & Secondary Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-2 text-xs text-gov-muted">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Double-blind academic scoring • Non-dilutive pilot funding</span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Secondary Action */}
            <Button
              size="sm"
              variant="outline"
              onClick={toggleSave}
              className={`text-xs h-9 border-slate-300 ${
                isSaved ? "bg-purple-50 text-purple-900 border-purple-300 font-semibold" : ""
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 mr-1.5 ${isSaved ? "fill-purple-600 text-purple-600" : ""}`} />
              {isSaved ? "Saved in Bookmarks" : "Save Challenge"}
            </Button>

            {/* Primary Action */}
            <Button
              size="sm"
              onClick={() => setIsApplyModalOpen(true)}
              className="bg-gov-primary hover:bg-gov-primary/95 text-white text-xs h-9 font-semibold px-4 shadow-sm"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Apply for this Challenge
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Sections: Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: In-Depth Technical & Procurement Dossier */}
        <div className="lg:col-span-2 space-y-8">
          {/* SECTION 1: PROBLEM & CONTEXT */}
          <section className="bg-white border border-gov-border rounded-card p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <h2 className="text-base font-bold text-gov-primary uppercase tracking-wide font-mono flex items-center">
                1. Civic Problem & Administrative Bottleneck
              </h2>
              <Badge variant="outline" className="text-xs font-mono">
                Mandatory Context
              </Badge>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 mb-1 text-[13px]">
                  The Core Public Challenge:
                </h3>
                <p className="bg-slate-50 border border-slate-200/70 p-3 rounded-control text-slate-700 leading-relaxed">
                  {challenge.problem}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-1 text-[13px]">
                  Ground-Level Context & Why Existing Solutions Fail:
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {challenge.context}
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 2: DESIRED OUTCOME & AUDITED KPIS */}
          <section className="bg-white border border-gov-border rounded-card p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <h2 className="text-base font-bold text-gov-primary uppercase tracking-wide font-mono flex items-center">
                2. Desired Outcome & Acceptance Benchmarks (KPIs)
              </h2>
              <Badge variant="outline" className="text-xs font-mono text-emerald-800 bg-emerald-50 border-emerald-200">
                Audited Gates
              </Badge>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-900 mb-1 text-[13px]">
                  Target Civic Transformation:
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {challenge.desiredOutcome}
                </p>
              </div>

              {/* KPI Audited Acceptance Table */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-gov-primary uppercase tracking-wider block">
                  STATUTORY ACCEPTANCE SCORECARD
                </span>
                <div className="border border-gov-border rounded-control overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-xs uppercase font-mono text-gov-muted border-b border-gov-border">
                      <tr>
                        <th className="p-2.5">Evaluation KPI</th>
                        <th className="p-2.5">Baseline</th>
                        <th className="p-2.5">Pilot Target</th>
                        <th className="p-2.5">Audit Instrument</th>
                        <th className="p-2.5 text-right">Weight</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {challenge.kpis.map((kpi, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-2.5 font-semibold text-slate-900">
                            {kpi.name}
                          </td>
                          <td className="p-2.5 text-slate-600 font-mono">
                            {kpi.baseline}
                          </td>
                          <td className="p-2.5 font-bold text-emerald-800 font-mono">
                            {kpi.target}
                          </td>
                          <td className="p-2.5 text-slate-600 text-xs">
                            {kpi.instrument}
                          </td>
                          <td className="p-2.5 font-mono text-right font-bold text-gov-primary">
                            {kpi.weight}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: TECHNICAL REQUIREMENTS & INTEGRATION */}
          <section className="bg-white border border-gov-border rounded-card p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <h2 className="text-base font-bold text-gov-primary uppercase tracking-wide font-mono">
                3. Technical Specifications & Integration Requirements
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <span className="font-bold text-slate-900 text-[12px] block">
                  Mandatory Specifications:
                </span>
                <ul className="space-y-1.5">
                  {challenge.requirements.mandatory.map((req, idx) => (
                    <li key={idx} className="flex items-start text-slate-700 leading-tight">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gov-primary mr-2 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {challenge.requirements.preferred.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-900 text-[12px] block">
                    Preferred Architecture & Extensions:
                  </span>
                  <ul className="space-y-1.5">
                    {challenge.requirements.preferred.map((pref, idx) => (
                      <li key={idx} className="flex items-start text-slate-600 leading-tight">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2.5 shrink-0 mt-1.5" />
                        <span>{pref}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-control space-y-1">
                <span className="text-xs font-mono text-gov-primary uppercase font-bold block">
                  COMMAND CENTER (ICCC) INTEGRATION SCHEMA
                </span>
                <p className="text-slate-700 text-xs leading-relaxed">
                  {challenge.requirements.integration}
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 4: PILOT STRUCTURE & MILESTONES */}
          <section className="bg-white border border-gov-border rounded-card p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <h2 className="text-base font-bold text-gov-primary uppercase tracking-wide font-mono">
                4. Pilot Structure & Tranche Disbursements
              </h2>
              <Badge variant="outline" className="text-xs font-mono">
                Performance Escrow
              </Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="border border-gov-border rounded-control overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-xs uppercase font-mono text-gov-muted border-b border-gov-border">
                    <tr>
                      <th className="p-2.5">Milestone</th>
                      <th className="p-2.5">Timeline</th>
                      <th className="p-2.5">Key Deliverables</th>
                      <th className="p-2.5 text-right">Disbursement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {challenge.pilotStructure.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="p-2.5 font-bold text-slate-900">{m.milestone}</td>
                        <td className="p-2.5 font-mono text-slate-600">{m.timeline}</td>
                        <td className="p-2.5 text-slate-700 text-xs">{m.deliverable}</td>
                        <td className="p-2.5 text-right font-bold text-gov-primary font-mono">
                          {m.disbursement}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* SECTION 5: BUDGET BREAKDOWN */}
          <section className="bg-white border border-gov-border rounded-card p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <h2 className="text-base font-bold text-gov-primary uppercase tracking-wide font-mono">
                5. Itemized Pilot Budget Breakdown
              </h2>
              <span className="font-mono text-xs font-bold text-slate-900">
                Total: {challenge.budget}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="border border-gov-border rounded-control overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-xs uppercase font-mono text-gov-muted border-b border-gov-border">
                    <tr>
                      <th className="p-2.5">Cost Category</th>
                      <th className="p-2.5 text-right">Allocated Amount</th>
                      <th className="p-2.5 text-right">Budget Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {challenge.budgetBreakdown.map((b, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 text-slate-800">{b.category}</td>
                        <td className="p-2.5 text-right font-mono font-semibold text-slate-900">{b.amount}</td>
                        <td className="p-2.5 text-right font-mono text-slate-600">{b.share}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* SECTION 6: PROCUREMENT TIMELINE */}
          <section className="bg-white border border-gov-border rounded-card p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-base font-bold text-gov-primary uppercase tracking-wide font-mono">
                6. Challenge Lifecycle & Evaluation Timeline
              </h2>
            </div>

            <div className="relative border-l border-slate-200 ml-3.5 space-y-5 text-xs">
              {challenge.timeline.map((step, idx) => (
                <div key={idx} className="relative pl-6">
                  <div
                    className={`absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2 ${
                      step.completed
                        ? "bg-emerald-600 border-white ring-2 ring-emerald-200"
                        : step.current
                        ? "bg-gov-accent border-white ring-2 ring-blue-200 animate-pulse"
                        : "bg-slate-300 border-white"
                    }`}
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <span className="font-bold text-slate-900 text-[13px]">{step.phase}</span>
                    <span className="text-xs font-mono text-gov-muted">{step.date}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5 text-xs">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 7: FREQUENTLY ASKED QUESTIONS (FAQ) */}
          <section className="bg-white border border-gov-border rounded-card p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <h2 className="text-base font-bold text-gov-primary uppercase tracking-wide font-mono flex items-center">
                7. Startup Questions & Legal FAQ
              </h2>
              <span className="text-xs text-gov-muted font-medium">GFR 2017 Guidance</span>
            </div>

            <div className="space-y-2 text-xs">
              {challenge.faq.map((item, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-gov-border rounded-control overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : idx)}
                      className="w-full text-left p-3 font-semibold text-slate-900 bg-slate-50/50 hover:bg-slate-100 flex items-center justify-between"
                    >
                      <span>{item.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-gov-muted shrink-0 ml-2" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gov-muted shrink-0 ml-2" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-3 bg-white border-t border-slate-100 text-slate-700 leading-relaxed text-[11.5px]">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right 1 Column: Eligibility, Documents & Sticky Sidebar */}
        <div className="space-y-6">
          {/* Eligibility Card */}
          <div className="bg-white border border-gov-border rounded-card p-5 shadow-sm space-y-4 text-xs">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
              <ShieldCheck className="w-4 h-4 text-gov-primary" />
              <h3 className="font-bold text-gov-primary uppercase tracking-wider font-mono text-xs">
                Eligibility Criteria
              </h3>
            </div>

            <div className="space-y-3 text-[11.5px]">
              <div>
                <span className="text-xs font-mono text-gov-muted uppercase block">
                  REGISTRATION REQUIREMENT
                </span>
                <p className="text-slate-800 font-medium mt-0.5">
                  {challenge.eligibility.registration}
                </p>
              </div>

              <div>
                <span className="text-xs font-mono text-gov-muted uppercase block">
                  EXPERIENCE THRESHOLD
                </span>
                <p className="text-slate-700 mt-0.5">
                  {challenge.eligibility.experience}
                </p>
              </div>

              <div>
                <span className="text-xs font-mono text-gov-muted uppercase block">
                  CERTIFICATIONS
                </span>
                <p className="text-slate-700 mt-0.5">
                  {challenge.eligibility.certifications}
                </p>
              </div>

              <div>
                <span className="text-xs font-mono text-gov-muted uppercase block">
                  CORE TEAM COMPOSITION
                </span>
                <p className="text-slate-700 mt-0.5">
                  {challenge.eligibility.team}
                </p>
              </div>

              <div>
                <span className="text-xs font-mono text-gov-muted uppercase block">
                  SOVEREIGN SECURITY & DATA LOCALIZATION
                </span>
                <p className="text-slate-700 mt-0.5">
                  {challenge.eligibility.security}
                </p>
              </div>
            </div>
          </div>

          {/* Official Documents Downloads */}
          <div className="bg-white border border-gov-border rounded-card p-5 shadow-sm space-y-4 text-xs">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-gov-primary" />
              <h3 className="font-bold text-gov-primary uppercase tracking-wider font-mono text-xs">
                Procurement Documents
              </h3>
            </div>

            <div className="space-y-2.5">
              {challenge.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-control flex items-center justify-between hover:bg-slate-100 transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-slate-800 text-xs truncate">
                      {doc.name}
                    </p>
                    <span className="text-xs text-gov-muted font-mono">
                      {doc.size} • {doc.date}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      showToast({
                        type: "success",
                        title: "Document Downloaded",
                        description: `Downloading ${doc.name}`,
                      });
                    }}
                    className="h-8 px-2 text-xs border-slate-300 shrink-0"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Get
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Apply Callout Box */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-card p-5 text-xs space-y-3">
            <div className="flex items-center space-x-2 text-gov-primary font-bold">
              <Sparkles className="w-4 h-4 text-gov-accent" />
              <span>Ready to Pilot Your Solution?</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11.5px]">
              Submit your technical architecture and deployment plan before <strong>{challenge.deadline}</strong>. Shortlisted startups receive direct site access and 100% milestone grant escrow.
            </p>
            <Button
              onClick={() => setIsApplyModalOpen(true)}
              className="w-full bg-gov-primary hover:bg-gov-primary/95 text-white font-semibold text-xs h-9"
            >
              Apply for this Challenge <Send className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* APPLICATION MODAL: "Apply for this Challenge" */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-card border border-gov-border bg-white shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <Badge variant="outline" className="font-mono text-xs text-gov-accent">
                  PILOT PROPOSAL SUBMISSION
                </Badge>
                <h3 className="text-base font-extrabold text-gov-primary mt-0.5">
                  Apply for Challenge: {challenge.code}
                </h3>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-control border border-slate-200 text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 block text-xs">
                  Pre-Qualification Verification:
                </span>
                <p className="text-[10.5px] text-gov-muted">
                  By submitting, you certify that your organization possesses active DPIIT Recognition, retains sovereign Indian server tenancy, and agrees to the GFR 2017 Tripartite Covenant.
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  DPIIT Startup Recognition Number <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  value={dpiitNumber}
                  onChange={(e) => setDpiitNumber(e.target.value)}
                  placeholder="e.g. DIPP-94812"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Proposed Solution Title <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                  placeholder="e.g. AirSense Mesh: Calibrated Real-Time Optical AQI Nodes"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Technical Architecture & Pilot Execution Overview <span className="text-red-500">*</span>
                </label>
                <Textarea
                  required
                  rows={4}
                  value={technicalApproach}
                  onChange={(e) => setTechnicalApproach(e.target.value)}
                  placeholder="Describe your sensor hardware, edge analytics pipeline, ICCC API push method, and 15-day deployment readiness..."
                  className="text-xs"
                />
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <span className="text-xs text-gov-muted font-mono flex items-center">
                  <Lock className="w-3 h-3 text-slate-400 mr-1" />
                  Encrypted SHA-256 submission
                </span>

                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="text-xs h-8.5"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gov-primary hover:bg-gov-primary/95 text-white text-xs h-8.5 font-semibold"
                  >
                    {isSubmitting ? "Submitting Proposal..." : "Submit Application"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChallengeDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center space-y-2">
          <div className="w-6 h-6 border-2 border-gov-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gov-muted font-mono">Loading procurement dossier...</p>
        </div>
      }
    >
      <ChallengeDetailContent />
    </Suspense>
  );
}
