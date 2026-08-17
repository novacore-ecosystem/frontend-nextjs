"use client";

import * as React from "react";
import { useTranslation } from "../../i18n";
import { cn } from "../../lib/cn";
import { EmptyState, ErrorState, LoadingState } from "../admin/states";
import { FormActions } from "../composed/form-field";
import { Button } from "../ui/button";
import { useAccessControlServices } from "./access-control-provider";
import { PermissionTree } from "./permission-tree";
import type { AccessControlSubjectType, AssignedPermissions, PermissionGroup } from "./types";

export interface PermissionAssignmentProps {
  subjectType: AccessControlSubjectType;
  subjectId: string;
  /** Locks every checkbox and hides Save/Cancel — for a view-only audit surface. */
  readOnly?: boolean;
  /** Called after a successful save with the newly assigned permission ids. */
  onSaved?: (permissionIds: string[]) => void;
  className?: string;
}

/**
 * The one reusable permission-assignment surface behind `RolePermissionAssignment`/
 * `PositionPermissionAssignment` (section 7) — owns permission loading, grouping (via
 * `PermissionService.getGroups()`), selection state, inherited/read-only overlays, dirty-state
 * tracking, and save/cancel. Not coupled to Role specifically: `subjectType`/`subjectId` is the
 * entire API surface.
 */
export function PermissionAssignment({ subjectType, subjectId, readOnly, onSaved, className }: PermissionAssignmentProps) {
  const { t } = useTranslation();
  const services = useAccessControlServices();

  const [groups, setGroups] = React.useState<PermissionGroup[] | null>(null);
  const [assigned, setAssigned] = React.useState<AssignedPermissions | null>(null);
  const [draftIds, setDraftIds] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [permissionGroups, assignedPermissions] = await Promise.all([
        services.permissions.getGroups(),
        services.assignments.getAssignedPermissions(subjectType, subjectId),
      ]);
      setGroups(permissionGroups);
      setAssigned(assignedPermissions);
      setDraftIds(assignedPermissions.permissionIds);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [services, subjectType, subjectId]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const dirty = React.useMemo(() => {
    if (!assigned) return false;
    const before = new Set(assigned.permissionIds);
    const after = new Set(draftIds);
    if (before.size !== after.size) return true;
    for (const id of before) if (!after.has(id)) return true;
    return false;
  }, [assigned, draftIds]);

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await services.assignments.assignPermissions(subjectType, subjectId, draftIds);
      setAssigned((prev) => (prev ? { ...prev, permissionIds: draftIds } : prev));
      onSaved?.(draftIds);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (assigned) setDraftIds(assigned.permissionIds);
    setSaveError(null);
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState description={error} onRetry={() => void load()} />;
  if (!groups || groups.length === 0) return <EmptyState description={t("assignment.empty")} />;

  const subjectLabel = t(`assignment.subjectLabels.${subjectType}`);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div>
        <h3 className="text-sm font-medium">{t("assignment.title")}</h3>
        <p className="text-sm text-muted-foreground">{t("assignment.description", { subject: subjectLabel })}</p>
      </div>

      <PermissionTree
        groups={groups}
        selectedIds={draftIds}
        onSelectedIdsChange={setDraftIds}
        inheritedIds={assigned?.inheritedPermissionIds}
        readOnlyIds={assigned?.readOnlyPermissionIds}
        disabled={readOnly}
      />

      {saveError ? (
        <p role="alert" className="text-sm text-destructive">
          {saveError}
        </p>
      ) : null}

      {!readOnly ? (
        <FormActions className="justify-between">
          <p className="text-xs text-muted-foreground">{dirty ? t("assignment.unsavedChanges") : null}</p>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={!dirty || saving}>
              {t("assignment.cancel")}
            </Button>
            <Button type="button" onClick={() => void handleSave()} loading={saving} disabled={!dirty}>
              {t("assignment.save")}
            </Button>
          </div>
        </FormActions>
      ) : null}
    </div>
  );
}
