"use client";

import { Plus } from "lucide-react";
import * as React from "react";
import { useTranslation } from "../../i18n";
import { DataTable, type DataTableColumn } from "../admin/data-table";
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
import { Tooltip } from "../ui/tooltip";
import { AccessControlPermissions } from "./access-control-permissions";
import { useAccessControlServices } from "./access-control-provider";
import { PositionHierarchy } from "./position-hierarchy";
import { PositionPermissionAssignment } from "./position-permission-assignment";
import { PositionRoleAssignment } from "./position-role-assignment";
import { PositionSelector } from "./position-selector";
import type { PermissionDefinition, PositionRecord, PositionTreeNode } from "./types";

export interface PositionManagementProps {
  /** The application's permission catalog — forwarded to the Permissions tab's `PositionPermissionAssignment`. */
  permissions: PermissionDefinition[];
  /** e.g. `<AdminBreadcrumb items={[...]} />` — routing/navigation stays the consuming app's responsibility. */
  breadcrumb?: React.ReactNode;
  /** Forces view-only: hides Create/Edit/Delete regardless of the current actor's permissions. */
  readOnly?: boolean;
  className?: string;
}

interface FlatPositionRow extends PositionTreeNode {
  depth: number;
}

function filterTree(nodes: PositionTreeNode[], query: string): PositionTreeNode[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return nodes;
  function walk(list: PositionTreeNode[]): PositionTreeNode[] {
    const result: PositionTreeNode[] = [];
    for (const node of list) {
      const children = walk(node.children);
      const selfMatches = node.name.toLowerCase().includes(needle) || (node.code?.toLowerCase().includes(needle) ?? false);
      if (selfMatches || children.length > 0) result.push({ ...node, children });
    }
    return result;
  }
  return walk(nodes);
}

function flattenForList(nodes: PositionTreeNode[], depth = 0): FlatPositionRow[] {
  return nodes.flatMap((node) => [{ ...node, depth }, ...flattenForList(node.children, depth + 1)]);
}

function findNode(nodes: PositionTreeNode[], id: string): PositionTreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = findNode(node.children, id);
    if (found) return found;
  }
  return null;
}

/** The complete Position Management page (section 8/9): tree + flat views, create/edit/delete, superior selection, and permission assignment. Position is organizational hierarchy, not a permission bundle — see `HowTo` at the bottom for the Role/Position distinction. */
export function PositionManagement({ permissions, breadcrumb, readOnly, className }: PositionManagementProps) {
  const { t } = useTranslation();
  const services = useAccessControlServices();
  const { can } = usePermission();
  const canManage = !readOnly && can(AccessControlPermissions.position.manage);

  const [view, setView] = React.useState<"tree" | "list">("tree");
  const [tree, setTree] = React.useState<PositionTreeNode[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");

  const [createParentId, setCreateParentId] = React.useState<string | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<PositionTreeNode | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const nodes = await services.positions.getTree();
      setTree(nodes);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [services]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const filteredTree = React.useMemo(() => filterTree(tree ?? [], query), [tree, query]);
  const nameById = React.useMemo(() => {
    const map = new Map<string, string>();
    function walk(nodes: PositionTreeNode[]) {
      for (const node of nodes) {
        map.set(node.id, node.name);
        walk(node.children);
      }
    }
    walk(tree ?? []);
    return map;
  }, [tree]);

  const editingNode = editingId ? findNode(tree ?? [], editingId) : null;

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await services.positions.delete(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : String(err));
    } finally {
      setDeleting(false);
    }
  }

  function openCreate(parentId: string | null) {
    setCreateParentId(parentId);
    setCreateOpen(true);
  }

  function renderActions(node: PositionTreeNode) {
    if (!canManage) return null;
    return (
      <>
        <Tooltip content={t("positions.addChild")}>
          <Button variant="ghost" size="icon" className="size-6" onClick={() => openCreate(node.id)}>
            <Plus className="size-3.5" />
          </Button>
        </Tooltip>
        <Button variant="ghost" size="sm" onClick={() => setEditingId(node.id)}>
          {t("common.actions.edit")}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => setDeleteTarget(node)}
        >
          {t("common.actions.delete")}
        </Button>
      </>
    );
  }

  const listRows = React.useMemo(() => flattenForList(filteredTree), [filteredTree]);
  const listColumns: DataTableColumn<FlatPositionRow>[] = [
    {
      id: "name",
      header: t("positions.columns.name"),
      cell: (row) => <span style={{ paddingLeft: `${row.depth * 16}px` }}>{row.name}</span>,
    },
    { id: "code", header: t("positions.columns.code"), cell: (row) => row.code ?? "—" },
    {
      id: "parent",
      header: t("positions.columns.parent"),
      cell: (row) => (row.parentId ? (nameById.get(row.parentId) ?? "—") : t("positions.fields.noParent")),
    },
  ];
  if (canManage) {
    listColumns.push({
      id: "actions",
      header: "",
      cell: (row) => <div className="flex justify-end gap-1">{renderActions(row)}</div>,
      className: "w-1",
    });
  }

  return (
    <AdminPage className={className}>
      <PageHeader
        title={t("positions.title")}
        description={t("positions.description")}
        breadcrumb={breadcrumb}
        actions={
          canManage ? (
            <PermissionButton permission={AccessControlPermissions.position.manage} onClick={() => openCreate(null)}>
              {t("positions.create.trigger")}
            </PermissionButton>
          ) : undefined
        }
      />
      <Toolbar>
        <SearchInput
          value={query}
          onValueChange={setQuery}
          placeholder={t("positions.searchPlaceholder")}
          className="max-w-sm"
        />
        <div className="ml-auto flex items-center gap-1 rounded-md border border-border p-0.5">
          <Button variant={view === "tree" ? "secondary" : "ghost"} size="sm" onClick={() => setView("tree")}>
            {t("positions.view.tree")}
          </Button>
          <Button variant={view === "list" ? "secondary" : "ghost"} size="sm" onClick={() => setView("list")}>
            {t("positions.view.list")}
          </Button>
        </div>
      </Toolbar>

      {view === "tree" ? (
        loading ? (
          <p className="p-6 text-center text-sm text-muted-foreground">{t("common.table.loading")}</p>
        ) : error ? (
          <p role="alert" className="p-6 text-center text-sm text-destructive">
            {error}
          </p>
        ) : filteredTree.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">{t("positions.empty")}</p>
        ) : (
          <div className="rounded-lg border border-border p-2">
            <PositionHierarchy nodes={filteredTree} renderActions={canManage ? renderActions : undefined} />
          </div>
        )
      ) : (
        <DataTable
          data={listRows}
          columns={listColumns}
          getRowId={(row) => row.id}
          loading={loading}
          error={error ?? undefined}
          onRetry={() => void load()}
          emptyMessage={t("positions.empty")}
        />
      )}

      <HowTo title={t("positions.howTo.title")}>
        <p>{t("positions.howTo.whatIs")}</p>
        <p>{t("positions.howTo.hierarchy")}</p>
        <p>{t("positions.howTo.vsRole")}</p>
      </HowTo>

      {createOpen ? (
        <PositionCreateDialog
          tree={tree ?? []}
          parentId={createParentId}
          onOpenChange={setCreateOpen}
          onCreated={(record) => {
            setCreateOpen(false);
            void load();
            setEditingId(record.id);
          }}
        />
      ) : null}

      {editingNode ? (
        <PositionEditSheet
          tree={tree ?? []}
          position={editingNode}
          permissions={permissions}
          canManage={canManage}
          onOpenChange={(open) => {
            if (!open) setEditingId(null);
          }}
          onUpdated={() => void load()}
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
        title={t("positions.delete.title")}
        description={
          deleteTarget && deleteTarget.children.length > 0
            ? t("positions.delete.blocked")
            : deleteTarget
              ? t("positions.delete.description", { name: deleteTarget.name })
              : undefined
        }
        confirmLabel={t("common.actions.delete")}
        loading={deleting}
        error={deleteError}
        onConfirm={() => {
          if (deleteTarget && deleteTarget.children.length > 0) return;
          void handleDelete();
        }}
      />
    </AdminPage>
  );
}

function PositionCreateDialog({
  tree,
  parentId,
  onOpenChange,
  onCreated,
}: {
  tree: PositionTreeNode[];
  parentId: string | null;
  onOpenChange: (open: boolean) => void;
  onCreated: (record: PositionRecord) => void;
}) {
  const { t } = useTranslation();
  const services = useAccessControlServices();
  const [name, setName] = React.useState("");
  const [code, setCode] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedParentId, setSelectedParentId] = React.useState<string | null>(parentId);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleCreate() {
    setSaving(true);
    setError(null);
    try {
      const record = await services.positions.create({
        name: name.trim(),
        code: code.trim() || undefined,
        description: description.trim() || undefined,
        parentId: selectedParentId,
      });
      onCreated(record);
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
          <DialogTitle>{t("positions.create.title")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <FormField label={t("positions.fields.name")} required htmlFor="position-create-name">
            <Input
              id="position-create-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t("positions.fields.namePlaceholder")}
            />
          </FormField>
          <FormField label={t("positions.fields.code")} htmlFor="position-create-code">
            <Input
              id="position-create-code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder={t("positions.fields.codePlaceholder")}
            />
          </FormField>
          <FormField label={t("positions.fields.parent")} htmlFor="position-create-parent">
            <PositionSelector id="position-create-parent" tree={tree} value={selectedParentId} onValueChange={setSelectedParentId} />
          </FormField>
          <FormField label={t("positions.fields.description")} htmlFor="position-create-description">
            <Textarea
              id="position-create-description"
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
          <Button onClick={() => void handleCreate()} loading={saving} disabled={!name.trim()}>
            {t("common.actions.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PositionEditSheet({
  tree,
  position,
  permissions,
  canManage,
  onOpenChange,
  onUpdated,
}: {
  tree: PositionTreeNode[];
  position: PositionTreeNode;
  permissions: PermissionDefinition[];
  canManage: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: (record: PositionRecord) => void;
}) {
  const { t } = useTranslation();
  const services = useAccessControlServices();
  const [name, setName] = React.useState(position.name);
  const [code, setCode] = React.useState(position.code ?? "");
  const [description, setDescription] = React.useState(position.description ?? "");
  const [parentId, setParentId] = React.useState<string | null>(position.parentId);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setName(position.name);
    setCode(position.code ?? "");
    setDescription(position.description ?? "");
    setParentId(position.parentId);
  }, [position.id, position.name, position.code, position.description, position.parentId]);

  const dirty =
    name.trim() !== position.name ||
    (code.trim() || undefined) !== position.code ||
    (description.trim() || undefined) !== position.description ||
    parentId !== position.parentId;

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const updated = await services.positions.update(position.id, {
        name: name.trim(),
        code: code.trim() || undefined,
        description: description.trim() || undefined,
        parentId,
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
      <SheetContent size="wide" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{position.name}</SheetTitle>
          <SheetDescription>{t("positions.edit.title")}</SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="details" className="flex flex-1 flex-col overflow-hidden px-4 pb-4">
          <TabsList>
            <TabsTrigger value="details">{t("positions.tabs.details")}</TabsTrigger>
            <TabsTrigger value="roles">{t("positions.tabs.roles")}</TabsTrigger>
            <TabsTrigger value="permissions">{t("positions.tabs.permissions")}</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="flex flex-1 flex-col gap-4 overflow-y-auto">
            <FormField label={t("positions.fields.name")} required htmlFor="position-edit-name">
              <Input id="position-edit-name" value={name} onChange={(event) => setName(event.target.value)} disabled={!canManage} />
            </FormField>
            <FormField label={t("positions.fields.code")} htmlFor="position-edit-code">
              <Input id="position-edit-code" value={code} onChange={(event) => setCode(event.target.value)} disabled={!canManage} />
            </FormField>
            <FormField label={t("positions.fields.parent")} htmlFor="position-edit-parent">
              <PositionSelector
                id="position-edit-parent"
                tree={tree}
                value={parentId}
                onValueChange={setParentId}
                excludeId={position.id}
                disabled={!canManage}
              />
            </FormField>
            <FormField label={t("positions.fields.description")} htmlFor="position-edit-description">
              <Textarea
                id="position-edit-description"
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
                    setName(position.name);
                    setCode(position.code ?? "");
                    setDescription(position.description ?? "");
                    setParentId(position.parentId);
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
          <TabsContent value="roles" className="flex-1 overflow-y-auto">
            <PositionRoleAssignment positionId={position.id} readOnly={!canManage} />
          </TabsContent>
          <TabsContent value="permissions" className="flex-1 overflow-y-auto">
            <PositionPermissionAssignment permissions={permissions} positionId={position.id} readOnly={!canManage} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
