"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/auth/AuthContext";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ArrowLeft, ArrowRightLeft, Home, Lock } from "lucide-react";
import { ROUTE_ACCESS_MAP } from "@/auth/permissions";

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const attemptedPath = searchParams.get("attempted") || "/";
  const userRole = searchParams.get("role") || "UNKNOWN";
  const { switchRole } = useAuth();

  // Find required roles for the attempted path
  const matchedRule = ROUTE_ACCESS_MAP.find((rule) => attemptedPath.startsWith(rule.prefix));
  const requiredRoles = matchedRule ? matchedRule.allowedRoles : ["ADMIN"];

  return (
    <div className="max-w-2xl mx-auto my-12 bg-white border border-gov-border rounded-card p-8 shadow-sm">
      <div className="flex items-center space-x-3 text-gov-danger mb-4">
        <div className="p-3 bg-red-50 rounded-full border border-red-200">
          <ShieldAlert className="w-8 h-8 text-gov-danger" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gov-primary tracking-tight">
            Access Restricted (403 Forbidden)
          </h1>
          <p className="text-xs text-gov-muted">
            Public Procurement Security & Segregation of Duties Enforcement
          </p>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-control p-4 my-6 space-y-3">
        <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
          <span className="text-gov-muted font-medium">Attempted Resource:</span>
          <span className="font-mono font-semibold text-slate-800">{attemptedPath}</span>
        </div>
        <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
          <span className="text-gov-muted font-medium">Your Active Role:</span>
          <Badge variant="destructive">{userRole}</Badge>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gov-muted font-medium">Authorized Roles:</span>
          <div className="flex flex-wrap gap-1">
            {requiredRoles.map((r) => (
              <Badge key={r} variant="outline" className="text-gov-primary font-mono text-xs">
                {r}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-gov-muted leading-relaxed mb-6">
        Under government procurement governance regulations and the principle of least privilege, access to this workstation requires specific clearance. You do not have permission to view or execute operations within this domain.
      </p>

      {/* Quick Role Switcher for Testing/Demonstration */}
      <div className="bg-blue-50/60 border border-blue-200/80 rounded-control p-4 mb-6">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-900 mb-2">
          <ArrowRightLeft className="w-4 h-4 text-blue-700" />
          <span>Demo Role Switcher (Simulate Authorized Clearance):</span>
        </div>
        <p className="text-xs text-blue-800 mb-3">
          To evaluate this protected workflow, select an authorized persona below:
        </p>
        <div className="flex flex-wrap gap-2">
          {requiredRoles.map((r) => (
            <Button
              key={r}
              size="sm"
              variant="outline"
              className="border-blue-300 text-blue-900 bg-white hover:bg-blue-50 text-xs"
              onClick={() => {
                switchRole(r as UserRole);
                window.location.href = attemptedPath;
              }}
            >
              Switch to {r} & Retry
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-gov-muted">
            <Home className="w-4 h-4 mr-2" /> Return to Homepage
          </Button>
        </Link>
        <Link href="/auth/login">
          <Button variant="default" size="sm" className="bg-gov-primary hover:bg-gov-primary-hover">
            Login with Different Account
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gov-muted">Verifying authorization...</div>}>
      <UnauthorizedContent />
    </Suspense>
  );
}
