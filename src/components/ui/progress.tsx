import * as React from "react";
import { cn } from "@/utils";

export interface ProgressProps {
  value: number; // 0 - 100
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

export function Progress({
  value,
  max = 100,
  label,
  showValue = false,
  size = "default",
  variant = "default",
  className,
}: ProgressProps) {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  const sizeClasses = {
    sm: "h-1.5",
    default: "h-2.5",
    lg: "h-3.5",
  };

  const variantClasses = {
    default: "bg-gov-accent",
    success: "bg-gov-success",
    warning: "bg-gov-warning",
    danger: "bg-gov-danger",
  };

  return (
    <div className={cn("w-full space-y-1.5 text-left select-none", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-semibold text-slate-700">{label}</span>}
          {showValue && (
            <span className="font-mono font-bold text-slate-800">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-slate-200/80 shadow-inner",
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
