"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/auth/AuthContext";
import {
  ProvenSolution,
  INITIAL_PROVEN_SOLUTIONS,
  provenSolutionsDb,
} from "@/database/provenSolutionsDatabase";
import { cn } from "@/utils";
import {
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Building2,
  ArrowRight,
  TrendingUp,
  Activity,
  FileCheck2,
  FileText,
  MapPin,
  Clock,
  DollarSign,
  Download,
  Sparkles,
  ExternalLink,
  Layers,
  LayoutGrid,
  ListFilter,
  X,
  ChevronDown,
  Info,
  Check,
  Send,
  Zap,
  Printer,
  ChevronRight,
  Cpu,
  Radio,
  SlidersHorizontal,
} from "lucide-react";

export function ProvenSolutionsLibrary() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [solutions, setSolutions] = useState<ProvenSolution[]>(INITIAL_PROVEN_SOLUTIONS);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedTechnology, setSelectedTechnology] = useState<string>("ALL");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("ALL");
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"kpi" | "savings" | "duration" | "cost">("kpi");
  const [viewMode, setViewMode] = useState<"hybrid" | "ledger">("hybrid");

  // Selected solution for full dossier drawer
  const [dossierSolution, setDossierSolution] = useState<ProvenSolution | null>(null);

  // Modal for Departmental Replication Intent
  const [replicationModal, setReplicationModal] = useState<{
    isOpen: boolean;
    solution: ProvenSolution | null;
  }>({ isOpen: false, solution: null });

  const [targetDepartment, setTargetDepartment] = useState("");
  const [targetCity, setTargetCity] = useState("Lucknow Municipal Corporation");
  const [plannedWards, setPlannedWards] = useState(20);
  const [replicationScopeNote, setReplicationScopeNote] = useState("");
  const [submittingReplication, setSubmittingReplication] = useState(false);

  // Facet Options
  const categories = useMemo(() => provenSolutionsDb.getCategories(), []);
  const departments = useMemo(() => provenSolutionsDb.getDepartments(), []);
  const locations = useMemo(() => provenSolutionsDb.getLocations(), []);
  const technologies = [
    "LoRaWAN 865-867 MHz",
    "Edge Computer Vision",
    "Piezoelectric Hydrophones",
    "Autonomous Flight UAVs",
    "Handheld Non-Mydriatic Fundus",
    "Anaerobic Bio-Digesters",
  ];

  // Filtering Logic
  const filteredSolutions = useMemo(() => {
    return provenSolutionsDb.filterSolutions({
      search,
      category: selectedCategory,
      technology: selectedTechnology,
      department: selectedDepartment,
      location: selectedLocation,
      sortBy,
    });
  }, [search, selectedCategory, selectedTechnology, selectedDepartment, selectedLocation, sortBy]);

  const activeFilterCount =
    (selectedCategory !== "ALL" ? 1 : 0) +
    (selectedTechnology !== "ALL" ? 1 : 0) +
    (selectedDepartment !== "ALL" ? 1 : 0) +
    (selectedLocation !== "ALL" ? 1 : 0) +
    (search.trim() ? 1 : 0);

  const resetAllFilters = () => {
    setSearch("");
    setSelectedCategory("ALL");
    setSelectedTechnology("ALL");
    setSelectedDepartment("ALL");
    setSelectedLocation("ALL");
    setSortBy("kpi");
  };

  const handleOpenReplication = (sol: ProvenSolution) => {
    setTargetDepartment(sol.applicableDepartments[0] || "");
    setReplicationScopeNote(
      `Fast-track replication request for ${sol.title} based on successful ${sol.pilotLocation.city} pilot results under GFR Rule 149(v).`
    );
    setReplicationModal({ isOpen: true, solution: sol });
  };

  const handleSubmitReplication = async () => {
    if (!replicationModal.solution) return;
    try {
      setSubmittingReplication(true);
      const res = await fetch(`/api/proven-solutions/${replicationModal.solution.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetDepartment,
          targetCity,
          plannedWards,
          replicationScopeNote,
          officerName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Authorized Officer",
          officerEmail: currentUser?.email || "officer@gov.in",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit replication intent.");
      }

      showToast({
        type: "success",
        title: "Replication Intent Registered",
        description: `Reference ${data.inquiryReference}: Dossier forwarded to department nodal team.`,
      });

      setReplicationModal({ isOpen: false, solution: null });
    } catch (e: any) {
      showToast({
        type: "error",
        title: "Submission Error",
        description: e.message || "Failed to register replication request.",
      });
    } finally {
      setSubmittingReplication(false);
    }
  };

  return (
    <div className="space-y-6 text-left pb-20">
      {/* ======================================================== */}
      {/* 1. HERO & STATUTORY CONTEXT BANNER                       */}
      {/* ======================================================== */}
      <div className="bg-white border border-gov-border rounded-card p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <Badge variant="default" className="bg-emerald-800 font-mono text-[9px]">
                STATE REPLICATION REGISTRY • GFR RULE 149(v)
              </Badge>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-gov-muted font-medium">
                Audited & Fully Certified Municipal Testbed Innovations
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-primary tracking-tight">
              Proven Solutions Library
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mt-1 leading-relaxed">
              Discover technologies that have completed controlled 60–120 day government pilots,
              achieved audited statutory KPIs, and earned third-party accredited validation from
              institutions including TERI, IIT Kanpur, and CSIR. Government departments can replicate
              these tested innovations with minimized procurement risk.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
            <Link href="/gov/pilots/report">
              <Button variant="outline" size="sm" className="text-xs h-8 border-slate-300">
                <FileText className="w-3.5 h-3.5 mr-1" /> View Pilot Dossier
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => window.print()}
              className="text-xs h-8 bg-slate-900 hover:bg-slate-800 text-white font-semibold"
            >
              <Printer className="w-3.5 h-3.5 mr-1" /> Export Registry PDF
            </Button>
          </div>
        </div>

        {/* 4 Core Registry Statistical Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-control p-3.5 text-xs">
          <div>
            <span className="text-[10px] text-gov-muted font-mono uppercase block font-semibold">
              VALIDATED SOLUTIONS
            </span>
            <strong className="text-base font-extrabold text-gov-primary font-mono">
              {solutions.length} Fully Certified
            </strong>
            <span className="text-[10px] text-emerald-700 block font-semibold">
              100% Third-Party Audited
            </span>
          </div>

          <div>
            <span className="text-[10px] text-gov-muted font-mono uppercase block font-semibold">
              AVERAGE COST SAVINGS
            </span>
            <strong className="text-base font-extrabold text-emerald-800 font-mono">
              84.1% vs Legacy
            </strong>
            <span className="text-[10px] text-slate-500 block">Unit Economic Reduction</span>
          </div>

          <div>
            <span className="text-[10px] text-gov-muted font-mono uppercase block font-semibold">
              AVERAGE PILOT DURATION
            </span>
            <strong className="text-base font-extrabold text-slate-900 font-mono">
              92 Days Field-Tested
            </strong>
            <span className="text-[10px] text-slate-500 block">Zero Telemetry Loss</span>
          </div>

          <div>
            <span className="text-[10px] text-gov-muted font-mono uppercase block font-semibold">
              REPLICATIONS UNDERWAY
            </span>
            <strong className="text-base font-extrabold text-amber-800 font-mono">
              16 Municipal Rollouts
            </strong>
            <span className="text-[10px] text-slate-500 block">Across 6 Smart Cities</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. ADVANCED SEARCH, FILTERING, & HYBRID VIEW CONTROLS    */}
      {/* Features: Search | Filter: Category | Tech | Dept | Loc  */}
      {/* ======================================================== */}
      <div className="bg-white border border-gov-border rounded-card p-4 shadow-2xs space-y-3">
        {/* Search Bar & View Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-gov-muted absolute left-3 top-2.5" />
            <Input
              placeholder="Search solutions by problem, startup, keyword, technology, or ward..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs h-9"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-gov-muted text-[11px] font-mono hidden md:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-slate-300 rounded-control px-2 py-1 text-xs bg-white text-slate-700 font-medium focus:ring-1 focus:ring-gov-primary"
              >
                <option value="kpi">Highest KPI Attainment</option>
                <option value="savings">Maximum Cost Savings %</option>
                <option value="duration">Longest Testing Duration</option>
                <option value="cost">Lowest Scale Unit Cost</option>
              </select>
            </div>

            {/* Visual Card / Ledger View Toggle */}
            <div className="flex items-center border border-slate-300 rounded-control p-0.5 bg-slate-50">
              <button
                onClick={() => setViewMode("hybrid")}
                title="Card / Visual Hybrid View"
                className={cn(
                  "p-1.5 rounded-2xs text-xs font-semibold flex items-center transition-all",
                  viewMode === "hybrid"
                    ? "bg-white text-gov-primary shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="ml-1 text-[11px] hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => setViewMode("ledger")}
                title="Compact Procurement Ledger View"
                className={cn(
                  "p-1.5 rounded-2xs text-xs font-semibold flex items-center transition-all",
                  viewMode === "ledger"
                    ? "bg-white text-gov-primary shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span className="ml-1 text-[11px] hidden sm:inline">Ledger</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Mandatory Filter Controls: Category | Tech | Dept | Loc */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
          {/* 1. Category Filter */}
          <div>
            <label className="text-[10px] font-mono text-gov-muted uppercase font-bold block mb-1">
              CATEGORY
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-slate-300 rounded-control p-1.5 text-xs bg-white text-slate-800"
            >
              <option value="ALL">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Technology Filter */}
          <div>
            <label className="text-[10px] font-mono text-gov-muted uppercase font-bold block mb-1">
              TECHNOLOGY
            </label>
            <select
              value={selectedTechnology}
              onChange={(e) => setSelectedTechnology(e.target.value)}
              className="w-full border border-slate-300 rounded-control p-1.5 text-xs bg-white text-slate-800"
            >
              <option value="ALL">All Technologies</option>
              {technologies.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Department Filter */}
          <div>
            <label className="text-[10px] font-mono text-gov-muted uppercase font-bold block mb-1">
              APPLICABLE DEPARTMENT
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full border border-slate-300 rounded-control p-1.5 text-xs bg-white text-slate-800"
            >
              <option value="ALL">All Departments ({departments.length})</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Location Filter */}
          <div>
            <label className="text-[10px] font-mono text-gov-muted uppercase font-bold block mb-1">
              TESTED LOCATION
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full border border-slate-300 rounded-control p-1.5 text-xs bg-white text-slate-800"
            >
              <option value="ALL">All Locations ({locations.length})</option>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Indicators Bar */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 text-[11px] border-t border-slate-100">
            <span className="text-gov-muted font-mono font-semibold">Active Filters:</span>
            {selectedCategory !== "ALL" && (
              <Badge variant="outline" className="text-[10px] bg-blue-50 border-blue-200 text-blue-900">
                Category: {selectedCategory}
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSelectedCategory("ALL")} />
              </Badge>
            )}
            {selectedTechnology !== "ALL" && (
              <Badge variant="outline" className="text-[10px] bg-blue-50 border-blue-200 text-blue-900">
                Tech: {selectedTechnology}
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSelectedTechnology("ALL")} />
              </Badge>
            )}
            {selectedDepartment !== "ALL" && (
              <Badge variant="outline" className="text-[10px] bg-blue-50 border-blue-200 text-blue-900">
                Dept: {selectedDepartment}
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSelectedDepartment("ALL")} />
              </Badge>
            )}
            {selectedLocation !== "ALL" && (
              <Badge variant="outline" className="text-[10px] bg-blue-50 border-blue-200 text-blue-900">
                Location: {selectedLocation}
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSelectedLocation("ALL")} />
              </Badge>
            )}
            {search && (
              <Badge variant="outline" className="text-[10px] bg-blue-50 border-blue-200 text-blue-900">
                Query: &quot;{search}&quot;
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSearch("")} />
              </Badge>
            )}
            <button
              onClick={resetAllFilters}
              className="text-[10.5px] font-mono text-rose-700 hover:underline ml-auto font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-gov-muted font-mono">
        <span>
          Showing <strong>{filteredSolutions.length}</strong> of {solutions.length} proven statutory solutions
        </span>
        <span className="text-emerald-700 font-bold">
          All Pilots GFR 149(v) Direct Scale Ready
        </span>
      </div>

      {/* ======================================================== */}
      {/* 3. VIEW MODE A: VISUAL CARD / LIST HYBRID GRID           */}
      {/* ======================================================== */}
      {viewMode === "hybrid" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSolutions.map((sol) => (
            <div
              key={sol.id}
              className="bg-white border border-gov-border rounded-card p-5 shadow-2xs space-y-4 hover:shadow-md transition-shadow text-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Card Top Ribbon */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="font-mono text-[9px] bg-slate-50 border-slate-300">
                      {sol.code}
                    </Badge>
                    <Badge variant="default" className="text-[9.5px] bg-gov-secondary text-white font-medium">
                      {sol.category}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 font-mono text-[10.5px] text-gov-muted">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{sol.pilotLocation.city}, {sol.pilotLocation.state}</span>
                    <span className="text-slate-300">•</span>
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{sol.pilotDuration.durationDays} Days</span>
                  </div>
                </div>

                {/* Solution Title & Tagline */}
                <div>
                  <h3 className="font-bold text-base text-gov-primary leading-tight hover:text-gov-secondary transition-colors cursor-pointer"
                      onClick={() => setDossierSolution(sol)}>
                    {sol.title}
                  </h3>
                  <p className="text-[11.5px] text-slate-600 mt-1 line-clamp-2">
                    {sol.tagline}
                  </p>
                </div>

                {/* Startup & DPIIT Info */}
                <div className="flex items-center justify-between text-[11px] bg-slate-50 p-2 rounded-control border border-slate-200">
                  <div>
                    <span className="text-gov-muted">Startup: </span>
                    <strong className="text-slate-900">{sol.startup.name}</strong>
                  </div>
                  <div className="font-mono text-[10px] text-slate-500">
                    DPIIT: <strong className="text-gov-primary">{sol.startup.dpiitNumber}</strong>
                  </div>
                </div>

                {/* 1. Problem Statement Box */}
                <div className="p-2.5 rounded-control bg-slate-50/80 border border-slate-200/90 text-[11.5px] space-y-0.5">
                  <span className="text-[9.5px] font-mono text-gov-muted uppercase font-bold block">
                    CIVIC PROBLEM SOLVED:
                  </span>
                  <p className="text-slate-800 leading-snug line-clamp-2">
                    {sol.problem.statement}
                  </p>
                </div>

                {/* 6. Validated KPIs Strip (Baseline -> Target -> Actual) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-gov-muted">
                    <span>KEY VALIDATED KPI METRICS</span>
                    <span className="text-emerald-700">BASELINE → ACTUAL (TARGET)</span>
                  </div>
                  <div className="space-y-1 border border-slate-200 rounded-control p-2 bg-slate-50/50">
                    {sol.validatedKpis.slice(0, 2).map((kpi, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-slate-800 truncate max-w-[200px]">
                          {kpi.name}
                        </span>
                        <div className="flex items-center space-x-2 font-mono text-[11px]">
                          <span className="text-slate-400 line-through text-[10px]">{kpi.baseline}</span>
                          <span className="text-slate-400">→</span>
                          <strong className="text-emerald-800 font-bold">{kpi.actualAchieved}</strong>
                          <span className="text-slate-500 text-[9.5px]">({kpi.target})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 7. Cost Economics Callout Strip */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-emerald-50/60 border border-emerald-200 rounded-control">
                    <span className="text-[9.5px] font-mono text-emerald-900 block font-semibold">
                      SCALE UNIT COST:
                    </span>
                    <strong className="font-mono text-emerald-950 font-bold text-xs">
                      ₹{sol.cost.perUnitScaleInr.toLocaleString()}
                    </strong>
                    <span className="text-[9.5px] text-emerald-800 block">
                      {sol.cost.unitLabel}
                    </span>
                  </div>

                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-control">
                    <span className="text-[9.5px] font-mono text-gov-muted block font-semibold">
                      SAVINGS VS LEGACY:
                    </span>
                    <strong className="font-mono text-gov-primary font-bold text-xs">
                      {sol.cost.savingsVsLegacyPercentage}% Lower
                    </strong>
                    <span className="text-[9.5px] text-slate-500 block truncate">
                      Payback {sol.cost.statutoryPaybackMonths} mos
                    </span>
                  </div>
                </div>

                {/* 8. Validation Status Strip */}
                <div className="flex items-center justify-between text-[10.5px] bg-slate-50 px-2.5 py-1.5 rounded-control border border-slate-200">
                  <div className="flex items-center space-x-1.5 truncate">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-800 truncate">
                      Auditor: <strong>{sol.validationStatus.accreditedAgency.split("&")[0]}</strong>
                    </span>
                  </div>
                  <Badge variant="success" className="text-[9px] font-mono shrink-0">
                    {sol.validationStatus.rating}
                  </Badge>
                </div>

                {/* 9. Applicable Departments Tag Cloud */}
                <div className="space-y-1">
                  <span className="text-[9.5px] font-mono text-gov-muted uppercase font-bold block">
                    APPLICABLE DEPARTMENTS:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {sol.applicableDepartments.map((dept, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded-xs bg-slate-100 border border-slate-200 text-slate-700 text-[10px]"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDossierSolution(sol)}
                  className="text-xs h-7 border-slate-300"
                >
                  <FileText className="w-3.5 h-3.5 mr-1" /> Full Dossier
                </Button>

                <Button
                  size="sm"
                  onClick={() => handleOpenReplication(sol)}
                  className="text-xs h-7 bg-gov-primary hover:bg-gov-primary/90 text-white font-semibold shadow-2xs"
                >
                  <TrendingUp className="w-3.5 h-3.5 mr-1" /> Replicate in My Dept
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ======================================================== */
        /* VIEW MODE B: COMPACT PROCUREMENT LEDGER VIEW            */
        /* ======================================================== */
        <div className="bg-white border border-gov-border rounded-card shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
                  <th className="p-3">Code & Category</th>
                  <th className="p-3">Solution & Problem</th>
                  <th className="p-3">Startup & Location</th>
                  <th className="p-3">Primary Audited KPI</th>
                  <th className="p-3">Unit Economics</th>
                  <th className="p-3">Auditor & Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredSolutions.map((sol) => (
                  <tr key={sol.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 align-top font-mono">
                      <span className="font-bold text-gov-primary block">{sol.code}</span>
                      <span className="text-[10px] text-gov-muted block">{sol.category}</span>
                    </td>

                    <td className="p-3 align-top max-w-xs">
                      <h4
                        className="font-bold text-slate-900 hover:text-gov-primary cursor-pointer line-clamp-1"
                        onClick={() => setDossierSolution(sol)}
                      >
                        {sol.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {sol.problem.statement}
                      </p>
                    </td>

                    <td className="p-3 align-top">
                      <strong className="text-slate-900 block">{sol.startup.name}</strong>
                      <span className="text-[10px] text-gov-muted font-mono block">
                        {sol.pilotLocation.city}, {sol.pilotDuration.durationDays}d
                      </span>
                    </td>

                    <td className="p-3 align-top font-mono text-[11px]">
                      <span className="text-slate-700 block font-sans text-[10.5px]">
                        {sol.validatedKpis[0]?.name}:
                      </span>
                      <strong className="text-emerald-800">
                        {sol.validatedKpis[0]?.actualAchieved}
                      </strong>{" "}
                      <span className="text-slate-400 line-through text-[9.5px]">
                        {sol.validatedKpis[0]?.baseline}
                      </span>
                    </td>

                    <td className="p-3 align-top font-mono text-[11px]">
                      <strong className="text-slate-900 block">
                        ₹{sol.cost.perUnitScaleInr.toLocaleString()}
                      </strong>
                      <span className="text-[10px] text-emerald-700 block font-semibold font-sans">
                        {sol.cost.savingsVsLegacyPercentage}% savings
                      </span>
                    </td>

                    <td className="p-3 align-top">
                      <Badge variant="success" className="text-[9px] font-mono block w-fit">
                        {sol.validationStatus.rating}
                      </Badge>
                      <span className="text-[10px] text-gov-muted block truncate max-w-[130px] mt-0.5">
                        {sol.validationStatus.accreditedAgency.split("&")[0]}
                      </span>
                    </td>

                    <td className="p-3 align-top text-right shrink-0">
                      <div className="flex items-center justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDossierSolution(sol)}
                          className="h-7 text-xs px-2"
                        >
                          Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleOpenReplication(sol)}
                          className="h-7 text-xs bg-gov-primary text-white font-semibold px-2"
                        >
                          Replicate
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. DRAWER / MODAL: COMPREHENSIVE SOLUTION DOSSIER        */}
      {/* Contains All 9 Prompt Mandated Sections in Deep Detail   */}
      {/* ======================================================== */}
      {dossierSolution && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end">
          <div className="bg-white h-full max-w-2xl w-full shadow-2xl border-l border-gov-border overflow-y-auto p-6 space-y-5 text-left text-xs animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="font-mono text-[9px]">
                    {dossierSolution.code}
                  </Badge>
                  <span className="text-[10px] font-mono text-gov-muted">
                    {dossierSolution.category}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gov-primary mt-1">
                  {dossierSolution.title}
                </h2>
              </div>
              <button
                onClick={() => setDossierSolution(null)}
                className="p-1 rounded-control hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: Problem */}
            <div className="space-y-1.5 p-3 rounded-control bg-slate-50 border border-slate-200">
              <span className="font-mono text-[10px] text-gov-muted uppercase font-bold block">
                1. CIVIC PROBLEM & STATUS QUO FAILURE
              </span>
              <p className="text-slate-800 leading-relaxed font-medium">
                {dossierSolution.problem.statement}
              </p>
              <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                <strong>Civic Context:</strong> {dossierSolution.problem.civicContext}
              </div>
            </div>

            {/* Section 2: Technology */}
            <div className="space-y-2 p-3 rounded-control bg-slate-50 border border-slate-200">
              <span className="font-mono text-[10px] text-gov-muted uppercase font-bold block">
                2. TECHNOLOGY & HARDWARE/SOFTWARE STACK
              </span>
              <p className="text-slate-900 font-semibold">{dossierSolution.technology.architecture}</p>
              <div>
                <span className="text-[10.5px] text-gov-muted block">Hardware Components:</span>
                <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5 mt-0.5">
                  {dossierSolution.technology.hardwareSpecs.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
              <div className="pt-1">
                <span className="text-[10.5px] text-gov-muted block">Connectivity & Protocols:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {dossierSolution.technology.connectivity.map((c, i) => (
                    <Badge key={i} variant="outline" className="text-[9px] bg-white font-mono">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-[10.5px] text-slate-600 font-mono pt-1 border-t border-slate-200">
                IP Status: {dossierSolution.technology.ipStatus}
              </div>
            </div>

            {/* Section 3: Startup Credentials */}
            <div className="space-y-1.5 p-3 rounded-control bg-slate-50 border border-slate-200">
              <span className="font-mono text-[10px] text-gov-muted uppercase font-bold block">
                3. STARTUP DETAILS & INDIGENOUS CONTENT
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Startup Name:</span>
                  <strong className="text-slate-900">{dossierSolution.startup.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">DPIIT Recognition:</span>
                  <strong className="font-mono text-gov-primary">{dossierSolution.startup.dpiitNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Local Content (Make in India):</span>
                  <strong className="font-mono text-emerald-800">
                    {dossierSolution.startup.makeInIndiaLocalContent}% (Class-1)
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Headquarters:</span>
                  <strong className="text-slate-900">{dossierSolution.startup.headquarters}</strong>
                </div>
              </div>
            </div>

            {/* Section 4 & 5: Pilot Location & Duration */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-control bg-slate-50 border border-slate-200">
              <div>
                <span className="font-mono text-[10px] text-gov-muted uppercase font-bold block">
                  4. PILOT LOCATION
                </span>
                <strong className="text-slate-900 text-xs block mt-0.5">
                  {dossierSolution.pilotLocation.city}, {dossierSolution.pilotLocation.state}
                </strong>
                <span className="text-[10.5px] text-slate-600 block mt-0.5">
                  {dossierSolution.pilotLocation.siteDescription}
                </span>
                <span className="font-mono text-[10px] text-gov-muted block mt-1">
                  Tested: {dossierSolution.pilotLocation.wardsTested} Wards ({dossierSolution.pilotLocation.nodesDeployed} Nodes)
                </span>
              </div>

              <div>
                <span className="font-mono text-[10px] text-gov-muted uppercase font-bold block">
                  5. PILOT DURATION
                </span>
                <strong className="text-slate-900 text-xs block mt-0.5">
                  {dossierSolution.pilotDuration.durationDays} Days Active Testing
                </strong>
                <span className="text-[10.5px] text-slate-600 block mt-0.5">
                  {dossierSolution.pilotDuration.startDate} → {dossierSolution.pilotDuration.endDate}
                </span>
                <span className="font-mono text-[10px] text-emerald-700 block mt-1 font-semibold">
                  Status: {dossierSolution.pilotDuration.completionStatus.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {/* Section 6: Validated KPIs Table */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] text-gov-muted uppercase font-bold block">
                6. VALIDATED PERFORMANCE METRICS (BASELINE → ACTUAL ACHIEVED)
              </span>
              <div className="border border-slate-200 rounded-control overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-mono text-[10px]">
                    <tr>
                      <th className="p-2">Metric</th>
                      <th className="p-2 text-right">Baseline</th>
                      <th className="p-2 text-right">Target</th>
                      <th className="p-2 text-right">Achieved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {dossierSolution.validatedKpis.map((k, i) => (
                      <tr key={i}>
                        <td className="p-2 font-sans font-medium text-slate-900">{k.name}</td>
                        <td className="p-2 text-right text-slate-400 line-through">{k.baseline}</td>
                        <td className="p-2 text-right text-slate-600">{k.target}</td>
                        <td className="p-2 text-right font-bold text-emerald-800">{k.actualAchieved}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 7: Cost Economics */}
            <div className="space-y-1.5 p-3 rounded-control bg-slate-50 border border-slate-200">
              <span className="font-mono text-[10px] text-gov-muted uppercase font-bold block">
                7. COST & UNIT ECONOMICS
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Pilot Total Spend:</span>
                  <strong className="font-mono text-slate-900">
                    ₹{(dossierSolution.cost.pilotTotalBudgetInr / 100000).toFixed(2)} Lakh
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Scale Unit Cost:</span>
                  <strong className="font-mono text-emerald-800">
                    ₹{dossierSolution.cost.perUnitScaleInr.toLocaleString()} {dossierSolution.cost.unitLabel}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Legacy Alternative:</span>
                  <strong className="text-slate-700">{dossierSolution.cost.legacyAlternativeName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Capital Savings:</span>
                  <strong className="font-mono text-emerald-700 font-bold">
                    {dossierSolution.cost.savingsVsLegacyPercentage}% Lower
                  </strong>
                </div>
              </div>
            </div>

            {/* Section 8: Validation Status */}
            <div className="space-y-1.5 p-3 rounded-control bg-emerald-50/50 border border-emerald-200">
              <span className="font-mono text-[10px] text-emerald-950 uppercase font-bold block">
                8. INDEPENDENT THIRD-PARTY VALIDATION
              </span>
              <div className="text-[11px] text-slate-800">
                <strong>Accredited Auditor:</strong> {dossierSolution.validationStatus.accreditedAgency}
              </div>
              <p className="text-[11.5px] text-slate-700 italic">
                &ldquo;{dossierSolution.validationStatus.keyAuditVerdict}&rdquo;
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-emerald-200/60 font-mono text-[9.5px] text-slate-500">
                <span>Lead: {dossierSolution.validationStatus.leadAuditor}</span>
                <span className="truncate max-w-[200px]">SHA256: {dossierSolution.validationStatus.certificateSha256.slice(0, 16)}...</span>
              </div>
            </div>

            {/* Section 9: Applicable Departments */}
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-gov-muted uppercase font-bold block">
                9. APPLICABLE DEPARTMENTS & GFR 149(v) ELIGIBILITY
              </span>
              <div className="flex flex-wrap gap-1">
                {dossierSolution.applicableDepartments.map((d, i) => (
                  <Badge key={i} variant="outline" className="text-[10px] bg-slate-50">
                    {d}
                  </Badge>
                ))}
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Catalogue: <strong className="font-mono text-slate-800">{dossierSolution.procurementEligibility.gemCatalogueCategory}</strong>
              </p>
            </div>

            {/* Drawer Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDossierSolution(null)}
                className="text-xs h-8 border-slate-300"
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const sol = dossierSolution;
                  setDossierSolution(null);
                  handleOpenReplication(sol);
                }}
                className="text-xs h-8 bg-gov-primary hover:bg-gov-primary/90 text-white font-semibold"
              >
                <TrendingUp className="w-3.5 h-3.5 mr-1" /> Replicate in My Department
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. MODAL: DEPARTMENTAL REPLICATION INTENT REGISTRATION   */}
      {/* ======================================================== */}
      {replicationModal.isOpen && replicationModal.solution && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-card shadow-2xl border border-gov-border max-w-lg w-full p-5 space-y-4 text-left text-xs my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold block">
                  FAST-TRACK ADOPTION WORKFLOW
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  Replicate Solution in My Department
                </h3>
              </div>
              <button
                onClick={() => setReplicationModal({ isOpen: false, solution: null })}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-600 text-xs">
              Express departmental intent to adopt{" "}
              <strong className="text-slate-900">{replicationModal.solution.title}</strong>. This initiates
              direct procurement coordination under GFR Rule 149(v) with the startup and testing authority.
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-800 uppercase block mb-1 font-mono">
                  Your Department / Urban Body:
                </label>
                <Input
                  value={targetDepartment}
                  onChange={(e) => setTargetDepartment(e.target.value)}
                  placeholder="e.g. Kanpur Nagar Nigam, Directorate of Urban Development"
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-800 uppercase block mb-1 font-mono">
                    Target City / District:
                  </label>
                  <Input
                    value={targetCity}
                    onChange={(e) => setTargetCity(e.target.value)}
                    placeholder="e.g. Kanpur, Varanasi"
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-800 uppercase block mb-1 font-mono">
                    Planned Wards / Units:
                  </label>
                  <Input
                    type="number"
                    value={plannedWards}
                    onChange={(e) => setPlannedWards(Number(e.target.value))}
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-800 uppercase block mb-1 font-mono">
                  Replication Scope & Civic Note:
                </label>
                <Textarea
                  rows={3}
                  value={replicationScopeNote}
                  onChange={(e) => setReplicationScopeNote(e.target.value)}
                  className="text-xs leading-relaxed"
                />
              </div>

              <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-control text-[11px] text-blue-900 space-y-0.5">
                <span className="font-bold flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-gov-primary" />
                  Statutory Fast-Track Adoption Benefit:
                </span>
                <p className="text-[10.5px] leading-tight">
                  By referencing certified Pilot #{replicationModal.solution.code}, your department skips
                  exploratory pilot delays and qualifies for direct GeM Startup Runway procurement under GFR Rule 149(v).
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReplicationModal({ isOpen: false, solution: null })}
                className="text-xs h-8 border-slate-300"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={submittingReplication}
                onClick={handleSubmitReplication}
                className="text-xs h-8 bg-gov-primary hover:bg-gov-primary/90 text-white font-semibold shadow-xs"
              >
                {submittingReplication ? "Submitting Request..." : "Submit Departmental Request"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
