import * as React from "react";
import { cn } from "@/utils";
import { AlertCircle } from "lucide-react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, disabled, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 select-none"
          >
            {label}
            {props.required && <span className="text-gov-danger ml-0.5">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            className={cn(
              "flex min-h-[90px] w-full rounded-control border bg-white px-3 py-2 text-sm text-gov-text placeholder:text-slate-400 transition-colors duration-150 resize-y",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-accent focus-visible:ring-offset-1",
              "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200",
              error
                ? "border-gov-danger focus-visible:ring-gov-danger/50 text-gov-danger"
                : "border-gov-border hover:border-slate-300",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>

        {error && (
          <p id={`${inputId}-error`} role="alert" aria-live="polite" className="text-xs font-medium text-gov-danger flex items-center">
            <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" aria-hidden="true" />
            <span className="sr-only">Error: </span>
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-xs text-gov-muted">{helperText}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
