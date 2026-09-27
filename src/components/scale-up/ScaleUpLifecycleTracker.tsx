"use client";

import React from "react";
import { cn } from "@/utils";
import { ScaleUpLifecycleStage } from "@/database/scaleUpDatabase";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Scale,
  ShoppingBag,
  Rocket,
  Check,
} from "lucide-react";

export interface ScaleUpLifecycleTrackerProps {
  currentStage: ScaleUpLifecycleStage;
  className?: string;
  onSelectStage?: (stage: ScaleUpLifecycleStage) => void;
}

interface StageStep {
  id: ScaleUpLifecycleStage;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const STAGES: StageStep[] = [
  {
    id: "PILOT_COMPLETED",
    label: "Pilot Completed",
    sublabel: "90-Day Testbed End",
    icon: CheckCircle2,
    description: "90-day physical testbed concluded with empirical operational dataset.",
  },
  {
    id: "VALIDATION",
    label: "Validation",
    sublabel: "Third-Party Audit",
    icon: ShieldCheck,
    description: "Independent audit by TERI / IIT Kanpur confirming R² accuracy.",
  },
  {
    id: "SCALE_UP_REVIEW",
    label: "Scale-Up Review",
    sublabel: "Committee Assessment",
    icon: Scale,
    description: "Multi-dimensional review of results, costs, risks, and compliance.",
  },
  {
    id: "PROCUREMENT_REVIEW",
    label: "Procurement Review",
    sublabel: "GFR 149 / GeM Runway",
    icon: ShoppingBag,
    description: "Statutory sanction, tender exemption clearance, and budget release.",
  },
  {
    id: "SCALE",
    label: "Scale",
    sublabel: "Statewide Rollout",
    icon: Rocket,
    description: "Multi-city municipal deployment across 6 cities and 380 wards.",
  },
];

const STAGE_ORDER: Record<ScaleUpLifecycleStage, number> = {
  PILOT_COMPLETED: 0,
  VALIDATION: 1,
  SCALE_UP_REVIEW: 2,
  PROCUREMENT_REVIEW: 3,
  SCALE: 4,
};

export function ScaleUpLifecycleTracker({
  currentStage,
  className,
  onSelectStage,
}: ScaleUpLifecycleTrackerProps) {
  const currentIdx = STAGE_ORDER[currentStage] ?? 2;

  return (
    <div
      className={cn(
        "bg-white border border-gov-border rounded-card p-4 sm:p-5 shadow-2xs space-y-4",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-gov-primary bg-gov-secondary/10 px-2 py-0.5 rounded-xs border border-gov-secondary/20">
              STATUTORY SCALE-UP LIFECYCLE
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-gov-muted font-medium">
              Uttar Pradesh State Innovation Procurement Framework
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-1">
            End-to-End Scale-Up Workflow Progress
          </h2>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-mono text-xs">Current Stage:</span>
          <span className="font-bold text-gov-primary bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-control text-xs font-mono inline-flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
            {STAGES[currentIdx]?.label}
          </span>
        </div>
      </div>

      {/* Visual Stepper Bar with Subtle Depth Elevation */}
      <div className="relative pt-2 pb-2">
        <div className="hidden md:block absolute top-7 left-6 right-6 h-0.5 bg-slate-200 z-0" />
        <div
          className="hidden md:block absolute top-7 left-6 h-0.5 bg-gov-primary transition-all duration-500 z-0"
          style={{
            width: `${Math.min(100, Math.max(0, (currentIdx / (STAGES.length - 1)) * 100))}%`,
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative z-10">
          {STAGES.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const isPending = idx > currentIdx;

            return (
              <div
                key={step.id}
                onClick={() => onSelectStage?.(step.id)}
                className={cn(
                  "flex md:flex-col items-center md:items-center text-left md:text-center p-3 rounded-control border transition-all duration-200 cursor-pointer select-none",
                  isCurrent &&
                    "bg-blue-50/70 border-gov-primary shadow-xs ring-1 ring-gov-primary/30 translate-y-[-1px]",
                  isCompleted &&
                    "bg-emerald-50/40 border-emerald-200 hover:bg-emerald-50/80 hover:border-emerald-300",
                  isPending &&
                    "bg-slate-50/70 border-slate-200 opacity-70 hover:opacity-100 hover:bg-slate-100"
                )}
              >
                {/* Node Indicator with Subtle Depth */}
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0 mr-3 md:mr-0 md:mb-2 transition-transform shadow-2xs",
                    isCurrent && "bg-gov-primary text-white ring-4 ring-blue-100 shadow-md scale-105",
                    isCompleted && "bg-emerald-600 text-white shadow-xs",
                    isPending && "bg-white border-2 border-slate-300 text-slate-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center space-x-1 md:justify-center">
                    <span className="text-xs font-mono text-gov-muted uppercase">
                      Stage 0{idx + 1}
                    </span>
                    {isCompleted && (
                      <span className="text-xs font-mono text-emerald-700 bg-emerald-100 px-1 rounded-2xs font-semibold">
                        DONE
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-xs font-mono text-blue-700 bg-blue-100 px-1 rounded-2xs font-semibold animate-pulse">
                        CURRENT
                      </span>
                    )}
                  </div>

                  <h3
                    className={cn(
                      "text-xs font-bold leading-tight truncate mt-0.5",
                      isCurrent && "text-gov-primary",
                      isCompleted && "text-slate-900",
                      isPending && "text-slate-500"
                    )}
                  >
                    {step.label}
                  </h3>
                  <span className="text-xs text-slate-500 block truncate">
                    {step.sublabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
