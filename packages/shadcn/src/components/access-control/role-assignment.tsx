"use client";

import * as React from "react";
import { useTranslation } from "../../i18n";
import { cn } from "../../lib/cn";
import { DataTable, type DataTableColumn } from "../admin/data-table";
import { EmptyState, ErrorState, LoadingState } from "../admin/states";
import { FormActions } from "../composed/form-field";
import { SearchInput } from "../composed/search-input";
import { Button } from "../ui/button";
import { useAccessControlServices } from "./access-control-provider";
import type { RoleAssignableSubjectType, RoleRecord } from "./types";

/** Role catalogs are typically small (unlike permissions) — one unpaginated fetch + client-side search, same mental model `PermissionTree` uses over an already-loaded catalog. */
const ROLE_FETCH_PAGE_SIZE = 200;

export interface RoleAssignmentProps {
  subjectType: RoleAssignableSubjectType;
  subjectId: string;
  /** Locks selection and hides Save/Cancel — for a view-only audit surface. */
  readOnly?: boolean;
  /** Called after a successful save with the newly assigned role ids. */
  onSaved?: (roleIds: string[]) => void;
  className?: string;
}

/**
 * The reusable role-assignment surface behind `PositionRoleAssignment`/`UserRoleAssignment` —
 * mirrors `PermissionAssignment`'s load/dirty-state/save/cancel shape, but for the Role[] side of
 * the authorization model (`Position`/`User` → `Role[]`, alongside their own direct permissions
 * via `PermissionAssignment`). Not `PermissionAssignment` itself: assigning roles and assigning
 * permissions are different operations against different services
 * (`RoleAssignmentService` vs. `PermissionAssignmentService`), even though the UX rhymes.
 */
export function RoleAssignment({ subjectType, subjectId, readOnly, onSaved, className }: RoleAssignmentProps) {
  const { t } = useTranslation();
  const services = useAccessControlServices();

  const [roles, setRoles] = React.useState<RoleRecord[]>([]);
  const [assignedIds, setAssignedIds] = React.useState<string[] | null>(null);
  const [draftIds, setDraftIds] = React.useState<string[]>([]);
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [roleList, assignedRoleIds] = await Promise.all([
        services.roles.getList({ pageSize: ROLE_FETCH_PAGE_SIZE }),
        services.roleAssignments.getAssignedRoleIds(subjectType, subjectId),
      ]);
      setRoles(roleList.items);
      setAssignedIds(assignedRoleIds);
      setDraftIds(assignedRoleIds);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [services, subjectType, subjectId]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const filteredRoles = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return roles;
    return roles.filter(
      (role) => role.name.toLowerCase().includes(needle) || (role.description?.toLowerCase().includes(needle) ?? false),
    );
  }, [roles, query]);

  const dirty = React.useMemo(() => {
    if (!assignedIds) return false;
    const before = new Set(assignedIds);
    const after = new Set(draftIds);
    if (before.size !== after.size) return true;
    for (const id of before) if (!after.has(id)) return true;
    return false;
  }, [assignedIds, draftIds]);

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await services.roleAssignments.assignRoles(subjectType, subjectId, draftIds);
      setAssignedIds(draftIds);
      onSaved?.(draftIds);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (assignedIds) setDraftIds(assignedIds);
    setSaveError(null);
  }

  /** Only rows currently visible (post-search) can toggle; ids hidden by the active search stay whatever they already were in the draft. */
  function handleSelectedRowIdsChange(ids: string[]) {
    const idSet = new Set(ids);
    const visibleIds = new Set(filteredRoles.map((role) => role.id));
    setDraftIds((prev) => {
      const kept = prev.filter((id) => !visibleIds.has(id) || idSet.has(id));
      const added = [...idSet].filter((id) => !kept.includes(id));
      return [...kept, ...added];
    });
  }

  const columns: DataTableColumn<RoleRecord>[] = [
    { id: "name", header: t("roleAssignment.columns.name") },
    { id: "description", header: t("roleAssignment.columns.description"), cell: (row) => row.description ?? "—" },
    {
      id: "permissionCount",
      header: t("roleAssignment.columns.permissionCount"),
      cell: (row) => row.permissionCount ?? "—",
      className: "w-1 text-right",
    },
  ];

  if (loading) return <LoadingState />;
  if (error) return <ErrorState description={error} onRetry={() => void load()} />;
  if (roles.length === 0) return <EmptyState description={t("roleAssignment.empty")} />;

  const subjectLabel = t(`assignment.subjectLabels.${subjectType}`);
  const selectedRowIds = filteredRoles.filter((role) => draftIds.includes(role.id)).map((role) => role.id);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div>
        <h3 className="text-sm font-medium">{t("roleAssignment.title")}</h3>
        <p className="text-sm text-muted-foreground">{t("roleAssignment.description", { subject: subjectLabel })}</p>
      </div>

      <div className="flex items-center gap-2">
        <SearchInput value={query} onValueChange={setQuery} placeholder={t("roleAssignment.searchPlaceholder")} className="flex-1" />
        <span className="whitespace-nowrap text-xs text-muted-foreground">
          {t("roleAssignment.selectedCount", { selected: draftIds.length, total: roles.length })}
        </span>
      </div>

      <DataTable
        data={filteredRoles}
        columns={columns}
        getRowId={(row) => row.id}
        emptyMessage={t("roleAssignment.empty")}
        selectable
        selectedRowIds={selectedRowIds}
        onSelectedRowIdsChange={readOnly ? undefined : handleSelectedRowIdsChange}
      />

      {saveError ? (
        <p role="alert" className="text-sm text-destructive">
          {saveError}
        </p>
      ) : null}

      {!readOnly ? (
        <FormActions className="justify-between">
          <p className="text-xs text-muted-foreground">{dirty ? t("roleAssignment.unsavedChanges") : null}</p>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={!dirty || saving}>
              {t("roleAssignment.cancel")}
            </Button>
            <Button type="button" onClick={() => void handleSave()} loading={saving} disabled={!dirty}>
              {t("roleAssignment.save")}
            </Button>
          </div>
        </FormActions>
      ) : null}
    </div>
  );
}
