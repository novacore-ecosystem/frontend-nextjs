"use client";

import * as React from "react";
import { useTranslation } from "../../i18n";
import { HowTo } from "../admin/how-to";
import { AdminPage, PageHeader, Toolbar } from "../admin/page";
import { DataTable, type DataTableColumn } from "../admin/data-table";
import { usePermission } from "../admin/use-permission";
import { FormField } from "../composed/form-field";
import { SearchInput } from "../composed/search-input";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { AccessControlPermissions } from "./access-control-permissions";
import { useAccessControlServices } from "./access-control-provider";
import { matchesPermissionSearch } from "./permission-utils";
import type { PermissionRecord } from "./types";

export interface PermissionManagementProps {
  /** e.g. `<AdminBreadcrumb items={[...]} />` — routing/navigation stays the consuming app's responsibility. */
  breadcrumb?: React.ReactNode;
  /** Hides the Edit action entirely (view-only catalog browse), regardless of the current actor's permissions. */
  readOnly?: boolean;
  className?: string;
}

/**
 * The complete Permission Management page (section 5.1): a searchable, grouped view of the
 * platform's permission catalog with per-locale display-copy editing. Deliberately has no
 * create/delete flow — see `PermissionService`'s doc comment in `types.ts` for why permissions
 * aren't a CRUD resource on the real NovaCore backend.
 */
export function PermissionManagement({ breadcrumb, readOnly, className }: PermissionManagementProps) {
  const { t } = useTranslation();
  const services = useAccessControlServices();
  const { can } = usePermission();

  const [records, setRecords] = React.useState<PermissionRecord[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [editing, setEditing] = React.useState<PermissionRecord | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const groups = await services.permissions.getGroups();
      setRecords(groups.flatMap((group) => group.permissions));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [services]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const filtered = React.useMemo(
    () => (records ?? []).filter((record) => matchesPermissionSearch(record, query)),
    [records, query],
  );

  const canManage = !readOnly && can(AccessControlPermissions.permission.manage);

  const columns: DataTableColumn<PermissionRecord>[] = [
    { id: "id", header: t("permissions.columns.identifier"), cell: (row) => <code className="text-xs">{row.id}</code> },
    { id: "category", header: t("permissions.columns.category"), className: "capitalize" },
    { id: "displayName", header: t("permissions.columns.name") },
    { id: "description", header: t("permissions.columns.description"), cell: (row) => row.description ?? "—" },
  ];
  if (canManage) {
    columns.push({
      id: "actions",
      header: "",
      cell: (row) => (
        <Button variant="ghost" size="sm" onClick={() => setEditing(row)}>
          {t("permissions.edit.trigger")}
        </Button>
      ),
      className: "w-1",
    });
  }

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
        loading={loading}
        error={error ?? undefined}
        onRetry={() => void load()}
        emptyMessage={t("permissions.empty")}
      />
      <HowTo title={t("permissions.howTo.title")}>
        <p>{t("permissions.howTo.whatIs")}</p>
        <p>{t("permissions.howTo.naming")}</p>
        <p>{t("permissions.howTo.assignment")}</p>
      </HowTo>
      {editing ? (
        <PermissionEditDialog
          permission={editing}
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
          onSaved={(updated) => {
            setRecords((prev) => prev?.map((record) => (record.id === updated.id ? updated : record)) ?? prev);
            setEditing(null);
          }}
        />
      ) : null}
    </AdminPage>
  );
}

function PermissionEditDialog({
  permission,
  onOpenChange,
  onSaved,
}: {
  permission: PermissionRecord;
  onOpenChange: (open: boolean) => void;
  onSaved: (updated: PermissionRecord) => void;
}) {
  const { t, locale } = useTranslation();
  const services = useAccessControlServices();
  const [displayName, setDisplayName] = React.useState(permission.displayName);
  const [description, setDescription] = React.useState(permission.description ?? "");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const updated = await services.permissions.updateTranslations(permission.id, [
        { locale, displayName: displayName.trim(), description: description.trim() || undefined },
      ]);
      onSaved(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("permissions.edit.title")}</DialogTitle>
          <DialogDescription>{t("permissions.edit.description")}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <FormField label={t("permissions.edit.nameLabel")} required htmlFor="permission-display-name">
            <Input id="permission-display-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
          </FormField>
          <FormField label={t("permissions.edit.descriptionLabel")} htmlFor="permission-description">
            <Textarea
              id="permission-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
            />
          </FormField>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            {t("common.actions.cancel")}
          </Button>
          <Button onClick={() => void handleSave()} loading={saving} disabled={!displayName.trim()}>
            {t("permissions.edit.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
