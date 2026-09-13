"use client";

import { ArrowLeft, Eye, Minus, Plus } from "lucide-react";
import * as React from "react";
import { useTranslation } from "../../i18n";
import { cn } from "../../lib/cn";
import { RelativeTime } from "../admin/relative-time";
import { Button } from "../ui/button";
import { useAccessControlServices } from "./access-control-provider";
import type { AccessControlSubjectType, AuditLogChangeDetail, AuditLogChangeItem, AuditLogEntry } from "./types";

const PAGE_SIZE = 10;

export interface PermissionAuditHistoryProps {
  subjectType: AccessControlSubjectType;
  subjectId: string;
  className?: string;
}

/**
 * Change history for one subject's roles/direct permissions — a list of changes (count-only,
 * cheap to fetch) that drills into a detail view (fetched lazily, only for the row actually
 * opened) showing exactly what was granted/revoked. Renders nothing (not an error, not an empty
 * state) when the host application hasn't wired up `AccessControlServices.auditLogs` — that
 * service is optional by design (see its own doc comment), and this component is meant to be
 * mounted unconditionally by a caller that doesn't want to duplicate the "do we have this
 * service" check itself.
 */
export function PermissionAuditHistory({ subjectType, subjectId, className }: PermissionAuditHistoryProps) {
  const { t } = useTranslation();
  const { auditLogs } = useAccessControlServices();

  const [pageNumber, setPageNumber] = React.useState(1);
  const [entries, setEntries] = React.useState<AuditLogEntry[]>([]);
  const [totalRows, setTotalRows] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [openEntryId, setOpenEntryId] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    if (!auditLogs) return;
    setLoading(true);
    setError(null);
    try {
      const result = await auditLogs.list(subjectType, subjectId, { page: pageNumber, pageSize: PAGE_SIZE });
      setEntries(result.items);
      setTotalRows(result.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [auditLogs, subjectType, subjectId, pageNumber]);

  React.useEffect(() => {
    void load();
  }, [load]);

  if (!auditLogs) return null;

  const openEntry = entries.find((entry) => entry.id === openEntryId) ?? null;

  if (openEntry) {
    return (
      <AuditLogChangeDetailView
        subjectType={subjectType}
        subjectId={subjectId}
        entry={openEntry}
        onBack={() => setOpenEntryId(null)}
        className={className}
      />
    );
  }

  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));

  return (
    <div className={className}>
      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">{t("auditLog.loading")}</p>
      ) : error ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={() => void load()}>
            {t("states.retry")}
          </Button>
        </div>
      ) : entries.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">{t("auditLog.empty")}</p>
      ) : (
        <>
          <div className="overflow-hidden rounded-md border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">{t("auditLog.columns.time")}</th>
                  <th className="px-3 py-2">{t("auditLog.columns.actor")}</th>
                  <th className="px-3 py-2">{t("auditLog.columns.permissionChanges")}</th>
                  <th className="px-3 py-2">{t("auditLog.columns.roleChanges")}</th>
                  <th className="w-1 px-3 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="whitespace-nowrap px-3 py-2">
                      <RelativeTime date={entry.changeTime} />
                    </td>
                    <td className="px-3 py-2">{entry.actorName ?? t("auditLog.systemActor")}</td>
                    <td className="px-3 py-2">
                      <ChangeCountChips granted={entry.permissionGrantedCount} revoked={entry.permissionRevokedCount} />
                    </td>
                    <td className="px-3 py-2">
                      <ChangeCountChips granted={entry.roleGrantedCount} revoked={entry.roleRevokedCount} />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button variant="ghost" size="sm" onClick={() => setOpenEntryId(entry.id)} aria-label={t("auditLog.viewDetail")}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 ? (
            <div className="mt-3 flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" disabled={pageNumber <= 1} onClick={() => setPageNumber((p) => p - 1)}>
                {t("common.pagination.previous")}
              </Button>
              <span className="text-sm text-muted-foreground">{t("auditLog.pageOf", { page: pageNumber, total: totalPages })}</span>
              <Button variant="outline" size="sm" disabled={pageNumber >= totalPages} onClick={() => setPageNumber((p) => p + 1)}>
                {t("common.pagination.next")}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function ChangeCountChips({ granted, revoked }: { granted: number; revoked: number }) {
  if (granted === 0 && revoked === 0) return <span className="text-muted-foreground">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      <span
        className={cn(
          "inline-flex items-center gap-0.5 rounded-full border border-success/30 bg-success/10 px-1.5 py-0.5 text-xs font-medium text-success",
          granted === 0 && "opacity-40",
        )}
      >
        <Plus className="h-3 w-3" />
        {granted}
      </span>
      <span
        className={cn(
          "inline-flex items-center gap-0.5 rounded-full border border-destructive/30 bg-destructive/10 px-1.5 py-0.5 text-xs font-medium text-destructive",
          revoked === 0 && "opacity-40",
        )}
      >
        <Minus className="h-3 w-3" />
        {revoked}
      </span>
    </div>
  );
}

function AuditLogChangeDetailView({
  subjectType,
  subjectId,
  entry,
  onBack,
  className,
}: {
  subjectType: AccessControlSubjectType;
  subjectId: string;
  entry: AuditLogEntry;
  onBack: () => void;
  className?: string;
}) {
  const { t } = useTranslation();
  const { auditLogs } = useAccessControlServices();
  const [detail, setDetail] = React.useState<AuditLogChangeDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!auditLogs) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    auditLogs
      .getDetail(subjectType, subjectId, entry.id)
      .then((result) => {
        if (!cancelled) setDetail(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [auditLogs, subjectType, subjectId, entry.id]);

  return (
    <div className={className}>
      <Button variant="ghost" size="sm" className="mb-3 -ml-2" onClick={onBack}>
        <ArrowLeft className="mr-1 h-4 w-4" />
        {t("auditLog.backToList")}
      </Button>

      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">{t("auditLog.loading")}</p>
      ) : error ? (
        <p className="py-8 text-center text-sm text-destructive">{error}</p>
      ) : !detail || (detail.grantedRoles.length === 0 && detail.revokedRoles.length === 0 && detail.grantedPermissions.length === 0 && detail.revokedPermissions.length === 0) ? (
        <p className="py-8 text-center text-sm text-muted-foreground">{t("auditLog.noChangeData")}</p>
      ) : (
        <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
          {detail.grantedRoles.length > 0 || detail.revokedRoles.length > 0 ? (
            <AuditGrantGroupCard
              title={t("auditLog.groups.roles")}
              description={t("auditLog.groups.rolesDescription")}
              granted={detail.grantedRoles}
              revoked={detail.revokedRoles}
            />
          ) : null}
          {detail.grantedPermissions.length > 0 || detail.revokedPermissions.length > 0 ? (
            <AuditGrantGroupCard
              title={t("auditLog.groups.permissions")}
              description={t("auditLog.groups.permissionsDescription")}
              granted={detail.grantedPermissions}
              revoked={detail.revokedPermissions}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

function AuditGrantGroupCard({
  title,
  description,
  granted,
  revoked,
}: {
  title: string;
  description: string;
  granted: AuditLogChangeItem[];
  revoked: AuditLogChangeItem[];
}) {
  const { t } = useTranslation();
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center gap-2">
        <span className="font-medium">{title}</span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{granted.length + revoked.length}</span>
      </div>
      <p className="mb-3 text-sm text-muted-foreground">{description}</p>

      {granted.length > 0 ? (
        <div className="mb-3">
          <div className="mb-1.5 flex items-center gap-1 text-xs font-medium text-success">
            <Plus className="h-3.5 w-3.5" />
            <span>{t("auditLog.granted", { count: granted.length })}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {granted.map((item) => (
              <span key={item.id} title={item.displayName} className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-xs text-success">
                {item.displayName}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {revoked.length > 0 ? (
        <div>
          <div className="mb-1.5 flex items-center gap-1 text-xs font-medium text-destructive">
            <Minus className="h-3.5 w-3.5" />
            <span>{t("auditLog.revoked", { count: revoked.length })}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {revoked.map((item) => (
              <span key={item.id} title={item.displayName} className="rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                {item.displayName}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
