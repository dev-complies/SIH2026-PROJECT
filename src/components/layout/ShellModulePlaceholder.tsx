"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Compass,
  FileText,
  Award,
  Activity,
  CreditCard,
  ShieldCheck,
  Sparkles,
  BarChart3,
  FolderLock,
  ScrollText,
  Inbox,
  History,
  Building2,
  Users,
  Settings,
  ArrowRight,
  Info,
} from "lucide-react";

interface ShellModulePlaceholderProps {
  moduleName: string;
  role: string;
  description: string;
  itemCount?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

export function ShellModulePlaceholder({
  moduleName,
  role,
  description,
  itemCount,
  actionLabel,
  onAction,
  children,
}: ShellModulePlaceholderProps) {
  return (
    <div className="space-y-6 text-left animate-in fade-in duration-150">
      {/* Module Banner */}
      <div className="bg-white border border-gov-border rounded-card p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 mb-1">
            <Badge variant="outline" className="font-mono text-[10px] text-gov-accent border-blue-300 bg-blue-50/60">
              {role} WORKSPACE MODULE
            </Badge>
            {itemCount && (
              <Badge variant="default" className="bg-gov-primary font-mono text-[10px]">
                {itemCount}
              </Badge>
            )}
          </div>
          <h2 className="text-xl font-bold text-gov-primary tracking-tight">
            {moduleName}
          </h2>
          <p className="text-xs text-gov-muted max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>

        {actionLabel && (
          <div className="shrink-0">
            <Button
              size="sm"
              onClick={onAction}
              className="bg-gov-primary text-xs h-9 font-semibold"
            >
              {actionLabel} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Module Body Content or State Placeholder */}
      {children ? (
        children
      ) : (
        <div className="border border-dashed border-gov-border bg-slate-50/70 rounded-card p-10 flex flex-col items-center justify-center text-center space-y-3">
          <div className="p-3 rounded-full bg-blue-50 border border-blue-200 text-gov-accent">
            <Info className="w-6 h-6" />
          </div>
          <div className="max-w-md space-y-1">
            <h3 className="text-sm font-bold text-slate-800">
              {moduleName} Module Active
            </h3>
            <p className="text-xs text-gov-muted leading-relaxed">
              This module is provisioned with role-based data isolation for <strong>{role}</strong>. Detailed workflow controllers will be populated in subsequent development phases.
            </p>
          </div>
          <div className="flex items-center space-x-3 pt-2">
            <Link href="?tab=overview">
              <Button size="sm" variant="outline" className="text-xs h-8">
                Return to Overview
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
