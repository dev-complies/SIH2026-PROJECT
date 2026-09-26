import * as React from "react";
import { cn } from "@/utils";
import { FolderSearch, Inbox } from "lucide-react";
import { Button } from "./button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center rounded-card border border-dashed border-gov-border bg-slate-50/50 select-none",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-slate-200 text-gov-muted shadow-2xs mb-3">
        {icon || <Inbox className="h-6 w-6 text-slate-400" />}
      </div>

      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      <p className="text-xs text-gov-muted mt-1 max-w-sm leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <div className="mt-4">
          <Button size="sm" onClick={onAction} className="bg-gov-primary hover:bg-gov-primary-hover text-xs">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
