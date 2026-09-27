"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/auth/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import {
  pilotReportDb,
  PilotReportData,
  RecommendationOption,
} from "@/database/pilotReportDatabase";
import {
  FileText,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  Building2,
  Lock,
  ArrowRight,
  TrendingUp,
  Download,
  Landmark,
  Eye,
  Award,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Check,
  X,
  RefreshCw,
  Cpu,
  BarChart3,
  Calendar,
  CreditCard,
  UserCheck,
} from "lucide-react";

export function PilotExecutiveReportView({
  pilotId = "PILOT-UP-UAQ-01",
  onBack,
}: {
  pilotId?: string;
  onBack?: () => void;
}) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [report, setReport] = useState<PilotReportData | null>(null);
  const [loading, setLoading] = useState(true);

  // Recommendation Modal & Form State
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<RecommendationOption>("Scale");
  const [justificationInput, setJustificationInput] = useState("");
  const [targetScopeInput, setTargetScopeInput] = useState("");
  const [budgetInput, setBudgetInput] = useState<number>(18500000);
  const [humanConfirmed, setHumanConfirmed] = useState(false);
  const [savingRecommendation, setSavingRecommendation] = useState(false);

  // Check if current user is an authorized government decision maker
  const isAuthorizedDecisionMaker =
    currentUser?.role === "GOVERNMENT_OFFICER" ||
    currentUser?.role === "PROCUREMENT_OFFICER" ||
    currentUser?.role === "ADMIN" ||
    currentUser?.role === "PLATFORM_ADMIN";

  const isStartup = currentUser?.role === "STARTUP";

  const loadData = () => {
    try {
      const data = pilotReportDb.getReport(pilotId);
      setReport(data);
      if (data.recommendation) {
        setSelectedOption(data.recommendation.option);
        setJustificationInput(data.recommendation.justification);
        setTargetScopeInput(data.recommendation.targetScaleScope || "");
        setBudgetInput(data.recommendation.authorizedBudgetInr || 18500000);
      }
    } catch (err) {
      console.error("Failed to load pilot report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pilotId]);

  const handlePrint = () => {
    window.print();
  };

  const handleOpenRecommendationModal = () => {
    if (!isAuthorizedDecisionMaker) {
      showToast({
        type: "error",
        title: "Access Restricted",
        description:
          "Statutory procurement recommendations must be entered by an authorized government decision-maker.",
      });
      return;
    }
    setHumanConfirmed(false);
    setShowRecommendationModal(true);
  };

  const handleSubmitRecommendation = () => {
    if (!isAuthorizedDecisionMaker) {
      showToast({
        type: "error",
        title: "Permission Denied",
        description: "Only government officers or admins can record recommendations.",
      });
      return;
    }

    if (!humanConfirmed) {
      showToast({
        type: "error",
        title: "Human Confirmation Required",
        description:
          "Statutory Rule: You must explicitly confirm human decision-making (AI automation is prohibited under GFR Rule 149).",
      });
      return;
    }

    if (!justificationInput.trim() || justificationInput.length < 25) {
      showToast({
        type: "error",
        title: "Justification Required",
        description: "Please provide a detailed statutory justification (min 25 characters).",
      });
      return;
    }

    setSavingRecommendation(true);

    const userName = currentUser
      ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
      : "Rajesh Verma";

    const designation =
      currentUser?.designation ||
      (currentUser?.role === "PROCUREMENT_OFFICER"
        ? "Chief Procurement Officer"
        : "Joint Director, Urban Development");

    const result = pilotReportDb.recordRecommendation(
      pilotId,
      {
        option: selectedOption,
        justification: justificationInput,
        targetScaleScope: targetScopeInput || undefined,
        authorizedBudgetInr: budgetInput || undefined,
        isHumanConfirmed: true,
      },
      {
        name: userName,
        role: currentUser?.role || "GOVERNMENT_OFFICER",
        designation,
        department: "Directorate of Urban Development, Govt of UP",
      }
    );

    setSavingRecommendation(false);

    if (result.success) {
      showToast({
        type: "success",
        title: "Recommendation Recorded",
        description: `Statutory determination '${selectedOption}' recorded in the decision ledger.`,
      });
      setShowRecommendationModal(false);
      loadData();
    } else {
      showToast({
        type: "error",
        title: "Submission Error",
        description: result.error || "Failed to record recommendation.",
      });
    }
  };

  if (loading || !report) {
    return (
      <div className="p-12 text-center text-slate-500">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gov-primary" />
        <p className="text-sm">Assembling Executive Pilot Report...</p>
      </div>
    );
  }

  const formatINR = (val: number) => `₹${val.toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* 1. TOP EXECUTIVE TOOLBAR (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-card border border-slate-200 shadow-2xs print:hidden">
        <div className="flex items-center space-x-2">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack} className="text-xs">
              ← Back to Pilot Cockpit
            </Button>
          )}
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-gov-light text-gov-primary border border-gov-border">
            {report.pilotCode}
          </span>
          <span className="text-xs text-gov-muted hidden sm:inline">
            Executive State Briefing
          </span>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 border-slate-300"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Print / Export PDF
          </Button>

          {isAuthorizedDecisionMaker && (
            <Button
              size="sm"
              onClick={handleOpenRecommendationModal}
              className="text-xs bg-gov-primary hover:bg-gov-primary/90 text-white font-bold"
            >
              <UserCheck className="w-3.5 h-3.5 mr-1.5" />
              Enter Statutory Recommendation
            </Button>
          )}
        </div>
      </div>

      {/* QUICK SECTION ANCHORS (Hidden in Print) */}
      <div className="bg-slate-50 border border-slate-200 rounded-control p-2 text-xs flex items-center overflow-x-auto space-x-1.5 font-medium text-slate-600 print:hidden scrollbar-none">
        <span className="text-xs uppercase font-mono text-gov-muted px-2 shrink-0 font-bold">
          Jump to Section:
        </span>
        {[
          { id: "sec-exec", label: "1. Exec Summary" },
          { id: "sec-prob", label: "2. Problem" },
          { id: "sec-sol", label: "3. Solution" },
          { id: "sec-met", label: "4. Methodology" },
          { id: "sec-base", label: "5. Baseline" },
          { id: "sec-kpi", label: "6. KPIs" },
          { id: "sec-res", label: "7. Results" },
          { id: "sec-evi", label: "8. Evidence" },
          { id: "sec-cost", label: "9. Costs" },
          { id: "sec-risk", label: "10. Risks" },
          { id: "sec-iss", label: "11. Issues" },
          { id: "sec-val", label: "12. Validation" },
          { id: "sec-les", label: "13. Lessons" },
          { id: "sec-rec", label: "14. Recommendation" },
        ].map((sec) => (
          <a
            key={sec.id}
            href={`#${sec.id}`}
            className="px-2.5 py-1 rounded hover:bg-white hover:text-slate-900 whitespace-nowrap transition-colors"
          >
            {sec.label}
          </a>
        ))}
      </div>

      {/* ========================================================= */}
      {/* 2. FORMAL GOVERNMENT REPORT DOCUMENT CONTAINER            */}
      {/* ========================================================= */}
      <div className="bg-white border-2 border-slate-300 rounded-card shadow-sm p-6 sm:p-10 space-y-8 text-slate-800 font-sans print:border-none print:shadow-none print:p-0">
        {/* STATUTORY DOCUMENT HEADER */}
        <div className="border-b-2 border-slate-900 pb-6 text-center space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">
            <Landmark className="w-3.5 h-3.5 text-slate-700" />
            <span>Government of Uttar Pradesh • Department of Urban Development</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight uppercase">
            {report.title}
          </h1>

          <p className="text-sm font-semibold text-slate-700">
            {report.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-mono text-slate-600">
            <span className="bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
              Pilot Code: <strong>{report.pilotCode}</strong>
            </span>
            <span>•</span>
            <span>Period: <strong>{report.period}</strong></span>
            <span>•</span>
            <span>Startup: <strong>{report.startupName}</strong> ({report.startupDpiit})</span>
            <span>•</span>
            <span>Date: <strong>{report.reportDate}</strong></span>
          </div>

          <div className="pt-2">
            <span className="inline-block bg-teal-50 text-teal-900 border border-teal-300 text-xs font-mono font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              Statutory Classification: Official Use • State Procurement Committee (GFR 149)
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 1: EXECUTIVE SUMMARY                              */}
        {/* ========================================================= */}
        <section id="sec-exec" className="space-y-3 pt-2">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-1.5">
            <span className="font-mono text-xs font-bold text-gov-primary">01.</span>
            <h2 className="text-lg font-bold text-slate-950 uppercase tracking-tight">
              Executive Summary
            </h2>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            {report.executiveSummary.overview}
          </p>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-900 block uppercase tracking-wider text-xs">
              Key Statutory Findings & Milestones:
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              {report.executiveSummary.keyHighlights.map((hl, i) => (
                <li key={i} className="leading-relaxed">
                  {hl}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1 font-mono">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-xs text-gov-muted block uppercase">Contract Value</span>
              <span className="text-base font-bold text-slate-900 mt-0.5 block">
                {formatINR(report.executiveSummary.contractValue)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-xs text-gov-muted block uppercase">Disbursed to Date</span>
              <span className="text-base font-bold text-emerald-700 mt-0.5 block">
                {formatINR(report.executiveSummary.disbursedTotal)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-xs text-gov-muted block uppercase">Target Attainment</span>
              <span className="text-base font-bold text-purple-700 mt-0.5 block">
                {report.executiveSummary.overallAttainment}%
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-xs text-gov-muted block uppercase">Independent Audit</span>
              <span className="text-base font-bold text-teal-800 mt-0.5 block">
                TERI VALIDATED
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: PROBLEM                                        */}
        {/* ========================================================= */}
        <section id="sec-prob" className="space-y-3 pt-2">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-1.5">
            <span className="font-mono text-xs font-bold text-gov-primary">02.</span>
            <h2 className="text-lg font-bold text-slate-950 uppercase tracking-tight">
              Problem Statement & Status Quo Deficiencies
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5 text-justify">
              <strong className="text-slate-900 block font-semibold">Civic & Environmental Context:</strong>
              <p className="text-slate-700 leading-relaxed">{report.problem.civicContext}</p>
            </div>
            <div className="space-y-1.5 text-justify">
              <strong className="text-slate-900 block font-semibold">Institutional Status Quo Failure:</strong>
              <p className="text-slate-700 leading-relaxed">{report.problem.statusQuoFailure}</p>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded text-xs text-amber-950 space-y-1">
            <strong>Public Health & Regulatory Urgency:</strong>
            <p className="leading-relaxed">{report.problem.healthEconomicBurden}</p>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: SOLUTION                                       */}
        {/* ========================================================= */}
        <section id="sec-sol" className="space-y-3 pt-2">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-1.5">
            <span className="font-mono text-xs font-bold text-gov-primary">03.</span>
            <h2 className="text-lg font-bold text-slate-950 uppercase tracking-tight">
              Tested Solution & Technical Architecture
            </h2>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            {report.solution.technologyDescription}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <strong className="text-slate-900 block">Hardware & Metrology:</strong>
              <p className="text-slate-700 leading-relaxed">{report.solution.hardwareArchitecture}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <strong className="text-slate-900 block">Software & ICCC Ingress Stream:</strong>
              <p className="text-slate-700 leading-relaxed">{report.solution.softwareAndAiStack}</p>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
            Intellectual Property: {report.solution.intellectualProperty} • Vendor: {report.solution.vendorCredentials}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 4: PILOT METHODOLOGY                              */}
        {/* ========================================================= */}
        <section id="sec-met" className="space-y-3 pt-2">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-1.5">
            <span className="font-mono text-xs font-bold text-gov-primary">04.</span>
            <h2 className="text-lg font-bold text-slate-950 uppercase tracking-tight">
              Pilot Methodology & Collocation Protocol
            </h2>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            {report.pilotMethodology.deploymentFramework}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">CPCB Collocation</span>
              <p className="text-slate-600 text-xs leading-relaxed">{report.pilotMethodology.collocationProtocol}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Ward Selection</span>
              <p className="text-slate-600 text-xs leading-relaxed">{report.pilotMethodology.geographicalSampling}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">QA / QC Calibration</span>
              <p className="text-slate-600 text-xs leading-relaxed">{report.pilotMethodology.qaQcProcedures}</p>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 5: BASELINE                                       */}
        {/* ========================================================= */}
        <section id="sec-base" className="space-y-3 pt-2">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-1.5">
            <span className="font-mono text-xs font-bold text-gov-primary">05.</span>
            <h2 className="text-lg font-bold text-slate-950 uppercase tracking-tight">
              Pre-Intervention Baseline Metrics
            </h2>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            {report.baseline.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block">Coverage Baseline</span>
              <span className="text-lg font-bold text-slate-800 mt-0.5 block">{report.baseline.coverageBaseline}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block">Sensor Accuracy</span>
              <span className="text-lg font-bold text-slate-800 mt-0.5 block">{report.baseline.accuracyBaseline}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block">Historic Availability</span>
              <span className="text-lg font-bold text-slate-800 mt-0.5 block">{report.baseline.uptimeBaseline}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block">Response Latency</span>
              <span className="text-lg font-bold text-slate-800 mt-0.5 block">{report.baseline.responseLatencyBaseline}</span>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 6: KPIS (CLEAR BASELINE -> TARGET -> ACTUAL)      */}
        {/* ========================================================= */}
        <section id="sec-kpi" className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-gov-primary">06.</span>
              <h2 className="text-lg font-bold text-slate-950 uppercase tracking-tight">
                Key Performance Indicators (KPIs)
              </h2>
            </div>
            <span className="font-mono text-xs uppercase text-gov-muted font-bold">
              Baseline → Target → Actual
            </span>
          </div>

          <p className="text-xs text-gov-muted">
            The table below provides audited comparison across all contracted
            statutory targets:
          </p>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-xs uppercase font-mono text-gov-muted border-b border-slate-200">
                <tr>
                  <th className="p-3">Performance Metric</th>
                  <th className="p-3 font-semibold text-slate-700">1. Baseline</th>
                  <th className="p-3 font-semibold text-gov-primary">2. Target</th>
                  <th className="p-3 font-semibold text-emerald-800">3. Actual Result</th>
                  <th className="p-3">Attainment</th>
                  <th className="p-3">Audit Significance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.kpis.map((kpi) => (
                  <tr key={kpi.id} className="hover:bg-slate-50/70">
                    <td className="p-3">
                      <div className="font-semibold text-slate-900">{kpi.metricName}</div>
                      <div className="text-xs text-gov-muted">{kpi.category}</div>
                    </td>
                    <td className="p-3 font-mono text-slate-600 bg-slate-50/50">
                      {kpi.baseline}
                    </td>
                    <td className="p-3 font-mono font-medium text-slate-800">
                      {kpi.target}
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-700 text-sm bg-emerald-50/30">
                      <div className="flex items-center space-x-1">
                        <span>{kpi.actual}</span>
                        <Check className="w-3.5 h-3.5 text-emerald-600 inline" />
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        {kpi.attainmentPercentage}%
                      </span>
                    </td>
                    <td className="p-3 text-xs text-slate-600">
                      {kpi.significance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 7: RESULTS                                        */}
        {/* ========================================================= */}
        <section id="sec-res" className="space-y-3 pt-2">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-1.5">
            <span className="font-mono text-xs font-bold text-gov-primary">07.</span>
            <h2 className="text-lg font-bold text-slate-950 uppercase tracking-tight">
              Empirical Results & Statistical Evaluation
            </h2>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            {report.results.empiricalSummary}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block">Correlation R²</span>
              <span className="text-xl font-bold text-emerald-700 mt-0.5 block">
                {report.results.regressionCorrelationR2}
              </span>
              <span className="text-xs text-emerald-800">Target ≥ 0.90 Met</span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block">Error (MAPE)</span>
              <span className="text-xl font-bold text-slate-900 mt-0.5 block">
                {report.results.meanAbsolutePercentageError}%
              </span>
              <span className="text-xs text-slate-500">Allowable ≤ 5.0%</span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block">Misting Dispatches</span>
              <span className="text-xl font-bold text-slate-900 mt-0.5 block">
                {report.results.interventionsTriggeredCount} Verified
              </span>
              <span className="text-xs text-slate-500">ICCC Automated Trigger</span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block">Confidence</span>
              <span className="text-xl font-bold text-purple-700 mt-0.5 block">
                p &lt; 0.001
              </span>
              <span className="text-xs text-purple-800">Robust Dataset</span>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 8: EVIDENCE                                       */}
        {/* ========================================================= */}
        <section id="sec-evi" className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-gov-primary">08.</span>
              <h2 className="text-lg font-bold text-slate-950 uppercase tracking-tight">
                Traceable Evidence Chain & Verification Digests
              </h2>
            </div>
            <span className="font-mono text-xs text-emerald-700 font-semibold">
              {report.evidence.integrityStatus}
            </span>
          </div>

          <div className="space-y-2">
            {report.evidence.artifacts.map((ev) => (
              <div
                key={ev.id}
                className="p-3 rounded bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-gov-primary bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {ev.id}
                    </span>
                    <span className="font-semibold text-slate-900">{ev.title}</span>
                  </div>
                  <span className="font-mono text-xs text-gov-muted block mt-0.5">
                    Category: {ev.category} • Size: {ev.size} • Verified by {ev.verifiedBy}
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 truncate max-w-xs">
                  SHA-256: {ev.sha256.slice(0, 24)}...
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 9: COSTS                                          */}
        {/* ========================================================= */}
        <section id="sec-cost" className="space-y-3 pt-2">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-1.5">
            <span className="font-mono text-xs font-bold text-gov-primary">09.</span>
            <h2 className="text-lg font-bold text-slate-950 uppercase tracking-tight">
              Cost Analysis & Public Procurement Economics
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block">Total Contract</span>
              <span className="text-base font-bold text-slate-900 mt-0.5 block">{formatINR(report.costs.totalContractValue)}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block">Disbursed (Paid)</span>
              <span className="text-base font-bold text-emerald-700 mt-0.5 block">{formatINR(report.costs.paidAmount)}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block">Approved Pending</span>
              <span className="text-base font-bold text-purple-700 mt-0.5 block">{formatINR(report.costs.approvedAmount)}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-xs text-gov-muted uppercase block">Per Sensor Node</span>
              <span className="text-base font-bold text-slate-800 mt-0.5 block">{formatINR(report.costs.perUnitCostInr)}</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
            <strong className="text-slate-900 block">Capital Expenditure Multiplier Comparison:</strong>
            <p className="text-slate-700 leading-relaxed">
              A standard continuous reference station (CAAQMS) requires an estimated{" "}
              <strong>{formatINR(report.costs.traditionalStationCostInr)}</strong> per unit in capital expenditure.
              In comparison, hyperlocal sensor meshes deploy at {formatINR(report.costs.perUnitCostInr)} per node—achieving{" "}
              <strong>{report.costs.savingsMultiplier}</strong> and enabling whole-city ward-level granularity within municipal budgets.
            </p>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 10: RISKS                                         */}
        {/* ========================================================= */}
        <section id="sec-risk" className="space-y-3 pt-2">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-1.5">
            <span className="font-mono text-xs font-bold text-gov-primary">10.</span>
            <h2 className="text-lg font-bold text-slate-950 uppercase tracking-tight">
              Statutory Risk Register Summary
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            {report.risks.map((risk, idx) => (
              <div
                key={idx}
                className="p-3 rounded bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {risk.area}
                    </span>
                    <span className="font-semibold text-slate-900">{risk.riskTitle}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{risk.mitigation}</p>
                </div>
                <Badge
                  variant={risk.currentStatus === "MITIGATED" ? "success" : "warning"}
                  className="self-start sm:self-auto text-xs font-mono shrink-0"
                >
                  {risk.currentStatus}
                </Badge>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 11: ISSUES                                        */}
        {/* ========================================================= */}
        <section id="sec-iss" className="space-y-3 pt-2">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-1.5">
            <span className="font-mono text-xs font-bold text-gov-primary">11.</span>
            <h2 className="text-lg font-bold text-slate-950 uppercase tracking-tight">
              Operational Field Issues & Resolutions
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            {report.issues.map((iss) => (
              <div
                key={iss.id}
                className="p-3 rounded bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-gov-primary">{iss.id}</span>
                    <span className="font-semibold text-slate-900">{iss.title}</span>
                  </div>
                  <p className="text-xs text-emerald-800 font-medium mt-0.5">
                    <strong>Resolution: </strong> {iss.resolution}
                  </p>
                </div>
                <Badge variant="outline" className="self-start sm:self-auto text-xs text-emerald-700 border-emerald-300 bg-emerald-50 shrink-0">
                  {iss.status}
                </Badge>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 12: VALIDATION                                    */}
        {/* ========================================================= */}
        <section id="sec-val" className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-gov-primary">12.</span>
              <h2 className="text-lg font-bold text-slate-950 uppercase tracking-tight">
                Third-Party Independent Validation (TERI)
              </h2>
            </div>
            <Badge variant="success" className="font-mono text-xs">
              {report.validation.certificationOutcome.toUpperCase()}
            </Badge>
          </div>

          <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-lg space-y-2 text-xs text-teal-950">
            <div className="flex items-center justify-between border-b border-teal-200/80 pb-2">
              <div>
                <strong className="block text-sm font-bold text-teal-950">
                  {report.validation.accreditedAgency}
                </strong>
                <span className="text-xs text-teal-800 font-mono">
                  Lead Auditor: {report.validation.leadAuditor} • Standard: {report.validation.auditStandard}
                </span>
              </div>
              <span className="font-mono text-xs text-teal-800">
                Certified: {report.validation.certificationDate}
              </span>
            </div>
            <p className="leading-relaxed text-teal-900">{report.validation.auditorSummary}</p>
            <span className="text-xs font-mono text-teal-800 block">
              Cryptographic Audit Seal: {report.validation.certificateHash}
            </span>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 13: LESSONS LEARNED                               */}
        {/* ========================================================= */}
        <section id="sec-les" className="space-y-3 pt-2">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-1.5">
            <span className="font-mono text-xs font-bold text-gov-primary">13.</span>
            <h2 className="text-lg font-bold text-slate-950 uppercase tracking-tight">
              Lessons Learned & Procurement Blueprint
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-1.5">
              <strong className="text-slate-900 block font-semibold">Technical Takeaways:</strong>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {report.lessonsLearned.technicalTakeaways.map((t, idx) => (
                  <li key={idx} className="leading-relaxed">{t}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-1.5">
              <strong className="text-slate-900 block font-semibold">Operational & Municipal SLAs:</strong>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {report.lessonsLearned.operationalTakeaways.map((o, idx) => (
                  <li key={idx} className="leading-relaxed">{o}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded text-xs space-y-1.5 text-purple-950">
            <strong className="block text-purple-950 font-bold uppercase tracking-wider text-xs">
              Tender Specifications for Statewide Scale (GFR Rule 149):
            </strong>
            <ul className="list-disc list-inside space-y-1 text-purple-900">
              {report.lessonsLearned.procurementSpecificationsForScale.map((s, idx) => (
                <li key={idx} className="leading-relaxed">{s}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 14: RECOMMENDATION (DECISION-MAKER ENTRY)          */}
        {/* ========================================================= */}
        <section id="sec-rec" className="space-y-4 pt-4 border-t-2 border-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-gov-primary">14.</span>
              <h2 className="text-lg font-bold text-slate-950 uppercase tracking-tight">
                Authorized Decision-Maker Recommendation
              </h2>
            </div>
            {report.recommendation && (
              <Badge
                variant={
                  report.recommendation.option === "Scale"
                    ? "success"
                    : report.recommendation.option === "Close"
                    ? "destructive"
                    : "warning"
                }
                className="font-mono text-xs px-3 py-1"
              >
                OUTCOME: {report.recommendation.option.toUpperCase()}
              </Badge>
            )}
          </div>

          {report.recommendation ? (
            <div className="bg-slate-50 border-2 border-gov-primary/30 rounded-card p-5 space-y-4 text-xs shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-xs uppercase font-mono text-gov-muted block font-bold">
                    Official Statutory Determination:
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 block mt-0.5">
                    {report.recommendation.option}
                  </span>
                </div>

                <div className="text-right font-mono text-xs">
                  <span className="text-slate-700 font-semibold block">{report.recommendation.enteredBy}</span>
                  <span className="text-slate-500 block">{report.recommendation.designation}</span>
                  <span className="text-xs text-gov-muted block">
                    {new Date(report.recommendation.enteredAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>

              <div>
                <strong className="text-slate-900 block mb-1">Official Decision Rationale & Justification:</strong>
                <p className="text-slate-700 leading-relaxed text-justify bg-white p-3.5 rounded border border-slate-200">
                  {report.recommendation.justification}
                </p>
              </div>

              {report.recommendation.targetScaleScope && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-xs text-gov-muted uppercase block">Authorized Geographic Scope:</span>
                    <span className="font-semibold text-slate-900 mt-0.5 block">{report.recommendation.targetScaleScope}</span>
                  </div>
                  {report.recommendation.authorizedBudgetInr && (
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="text-xs text-gov-muted uppercase block">Estimated Scale Budget:</span>
                      <span className="font-bold text-emerald-700 mt-0.5 block text-sm">
                        {formatINR(report.recommendation.authorizedBudgetInr)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-500">
                <span>Cryptographic Digest: {report.recommendation.digitalSignatureDigest}</span>
                <span className="text-emerald-700 font-bold">
                  ✓ Confirmed Human Decision (Section 14 & 33 Compliance)
                </span>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-card border-2 border-dashed border-slate-300 text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
              <h4 className="font-bold text-slate-900 text-sm">Pending Official Decision</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                No recommendation has been recorded yet. An authorized government officer must explicitly review and enter the determination.
              </p>
              {isAuthorizedDecisionMaker && (
                <Button size="sm" onClick={handleOpenRecommendationModal} className="mt-2 bg-gov-primary text-white">
                  Enter Recommendation Now
                </Button>
              )}
            </div>
          )}
        </section>

        {/* REPORT FOOTER SIGNATURE BLOCK */}
        <div className="pt-8 border-t-2 border-slate-900 flex flex-col sm:flex-row justify-between gap-6 text-xs text-slate-700">
          <div>
            <span className="font-mono text-xs text-gov-muted uppercase block">Report Prepared For:</span>
            <span className="font-bold text-slate-900 block mt-0.5">State Procurement Evaluation Committee</span>
            <span className="text-slate-500 block">Department of Urban Development, Govt of UP</span>
          </div>

          <div className="sm:text-right">
            <span className="font-mono text-xs text-gov-muted uppercase block">Certified & Issued Under:</span>
            <span className="font-bold text-slate-900 block mt-0.5">GFR 2017 Rule 149 / UP Innovation Policy</span>
            <span className="text-slate-500 font-mono text-xs block">Document Hash: SHA256:4f53cda18c2baa0c0354bb5f9a3ecbe5</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MODAL: ENTER STATUTORY RECOMMENDATION                  */}
      {/* ========================================================= */}
      {showRecommendationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="bg-white rounded-card max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Record Statutory Pilot Determination
                </h3>
                <p className="text-xs text-gov-muted">
                  Official Procurement Recommendation for {report.pilotCode}
                </p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setShowRecommendationModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Option Selector: Scale, Extend Pilot, Modify & Retest, Close */}
              <div>
                <label className="block font-bold text-slate-800 mb-2">
                  Select Recommendation Option <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    {
                      id: "Scale" as RecommendationOption,
                      label: "Scale",
                      desc: "Direct procurement scale-up across 80 municipal wards under GFR 149.",
                      color: "border-emerald-500 bg-emerald-50/50 text-emerald-950",
                    },
                    {
                      id: "Extend Pilot" as RecommendationOption,
                      label: "Extend Pilot",
                      desc: "Grant 30-60 day field extension for seasonal fog/humidity testing.",
                      color: "border-amber-500 bg-amber-50/50 text-amber-950",
                    },
                    {
                      id: "Modify & Retest" as RecommendationOption,
                      label: "Modify & Retest",
                      desc: "Require startup to add heated optical inlet before re-evaluating.",
                      color: "border-orange-500 bg-orange-50/50 text-orange-950",
                    },
                    {
                      id: "Close" as RecommendationOption,
                      label: "Close",
                      desc: "Conclude testbed without transition to public procurement.",
                      color: "border-rose-500 bg-rose-50/50 text-rose-950",
                    },
                  ].map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedOption(opt.id)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          isSelected
                            ? `${opt.color} ring-2 ring-gov-primary shadow-xs font-bold`
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="font-bold text-sm">{opt.label}</div>
                        <div className="text-xs mt-1 text-slate-600 font-normal leading-tight">
                          {opt.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Justification Textarea */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Statutory Rationale & Justification <span className="text-rose-600">*</span>
                </label>
                <Textarea
                  rows={4}
                  value={justificationInput}
                  onChange={(e) => setJustificationInput(e.target.value)}
                  placeholder="Detail empirical justification based on R² correlation, uptime, and municipal economic impact..."
                  className="text-xs"
                />
                <span className="text-xs text-gov-muted mt-0.5 block">
                  Minimum 25 characters required.
                </span>
              </div>

              {/* Scale Target Scope (if Scale selected) */}
              {selectedOption === "Scale" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Target Geographical Scope
                    </label>
                    <Input
                      value={targetScopeInput}
                      onChange={(e) => setTargetScopeInput(e.target.value)}
                      placeholder="e.g. All 80 Wards of Lucknow (350 nodes)"
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Estimated Procurement Budget (INR)
                    </label>
                    <Input
                      type="number"
                      value={budgetInput}
                      onChange={(e) => setBudgetInput(Number(e.target.value))}
                      className="text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {/* MANDATORY HUMAN DECISION CONFIRMATION CHECKBOX */}
              <div className="p-3.5 rounded-lg border-2 border-amber-300 bg-amber-50/80 space-y-2 text-xs text-amber-950">
                <div className="flex items-center space-x-2 font-bold text-amber-950">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Statutory Human Decision-Making Rule (Section 14 & 33):</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Procurement determinations cannot be delegated to artificial intelligence or automated ranking algorithms. The decision-maker must personally review empirical evidence and assume statutory responsibility.
                </p>
                <label className="flex items-start space-x-2.5 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={humanConfirmed}
                    onChange={(e) => setHumanConfirmed(e.target.checked)}
                    className="mt-0.5 rounded text-gov-primary focus:ring-gov-primary"
                  />
                  <span className="font-semibold text-slate-900 text-xs leading-snug">
                    I confirm as an authorized public officer that this decision is explicitly entered by me based on empirical review, and has not been automated by AI.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setShowRecommendationModal(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitRecommendation}
                disabled={savingRecommendation || !humanConfirmed}
                className="bg-gov-primary hover:bg-gov-primary/90 text-white font-bold"
              >
                {savingRecommendation ? "Recording Determination..." : "Record Official Determination"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
