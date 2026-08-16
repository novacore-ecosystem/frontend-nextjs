"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { CriteriaSort } from "@novacore/frontend-foundation";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";
import { Select } from "../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

export interface SortFieldConfig {
  field: string;
  label: string;
  /** Also exposed as a clickable single-field sort on a visible `DataTable` column header — independent of whether it's included here. A field can be `quickSort` only, advanced-only, or both. */
  quickSort?: boolean;
}

export interface AdvancedSortProps {
  fields: SortFieldConfig[];
  /** Controlled — the currently *applied* multi-field sort (drives the trigger's active count). */
  value: CriteriaSort[];
  onApply: (sorts: CriteriaSort[]) => void;
  triggerLabel?: string;
  className?: string;
}

/**
 * Multi-field sort builder — produces real `CriteriaSort[]` from
 * `@novacore/frontend-foundation`'s search contract (already an array on the wire, so this
 * is not inventing a shape). Distinct from `DataTable`'s single-column header sort
 * (`sortable`/`onSortingChange`) — this is the "advanced" mechanism that can include fields
 * with no visible column at all.
 */
export function AdvancedSort({ fields, value, onApply, triggerLabel = "Sort", className }: AdvancedSortProps) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<CriteriaSort[]>(value);

  React.useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  function updateRow(index: number, patch: Partial<CriteriaSort>) {
    setDraft((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function addRow() {
    const used = new Set(draft.map((row) => row.field));
    const next = fields.find((candidate) => !used.has(candidate.field)) ?? fields[0];
    if (!next) return;
    setDraft((prev) => [...prev, { field: next.field, direction: "asc" }]);
  }

  function removeRow(index: number) {
    setDraft((prev) => prev.filter((_, i) => i !== index));
  }

  function apply() {
    onApply(draft);
    setOpen(false);
  }

  return (
    <>
      <Button variant="outline" size="sm" className={cn("gap-1.5", className)} onClick={() => setOpen(true)}>
        {triggerLabel}
        {value.length > 0 ? (
          <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {value.length}
          </span>
        ) : null}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Sort by</DialogTitle>
            <DialogDescription>Sort by multiple fields, including ones not shown as table columns.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            {draft.length === 0 ? <p className="text-sm text-muted-foreground">No sort fields yet.</p> : null}
            {draft.map((row, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-5 shrink-0 text-sm text-muted-foreground">{index + 1}.</span>
                <Select
                  className="flex-1"
                  value={row.field}
                  onValueChange={(field) => updateRow(index, { field })}
                  options={fields.map((f) => ({ value: f.field, label: f.label }))}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-24 shrink-0 gap-1.5"
                  onClick={() => updateRow(index, { direction: row.direction === "asc" ? "desc" : "asc" })}
                >
                  {row.direction === "asc" ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
                  {row.direction === "asc" ? "Asc" : "Desc"}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => removeRow(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-fit gap-1.5"
              onClick={addRow}
              disabled={draft.length >= fields.length}
            >
              <Plus className="h-4 w-4" />
              Add sort
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={apply}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
