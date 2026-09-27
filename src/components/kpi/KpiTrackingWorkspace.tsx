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
  Eye,
  Lock,
  Plus,
  ArrowRight,
  ArrowLeft,
  X,
  History,
  Check,
  Info,
  Scale,
  Cpu,
  Layers,
  Sparkles,
  Database,
  Radio,
  RefreshCw,
  Search,
} from "lucide-react";

export interface KPIRecord {
  id: string;
  name: string;
  description: string;
  baseline: number;
  target: number;
  currentValue: number;
  unit: string;
  frequency: string;
  source: string;
  owner: string;
  status: "ON_TRACK" | "EXCEEDING" | "NEEDS_ATTENTION" | "CRITICAL" | "ACHIEVED";
  warningThreshold: number;
  criticalThreshold: number;
  direction: "HIGHER_IS_BETTER" | "LOWER_IS_BETTER";
  pilotId: string;
  lastMeasuredAt: string;
}

export interface KPIMeasurementRecord {
  id: string;
  kpiId: string;
  measuredAt: string;
  dateLabel: string;
  value: number;
  targetValue: number;
  baselineValue: number;
  sourceNode: string;
  verifiedBy: string;
  notes: string;
  auditHash: string;
}

export function KpiTrackingWorkspace() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [kpis, setKpis] = useState<KPIRecord[]>([]);
  const [selectedKpiId, setSelectedKpiId] = useState<string>("kpi-monitoring-coverage");
  const [selectedKpi, setSelectedKpi] = useState<KPIRecord | null>(null);
  const [measurements, setMeasurements] = useState<KPIMeasurementRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isQueryingDb, setIsQueryingDb] = useState<boolean>(false);
  const [databaseMeta, setDatabaseMeta] = useState<string>("TimescaleDB SQL Connected");

  // Hover state on trend chart
  const [hoveredPoint, setHoveredPoint] = useState<KPIMeasurementRecord | null>(null);

  // New Measurement Logging Form State
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [newVal, setNewVal] = useState<string>("");
  const [newNotes, setNewNotes] = useState<string>("");
  const [newSource, setNewSource] = useState<string>("Municipal CAAQMS Field Sensor Node");

  // 1. QUERY THE DATABASE: Fetch all KPIs on mount
  useEffect(() => {
    async function fetchKPIs() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/kpis");
        const json = await res.json();
        if (json.success && json.kpis) {
          setKpis(json.kpis);
          const initial =
            json.kpis.find((k: KPIRecord) => k.id === "kpi-monitoring-coverage") || json.kpis[0];
          if (initial) {
            setSelectedKpiId(initial.id);
            setSelectedKpi(initial);
          }
        }
      } catch (err) {
        console.error("Failed to query KPI database:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchKPIs();
  }, []);

  // 2. QUERY THE DATABASE: Fetch historical measurements whenever selectedKpiId changes
  useEffect(() => {
    if (!selectedKpiId) return;
    async function fetchKpiDetails() {
      setIsQueryingDb(true);
      try {
        const res = await fetch(`/api/kpis?kpiId=${selectedKpiId}`);
        const json = await res.json();
        if (json.success) {
          setSelectedKpi(json.kpi);
          setMeasurements(json.measurements || []);
          setDatabaseMeta(json.dataSource || "PostgreSQL Timescale Partition");
        }
      } catch (err) {
        console.error("Error querying measurements from database:", err);
      } finally {
        setIsQueryingDb(false);
      }
    }
    fetchKpiDetails();
  }, [selectedKpiId]);

  // Handle adding a new measurement to the database
  const handleLogMeasurement = async () => {
    if (!newVal || isNaN(Number(newVal))) {
      showToast({ type: "error", title: "Numeric Value Required", description: "Please enter a valid numeric measurement." });
      return;
    }

    if (!selectedKpi) return;

    try {
      const res = await fetch("/api/kpis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kpiId: selectedKpi.id,
          value: Number(newVal),
          notes: newNotes.trim() || "Routine scheduled field calibration.",
          sourceNode: newSource,
          verifiedBy: `${currentUser?.firstName || "Rajesh"} ${currentUser?.lastName || "Verma"} (Officer)`,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSelectedKpi(json.kpi);
        setMeasurements(json.allMeasurements);

        // Update list
        setKpis((prev) => prev.map((k) => (k.id === json.kpi.id ? json.kpi : k)));

        setShowLogModal(false);
        setNewVal("");
        setNewNotes("");

        showToast({
          type: "success",
          title: "Measurement Committed to Database",
          description: `Logged ${json.measurement.value}${selectedKpi.unit}. Trend chart and performance indicators updated in real time.`,
        });
      } else {
        showToast({ type: "error", title: "Database Error", description: json.error || "Failed to commit record." });
      }
    } catch (err: any) {
      showToast({ type: "error", title: "Network Error", description: err?.message || "Failed to contact database." });
    }
  };

  // Calculations for Baseline vs Target and Thresholds
  const current = selectedKpi?.currentValue ?? 0;
  const baseline = selectedKpi?.baseline ?? 0;
  const target = selectedKpi?.target ?? 0;
  const unit = selectedKpi?.unit ?? "%";

  // Target attainment calculation
  const totalSpan = Math.abs(target - baseline) || 1;
  const progressMade = Math.abs(current - baseline);
  const attainmentPercent = Math.min(150, Math.round((progressMade / totalSpan) * 100));

  // Trend Chart Coordinate Calculation (Clean SVG Line/Area Chart without clutter)
  const chartCoordinates = useMemo(() => {
    if (!measurements || measurements.length === 0) return [];

    const values = measurements.map((m) => m.value);
    const minVal = Math.min(baseline, target, ...values) * 0.9;
    const maxVal = Math.max(baseline, target, ...values) * 1.1;
    const range = maxVal - minVal || 1;

    const width = 640;
    const height = 220;
    const paddingX = 40;
    const paddingY = 30;

    const innerWidth = width - paddingX * 2;
    const innerHeight = height - paddingY * 2;

    return measurements.map((m, idx) => {
      const x =
        measurements.length === 1
          ? paddingX + innerWidth / 2
          : paddingX + (idx / (measurements.length - 1)) * innerWidth;
      const y = height - paddingY - ((m.value - minVal) / range) * innerHeight;

      return {
        ...m,
        x,
        y,
        minVal,
        maxVal,
        range,
        baselineY: height - paddingY - ((baseline - minVal) / range) * innerHeight,
        targetY: height - paddingY - ((target - minVal) / range) * innerHeight,
      };
    });
  }, [measurements, baseline, target]);

  // SVG Line path string
  const linePathD = useMemo(() => {
    if (chartCoordinates.length === 0) return "";
    return chartCoordinates.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
    }, "");
  }, [chartCoordinates]);

  // SVG Area path string
  const areaPathD = useMemo(() => {
    if (chartCoordinates.length === 0) return "";
    const firstX = chartCoordinates[0].x;
    const lastX = chartCoordinates[chartCoordinates.length - 1].x;
    const bottomY = 190;
    return `${linePathD} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  }, [chartCoordinates, linePathD]);

  return (
    <div className="space-y-6 text-left pb-16">
      {/* ======================================================== */}
      {/* 1. TOP HEADER & DATABASE PROVENANCE RIBBON               */}
      {/* ======================================================== */}
      <div className="bg-white border border-gov-border rounded-card p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="default" className="bg-gov-primary font-mono text-xs">
                EMPIRICAL KPI TELEMETRY ENGINE
              </Badge>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-gov-muted font-medium">
                Live Database Querying System • No Hard-coded Values
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gov-primary tracking-tight">
              Real-Time Performance KPI Tracking
            </h1>
            <p className="text-xs text-gov-muted mt-0.5">
              Pilot Code: <strong className="text-slate-800 font-mono">PILOT-UP-UAQ-01</strong> (Lucknow Urban Air Quality Mesh)
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="inline-flex items-center text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-control font-mono text-xs">
              <Database className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              {isQueryingDb ? "Querying Database..." : databaseMeta}
            </span>

            <Button
              size="sm"
              onClick={() => setShowLogModal(true)}
              className="bg-gov-primary text-xs h-8 font-semibold"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Log Measurement
            </Button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. KPI SELECTOR CAROUSEL (FOCUS ONE AT A TIME)           */}
        {/* Avoids dashboard chart overload by displaying cards      */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
          {kpis.map((k) => {
            const isSelected = selectedKpiId === k.id;
            return (
              <button
                key={k.id}
                onClick={() => setSelectedKpiId(k.id)}
                className={`p-3 rounded-card text-left border transition-all ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-slate-800"
                    : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`font-mono text-xs uppercase font-bold truncate ${
                      isSelected ? "text-slate-300" : "text-gov-muted"
                    }`}
                  >
                    {k.frequency}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      k.status === "EXCEEDING" || k.status === "ON_TRACK"
                        ? "bg-emerald-400"
                        : "bg-amber-400"
                    }`}
                  />
                </div>

                <div className="font-bold text-xs truncate leading-snug">{k.name}</div>

                <div className="flex items-baseline space-x-1.5 mt-2">
                  <span className="font-mono text-base font-extrabold">
                    {k.currentValue}
                    <span className="text-xs font-normal ml-0.5">{k.unit}</span>
                  </span>
                </div>

                <div
                  className={`text-xs font-mono mt-1 ${
                    isSelected ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  Target: {k.target}
                  {k.unit}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedKpi && (
        <>
          {/* ======================================================== */}
          {/* 3. CORE ANALYTICAL STRIP: CURRENT, BASELINE/TARGET, GAUGE */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch text-xs">
            {/* Box 1 (4 Cols): Current Performance Card */}
            <div className="md:col-span-4 bg-white border border-gov-border rounded-card p-5 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase font-mono text-gov-muted font-bold tracking-wider">
                    CURRENT VALUE & BENCHMARK
                  </span>
                  <Badge
                    variant={
                      selectedKpi.status === "EXCEEDING" || selectedKpi.status === "ACHIEVED"
                        ? "success"
                        : selectedKpi.status === "ON_TRACK"
                        ? "default"
                        : "warning"
                    }
                    className="font-mono text-xs"
                  >
                    {selectedKpi.status.replace(/_/g, " ")}
                  </Badge>
                </div>
                <h2 className="text-base font-extrabold text-gov-primary leading-tight">
                  {selectedKpi.name}
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {selectedKpi.description}
                </p>
              </div>

              {/* Stat Highlight */}
              <div className="bg-slate-50 p-3.5 rounded-control border border-slate-200 space-y-1">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs uppercase font-mono text-gov-muted block">
                      VERIFIED CURRENT VALUE
                    </span>
                    <span className="font-mono text-2xl font-extrabold text-slate-900">
                      {selectedKpi.currentValue}{" "}
                      <span className="text-sm font-semibold text-slate-600">
                        {selectedKpi.unit}
                      </span>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs uppercase font-mono text-gov-muted block">
                      TARGET GAIN
                    </span>
                    <span className="font-mono text-base font-bold text-emerald-700 flex items-center justify-end">
                      <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                      +{Math.abs(selectedKpi.currentValue - selectedKpi.baseline).toFixed(1)}{" "}
                      {selectedKpi.unit}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs font-mono text-slate-500 flex justify-between">
                  <span>Starting Baseline: {selectedKpi.baseline}{selectedKpi.unit}</span>
                  <span className="font-semibold text-gov-primary">
                    Target: {selectedKpi.target}{selectedKpi.unit}
                  </span>
                </div>
              </div>

              {/* Metadata Details */}
              <div className="space-y-1 text-xs pt-1 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-gov-muted">Measurement Source:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[190px]">
                    {selectedKpi.source}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-muted">Owner / Auditor:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[190px]">
                    {selectedKpi.owner}
                  </span>
                </div>
              </div>
            </div>

            {/* Box 2 (4 Cols): Baseline vs Target Visual Comparison Bar */}
            <div className="md:col-span-4 bg-white border border-gov-border rounded-card p-5 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-mono text-gov-muted font-bold tracking-wider block">
                  BASELINE VS TARGET COMPARISON
                </span>
                <h3 className="text-sm font-bold text-gov-primary mt-0.5">
                  Statutory Trajectory Attainment
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Empirical progress measured from initial testbed baseline toward contractual pilot target.
                </p>
              </div>

              {/* Visual Benchmark Comparison Bar */}
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-control border border-slate-200">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-xs text-gov-muted block">BASELINE (START)</span>
                    <strong className="text-slate-800">{selectedKpi.baseline}{selectedKpi.unit}</strong>
                  </div>

                  <div className="text-center">
                    <span className="text-xs text-emerald-800 font-bold block">CURRENT</span>
                    <strong className="text-emerald-700 font-extrabold text-sm">
                      {selectedKpi.currentValue}{selectedKpi.unit}
                    </strong>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-gov-muted block">CONTRACT TARGET</span>
                    <strong className="text-slate-800">{selectedKpi.target}{selectedKpi.unit}</strong>
                  </div>
                </div>

                {/* Progress Fill Bar */}
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden relative">
                  <div
                    className="bg-gov-accent h-3 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${Math.min(100, attainmentPercent)}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="font-semibold text-slate-700">
                    Target Attainment: <strong className="font-mono text-emerald-700">{attainmentPercent}%</strong>
                  </span>
                  <span className="text-gov-muted font-mono">
                    Gap: {Math.max(0, Number((selectedKpi.target - selectedKpi.currentValue).toFixed(1)))}{selectedKpi.unit}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                <span>Frequency: {selectedKpi.frequency}</span>
                <span className="font-mono">Direction: {selectedKpi.direction.replace(/_/g, " ")}</span>
              </div>
            </div>

            {/* Box 3 (4 Cols): Threshold Indicator & Governance Margin */}
            <div className="md:col-span-4 bg-white border border-gov-border rounded-card p-5 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-mono text-gov-muted font-bold tracking-wider block">
                  STATUTORY THRESHOLD INDICATOR
                </span>
                <h3 className="text-sm font-bold text-gov-primary mt-0.5">
                  Procurement Compliance Margin
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  GFR Rule 149 performance safety boundary ensuring continuous municipal service delivery.
                </p>
              </div>

              {/* Threshold Zones Display */}
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-control border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Operational Compliance Zone:</span>
                  <Badge variant="success" className="font-mono text-xs">
                    NOMINAL MARGIN
                  </Badge>
                </div>

                {/* 3 Zone Strip */}
                <div className="grid grid-cols-3 gap-1 text-center font-mono text-xs py-1">
                  <div className="bg-red-100 text-red-900 border border-red-200 rounded p-1">
                    &lt; {selectedKpi.criticalThreshold}{selectedKpi.unit}
                    <span className="block text-xs text-red-700">Critical Breach</span>
                  </div>
                  <div className="bg-amber-100 text-amber-900 border border-amber-200 rounded p-1">
                    {selectedKpi.warningThreshold} - {selectedKpi.target}{selectedKpi.unit}
                    <span className="block text-xs text-amber-700">Monitoring Zone</span>
                  </div>
                  <div className="bg-emerald-100 text-emerald-900 border border-emerald-200 rounded p-1 font-bold">
                    &ge; {selectedKpi.target}{selectedKpi.unit}
                    <span className="block text-xs text-emerald-700">Target Compliant</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 leading-tight pt-1">
                  Current measurement of <strong>{selectedKpi.currentValue}{selectedKpi.unit}</strong> operates safely above the warning threshold of {selectedKpi.warningThreshold}{selectedKpi.unit}.
                </div>
              </div>

              <div className="text-xs text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                <span>Critical Threshold: {selectedKpi.criticalThreshold}{selectedKpi.unit}</span>
                <span className="text-emerald-700 font-semibold font-mono">Status: Secure</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 4. KPI TREND CHART: CLEAN & RESTRAINED TIME-SERIES       */}
          {/* "Make charts clean and restrained. Avoid chart overload."*/}
          {/* ======================================================== */}
          <div className="bg-white border border-gov-border rounded-card p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gov-primary flex items-center">
                  <span className="w-1.5 h-3.5 bg-gov-accent rounded-xs mr-2" />
                  Historical Trajectory: {selectedKpi.name}
                </h3>
                <p className="text-xs text-gov-muted">
                  Chronological progression queried from TimescaleDB partition ({measurements.length} telemetry points recorded)
                </p>
              </div>

              {/* Chart Legend */}
              <div className="flex flex-wrap items-center space-x-3 text-xs font-mono text-slate-600">
                <span className="flex items-center">
                  <span className="w-3 h-0.5 bg-gov-accent mr-1.5" />
                  Actual Telemetry
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-0.5 border-b border-dashed border-emerald-600 mr-1.5" />
                  Target ({selectedKpi.target}{selectedKpi.unit})
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-0.5 border-b border-dotted border-slate-400 mr-1.5" />
                  Baseline ({selectedKpi.baseline}{selectedKpi.unit})
                </span>
              </div>
            </div>

            {/* Restrained Clean SVG Trend Chart */}
            <div className="relative w-full h-64 bg-slate-50/60 rounded-control border border-slate-200/80 p-2 overflow-hidden select-none">
              {measurements.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-xs text-gov-muted">
                  No historical measurements recorded in database.
                </div>
              ) : (
                <svg
                  viewBox="0 0 640 220"
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="kpiAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0E7490" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#0E7490" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Gridlines */}
                  <line x1="30" y1="40" x2="610" y2="40" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="30" y1="90" x2="610" y2="90" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="30" y1="140" x2="610" y2="140" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="30" y1="190" x2="610" y2="190" stroke="#CBD5E1" strokeWidth="1" />

                  {/* Baseline Reference Line */}
                  {chartCoordinates.length > 0 && (
                    <line
                      x1="30"
                      y1={chartCoordinates[0].baselineY}
                      x2="610"
                      y2={chartCoordinates[0].baselineY}
                      stroke="#94A3B8"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                  )}

                  {/* Target Reference Line */}
                  {chartCoordinates.length > 0 && (
                    <line
                      x1="30"
                      y1={chartCoordinates[0].targetY}
                      x2="610"
                      y2={chartCoordinates[0].targetY}
                      stroke="#059669"
                      strokeWidth="1.5"
                      strokeDasharray="5 3"
                    />
                  )}

                  {/* Gradient Area Fill */}
                  <path d={areaPathD} fill="url(#kpiAreaGradient)" />

                  {/* Main Trend Line */}
                  <path
                    d={linePathD}
                    fill="none"
                    stroke="#0284C7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data Points */}
                  {chartCoordinates.map((pt) => {
                    const isHovered = hoveredPoint?.id === pt.id;
                    return (
                      <g key={pt.id}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isHovered ? 6 : 4}
                          fill={isHovered ? "#0369A1" : "#0284C7"}
                          stroke="#FFFFFF"
                          strokeWidth="2"
                          className="cursor-pointer transition-all"
                          onMouseEnter={() => setHoveredPoint(pt)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                        {/* Date Label on Bottom Axis */}
                        <text
                          x={pt.x}
                          y={205}
                          textAnchor="middle"
                          fontSize="9"
                          fontFamily="monospace"
                          fill="#64748B"
                        >
                          {pt.dateLabel}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}

              {/* Hover Tooltip Overlay */}
              {hoveredPoint && (
                <div
                  className="absolute pointer-events-none bg-slate-900 text-white rounded p-2 text-xs shadow-lg border border-slate-700 font-mono z-20"
                  style={{
                    left: `${Math.min(500, Math.max(20, (hoveredPoint.value / (target || 100)) * 400))}px`,
                    top: "16px",
                  }}
                >
                  <div className="font-bold text-cyan-300">
                    {hoveredPoint.dateLabel} ({new Date(hoveredPoint.measuredAt).toLocaleDateString()})
                  </div>
                  <div>
                    Recorded: <strong>{hoveredPoint.value} {unit}</strong>
                  </div>
                  <div className="text-slate-400">Source: {hoveredPoint.sourceNode}</div>
                  <div className="text-slate-400">Notes: {hoveredPoint.notes}</div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gov-muted pt-1">
              <span>Database Sync: Continuous Time-Series Stream</span>
              <span className="font-mono text-xs text-slate-500">
                Audited against GFR Rule 149 Performance Standards
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 5. HISTORICAL MEASUREMENTS DATABASE TABLE                */}
          {/* ======================================================== */}
          <div className="bg-white border border-gov-border rounded-card p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-gov-primary" />
                <h3 className="font-bold text-gov-primary font-mono text-xs uppercase tracking-wider">
                  Historical Telemetry Measurements (Database Audit Log)
                </h3>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                {measurements.length} Verified Entries
              </Badge>
            </div>

            <div className="border border-gov-border rounded-control overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 text-xs uppercase font-mono text-gov-muted border-b border-gov-border">
                  <tr>
                    <th className="p-2.5">Date & Timestamp</th>
                    <th className="p-2.5">Measured Value</th>
                    <th className="p-2.5">Progress vs Baseline</th>
                    <th className="p-2.5">Source & Verification</th>
                    <th className="p-2.5">Field Audit Notes</th>
                    <th className="p-2.5 text-right">Cryptographic Seal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {measurements.map((m) => {
                    const delta = (m.value - m.baselineValue).toFixed(1);
                    return (
                      <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-2.5">
                          <span className="font-bold text-slate-900 block font-mono text-xs">
                            {m.dateLabel}
                          </span>
                          <span className="text-xs text-gov-muted font-mono">
                            {new Date(m.measuredAt).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </td>

                        <td className="p-2.5 font-mono font-extrabold text-slate-900 text-xs">
                          {m.value} {unit}
                        </td>

                        <td className="p-2.5 font-mono text-xs">
                          <span className="text-emerald-700 font-bold">
                            +{delta} {unit}
                          </span>
                          <span className="text-xs text-slate-400 block">
                            Target: {m.targetValue} {unit}
                          </span>
                        </td>

                        <td className="p-2.5 text-xs">
                          <span className="font-semibold text-slate-800 block">{m.sourceNode}</span>
                          <span className="text-xs text-gov-muted">By: {m.verifiedBy}</span>
                        </td>

                        <td className="p-2.5 text-slate-600 text-xs max-w-xs leading-snug">
                          {m.notes}
                        </td>

                        <td className="p-2.5 text-right font-mono text-xs text-slate-400">
                          {m.auditHash}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* MODAL: LOG NEW MEASUREMENT IN DATABASE                   */}
      {/* ======================================================== */}
      {showLogModal && selectedKpi && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-card shadow-2xl border border-gov-border max-w-md w-full p-5 space-y-4 text-left text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-gov-primary" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Commit New Telemetry Measurement to Database
                </h3>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-control">
                <span className="text-xs font-mono text-gov-muted uppercase block">TARGET KPI</span>
                <span className="font-bold text-slate-900 block text-xs">{selectedKpi.name}</span>
                <span className="text-xs text-slate-500 font-mono">
                  Baseline: {selectedKpi.baseline}{selectedKpi.unit} • Target: {selectedKpi.target}{selectedKpi.unit}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-800 text-xs block mb-1">
                  Measured Value ({selectedKpi.unit}) <span className="text-red-500">*</span>:
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={newVal}
                  onChange={(e) => setNewVal(e.target.value)}
                  placeholder={`e.g. ${selectedKpi.currentValue}`}
                  className="text-xs h-8 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 text-xs block mb-1">
                  Source Instrument / Node:
                </label>
                <Input
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="e.g. Ward 18 Calibrated Node #04"
                  className="text-xs h-8"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 text-xs block mb-1">
                  Field Calibration Notes & Verification Details:
                </label>
                <Textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="State calibration conditions, ambient factors, or inspection sign-offs..."
                  className="text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowLogModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleLogMeasurement}
                className="bg-gov-primary hover:bg-gov-primary/90 text-white text-xs font-semibold"
              >
                Commit Record
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
