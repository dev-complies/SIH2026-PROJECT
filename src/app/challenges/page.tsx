"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { CHALLENGES_DATA, ChallengeItem } from "@/data/challengesData";
import { PilotMap } from "@/components/3d/PilotMap";
import {
  Search,
  Filter,
  ArrowRight,
  Clock,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  FileText,
  MapPin,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  SlidersHorizontal,
  X,
  Layers,
  Map as MapIcon,
  ListFilter,
  Check,
  TrendingUp,
  Tag,
  DollarSign,
  Compass,
  ChevronDown,
} from "lucide-react";

export default function StartupChallengeDiscoveryPage() {
  const { showToast } = useToast();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedState, setSelectedState] = useState("ALL");
  const [selectedDistrict, setSelectedDistrict] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState("ALL");
  const [selectedDuration, setSelectedDuration] = useState("ALL");
  const [selectedDeadline, setSelectedDeadline] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState<"deadline" | "budget_high" | "budget_low" | "duration">("deadline");
  
  // View mode: 2D cards vs 3D Map
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [savedFilterOnly, setSavedFilterOnly] = useState(false);

  // Saved Challenges persistence in localStorage
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("govinnovate_saved_challenges");
      if (stored) {
        setSavedIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load saved challenges", e);
    }
  }, []);

  const toggleSaveChallenge = (id: string, title: string) => {
    setSavedIds((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("govinnovate_saved_challenges", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save challenge", e);
      }
      showToast({
        type: exists ? "info" : "success",
        title: exists ? "Removed from Saved" : "Challenge Saved",
        description: exists
          ? `Removed "${title.substring(0, 32)}..." from saved bookmarks.`
          : `Saved "${title.substring(0, 32)}..." to your bookmarks.`,
      });
      return updated;
    });
  };

  // Distinct filter options derived from data
  const departments = useMemo(() => Array.from(new Set(CHALLENGES_DATA.map((c) => c.department))), []);
  const states = useMemo(() => Array.from(new Set(CHALLENGES_DATA.map((c) => c.state))), []);
  const districts = useMemo(() => Array.from(new Set(CHALLENGES_DATA.map((c) => c.district))), []);
  const categories = useMemo(() => Array.from(new Set(CHALLENGES_DATA.map((c) => c.category))), []);
  const technologies = useMemo(() => {
    const set = new Set<string>();
    CHALLENGES_DATA.forEach((c) => c.technology.forEach((t) => set.add(t)));
    return Array.from(set);
  }, []);

  const toggleTech = (tech: string) => {
    setSelectedTech((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedDept("ALL");
    setSelectedState("ALL");
    setSelectedDistrict("ALL");
    setSelectedCategory("ALL");
    setSelectedTech([]);
    setSelectedBudget("ALL");
    setSelectedDuration("ALL");
    setSelectedDeadline("ALL");
    setSelectedStatus("ALL");
    setSavedFilterOnly(false);
  };

  const activeFilterCount =
    (selectedDept !== "ALL" ? 1 : 0) +
    (selectedState !== "ALL" ? 1 : 0) +
    (selectedDistrict !== "ALL" ? 1 : 0) +
    (selectedCategory !== "ALL" ? 1 : 0) +
    selectedTech.length +
    (selectedBudget !== "ALL" ? 1 : 0) +
    (selectedDuration !== "ALL" ? 1 : 0) +
    (selectedDeadline !== "ALL" ? 1 : 0) +
    (selectedStatus !== "ALL" ? 1 : 0) +
    (savedFilterOnly ? 1 : 0);

  // Filter and sort challenges
  const filteredChallenges = useMemo(() => {
    return CHALLENGES_DATA.filter((c) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(query);
        const matchesCode = c.code.toLowerCase().includes(query);
        const matchesDept = c.department.toLowerCase().includes(query);
        const matchesLoc = c.location.toLowerCase().includes(query);
        const matchesCat = c.category.toLowerCase().includes(query);
        const matchesTech = c.technology.some((t) => t.toLowerCase().includes(query));
        const matchesDesc = c.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCode && !matchesDept && !matchesLoc && !matchesCat && !matchesTech && !matchesDesc) {
          return false;
        }
      }

      // Department filter
      if (selectedDept !== "ALL" && c.department !== selectedDept) return false;

      // State filter
      if (selectedState !== "ALL" && c.state !== selectedState) return false;

      // District filter
      if (selectedDistrict !== "ALL" && c.district !== selectedDistrict) return false;

      // Category filter
      if (selectedCategory !== "ALL" && c.category !== selectedCategory) return false;

      // Technology filter (AND or OR matching: matches if contains any selected)
      if (selectedTech.length > 0) {
        const hasTech = selectedTech.some((t) => c.technology.includes(t));
        if (!hasTech) return false;
      }

      // Budget filter
      if (selectedBudget === "under25") {
        if (c.budgetNumeric > 2500000) return false;
      } else if (selectedBudget === "25to35") {
        if (c.budgetNumeric < 2500000 || c.budgetNumeric > 3500000) return false;
      } else if (selectedBudget === "over35") {
        if (c.budgetNumeric < 3500000) return false;
      }

      // Duration filter
      if (selectedDuration === "60") {
        if (c.durationDays !== 60) return false;
      } else if (selectedDuration === "90") {
        if (c.durationDays !== 90) return false;
      } else if (selectedDuration === "120") {
        if (c.durationDays !== 120) return false;
      } else if (selectedDuration === "180") {
        if (c.durationDays !== 180) return false;
      }

      // Deadline filter
      if (selectedDeadline === "urgent") {
        if (c.daysRemaining > 15 || c.daysRemaining < 0) return false;
      } else if (selectedDeadline === "active") {
        if (c.daysRemaining <= 0) return false;
      }

      // Status filter
      if (selectedStatus !== "ALL" && c.status !== selectedStatus) return false;

      // Saved only
      if (savedFilterOnly && !savedIds.includes(c.id)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "deadline") {
        return a.daysRemaining - b.daysRemaining;
      } else if (sortBy === "budget_high") {
        return b.budgetNumeric - a.budgetNumeric;
      } else if (sortBy === "budget_low") {
        return a.budgetNumeric - b.budgetNumeric;
      } else if (sortBy === "duration") {
        return a.durationDays - b.durationDays;
      }
      return 0;
    });
  }, [
    searchQuery,
    selectedDept,
    selectedState,
    selectedDistrict,
    selectedCategory,
    selectedTech,
    selectedBudget,
    selectedDuration,
    selectedDeadline,
    selectedStatus,
    savedFilterOnly,
    savedIds,
    sortBy,
  ]);

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Page Title & Breadcrumb Header */}
      <div className="border-b border-gov-border pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <Badge variant="default" className="bg-gov-primary font-mono text-[9px]">
                PUBLIC PROCUREMENT CATALOG
              </Badge>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-gov-muted font-medium">
                GFR Rule 149 Innovation Window
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-primary tracking-tight">
              Startup Challenge Discovery
            </h1>
            <p className="text-xs sm:text-sm text-gov-muted mt-1 max-w-3xl leading-relaxed">
              Discover official government problem statements, submit funded pilot proposals, and scale tested deep-tech solutions into public procurement contracts.
            </p>
          </div>

          {/* View Mode & Saved Challenges Switchers */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setSavedFilterOnly(!savedFilterOnly)}
              className={`px-3 py-1.5 rounded-control text-xs font-semibold flex items-center border transition-all ${
                savedFilterOnly
                  ? "bg-purple-50 text-purple-900 border-purple-300 shadow-2xs"
                  : "bg-white text-slate-700 border-gov-border hover:bg-slate-50"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 mr-1.5 ${savedFilterOnly ? "fill-purple-600 text-purple-600" : "text-slate-400"}`} />
              Saved Challenges
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-800 font-mono">
                {savedIds.length}
              </span>
            </button>

            <div className="flex rounded-control border border-gov-border bg-white p-0.5">
              <button
                onClick={() => setViewMode("2d")}
                className={`px-2.5 py-1 rounded text-xs font-medium flex items-center transition-all ${
                  viewMode === "2d"
                    ? "bg-gov-primary text-white shadow-2xs"
                    : "text-gov-muted hover:text-slate-900"
                }`}
                title="2D Structured Cards"
              >
                <Layers className="w-3.5 h-3.5 mr-1" />
                Cards
              </button>
              <button
                onClick={() => setViewMode("3d")}
                className={`px-2.5 py-1 rounded text-xs font-medium flex items-center transition-all ${
                  viewMode === "3d"
                    ? "bg-gov-primary text-white shadow-2xs"
                    : "text-gov-muted hover:text-slate-900"
                }`}
                title="Interactive Geospatial 3D Map"
              >
                <MapIcon className="w-3.5 h-3.5 mr-1" />
                3D Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Search & Quick Controls Bar */}
      <div className="bg-white border border-gov-border rounded-card p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-gov-muted absolute left-3 top-3" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by challenge title, department, district, or technology..."
              className="pl-9 text-xs h-10 border-gov-border text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Sorting Dropdown */}
          <div className="flex items-center space-x-2 w-full md:w-auto shrink-0 justify-between md:justify-end">
            <span className="text-xs text-gov-muted font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="text-xs border border-gov-border rounded-control px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-gov-accent"
            >
              <option value="deadline">Deadline: Closing Soonest</option>
              <option value="budget_high">Budget: High to Low</option>
              <option value="budget_low">Budget: Low to High</option>
              <option value="duration">Pilot Duration: Shortest</option>
            </select>

            {/* Mobile Filter Toggle */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden text-xs h-9"
            >
              <Filter className="w-3.5 h-3.5 mr-1" />
              Filters ({activeFilterCount})
            </Button>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
            <span className="text-[11px] text-gov-muted font-medium mr-1">Active Filters:</span>
            {selectedDept !== "ALL" && (
              <Badge variant="outline" className="text-[10px] bg-slate-50 flex items-center gap-1">
                Dept: {selectedDept}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDept("ALL")} />
              </Badge>
            )}
            {selectedState !== "ALL" && (
              <Badge variant="outline" className="text-[10px] bg-slate-50 flex items-center gap-1">
                State: {selectedState}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedState("ALL")} />
              </Badge>
            )}
            {selectedDistrict !== "ALL" && (
              <Badge variant="outline" className="text-[10px] bg-slate-50 flex items-center gap-1">
                District: {selectedDistrict}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDistrict("ALL")} />
              </Badge>
            )}
            {selectedCategory !== "ALL" && (
              <Badge variant="outline" className="text-[10px] bg-slate-50 flex items-center gap-1">
                Category: {selectedCategory}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory("ALL")} />
              </Badge>
            )}
            {selectedTech.map((t) => (
              <Badge key={t} variant="outline" className="text-[10px] bg-blue-50 text-blue-800 border-blue-200 flex items-center gap-1">
                Tech: {t}
                <X className="w-3 h-3 cursor-pointer" onClick={() => toggleTech(t)} />
              </Badge>
            ))}
            {selectedBudget !== "ALL" && (
              <Badge variant="outline" className="text-[10px] bg-slate-50 flex items-center gap-1">
                Budget: {selectedBudget}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedBudget("ALL")} />
              </Badge>
            )}
            {selectedDuration !== "ALL" && (
              <Badge variant="outline" className="text-[10px] bg-slate-50 flex items-center gap-1">
                Duration: {selectedDuration} Days
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDuration("ALL")} />
              </Badge>
            )}
            {selectedDeadline !== "ALL" && (
              <Badge variant="outline" className="text-[10px] bg-slate-50 flex items-center gap-1">
                Deadline: {selectedDeadline}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDeadline("ALL")} />
              </Badge>
            )}
            {selectedStatus !== "ALL" && (
              <Badge variant="outline" className="text-[10px] bg-slate-50 flex items-center gap-1">
                Status: {selectedStatus}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedStatus("ALL")} />
              </Badge>
            )}
            {savedFilterOnly && (
              <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-800 border-purple-200 flex items-center gap-1">
                Saved Only
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSavedFilterOnly(false)} />
              </Badge>
            )}
            <button
              onClick={handleClearFilters}
              className="text-[11px] text-gov-accent hover:underline font-semibold ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Two-Column Layout: Filter Sidebar + Challenge Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Filter Sidebar */}
        <aside
          className={`lg:col-span-1 bg-white border border-gov-border rounded-card p-4 shadow-2xs space-y-5 text-xs ${
            showFiltersMobile ? "block" : "hidden lg:block"
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="font-extrabold text-gov-primary tracking-tight flex items-center uppercase text-[11px] font-mono">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-gov-accent" />
              Procurement Filters
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="text-[10px] text-gov-muted hover:text-gov-danger font-medium"
              >
                Reset
              </button>
            )}
          </div>

          {/* 1. Department */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block text-[11px]">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full text-xs border border-gov-border rounded-control p-2 bg-white text-slate-800"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* 2. State & District */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="font-bold text-slate-800 block text-[11px]">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full text-xs border border-gov-border rounded-control p-2 bg-white text-slate-800"
              >
                <option value="ALL">All States</option>
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800 block text-[11px]">District</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full text-xs border border-gov-border rounded-control p-2 bg-white text-slate-800"
              >
                <option value="ALL">All Districts</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Category */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block text-[11px]">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs border border-gov-border rounded-control p-2 bg-white text-slate-800"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Technology Pills (Multi-Select) */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block text-[11px]">Technology Stack</label>
            <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto pt-0.5">
              {technologies.map((t) => {
                const isSelected = selectedTech.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTech(t)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Budget Range */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block text-[11px]">Pilot Budget</label>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="w-full text-xs border border-gov-border rounded-control p-2 bg-white text-slate-800"
            >
              <option value="ALL">All Budgets</option>
              <option value="under25">Under ₹25 Lakhs</option>
              <option value="25to35">₹25 - ₹35 Lakhs</option>
              <option value="over35">Above ₹35 Lakhs</option>
            </select>
          </div>

          {/* 6. Pilot Duration */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block text-[11px]">Pilot Duration</label>
            <div className="grid grid-cols-2 gap-1.5">
              {["ALL", "60", "90", "120", "180"].map((dur) => (
                <button
                  key={dur}
                  onClick={() => setSelectedDuration(dur)}
                  className={`py-1 px-2 rounded text-[11px] font-mono border text-center transition-all ${
                    selectedDuration === dur
                      ? "bg-gov-primary text-white border-gov-primary font-bold shadow-2xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {dur === "ALL" ? "All" : `${dur} Days`}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Deadline */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block text-[11px]">Submission Deadline</label>
            <select
              value={selectedDeadline}
              onChange={(e) => setSelectedDeadline(e.target.value)}
              className="w-full text-xs border border-gov-border rounded-control p-2 bg-white text-slate-800"
            >
              <option value="ALL">All Deadlines</option>
              <option value="urgent">Closing Soon (&lt; 15 Days)</option>
              <option value="active">Active & Open</option>
            </select>
          </div>

          {/* 8. Status */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block text-[11px]">Challenge Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs border border-gov-border rounded-control p-2 bg-white text-slate-800"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Proposals Open</option>
              <option value="PILOT_ACTIVE">Pilot Active</option>
              <option value="UNDER_EVALUATION">Under Evaluation</option>
              <option value="VALIDATED">Validated</option>
            </select>
          </div>
        </aside>

        {/* Right Main Content Area: Cards or 3D Map */}
        <div className="lg:col-span-3 space-y-4">
          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-gov-muted px-1">
            <span>
              Showing <strong>{filteredChallenges.length}</strong> of {CHALLENGES_DATA.length} published challenges
            </span>
            <span className="text-[11px] font-mono text-emerald-800 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" />
              100% GFR 2017 Rule 149 Verified
            </span>
          </div>

          {/* Optional 3D Geospatial Map View */}
          {viewMode === "3d" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-white border border-gov-border rounded-card p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gov-primary flex items-center">
                      <MapIcon className="w-4 h-4 mr-1.5 text-gov-accent" />
                      Geospatial Pilot & Challenge Mesh
                    </h3>
                    <p className="text-[11px] text-gov-muted">
                      Explore physical pilot testbeds and open challenge wards across Indian municipalities. Click any node to review specs.
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    3D Telemetry Active
                  </Badge>
                </div>
                {/* 3D Map Component */}
                <PilotMap height="h-[420px]" />
              </div>
            </div>
          )}

          {/* 2D Challenge Cards List */}
          {filteredChallenges.length === 0 ? (
            <div className="bg-white border border-gov-border rounded-card p-12 text-center space-y-3">
              <Compass className="w-10 h-10 text-gov-muted mx-auto" />
              <h3 className="text-base font-bold text-gov-primary">No Challenges Found</h3>
              <p className="text-xs text-gov-muted max-w-md mx-auto">
                No published challenge statements matched your active filter criteria. Try clearing some filters or searching for broader terms.
              </p>
              <Button size="sm" variant="outline" onClick={handleClearFilters} className="text-xs">
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredChallenges.map((item) => {
                const isSaved = savedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-gov-border rounded-card p-5 sm:p-6 shadow-sm hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 text-left group"
                  >
                    {/* Card Header: Department, Location, Category, Status, Save */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-semibold text-slate-800 flex items-center">
                            <Building2 className="w-3.5 h-3.5 text-gov-muted mr-1" />
                            {item.department}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-gov-muted flex items-center">
                            <MapPin className="w-3.5 h-3.5 text-gov-muted mr-1" />
                            {item.location}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-gov-accent block">
                          {item.code}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <Badge
                          variant={item.statusVariant as any}
                          className="font-mono text-[10px] py-0.5 px-2"
                        >
                          {item.statusLabel}
                        </Badge>
                        <button
                          onClick={() => toggleSaveChallenge(item.id, item.title)}
                          className={`p-1.5 rounded-md border transition-colors ${
                            isSaved
                              ? "bg-purple-50 border-purple-300 text-purple-700"
                              : "border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                          }`}
                          title={isSaved ? "Saved challenge" : "Save challenge"}
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-purple-600 text-purple-600" : ""}`} />
                        </button>
                      </div>
                    </div>

                    {/* Challenge Title & Problem Snippet */}
                    <div className="space-y-2">
                      <Link
                        href={`/challenges/${item.id}`}
                        className="text-base sm:text-lg font-bold text-gov-primary hover:text-gov-accent transition-colors block group-hover:underline"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Technology Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono text-gov-muted mr-1">TECH:</span>
                      {item.technology.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Key Metrics Grid: Budget, Deadline, Duration, Category */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200/80 rounded-control p-3 text-xs">
                      <div>
                        <span className="text-[10px] text-gov-muted font-mono uppercase block">
                          PILOT BUDGET
                        </span>
                        <span className="font-extrabold text-slate-900 font-mono text-sm">
                          {item.budget}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gov-muted font-mono uppercase block">
                          TESTING DURATION
                        </span>
                        <span className="font-semibold text-slate-800">
                          {item.pilotDuration}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gov-muted font-mono uppercase block">
                          DEADLINE
                        </span>
                        <span className="font-bold text-amber-900">
                          {item.deadline}
                        </span>
                        {item.daysRemaining > 0 && (
                          <span className="text-[9.5px] text-amber-700 block font-mono">
                            {item.daysRemaining} days left
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] text-gov-muted font-mono uppercase block">
                          CATEGORY
                        </span>
                        <span className="font-medium text-slate-800 truncate block">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <div className="text-[11px] text-gov-muted flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                        Requires DPIIT Startup Recognition Certificate
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <Link href={`/challenges/${item.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-8.5 border-slate-300 hover:border-gov-primary"
                          >
                            View Details
                          </Button>
                        </Link>

                        <Link href={`/challenges/${item.id}?action=apply`}>
                          <Button
                            size="sm"
                            className="text-xs h-8.5 bg-gov-primary hover:bg-gov-primary/95 text-white font-semibold"
                          >
                            Apply for this Challenge <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
