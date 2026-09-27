"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { AIProposalSummarizer } from "@/components/proposals/AIProposalSummarizer";

export default function GovProposalSummaryPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-xs text-gov-muted animate-pulse">
          Loading Technical Proposal Review...
        </div>
      }
    >
      <div className="space-y-4">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center space-x-2 text-xs text-gov-muted mb-2">
          <Link href="/gov/dashboard" className="hover:text-gov-primary flex items-center">
            Government Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">AI-Assisted Proposal Summary</span>
        </div>

        <AIProposalSummarizer />
      </div>
    </Suspense>
  );
}
