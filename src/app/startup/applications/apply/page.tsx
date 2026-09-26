"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { StartupApplicationWizard } from "@/components/startup/StartupApplicationWizard";

function StartupApplyPageContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams?.get("challengeId") || "chal-air-001";

  return <StartupApplicationWizard challengeId={challengeId} initialStatus="DRAFT" />;
}

export default function StartupApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center space-y-2">
          <div className="w-6 h-6 border-2 border-gov-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gov-muted font-mono">Loading application formulation wizard...</p>
        </div>
      }
    >
      <StartupApplyPageContent />
    </Suspense>
  );
}
