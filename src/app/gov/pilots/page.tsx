"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { PilotManagementWorkspace } from "@/components/pilots/PilotManagementWorkspace";

export default function GovernmentPilotsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-gov-muted">Loading Pilot Management Workspace...</div>}>
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-xs text-gov-muted mb-2">
          <Link href="/gov/dashboard" className="hover:text-gov-primary flex items-center">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Pilot Management</span>
        </div>
        <PilotManagementWorkspace />
      </div>
    </Suspense>
  );
}
