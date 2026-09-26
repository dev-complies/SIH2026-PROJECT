"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { GovernmentShortlistingWorkspace } from "@/components/gov/GovernmentShortlistingWorkspace";

export default function GovernmentShortlistingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-gov-muted">Loading Shortlisting Workspace...</div>}>
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-xs text-gov-muted mb-2">
          <Link href="/gov/dashboard" className="hover:text-gov-primary flex items-center">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Government Shortlisting</span>
        </div>
        <GovernmentShortlistingWorkspace />
      </div>
    </Suspense>
  );
}
