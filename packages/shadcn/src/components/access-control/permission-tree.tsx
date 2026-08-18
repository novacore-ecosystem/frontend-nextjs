"use client";

import { Ban, Lock } from "lucide-react";
import * as React from "react";
import { useTranslation } from "../../i18n";
import { cn } from "../../lib/cn";
import { SearchInput } from "../composed/search-input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Tooltip } from "../ui/tooltip";
import type { PermissionGroup } from "./types";
import { matchesPermissionSearch } from "./permission-utils";

export interface PermissionTreeProps {
  groups: PermissionGroup[];
  /** Controlled — the permission ids explicitly selected by the current actor (excludes `inheritedIds`, which render checked independently). */
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
  /** Rendered checked and locked, with an "Inherited" indicator — e.g. granted via a superior position. */
  inheritedIds?: string[];
  /** Rendered locked (not toggleable) with a "Not grantable by you" indicator — e.g. the current actor doesn't hold the permission themselves. */
  readOnlyIds?: string[];
  /**
   * Catalog permission ids the tenant does NOT currently own (see `deriveUnavailablePermissionIds`).
   * Already-checked ids in this set stay checked and toggleable-off (existing assignments are
   * preserved, never auto-removed); unchecked ids in this set are locked so the UI can't create a
   * new assignment to something the tenant isn't entitled to. Distinct from `inheritedIds`/
   * `readOnlyIds`, which are actor-centric (why *you* can't toggle it), not tenant-centric.
   */
  unavailableIds?: string[];
  /** Read-only mode: every checkbox is locked and select-all/deselect-all are hidden. */
  disabled?: boolean;
  className?: string;
}

/**
 * Grouped, searchable permission checkbox tree — the shared selection primitive behind
 * `PermissionAssignment` (and therefore `RolePermissionAssignment`/`PositionPermissionAssignment`).
 * Owns its own search box and select-all/deselect-all; selection state itself stays fully
 * controlled by the caller so it can be composed with dirty-state tracking.
 */
export function PermissionTree({
  groups,
  selectedIds,
  onSelectedIdsChange,
  inheritedIds = [],
  readOnlyIds = [],
  unavailableIds = [],
  disabled,
  className,
}: PermissionTreeProps) {
  const { t } = useTranslation();
  const [query, setQuery] = React.useState("");

  const selectedSet = React.useMemo(() => new Set(selectedIds), [selectedIds]);
  const inheritedSet = React.useMemo(() => new Set(inheritedIds), [inheritedIds]);
  const readOnlySet = React.useMemo(() => new Set(readOnlyIds), [readOnlyIds]);
  const unavailableSet = React.useMemo(() => new Set(unavailableIds), [unavailableIds]);

  const filteredGroups = React.useMemo(() => {
    if (!query.trim()) return groups;
    return groups
      .map((group) => ({ ...group, permissions: group.permissions.filter((p) => matchesPermissionSearch(p, query)) }))
      .filter((group) => group.permissions.length > 0);
  }, [groups, query]);

  function isLocked(id: string) {
    return Boolean(disabled) || inheritedSet.has(id) || readOnlySet.has(id);
  }

  function isChecked(id: string) {
    return selectedSet.has(id) || inheritedSet.has(id);
  }

  /** Would adding `id` (it's currently unchecked) be creating a brand-new assignment to a permission the tenant doesn't own? Existing checked-but-unavailable ids are never blocked from being unchecked — only new checks of an unavailable id are rejected. */
  function blockedByEntitlement(id: string) {
    return unavailableSet.has(id) && !selectedSet.has(id);
  }

  function toggle(id: string) {
    if (isLocked(id) || blockedByEntitlement(id)) return;
    onSelectedIdsChange(selectedSet.has(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  }

  function toggleGroup(group: PermissionGroup) {
    if (disabled) return;
    const toggleableIds = group.permissions.map((p) => p.id).filter((id) => !isLocked(id));
    const allChecked = toggleableIds.length > 0 && toggleableIds.every((id) => selectedSet.has(id));
    if (allChecked) {
      onSelectedIdsChange(selectedIds.filter((id) => !toggleableIds.includes(id)));
    } else {
      const addableIds = toggleableIds.filter((id) => !blockedByEntitlement(id));
      onSelectedIdsChange([...new Set([...selectedIds, ...addableIds])]);
    }
  }

  function selectAll() {
    if (disabled) return;
    const allIds = groups
      .flatMap((g) => g.permissions.map((p) => p.id))
      .filter((id) => !isLocked(id) && !blockedByEntitlement(id));
    onSelectedIdsChange([...new Set([...selectedIds, ...allIds])]);
  }

  function deselectAll() {
    if (disabled) return;
    const lockedIds = new Set(groups.flatMap((g) => g.permissions.map((p) => p.id)).filter((id) => isLocked(id)));
    onSelectedIdsChange(selectedIds.filter((id) => lockedIds.has(id)));
  }

  const totalCount = React.useMemo(() => groups.reduce((sum, g) => sum + g.permissions.length, 0), [groups]);
  const totalCheckedCount = React.useMemo(
    () => groups.reduce((sum, g) => sum + g.permissions.filter((p) => isChecked(p.id)).length, 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groups, selectedSet, inheritedSet],
  );

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="sticky top-0 z-10 flex flex-col gap-2 bg-card pb-2 sm:flex-row sm:items-center">
        <SearchInput
          value={query}
          onValueChange={setQuery}
          placeholder={t("assignment.searchPlaceholder")}
          className="flex-1"
        />
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            {t("assignment.selectedCount", { selected: totalCheckedCount, total: totalCount })}
          </span>
          {!disabled ? (
            <>
              <Button type="button" variant="outline" size="sm" onClick={selectAll}>
                {t("assignment.selectAll")}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={deselectAll}>
                {t("assignment.deselectAll")}
              </Button>
            </>
          ) : null}
        </div>
      </div>

      {filteredGroups.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">{t("assignment.empty")}</p>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
          {filteredGroups.map((group) => {
            const groupIds = group.permissions.map((p) => p.id);
            const checkedCount = groupIds.filter((id) => isChecked(id)).length;
            const allChecked = checkedCount > 0 && checkedCount === groupIds.length;
            const someChecked = checkedCount > 0 && !allChecked;
            return (
              <Collapsible key={group.category} defaultOpen className="p-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={allChecked ? true : someChecked ? "indeterminate" : false}
                    onCheckedChange={() => toggleGroup(group)}
                    disabled={disabled}
                    aria-label={group.categoryLabel}
                  />
                  <CollapsibleTrigger className="flex flex-1 items-center justify-between gap-2 text-left text-sm font-medium hover:text-foreground">
                    <span>{group.categoryLabel}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {checkedCount}/{groupIds.length}
                    </span>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="mt-2 grid grid-cols-1 gap-1 pl-7 sm:grid-cols-2 xl:grid-cols-3">
                  {group.permissions.map((permission) => {
                    const locked = isLocked(permission.id);
                    const inherited = inheritedSet.has(permission.id);
                    const readOnly = !inherited && readOnlySet.has(permission.id);
                    const checked = isChecked(permission.id);
                    const showEntitlementIndicator = !inherited && !readOnly && unavailableSet.has(permission.id);
                    const interactive = !locked && !blockedByEntitlement(permission.id);
                    return (
                      <label
                        key={permission.id}
                        data-permission-id={permission.id}
                        className={cn(
                          "flex items-start gap-2 rounded-md px-2 py-1.5 text-sm",
                          interactive && "cursor-pointer hover:bg-accent/50",
                        )}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggle(permission.id)}
                          disabled={!interactive}
                          className="mt-0.5"
                        />
                        <span className="flex-1">
                          <span className="flex items-center gap-1.5">
                            {permission.displayName}
                            {inherited || readOnly ? (
                              <PermissionInheritanceIndicator kind={inherited ? "inherited" : "readOnly"} />
                            ) : showEntitlementIndicator ? (
                              <PermissionEntitlementIndicator />
                            ) : null}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function PermissionInheritanceIndicator({ kind }: { kind: "inherited" | "readOnly" }) {
  const { t } = useTranslation();
  const label = t(kind === "inherited" ? "assignment.inherited" : "assignment.readOnly");
  return (
    <Tooltip content={label}>
      <Lock className="size-3 shrink-0 text-muted-foreground" aria-label={label} />
    </Tooltip>
  );
}

/** Shown on a permission the tenant doesn't currently own — whether it's an existing assignment being preserved (checked) or blocked from a new assignment (unchecked). Distinct icon/color from `PermissionInheritanceIndicator` since this is tenant-centric, not actor-centric. */
export function PermissionEntitlementIndicator() {
  const { t } = useTranslation();
  const label = t("assignment.unavailable");
  return (
    <Tooltip content={label}>
      <Ban className="size-3 shrink-0 text-amber-600 dark:text-amber-500" aria-label={label} />
    </Tooltip>
  );
}
