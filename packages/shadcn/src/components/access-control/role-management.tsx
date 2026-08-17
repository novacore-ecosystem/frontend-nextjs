"use client";

import * as React from "react";
import { useTranslation } from "../../i18n";
import { useDebouncedValue } from "../../hooks/use-debounced-value";
import { DataTable, fromPaginatedResult, type DataTableColumn } from "../admin/data-table";
import { HowTo } from "../admin/how-to";
import { AdminPage, PageHeader, Toolbar } from "../admin/page";
import { PermissionButton } from "../admin/permission-button";
import { usePermission } from "../admin/use-permission";
import { ConfirmDialog } from "../composed/confirm-dialog";
import { FormActions, FormField } from "../composed/form-field";
import { SearchInput } from "../composed/search-input";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { AccessControlPermissions } from "./access-control-permissions";
import { useAccessControlServices } from "./access-control-provider";
import { RolePermissionAssignment } from "./role-permission-assignment";
import type { RoleRecord } from "./types";

const PAGE_SIZE = 10;

export interface RoleManagementProps {
  /** e.g. `<AdminBreadcrumb items={[...]} />` — routing/navigation stays the consuming app's responsibility. */
  breadcrumb?: React.ReactNode;
  /** Forces view-only: hides Create/Edit/Delete regardless of the current actor's permissions. */
  readOnly?: boolean;
  className?: string;
}

/** The complete Role Management page (section 6): search, create, edit (details + permission assignment), delete. */
export function RoleManagement({ breadcrumb, readOnly, className }: RoleManagementProps) {
  const { t } = useTranslation();
  const services = useAccessControlServices();
  const { can } = usePermission();

  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [rows, setRows] = React.useState<RoleRecord[]>([]);
  const [totalRows, setTotalRows] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState<RoleRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<RoleRecord | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  const canManage = !readOnly && can(AccessControlPermissions.role.manage);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await services.roles.getList({
        keyword: debouncedQuery || undefined,
        page: pageNumber,
        pageSize: PAGE_SIZE,
      });
      const adapted = fromPaginatedResult(result);
      setRows(adapted.data);
      setTotalRows(adapted.pagination.totalRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [services, debouncedQuery, pageNumber]);

  React.useEffect(() => {
    void load();
  }, [load]);

  React.useEffect(() => {
    setPageNumber(1);
  }, [debouncedQuery]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await services.roles.delete(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : String(err));
    } finally {
      setDeleting(false);
    }
  }

  const columns: DataTableColumn<RoleRecord>[] = [
    { id: "name", header: t("roles.columns.name") },
    { id: "description", header: t("roles.columns.description"), cell: (row) => row.description ?? "—" },
    {
      id: "permissionCount",
      header: t("roles.columns.permissionCount"),
      cell: (row) => (row.permissionCount ?? "—"),
      className: "w-1 text-right",
    },
  ];
  if (canManage) {
    columns.push({
      id: "actions",
      header: "",
      cell: (row) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => setEditingRole(row)}>
            {t("common.actions.edit")}
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget(row)}>
            {t("common.actions.delete")}
          </Button>
        </div>
      ),
      className: "w-1",
    });
  }

  return (
    <AdminPage className={className}>
      <PageHeader
        title={t("roles.title")}
        description={t("roles.description")}
        breadcrumb={breadcrumb}
        actions={
          canManage ? (
            <PermissionButton permission={AccessControlPermissions.role.manage} onClick={() => setCreateOpen(true)}>
              {t("roles.create.trigger")}
            </PermissionButton>
          ) : undefined
        }
      />
      <Toolbar>
        <SearchInput value={query} onValueChange={setQuery} placeholder={t("roles.searchPlaceholder")} className="max-w-sm" />
      </Toolbar>
      <DataTable
        data={rows}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        error={error ?? undefined}
        onRetry={() => void load()}
        emptyMessage={t("roles.empty")}
        pagination={{ pageNumber, pageSize: PAGE_SIZE, totalRows }}
        onPaginationChange={(next) => setPageNumber(next.pageNumber)}
      />
      <HowTo title={t("roles.howTo.title")}>
        <p>{t("roles.howTo.whatIs")}</p>
        <p>{t("roles.howTo.permissionAssignment")}</p>
        <p>{t("roles.howTo.vsPosition")}</p>
      </HowTo>

      {canManage ? (
        <RoleCreateDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onCreated={(role) => {
            setCreateOpen(false);
            void load();
            setEditingRole(role);
          }}
        />
      ) : null}

      {editingRole ? (
        <RoleEditSheet
          role={editingRole}
          canManage={canManage}
          onOpenChange={(open) => {
            if (!open) setEditingRole(null);
          }}
          onUpdated={(updated) => {
            setEditingRole(updated);
            setRows((prev) => prev.map((row) => (row.id === updated.id ? updated : row)));
          }}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setDeleteError(null);
          }
        }}
        title={t("roles.delete.title")}
        description={deleteTarget ? t("roles.delete.description", { name: deleteTarget.name }) : undefined}
        loading={deleting}
        error={deleteError}
        onConfirm={() => void handleDelete()}
      />
    </AdminPage>
  );
}

function RoleCreateDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (role: RoleRecord) => void;
}) {
  const { t } = useTranslation();
  const services = useAccessControlServices();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
      setError(null);
    }
  }, [open]);

  async function handleCreate() {
    setSaving(true);
    setError(null);
    try {
      const role = await services.roles.create({ name: name.trim(), description: description.trim() || undefined });
      onCreated(role);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("roles.create.title")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <FormField label={t("roles.fields.name")} required htmlFor="role-create-name">
            <Input
              id="role-create-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t("roles.fields.namePlaceholder")}
            />
          </FormField>
          <FormField label={t("roles.fields.description")} htmlFor="role-create-description">
            <Textarea
              id="role-create-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={t("roles.fields.descriptionPlaceholder")}
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
          <Button onClick={() => void handleCreate()} loading={saving} disabled={!name.trim()}>
            {t("common.actions.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RoleEditSheet({
  role,
  canManage,
  onOpenChange,
  onUpdated,
}: {
  role: RoleRecord;
  canManage: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: (role: RoleRecord) => void;
}) {
  const { t } = useTranslation();
  const services = useAccessControlServices();
  const [name, setName] = React.useState(role.name);
  const [description, setDescription] = React.useState(role.description ?? "");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setName(role.name);
    setDescription(role.description ?? "");
  }, [role.id, role.name, role.description]);

  const dirty = name.trim() !== role.name || (description.trim() || undefined) !== role.description;

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const updated = await services.roles.update(role.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      onUpdated(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full max-w-md flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{role.name}</SheetTitle>
          <SheetDescription>{t("roles.edit.title")}</SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="details" className="flex flex-1 flex-col overflow-hidden px-4 pb-4">
          <TabsList>
            <TabsTrigger value="details">{t("roles.tabs.details")}</TabsTrigger>
            <TabsTrigger value="permissions">{t("roles.tabs.permissions")}</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="flex flex-1 flex-col gap-4 overflow-y-auto">
            <FormField label={t("roles.fields.name")} required htmlFor="role-edit-name">
              <Input id="role-edit-name" value={name} onChange={(event) => setName(event.target.value)} disabled={!canManage} />
            </FormField>
            <FormField label={t("roles.fields.description")} htmlFor="role-edit-description">
              <Textarea
                id="role-edit-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                disabled={!canManage}
              />
            </FormField>
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
            {canManage ? (
              <FormActions>
                <Button
                  variant="outline"
                  onClick={() => {
                    setName(role.name);
                    setDescription(role.description ?? "");
                  }}
                  disabled={!dirty || saving}
                >
                  {t("common.actions.cancel")}
                </Button>
                <Button onClick={() => void handleSave()} loading={saving} disabled={!dirty || !name.trim()}>
                  {t("common.actions.save")}
                </Button>
              </FormActions>
            ) : null}
          </TabsContent>
          <TabsContent value="permissions" className="flex-1 overflow-y-auto">
            <RolePermissionAssignment roleId={role.id} readOnly={!canManage} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
