"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { EligibilityReviewWorkspace } from "@/components/gov/EligibilityReviewWorkspace";

export default function EligibilityReviewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-gov-muted">Loading Eligibility Workspace...</div>}>
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-xs text-gov-muted mb-2">
          <Link href="/gov/dashboard" className="hover:text-gov-primary flex items-center">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Eligibility Review</span>
        </div>
        <EligibilityReviewWorkspace />
      </div>
    </Suspense>
  );
}
