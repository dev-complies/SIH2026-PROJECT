"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { ScaleUpDecisionView } from "@/components/scale-up/ScaleUpDecisionView";

export default function TopLevelScaleUpPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-xs text-gov-muted animate-pulse">
          Loading Statutory Scale-Up Dossier...
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
          <Link href="/gov/pilots" className="hover:text-gov-primary flex items-center">
            Pilots
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Scale-Up Decision</span>
        </div>

        <ScaleUpDecisionView pilotId="PILOT-UP-UAQ-01" />
      </div>
    </Suspense>
  );
}
