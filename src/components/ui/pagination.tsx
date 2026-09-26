import * as React from "react";
import { cn } from "@/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1 && !totalItems) return null;

  // Build page number array
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 py-3 select-none text-xs text-gov-muted border-t border-slate-100",
        className
      )}
    >
      <div>
        {totalItems !== undefined && (
          <span>
            Showing <strong className="text-slate-800">{Math.min(totalItems, (currentPage - 1) * (itemsPerPage || 10) + 1)}</strong> to{" "}
            <strong className="text-slate-800">{Math.min(totalItems, currentPage * (itemsPerPage || 10))}</strong> of{" "}
            <strong className="text-slate-800">{totalItems}</strong> entries
          </span>
        )}
      </div>

      <div className="flex items-center space-x-1">
        <Button
          size="sm"
          variant="outline"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 px-2"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Prev
        </Button>

        <div className="flex items-center space-x-1">
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                "h-8 w-8 rounded-control text-xs font-semibold transition-colors",
                p === currentPage
                  ? "bg-gov-primary text-white shadow-2xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <Button
          size="sm"
          variant="outline"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 px-2"
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
