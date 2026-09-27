"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PilotExecutiveReportView } from "@/components/pilots/PilotExecutiveReportView";

export default function PilotReportPage() {
  const router = useRouter();

  return (
    <Suspense fallback={<div className="p-8 text-xs text-gov-muted">Loading Executive Pilot Report...</div>}>
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-xs text-gov-muted mb-2 print:hidden">
          <Link href="/gov/dashboard" className="hover:text-gov-primary flex items-center">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/gov/pilots" className="hover:text-gov-primary flex items-center">
            Pilots
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Executive Pilot Report</span>
        </div>
        <PilotExecutiveReportView
          pilotId="PILOT-UP-UAQ-01"
          onBack={() => router.push("/gov/pilots")}
        />
      </div>
    </Suspense>
  );
}
