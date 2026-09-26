import * as React from "react";
import { cn } from "@/utils";
import { Check } from "lucide-react";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, disabled, checked, onChange, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex items-start space-x-2.5 text-left select-none">
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            type="checkbox"
            id={inputId}
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            className={cn(
              "peer h-4 w-4 appearance-none rounded-[4px] border border-gov-border bg-white transition-all duration-150 cursor-pointer",
              "checked:border-gov-accent checked:bg-gov-accent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-accent focus-visible:ring-offset-1",
              "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:border-slate-300",
              className
            )}
            ref={ref}
            {...props}
          />
          <Check className="pointer-events-none absolute h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
        </div>

        {(label || description) && (
          <div className="space-y-0.5 leading-none">
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  "text-xs font-semibold text-slate-800 cursor-pointer",
                  disabled && "cursor-not-allowed text-slate-400"
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-[11px] text-gov-muted">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
