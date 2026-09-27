"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { NotificationWorkspace } from "@/components/notifications/NotificationWorkspace";

export default function NotificationsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-xs text-gov-muted animate-pulse">
          Loading Contextual Notification Center...
        </div>
      }
    >
      <div className="space-y-4">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs text-gov-muted mb-2">
          <Link href="/" className="hover:text-gov-primary flex items-center">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Notification Center</span>
        </div>

        <NotificationWorkspace />
      </div>
    </Suspense>
  );
}
