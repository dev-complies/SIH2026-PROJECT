"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { ProvenSolutionsLibrary } from "@/components/solutions/ProvenSolutionsLibrary";

export default function GovernmentProvenSolutionsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-xs text-gov-muted animate-pulse">
          Loading Proven Solutions Library...
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
          <span className="text-slate-800 font-semibold">Proven Solutions Library</span>
        </div>

        <ProvenSolutionsLibrary />
      </div>
    </Suspense>
  );
}
