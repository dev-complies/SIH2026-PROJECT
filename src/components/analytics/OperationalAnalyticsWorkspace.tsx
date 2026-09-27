"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/auth/AuthContext";
import { analyticsDb, MetricSummary, TrendDataPoint, DepartmentPerformanceItem, OperationalBottleneckItem } from "@/database/analyticsDatabase";
import { cn } from "@/utils";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Download,
  Filter,
  Layers,
  ArrowRight,
  Printer,
  Sparkles,
  Zap,
  Info,
  DollarSign,
  Activity,
  Search,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Building2,
  MapPin,
  Check,
  X,
  XCircle,
} from "lucide-react";

export function OperationalAnalyticsWorkspace() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  // 5 Mandatory Filter States
  const [selectedDepartment, setSelectedDepartment] = useState<string>("ALL");
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>("ALL");

  // Active Tab View for Focused Visual Analysis (Preventing Screen Overload)
  const [activeTab, setActiveTab] = useState<"overview" | "performance" | "bottlenecks" | "fiscal">("overview");

  // Query analytics from database
  const analyticsData = useMemo(() => {
    return analyticsDb.queryAnalytics({
      department: selectedDepartment,
      state: selectedState,
      district: selectedDistrict,
      category: selectedCategory,
      timePeriod: selectedTimePeriod,
    });
  }, [selectedDepartment, selectedState, selectedDistrict, selectedCategory, selectedTimePeriod]);

  const filterOptions = useMemo(() => analyticsDb.getAvailableFilterOptions(), []);
  const m = analyticsData.metricsSummary;

  const activeFiltersCount =
    (selectedDepartment !== "ALL" ? 1 : 0) +
    (selectedState !== "ALL" ? 1 : 0) +
    (selectedDistrict !== "ALL" ? 1 : 0) +
    (selectedCategory !== "ALL" ? 1 : 0) +
    (selectedTimePeriod !== "ALL" ? 1 : 0);

  const resetFilters = () => {
    setSelectedDepartment("ALL");
    setSelectedState("ALL");
    setSelectedDistrict("ALL");
    setSelectedCategory("ALL");
    setSelectedTimePeriod("ALL");
  };

  return (
    <div className="space-y-6 text-left pb-20">
      {/* ======================================================== */}
      {/* 1. HEADER & EXECUTIVE PURPOSE BANNER                     */}
      {/* ======================================================== */}
      <div className="bg-white border border-gov-border rounded-card p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <Badge variant="default" className="bg-gov-primary font-mono text-[9px]">
                STATE EXECUTIVE DASHBOARD • GFR COMPLIANT
              </Badge>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-gov-muted font-medium">
                Operational Performance & Bottleneck Diagnosis Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-primary tracking-tight">
              Innovation & Procurement Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mt-1 leading-relaxed">
              Real-time portfolio intelligence querying live databases across challenges, applications,
              active testbeds, and treasury disbursements. Designed to pinpoint operational friction,
              track prompt payment adherence, and accelerate commercial scaling.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <Button
              size="sm"
              onClick={() => window.print()}
              className="text-xs h-8 bg-slate-900 hover:bg-slate-800 text-white font-semibold"
            >
              <Printer className="w-3.5 h-3.5 mr-1" /> Export Briefing
            </Button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. THE 5 MANDATORY FILTER CONTROLS                       */}
        {/* Department | State | District | Category | Time Period   */}
        {/* ======================================================== */}
        <div className="bg-slate-50 border border-slate-200 rounded-control p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10.5px] uppercase font-bold text-gov-muted flex items-center">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-gov-primary" />
              PORTFOLIO FILTERS ({activeFiltersCount} ACTIVE)
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[10.5px] font-mono text-rose-700 hover:underline font-semibold"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
            {/* 1. Department */}
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                DEPARTMENT
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full border border-slate-300 rounded-control p-1.5 text-xs bg-white text-slate-800 truncate"
              >
                <option value="ALL">All Departments</option>
                {filterOptions.departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. State */}
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                STATE
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full border border-slate-300 rounded-control p-1.5 text-xs bg-white text-slate-800"
              >
                <option value="ALL">All States / Central</option>
                {filterOptions.states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. District */}
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                DISTRICT
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full border border-slate-300 rounded-control p-1.5 text-xs bg-white text-slate-800"
              >
                <option value="ALL">All Districts</option>
                {filterOptions.districts.map((dst) => (
                  <option key={dst} value={dst}>
                    {dst}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Category */}
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                CATEGORY
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-slate-300 rounded-control p-1.5 text-xs bg-white text-slate-800 truncate"
              >
                <option value="ALL">All Categories</option>
                {filterOptions.categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Time Period */}
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                TIME PERIOD
              </label>
              <select
                value={selectedTimePeriod}
                onChange={(e) => setSelectedTimePeriod(e.target.value)}
                className="w-full border border-slate-300 rounded-control p-1.5 text-xs bg-white text-slate-800 font-medium"
              >
                {filterOptions.timePeriods.map((tp) => (
                  <option key={tp.id} value={tp.id}>
                    {tp.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. CORE 10 METRIC INDICATORS STRIP                       */}
      {/* Challenges | Applications | Pilots | Validated | Scaled  */}
      {/* Avg Duration | Payment Time | KPI Attainment | Budget    */}
      {/* Risk Distribution                                       */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
        {/* Metric 1: Challenges */}
        <div className="p-3.5 bg-white border border-gov-border rounded-card shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-gov-muted font-mono text-[10px]">
            <span>CHALLENGES</span>
            <Badge variant="outline" className="text-[9px] font-mono">
              FLOTATION
            </Badge>
          </div>
          <strong className="text-xl font-extrabold text-slate-900 font-mono block">
            {m.challengesCount}
          </strong>
          <span className="text-[10.5px] text-slate-500 block">Civic Problem Briefs</span>
        </div>

        {/* Metric 2: Applications */}
        <div className="p-3.5 bg-white border border-gov-border rounded-card shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-gov-muted font-mono text-[10px]">
            <span>APPLICATIONS</span>
            <span className="text-emerald-700 font-bold text-[9px] font-mono">
              7.2x INFLOW
            </span>
          </div>
          <strong className="text-xl font-extrabold text-gov-primary font-mono block">
            {m.applicationsCount}
          </strong>
          <span className="text-[10.5px] text-slate-500 block">Startup Submissions</span>
        </div>

        {/* Metric 3: Active Pilots */}
        <div className="p-3.5 bg-white border border-gov-border rounded-card shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-gov-muted font-mono text-[10px]">
            <span>TESTBED PILOTS</span>
            <Badge variant="default" className="text-[9px] font-mono bg-gov-secondary">
              ACTIVE
            </Badge>
          </div>
          <strong className="text-xl font-extrabold text-slate-900 font-mono block">
            {m.pilotsCount}
          </strong>
          <span className="text-[10.5px] text-slate-500 block">Controlled Deployments</span>
        </div>

        {/* Metric 4: Validated Solutions */}
        <div className="p-3.5 bg-white border border-gov-border rounded-card shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-gov-muted font-mono text-[10px]">
            <span>VALIDATED</span>
            <span className="text-emerald-700 font-bold text-[9px] font-mono">TERI / IITK</span>
          </div>
          <strong className="text-xl font-extrabold text-emerald-800 font-mono block">
            {m.validatedSolutionsCount}
          </strong>
          <span className="text-[10.5px] text-emerald-700 block font-semibold">
            Certified Third-Party
          </span>
        </div>

        {/* Metric 5: Scaled Solutions */}
        <div className="p-3.5 bg-white border border-gov-border rounded-card shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-gov-muted font-mono text-[10px]">
            <span>SCALED</span>
            <Badge variant="success" className="text-[9px] font-mono">
              GFR 149
            </Badge>
          </div>
          <strong className="text-xl font-extrabold text-amber-800 font-mono block">
            {m.scaledSolutionsCount}
          </strong>
          <span className="text-[10.5px] text-slate-500 block">Multi-City Procured</span>
        </div>

        {/* Metric 6: Average Pilot Duration */}
        <div className="p-3.5 bg-white border border-gov-border rounded-card shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-gov-muted font-mono text-[10px]">
            <span>AVG PILOT DURATION</span>
            <span className="font-mono text-[9px] text-slate-400">Target 90d</span>
          </div>
          <strong className="text-xl font-extrabold text-slate-900 font-mono block">
            {m.averagePilotDurationDays} <span className="text-xs font-normal">Days</span>
          </strong>
          <span className="text-[10.5px] text-emerald-700 block font-semibold">
            On Target (-1.6d)
          </span>
        </div>

        {/* Metric 7: Average Payment Time */}
        <div className="p-3.5 bg-white border border-gov-border rounded-card shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-gov-muted font-mono text-[10px]">
            <span>AVG PAYMENT TIME</span>
            <span className="font-mono text-[9px] text-emerald-700 font-bold">&lt; 15d Mandate</span>
          </div>
          <strong
            className={cn(
              "text-xl font-extrabold font-mono block",
              m.averagePaymentTimeDays <= 15 ? "text-emerald-800" : "text-rose-700"
            )}
          >
            {m.averagePaymentTimeDays} <span className="text-xs font-normal">Days</span>
          </strong>
          <span className="text-[10.5px] text-slate-500 block">Invoice to Treasury</span>
        </div>

        {/* Metric 8: KPI Achievement Rate */}
        <div className="p-3.5 bg-white border border-gov-border rounded-card shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-gov-muted font-mono text-[10px]">
            <span>KPI ACHIEVEMENT</span>
            <span className="text-emerald-700 font-bold text-[9px] font-mono">PORTFOLIO</span>
          </div>
          <strong className="text-xl font-extrabold text-emerald-800 font-mono block">
            {m.kpiAchievementRatePercent}%
          </strong>
          <span className="text-[10.5px] text-slate-500 block">Baseline Exceeded</span>
        </div>

        {/* Metric 9: Budget Utilization */}
        <div className="p-3.5 bg-white border border-gov-border rounded-card shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-gov-muted font-mono text-[10px]">
            <span>BUDGET UTILIZATION</span>
            <span className="font-mono text-[9px] text-slate-400">Escrow Released</span>
          </div>
          <strong className="text-xl font-extrabold text-gov-primary font-mono block">
            {m.budgetUtilizationPercent}%
          </strong>
          <span className="text-[10.5px] text-slate-500 block font-mono">
            ₹{(m.budgetTotalDisbursedInr / 100000).toFixed(1)}L / ₹{(m.budgetTotalCommittedInr / 100000).toFixed(1)}L
          </span>
        </div>

        {/* Metric 10: Risk Distribution */}
        <div className="p-3.5 bg-white border border-gov-border rounded-card shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-gov-muted font-mono text-[10px]">
            <span>RISK DISTRIBUTION</span>
            <span className="font-mono text-[9px] text-emerald-700 font-bold">0 CRITICAL</span>
          </div>
          <div className="flex items-center space-x-1.5 pt-0.5">
            <span className="text-xs font-mono font-bold text-emerald-700">
              {m.riskDistribution.lowPercent}% Low
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-mono font-bold text-amber-700">
              {m.riskDistribution.mediumPercent}% Med
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-mono font-bold text-rose-700">
              {m.riskDistribution.highPercent}% Hi
            </span>
          </div>
          <span className="text-[10.5px] text-slate-500 block">All Covenants Active</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. EXECUTIVE TAB NAVIGATION TO PREVENT SCREEN OVERLOAD   */}
      {/* Overview | Operational Bottlenecks | Department Velocity */}
      {/* ======================================================== */}
      <div className="flex items-center space-x-1 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("overview")}
          className={cn(
            "px-4 py-2.5 rounded-t-md border-b-2 transition-all flex items-center space-x-1.5",
            activeTab === "overview"
              ? "border-gov-primary text-gov-primary font-bold bg-slate-50"
              : "border-transparent text-slate-600 hover:text-slate-900"
          )}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Pipeline & Trends</span>
        </button>

        <button
          onClick={() => setActiveTab("bottlenecks")}
          className={cn(
            "px-4 py-2.5 rounded-t-md border-b-2 transition-all flex items-center space-x-1.5",
            activeTab === "bottlenecks"
              ? "border-amber-600 text-amber-900 font-bold bg-amber-50/50"
              : "border-transparent text-slate-600 hover:text-slate-900"
          )}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Operational Bottlenecks ({analyticsData.operationalBottlenecks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("performance")}
          className={cn(
            "px-4 py-2.5 rounded-t-md border-b-2 transition-all flex items-center space-x-1.5",
            activeTab === "performance"
              ? "border-gov-primary text-gov-primary font-bold bg-slate-50"
              : "border-transparent text-slate-600 hover:text-slate-900"
          )}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Department Performance</span>
        </button>

        <button
          onClick={() => setActiveTab("fiscal")}
          className={cn(
            "px-4 py-2.5 rounded-t-md border-b-2 transition-all flex items-center space-x-1.5",
            activeTab === "fiscal"
              ? "border-gov-primary text-gov-primary font-bold bg-slate-50"
              : "border-transparent text-slate-600 hover:text-slate-900"
          )}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Fiscal & Risk Distribution</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: PIPELINE VELOCITY & TREND CHARTS                  */}
      {/* ======================================================== */}
      {activeTab === "overview" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* Trend Chart: Monthly Scaling Trajectory (8 Cols) */}
            <div className="lg:col-span-8 bg-white border border-gov-border rounded-card p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    7-Month Innovation Trajectory & Scaling Velocity
                  </h3>
                  <p className="text-[11px] text-gov-muted">
                    Monthly conversion from problem statements to certified commercial adoptions
                  </p>
                </div>

                <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-600">
                  <span className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mr-1.5" /> Applications
                  </span>
                  <span className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mr-1.5" /> Active Pilots
                  </span>
                  <span className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600 mr-1.5" /> Scaled Solutions
                  </span>
                </div>
              </div>

              {/* Clean SVG Trend Chart */}
              <div className="h-64 relative bg-slate-50/70 border border-slate-200 rounded-control p-3 overflow-hidden">
                <svg viewBox="0 0 700 220" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[0, 50, 100, 150, 200].map((y, i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={y}
                      x2="700"
                      y2={y}
                      stroke="#e2e8f0"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Monthly Applications Line (Scaled down for chart) */}
                  <path
                    d="M 50 185 L 150 160 L 250 135 L 350 110 L 450 85 L 550 55 L 650 30"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                  />

                  {/* Active Pilots Line */}
                  <path
                    d="M 50 200 L 150 190 L 250 178 L 350 170 L 450 155 L 550 150 L 650 145"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2.5"
                  />

                  {/* Scaled Solutions Line */}
                  <path
                    d="M 50 215 L 150 210 L 250 202 L 350 202 L 450 195 L 550 188 L 650 180"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="2.5"
                  />

                  {/* Node Circles */}
                  {analyticsData.monthlyTrajectory.map((pt, idx) => {
                    const cx = 50 + idx * 100;
                    return (
                      <g key={idx}>
                        <circle cx={cx} cy={200 - idx * 28} r="3.5" fill="#2563eb" />
                        <circle cx={cx} cy={205 - idx * 10} r="3.5" fill="#059669" />
                        <text
                          x={cx}
                          y="218"
                          fontSize="9"
                          fill="#64748b"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {pt.month.slice(0, 3)}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gov-muted pt-1">
                <span>Data partition: TimescaleDB telemetry log</span>
                <span className="font-mono text-emerald-700 font-bold">
                  Scale Conversion Velocity: 9.4%
                </span>
              </div>
            </div>

            {/* Distribution Chart: Pipeline Funnel (4 Cols) */}
            <div className="lg:col-span-4 bg-white border border-gov-border rounded-card p-5 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  State Innovation Pipeline Funnel
                </h3>
                <p className="text-[11px] text-gov-muted">
                  Stage-by-stage attrition and qualification rate
                </p>
              </div>

              <div className="space-y-2 py-1">
                {[
                  { stage: "Challenges Floated", count: m.challengesCount, percent: 100, color: "bg-slate-700" },
                  { stage: "Applications Received", count: m.applicationsCount, percent: 85, color: "bg-blue-600" },
                  { stage: "Pilots Commissioned", count: m.pilotsCount, percent: 45, color: "bg-gov-secondary" },
                  { stage: "Validated Solutions", count: m.validatedSolutionsCount, percent: 28, color: "bg-emerald-600" },
                  { stage: "Statewide Scaled", count: m.scaledSolutionsCount, percent: 14, color: "bg-amber-600" },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700 font-medium">{item.stage}</span>
                      <strong className="font-mono text-slate-900">{item.count}</strong>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", item.color)}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-control text-[11px] text-emerald-950">
                <span className="font-bold block">Funnel Efficiency:</span>
                Application-to-pilot shortlisting ratio is <strong>1 : 7.2</strong> with zero drop-outs during independent validation.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: OPERATIONAL BOTTLENECKS & FRICTION DIAGNOSTICS   */}
      {/* ======================================================== */}
      {activeTab === "bottlenecks" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-amber-50/60 border border-amber-200 rounded-card p-4 space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <h3 className="font-bold text-sm">
                Systemic Bottleneck Diagnosis for Executive Action
              </h3>
            </div>
            <p className="text-[11.5px] text-amber-900 leading-relaxed">
              The engine automatically flags municipal departments where statutory review or disbursement
              benchmarks lag behind state innovation mandates. Interventions below are pre-drafted for
              department secretaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {analyticsData.operationalBottlenecks.map((bot) => (
              <div
                key={bot.id}
                className="bg-white border border-gov-border rounded-card p-4 shadow-2xs space-y-3 text-xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={bot.severity === "CRITICAL" ? "destructive" : "warning"}
                      className="text-[9px] font-mono"
                    >
                      {bot.severity} BOTTLENECK
                    </Badge>
                    <span className="font-mono text-[10px] text-gov-muted">{bot.id}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-gov-muted uppercase block">
                      {bot.department}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-0.5">{bot.location}</h4>
                  </div>

                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-control space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Observed Metric:</span>
                      <strong className="text-rose-700 font-mono">{bot.metricObserved}</strong>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Benchmark:</span>
                      <strong className="text-emerald-700 font-mono">{bot.targetBenchmark}</strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10.5px] font-semibold text-slate-700 block">Delay Impact:</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">{bot.delayImpact}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-gov-primary uppercase block">
                    RECOMMENDED INTERVENTION:
                  </span>
                  <p className="text-[11px] text-slate-800 bg-blue-50/50 p-2 rounded-2xs border border-blue-100 mt-1 leading-snug">
                    {bot.recommendedIntervention}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: DEPARTMENT PERFORMANCE COMPARISON (BAR CHARTS)   */}
      {/* ======================================================== */}
      {activeTab === "performance" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-white border border-gov-border rounded-card p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Departmental Velocity & Testing Duration Comparison
                </h3>
                <p className="text-[11px] text-gov-muted">
                  Mean pilot execution days vs statutory 90-day testing benchmark across line departments
                </p>
              </div>

              <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-600">
                <span className="flex items-center">
                  <span className="w-3 h-2 bg-gov-primary mr-1.5" /> Department Avg Duration (Days)
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-0.5 border-b border-dashed border-emerald-600 mr-1.5" /> Target (90d)
                </span>
              </div>
            </div>

            {/* Department Bar Chart Grid */}
            <div className="space-y-3 pt-1">
              {analyticsData.departmentalPerformance.map((dept, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                    <div className="flex items-center space-x-2">
                      <strong className="text-slate-900 font-semibold">{dept.department}</strong>
                      <span className="text-[10px] font-mono text-gov-muted">
                        ({dept.activePilots} Pilots)
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 font-mono text-[10.5px]">
                      <span>Duration: <strong>{dept.avgDurationDays}d</strong></span>
                      <span>Payment: <strong className={dept.avgPaymentDays > 15 ? "text-rose-700" : "text-emerald-700"}>{dept.avgPaymentDays}d</strong></span>
                      <span>Attainment: <strong className="text-emerald-800">{dept.kpiAchievementPercent}%</strong></span>
                    </div>
                  </div>

                  {/* Duration Bar relative to 140-day scale */}
                  <div className="relative h-4 bg-slate-100 rounded-control overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-control transition-all duration-500",
                        dept.avgDurationDays <= 90
                          ? "bg-emerald-600"
                          : dept.avgDurationDays <= 105
                          ? "bg-amber-500"
                          : "bg-rose-600"
                      )}
                      style={{ width: `${Math.min(100, (dept.avgDurationDays / 130) * 100)}%` }}
                    />
                    {/* 90-day target tick line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-900/60 z-10"
                      style={{ left: `${(90 / 130) * 100}%` }}
                      title="90-day Target Benchmark"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: FISCAL GOVERNANCE & RISK DISTRIBUTION             */}
      {/* ======================================================== */}
      {activeTab === "fiscal" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Fiscal Allocation vs Disbursed Bar Chart */}
            <div className="bg-white border border-gov-border rounded-card p-5 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  Budget Committed vs Treasury Disbursed
                </h3>
                <p className="text-[11px] text-gov-muted">
                  Overall Portfolio Utilization: {m.budgetUtilizationPercent}%
                </p>
              </div>

              <div className="space-y-3">
                {analyticsData.departmentalPerformance.map((dept, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-medium text-slate-800">{dept.departmentShort}</span>
                      <span className="font-mono text-[10.5px]">
                        ₹{(dept.budgetDisbursedInr / 100000).toFixed(1)}L / ₹{(dept.budgetCommittedInr / 100000).toFixed(1)}L ({dept.utilizationPercent}%)
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gov-primary rounded-full transition-all duration-500"
                        style={{ width: `${dept.utilizationPercent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Tier Segmented Distribution */}
            <div className="bg-white border border-gov-border rounded-card p-5 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  Portfolio Operational Risk Distribution
                </h3>
                <p className="text-[11px] text-gov-muted">
                  Statutory risk covenant distribution across active testbeds
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-control bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-mono text-emerald-800 uppercase block font-semibold">
                    LOW RISK (SECURE)
                  </span>
                  <strong className="text-2xl font-bold font-mono text-emerald-900">
                    {m.riskDistribution.lowPercent}%
                  </strong>
                  <span className="text-[10px] text-emerald-700 block">
                    {m.riskDistribution.low} Active Pilots
                  </span>
                </div>

                <div className="p-3 rounded-control bg-amber-50 border border-amber-200">
                  <span className="text-[10px] font-mono text-amber-800 uppercase block font-semibold">
                    MEDIUM RISK (MONITORED)
                  </span>
                  <strong className="text-2xl font-bold font-mono text-amber-900">
                    {m.riskDistribution.mediumPercent}%
                  </strong>
                  <span className="text-[10px] text-amber-700 block">
                    {m.riskDistribution.medium} Active Pilots
                  </span>
                </div>

                <div className="p-3 rounded-control bg-rose-50 border border-rose-200">
                  <span className="text-[10px] font-mono text-rose-800 uppercase block font-semibold">
                    HIGH RISK (ATTENTION)
                  </span>
                  <strong className="text-2xl font-bold font-mono text-rose-900">
                    {m.riskDistribution.highPercent}%
                  </strong>
                  <span className="text-[10px] text-rose-700 block">
                    {m.riskDistribution.high} Active Pilots
                  </span>
                </div>

                <div className="p-3 rounded-control bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
                    CRITICAL BREACH
                  </span>
                  <strong className="text-2xl font-bold font-mono text-slate-700">
                    {m.riskDistribution.criticalPercent}%
                  </strong>
                  <span className="text-[10px] text-slate-500 block">0 In Jeopardy</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-control text-[11px] text-slate-600">
                Risk governance: All high-risk testbeds have designated senior nodal officers and weekly telemetry audit runs.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
