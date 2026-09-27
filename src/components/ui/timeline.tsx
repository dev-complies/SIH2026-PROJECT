import * as React from "react";
import { cn, formatDate } from "@/utils";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export interface TimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  description?: string;
  actor?: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  status?: "completed" | "current" | "pending" | "danger";
}

export interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function Timeline({ events, className }: TimelineProps) {
  return (
    <div className={cn("relative pl-6 space-y-6 text-left select-none", className)}>
      {/* Continuous vertical line */}
      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200" />

      {events.map((evt, idx) => {
        const isCompleted = evt.status === "completed" || !evt.status;
        const isCurrent = evt.status === "current";
        const isDanger = evt.status === "danger";

        return (
          <div key={evt.id || idx} className="relative group">
            {/* Timeline node */}
            <div
              className={cn(
                "absolute -left-[23px] top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white transition-all shadow-2xs",
                isCompleted && "border-gov-success text-gov-success",
                isCurrent && "border-gov-accent text-gov-accent ring-2 ring-blue-100",
                isDanger && "border-gov-danger text-gov-danger",
                evt.status === "pending" && "border-slate-300 text-slate-300"
              )}
            >
              {evt.icon || (
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    isCompleted && "bg-gov-success",
                    isCurrent && "bg-gov-accent animate-pulse",
                    isDanger && "bg-gov-danger",
                    evt.status === "pending" && "bg-slate-300"
                  )}
                />
              )}
            </div>

            {/* Event content */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {evt.title}
                </span>
                <span className="text-xs font-mono text-gov-muted">
                  {formatDate(evt.timestamp)}
                </span>
              </div>

              {evt.description && (
                <p className="text-xs text-slate-600 leading-normal">
                  {evt.description}
                </p>
              )}

              <div className="flex items-center space-x-2 pt-0.5">
                {evt.actor && (
                  <span className="text-xs font-medium text-slate-500">
                    By: <strong className="text-slate-700">{evt.actor}</strong>
                  </span>
                )}
                {evt.badge && <div>{evt.badge}</div>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
