import * as React from "react";
import { cn } from "@/utils";
import { Check } from "lucide-react";

export interface StepItem {
  id: string | number;
  title: string;
  description?: string;
}

export interface StepperProps {
  steps: StepItem[];
  activeStep: number; // 0-indexed
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export function Stepper({
  steps,
  activeStep,
  onStepClick,
  className,
}: StepperProps) {
  return (
    <div className={cn("w-full py-4 select-none", className)}>
      <ol className="flex items-center w-full">
        {steps.map((step, index) => {
          const isCompleted = index < activeStep;
          const isCurrent = index === activeStep;
          const isPending = index > activeStep;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.id}
              className={cn(
                "flex items-center",
                !isLast ? "w-full" : "w-auto"
              )}
            >
              <div
                onClick={() => onStepClick && onStepClick(index)}
                className={cn(
                  "flex items-center space-x-2.5",
                  onStepClick ? "cursor-pointer" : "cursor-default"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 border",
                    isCompleted &&
                      "bg-gov-success border-gov-success text-white shadow-2xs",
                    isCurrent &&
                      "bg-gov-primary border-gov-primary text-white ring-4 ring-blue-100 shadow-2xs",
                    isPending &&
                      "bg-white border-slate-300 text-slate-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 stroke-[2.5]" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                <div className="hidden sm:block text-left">
                  <p
                    className={cn(
                      "text-xs font-semibold leading-tight",
                      isCurrent
                        ? "text-gov-primary font-bold"
                        : isCompleted
                        ? "text-slate-800"
                        : "text-slate-400"
                    )}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gov-muted truncate max-w-[120px]">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {!isLast && (
                <div
                  className={cn(
                    "h-0.5 w-full mx-3 transition-colors duration-200",
                    isCompleted ? "bg-gov-success" : "bg-slate-200"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
