"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { useTranslation } from "../../i18n";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";
import { Select } from "../ui/select";

/**
 * One-based to match `@novacore/frontend-foundation`'s `PaginatedResult` /
 * `PAGINATION_DEFAULTS` convention (the canonical shape every NovaCore backend list
 * endpoint returns) — avoids an off-by-one translation layer between API responses and
 * table state at every call site.
 */
export interface PaginationState {
  pageNumber: number;
  pageSize: number;
  totalRows: number;
}

export interface PaginationProps extends PaginationState {
  onPaginationChange: (state: PaginationState) => void;
  pageSizeOptions?: number[];
  className?: string;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

/** first, last, current ± 1, `"ellipsis"` for the gaps — collapses to every page when the total is small. */
function getPageWindow(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const keep = new Set<number>([1, total, current - 1, current, current + 1]);
  const sorted = [...keep].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  let previous = 0;
  for (const page of sorted) {
    if (previous && page - previous > 1) result.push("ellipsis");
    result.push(page);
    previous = page;
  }
  return result;
}

/** Reusable pagination: prev/next, numbered pages with ellipsis, page-size selector, and a "Showing X–Y of Z" range label. Emits every change (page or page size) through one callback — page-size changes reset to page 1. Never calls an API itself. */
export function Pagination({
  pageNumber,
  pageSize,
  totalRows,
  onPaginationChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  className,
}: PaginationProps) {
  const { t } = useTranslation();
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const pages = getPageWindow(pageNumber, pageCount);
  const startRow = totalRows === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const endRow = Math.min(pageNumber * pageSize, totalRows);

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground", className)}>
      <span>{t("pagination.showing", { from: startRow, to: endRow, total: totalRows })}</span>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap">{t("pagination.rowsPerPage")}</span>
          <Select
            className="h-8 w-[76px]"
            value={String(pageSize)}
            onValueChange={(value) => onPaginationChange({ pageNumber: 1, pageSize: Number(value), totalRows })}
            options={pageSizeOptions.map((size) => ({ value: String(size), label: String(size) }))}
          />
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            aria-label={t("pagination.previous")}
            disabled={pageNumber <= 1}
            onClick={() => onPaginationChange({ pageNumber: pageNumber - 1, pageSize, totalRows })}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {pages.map((page, index) =>
            page === "ellipsis" ? (
              <span key={`ellipsis-${index}`} className="px-1.5">
                …
              </span>
            ) : (
              <Button
                key={page}
                variant={page === pageNumber ? "primary" : "outline"}
                size="icon"
                onClick={() => onPaginationChange({ pageNumber: page, pageSize, totalRows })}
              >
                {page}
              </Button>
            ),
          )}
          <Button
            variant="outline"
            size="icon"
            aria-label={t("pagination.next")}
            disabled={pageNumber >= pageCount}
            onClick={() => onPaginationChange({ pageNumber: pageNumber + 1, pageSize, totalRows })}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
