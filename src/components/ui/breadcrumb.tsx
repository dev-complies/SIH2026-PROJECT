import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export function Breadcrumb({ items, showHome = true, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1.5 text-xs text-gov-muted select-none", className)}
    >
      {showHome && (
        <>
          <Link
            href="/"
            className="flex items-center text-slate-500 hover:text-gov-primary transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
        </>
      )}

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-gov-primary transition-colors text-slate-600 font-medium truncate max-w-[180px]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className={cn(
                  "truncate max-w-[200px]",
                  isLast ? "font-semibold text-gov-primary" : "text-slate-600 font-medium"
                )}
              >
                {item.label}
              </span>
            )}

            {!isLast && <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
