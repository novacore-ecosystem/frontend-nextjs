"use client";

import * as React from "react";
import { useTranslation } from "../../i18n";
import { Select } from "../ui/select";
import { collectDescendantIds, findPositionNode, flattenPositionTree } from "./position-hierarchy";
import type { PositionTreeNode } from "./types";

export interface PositionSelectorProps {
  tree: PositionTreeNode[];
  value: string | null;
  onValueChange: (value: string | null) => void;
  /** Excludes this position and its entire subtree from the option list — pass the position being edited so it can't become its own (in)direct superior. */
  excludeId?: string;
  disabled?: boolean;
  className?: string;
  /** Pairs with a `FormField`'s `htmlFor` for a properly associated label. */
  id?: string;
}

const NO_PARENT_VALUE = "__none__";

/** Indented single-select for choosing a superior position — the shared cycle-safe parent picker behind both Create and Edit Position (section 8). */
export function PositionSelector({ tree, value, onValueChange, excludeId, disabled, className, id }: PositionSelectorProps) {
  const { t } = useTranslation();

  const excludedIds = React.useMemo(() => {
    if (!excludeId) return new Set<string>();
    const node = findPositionNode(tree, excludeId);
    return node ? collectDescendantIds(node) : new Set([excludeId]);
  }, [tree, excludeId]);

  const options = React.useMemo(() => {
    const flat = flattenPositionTree(tree).filter((entry) => !excludedIds.has(entry.id));
    return [
      { value: NO_PARENT_VALUE, label: t("positions.fields.noParent") },
      ...flat.map((entry) => ({
        value: entry.id,
        label: `${"—".repeat(entry.depth)}${entry.depth > 0 ? " " : ""}${entry.name}`,
      })),
    ];
  }, [tree, excludedIds, t]);

  return (
    <Select
      id={id}
      className={className}
      options={options}
      value={value ?? NO_PARENT_VALUE}
      onValueChange={(next) => onValueChange(next === NO_PARENT_VALUE ? null : next)}
      placeholder={t("positions.fields.parentPlaceholder")}
      disabled={disabled}
    />
  );
}
