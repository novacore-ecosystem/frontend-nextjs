"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CriteriaFilter, CriteriaFilterValue, CriteriaOperator } from "@novacore/frontend-foundation";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

export type FilterFieldType = "string" | "number" | "boolean" | "enum" | "date";

export interface FilterFieldConfig {
  field: string;
  label: string;
  type: FilterFieldType;
  /** Restricted to the operators that make sense for this field — the real backend `CriteriaOperator` wire codes, not an invented vocabulary. */
  operators: CriteriaOperator[];
  /** Required when `type: "enum"`. */
  options?: { value: string; label: string }[];
}

export interface AdvancedFilterProps {
  fields: FilterFieldConfig[];
  /** Controlled — the currently *applied* filters (drives the trigger's active count). */
  value: CriteriaFilter[];
  onApply: (filters: CriteriaFilter[]) => void;
  triggerLabel?: string;
  className?: string;
}

const OPERATOR_LABELS: Record<CriteriaOperator, string> = {
  eq: "equals",
  ne: "not equals",
  gt: "greater than",
  gte: "greater than or equal",
  lt: "less than",
  lte: "less than or equal",
  c: "contains",
  sw: "starts with",
  ew: "ends with",
  in: "in",
  nin: "not in",
  between: "between",
  null: "is empty",
  notnull: "is not empty",
};

function defaultFilterForField(config: FilterFieldConfig): CriteriaFilter {
  const operator = config.operators[0] ?? "eq";
  return { field: config.field, operator, value: config.type === "boolean" ? true : "" };
}

/**
 * Config-driven filter builder — produces real `CriteriaFilter[]` from
 * `@novacore/frontend-foundation`'s search contract (flat list, no AND/OR grouping: the
 * backend contract doesn't support it, so this doesn't invent one). Trigger shows the
 * active condition count; the dialog is a local draft that only commits on Apply.
 */
export function AdvancedFilter({ fields, value, onApply, triggerLabel = "Filter", className }: AdvancedFilterProps) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<CriteriaFilter[]>(value);

  React.useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  function updateRow(index: number, patch: Partial<CriteriaFilter>) {
    setDraft((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function addRow() {
    const firstField = fields[0];
    if (!firstField) return;
    setDraft((prev) => [...prev, defaultFilterForField(firstField)]);
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Advanced filters</DialogTitle>
            <DialogDescription>Combine conditions to narrow the results.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            {draft.length === 0 ? (
              <p className="text-sm text-muted-foreground">No conditions yet.</p>
            ) : null}
            {draft.map((row, index) => {
              const config = fields.find((candidate) => candidate.field === row.field) ?? fields[0];
              return (
                <div key={index} className="flex items-center gap-2">
                  <Select
                    className="w-40 shrink-0"
                    value={row.field}
                    onValueChange={(field) => {
                      const nextConfig = fields.find((candidate) => candidate.field === field);
                      if (nextConfig) updateRow(index, defaultFilterForField(nextConfig));
                    }}
                    options={fields.map((f) => ({ value: f.field, label: f.label }))}
                  />
                  <Select
                    className="w-44 shrink-0"
                    value={row.operator}
                    onValueChange={(operator) => updateRow(index, { operator: operator as CriteriaOperator })}
                    options={(config?.operators ?? []).map((op) => ({ value: op, label: OPERATOR_LABELS[op] }))}
                  />
                  <FilterValueEditor config={config} row={row} onChange={(nextValue) => updateRow(index, { value: nextValue })} />
                  <Button variant="ghost" size="icon" onClick={() => removeRow(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
            <Button variant="outline" size="sm" className="w-fit gap-1.5" onClick={addRow}>
              <Plus className="h-4 w-4" />
              Add condition
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

function FilterValueEditor({
  config,
  row,
  onChange,
}: {
  config?: FilterFieldConfig;
  row: CriteriaFilter;
  onChange: (value: CriteriaFilterValue) => void;
}) {
  if (row.operator === "null" || row.operator === "notnull") {
    return <div className="flex-1" />;
  }

  if (config?.type === "boolean") {
    return (
      <Select
        className="flex-1"
        value={String(row.value ?? true)}
        onValueChange={(next) => onChange(next === "true")}
        options={[
          { value: "true", label: "True" },
          { value: "false", label: "False" },
        ]}
      />
    );
  }

  if (config?.type === "enum" && config.options) {
    return <Select className="flex-1" value={String(row.value ?? "")} onValueChange={onChange} options={config.options} />;
  }

  return (
    <Input
      className="flex-1"
      type={config?.type === "number" ? "number" : config?.type === "date" ? "date" : "text"}
      value={String(row.value ?? "")}
      onChange={(event) => onChange(config?.type === "number" ? Number(event.target.value) : event.target.value)}
    />
  );
}
