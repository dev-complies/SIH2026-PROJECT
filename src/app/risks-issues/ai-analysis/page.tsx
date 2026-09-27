"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { AIRiskAnalysisWorkspace } from "@/components/risks/AIRiskAnalysisWorkspace";

export default function AIRiskAnalysisPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-xs text-gov-muted animate-pulse">
          Synthesizing AI Risk Analysis from Challenge, Startup & Pilot Telemetry...
        </div>
      }
    >
      <div className="space-y-4">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center space-x-2 text-xs text-gov-muted mb-2">
          <Link href="/gov/dashboard" className="hover:text-gov-primary flex items-center">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/risks-issues" className="hover:text-gov-primary flex items-center">
            Risk & Issue Management
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">AI-Assisted Risk Analysis</span>
        </div>

        <AIRiskAnalysisWorkspace />
      </div>
    </Suspense>
  );
}
