import * as React from "react";
import { cn } from "@/utils";
import { Calendar, AlertCircle } from "lucide-react";

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  helperText?: string;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
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

        <div className="relative flex items-center">
          <input
            type="date"
            id={inputId}
            disabled={disabled}
            className={cn(
              "flex h-9 w-full rounded-control border bg-white px-3 py-1.5 text-sm text-gov-text transition-colors duration-150 cursor-pointer",
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
          <p className="text-xs font-medium text-gov-danger flex items-center">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-xs text-gov-muted">{helperText}</p>
        )}
      </div>
    );
  }
);
DatePicker.displayName = "DatePicker";

export { DatePicker };
