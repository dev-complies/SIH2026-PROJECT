import * as React from "react";
import { cn } from "@/utils";
import { ChevronDown, AlertCircle } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      children,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-slate-700 select-none"
          >
            {label}
            {props.required && <span className="text-gov-danger ml-0.5">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            id={selectId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error
                ? `${selectId}-error`
                : helperText
                ? `${selectId}-helper`
                : undefined
            }
            className={cn(
              "flex h-9 w-full appearance-none rounded-control border bg-white px-3 py-1.5 pr-8 text-sm text-gov-text transition-colors duration-150 cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-accent focus-visible:ring-offset-1",
              "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200",
              error
                ? "border-gov-danger focus-visible:ring-gov-danger/50 text-gov-danger"
                : "border-gov-border hover:border-slate-300",
              className
            )}
            ref={ref}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <span className="pointer-events-none absolute right-2.5 text-slate-500" aria-hidden="true">
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>

        {error && (
          <p id={`${selectId}-error`} role="alert" aria-live="polite" className="text-[11px] font-medium text-gov-danger flex items-center">
            <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" aria-hidden="true" />
            <span className="sr-only">Error: </span>
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${selectId}-helper`} className="text-[11px] text-gov-muted">{helperText}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
