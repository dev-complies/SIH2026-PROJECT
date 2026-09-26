import * as React from "react";
import { cn } from "@/utils";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "./button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  errorCode?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Unable to process request",
  message = "An unexpected error occurred while communicating with the platform API.",
  errorCode,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-red-200 bg-red-50/50 p-6 text-left space-y-3 select-none",
        className
      )}
    >
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-full bg-red-100 border border-red-200 text-gov-danger shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-red-950">{title}</h3>
            {errorCode && (
              <span className="text-[10px] font-mono font-semibold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                CODE: {errorCode}
              </span>
            )}
          </div>
          <p className="text-xs text-red-800 mt-1 leading-relaxed">{message}</p>
        </div>
      </div>

      {onRetry && (
        <div className="pt-2 border-t border-red-200/60 flex justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            className="border-red-300 text-red-900 bg-white hover:bg-red-50 text-xs h-8"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Retry Operation
          </Button>
        </div>
      )}
    </div>
  );
}
