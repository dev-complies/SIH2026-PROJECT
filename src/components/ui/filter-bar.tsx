"use client";

import * as React from "react";
import { cn } from "@/utils";
import { Search, X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { Badge } from "./badge";

export interface FilterOption {
  key: string;
  label: string;
  options: Array<{ value: string; label: string }>;
}

export interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  filters?: FilterOption[];
  activeFilters?: Record<string, string>;
  onFilterChange?: (filterKey: string, val: string) => void;
  onResetFilters?: () => void;
  className?: string;
}

export function FilterBar({
  searchPlaceholder = "Search challenges, pilots, or technologies...",
  searchValue = "",
  onSearchChange,
  filters = [],
  activeFilters = {},
  onFilterChange,
  onResetFilters,
  className,
}: FilterBarProps) {
  const activeCount = Object.values(activeFilters).filter(Boolean).length + (searchValue ? 1 : 0);

  return (
    <div className={cn("w-full space-y-3 select-none text-left", className)}>
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gov-muted pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="flex h-9 w-full rounded-control border border-gov-border bg-white pl-9 pr-8 text-xs text-gov-text placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-accent"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange && onSearchChange("")}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {filters.map((f) => (
            <select
              key={f.key}
              value={activeFilters[f.key] || ""}
              onChange={(e) => onFilterChange && onFilterChange(f.key, e.target.value)}
              className="h-9 px-2.5 text-xs rounded-control border border-gov-border bg-white text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-accent cursor-pointer"
            >
              <option value="">{f.label}: All</option>
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}

          {activeCount > 0 && onResetFilters && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onResetFilters}
              className="h-9 px-2 text-xs text-gov-muted hover:text-gov-danger"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-medium text-gov-muted mr-1">Active Filters:</span>
          {searchValue && (
            <Badge variant="secondary" className="text-xs pl-2 pr-1 py-0.5 space-x-1">
              <span>Keyword: &quot;{searchValue}&quot;</span>
              <button onClick={() => onSearchChange && onSearchChange("")} className="hover:text-gov-danger">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {Object.entries(activeFilters).map(([k, v]) => {
            if (!v) return null;
            const filterDef = filters.find((f) => f.key === k);
            const optDef = filterDef?.options.find((o) => o.value === v);
            return (
              <Badge key={k} variant="secondary" className="text-xs pl-2 pr-1 py-0.5 space-x-1">
                <span>
                  {filterDef?.label}: <strong>{optDef?.label || v}</strong>
                </span>
                <button
                  onClick={() => onFilterChange && onFilterChange(k, "")}
                  className="hover:text-gov-danger"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
