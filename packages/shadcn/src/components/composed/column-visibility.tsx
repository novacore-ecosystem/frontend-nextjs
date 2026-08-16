"use client";

import { Columns3 } from "lucide-react";
import * as React from "react";
import { useTranslation } from "../../i18n";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Popover } from "../ui/popover";

export interface ColumnVisibilityColumn {
  id: string;
  label: string;
}

export interface ColumnVisibilityProps {
  columns: ColumnVisibilityColumn[];
  /** Controlled — ids currently hidden. */
  hidden: string[];
  onHiddenChange: (hidden: string[]) => void;
  /** Resets to the default (nothing hidden). */
  onClear: () => void;
  triggerLabel?: string;
  className?: string;
}

/**
 * Per-table column show/hide popover. Purely controlled/presentational — persistence is
 * layered on by the consumer (e.g. via `usePersistentState`), not baked in here, so this
 * stays reusable for a consumer that doesn't want persistence at all.
 */
export function ColumnVisibility({
  columns,
  hidden,
  onHiddenChange,
  onClear,
  triggerLabel,
  className,
}: ColumnVisibilityProps) {
  const { t } = useTranslation();
  function toggle(id: string, visible: boolean) {
    onHiddenChange(visible ? hidden.filter((hiddenId) => hiddenId !== id) : [...hidden, id]);
  }

  return (
    <Popover
      align="end"
      trigger={
        <Button variant="outline" size="sm" className={cn("gap-1.5", className)}>
          <Columns3 className="h-4 w-4" />
          {triggerLabel ?? t("columns.trigger")}
          {hidden.length > 0 ? (
            <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {hidden.length}
            </span>
          ) : null}
        </Button>
      }
    >
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">{t("columns.title")}</p>
        <div className="flex flex-col gap-2">
          {columns.map((column) => {
            const visible = !hidden.includes(column.id);
            const inputId = `column-visibility-${column.id}`;
            return (
              <label key={column.id} htmlFor={inputId} className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox id={inputId} checked={visible} onCheckedChange={(checked) => toggle(column.id, checked === true)} />
                {column.label}
              </label>
            );
          })}
        </div>
        <Button variant="ghost" size="sm" className="w-fit" onClick={onClear} disabled={hidden.length === 0}>
          {t("columns.clear")}
        </Button>
      </div>
    </Popover>
  );
}
