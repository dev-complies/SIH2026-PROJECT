"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { AuditLogInterface } from "@/components/audit/AuditLogInterface";

export default function AdminAuditLogsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-xs text-gov-muted animate-pulse">
          Loading Security Audit Trail...
        </div>
      }
    >
      <div className="space-y-4">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-gov-muted mb-2">
          <Link href="/admin/dashboard" className="hover:text-gov-primary flex items-center">
            Admin Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Immutable Audit Trail</span>
        </div>

        <AuditLogInterface />
      </div>
    </Suspense>
  );
}
