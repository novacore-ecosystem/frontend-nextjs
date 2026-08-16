import * as React from "react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";

export interface FilterToolbarProps {
  /** Typically a `SearchInput`. */
  search?: React.ReactNode;
  /** Filter controls (e.g. `Select`s) rendered after `search`. */
  filters?: React.ReactNode;
  /** Shown only when `hasActiveFilters` is true. */
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  clearFiltersLabel?: string;
  /** Trailing controls, e.g. a primary "Create" button. */
  actions?: React.ReactNode;
  className?: string;
}

/** Search + filter controls + clear-all + trailing actions, in one row. Composition only — filter state and options are owned by the caller. */
export function FilterToolbar({
  search,
  filters,
  onClearFilters,
  hasActiveFilters,
  clearFiltersLabel = "Clear filters",
  actions,
  className,
}: FilterToolbarProps) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-2", className)}>
      <div className="flex flex-wrap items-center gap-2">
        {search}
        {filters}
        {hasActiveFilters && onClearFilters ? (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            {clearFiltersLabel}
          </Button>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}
