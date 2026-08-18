"use client";

import * as React from "react";
import { useTranslation } from "../../i18n";
import { cn } from "../../lib/cn";
import { EmptyState, ErrorState, LoadingState } from "../admin/states";
import { Badge } from "../ui/badge";
import { useAccessControlServices } from "./access-control-provider";
import { PermissionEntitlementIndicator } from "./permission-tree";
import { deriveUnavailablePermissionIds, resolvePermissionCatalog } from "./permission-utils";
import { useTenantEntitlement } from "./tenant-entitlement-provider";
import type { AccessControlSubjectType, EffectivePermission, PermissionDefinition } from "./types";

export interface EffectivePermissionsProps {
  /** The application's permission catalog — same one passed to `PermissionManagement`/etc. */
  permissions: PermissionDefinition[];
  subjectType: AccessControlSubjectType;
  subjectId: string;
  className?: string;
}

/**
 * Every permission a subject currently holds — direct grants plus everything inherited through
 * its assigned Roles — each tagged with the source(s) it comes from, so an administrator never
 * has to guess why a permission is present.
 *
 * Composed client-side from existing services: `assignments.getAssignedPermissions` (direct) +
 * `roleAssignments.getAssignedRoleIds` + one `assignments.getAssignedPermissions("role", ...)`
 * per assigned role (parallelized). This is **not a substitute for a real backend endpoint** —
 * it's an N+1 read (one round trip per role the subject holds) that's fine for a mocked/small-role
 * -count backend but should ideally be replaced by a single computed endpoint (e.g.
 * `GET /users/{id}/effective-permissions`) once a real backend exists, per
 * `docs/access-control.md`'s "Effective Permissions" section.
 */
export function EffectivePermissions({ permissions, subjectType, subjectId, className }: EffectivePermissionsProps) {
  const { t } = useTranslation();
  const services = useAccessControlServices();
  const entitlement = useTenantEntitlement();

  const [effective, setEffective] = React.useState<Map<string, EffectivePermission> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const groups = React.useMemo(() => resolvePermissionCatalog(permissions, t), [permissions, t]);
  const unavailableSet = React.useMemo(
    () => new Set(deriveUnavailablePermissionIds(permissions.map((p) => p.id), entitlement)),
    [permissions, entitlement],
  );

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const direct = await services.assignments.getAssignedPermissions(subjectType, subjectId);
      const map = new Map<string, EffectivePermission>();
      for (const id of direct.permissionIds) {
        map.set(id, { id, sources: [{ type: "direct" }] });
      }

      if (subjectType === "position" || subjectType === "user") {
        const roleIds = await services.roleAssignments.getAssignedRoleIds(subjectType, subjectId);
        const roleData = await Promise.all(
          roleIds.map(async (roleId) => {
            const [role, assignedPermissions] = await Promise.all([
              services.roles.getById(roleId),
              services.assignments.getAssignedPermissions("role", roleId),
            ]);
            return { roleId, roleName: role?.name ?? roleId, permissionIds: assignedPermissions.permissionIds };
          }),
        );
        for (const { roleId, roleName, permissionIds } of roleData) {
          for (const id of permissionIds) {
            const source = { type: "role" as const, roleId, roleName };
            const existing = map.get(id);
            if (existing) existing.sources.push(source);
            else map.set(id, { id, sources: [source] });
          }
        }
      }

      setEffective(map);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [services, subjectType, subjectId]);

  React.useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState description={error} onRetry={() => void load()} />;

  const assignedIds = new Set(effective?.keys() ?? []);
  const effectiveIds = new Set([...assignedIds].filter((id) => !unavailableSet.has(id)));
  const dormantIds = new Set([...assignedIds].filter((id) => unavailableSet.has(id)));

  function groupsFor(ids: Set<string>) {
    return groups
      .map((group) => ({ ...group, permissions: group.permissions.filter((permission) => ids.has(permission.id)) }))
      .filter((group) => group.permissions.length > 0);
  }

  const visibleGroups = groupsFor(effectiveIds);
  const dormantGroups = groupsFor(dormantIds);

  if (visibleGroups.length === 0 && dormantGroups.length === 0) {
    return <EmptyState description={t("userAuthorizationDetail.effectivePermissions.empty")} />;
  }

  function renderPermissionGroups(list: typeof visibleGroups) {
    return (
      <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
        {list.map((group) => (
          <div key={group.category} className="p-3">
            <h4 className="mb-2 text-sm font-medium">{group.categoryLabel}</h4>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {group.permissions.map((permission) => {
                const sources = effective?.get(permission.id)?.sources ?? [];
                return (
                  <div key={permission.id} data-permission-id={permission.id} className="rounded-md border border-border/60 p-2">
                    <p className="mb-1.5 flex items-center gap-1.5 text-sm">
                      {permission.displayName}
                      {dormantIds.has(permission.id) ? <PermissionEntitlementIndicator /> : null}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {sources.map((source, index) => (
                        <Badge key={`${source.type}-${source.roleId ?? index}`} variant={source.type === "direct" ? "secondary" : "outline"}>
                          {source.type === "direct"
                            ? t("userAuthorizationDetail.effectivePermissions.sourceDirect")
                            : t("userAuthorizationDetail.effectivePermissions.sourceRole", { name: source.roleName ?? "" })}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="text-sm text-muted-foreground">{t("userAuthorizationDetail.effectivePermissions.description")}</p>
      {visibleGroups.length > 0 ? (
        renderPermissionGroups(visibleGroups)
      ) : (
        <EmptyState description={t("userAuthorizationDetail.effectivePermissions.empty")} />
      )}
      {dormantGroups.length > 0 ? (
        <div className="flex flex-col gap-2">
          <div>
            <h3 className="text-sm font-medium">{t("userAuthorizationDetail.effectivePermissions.unavailableTitle")}</h3>
            <p className="text-sm text-muted-foreground">{t("userAuthorizationDetail.effectivePermissions.unavailableDescription")}</p>
          </div>
          {renderPermissionGroups(dormantGroups)}
        </div>
      ) : null}
    </div>
  );
}
