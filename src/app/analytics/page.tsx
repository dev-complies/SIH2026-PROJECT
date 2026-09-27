"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { OperationalAnalyticsWorkspace } from "@/components/analytics/OperationalAnalyticsWorkspace";

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-xs text-gov-muted animate-pulse">
          Loading Operational Analytics...
        </div>
      }
    >
      <div className="space-y-4">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-gov-muted mb-2">
          <Link href="/" className="hover:text-gov-primary flex items-center">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Operational Analytics</span>
        </div>

        <OperationalAnalyticsWorkspace />
      </div>
    </Suspense>
  );
}
