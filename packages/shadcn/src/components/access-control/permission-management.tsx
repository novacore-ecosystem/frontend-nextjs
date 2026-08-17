"use client";

import * as React from "react";
import { useTranslation } from "../../i18n";
import { HowTo } from "../admin/how-to";
import { AdminPage, PageHeader, Toolbar } from "../admin/page";
import { DataTable, type DataTableColumn } from "../admin/data-table";
import { SearchInput } from "../composed/search-input";
import { matchesPermissionSearch, resolvePermissionCatalog } from "./permission-utils";
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
 * `docs/access-control.md`'s "Permission catalog" section for the full rationale).
 */
export function PermissionManagement({ permissions, breadcrumb, className }: PermissionManagementProps) {
  const { t } = useTranslation();
  const [query, setQuery] = React.useState("");

  const records = React.useMemo(
    () => resolvePermissionCatalog(permissions, t).flatMap((group) => group.permissions),
    [permissions, t],
  );

  const filtered = React.useMemo(
    () => records.filter((record) => matchesPermissionSearch(record, query)),
    [records, query],
  );

  const columns: DataTableColumn<PermissionRecord>[] = [
    { id: "id", header: t("permissions.columns.identifier"), cell: (row) => <code className="text-xs">{row.id}</code> },
    { id: "category", header: t("permissions.columns.category"), className: "capitalize" },
    { id: "displayName", header: t("permissions.columns.name") },
    { id: "description", header: t("permissions.columns.description"), cell: (row) => row.description ?? "—" },
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
      <DataTable
        data={filtered}
        columns={columns}
        getRowId={(row) => row.id}
        emptyMessage={t("permissions.empty")}
      />
      <HowTo title={t("permissions.howTo.title")}>
        <p>{t("permissions.howTo.whatIs")}</p>
        <p>{t("permissions.howTo.naming")}</p>
        <p>{t("permissions.howTo.assignment")}</p>
      </HowTo>
    </AdminPage>
  );
}
