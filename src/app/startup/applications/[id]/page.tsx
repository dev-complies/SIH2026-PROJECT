"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { StartupApplicationWizard } from "@/components/startup/StartupApplicationWizard";

function ApplicationDetailPageContent() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "APP-2026-UP-UAQ-041";

  return (
    <StartupApplicationWizard
      challengeId="chal-air-001"
      initialStatus="UNDER_EVALUATION"
      applicationId={id}
    />
  );
}

export default function ApplicationDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center space-y-2">
          <div className="w-6 h-6 border-2 border-gov-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gov-muted font-mono">Loading application dossier...</p>
        </div>
      }
    >
      <ApplicationDetailPageContent />
    </Suspense>
  );
}
