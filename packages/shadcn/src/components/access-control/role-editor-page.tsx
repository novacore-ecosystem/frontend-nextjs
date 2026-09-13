"use client";

import { History } from "lucide-react";
import * as React from "react";
import { useTranslation } from "../../i18n";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { FormField } from "../composed/form-field";
import { AdminPage } from "../admin/page";
import { ErrorState, LoadingState } from "../admin/states";
import { useAccessControlService, useAccessControlServices } from "./access-control-provider";
import { PermissionAuditDialog } from "./permission-audit-dialog";
import { RolePermissionAssignment } from "./role-permission-assignment";
import type { PermissionDefinition, RoleRecord } from "./types";

export interface RoleEditorPageProps {
  /** undefined = create mode. */
  roleId?: string;
  permissions: PermissionDefinition[];
  onBack: () => void;
  /** Called after a successful create OR update, with the resulting RoleRecord. The app decides what to do next (e.g. navigate to the edit route for a newly-created role so permission editing continues there). */
  onSaved?: (role: RoleRecord) => void;
  readOnly?: boolean;
  className?: string;
}

/**
 * A dedicated Role Editor page — replaces the previous Sheet+Tabs edit flow. Handles both create
 * and edit in one component: create mode has no role id yet (`RoleInput` doesn't accept initial
 * permissions), so the permission picker only appears once an id exists — either because we're
 * editing an existing role, or because a create-mode Save just produced one and the app re-rendered
 * this component with `roleId` set (see `onSaved`).
 */
export function RoleEditorPage({ roleId, permissions, onBack, onSaved, readOnly, className }: RoleEditorPageProps) {
  const { t } = useTranslation();
  const roles = useAccessControlService("roles");
  const { auditLogs } = useAccessControlServices();
  const isCreate = !roleId;

  const [role, setRole] = React.useState<RoleRecord | null>(null);
  const [loading, setLoading] = React.useState(!isCreate);
  const [notFound, setNotFound] = React.useState(false);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [auditOpen, setAuditOpen] = React.useState(false);

  const load = React.useCallback(async () => {
    if (!roleId) return;
    setLoading(true);
    setLoadError(null);
    setNotFound(false);
    try {
      const result = await roles.getById(roleId);
      if (!result) {
        setNotFound(true);
        return;
      }
      setRole(result);
      setName(result.name);
      setDescription(result.description ?? "");
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [roles, roleId]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const canManage = !readOnly;

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      if (isCreate) {
        const created = await roles.create({ name: name.trim(), description: description.trim() || undefined });
        onSaved?.(created);
      } else if (roleId) {
        const updated = await roles.update(roleId, { name: name.trim(), description: description.trim() || undefined });
        setRole(updated);
        onSaved?.(updated);
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  if (!isCreate && loading) return <LoadingState />;
  if (!isCreate && loadError) return <ErrorState description={loadError} onRetry={() => void load()} />;
  if (!isCreate && notFound) {
    return (
      <AdminPage className={className}>
        <ErrorState title={t("roleEditor.notFound")} />
        <div>
          <Button variant="outline" onClick={onBack}>
            {t("roleEditor.back")}
          </Button>
        </div>
      </AdminPage>
    );
  }

  const showAuditButton = Boolean(auditLogs) && !isCreate && Boolean(roleId);
  const showPermissionsSection = Boolean(roleId);

  return (
    <AdminPage className={className}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" onClick={onBack}>
          {t("roleEditor.back")}
        </Button>
        <div className="flex items-center gap-2">
          {showAuditButton ? (
            <Button variant="outline" onClick={() => setAuditOpen(true)}>
              <History className="h-4 w-4" />
              {t("auditLog.trigger")}
            </Button>
          ) : null}
          {canManage ? (
            <Button onClick={() => void handleSave()} loading={saving} disabled={!name.trim()}>
              {t("roleEditor.save")}
            </Button>
          ) : null}
        </div>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight">{isCreate ? t("roleEditor.createTitle") : role?.name ?? t("roleEditor.editTitle")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{isCreate ? t("roleEditor.createTitle") : t("roleEditor.editTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FormField label={t("roleEditor.fields.name")} required htmlFor="role-editor-name">
            <Input
              id="role-editor-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t("roleEditor.fields.namePlaceholder")}
              disabled={!canManage}
            />
          </FormField>
          <FormField label={t("roleEditor.fields.description")} htmlFor="role-editor-description">
            <Textarea
              id="role-editor-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={t("roleEditor.fields.descriptionPlaceholder")}
              rows={3}
              disabled={!canManage}
            />
          </FormField>
          {saveError ? (
            <p role="alert" className="text-sm text-destructive">
              {saveError}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("roleEditor.permissionsSectionTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {showPermissionsSection && roleId ? (
            <RolePermissionAssignment roleId={roleId} permissions={permissions} readOnly={!canManage} />
          ) : (
            <p className="text-sm text-muted-foreground">{t("roleEditor.permissionsCreateHint")}</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        {canManage ? (
          <Button onClick={() => void handleSave()} loading={saving} disabled={!name.trim()}>
            {t("roleEditor.save")}
          </Button>
        ) : null}
      </div>

      {showAuditButton && roleId ? (
        <PermissionAuditDialog
          open={auditOpen}
          onOpenChange={setAuditOpen}
          subjectType="role"
          subjectId={roleId}
          subjectLabel={role?.name}
        />
      ) : null}
    </AdminPage>
  );
}
