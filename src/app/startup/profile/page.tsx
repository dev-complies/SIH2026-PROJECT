"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { StartupCapabilityProfile } from "@/components/startup/StartupCapabilityProfile";

function StartupProfilePageContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams?.get("challengeId") || undefined;

  return <StartupCapabilityProfile challengeId={challengeId} isEditable={true} />;
}

export default function StartupProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center space-y-2">
          <div className="w-6 h-6 border-2 border-gov-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gov-muted font-mono">Loading startup capability profile...</p>
        </div>
      }
    >
      <StartupProfilePageContent />
    </Suspense>
  );
}
