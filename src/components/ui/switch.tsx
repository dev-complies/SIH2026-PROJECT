import * as React from "react";
import { cn } from "@/utils";

export interface SwitchProps {
  id?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

export function Switch({
  id,
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  label,
  description,
  className,
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isChecked = checked !== undefined ? checked : internalChecked;
  const switchId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  const toggle = () => {
    if (disabled) return;
    const next = !isChecked;
    setInternalChecked(next);
    if (onChange) onChange(next);
  };

  return (
    <div className={cn("flex items-start justify-between space-x-3 text-left select-none", className)}>
      {(label || description) && (
        <div className="space-y-0.5 leading-none">
          {label && (
            <label
              htmlFor={switchId}
              onClick={toggle}
              className={cn(
                "text-xs font-semibold text-slate-800 cursor-pointer block",
                disabled && "cursor-not-allowed text-slate-400"
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-gov-muted">{description}</p>
          )}
        </div>
      )}

      <button
        type="button"
        role="switch"
        id={switchId}
        aria-checked={isChecked}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-accent focus-visible:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isChecked ? "bg-gov-accent" : "bg-slate-300"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
            isChecked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
