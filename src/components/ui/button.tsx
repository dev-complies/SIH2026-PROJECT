import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-control text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-gov-primary text-white hover:bg-gov-primary-hover active:bg-[#0D2640] shadow-2xs border border-transparent",
        accent:
          "bg-gov-accent text-white hover:bg-gov-accent-hover active:bg-[#1D4ED8] shadow-2xs border border-transparent",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 shadow-2xs",
        outline:
          "border border-gov-border bg-white text-gov-text hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 shadow-2xs",
        ghost:
          "text-gov-text hover:bg-slate-100 hover:text-gov-primary active:bg-slate-200",
        destructive:
          "bg-gov-danger text-white hover:bg-[#991B1B] active:bg-[#7F1D1D] shadow-2xs border border-transparent",
        success:
          "bg-gov-success text-white hover:bg-[#166534] active:bg-[#14532D] shadow-2xs border border-transparent",
        link: "text-gov-accent underline-offset-4 hover:underline p-0 h-auto font-normal",
      },
      size: {
        default: "h-9 px-4 py-2 text-sm",
        sm: "h-8 px-3 text-xs rounded-control",
        lg: "h-11 px-6 text-base rounded-control",
        icon: "h-9 w-9 p-0",
        "icon-sm": "h-8 w-8 p-0 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-current" />}
        {!isLoading && leftIcon && <span className="mr-2 inline-flex">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2 inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
