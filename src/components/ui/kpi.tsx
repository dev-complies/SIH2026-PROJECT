import * as React from "react";
import { cn } from "@/utils";
import { TrendingUp, TrendingDown, Minus, ShieldCheck, Activity } from "lucide-react";
import { Progress } from "./progress";

export interface KPICardProps {
  title: string;
  metricCode?: string;
  currentValue: number;
  baselineValue?: number;
  targetValue?: number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  dataSource?: string;
  isVerified?: boolean;
  className?: string;
}

export function KPICard({
  title,
  metricCode,
  currentValue,
  baselineValue,
  targetValue,
  unit = "%",
  trend = "up",
  trendLabel,
  dataSource,
  isVerified = false,
  className,
}: KPICardProps) {
  // Calculate achievement percentage if baseline and target exist
  let achievementPct = 0;
  if (baselineValue !== undefined && targetValue !== undefined && targetValue !== baselineValue) {
    achievementPct = Math.round(
      ((currentValue - baselineValue) / (targetValue - baselineValue)) * 100
    );
  }

  return (
    <div
      className={cn(
        "rounded-card border border-gov-border bg-white p-5 shadow-2xs hover:border-slate-300 transition-all text-left",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          {metricCode && (
            <span className="text-xs font-mono text-gov-muted uppercase block">
              {metricCode}
            </span>
          )}
          <h3 className="text-xs font-bold text-slate-800 leading-snug">{title}</h3>
        </div>

        {isVerified && (
          <span
            title="Empirically verified by Independent Validator"
            className="inline-flex items-center text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0"
          >
            <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" /> Verified
          </span>
        )}
      </div>

      {/* Main KPI Numbers */}
      <div className="flex items-baseline space-x-2 my-2">
        {baselineValue !== undefined && (
          <span
            title={`Baseline: ${baselineValue}${unit}`}
            className="text-lg font-semibold text-slate-400 line-through select-none"
          >
            {baselineValue}{unit}
          </span>
        )}
        <span className="text-3xl font-extrabold text-gov-primary tracking-tight">
          {currentValue}{unit}
        </span>

        {targetValue !== undefined && (
          <span className="text-xs font-medium text-gov-muted ml-1">
            / Target: <strong className="text-slate-700">{targetValue}{unit}</strong>
          </span>
        )}
      </div>

      {/* Trend Indicator */}
      {(trendLabel || trend) && (
        <div className="flex items-center space-x-1.5 text-xs mb-3">
          {trend === "up" && (
            <span className="inline-flex items-center text-emerald-700 font-bold">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              {trendLabel || "Trending Positive"}
            </span>
          )}
          {trend === "down" && (
            <span className="inline-flex items-center text-gov-danger font-bold">
              <TrendingDown className="w-3.5 h-3.5 mr-1" />
              {trendLabel || "Below Benchmark"}
            </span>
          )}
          {trend === "neutral" && (
            <span className="inline-flex items-center text-gov-muted font-medium">
              <Minus className="w-3.5 h-3.5 mr-1" />
              {trendLabel || "Stable"}
            </span>
          )}
        </div>
      )}

      {/* Target Progress Bar */}
      {targetValue !== undefined && (
        <div className="pt-2 border-t border-slate-100">
          <Progress
            value={currentValue >= targetValue ? 100 : Math.max(0, achievementPct)}
            variant={currentValue >= targetValue ? "success" : "default"}
            size="sm"
            label="Target Realization"
            showValue
          />
        </div>
      )}

      {dataSource && (
        <div className="mt-3 flex items-center text-xs text-gov-muted border-t border-slate-100 pt-2 truncate">
          <Activity className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
          <span className="truncate">Source: {dataSource}</span>
        </div>
      )}
    </div>
  );
}
