"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

function BreadcrumbsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get("tab");

  // Format path segments
  const segments = pathname.split("/").filter(Boolean);

  const getSegmentLabel = (seg: string): string => {
    switch (seg) {
      case "gov":
        return "Government Desk";
      case "startup":
        return "Startup Workspace";
      case "expert":
        return "Expert Review";
      case "validator":
        return "Validation Studio";
      case "admin":
        return "Administration";
      case "procurement":
        return "Procurement & Treasury";
      case "dashboard":
        return "Overview";
      case "challenges":
        return "Challenges";
      case "proven-solutions":
        return "Proven Solutions";
      case "design-system":
        return "Design System";
      default:
        return seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
    }
  };

  const getTabLabel = (tab: string): string => {
    return tab.charAt(0).toUpperCase() + tab.slice(1).replace(/-/g, " ");
  };

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-gov-muted">
      <Link
        href="/"
        className="flex items-center text-slate-500 hover:text-gov-primary transition-colors"
        title="Public Home"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {segments.map((seg, idx) => {
        const isLast = idx === segments.length - 1 && !currentTab;
        const href = "/" + segments.slice(0, idx + 1).join("/");
        const label = getSegmentLabel(seg);

        return (
          <React.Fragment key={seg + idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-slate-800 truncate max-w-[140px] sm:max-w-xs">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-gov-primary text-slate-600 transition-colors truncate max-w-[120px]"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}

      {currentTab && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-semibold text-gov-primary truncate max-w-[160px]">
            {getTabLabel(currentTab)}
          </span>
        </>
      )}
    </nav>
  );
}

export function Breadcrumbs() {
  return (
    <Suspense fallback={<div className="h-4 w-32 bg-slate-100 rounded" />}>
      <BreadcrumbsContent />
    </Suspense>
  );
}
