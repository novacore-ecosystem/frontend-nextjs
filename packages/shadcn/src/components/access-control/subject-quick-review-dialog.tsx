"use client";

import { ChevronDown, KeyRound, Network, ShieldCheck, Users } from "lucide-react";
import * as React from "react";
import { useTranslation } from "../../i18n";
import { cn } from "../../lib/cn";
import { StatCard, StatCardRow } from "../admin/stat-card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useAccessControlService } from "./access-control-provider";
import { usePermissionCatalog } from "./use-permission-catalog";
import type { NormalizedPermissionCatalog } from "./permission-utils";
import type { PermissionDefinition, RoleRecord, SubjectOption } from "./types";

export interface SubjectQuickReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: SubjectOption;
  /** The application's permission catalog — same one passed to `UserPermissionAssignment` — used to resolve permission ids to display names/categories. */
  permissions: PermissionDefinition[];
  /**
   * Already-fetched role catalog, if the parent has one (e.g. `UserPermissionAssignment`'s own
   * `roles` state) — reused to resolve assigned role names without a redundant `roles.getList()`
   * call. When omitted, this dialog fetches its own copy once, on first open.
   */
  roles?: RoleRecord[];
  /** e.g. selects this subject in the parent (for editing) and closes this dialog. */
  onEditPermissions?: () => void;
}

/**
 * Read-only quick-review popup for one `SubjectOption`: profile header, stat tiles, then two
 * always visually-separate cards — "permissions from roles" (collapsed by default, each role's
 * specific permission set lazy-loaded only when that row is expanded) and "direct permissions"
 * (never merged with role-derived ones, per the reference design this was adapted from — see
 * `docs/access-control.md`/the task brief for the full rationale). Deliberately a `Dialog`, not a
 * `Popover` — the content (two data fetches, per-role expand/collapse) is too rich for a popover.
 */
export function SubjectQuickReviewDialog({
  open,
  onOpenChange,
  subject,
  permissions,
  roles: rolesProp,
  onEditPermissions,
}: SubjectQuickReviewDialogProps) {
  const { t } = useTranslation();
  const roleService = useAccessControlService("roles");
  const roleAssignments = useAccessControlService("roleAssignments");
  const assignments = useAccessControlService("assignments");
  const catalog = usePermissionCatalog(permissions);
  const { recordsById, groups } = catalog;

  const [ownRoles, setOwnRoles] = React.useState<RoleRecord[] | null>(null);
  const [assignedRoleIds, setAssignedRoleIds] = React.useState<string[] | null>(null);
  const [directPermissionIds, setDirectPermissionIds] = React.useState<string[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const roles = rolesProp ?? ownRoles ?? [];

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [roleIds, assigned, roleList] = await Promise.all([
        roleAssignments.getAssignedRoleIds("user", subject.id),
        assignments.getAssignedPermissions("user", subject.id),
        rolesProp ? Promise.resolve(null) : roleService.getList({ pageSize: 200 }),
      ]);
      setAssignedRoleIds(roleIds);
      setDirectPermissionIds(assigned.permissionIds);
      if (roleList) setOwnRoles(roleList.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [roleAssignments, assignments, roleService, rolesProp, subject.id]);

  React.useEffect(() => {
    if (!open) return;
    void load();
  }, [open, load]);

  const roleRows = React.useMemo(() => {
    if (!assignedRoleIds) return [];
    const byId = new Map(roles.map((role) => [role.id, role]));
    return assignedRoleIds.map((id) => byId.get(id) ?? { id, name: id });
  }, [assignedRoleIds, roles]);

  const categoryLabelByCategory = React.useMemo(() => new Map(groups.map((g) => [g.category, g.categoryLabel])), [groups]);

  const directGroups = React.useMemo(() => {
    if (!directPermissionIds) return [];
    const byCategory = new Map<string, { id: string; displayName: string }[]>();
    for (const id of directPermissionIds) {
      const record = recordsById.get(id);
      const category = record?.category ?? "";
      const item = { id, displayName: record?.displayName ?? id };
      const bucket = byCategory.get(category);
      if (bucket) bucket.push(item);
      else byCategory.set(category, [item]);
    }
    return [...byCategory.entries()].map(([category, items]) => ({
      category,
      categoryLabel: categoryLabelByCategory.get(category) ?? category,
      items,
    }));
  }, [directPermissionIds, recordsById, categoryLabelByCategory]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{subject.displayName}</DialogTitle>
          {subject.secondaryText ? <DialogDescription>{subject.secondaryText}</DialogDescription> : null}
        </DialogHeader>

        <StatCardRow>
          <StatCard
            label={t("quickReview.stats.roles")}
            value={assignedRoleIds ? assignedRoleIds.length : "—"}
            icon={<Users />}
          />
          <StatCard
            label={t("quickReview.stats.total")}
            value={subject.totalPermissionCount ?? "—"}
            icon={<ShieldCheck />}
          />
          <StatCard
            label={t("quickReview.stats.direct")}
            value={subject.directPermissionCount ?? "—"}
            icon={<KeyRound />}
          />
          <StatCard
            label={t("quickReview.stats.fromRoles")}
            value={subject.rolePermissionCount ?? "—"}
            icon={<Network />}
          />
        </StatCardRow>

        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{t("quickReview.loadingDetail")}</p>
        ) : error ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <p className="text-sm text-destructive">{t("quickReview.errorDetail")}</p>
            <Button variant="outline" size="sm" onClick={() => void load()}>
              {t("states.retry")}
            </Button>
          </div>
        ) : (
          <div className="flex max-h-[50vh] flex-col gap-4 overflow-y-auto">
            <section className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">{t("quickReview.rolePermissions.title")}</span>
                <Badge variant="secondary">{roleRows.length}</Badge>
              </div>
              <p className="mb-2 text-sm text-muted-foreground">{t("quickReview.rolePermissions.subtitle")}</p>
              {roleRows.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">{t("quickReview.rolePermissions.empty")}</p>
              ) : (
                <div className="flex flex-col">
                  {roleRows.map((role) => (
                    <RolePermissionsRow key={role.id} role={role} catalog={catalog} />
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">{t("quickReview.directPermissions.title")}</span>
                <Badge variant="secondary">{directPermissionIds?.length ?? 0}</Badge>
              </div>
              <p className="mb-2 text-sm text-muted-foreground">{t("quickReview.directPermissions.subtitle")}</p>
              {directGroups.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">{t("quickReview.directPermissions.empty")}</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {directGroups.map((group) => (
                    <div key={group.category}>
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {group.categoryLabel}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((item) => (
                          <Badge key={item.id} variant="outline">
                            {item.displayName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.actions.close")}
          </Button>
          {onEditPermissions ? (
            <Button
              onClick={() => {
                onEditPermissions();
                onOpenChange(false);
              }}
            >
              {t("quickReview.editPermissions")}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** One collapsed-by-default role row — expands to lazily fetch and show that specific role's permission set, resolved to display names via the shared catalog. */
function RolePermissionsRow({
  role,
  catalog,
}: {
  role: { id: string; name: string };
  catalog: NormalizedPermissionCatalog;
}) {
  const { t } = useTranslation();
  const assignments = useAccessControlService("assignments");
  const [state, setState] = React.useState<
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "ready"; items: { id: string; displayName: string }[] }
  >({ status: "idle" });

  async function handleOpenChange(isOpen: boolean) {
    if (!isOpen || state.status !== "idle") return;
    setState({ status: "loading" });
    try {
      const result = await assignments.getAssignedPermissions("role", role.id);
      const items = result.permissionIds.map((id) => ({ id, displayName: catalog.recordsById.get(id)?.displayName ?? id }));
      setState({ status: "ready", items });
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : String(err) });
    }
  }

  const permissionCount = "permissionCount" in role ? (role as RoleRecord).permissionCount : undefined;

  return (
    <Collapsible onOpenChange={(isOpen) => void handleOpenChange(isOpen)} className="border-b border-border py-2 last:border-b-0">
      <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 text-left text-sm hover:text-foreground">
        <span className="flex items-center gap-2 font-medium">
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
          {role.name}
        </span>
        {permissionCount != null ? <span className="text-xs text-muted-foreground">{permissionCount}</span> : null}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 pl-6">
        {state.status === "loading" ? (
          <p className="text-xs text-muted-foreground">{t("quickReview.rolePermissions.loading")}</p>
        ) : state.status === "error" ? (
          <p className="text-xs text-destructive">{state.message}</p>
        ) : state.status === "ready" && state.items.length === 0 ? (
          <p className="text-xs text-muted-foreground">{t("quickReview.rolePermissions.roleEmpty")}</p>
        ) : state.status === "ready" ? (
          <div className={cn("flex flex-wrap gap-1.5")}>
            {state.items.map((item) => (
              <Badge key={item.id} variant="secondary">
                {item.displayName}
              </Badge>
            ))}
          </div>
        ) : null}
      </CollapsibleContent>
    </Collapsible>
  );
}
