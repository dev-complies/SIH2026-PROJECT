"use client";

import React, { useState } from "react";
import Link from "next/link";
import { InnovationCity } from "@/components/3d";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Building2,
  Lock,
  Compass,
  FileCheck2,
  Layers,
  Activity,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Clock,
  Sparkles,
  Award,
  Search,
  Scale,
  FileText,
  Users2,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/auth/AuthContext";

export default function HomePage() {
  const { switchRole } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const impactMetrics = [
    { value: "42", label: "Challenges Formulated", subtext: "Across 8 State Departments & Municipalities" },
    { value: "310+", label: "Qualified Startups", subtext: "DPIIT-Screened DeepTech & MSME Innovators" },
    { value: "28", label: "Controlled Pilots", subtext: "Real-world Municipal Testbeds Deployed" },
    { value: "89.2%", label: "Validation Benchmark", subtext: "Achieved Audited Target KPIs" },
    { value: "90 Days", label: "Time-to-Evidence", subtext: "Standardized Empirical Evaluation Cycle" },
    { value: "₹18.4 Cr", label: "Milestone Escrow", subtext: "Performance-Linked Public Disbursements" },
  ];

  const howItWorksStages = [
    {
      step: "01",
      name: "Challenge",
      role: "Government Officer",
      roleBadge: "bg-blue-900/10 text-blue-900 border-blue-200",
      headline: "Problem Formulation & KPI Setting",
      description:
        "Government departments define precise civic problems with measurable baselines, target KPIs, and real-world testing constraints using an AI-guided wizard.",
      deliverable: "Published Challenge with Evaluation Rubric",
    },
    {
      step: "02",
      name: "Startup",
      role: "Startup / Innovator",
      roleBadge: "bg-emerald-900/10 text-emerald-900 border-emerald-200",
      headline: "Competitive Proposal Submission",
      description:
        "DPIIT-recognized startups and deeptech MSMEs apply with technical architecture, past field experience, and fixed 60-90 day pilot implementation plans.",
      deliverable: "Verified Application & DPIIT Credentials",
    },
    {
      step: "03",
      name: "Evaluation",
      role: "Independent Expert",
      roleBadge: "bg-amber-900/10 text-amber-900 border-amber-200",
      headline: "Blind Scoring & Conflict Disclosure",
      description:
        "Academic and domain specialists evaluate anonymized proposals under mandatory Conflict of Interest (COI) declarations to eliminate procurement bias.",
      deliverable: "Consensus Scorecard & Shortlist Matrix",
    },
    {
      step: "04",
      name: "Pilot",
      role: "Startup & Gov Officer",
      roleBadge: "bg-indigo-900/10 text-indigo-900 border-indigo-200",
      headline: "Controlled Municipal Deployment",
      description:
        "Selected startups deploy real hardware, sensors, or algorithms in specified municipal testbeds under strict legal non-disclosure and data privacy frameworks.",
      deliverable: "Live Testbed & GIS Coordinate Telemetry",
    },
    {
      step: "05",
      name: "Evidence",
      role: "IoT / Field Telemetry",
      roleBadge: "bg-teal-900/10 text-teal-900 border-teal-200",
      headline: "Cryptographic Telemetry Collection",
      description:
        "Continuous time-series telemetry, collocated sensor logs, and field deployment shapefiles are secured with tamper-evident SHA-256 cryptographic hashes.",
      deliverable: "Immutable Evidence Records & Audit Trail",
    },
    {
      step: "06",
      name: "Validation",
      role: "Independent Validator",
      roleBadge: "bg-purple-900/10 text-purple-900 border-purple-200",
      headline: "Third-Party Empirical Audit",
      description:
        "Accredited testing agencies (e.g. TERI, CPCB, IIT cells) conduct physical site inspections and regression tests to certify whether target KPIs were achieved.",
      deliverable: "Certified Validation Audit Report",
    },
    {
      step: "07",
      name: "Scale",
      role: "Procurement Committee",
      roleBadge: "bg-rose-900/10 text-rose-900 border-rose-200",
      headline: "Public Procurement Authorization",
      description:
        "Validated solutions unlock direct procurement tenders and GeM specialized catalog adoption under General Financial Rules (GFR 2017) Rule 149.",
      deliverable: "Scale-Up Decision & Public Tender Scaling",
    },
  ];

  const featuredChallenges = [
    {
      id: "chal-air-001",
      code: "CHAL-UP-DUD-2026-001",
      title: "Urban Air Quality Hyperlocal Monitoring & Intervention Mesh",
      department: "Department of Urban Development",
      ministry: "Govt of Uttar Pradesh • Lucknow Municipal Corporation",
      category: "CleanTech & Environmental IoT",
      budget: "₹25.0 Lakhs",
      duration: "90 Days",
      deadline: "31 Mar 2026",
      daysLeft: 18,
      status: "PILOT ACTIVE",
      statusVariant: "success",
      targetKpi: "92.0% Collocation Accuracy vs CPCB BAM-1020",
      description:
        "Deployment of 40 calibrated sensor nodes across 4 identified municipal wards to detect micro-dust hot spots and guide municipal dust-suppression trucks in real time.",
    },
    {
      id: "chal-traffic-002",
      code: "CHAL-UP-DUT-2026-002",
      title: "Adaptive AI Traffic Signal Optimization for Congestion Corridors",
      department: "Directorate of Urban Transport",
      ministry: "Govt of Uttar Pradesh • Kanpur Nagar Nigam",
      category: "Smart Mobility & Transit",
      budget: "₹35.0 Lakhs",
      duration: "120 Days",
      deadline: "15 Apr 2026",
      daysLeft: 33,
      status: "PROPOSALS OPEN",
      statusVariant: "default",
      targetKpi: "25.0% Reduction in Corridor Transit Delay",
      description:
        "Edge computer-vision sensors and dynamic phase signal controllers along 6 high-density intersections of the GT Road commercial corridor with emergency vehicle priority.",
    },
    {
      id: "chal-waste-003",
      code: "CHAL-UP-SWM-2026-003",
      title: "Deep-Learning Optical Purity Sorter for Dry Municipal Waste",
      department: "Noida Authority / Solid Waste SPV",
      ministry: "Industrial Development Dept • Gautam Buddha Nagar",
      category: "Circular Economy & Waste Tech",
      budget: "₹20.0 Lakhs",
      duration: "60 Days",
      deadline: "28 Feb 2026",
      daysLeft: 0,
      status: "UNDER EVALUATION",
      statusVariant: "warning",
      targetKpi: "85.0% Material Segregation Purity at 5 TPH",
      description:
        "Automated pneumatic optical sorting of recyclable plastics and cardboard at Sector 62 Material Recovery Facility (MRF) to eliminate hazardous manual handling.",
    },
    {
      id: "chal-water-004",
      code: "CHAL-UP-SWM-2026-004",
      title: "Groundwater Aquifer Depletion & Heavy Metal Telemetry Grid",
      department: "State Water & Sanitation Mission",
      ministry: "Namami Gange & Rural Water Supply • Prayagraj",
      category: "Water Resources & Deep Sensing",
      budget: "₹40.0 Lakhs",
      duration: "90 Days",
      deadline: "30 Apr 2026",
      daysLeft: 48,
      status: "PROPOSALS OPEN",
      statusVariant: "default",
      targetKpi: "98.0% Uplink Reliability & Arsenic Detection",
      description:
        "Low-power ultrasonic borehole sensors and electrochemical heavy-metal telemetry nodes monitoring deep alluvial aquifers across rural and peri-urban water supply belts.",
    },
  ];

  const provenSolutions = [
    {
      id: "sol-air-001",
      title: "Hyperlocal IoT Air Quality Monitoring & Rapid Ward Intervention Grid",
      startup: "AirSense Technologies Pvt Ltd",
      dpiit: "DIPP98214",
      testLocation: "Lucknow, Uttar Pradesh (Wards 14, 18, 22, 29)",
      duration: "90 Days Deployment",
      auditor: "TERI Environmental Systems Audit",
      auditOutcome: "CERTIFIED VALIDATED",
      metrics: [
        { label: "Collocated Sensor Accuracy", baseline: "82.0%", achieved: "95.0%", target: "92.0%" },
        { label: "Municipal Ward Coverage", baseline: "35.0%", achieved: "86.0%", target: "80.0%" },
        { label: "Telemetry Backhaul Uptime", baseline: "76.0%", achieved: "94.0%", target: "90.0%" },
      ],
      procurementScale: "Approved for City-wide 80-Ward Deployment (₹1.85 Cr Public Tender)",
      geMStatus: "Listed under GeM Specialized Innovation Category #UP-ENV-2026",
    },
    {
      id: "sol-traffic-002",
      title: "Adaptive Corridor Signal Control & Transit Priority Engine",
      startup: "OptiFlow AI Systems",
      dpiit: "DIPP104822",
      testLocation: "Kanpur Commercial Corridor (6 Intersections)",
      duration: "120 Days Deployment",
      auditor: "IIT Kanpur Transportation Engineering Cell",
      auditOutcome: "CERTIFIED VALIDATED",
      metrics: [
        { label: "Peak Congestion Travel Delay", baseline: "0.0%", achieved: "-28.4%", target: "-20.0%" },
        { label: "Ambulance Corridor Clearance", baseline: "6.8 min", achieved: "3.2 min", target: "4.0 min" },
        { label: "Edge Controller Hardware Uptime", baseline: "81.0%", achieved: "99.1%", target: "98.0%" },
      ],
      procurementScale: "Approved for 4 Arterial Corridors in Kanpur & Prayagraj",
      geMStatus: "Swiss Challenge Direct Procurement Eligible",
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="pt-2">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="default" className="bg-gov-primary font-mono text-xs tracking-wide px-2.5 py-0.5">
            REPUBLIC OF INDIA • GOVTECH OPERATING SYSTEM
          </Badge>
          <span className="text-gov-muted text-xs hidden sm:inline">•</span>
          <span className="text-xs font-semibold text-slate-600">
            Public Procurement Accountability Framework
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gov-primary tracking-tight leading-[1.15]">
              Turn Government Challenges Into Tested, Scalable Solutions.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              Discover verified startups, execute controlled municipal pilots, measure empirical outcomes, and accelerate proven innovations toward public procurement contracts.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/challenges">
                <Button size="lg" className="h-11 px-5 bg-gov-primary hover:bg-gov-primary-hover shadow-sm font-semibold text-sm">
                  Explore Challenges <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/auth/login?role=STARTUP&action=register">
                <Button size="lg" variant="outline" className="h-11 px-5 border-slate-300 text-slate-800 hover:bg-slate-50 font-semibold text-sm">
                  Register as a Startup
                </Button>
              </Link>

              <Link href="/auth/login?role=GOVERNMENT_OFFICER">
                <Button size="lg" variant="ghost" className="h-11 px-4 text-gov-accent hover:text-blue-800 hover:bg-blue-50 font-semibold text-sm">
                  Government Login
                </Button>
              </Link>
            </div>

            {/* Institutional Credentials Strip */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
                GFR 2017 Rule 149 Compliant
              </span>
              <span className="flex items-center">
                <Lock className="w-4 h-4 text-blue-600 mr-1.5 shrink-0" />
                Blind Technical Scoring
              </span>
              <span className="flex items-center">
                <Activity className="w-4 h-4 text-gov-accent mr-1.5 shrink-0" />
                Independent NABL/CPCB Verification
              </span>
            </div>
          </div>

          {/* Hero Visual: InnovationCity 3D Component */}
          <div className="lg:col-span-5">
            <div className="border border-slate-200 rounded-xl bg-white p-2 shadow-sm">
              <InnovationCity height="h-96" />
            </div>
            <div className="flex justify-between items-center px-2 pt-2 text-xs text-slate-500">
              <span>Architectural Digital Twin: Secretariat & Pilot Mesh</span>
              <span className="font-mono text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" /> Live Telemetry Nodes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. IMPACT METRICS (Structured strip, whitespace, fine lines) */}
      <section className="border-y border-slate-200 py-8 bg-white/70">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-gov-accent font-bold">
              PLATFORM OPERATIONAL BENCHMARKS
            </h2>
            <p className="text-sm font-bold text-gov-primary mt-0.5">
              Cumulative Innovation Procurement Metrics Across State Missions
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Audited against Central Vigilance Commission Transparency Directives</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {impactMetrics.map((item, idx) => (
            <div key={idx} className="px-4 py-3 sm:py-0 text-left">
              <div className="text-2xl sm:text-3xl font-extrabold text-gov-primary tracking-tight font-mono">
                {item.value}
              </div>
              <div className="text-xs font-bold text-slate-900 mt-1 leading-tight">
                {item.label}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-normal">
                {item.subtext}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS: The 7-Stage Rigorous Lifecycle */}
      <section className="space-y-8">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-mono font-bold text-gov-accent uppercase tracking-wider">
              SECTION 03 • RIGOROUS PUBLIC METHODOLOGY
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gov-primary tracking-tight">
            How It Works: The 7-Stage Innovation Lifecycle
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Unlike commercial innovation portals, GovInnovate enforces statutory segregation of duties, anonymized expert appraisals, collocated physical measurements, and escrow disbursement gates.
          </p>
        </div>

        {/* 7-Stage Process Sequence - Responsive Grid avoiding cramped columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {howItWorksStages.map((st) => (
            <div
              key={st.step}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-gov-accent hover:shadow-sm transition-all relative"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-mono text-base font-extrabold text-gov-primary">
                    {st.step}
                  </span>
                  <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
                    {st.name}
                  </span>
                </div>

                <Badge
                  variant="outline"
                  className={`text-xs font-semibold uppercase px-2 py-0.5 border ${st.roleBadge}`}
                >
                  {st.role}
                </Badge>

                <h3 className="text-xs font-bold text-slate-900 leading-snug">
                  {st.headline}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {st.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <span className="text-xs uppercase font-mono text-slate-400 block mb-0.5 font-semibold">
                  VERIFIABLE GATE:
                </span>
                <span className="font-semibold text-gov-primary block leading-tight">
                  {st.deliverable}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ACTIVE CHALLENGES */}
      <section className="space-y-6" id="challenges">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gov-border pb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-mono font-bold text-gov-accent uppercase tracking-wider">
                CURRENT OPPORTUNITIES
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gov-primary tracking-tight">
              Active Municipal & State Challenges
            </h2>
            <p className="text-xs text-gov-muted mt-1">
              Open problem statements seeking DPIIT-registered startups for funded 60-120 day pilot deployments.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/challenges">
              <Button size="sm" variant="outline" className="text-xs h-9">
                View All 42 Challenges <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Challenge Directory Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {featuredChallenges.map((ch) => (
            <div
              key={ch.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-gov-accent hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs text-gov-accent block font-semibold">
                      {ch.code}
                    </span>
                    <h3 className="text-base font-bold text-gov-primary leading-tight mt-0.5">
                      {ch.title}
                    </h3>
                  </div>
                  <Badge
                    variant={ch.statusVariant as any}
                    className="shrink-0 text-xs font-mono uppercase px-2 py-0.5"
                  >
                    {ch.status}
                  </Badge>
                </div>

                <div className="text-xs text-slate-600 font-medium">
                  {ch.department} • <span className="text-slate-500">{ch.ministry}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {ch.description}
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
                  <span className="text-xs font-mono text-slate-500 uppercase block font-semibold mb-0.5">
                    PRIMARY VERIFIABLE OUTCOME TARGET
                  </span>
                  <span className="font-semibold text-emerald-800 text-xs">
                    {ch.targetKpi}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                  <span>
                    Pilot Grant: <strong className="text-slate-900 font-bold">{ch.budget}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Duration: <strong className="text-slate-900 font-bold">{ch.duration}</strong>
                  </span>
                  <span>•</span>
                  <span className="text-amber-800 font-medium">
                    Deadline: {ch.deadline}
                  </span>
                </div>

                <Link href={`/challenges`}>
                  <Button size="sm" variant="outline" className="h-8.5 px-3 border-slate-300 text-slate-800 hover:bg-slate-50 text-xs font-semibold">
                    View Specs
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PROVEN SOLUTIONS LIBRARY */}
      <section className="space-y-6" id="proven-solutions">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gov-border pb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
                EVIDENCE-BASED REPLICATION REPOSITORY
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gov-primary tracking-tight">
              Proven Solutions: Validated in Municipal Field Conditions
            </h2>
            <p className="text-xs text-gov-muted mt-1">
              Tested technologies with independently audited outcomes ready for direct public procurement adoption across other Smart Cities.
            </p>
          </div>

          <Link href="/proven-solutions">
            <Button size="sm" variant="outline" className="text-xs h-9">
              Browse Repository <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Proven Solution Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {provenSolutions.map((sol) => (
            <div
              key={sol.id}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-emerald-50 border-l border-b border-emerald-200 px-3 py-1 text-xs font-mono font-bold text-emerald-800 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                THIRD-PARTY CERTIFIED
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gov-primary leading-snug">
                    {sol.title}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>
                      Startup: <strong className="text-slate-800">{sol.startup}</strong> ({sol.dpiit})
                    </span>
                    <span>•</span>
                    <span>{sol.testLocation}</span>
                  </div>
                </div>

                {/* Empirical Metrics Comparison Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-50 px-3 py-2 text-xs font-mono uppercase font-bold text-slate-600 border-b border-slate-200 flex justify-between">
                    <span>AUDITED METRIC</span>
                    <span>BASELINE → ACHIEVED (TARGET)</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    {sol.metrics.map((m, idx) => (
                      <div key={idx} className="px-3 py-2.5 flex items-center justify-between">
                        <span className="text-slate-700 font-medium">{m.label}</span>
                        <div className="flex items-center space-x-2 font-mono text-xs">
                          <span className="text-slate-400 line-through">{m.baseline}</span>
                          <span className="text-slate-400">→</span>
                          <span className="font-bold text-emerald-700">{m.achieved}</span>
                          <span className="text-slate-500">({m.target})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="text-slate-700">
                    <span className="font-semibold text-slate-900">Independent Auditor:</span> {sol.auditor}
                  </div>
                  <div className="text-emerald-800 font-medium">
                    <span className="font-semibold">Procurement Recommendation:</span> {sol.procurementScale}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <Badge variant="outline" className="text-xs font-mono border-blue-200 text-blue-900 bg-blue-50/50 px-2.5 py-0.5">
                  {sol.geMStatus}
                </Badge>

                <Link href="/proven-solutions">
                  <Button size="sm" variant="outline" className="h-8.5 px-3 border-slate-300 text-slate-800 hover:bg-slate-50 text-xs font-semibold">
                    View Verification Audit
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. INNOVATION ECOSYSTEM: Structured Split Statutory Framework */}
      <section className="space-y-6">
        <div className="border-b border-gov-border pb-4">
          <span className="text-xs font-mono font-bold text-gov-accent uppercase tracking-wider block mb-1">
            STATUTORY GOVERNANCE ARCHITECTURE
          </span>
          <h2 className="text-2xl font-bold text-gov-primary tracking-tight">
            Institutional Role Segregation under General Financial Rules (GFR 2017)
          </h2>
          <p className="text-xs text-gov-muted mt-1 max-w-3xl leading-relaxed">
            Public sector innovation requires strict constitutional separation of duties. GovInnovate enforces non-overlapping legal roles between problem creators, technical evaluators, independent validators, and fiscal sanction authorities.
          </p>
        </div>

        {/* Intentional Split Layout: Left Briefing + Right Structured Statutory Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Institutional Principle Briefing */}
          <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-4 text-left">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-gov-primary uppercase tracking-wider block">
                LEGAL COMPLIANCE PRINCIPLE
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                Zero Conflict of Interest by Architectural Design
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Traditional public procurement often suffers when the formulating department also evaluates solutions or self-audits pilot outcomes.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Under GovInnovate, an officer who posts a challenge cannot submit technical scores. Independent evaluators are blind to startup identity. Independent validators have zero financial stake in pilot adoption.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Central Vigilance Commission (CVC) Aligned</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-800 font-medium">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>GFR 2017 Rule 149 Innovation Window</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Density Statutory Role Matrix Table */}
          <div className="lg:col-span-8 border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/90 border-b border-slate-200">
                    <TableHead className="font-mono text-xs font-bold text-slate-700 whitespace-nowrap">Constitutional Stakeholder</TableHead>
                    <TableHead className="text-xs font-bold text-slate-700 whitespace-nowrap">Core Statutory Mandate</TableHead>
                    <TableHead className="text-xs font-bold text-slate-700 whitespace-nowrap">Verifiable Gate</TableHead>
                    <TableHead className="font-mono text-xs font-bold text-slate-700 text-right whitespace-nowrap">System RBAC Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100 text-xs">
                  <TableRow className="hover:bg-slate-50/50">
                    <TableCell className="font-semibold text-slate-900 whitespace-nowrap">
                      Municipal & State Departments
                    </TableCell>
                    <TableCell className="text-slate-600">
                      Formulate civic problems, provide field testbeds, host physical telemetry nodes.
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-700">
                      Challenge Specification & Ward Access Pass
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-mono text-xs font-semibold text-gov-primary bg-slate-100 px-2 py-0.5 rounded">
                        GOVERNMENT_OFFICER
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="hover:bg-slate-50/50">
                    <TableCell className="font-semibold text-slate-900 whitespace-nowrap">
                      DPIIT DeepTech Startups
                    </TableCell>
                    <TableCell className="text-slate-600">
                      Deploy proprietary edge IoT, optics, and algorithms; maintain 100% background IP.
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-700">
                      Daily Time-Series Telemetry & Hash Receipt
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        STARTUP
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="hover:bg-slate-50/50">
                    <TableCell className="font-semibold text-slate-900 whitespace-nowrap">
                      IIT & CSIR Academic Specialists
                    </TableCell>
                    <TableCell className="text-slate-600">
                      Perform blind technical methodology scoring under non-pecuniary legal oath.
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-700">
                      Anonymized Consensus Rubric & COI Clearance
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-mono text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                        EXPERT_EVALUATOR
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="hover:bg-slate-50/50">
                    <TableCell className="font-semibold text-slate-900 whitespace-nowrap">
                      NABL / CPCB Accredited Labs
                    </TableCell>
                    <TableCell className="text-slate-600">
                      Conduct on-site collocated regression audits comparing pilot data to reference standards.
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-700">
                      Certified Empirical Audit Log (R2 &gt;= 0.90)
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-mono text-xs font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                        INDEPENDENT_VALIDATOR
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="hover:bg-slate-50/50">
                    <TableCell className="font-semibold text-slate-900 whitespace-nowrap">
                      Public Treasury & GeM Cell
                    </TableCell>
                    <TableCell className="text-slate-600">
                      Disburse milestone escrow tranches; authorize GFR 149 city-wide scale procurement.
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-700">
                      Direct Treasury Release & Scale Tender Award
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-mono text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        PROCUREMENT_OFFICER
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TRANSPARENCY & ACCOUNTABILITY: Editorial Numbered Dossier */}
      <section className="bg-slate-900 text-white rounded-lg p-8 sm:p-10 space-y-8">
        <div className="max-w-3xl space-y-2">
          <Badge variant="outline" className="border-slate-700 text-blue-300 font-mono text-xs px-2.5 py-0.5 bg-slate-800/60">
            PUBLIC SECTOR TRUST ARCHITECTURE
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Designed for Absolute Transparency & Public Auditability
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Public innovation initiatives fail when evaluation is subjective, measurements are unverified, or procurement decisions lack documentary evidence. GovInnovate eliminates these vulnerabilities by design.
          </p>
        </div>

        {/* 4 Editorial Pillars with top rules instead of generic icon cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="border-t border-slate-700/80 pt-4 space-y-2">
            <span className="font-mono text-xs font-bold text-blue-400 block">
              01 / BLIND REVIEW
            </span>
            <h3 className="font-bold text-white text-sm">
              Anonymized Technical Scoring
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Evaluators review technical methodologies with startup identity, corporate names, and founders masked. Reviewers must certify zero pecuniary interest under CVC regulations.
            </p>
          </div>

          <div className="border-t border-slate-700/80 pt-4 space-y-2">
            <span className="font-mono text-xs font-bold text-emerald-400 block">
              02 / PHYSICAL AUDITS
            </span>
            <h3 className="font-bold text-white text-sm">
              Collocated Reference Measurements
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Self-reported startup claims are never accepted. Telemetry is collocated with continuous reference equipment (e.g. CPCB BAM-1020) and audited by independent testing bodies.
            </p>
          </div>

          <div className="border-t border-slate-700/80 pt-4 space-y-2">
            <span className="font-mono text-xs font-bold text-amber-400 block">
              03 / CRYPTOGRAPHIC TRUST
            </span>
            <h3 className="font-bold text-white text-sm">
              Cryptographic SHA-256 Hashes
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Every field photo, telemetry batch, sensor firmware log, and audit document is cryptographically anchored. Tampering with evidence files voids the verification audit.
            </p>
          </div>

          <div className="border-t border-slate-700/80 pt-4 space-y-2">
            <span className="font-mono text-xs font-bold text-purple-400 block">
              04 / VIGILANCE INTEGRITY
            </span>
            <h3 className="font-bold text-white text-sm">
              Immutable Event Ledger
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Every score submission, milestone approval, fund disbursement, and scale-up vote is appended to an append-only audit trail accessible by the state vigilance directorate.
            </p>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION: Clean Solid Panel (No decorative gradients) */}
      <section className="bg-slate-50 border border-slate-200 rounded-lg p-8 sm:p-10 space-y-6">
        <div className="max-w-2xl mx-auto text-center space-y-2">
          <span className="text-xs font-mono font-bold text-gov-accent uppercase tracking-wider block">
            GET STARTED WITH GOVINNOVATE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gov-primary tracking-tight">
            Accelerate Public Innovation Procurement Today
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Join municipal corporations, state departments, high-growth deeptech startups, and independent evaluation experts bridging the gap between civic problems and audited scale.
          </p>
        </div>

        {/* 3 Clear Pathways with solid cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto pt-2 text-left">
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-colors">
            <div>
              <span className="text-xs font-mono font-bold text-blue-900 block mb-1">
                FOR GOVERNMENT OFFICERS
              </span>
              <h4 className="text-sm font-bold text-slate-900">Publish a Civic Challenge</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Formulate an urban infrastructure problem and access competitive deeptech solutions.
              </p>
            </div>
            <Link href="/auth/login?role=GOVERNMENT_OFFICER" className="mt-5">
              <Button size="sm" className="w-full bg-gov-primary hover:bg-gov-primary-hover text-xs h-9 font-semibold">
                Officer Login
              </Button>
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-colors">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-800 block mb-1">
                FOR DPIIT STARTUPS
              </span>
              <h4 className="text-sm font-bold text-slate-900">Deploy in Controlled Pilots</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Win funded pilot deployments, validate your technology, and unlock direct procurement.
              </p>
            </div>
            <Link href="/auth/login?role=STARTUP&action=register" className="mt-5">
              <Button size="sm" className="w-full bg-gov-primary hover:bg-gov-primary-hover text-white text-xs h-9 font-semibold">
                Register Startup
              </Button>
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-colors">
            <div>
              <span className="text-xs font-mono font-bold text-amber-800 block mb-1">
                FOR EXPERTS & AUDITORS
              </span>
              <h4 className="text-sm font-bold text-slate-900">Join the Technical Panel</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Conduct blind technical evaluations and empirical testing for public interest tech.
              </p>
            </div>
            <Link href="/auth/login?role=EXPERT" className="mt-5">
              <Button size="sm" variant="outline" className="w-full text-xs h-9 font-semibold border-slate-300 text-slate-800 hover:bg-slate-50">
                Evaluator Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
