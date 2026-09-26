import * as React from "react";
import { cn } from "@/utils";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileCheck,
  TrendingUp,
  AlertTriangle,
  PauseCircle,
  Ban,
  DollarSign,
  Award,
} from "lucide-react";

export type GovStatus =
  | "DRAFT"
  | "UNDER_REVIEW"
  | "PUBLISHED"
  | "APPLICATIONS_CLOSED"
  | "SUBMITTED"
  | "UNDER_ELIGIBILITY"
  | "ELIGIBLE"
  | "CONDITIONALLY_ELIGIBLE"
  | "INELIGIBLE"
  | "UNDER_EVALUATION"
  | "SHORTLISTED"
  | "NOT_SELECTED"
  | "PILOT_AWARDED"
  | "PILOT_ACTIVE"
  | "ACTIVE"
  | "PAUSED"
  | "UNDER_VALIDATION"
  | "COMPLETED"
  | "OVERDUE"
  | "APPROVED"
  | "REJECTED"
  | "VALIDATED"
  | "PARTIALLY_VALIDATED"
  | "NOT_VALIDATED"
  | "PENDING_APPROVAL"
  | "PAID"
  | "SCALE"
  | "CLOSE";

interface StatusConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
  dotColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STATUS_CONFIGS: Record<string, StatusConfig> = {
  // Green / Success states
  PUBLISHED: {
    label: "Published",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    dotColor: "bg-emerald-600",
    icon: CheckCircle2,
  },
  ELIGIBLE: {
    label: "Eligible",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    dotColor: "bg-emerald-600",
    icon: CheckCircle2,
  },
  APPROVED: {
    label: "Approved",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    dotColor: "bg-emerald-600",
    icon: CheckCircle2,
  },
  VALIDATED: {
    label: "Validated",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    dotColor: "bg-emerald-600",
    icon: Award,
  },
  PAID: {
    label: "Paid",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    dotColor: "bg-emerald-600",
    icon: DollarSign,
  },
  SCALE: {
    label: "Scale Approved",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    dotColor: "bg-emerald-600",
    icon: TrendingUp,
  },

  // Blue / Active states
  ACTIVE: {
    label: "Active Pilot",
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
    dotColor: "bg-blue-600",
    icon: TrendingUp,
  },
  PILOT_ACTIVE: {
    label: "Active Pilot",
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
    dotColor: "bg-blue-600",
    icon: TrendingUp,
  },
  SHORTLISTED: {
    label: "Shortlisted",
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
    dotColor: "bg-blue-600",
    icon: FileCheck,
  },
  PILOT_AWARDED: {
    label: "Pilot Awarded",
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
    dotColor: "bg-blue-600",
    icon: Award,
  },

  // Amber / Pending / Warning states
  DRAFT: {
    label: "Draft",
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    dotColor: "bg-slate-400",
    icon: Clock,
  },
  UNDER_REVIEW: {
    label: "Under Review",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    dotColor: "bg-amber-500",
    icon: Clock,
  },
  UNDER_ELIGIBILITY: {
    label: "Under Screening",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    dotColor: "bg-amber-500",
    icon: Clock,
  },
  UNDER_EVALUATION: {
    label: "In Evaluation",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    dotColor: "bg-amber-500",
    icon: Clock,
  },
  PENDING_APPROVAL: {
    label: "Pending Approval",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    dotColor: "bg-amber-500",
    icon: Clock,
  },
  CONDITIONALLY_ELIGIBLE: {
    label: "Conditionally Eligible",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    dotColor: "bg-amber-500",
    icon: AlertTriangle,
  },
  PARTIALLY_VALIDATED: {
    label: "Partially Validated",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    dotColor: "bg-amber-500",
    icon: AlertTriangle,
  },
  PAUSED: {
    label: "Paused",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    dotColor: "bg-amber-500",
    icon: PauseCircle,
  },

  // Red / Danger / Inactive states
  INELIGIBLE: {
    label: "Ineligible",
    bg: "bg-red-50",
    text: "text-red-800",
    border: "border-red-200",
    dotColor: "bg-red-600",
    icon: XCircle,
  },
  REJECTED: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-800",
    border: "border-red-200",
    dotColor: "bg-red-600",
    icon: XCircle,
  },
  NOT_VALIDATED: {
    label: "Not Validated",
    bg: "bg-red-50",
    text: "text-red-800",
    border: "border-red-200",
    dotColor: "bg-red-600",
    icon: Ban,
  },
  OVERDUE: {
    label: "Overdue",
    bg: "bg-red-50",
    text: "text-red-800",
    border: "border-red-200",
    dotColor: "bg-red-600",
    icon: AlertCircle,
  },
  CLOSE: {
    label: "Closed / Archived",
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
    dotColor: "bg-slate-400",
    icon: Ban,
  },
};

export interface StatusBadgeProps {
  status: GovStatus | string;
  size?: "sm" | "default";
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  size = "default",
  showIcon = true,
  className,
}: StatusBadgeProps) {
  const config = STATUS_CONFIGS[status.toUpperCase()] || {
    label: status.replace(/_/g, " "),
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    dotColor: "bg-slate-400",
    icon: Clock,
  };

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium select-none font-sans",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span
        className={cn(
          "rounded-full mr-1.5 shrink-0",
          size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2",
          config.dotColor
        )}
      />
      {showIcon && (
        <Icon className={cn("mr-1 shrink-0", size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5")} />
      )}
      <span>{config.label}</span>
    </span>
  );
}
