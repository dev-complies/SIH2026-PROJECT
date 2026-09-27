"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { DocumentContractManagementWorkspace } from "@/components/documents/DocumentContractManagementWorkspace";

export default function DocumentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-gov-muted">Loading Documents & Contracts Vault...</div>}>
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-xs text-gov-muted mb-2">
          <Link href="/gov/dashboard" className="hover:text-gov-primary flex items-center">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/gov/pilots" className="hover:text-gov-primary flex items-center">
            Pilots
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Document & Contract Management</span>
        </div>
        <DocumentContractManagementWorkspace />
      </div>
    </Suspense>
  );
}
