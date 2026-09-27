import * as React from "react";
import { cn } from "@/utils";

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actionSlot?: React.ReactNode;
  footerNotes?: string;
}

export function ChartContainer({
  title,
  description,
  actionSlot,
  footerNotes,
  children,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-gov-border bg-white p-5 shadow-2xs text-left space-y-4",
        className
      )}
      {...props}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
        <div>
          <h3 className="text-sm font-bold text-gov-primary leading-tight">{title}</h3>
          {description && <p className="text-xs text-gov-muted mt-0.5">{description}</p>}
        </div>

        {actionSlot && <div className="flex items-center space-x-2 shrink-0">{actionSlot}</div>}
      </div>

      <div className="w-full min-h-[260px] flex items-center justify-center">
        {children}
      </div>

      {footerNotes && (
        <div className="border-t border-slate-100 pt-2 text-xs text-gov-muted flex items-center justify-between">
          <span>{footerNotes}</span>
          <span className="font-mono text-xs text-slate-400">Timescale Real Data</span>
        </div>
      )}
    </div>
  );
}
