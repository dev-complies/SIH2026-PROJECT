import * as React from "react";
import { cn } from "@/utils";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  className?: string;
  disabled?: boolean;
}

export function RadioGroup({
  name,
  value,
  defaultValue,
  onChange,
  options,
  className,
  disabled,
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const selectedValue = value !== undefined ? value : internalValue;

  const handleChange = (val: string) => {
    setInternalValue(val);
    if (onChange) onChange(val);
  };

  return (
    <div className={cn("space-y-2.5", className)} role="radiogroup">
      {options.map((opt) => {
        const optionId = `${name}-${opt.value}`;
        const isChecked = selectedValue === opt.value;
        const isDisabled = disabled || opt.disabled;

        return (
          <div key={opt.value} className="flex items-start space-x-2.5 text-left select-none">
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                type="radio"
                id={optionId}
                name={name}
                value={opt.value}
                checked={isChecked}
                disabled={isDisabled}
                onChange={() => handleChange(opt.value)}
                className={cn(
                  "peer h-4 w-4 appearance-none rounded-full border border-gov-border bg-white transition-all duration-150 cursor-pointer",
                  "checked:border-gov-accent",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-accent focus-visible:ring-offset-1",
                  "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:border-slate-300"
                )}
              />
              <span className="pointer-events-none absolute h-2 w-2 rounded-full bg-gov-accent opacity-0 transition-opacity peer-checked:opacity-100" />
            </div>

            <div className="space-y-0.5 leading-none">
              <label
                htmlFor={optionId}
                className={cn(
                  "text-xs font-semibold text-slate-800 cursor-pointer",
                  isDisabled && "cursor-not-allowed text-slate-400"
                )}
              >
                {opt.label}
              </label>
              {opt.description && (
                <p className="text-[11px] text-gov-muted">{opt.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
