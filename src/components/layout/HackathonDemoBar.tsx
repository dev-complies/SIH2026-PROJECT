"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/auth/AuthContext";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  UserCheck,
  CheckCircle2,
  X,
  Maximize2,
  Minimize2,
  Layers,
  Building2,
  Rocket,
  Award,
  ShieldCheck,
  Activity,
  FileCheck,
  Scale,
  ListOrdered,
  Eye,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils";

export interface DemoStep {
  id: number;
  title: string;
  shortTitle: string;
  path: string;
  role: "GOVERNMENT_OFFICER" | "STARTUP" | "EXPERT" | "VALIDATOR";
  userId: string;
  userName: string;
  userRoleLabel: string;
  category: "Discovery" | "Application" | "Evaluation" | "Pilot" | "Scale-Up";
  talkingPoint: string;
  keyHighlight: string;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    id: 1,
    title: "1. Landing Page",
    shortTitle: "Landing",
    path: "/",
    role: "GOVERNMENT_OFFICER",
    userId: "user-gov-001",
    userName: "Rajesh Verma",
    userRoleLabel: "Gov Officer",
    category: "Discovery",
    talkingPoint: "Public GovTech innovation operating system with national pilot impact stats and statutory procurement lifecycle.",
    keyHighlight: "National Dashboard & Public Transparency",
  },
  {
    id: 2,
    title: "2. Government Dashboard",
    shortTitle: "Gov Dashboard",
    path: "/gov/dashboard",
    role: "GOVERNMENT_OFFICER",
    userId: "user-gov-001",
    userName: "Rajesh Verma",
    userRoleLabel: "Gov Officer",
    category: "Discovery",
    talkingPoint: "Municipal command center: active civic challenges, pilot testbed pipeline, milestone escrow disbursements, and SLA triage.",
    keyHighlight: "Urban Development Command Center",
  },
  {
    id: 3,
    title: "3. Create / Open Challenge",
    shortTitle: "Open Challenge",
    path: "/challenges/chal-air-001",
    role: "GOVERNMENT_OFFICER",
    userId: "user-gov-001",
    userName: "Rajesh Verma",
    userRoleLabel: "Gov Officer",
    category: "Discovery",
    talkingPoint: "Urban Air Quality Hyperlocal Monitoring & Intervention Mesh challenge formulated with 85% coverage and 95% accuracy KPIs.",
    keyHighlight: "KPI & Problem Formulation",
  },
  {
    id: 4,
    title: "4. Startup Discovers Challenge",
    shortTitle: "Discover Challenge",
    path: "/challenges",
    role: "STARTUP",
    userId: "user-startup-001",
    userName: "Aarav Sharma",
    userRoleLabel: "Startup CEO",
    category: "Application",
    talkingPoint: "AirSense Technologies filters open national challenges under Smart Cities Mission and identifies the Lucknow testbed.",
    keyHighlight: "DPIIT Startup Discovery Portal",
  },
  {
    id: 5,
    title: "5. Startup Application",
    shortTitle: "Startup Application",
    path: "/startup/applications",
    role: "STARTUP",
    userId: "user-startup-001",
    userName: "Aarav Sharma",
    userRoleLabel: "Startup CEO",
    category: "Application",
    talkingPoint: "AirSense submits 90-day pilot proposal with low-cost optical IoT mesh architecture, milestone plan, and DPIIT credentials.",
    keyHighlight: "Technical Proposal & DPIIT-94812",
  },
  {
    id: 6,
    title: "6. Expert Evaluation",
    shortTitle: "Expert Evaluation",
    path: "/expert/evaluations",
    role: "EXPERT",
    userId: "user-expert-001",
    userName: "Dr. Alok Gupta",
    userRoleLabel: "IIT Kanpur",
    category: "Evaluation",
    talkingPoint: "Academic evaluator files mandatory Conflict of Interest declaration and conducts blind technical scoring (Consensus: 91.7/100).",
    keyHighlight: "Blind Scoring & Conflict Disclosure",
  },
  {
    id: 7,
    title: "7. Shortlisting Matrix",
    shortTitle: "Shortlisting",
    path: "/gov/shortlisting",
    role: "GOVERNMENT_OFFICER",
    userId: "user-gov-001",
    userName: "Rajesh Verma",
    userRoleLabel: "Gov Officer",
    category: "Evaluation",
    talkingPoint: "Department reviews consensus rank (AirSense #1 of 14 applicants) and approves issuance of municipal pilot agreement.",
    keyHighlight: "Consensus Ranking & Approval",
  },
  {
    id: 8,
    title: "8. Pilot Dashboard",
    shortTitle: "Pilot Dashboard",
    path: "/gov/pilots/PILOT-UP-UAQ-01",
    role: "GOVERNMENT_OFFICER",
    userId: "user-gov-001",
    userName: "Rajesh Verma",
    userRoleLabel: "Gov Officer",
    category: "Pilot",
    talkingPoint: "90-day Lucknow Urban Air Quality Pilot with 40 IoT nodes, live GIS map, milestone escrow tracker, and field SLA alerts.",
    keyHighlight: "Real-World Municipal Testbed",
  },
  {
    id: 9,
    title: "9. KPI Results Tracking",
    shortTitle: "KPI Results",
    path: "/kpis",
    role: "GOVERNMENT_OFFICER",
    userId: "user-gov-001",
    userName: "Rajesh Verma",
    userRoleLabel: "Gov Officer",
    category: "Pilot",
    talkingPoint: "Verified KPI metrics: Coverage (35% -> 85% target -> 86% achieved), Accuracy (82% -> 95%), Device Uptime (76% -> 90% -> 94%).",
    keyHighlight: "Empirical Baseline vs Target KPIs",
  },
  {
    id: 10,
    title: "10. Evidence Management Vault",
    shortTitle: "Evidence Vault",
    path: "/evidence",
    role: "GOVERNMENT_OFFICER",
    userId: "user-gov-001",
    userName: "Rajesh Verma",
    userRoleLabel: "Gov Officer",
    category: "Pilot",
    talkingPoint: "Cryptographically verified SHA-256 telemetry logs, CPCB collocated sensor reports, and node telemetry data packets.",
    keyHighlight: "SHA-256 Cryptographic Evidence",
  },
  {
    id: 11,
    title: "11. Independent Validation",
    shortTitle: "Validation",
    path: "/validator/dashboard",
    role: "VALIDATOR",
    userId: "user-validator-001",
    userName: "Priya Nair",
    userRoleLabel: "TERI Auditor",
    category: "Scale-Up",
    talkingPoint: "TERI Class-A Auditor executes 8-point empirical validation checklist and certifies tamper-evident telemetry logs.",
    keyHighlight: "Class-A 3rd-Party Verification",
  },
  {
    id: 12,
    title: "12. Scale-Up Decision Memo",
    shortTitle: "Scale-Up Decision",
    path: "/scale-up",
    role: "GOVERNMENT_OFFICER",
    userId: "user-gov-001",
    userName: "Rajesh Verma",
    userRoleLabel: "Gov Officer",
    category: "Scale-Up",
    talkingPoint: "Procurement Committee executes Statutory Scale-Up Memo DEC-SCALE-2026-01: ₹1.68 Cr expansion to 6 Smart Cities.",
    keyHighlight: "Statutory Procurement Authorization",
  },
];

export function HackathonDemoBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, loginAsDemoUser } = useAuth();

  const [isMinimized, setIsMinimized] = useState(false);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Sync current step with active pathname
  useEffect(() => {
    const matchedIndex = DEMO_STEPS.findIndex((s) => {
      if (s.path === "/") return pathname === "/";
      return pathname.startsWith(s.path.split("?")[0]);
    });
    if (matchedIndex !== -1) {
      setCurrentStepIndex(matchedIndex);
    }
  }, [pathname]);

  const activeStep = DEMO_STEPS[currentStepIndex] || DEMO_STEPS[0];

  const handleGoToStep = (index: number) => {
    if (index < 0 || index >= DEMO_STEPS.length) return;
    const target = DEMO_STEPS[index];
    setCurrentStepIndex(index);

    // Auto-switch to the required demo persona for this step
    if (loginAsDemoUser && target.userId) {
      loginAsDemoUser(target.userId);
    }

    setShowAllSteps(false);
    router.push(target.path);
  };

  const handleNext = () => {
    const nextIdx = (currentStepIndex + 1) % DEMO_STEPS.length;
    handleGoToStep(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (currentStepIndex - 1 + DEMO_STEPS.length) % DEMO_STEPS.length;
    handleGoToStep(prevIdx);
  };

  // Minimized Floating Pill View
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center space-x-2 bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-2 rounded-full border border-blue-500/40 shadow-2xl">
          <div className="flex items-center space-x-1.5 cursor-pointer" onClick={() => setIsMinimized(false)}>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold tracking-wide text-blue-300 uppercase">Demo</span>
            <span className="text-xs font-semibold text-slate-200">
              {activeStep.id}/12: {activeStep.shortTitle}
            </span>
          </div>

          <div className="h-3.5 w-px bg-slate-700 mx-1" />

          <button
            onClick={handleNext}
            className="p-1 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition-colors"
            title="Next Demo Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMinimized(false)}
            className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
            title="Expand Demo Console"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside
      aria-label="SIH 2026 Hackathon Demo Console"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-5xl animate-in fade-in slide-in-from-bottom-3 duration-300"
    >
      <div className="bg-slate-950/95 backdrop-blur-lg border border-slate-700/80 rounded-2xl shadow-2xl text-white overflow-hidden ring-1 ring-white/10">
        {/* Step Grid Modal / Drawer */}
        {showAllSteps && (
          <div className="border-b border-slate-800 p-4 bg-slate-900/95 max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Full 12-Step Demonstration Sequence
                </h4>
              </div>
              <button
                onClick={() => setShowAllSteps(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {DEMO_STEPS.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleGoToStep(idx)}
                    className={cn(
                      "text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between space-y-1.5",
                      isActive
                        ? "bg-blue-600/30 border-blue-400 text-white shadow-sm ring-1 ring-blue-400"
                        : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-500"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-900/80 text-blue-300 border border-slate-700">
                        {step.id < 10 ? `0${step.id}` : step.id}
                      </span>
                      <span className="text-xs font-semibold px-1.5 py-0.2 text-slate-400 truncate max-w-[80px]">
                        {step.userRoleLabel}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-100 text-xs leading-snug truncate">
                      {step.shortTitle}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {step.keyHighlight}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Demo Dock Strip */}
        <div className="px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left: Step indicator, Title, Role Tag */}
          <div className="flex items-center space-x-3 w-full md:w-auto overflow-hidden">
            {/* Step Counter Pill */}
            <div className="flex items-center space-x-1.5 shrink-0 bg-blue-600/30 border border-blue-500/50 px-2.5 py-1 rounded-xl">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono font-bold text-blue-300">
                STEP {activeStep.id} OF 12
              </span>
            </div>

            {/* Current Step Title & Persona */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                  {activeStep.title}
                </h3>
                <Badge
                  variant="outline"
                  className="hidden sm:inline-flex text-[10px] py-0 px-2 font-medium bg-slate-800 text-amber-300 border-amber-500/40 shrink-0"
                >
                  <UserCheck className="w-3 h-3 mr-1 text-amber-400" />
                  {activeStep.userName} ({activeStep.userRoleLabel})
                </Badge>
              </div>
              <p className="text-[11px] text-slate-300 truncate hidden md:block mt-0.5">
                {activeStep.talkingPoint}
              </p>
            </div>
          </div>

          {/* Right: Navigation Controls & Actions */}
          <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
            {/* View All Steps Button */}
            <button
              onClick={() => setShowAllSteps(!showAllSteps)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
              title="View Complete 12-Step Hackathon Roadmap"
            >
              <ListOrdered className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">12 Steps</span>
            </button>

            {/* Previous Step Button */}
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="p-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Next Step Button */}
            <button
              onClick={handleNext}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
              title="Proceed to Next Demo Step"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Minimize Pill Button */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Minimize Demo Bar"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
