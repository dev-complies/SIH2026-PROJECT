"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { AuditLogInterface } from "@/components/audit/AuditLogInterface";

export default function AuditLogsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-xs text-gov-muted animate-pulse">
          Loading Immutable Audit Log System...
        </div>
      }
    >
      <div className="space-y-4">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-gov-muted mb-2">
          <Link href="/" className="hover:text-gov-primary flex items-center">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Audit Logs</span>
        </div>

        <AuditLogInterface />
      </div>
    </Suspense>
  );
}
