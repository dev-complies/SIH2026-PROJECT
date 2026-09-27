import * as React from "react";
import { cn } from "@/utils";
import { AlertCircle } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      error,
      helperText,
      leftIcon,
      rightIcon,
      label,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
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

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-gov-muted pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}

          <input
            type={type}
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
              "flex h-9 w-full rounded-control border bg-white px-3 py-1.5 text-sm text-gov-text placeholder:text-slate-400 transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-accent focus-visible:ring-offset-1",
              "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200",
              error
                ? "border-gov-danger focus-visible:ring-gov-danger/50 text-gov-danger pr-9"
                : "border-gov-border hover:border-slate-300",
              leftIcon && "pl-9",
              rightIcon && !error && "pr-9",
              className
            )}
            ref={ref}
            {...props}
          />

          {error ? (
            <span className="absolute right-3 text-gov-danger pointer-events-none" aria-hidden="true">
              <AlertCircle className="w-4 h-4" />
            </span>
          ) : (
            rightIcon && (
              <span className="absolute right-3 text-gov-muted pointer-events-none" aria-hidden="true">
                {rightIcon}
              </span>
            )
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} role="alert" aria-live="polite" className="text-[11px] font-medium text-gov-danger flex items-center">
            <span className="sr-only">Error: </span>
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-[11px] text-gov-muted">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
