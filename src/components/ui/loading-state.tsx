import * as React from "react";
import { cn } from "@/utils";
import { Loader2 } from "lucide-react";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-control bg-slate-200/80", className)}
      {...props}
    />
  );
}

export interface LoadingStateProps {
  label?: string;
  subtext?: string;
  className?: string;
}

export function LoadingState({
  label = "Loading data...",
  subtext = "Fetching records from secure government datastore",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center rounded-card border border-gov-border bg-white shadow-2xs select-none",
        className
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-gov-accent mb-3" />
      <h3 className="text-sm font-bold text-slate-800">{label}</h3>
      <p className="text-xs text-gov-muted mt-1">{subtext}</p>
    </div>
  );
}

export function TableSkeletonRows({ rows = 4, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="border-b border-slate-100">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <td key={cIdx} className="p-4">
              <Skeleton className="h-4 w-full max-w-[120px]" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
