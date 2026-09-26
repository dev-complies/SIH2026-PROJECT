"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { KpiTrackingWorkspace } from "@/components/kpi/KpiTrackingWorkspace";

export default function KpisPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-gov-muted">Loading KPI Tracking System...</div>}>
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-xs text-gov-muted mb-2">
          <Link href="/gov/dashboard" className="hover:text-gov-primary flex items-center">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/pilots" className="hover:text-gov-primary flex items-center">
            Pilots
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Real-Time KPI Tracking System</span>
        </div>
        <KpiTrackingWorkspace />
      </div>
    </Suspense>
  );
}
