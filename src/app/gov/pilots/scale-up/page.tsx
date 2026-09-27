"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { ScaleUpDecisionView } from "@/components/scale-up/ScaleUpDecisionView";

export default function GovernmentPilotScaleUpPage() {
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
          <Link href="/gov/dashboard" className="hover:text-gov-primary flex items-center">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/gov/pilots" className="hover:text-gov-primary flex items-center">
            Pilots
          </Link>
          <span>/</span>
          <Link href="/gov/pilots/PILOT-UP-UAQ-01" className="hover:text-gov-primary flex items-center">
            PILOT-UP-UAQ-01
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Scale-Up Decision</span>
        </div>

        <ScaleUpDecisionView pilotId="PILOT-UP-UAQ-01" />
      </div>
    </Suspense>
  );
}
