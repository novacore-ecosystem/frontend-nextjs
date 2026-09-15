"use client";

import {
  HttpError,
  RegistrationDefaultsEndpoints,
  translateError,
  type HttpClient,
  type RegistrationDefaults,
} from "@novacore/frontend-foundation";
import * as React from "react";
import { useTranslation } from "../../i18n";
import { cn } from "../../lib/cn";
import { PermissionTree } from "../access-control/permission-tree";
import { usePermissionCatalog } from "../access-control/use-permission-catalog";
import type { PermissionDefinition } from "../access-control/types";
import { EmptyState, ErrorState, LoadingState } from "../admin/states";
import { FormActions } from "../composed/form-field";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

export interface RegistrationDefaultsRoleOption {
  id: string;
  label: string;
}

export interface RegistrationDefaultsPanelProps {
  httpClient: HttpClient;
  /** The App this default configuration applies to — see `RegistrationDefaultsEndpoints`'s module doc comment (`@novacore/frontend-foundation`) for why Tenant is never a prop here (resolved from the caller's own auth context server-side). */
  appId: string;
  /** This host application's own permission catalog — same one passed to `PermissionAssignment`/`PermissionManagement`. */
  permissions: PermissionDefinition[];
  /** Host-supplied Role options, if this application has a Role domain — omit to hide the Roles section entirely (e.g. an application with no Role concept of its own). */
  roles?: RegistrationDefaultsRoleOption[];
  /** Locks every control and hides Save/Cancel — for a view-only audit surface. */
  readOnly?: boolean;
  onSaved?: (defaults: RegistrationDefaults) => void;
  className?: string;
}

/**
 * Manages the Default Role/Default Permission bundle automatically granted to every account
 * that self-registers into a given App — the tenant-host-facing counterpart to
 * `AuthEndpoints.register` (`@novacore/frontend-foundation`'s `src/registration-defaults`
 * module doc comment has the full backend contract). Follows `PermissionAssignment`'s own
 * shape (load/dirty-track/save/cancel around `PermissionTree`) since it's solving the same
 * "pick permissions, persist the set" problem — reuses `PermissionTree` directly rather than
 * reimplementing a second checkbox tree.
 *
 * Built directly on `RegistrationDefaultsEndpoints` (like `useAuth`/`useUserProfile`), not a
 * host-implemented service adapter — unlike Access Control's `PermissionAssignmentService`,
 * there is exactly one real backend shape for this, confirmed 2026-09-15.
 *
 * Deliberately **not** used by nova-console: Registration Defaults is a tenant/App-level
 * concept (customized by a tenant host for their own App), not a root-ecosystem concern — see
 * that application's own `.wolf/STATUS.md` for the explicit exclusion.
 */
export function RegistrationDefaultsPanel({
  httpClient,
  appId,
  permissions,
  roles,
  readOnly,
  onSaved,
  className,
}: RegistrationDefaultsPanelProps) {
  const { t, locale } = useTranslation();
  const { groups } = usePermissionCatalog(permissions);

  const [defaults, setDefaults] = React.useState<RegistrationDefaults | null>(null);
  const [permissionIds, setPermissionIds] = React.useState<string[]>([]);
  const [roleIds, setRoleIds] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await httpClient.execute(RegistrationDefaultsEndpoints.get, { appId });
      setDefaults(result);
      setPermissionIds(result.permissionKeys);
      setRoleIds(result.roleIds);
    } catch (err) {
      setError(translateError(toTranslatableError(err), { locale }));
    } finally {
      setLoading(false);
    }
  }, [httpClient, appId, locale]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const dirty = React.useMemo(() => {
    if (!defaults) return false;
    return !sameSet(defaults.permissionKeys, permissionIds) || !sameSet(defaults.roleIds, roleIds);
  }, [defaults, permissionIds, roleIds]);

  async function handleSave() {
    if (!defaults) return;
    setSaving(true);
    setSaveError(null);
    try {
      const tasks: Promise<void>[] = [];
      if (!sameSet(defaults.permissionKeys, permissionIds)) {
        tasks.push(httpClient.execute(RegistrationDefaultsEndpoints.replacePermissions, { appId, permissionKeys: permissionIds }));
      }
      if (roles && !sameSet(defaults.roleIds, roleIds)) {
        tasks.push(httpClient.execute(RegistrationDefaultsEndpoints.replaceRoles, { appId, roleIds }));
      }
      await Promise.all(tasks);

      const next: RegistrationDefaults = { permissionKeys: permissionIds, roleIds };
      setDefaults(next);
      onSaved?.(next);
    } catch (err) {
      setSaveError(translateError(toTranslatableError(err), { locale }));
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (!defaults) return;
    setPermissionIds(defaults.permissionKeys);
    setRoleIds(defaults.roleIds);
    setSaveError(null);
  }

  function toggleRole(id: string) {
    setRoleIds((current) => (current.includes(id) ? current.filter((existing) => existing !== id) : [...current, id]));
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState description={error} onRetry={() => void load()} />;
  if (groups.length === 0) return <EmptyState description={t("registrationDefaults.empty")} />;

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div>
        <h3 className="text-sm font-medium">{t("registrationDefaults.title")}</h3>
        <p className="text-sm text-muted-foreground">{t("registrationDefaults.description")}</p>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium">{t("registrationDefaults.permissionsTitle")}</h4>
        <PermissionTree groups={groups} selectedIds={permissionIds} onSelectedIdsChange={setPermissionIds} disabled={readOnly} />
      </div>

      {roles && roles.length > 0 ? (
        <div>
          <h4 className="mb-2 text-sm font-medium">{t("registrationDefaults.rolesTitle")}</h4>
          <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
            {roles.map((role) => (
              <label key={role.id} className="flex items-center gap-2 text-sm">
                <Checkbox checked={roleIds.includes(role.id)} onCheckedChange={() => toggleRole(role.id)} disabled={readOnly} />
                {role.label}
              </label>
            ))}
          </div>
        </div>
      ) : null}

      {saveError ? (
        <p role="alert" className="text-sm text-destructive">
          {saveError}
        </p>
      ) : null}

      {!readOnly ? (
        <FormActions className="justify-between">
          <p className="text-xs text-muted-foreground">{dirty ? t("registrationDefaults.unsavedChanges") : null}</p>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={!dirty || saving}>
              {t("registrationDefaults.cancel")}
            </Button>
            <Button type="button" onClick={() => void handleSave()} loading={saving} disabled={!dirty}>
              {t("registrationDefaults.save")}
            </Button>
          </div>
        </FormActions>
      ) : null}
    </div>
  );
}

function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const set = new Set(a);
  return b.every((value) => set.has(value));
}

/** Normalizes whatever `HttpClient.execute` throws into `translateError()`'s input shape. */
function toTranslatableError(err: unknown): { messageCode?: string | null; message?: string } {
  if (err instanceof HttpError) return { messageCode: err.code, message: err.message };
  if (err instanceof Error) return { message: err.message };
  return { message: String(err) };
}
