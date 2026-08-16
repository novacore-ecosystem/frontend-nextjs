"use client";

import type { PaginatedResult } from "@novacore/frontend-foundation";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/cn";
import { Checkbox } from "../ui/checkbox";
import { Pagination, type PaginationState } from "../composed/pagination";
import { EmptyState, ErrorState, SkeletonList } from "./states";

export interface DataTableColumn<T> {
  id: string;
  header: React.ReactNode;
  /** Renders a cell for the row. Defaults to reading `row[id]` when omitted. */
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export type DataTableSortDirection = "asc" | "desc";

export interface DataTableSortState {
  columnId: string;
  direction: DataTableSortDirection;
}

/** Same shape as `Pagination`'s `PaginationState` (`../composed/pagination`) — kept as its own exported name since it predates that component. */
export type DataTablePaginationState = PaginationState;

/** Adapts a backend `PaginatedResult<T>` response directly into DataTable props. */
export function fromPaginatedResult<T>(result: PaginatedResult<T>): {
  data: T[];
  pagination: DataTablePaginationState;
} {
  return {
    data: result.items,
    pagination: { pageNumber: result.pageNumber, pageSize: result.pageSize, totalRows: result.totalCount },
  };
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  emptyMessage?: string;
  sorting?: DataTableSortState;
  onSortingChange?: (sort: DataTableSortState | undefined) => void;
  pagination?: DataTablePaginationState;
  onPaginationChange?: (pagination: DataTablePaginationState) => void;
  pageSizeOptions?: number[];
  selectable?: boolean;
  selectedRowIds?: string[];
  onSelectedRowIdsChange?: (ids: string[]) => void;
  bulkActions?: React.ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  loading,
  error,
  onRetry,
  emptyMessage = "No results found.",
  sorting,
  onSortingChange,
  pagination,
  onPaginationChange,
  pageSizeOptions,
  selectable,
  selectedRowIds = [],
  onSelectedRowIdsChange,
  bulkActions,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const allSelected = selectable && data.length > 0 && data.every((row) => selectedRowIds.includes(getRowId(row)));
  const someSelected = selectable && selectedRowIds.length > 0 && !allSelected;

  function toggleSort(columnId: string) {
    if (!onSortingChange) return;
    if (sorting?.columnId !== columnId) {
      onSortingChange({ columnId, direction: "asc" });
    } else if (sorting.direction === "asc") {
      onSortingChange({ columnId, direction: "desc" });
    } else {
      onSortingChange(undefined);
    }
  }

  function toggleSelectAll() {
    if (!onSelectedRowIdsChange) return;
    onSelectedRowIdsChange(allSelected ? [] : data.map(getRowId));
  }

  function toggleSelectRow(id: string) {
    if (!onSelectedRowIdsChange) return;
    onSelectedRowIdsChange(
      selectedRowIds.includes(id) ? selectedRowIds.filter((rowId) => rowId !== id) : [...selectedRowIds, id],
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {selectable && selectedRowIds.length > 0 && bulkActions ? (
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-sm">
          <span className="text-muted-foreground">{selectedRowIds.length} selected</span>
          <div className="ml-auto flex items-center gap-2">{bulkActions}</div>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              {selectable ? (
                <th className="w-10 px-3 py-2">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
              ) : null}
              {columns.map((column) => (
                <th key={column.id} className={cn("px-3 py-2 text-left font-medium text-muted-foreground", column.className)}>
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(column.id)}
                      className="inline-flex items-center gap-1 hover:text-foreground"
                    >
                      {column.header}
                      {sorting?.columnId === column.id ? (
                        sorting.direction === "asc" ? (
                          <ArrowUp className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="p-4">
                  <SkeletonList rows={4} />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)}>
                  <ErrorState description={error} onRetry={onRetry} className="border-none" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)}>
                  <EmptyState description={emptyMessage} className="border-none" />
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const id = getRowId(row);
                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "border-b border-border last:border-0",
                      onRowClick && "cursor-pointer hover:bg-accent/50",
                    )}
                  >
                    {selectable ? (
                      <td className="w-10 px-3 py-2" onClick={(event) => event.stopPropagation()}>
                        <Checkbox checked={selectedRowIds.includes(id)} onCheckedChange={() => toggleSelectRow(id)} />
                      </td>
                    ) : null}
                    {columns.map((column) => (
                      <td key={column.id} className={cn("px-3 py-2", column.className)}>
                        {column.cell ? column.cell(row) : String((row as Record<string, unknown>)[column.id] ?? "")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && onPaginationChange ? (
        <Pagination
          pageNumber={pagination.pageNumber}
          pageSize={pagination.pageSize}
          totalRows={pagination.totalRows}
          onPaginationChange={onPaginationChange}
          pageSizeOptions={pageSizeOptions}
        />
      ) : null}
    </div>
  );
}
