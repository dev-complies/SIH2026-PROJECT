"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  ShieldCheck,
  Search,
  ExternalLink,
  Building2,
  ArrowRight,
  TrendingUp,
  Activity,
  FileCheck2,
  FileText,
} from "lucide-react";

export default function ProvenSolutionsPublicPage() {
  const [search, setSearch] = useState("");

  const solutions = [
    {
      id: "sol-air-001",
      title: "Hyperlocal IoT Air Quality Monitoring & Rapid Ward Intervention Grid",
      problem: "Lack of ward-level granular particulate sensing for rapid municipal dust suppression.",
      startup: "AirSense Technologies Pvt Ltd",
      dpiit: "DIPP98214",
      pilotLocation: "Lucknow, Uttar Pradesh (Wards 14, 18, 22, 29)",
      pilotDuration: "90 Days Testing",
      auditor: "The Energy and Resources Institute (TERI) Environmental Systems Audit",
      auditOutcome: "CERTIFIED VALIDATED",
      scalingStatus: "Authorized for Citywide 80-Ward Rollout (₹1.85 Cr Tender)",
      geMListing: "GeM Specialized Innovation Category #UP-ENV-2026",
      metrics: [
        { label: "Collocated Sensor Accuracy (vs BAM-1020)", baseline: "82.0%", achieved: "95.0%", target: "92.0%" },
        { label: "Municipal Ward Spatial Coverage", baseline: "35.0%", achieved: "86.0%", target: "80.0%" },
        { label: "Fleet Telemetry Backhaul Uptime", baseline: "76.0%", achieved: "94.0%", target: "90.0%" },
      ],
      techStack: ["Laser Particle Counters", "LoRaWAN / NB-IoT", "Machine Learning Calibration Curves", "GIS Dashboard"],
      replicationGuide: "Deploy 8-10 calibrated sensor nodes per ward; ensure municipal GIS webhook integration; require bi-annual collocated calibration check.",
    },
    {
      id: "sol-traffic-002",
      title: "Adaptive Corridor Signal Control & Transit Priority Engine",
      problem: "Severe peak-hour arterial corridor choke points impeding emergency and transit buses.",
      startup: "OptiFlow AI Systems Pvt Ltd",
      dpiit: "DIPP104822",
      pilotLocation: "GT Road Commercial Corridor, Kanpur (6 Intersections)",
      pilotDuration: "120 Days Testing",
      auditor: "IIT Kanpur Transportation Engineering Cell",
      auditOutcome: "CERTIFIED VALIDATED",
      scalingStatus: "Authorized for 4 Arterial Corridors in Kanpur & Prayagraj",
      geMListing: "Swiss Challenge Direct Procurement Eligible",
      metrics: [
        { label: "Peak Congestion Travel Delay", baseline: "0.0%", achieved: "-28.4%", target: "-20.0%" },
        { label: "Ambulance Corridor Clearance Time", baseline: "6.8 min", achieved: "3.2 min", target: "4.0 min" },
        { label: "Edge Controller Hardware Uptime", baseline: "81.0%", achieved: "99.1%", target: "98.0%" },
      ],
      techStack: ["Edge Computer Vision", "Dynamic Signal Phase Timing", "DSRC Transit Transponders", "Central TMC Integration"],
      replicationGuide: "Integrate with existing ITMS cameras; mount edge AI compute units at controller cabinets; calibrate green wave loops.",
    },
  ];

  const filtered = solutions.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.startup.toLowerCase().includes(search.toLowerCase()) ||
      s.pilotLocation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gov-border pb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Badge variant="default" className="bg-emerald-800 font-mono text-[10px]">
            EVIDENCE-BASED REPLICATION
          </Badge>
          <span className="text-xs text-gov-muted">Public Procurement Ready</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gov-primary tracking-tight">
          Proven Solutions Library
        </h1>
        <p className="text-sm text-gov-muted max-w-3xl mt-1 leading-relaxed">
          Technologies that have successfully completed controlled 90-120 day municipal pilots, achieved audited target KPIs, and received independent validation certification. Municipal corporations and state departments can replicate these tested innovations directly.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white border border-gov-border rounded-card p-4 flex gap-4 items-center justify-between shadow-2xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-gov-muted absolute left-3 top-3" />
          <Input
            placeholder="Search validated solutions by title, startup, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs h-10"
          />
        </div>
        <Badge variant="outline" className="font-mono text-xs hidden sm:inline-block">
          2 FULLY CERTIFIED PILOTS
        </Badge>
      </div>

      {/* Solutions Grid */}
      <div className="space-y-6">
        {filtered.map((sol) => (
          <div
            key={sol.id}
            className="bg-white border border-gov-border rounded-card p-6 shadow-sm space-y-5"
          >
            <div className="flex flex-col lg:flex-row justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="success" className="text-[10px] font-mono">
                    {sol.auditOutcome}
                  </Badge>
                  <span className="text-xs text-gov-muted font-mono">{sol.dpiit}</span>
                </div>
                <h2 className="text-xl font-bold text-gov-primary leading-snug">
                  {sol.title}
                </h2>
                <div className="text-xs text-slate-600 mt-1">
                  Startup: <strong className="text-slate-900">{sol.startup}</strong> • Tested in:{" "}
                  <strong className="text-slate-900">{sol.pilotLocation}</strong> ({sol.pilotDuration})
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                <Badge variant="outline" className="border-blue-200 text-blue-900 bg-blue-50/50 text-[11px] font-mono">
                  {sol.geMListing}
                </Badge>
                <Link href="/auth/login?role=PROCUREMENT_OFFICER">
                  <Button size="sm" className="bg-gov-primary text-xs h-9 font-semibold">
                    Procure Solution
                  </Button>
                </Link>
              </div>
            </div>

            {/* Problem & Tech Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 border border-slate-200/80 rounded-control p-3.5 space-y-1">
                <span className="text-[10px] font-mono text-gov-muted uppercase font-bold block">
                  CIVIC PROBLEM ADDRESSED
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">{sol.problem}</p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-control p-3.5 space-y-1">
                <span className="text-[10px] font-mono text-gov-muted uppercase font-bold block">
                  VALIDATED TECHNOLOGY ARCHITECTURE
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sol.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-700 text-[10px] font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Audited Metrics Table */}
            <div className="border border-slate-200 rounded-control overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-[10px] font-mono uppercase font-bold text-slate-700 border-b border-slate-200 flex justify-between">
                <span>INDEPENDENTLY AUDITED PERFORMANCE METRIC</span>
                <span>BASELINE → ACHIEVED (TARGET THRESHOLD)</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {sol.metrics.map((m, idx) => (
                  <div key={idx} className="px-4 py-2.5 flex items-center justify-between">
                    <span className="text-slate-800 font-semibold">{m.label}</span>
                    <div className="flex items-center space-x-3 font-mono">
                      <span className="text-slate-400 line-through text-[11px]">{m.baseline}</span>
                      <span className="text-slate-400">→</span>
                      <span className="font-bold text-emerald-700 text-sm">{m.achieved}</span>
                      <span className="text-slate-500 text-xs">({m.target})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit & Replication Details */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs bg-emerald-50/50 border border-emerald-200/60 rounded-control p-3">
              <div className="space-y-0.5">
                <div className="text-slate-800">
                  <span className="font-bold text-emerald-950">Third-Party Auditor:</span> {sol.auditor}
                </div>
                <div className="text-emerald-900 font-medium text-[11px]">
                  <span className="font-bold">Scale-Up Decision:</span> {sol.scalingStatus}
                </div>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <Button size="sm" variant="outline" className="text-xs h-8 bg-white border-emerald-300 text-emerald-900">
                  <FileText className="w-3.5 h-3.5 mr-1" /> View Audit Report (PDF)
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
