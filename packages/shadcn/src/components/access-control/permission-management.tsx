"use client";

import * as React from "react";
import { useTranslation } from "../../i18n";
import { HowTo } from "../admin/how-to";
import { AdminPage, PageHeader, Toolbar } from "../admin/page";
import { DataTable, type DataTableColumn } from "../admin/data-table";
import { SkeletonList } from "../admin/states";
import { SearchInput } from "../composed/search-input";
import { annotateEntitlement, matchesPermissionSearch, resolvePermissionCatalog } from "./permission-utils";
import { useTenantEntitlement } from "./tenant-entitlement-provider";
import type { PermissionDefinition, PermissionRecord } from "./types";

export interface PermissionManagementProps {
  /** The application's permission catalog (see `PermissionDefinition`) — the entire set of permissions this page browses. This module never fetches a server-side catalog and never edits a permission's display copy; both are the consuming application's configuration. */
  permissions: PermissionDefinition[];
  /** e.g. `<AdminBreadcrumb items={[...]} />` — routing/navigation stays the consuming app's responsibility. */
  breadcrumb?: React.ReactNode;
  className?: string;
}

/**
 * The complete Permission Management page: a searchable, grouped, read-only browse of the
 * application-supplied permission catalog. There is no create/edit/delete flow — permissions
 * are system-defined capabilities, not admin-editable business content (see
 * `docs/access-control.md`'s "Permission catalog" section). The raw permission identifier is
 * intentionally not shown as a column (kept as a `data-permission-id` attribute for devtools/
 * debugging only) — administrators see the localized name/description, not the wire format.
 * Status reflects the active `TenantEntitlementProvider`, if any (see `docs/access-control.md`'s
 * "Tenant entitlement" section) — every application-defined permission stays visible even when
 * the tenant's current plan doesn't include it, marked "Not available" rather than hidden.
 */
export function PermissionManagement({ permissions, breadcrumb, className }: PermissionManagementProps) {
  const { t } = useTranslation();
  const entitlement = useTenantEntitlement();

  const [query, setQuery] = React.useState("");

  const records = React.useMemo(() => {
    const resolved = resolvePermissionCatalog(permissions, t).flatMap((group) => group.permissions);
    return annotateEntitlement(resolved, entitlement);
  }, [permissions, t, entitlement]);

  const filtered = React.useMemo(
    () => records.filter((record) => matchesPermissionSearch(record, query)),
    [records, query],
  );

  const columns: DataTableColumn<PermissionRecord>[] = [
    {
      id: "permission",
      header: t("permissions.columns.permission"),
      cell: (row) => (
        <div data-permission-id={row.id}>
          <p className="font-medium">{row.displayName}</p>
          {row.description ? <p className="text-xs text-muted-foreground">{row.description}</p> : null}
        </div>
      ),
    },
    { id: "category", header: t("permissions.columns.category"), className: "capitalize" },
    {
      id: "status",
      header: t("permissions.columns.status"),
      cell: (row) => <PermissionStatusBadge entitled={row.entitled} />,
      className: "w-1 whitespace-nowrap",
    },
  ];

  return (
    <AdminPage className={className}>
      <PageHeader title={t("permissions.title")} description={t("permissions.description")} breadcrumb={breadcrumb} />
      <Toolbar>
        <SearchInput
          value={query}
          onValueChange={setQuery}
          placeholder={t("permissions.searchPlaceholder")}
          className="max-w-sm"
        />
      </Toolbar>
      {entitlement.status === "error" ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-muted-foreground"
        >
          {t("permissions.entitlementUnavailable")}
        </p>
      ) : null}
      {entitlement.status === "loading" ? (
        <SkeletonList rows={6} />
      ) : (
        <DataTable
          data={filtered}
          columns={columns}
          getRowId={(row) => row.id}
          emptyMessage={t("permissions.empty")}
        />
      )}
      <HowTo title={t("permissions.howTo.title")}>
        <p>{t("permissions.howTo.whatIs")}</p>
        <p>{t("permissions.howTo.naming")}</p>
        <p>{t("permissions.howTo.assignment")}</p>
      </HowTo>
    </AdminPage>
  );
}

function PermissionStatusBadge({ entitled }: { entitled?: boolean | "unknown" }) {
  const { t } = useTranslation();
  if (entitled === "unknown") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="size-1.5 rounded-full bg-muted-foreground/50" />
        {t("permissions.status.unknown")}
      </span>
    );
  }
  if (entitled === undefined) return null;
  return entitled ? (
    <span className="inline-flex items-center gap-1.5 text-xs text-foreground">
      <span className="size-1.5 rounded-full bg-emerald-500" />
      {t("permissions.status.active")}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className="size-1.5 rounded-full border border-muted-foreground/50" />
      {t("permissions.status.inactive")}
    </span>
  );
}
