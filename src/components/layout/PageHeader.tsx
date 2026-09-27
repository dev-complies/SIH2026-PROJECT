"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeVariant?: "default" | "outline" | "secondary" | "destructive" | "success" | "warning";
  metadata?: React.ReactNode;
  actions?: React.ReactNode;
  statusPill?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  badgeText,
  badgeVariant = "default",
  metadata,
  actions,
  statusPill,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`border-b border-gov-border pb-5 mb-6 text-left ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          {(badgeText || statusPill) && (
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {badgeText && (
                <Badge variant={badgeVariant} className="font-mono text-xs tracking-wide uppercase">
                  {badgeText}
                </Badge>
              )}
              {statusPill}
            </div>
          )}

          <h1 className="text-2xl font-extrabold text-gov-primary tracking-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="text-xs text-gov-muted leading-relaxed">
              {subtitle}
            </p>
          )}

          {metadata && (
            <div className="pt-1 text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
              {metadata}
            </div>
          )}
        </div>

        {actions && (
          <div className="flex items-center space-x-2 shrink-0 self-start sm:self-center">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
