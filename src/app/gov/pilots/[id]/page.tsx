"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PilotManagementWorkspace } from "@/components/pilots/PilotManagementWorkspace";

export default function GovernmentPilotDetailPage() {
  const params = useParams();
  const pilotId = params?.id as string;

  return (
    <Suspense fallback={<div className="p-8 text-xs text-gov-muted">Loading Pilot Workspace...</div>}>
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-xs text-gov-muted mb-2">
          <Link href="/gov/dashboard" className="hover:text-gov-primary flex items-center">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/gov/pilots" className="hover:text-gov-primary flex items-center">
            Pilots
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">{pilotId || "PILOT-UP-UAQ-01"}</span>
        </div>
        <PilotManagementWorkspace />
      </div>
    </Suspense>
  );
}
