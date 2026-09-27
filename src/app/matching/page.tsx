"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { AIMatchingWorkspace } from "@/components/matching/AIMatchingWorkspace";

export default function MatchingPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-xs text-gov-muted animate-pulse">
          Loading AI-Assisted Matching Advisory Engine...
        </div>
      }
    >
      <div className="space-y-4">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center space-x-2 text-xs text-gov-muted mb-2">
          <Link href="/" className="hover:text-gov-primary flex items-center">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">AI-Assisted Matching</span>
        </div>

        <AIMatchingWorkspace />
      </div>
    </Suspense>
  );
}
