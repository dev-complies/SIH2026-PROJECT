"use client";

import React, { Suspense } from "react";
import { ValidatorWorkspace } from "@/components/validator/ValidatorWorkspace";

export default function ValidatorDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-xs text-gov-muted">
          Loading Independent Validation Studio...
        </div>
      }
    >
      <ValidatorWorkspace pilotId="PILOT-UP-UAQ-01" />
    </Suspense>
  );
}
